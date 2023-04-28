<template>
  <div class="plat-details">
    <DetailsForm ref="detailsFormRef" :items="itemList" :config="platUrlConfig" @rendered="getGoodsInfo" />
    <el-card class="table-card no-pb">
      <h4 slot="header" class="my-1">订单日志</h4>
      <g-table ref="logTableRef" :dense="true" :headers="logHeaders" :fetch="logFetch" :fixed-height="false">
        <el-table-column slot="msgBrief" label="描述" align="center">
          <template slot-scope="{row}">
            <g-text-ellipsis :lines="2">{{ row.msgBrief }}</g-text-ellipsis>
          </template>
        </el-table-column>
      </g-table>
    </el-card>
  </div>
</template>

<script>
import DetailsForm from '../details/details-form.vue'
import itemList from './items.js'
import { getLogList } from '@/api/walmart.js'

export default {
  components: { DetailsForm },
  props: {
    purchaseOrderId: String
  },
  data() {
    return {
      itemList,
      logHeaders: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '操作属性', prop: 'logger', align: 'center' },
        { slot: true, slotName: 'msgBrief' },
        { label: '用户ID', prop: 'createUserAccount', align: 'center' },
        { label: '首次写入时间', prop: 'createTime', align: 'center' },
        { label: '最近写入时间', prop: 'updateTime', align: 'center' }
      ],
      goodList: null,
      platUrlConfig: {
        url: '/walmart/detail',
        params: { purchaseOrderId: this.purchaseOrderId }
      }
    }
  },
  mounted() {
    this.$emit('title', 'walmart订单详情')
    this.$refs.logTableRef.load(1, this.purchaseOrderId)
  },
  methods: {
    getGoodsInfo(form) {
      form.ifWFS = form.ifWFS ? '是' : '否'
      form.orderType = ['线上订单', '手工订单'][form.orderType] || ''
      form.shippingCurrency = form.currencyCode = form.goods[0].shippingCurrency
      this.goodList = form.goods
    },
    logFetch({ current, size }, data) {
      return getLogList(data)
        .then(({ data: { records, total, size } }) => ({ records, total, size }))
    }
  }
}
</script>

<style lang="scss" scoped>
.plat-details ::v-deep {
  .table-card {
    .el-card__header{
        background: linear-gradient(to right, #f5f4f4,#fff);
    }
    .el-card__body{
      max-height: 500px;
      overflow: scroll;
      padding: 2px 0 16px;
    }
  }
  .no-pb .el-card__body{
    padding-bottom: 0;
  }
}
</style>
