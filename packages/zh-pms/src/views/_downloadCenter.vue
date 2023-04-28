<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" show-order>
      <template slot="header">
        <el-form
          ref="formRef"
          :model="form"
          size="mini"
          label-width="70px"
          class="search-form"
          @submit.native.prevent="search"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="创建时间"
                prop="datetime"
              >
                <el-date-picker
                  v-model="form.datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:100%;"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="处理人"
                prop="handlerIdList"
              >
                <v-organization ref="organizationRef" v-model="form.handlerIdList" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="操作类型"
                prop="operationType"
              >
                <el-select
                  v-model="form.operationType"
                  clearable
                  style="width:100%;"
                >
                  <el-option value="" label="全部" />
                  <el-option v-for="item in operationTypeList"
                             :key="item.value"
                             :value="+item.value"
                             :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item style="text-align:left;" label="模块" prop="module">
                <el-select
                  v-model="form.module"
                  clearable
                  style="width:100%;"
                >
                  <el-option value="" label="全部" />
                  <el-option v-for="item in moduleList"
                             :key="item.value"
                             :value="item.value"
                             :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="状态"
                prop="processingStatus"
              >
                <el-select
                  v-model="form.processingStatus"
                  clearable
                  style="width:100%;"
                >
                  <el-option value="" label="全部" />
                  <el-option v-for="item in processingStatusList"
                             :key="item.value"
                             :value="+item.value"
                             :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-button type="primary" native-type="submit">搜索</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <g-auth slot="handler" code="role_dl">
        <el-table-column label="操作" width="60">
          <template #default="{row}">
            <a v-if="row.linkFileResult" class="download-style" :href="row.linkFileResult" :download="row.fileName">下载</a>
            <el-button v-else size="mini" disabled type="text">下载</el-button>
          </template>
        </el-table-column>
      </g-auth>
    </g-table>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryData } from '@/api/downloadCenter'
import VOrganization from '@/components/organization/index.vue'
import { getDicts } from '@/api/common/dict'

export default {
  name: 'PmsPurchasingIssues',
  components: { VOrganization },
  props: {},
  data() {
    return {
      form: {
        handAndTakeOverIdList: [],
        datetime: [],
        handlerIdList: {},
        operationType: '',
        module: '',
        processingStatus: ''
      },
      operationTypeList: [],
      moduleList: [],
      processingStatusList: [],
      managerList: [],
      headers: [
        {
          label: '模块',
          prop: 'module',
          formatter: this.formatterDict
        },
        {
          label: '文件名称',
          prop: 'fileName'
        },
        {
          label: '操作类型',
          prop: 'operationType',
          width: 80,
          formatter: this.formatterDict
        },
        {
          label: '处理人',
          prop: 'createUserName'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 130
        },
        {
          label: '状态',
          prop: 'processingStatus',
          width: 100,
          formatter: this.formatterDict
        },
        {
          label: '结果',
          prop: 'processingResult'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getAllDictionary()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    getAllDictionary() {
      getDicts(['download_operation_type', 'download_module', 'module_processing_status'], 'pms').then(mapping => {
        this.operationTypeList = mapping.download_operation_type
        this.moduleList = mapping.download_module
        this.processingStatusList = mapping.module_processing_status
      })
    },
    formatterDict(row, column, cellValue) {
      const list = this[`${column.property}List`]
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === cellValue + '') return list[i].label
      }
    },
    fetch({ current, size }, params) {
      const { datetime = [], handlerIdList, ...other } = params
      const data = {
        createTimeFrom: datetime ? datetime[0] : '',
        createTimeTo: datetime ? datetime[1] : '',
        handlerIdList: handlerIdList.id ? [handlerIdList.id] : [],
        ...other
      }
      return queryData({ current, size, params: data }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    downloadFile(url, name) {
      window.location.href = url
    },
    reset() {
      this.$refs.organizationRef.inputText = ''
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.search-form{
  ::v-deep .el-row .el-col{
    height: 28px;
  }
}
::v-deep a.download-style{
  color: #409eff;
  outline:none;
}
</style>
