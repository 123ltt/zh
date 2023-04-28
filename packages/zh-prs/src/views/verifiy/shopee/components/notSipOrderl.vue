<template>
  <g-table ref="tableRef"
           :fetch="fetch"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
           :headers="headers"
           @selection-change="handleSelectionChange"
  >
    <template #header>
      <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler="formHandler" />
      <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
    </template>
  </g-table>
</template>

<script>
import { getShopeeAllocateOrderIncome } from '@/api/shopee/shopee'
import { getStoreCodeList, getMyDictBiz } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'PrsVerifiyShopeeNoSipOrder', // 非SIP收入明细
  components: { colsForm, handelDownload },

  data() {
    return {
      exportData: [],
      allData: [],
      formInfo: {},
      formItem: [{
        type: 'gselect',
        optionValue: 'value',
        label: '店铺编码',
        prop: 'storeCode',
        options: []
      },
      {
        type: 'input',
        label: 'payee_id',
        prop: 'payeeId',
        placeholder: '多个用英文逗号隔开'

      },
      {
        type: 'datePicker',
        label: '拨款时间',
        prop: 'date'
      },
      {
        type: 'input',
        label: '平台订单号',
        prop: 'ordersn',
        placeholder: '多个用英文逗号隔开'

      }
      ],
      formHandler: [{
        label: '查询',
        handler: () => {
          this.search()
        }
      }, {
        label: '重置',
        handler: () => {
          this.reset()
        }
      }],

      headers: [
        { width: '55', type: 'selection' },
        { label: '销售经理', prop: 'managerName' },
        { label: '组织架构', prop: 'organizationCode' },
        { label: '注册公司', prop: 'register', width: '100' },
        { label: '收款方式', prop: 'payService' },
        { label: '收款公司', prop: 'payeeCompany' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '站点', prop: 'site' },
        { label: '原始币种', prop: 'fromCurrency' },
        { label: '拨款币种', prop: 'payoutCurrency' },
        { label: '执行汇率', prop: 'exchangeRate' },
        { label: 'payee_id', prop: 'payeeId' },
        { label: '拨款时间', prop: 'payoutTimeStr' },
        { label: '平台订单号', prop: 'ordersn' },
        { label: 'buyer_user_name', prop: 'buyerUserName' },
        { label: 'escrow_amount', prop: 'escrowAmount' },
        { label: 'buyer_total_amount', prop: 'buyer_total_amount' },
        { label: 'original_price', prop: 'original_price' },
        { label: 'seller_discount', prop: 'seller_discount' },
        { label: 'shopee_discount', prop: 'shopee_discount' },
        { label: 'voucher_from_seller', prop: 'voucher_from_seller' },
        { label: 'voucher_from_shopee', prop: 'voucher_from_shopee' },
        { label: 'coins', prop: 'coins' },
        { label: 'buyer_paid_shipping_fee', prop: 'buyer_paid_shipping_fee' },
        { label: 'buyer_transaction_fee', prop: 'buyer_transaction_fee' },
        { label: 'cross_border_tax', prop: 'cross_border_tax' },
        { label: 'payment_promotion', prop: 'payment_promotion' },
        { label: 'commission_fee', prop: 'commission_fee' },
        { label: 'service_fee', prop: 'service_fee' },
        { label: 'seller_transaction_fee', prop: 'seller_transaction_fee' },
        { label: 'seller_lost_compensation', prop: 'seller_lost_compensation' },
        { label: 'seller_coin_cash_back', prop: 'seller_coin_cash_back' },
        { label: 'escrow_tax', prop: 'escrow_tax' },
        { label: 'final_shipping_fee', prop: 'final_shipping_fee' },
        { label: 'actual_shipping_fee', prop: 'actual_shipping_fee' },
        { label: 'shopee_shipping_rebate', prop: 'shopee_shipping_rebate' },
        { label: 'shipping_fee_discount_from_3pl', prop: 'shipping_fee_discount_from_3pl' },
        { label: 'seller_shipping_discount', prop: 'seller_shipping_discount' },
        { label: 'estimated_shipping_fee', prop: 'estimated_shipping_fee' },
        { label: 'drc_adjustable_refund', prop: 'drc_adjustable_refund' },
        { label: 'cost_of_goods_sold', prop: 'cost_of_goods_sold' },
        { label: 'original_cost_of_goods_sold', prop: 'original_cost_of_goods_sold' },
        { label: 'original_shopee_discount', prop: 'original_shopee_discount' },
        { label: 'seller_return_refund', prop: 'seller_return_refund' }
      ]

    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.beginTime = val?.[0]
      this.formInfo.endTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    getAllData() {
      getShopeeAllocateOrderIncome(1, 50000, this.formInfo).then(res => {
        this.allData = this.dnymic(res.data.records)
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    getData() {
      getStoreCodeList({ platformCode: 'SP' }).then(res => {
        this.formItem[0].options = res.data
      })
      getMyDictBiz('smt_trade_type').then(res => {
        this.formItem[3].options = res.data
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    dnymic(data) {
      return data.map(item => {
        return { ...item, ...item.incomeMap }
      })
    },
    fetch({ current, size }, params) {
      return getShopeeAllocateOrderIncome(current, size, params).then((res) => {
        res.data.records = this.dnymic(res.data.records)
        this.$refs.formRef.filterData(res.data.records)
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
