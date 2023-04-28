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
import { getWalmartDetailCa } from '@/api/walmart/walmart'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'WalmartCaDetail',
  components: { colsForm, handelDownload },

  data() {
    return {
      fn: getWalmartDetailCa,
      orderIdOptions: [{ label: 'sales order id', value: 1 }, { label: 'purchase order id', value: 2 }],
      exportData: [],
      allData: [],
      formInfo: {
        orderIdType: '', orderIdList: ''
      },
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
          options: ['ALL', 'Returns', 'Sales']
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
      headerCaDetail: [
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
          label: 'Sales Order ID',
          prop: 'salesOrderId'
        },
        {
          label: 'Sales Order Line Number',
          prop: 'salesOrderLineNumber'
        },
        {
          label: 'Purchase Order ID',
          prop: 'purchaseOrderId'
        },
        {
          label: 'Purchase Order Line Number',
          prop: 'purchaseOrderLineNumber'
        },
        {
          label: 'Transaction Type',
          prop: 'transactionType'
        },
        {
          label: 'Customer Invoice Number',
          prop: 'customerInvoiceNumber'
        },
        {
          label: 'Customer Invoice Date',
          prop: 'customerInvoiceDate'
        },
        {
          label: 'Seller Invoice Number',
          prop: 'sellerInvoiceNumber'
        },
        {
          label: 'Seller Invoice Date',
          prop: 'sellerInvoiceDate'
        },
        {
          label: 'Seller Invoice Disposition Date',
          prop: 'sellerInvoiceDispositionDate'
        },
        {
          label: 'Shipped Qty',
          prop: 'shippedQty'
        },
        {
          label: 'Offer ID',
          prop: 'offerId',
          width: '120',
          align: 'center'
        },
        {
          label: 'Walmart SKU ID',
          prop: 'walmartSkuId'
        },
        {
          label: 'Seller SKU ID',
          prop: 'sellerSkuId'
        },
        {
          label: 'Product Tax Code',
          prop: 'productTaxCode'
        },
        {
          label: 'Item Name',
          prop: 'itemName',
          width: '200',
          align: 'center'

        },
        {
          label: 'GTIN',
          prop: 'gtin'
        },
        {
          label: 'Ship To City',
          prop: 'shipToCity'
        },
        {
          label: 'Ship to Province',
          prop: 'shipToProvince'
        },
        {
          label: 'Postal Code',
          prop: 'postalCode'
        },
        {
          label: 'Shipping Method',
          prop: 'shippingMethod'
        },
        {
          label: 'Line Amount',
          prop: 'lineAmount'
        },
        {
          label: 'Line Shipping Charge(运费)',
          prop: 'lineShippingCharge'
        },
        {
          label: 'Line Fee',
          prop: 'lineFee'
        },
        {
          label: 'Line Tax',
          prop: 'lineTax'
        },
        {
          label: 'GST/HST',
          prop: 'gstHst'
        },
        {
          label: 'PST/QST Remit by Seller',
          prop: 'pstQstRemitSeller'
        },
        {
          label: 'PST/QST Remit by Walmart',
          prop: 'pstQstRemitWalmart'
        },
        {
          label: 'Tender From Customer',
          prop: 'tenderFromCustomer'
        },
        {
          label: 'Referral Rate',
          prop: 'referralRate'
        },
        {
          label: 'Referral Amount',
          prop: 'referralAmount'
        },
        {
          label: 'Effective Tax Rate',
          prop: 'effectiveTaxRate'
        },
        {
          label: 'Referral Tax',
          prop: 'referralTax'
        },
        {
          label: 'Payable To Partner',
          prop: 'payableToPartner'
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
    },
    'formInfo.type'(val) {
      this.headers = this.headerCaDetail
      this.fn = getWalmartDetailCa
      this.$nextTick(() => {
        this.$refs.tableRef.load(1, this.formInfo)
      })
    }

  },
  mounted() {
    this.headers = this.headerCaDetail
    this.init()
    this.getData()
  },
  methods: {
    getAllData() {
      this.fn(1, 50000, this.formInfo).then(res => {
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
      (this.formInfo.transactionType === 'ALL') && (this.formInfo.transactionType = null)
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
      return this.fn(current, size, params).then((res) => {
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
  .el-input__inner{
    width: 245px  !important;
  }
</style>
