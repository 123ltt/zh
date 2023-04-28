<template>
  <!-- 可用详情 -->
  <div style="width:100%;height:100%">
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" />

  </div>
</template>

<script>
import { getAvailableDetail } from '@/api/stock/view.js'
export default {
  name: 'AvailableDetails',
  props: {
    id: String
  },
  data() {
    return {
      // 表格数据
      headers: [
        {
          label: '库位号',
          prop: 'stockLocationOutsideCode',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '可用数量',
          prop: 'availableQty',
          showOverflowTooltip: true,
          minWidth: '100px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 初始化数据
    fetch({ current, size }, params) {
      return getAvailableDetail(current, size, { stockId: this.id }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
