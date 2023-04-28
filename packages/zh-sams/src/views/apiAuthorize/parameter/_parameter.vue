<template>
  <basic-container>
    <!-- 授权参数配置 -->
    <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form
          ref="formObjRef"
          :inline="true"
          :model="formObj"
          size="mini"
          class="no-message"
          @submit.native.prevent="search"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="平台" prop="platform">
                <el-select v-model="formObj.platform" filterable clearable class="w160" placeholder="请选择" @change="changePlatformId">
                  <el-option v-for="(item,index) in findForm.platformOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="站点" prop="site">
                <el-select v-model="formObj.site" filterable :disabled="disabledSite" clearable class="w160" placeholder="请选择">
                  <el-option v-for="(item,index) in findForm.siteOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="参数名" prop="parameter">
                <el-input v-model.trim="formObj.parameter" class="w160" placeholder="请输入" clearable="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜 索</el-button>
              <el-button size="mini" @click="handlerReact('formObjRef')">清 空</el-button>
              <g-auth code="parameter_add">
                <el-button size="mini" type="primary" @click="handlerEdit(null)">添加授权参数</el-button>
              </g-auth>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作" width="100">
        <template v-slot="{row}">
          <g-auth code="parameter_edit">
            <el-button type="text" @click="handlerEdit(row, 1)">编辑</el-button>
          </g-auth>
          <g-auth code="parameter_del">
            <el-button type="text" @click="handlerDel(row)">删除</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>

</template>

<script>
import { pageParamsList, removeParam } from '@/api/parameter' // api授权参数
import { siteOption } from '@/api/site' // 站点
import { platformOption } from '@/api/platform' // 平台
import { mapGetters } from 'vuex'
import EditParameter from './components/editParameter'
export default {
  name: 'SamsapiAuthorizeParameterParameter',
  data() {
    return {
      formObj: {
        platform: '',
        site: '',
        parameter: ''
      },
      disabledSite: true,
      columns: [{
        label: '序号',
        type: 'index',
        width: '60px'
      }, {
        label: '平台',
        prop: 'platformName'
      }, {
        label: '站点',
        prop: 'siteCode',
        formatter: (row, column, cellValue, index) => {
          return row.allSiteSupported ? '全部' : cellValue
        }
      }, {
        label: '是否为Amazon FBA类型',
        prop: 'fba',
        width: 160,
        formatter: (row, column, cellValue, index) => cellValue ? '是' : '否'
      }, {
        label: '参数名',
        prop: 'parameter',
        'show-overflow-tooltip': true // 溢出点点
      }, {
        label: '创建时间',
        prop: 'createTime',
        'show-overflow-tooltip': true, // 溢出点点
        width: 160
      }, {
        slot: true,
        slotName: 'handler'
      }],
      // 平台下来列表
      findForm: {
        platformOption: [],
        siteOption: [],
        siteALLOption: []
      }
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },

  mounted() {
    this.$refs.table.load(1, this.formObj)
    this.getPlatformOption()
  },
  methods: {
    // table list
    fetch({ current, size }, params) {
      return pageParamsList({ ...params, current, size }).then(res => {
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.findForm.platformOption = res.data
      })
    },
    // 平台切换
    changePlatformId(id) {
      if (id) {
        this.getSiteOption(id)
        this.disabledSite = false
        this.formObj.site = ''
      } else {
        this.disabledSite = true
      }
    },
    // 站点下拉列表
    getSiteOption(id) {
      siteOption({ platform: id }).then(res => {
        const data = JSON.parse(JSON.stringify(res.data))
        this.findForm.siteOption = res.data
        this.findForm.siteALLOption = data
        this.findForm.siteALLOption.push({ displayName: 'ALL', hiddenValue: '-1' })
      })
    },
    // 添加
    handlerEdit(row) {
      this.$modal({
        title: row ? '编辑授权参数' : '添加授权参数',
        component: EditParameter,
        width: '500px',
        data: {
          row: row,
          findForm: this.findForm
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    // 清空
    handlerReact(formName) {
      this.$refs[formName].resetFields()
      this.disabledSite = true
      this.findForm.siteOption = []
      this.page['current-page'] = 1
      this.search()
    },
    // 删除
    handlerDel(row) {
      this.$confirm('确认删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.loading = true
        removeParam({ id: row.id }).then((res) => {
          this.$message.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {

      })
    }

  }

}
</script>

<style>
.w160 {
  width: 160px;
}
</style>
