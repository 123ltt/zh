<template>
  <div class="plat-details">
    <DetailsForm ref="detailsFormRef" :items="itemList" :config="platUrlConfig" @rendered="getGoodsInfo" />
    <el-card class="table-card">
      <h4 slot="header" class="my-1">商品信息</h4>
      <g-table ref="goodsTableRef" :dense="true" :headers="goodsHeaders" :fetch="goodsFetch" :page-show="false" :fixed-height="false">
        <el-table-column slot="imageUrl" label="商品图片" width="80">
          <template slot-scope="{row}">
            <g-thumb :url="row.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column slot="productInfo" label="商品信息">
          <template slot-scope="{row}">
            <g-list-group label-width="50px" label-align="center">
              <g-list-group-item label="在线SKU">
                <g-text-ellipsis>{{ row.sku }}</g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="商品名称" class="my-1">
                <g-text-ellipsis>{{ row.title }}</g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="ItemID">
                <g-text-ellipsis>{{ row.itemId }}</g-text-ellipsis>
              </g-list-group-item>
            </g-list-group>
          </template>
        </el-table-column>
      </g-table>
    </el-card>

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
import { getLogsPage } from '@/api/ebay.js'

export default {
  components: { DetailsForm },
  props: {
    platOrderId: String
  },
  data() {
    return {
      itemList,
      goodsHeaders: [
        { slot: true, slotName: 'imageUrl' },
        { slot: true, slotName: 'productInfo' },
        { label: '单价', prop: 'itemPrice', formatter: (row, column, cellValue) => this.formatterMoney(cellValue), width: '120px' },
        { label: '数量', prop: 'quantityPurchased', width: '120px' },
        { label: '销售金额', prop: 'totalPrice', formatter: ({ itemPrice, quantityPurchased }) => this.formatterMoney(itemPrice * quantityPurchased), width: '120px' }
      ],
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
        url: '/ebayMain/detail',
        method: 'POST',
        data: { platOrderId: this.platOrderId }
      }
    }
  },
  mounted() {
    this.$emit('title', 'ebay订单详情')
    this.$refs.logTableRef.load(1, { platOrderId: this.platOrderId })
  },
  methods: {
    formatterMoney(price) {
      let res = this.$refs.detailsFormRef.form.currencyCode + ' '
      res += parseFloat(price || 0).toFixed(2)
      return res
    },
    getGoodsInfo(form) {
      form.platformCode = 'ebay'
      this.goodList = form.goodList
      this.$refs.goodsTableRef.load(1)
    },
    goodsFetch() {
      const records = this.goodList || []
      return Promise.resolve({ records })
    },
    logFetch({ current, size }, params) {
      return getLogsPage({ current, size, ...params })
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
      padding: 2px 0 16px;
    }
  }
  .no-pb .el-card__body{
    padding-bottom: 0;
  }
}
</style>
