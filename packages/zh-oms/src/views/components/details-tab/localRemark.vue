<template>
  <!-- oms 详情 - 本地备注表格分页 -->
  <g-table ref="table"
           :headers="headers"
           row-key="id"
           :fetch="fetch"
  >
    <el-table-column slot="remarkSlot" label="备注">
      <template slot-scope="{row}">
        <g-text-ellipsis :max-length="50">
          {{ row.remark }}
        </g-text-ellipsis>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getRemarkList } from '@/api/orderManagement'
import { getRemarkList as getPackageRemarkList } from '@/api/packageDetails'

export default {
  name: 'LocalRemark',
  components: { },
  props: {
    omOrderId: String,
    packageCode: String,
    detailsType: String
  },
  data() {
    return {
      headers: [
        { type: 'index', label: '序号' },
        {
          label: '类型',
          prop: 'remarkType',
          width: '150px',
          formatter: (row, column, cellValue) => cellValue === 1 ? '买家' : '泽汇'
        },
        { label: '操作人', prop: 'createUserName', width: '150px' },
        { label: '时间', prop: 'createTime', width: '180px' },
        { slot: true, slotName: 'remarkSlot' }
      ]
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
      const { detailsType } = this
      const query = {
        order: getRemarkList,
        package: getPackageRemarkList
      }[detailsType]
      const params = { current, size }
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
