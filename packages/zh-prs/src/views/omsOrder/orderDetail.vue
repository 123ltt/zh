<template>
  <basic-container>
    <el-card v-for="item in infoList" :key="item.label" :header="item.label" class="omsDetailCard">
      <g-list-group v-if="item.label!=='商品信息'" :cols="3" label-width="150" class="mb-3">
        <g-list-group-item
          v-for="ele in item.list"
          :key="ele.prop"
          :label="ele.name"
        >
          {{ infoData[ ele.prop] }}
        </g-list-group-item>
      </g-list-group>
      <el-table
        v-else
        :data="infoData.productDetailList"
        class="g-table g-table-dense"
        stripe
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
      >
        <el-table-column v-for="ele in item.headers" :key="ele.prop" :prop="ele.prop" :label="ele.label">
          <template v-if="ele.prop==='productInfo'" v-slot="{row}">
            <p>SKU:{{ row.sku ||'--' }}</p>
            <p>itemId:{{ row.itemId ||'--' }}</p>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

  </basic-container>
</template>

<script>
import { filterData } from '../../utils/filterData'
import { getOmsDetail } from '@/api/oms'

export default {

  props: {
    id: String
  },
  data() {
    return {
      infoData: {
        productDetailList: []
      },
      infoList: [
        {
          label: '基本信息',
          list: [{ name: '平台名称', prop: 'platformName' },
            { name: '经营站点', prop: 'site' },
            { name: '店铺编码', prop: 'storeCode' },
            { name: '订单时间', prop: 'orderTime' },
            { name: '平台单号', prop: 'platformOrderCode' },
            { name: 'OMS单号', prop: 'omsOrderCode' }
          ]
        },
        {
          label: '收款明细',
          list: [{ name: '收款币种', prop: 'omsAmountCurrency' },
            { name: '订单额', prop: 'omsAmount' },
            { name: '税费', prop: 'taxFee' },

            { name: '客运费', prop: 'shippingFeeByCustomer' },
            { name: '平台优惠', prop: 'platformVoucher' },
            { name: '卖家优惠', prop: 'customerVoucher' }

          ]
        },
        {
          label: '退款明细',
          list: [{ name: '退款币种', prop: 'omsRefundCurrency' },
            { name: '退款金额', prop: 'omsRefund' },
            { name: '退还交易费', prop: 'refundTransactionFee' },
            { name: '退还手续费', prop: 'refundServiceFee' },
            { name: '退还税费', prop: 'refundTaxFee' },
            { name: '退还客运费', prop: 'refundShippingFeeByCustomer' }
          ]
        },
        {
          label: '核销信息',
          list: [{ name: '核销金额', prop: 'verifyAmount' },
            { name: '核销时间', prop: 'verifyTime' }
          ]
        },
        {
          label: '商品信息',
          headers: [
            { label: '商品信息', prop: 'productInfo' },
            { label: '产品单价', prop: 'unitPrice' },
            { label: '税费', prop: 'taxFee' },
            { label: '含税单价', prop: 'taxInclusivePrice' },
            { label: '数量', prop: 'quantity' },
            { label: '销售额', prop: 'saleAmout' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    init() {
      getOmsDetail({ id: this.id }).then(res => {
        filterData(res.data.productDetailList)
        this.infoData = filterData(res.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.omsDetailCard ::v-deep{
  .el-card__header{
    font-weight: 700;
    background: linear-gradient(to right, #f5f4f4,#fff);
  }
  .el-card__body{

    padding-left: 30px;
  }

}

</style>
