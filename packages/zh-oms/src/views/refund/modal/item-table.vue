<template>
  <g-table ref="itemtable"
           :headers="headers"
           :fixed-height="false"
           :fetch="fetch"
           :page-show="false"
  >
    <el-table-column slot="index" label="序号" width="55" fixed>
      <template slot-scope="{$index}">{{ $index + 1 }}</template>
    </el-table-column>
  </g-table>
</template>
<script>
export default {
  name: 'ItemTable',
  props: {
    tableList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        { slot: true, slotName: 'index' },
        { label: 'ItemID', prop: 'orderItemId', width: 120, showOverflowTooltip: true },
        { label: 'SKU', prop: 'pmsSku', width: 100, showOverflowTooltip: true },
        { label: 'SKU数量', prop: 'quantity' },
        { label: '在线SKU', prop: 'sku', width: 100, showOverflowTooltip: true },
        { label: 'SKU退款金额', prop: 'skuRefundPrice', width: 100 },
        { label: '产品销售价', prop: 'sellerPrice', width: 90 },
        { label: '卖家优惠', prop: 'voucherSeller' },
        { label: '买家实付运费', prop: 'shippingAmount', width: 100 },
        { label: 'item状态', prop: 'itemStatus' },
        { label: '原因', prop: 'reason', width: 150, showOverflowTooltip: true },
        { label: '退款时间', prop: 'refundTime', width: 130 },
        { label: '创建时间', prop: 'createdAt', width: 130 }
      ]
    }
  },
  mounted() {
    this.$refs.itemtable.load()
  },
  methods: {
    fetch(query, data) {
      return Promise.resolve().then(() => ({ records: this.tableList }))
    }
  }
}
</script>
