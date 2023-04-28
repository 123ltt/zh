<template>
  <div class="plat-details">
    <DetailsForm ref="detailsFormRef" :items="itemList" :config="platUrlConfig" @rendered="getGoodsInfo" />
    <el-card class="table-card">
      <h4 slot="header" class="my-1">商品信息</h4>
      <g-table ref="goodsTableRef" :dense="true" :headers="goodsHeaders" :fetch="goodsFetch" :page-show="false" :fixed-height="false">
        <el-table-column slot="imgUrl" label="商品图片" width="80">
          <template slot-scope="{row}">
            <g-thumb :url="row.productMainImage" />
          </template>
        </el-table-column>
        <el-table-column slot="productInfo" label="商品信息">
          <template slot-scope="{row}">
            <g-list-group label-width="60px" label-align="center">
              <g-list-group-item label="在线SKU">
                <g-text-ellipsis>{{ row.sku }}</g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="商品名称" class="my-1">
                <g-text-ellipsis>{{ row.name }}</g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="ItemID">
                <g-text-ellipsis>
                  {{ row.orderItemId }}
                  <el-tag v-if="row.compositeAndSecondary" type="success" size="mini">{{ row.compositeAndSecondary }}</el-tag>
                </g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="item状态">
                <g-text-ellipsis>{{ row.itemStatus }}</g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="标记跟踪号">
                <g-text-ellipsis>{{ row.trackingCode }}</g-text-ellipsis>
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
import { getLogsPage } from '@/api/lazada.js'

export default {
  components: { DetailsForm },
  props: {
    orderId: String,
    routeParams: Array
  },
  data() {
    return {
      itemList,
      goodsHeaders: [
        { slot: true, slotName: 'imgUrl' },
        { slot: true, slotName: 'productInfo' },
        { label: '产品单价（不含税）', prop: 'productPriceWithoutTax', formatter: (row, column, cellValue) => this.formatterMoney(cellValue), width: '200px' },
        { label: '税费', prop: 'taxAmount', formatter: (row, column, cellValue) => this.formatterMoney(cellValue), width: '120px' },
        { label: '产品单价（含税）', prop: 'itemPriceWithTax', formatter: (row, column, cellValue) => this.formatterMoney(cellValue), width: '120px' },
        { label: '数量', prop: 'quantity', width: '120px' },
        { label: '销售金额', prop: 'salesAmount', formatter: (row, column, cellValue) => this.formatterMoney(cellValue), width: '120px' }
      ],
      logHeaders: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '操作属性', prop: 'loggerCN', align: 'center' },
        { slot: true, slotName: 'msgBrief' },
        { label: '用户ID', prop: 'createUserAccount', align: 'center' },
        { label: '首次写入时间', prop: 'createTime', align: 'center' },
        { label: '最近写入时间', prop: 'updateTime', align: 'center' }
      ],
      goodList: null,
      platUrlConfig: {
        url: '/lzPlatOrderMain/detail',
        params: { orderId: this.orderId, storeCode: this.routeParams[0] }
      }
    }
  },
  mounted() {
    this.$emit('title', 'lazada订单详情')
    this.$refs.logTableRef.load(1, { platOrderId: this.orderId, storeCode: this.routeParams[0] })
  },
  methods: {
    formatterMoney(price) {
      let res = this.$refs.detailsFormRef.form.currency + ' '
      res += parseFloat(price || 0).toFixed(2)
      return res
    },
    getGoodsInfo(form) {
      form.fbl = form.fbl ? '是' : '否'
      form.isCod = form.isCod ? '是' : '否'
      this.goodList = form.goodList
      this.$refs.goodsTableRef.load(1)
    },
    goodsFetch() {
      const records = this.goodList || []
      return Promise.resolve({ records })
    },
    logFetch({ current, size }, data) {
      return getLogsPage({ query: { current, size }, data })
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
