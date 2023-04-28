<template>
  <g-table
    ref="tableRef"
    stripe
    border
    :headers="headers"
    :fetch="fetch"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    @selection-change="handleSelectionChange"
  >
    <template #header>
      <cols-form :form-info="formInfo" :form-item="formItem" :form-handler="formHandler" />
      <handel-download
        :all-data="allData"
        :part-data="exportData"
        :headers="headers"
        @getAllData="getAllData"
      />
    </template>
  </g-table>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import { getEbayPhotonPayTotal } from '@/api/ebay/ebay'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../../utils/filterData'
import { getStoreCodeList } from '@/api/common'
export default {
  name: 'PaypalBill',
  components: {
    handelDownload,
    colsForm
  },
  data() {
    return {
      formInfo: {},
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          label: '店铺编码',
          prop: 'storeCode',
          options: []
        },
        { type: 'input', label: '文件名称', prop: 'fileName', placeholder: '模糊查询' },
        { type: 'datePicker', label: '账单日期', prop: 'date' }
      ],
      formHandler: [
        {
          label: '查询',
          handler: () => { this.search() }
        },
        {
          label: '重置',
          handler: () => { this.reset() }
        }
      ],
      headers: [
        { width: '55', type: 'selection' },
        { label: '店铺编号', prop: 'storeCode' },
        { label: 'Start date', prop: 'startDate', width: '150' },
        { label: 'End date', prop: 'endDate', width: '150' },
        // {
        //   label: 'Transaction date',
        //   prop: 'transactionDate',
        //   width: '150'
        // },
        { label: 'Payout currency', prop: 'payoutCurrency' },
        { label: 'Net amount', prop: 'netAmount' },
        { label: 'Item subtotal', prop: 'itemSubtotal' },
        // { label: 'Type', prop: 'photonPayType' },
        {
          label: 'Shipping and handling',
          prop: 'shippingAndHandling',
          width: '150'
        },
        {
          label: 'Seller collected tax',
          prop: 'sellerCollectedTax',
          width: '150'
        },
        { label: 'eBay collected tax', prop: 'ebayCollectedTax' }, //
        {
          label: 'Final Value Fee - fixed',
          prop: 'finalValueFeeFixed',
          width: '150'
        },
        {
          label: 'Final Value Fee - variable',
          prop: 'finalValueFeeVariable',
          width: '150'
        },
        {
          label: 'Very high "item not as described" fee',
          prop: 'otherReturnFee',
          width: '150'

        }, //
        {
          label: 'Below standard performance fee',
          prop: 'belowStandardPerformanceFee',
          width: '150'
        },
        {
          label: 'International fee',
          prop: 'internationalFee'
        },

        {
          label: 'Gross transaction amount',
          width: '150',
          prop: 'grossTransactionAmount'
        },

        // { label: 'Order number', prop: 'orderNumber', width: '150' },

        // { label: 'Item ID', prop: 'itemId', width: '150' },
        // { label: 'Quantity', prop: 'quantity' },
        // { label: 'Item subtotal', prop: 'itemSubtotal' },

        // { label: 'Description', prop: 'description', width: '300' },
        { label: '文件名', prop: 'fileName', width: '150' }
      ],
      exportData: [], // 导出数据
      allData: [],
      dateTime: [],
      fn: getEbayPhotonPayTotal // 接口名
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.billBegin = val?.[0]
      this.formInfo.billEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    // 选择获取数据
    getAllData() {
      this.fn(1, 50000, this.formInfo).then((res) => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    // 重置
    reset() {
      this.formInfo = {}
      this.init()
    },
    // 搜索
    search() {
      this.init()
    },
    fetch({ current, size }, params) {
      return this.fn(current, size, params).then((res) => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },

    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    getData() {
      getStoreCodeList({ platformCode: 'EB' }).then(res => {
        res.data && (this.formItem[0].options = res.data)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.small {
    width: 245px !important;
}
.g-select {
    width: 245px !important;
}
.el-select {
    width: 245px !important;
}
.el-date-editor--daterange.el-input__inner {
    width: 245px;
}
</style>
