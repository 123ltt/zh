<template>
  <!-- oms 详情 - 操作日志 -->
  <g-table ref="table"
           :headers="headers"
           row-key="id"
           :fetch="fetch"
  >
    <el-table-column slot="msgBriefSlot" label="描述">
      <template slot-scope="{row}">
        <g-text-ellipsis>{{ row.msgBrief }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column slot="createUserAccountSlot" width="150px">
      <template slot="header" slot-scope="scope">
        <el-select :key="scope.$index" v-model="form.userType" size="mini" @change="search">
          <el-option label="全部用户" value="" />
          <el-option label="人工" value="user" />
          <el-option label="系统" value="oms-xxljob" />
        </el-select>
      </template>
      <template slot-scope="scope">{{ scope.row.createUserName || scope.row.createUserAccount }}</template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getLogList } from '@/api/orderManagement'
import { getLogList as getPackageLogList } from '@/api/packageDetails'

export default {
  name: 'Logs',
  props: {
    omOrderId: String,
    packageCode: String,
    detailsType: String
  },
  data() {
    return {
      headers: [
        { type: 'index', label: '序号' },
        { label: '操作属性', prop: 'logger', width: '180px' },
        // { slot: true, slotName: 'loggerSlot' },
        { slot: true, slotName: 'msgBriefSlot' },
        // { label: '用户', prop: 'createUserAccount', width: '120px' },
        { slot: true, slotName: 'createUserAccountSlot' },
        { label: '首次写入时间', prop: 'createTime', width: '140px' },
        { label: '最近写入时间', prop: 'updateTime', width: '140px' }
      ],
      form: { userType: '' }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search(page = 1) {
      const { detailsType, omOrderId, packageCode } = this
      const id = detailsType === 'order' ? omOrderId : packageCode
      this.$refs.table.load(page, id)
    },
    fetch({ current, size }, id) {
      const { detailsType, form: { userType } } = this
      const query = {
        order: getLogList,
        package: getPackageLogList
      }[detailsType]
      const params = { current, size, userType }
      params[detailsType === 'order' ? 'omOrderId' : 'packageCode'] = id

      return query(params).then(res => {
        return {
          records: res.data.records || [], // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    }
  }
}
</script>
