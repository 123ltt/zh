<template>
  <g-table ref="tableRef" :headers="headers" :fetch="fetch">
    <el-table-column slot="operationDetail" label="操作详情">
      <template v-slot="{row}">
        <g-text-ellipsis :lines="2">{{ row.operationDetail }}</g-text-ellipsis>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getOperationLog } from '@/api/settlement'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: [
        { label: '操作时间', prop: 'operationTime', width: 140 },
        { label: '操作人', prop: 'operatorName', width: 90 },
        { slot: true, slotName: 'operationDetail' }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$refs.tableRef.load(1, { sid: this.id, type: 'logisticBill' })
    },
    fetch({ current, size }, params) {
      return getOperationLog(current, size, params).then(res => {
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    }
  }
}
</script>

<style>

</style>
