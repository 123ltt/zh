<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <el-form slot="header" size="mini" :inline="true">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="处理人">
          <organization-panel ref="organization" v-model="formData.handlerPerson">
            <el-input v-model="formData.handlerPerson.name" />
          </organization-panel>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="formData.operationType">
            <el-option label="全部" value="0" />
            <el-option label="导入" value="1" />
            <el-option label="导出" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="serach">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table-column slot="operationType" label="操作类型" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.operationType===1">导入</span>
          <span v-else>导出</span>
        </template>
      </el-table-column>
      <el-table-column slot="status" label="状态" width="60">
        <template slot-scope="scope">
          {{ getStatus( scope.row.processingStatus) }}
        </template>
      </el-table-column>
      <el-table-column slot="handlerBtnSlot" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="download(scope.row.linkFileResult, scope.row.fileName)">
            <span>{{ ['','','下载'][scope.row.processingStatus] }}</span>
          </el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { dowloadExc } from '@/util/util'
import OrganizationPanel from '@/components/organization/index.vue'
import { downloadCenterList } from '@/api/downloadCenter'
export default {
  name: 'OmsDownloadCenterList',
  components: {
    OrganizationPanel
  },
  data() {
    return {
      time: '',
      formData: {
        handlerPerson: '',
        operationType: ''
      },
      headers: [
        { label: '批次号', prop: 'id' },
        { label: '文件名称', prop: 'fileName' },
        { slot: true, slotName: 'operationType' },
        { label: '创建时间', prop: 'createTime', width: 150 },
        { label: '处理人', prop: 'handler', width: 150 },
        { slot: true, slotName: 'status' },
        { label: '结果', prop: 'processingResult', width: 150 },
        { slot: true, slotName: 'handlerBtnSlot' }
      ]
    }
  },
  watch: {
    'formData.handlerPerson.name': {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.formData.handlerPerson = {}
        }
      },
      immediate: true
    }

  },
  mounted() {
    this.getList()
  },
  methods: {
    getStatus(type) {
      const statusList = {
        0: '待处理',
        1: '处理中',
        2: '成功',
        3: '失败'
      }
      return statusList[type]
    },
    download(url, name) {
      dowloadExc(url, name + '.xls', true)
    },
    serach() {
      this.getList()
    },
    getList() {
      const params = Object.assign({}, this.formData)
      params.handlerPerson = params.handlerPerson ? this.formData.handlerPerson.id : ''
      params.actionTime = (this.time && this.time[0]) || ''
      params.finTime = (this.time && this.time[1]) || ''
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      const param = {
        data: { ...params },
        query: { current, size }
      }
      return downloadCenterList(param).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
