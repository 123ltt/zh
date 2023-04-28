<template>
  <g-table ref="tableRef"
           :fetch="fetch"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
           :headers="headers"
           @selection-change="handleSelectionChange"
  >
    <template #header>
      <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler="formHandler">
        <template slot="orderIds">
          <el-form-item>
            <div slot="label">
              <el-select v-model="formInfo.orderIdType" clearable placeholder="请选择" style="width:110px !important">
                <el-option
                  v-for="item in orderIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  clearable
                />
              </el-select>
            </div>
            <el-input v-model="formInfo.orderIdList" clearable style="width:245px !important" placeholder="多个用英文逗号隔开" />
          </el-form-item>
        </template>
      </cols-form>
      <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
    </template>
  </g-table>
</template>

<script>
import { getWalmartDetaiUs } from '@/api/walmart/walmart'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'WalmartUsDetail',
  components: { colsForm, handelDownload },

  data() {
    return {
      exportData: [],
      orderIdOptions: [{ label: 'Walmart.com Order', value: 1 }, { label: 'Walmart.com PO', value: 2 }],
      allData: [],
      formInfo: {},
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          label: '店铺编码',
          prop: 'storeCode',
          options: []
        },
        {
          type: 'slot',
          slotName: 'orderIds'
        },
        {
          type: 'datePicker',
          label: '账单日期',
          prop: 'date'

        },
        {
          type: 'bselect',
          label: '交易类型',
          prop: 'transactionType',
          options: ['ALL', 'REFUNDED', 'ADJMNT', 'SALE']
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
      dateTime: [],
      headers: [],
      headerUsDetail: [
        { width: '55', type: 'selection' },
        {
          label: '账单日期',
          prop: 'billDate'
        },

        {
          label: '店铺编码',
          prop: 'storeCode'
        },
        {
          label: 'Walmart.com Order #',
          prop: 'walOrder'
        },
        {
          label: 'Walmart.com Order Line #',
          prop: 'walOrderLine'
        },
        {
          label: 'Walmart.com PO #',
          prop: 'walPo'
        },
        {
          label: 'Walmart.com P.O. Line #',
          prop: 'walPoLine'
        },
        {
          label: 'Partner Order #',
          prop: 'partnerOrder'
        },
        {
          label: 'Transaction Type',
          prop: 'transactionType'
        },
        {
          label: 'Transaction Date Time',
          prop: 'transactionDateTime'
        },
        {
          label: 'Shipped Qty',
          prop: 'shippedQty'
        },
        {
          label: 'Partner Item ID',
          prop: 'partnerItemId',
          width: '100'

        },
        {
          label: 'Partner GTIN',
          prop: 'partnerGtin'
        },
        {
          label: 'Partner Item name',
          prop: 'partnerItemName',
          align: 'center',
          width: '200'
        },
        {
          label: 'Product tax code',
          prop: 'productTaxCode'
        },
        {
          label: 'Shipping tax code',
          prop: 'shippingTaxCode'
        },
        {
          label: 'Gift wrap tax code',
          prop: 'giftWrapTaxCode'
        },
        {
          label: 'Ship to state',
          prop: 'shipToState'
        },
        {
          label: 'Ship to county',
          prop: 'shipToCounty'
        },
        {
          label: 'County Code',
          prop: 'countyCode'
        },
        {
          label: 'Ship to city',
          prop: 'shipToCity'
        },
        {
          label: 'Zip code',
          prop: 'zipCode'
        },
        {
          label: 'shipping_method',
          prop: 'shippingMethod'
        },
        {
          label: 'Total tender to / from customer',
          prop: 'totalTenderCustomer'
        },
        {
          label: 'Payable to Partner from Sale',
          prop: 'payablePartnerSale'
        },
        {
          label: 'Commission from Sale',
          prop: 'commissionFromSale'
        },
        {
          label: 'Commission Rate',
          prop: 'commissionRate'
        },
        {
          label: 'Gross Sales Revenue',
          prop: 'grossSalesRevenue'
        },
        {
          label: 'Refunded Retail Sales',
          prop: 'refundedRetailSales'
        },
        {
          label: 'Sales refund for Escalation',
          prop: 'salesRefundForEscal'
        },
        {
          label: 'Gross Shipping Revenue',
          prop: 'grossShippingRevenue'
        },
        {
          label: 'Gross Shipping Refunded',
          prop: 'grossShippingRefunded'
        },
        {
          label: 'Shipping refund for Escalation',
          prop: 'shippingRefundForEscal'
        },
        {
          label: 'Net Shipping Revenue',
          prop: 'netShippingRevenue'
        },
        {
          label: 'Gross Fee Revenue',
          prop: 'grossFeeRevenue'
        },
        {
          label: 'Gross Fee Refunded',
          prop: 'grossFeeRefunded'
        },
        {
          label: 'Fee refund for Escalation',
          prop: 'feeRefundForEscal'
        },
        {
          label: 'Net Fee Revenue',
          prop: 'netFeeRevenue'
        },
        {
          label: 'Gift Wrap Quantity',
          prop: 'giftWrapQuantity'
        },
        {
          label: 'Gross Gift-Wrap Revenue',
          prop: 'grossGiftWrapRevenue'
        },
        {
          label: 'Gross Gift-Wrap Refunded',
          prop: 'grossGiftWrapRefunded'
        },
        {
          label: 'Gift wrap refund for Escalation',
          prop: 'giftWrapRefundEscal'
        },
        {
          label: 'Net Gift Wrap Revenue',
          prop: 'netGiftWrapRevenue'
        },
        {
          label: 'Tax on Sales Revenue',
          prop: 'taxSalesRevenue'
        },
        {
          label: 'Tax on Shipping Revenue',
          prop: 'taxShippingRevenue'
        },
        {
          label: 'Tax on Gift-Wrap Revenue',
          prop: 'taxGiftWrapRevenue'
        },
        {
          label: 'Tax on Fee Revenue',
          prop: 'taxFeeRevenue'
        },
        {
          label: 'Effective tax rate',
          prop: 'effectiveTaxRate'
        },
        {
          label: 'Tax on Refunded Sales',
          prop: 'taxRefundedSales'
        },
        {
          label: 'Tax on Shipping Refund',
          prop: 'taxShippingRefund'
        },
        {
          label: 'Tax on Gift-Wrap Refund',
          prop: 'taxGiftWrapRefund'
        },
        {
          label: 'Tax on Fee Refund',
          prop: 'taxFeeRefund'
        },
        {
          label: 'Tax on Sales refund for Escalation',
          prop: 'taxSalesRefundEscal'
        },
        {
          label: 'Tax on Shipping Refund for Escalation',
          prop: 'taxShippingRefundEscal'
        },
        {
          label: 'Tax on Gift-Wrap Refund for escalation',
          prop: 'taxGiftWrapRefundEscal'
        },
        {
          label: 'Tax on Fee Refund for escalation',
          prop: 'taxFeeRefundEscal'
        },
        {
          label: 'Total NET Tax Collected',
          prop: 'totalNetTaxCollected'
        },
        {
          label: 'Tax Withheld',
          prop: 'taxWithheld'
        },
        {
          label: 'Adjustment Description',
          prop: 'adjustmentDesc',
          align: 'center',
          width: '120'
        },
        {
          label: 'Adjustment Code',
          prop: 'adjustmentCode'
        },
        {
          label: 'Original Item price',
          prop: 'originalItemPrice'
        },
        {
          label: 'Original Commission Amount',
          prop: 'originalCommissionAmount'
        },
        {
          label: 'Spec Category',
          prop: 'specCategory'
        },
        {
          label: 'Contract Category',
          prop: 'contractCategory'
        },
        {
          label: 'Product Type',
          prop: 'productType'
        },
        {
          label: 'Flex Commission Rule',
          prop: 'flexCommissionRule'
        },
        {
          label: 'Return Reason Code',
          prop: 'returnReasonCode'
        },
        {
          label: 'Return Reason Description',
          prop: 'returnReasonDesc'
        },
        {
          label: 'Fee Withheld Flag',
          prop: 'feeWithheldFlag'
        },
        {
          label: 'Fulfillment Type',
          prop: 'fulfillmentType'
        },
        {
          label: '文件名称',
          prop: 'fileName',
          width: '150'

        }
      ]

    }
  },

  watch: {
    'formInfo.date'(val) {
      this.formInfo.billBegin = val?.[0]
      this.formInfo.billEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.headers = this.headerUsDetail
    this.init()
    this.getData()
  },
  methods: {
    getAllData() {
      getWalmartDetaiUs(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    getData() {
      getStoreCodeList({ platformCode: 'WM' }).then(res => {
        this.formItem[0].options = res.data
      })
    },
    init() {
      // 当选择all,传null过去
      (this.formInfo.transactionType === 'ALL') && (this.formInfo.transactionType = null
      )
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.dateTime = []
      this.formInfo = {}
      this.init()
    },
    fetch({ current, size }, params) {
      return getWalmartDetaiUs(current, size, params).then((res) => {
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

<style scoped lang="scss">
  .el-select{
    width:245px!important;
  }
  .el-date-editor--daterange.el-input__inner{
    width: 245px  !important;
  }
</style>
