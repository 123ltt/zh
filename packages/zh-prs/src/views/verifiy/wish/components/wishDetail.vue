<template>
  <g-table
    ref="tableRef"
    :key="wishType"
    stripe
    border
    :headers="headers"
    :fetch="fetch"
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
    @selection-change="handleSelectionChange"
  >
    <template slot="header">
      <el-form
        ref="rulesForm"
        size="mini"
        :model="formInfo"
        label-width="150px"
        class="form-col"
      >
        <el-row type="flex">
          <el-col>
            <el-form-item label="店铺编码:">
              <el-select
                v-model="stores"
                placeholder="请选择"
                clearable
              >
                <el-option v-for="item in storeList" :key="item.value" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div slot="label">
                <el-select
                  v-model="dateType"
                  placeholder="请选择"
                  style="width: 100px !important"
                >
                  <el-option
                    v-for="item in dateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <el-date-picker
                v-model="dateTime"
                type="daterange"
                clearable
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订单编号:">
              <el-input
                v-model="orderIdList"
                class="small"
                clearable
                placeholder="多个用英文逗号隔开"
              />
            </el-form-item>
            <el-form-item label="账单类型:">
              <el-select
                v-model="wishType"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in wishTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button
                size="mini"
                type="primary"
                @click="search(formInfo.billIds)"
              >查询</el-button>
              <el-button size="mini"
                         type="primary"
                         @click="reset"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
import {
  getWishBillOrderPage,
  getWishBillOthersPage,
  getWishBillRefundedPage,
  getWishBillWithheldPage,
  getWishBillWithheldReleasedPage
} from '@/api/wish/wish'
import { getStoreCodeList } from '@/api/common'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../../utils/filterData'
export default {
  name: 'WishDetail',
  components: { handelDownload },
  data() {
    return {
      formInfo: {
        storeCode: '',
        billDateBegin: '',
        billDateEnd: '',
        invoiceDateBegin: '',
        invoiceDateEnd: '',
        orderIdList: '',
        billType: ''
      },
      dateOptions: [
        { label: '账单日期', value: 'invoiceDate' },
        { label: 'Date', value: 'date' }
      ],
      wishTypeOptions: [
        {
          label: 'Transactions Being Paid',
          value: 'TBP'
        },
        {
          label: 'Withheld Transactions Released',
          value: 'WTR'
        },
        { label: 'Withheld Payments', value: 'WP' },
        {
          label: 'Transactions Being Refunded',
          value: 'TBR'
        },
        { label: 'Fines', value: 'Fines' },
        { label: 'Fees', value: 'Fees' },
        { label: 'Others Payments', value: 'OP' }
      ],
      wishType: 'TBP',
      dateTime: [],
      dateType: 'invoiceDate',
      headers: [],
      fn: getWishBillOrderPage,
      orderIdList: '',
      storeList: [],
      exportData: [], // 导出数据
      allData: [],
      downloadLoading: '',
      invoiceNumberList: '',
      stores: '',

      headersTBP: [
        { width: '55', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode', width: '150' },
        { label: '账单日期', prop: 'invoiceDate', width: '150' },
        { label: '账单ID', prop: 'invoiceNumber', width: '200' },
        { label: 'Date', prop: 'transactionDate', width: '150' },
        { label: 'Order ID', prop: 'orderId', width: '200' },
        {
          label: 'Transaction ID',
          prop: 'transactionId',
          width: '200'
        },
        { label: 'Quantity', prop: 'quantity' }, //
        { label: 'Currency', prop: 'currency' },
        { label: 'Price', prop: 'price' },
        { label: 'Shipping', prop: 'price' },
        { label: 'Cost', prop: 'cost' },
        { label: 'Shipping Cost', prop: 'shippingCost' },
        { label: 'Total Cost', prop: 'totalCost' },
        { label: 'Refund Type', prop: 'refundType' },
        { label: 'Refunded Amount', prop: 'refundedAmount' },
        {
          label: 'Refund Responsibility %',
          prop: 'refundResponsibilityRate',
          width: '150'
        },
        {
          label: 'Refund Responsibility',
          prop: 'refundResponsibility',
          width: '150'
        },
        { label: 'Tax', prop: 'tax' },
        { label: 'Paid Amount', prop: 'paidAmount' },
        { label: 'Price & Shipping', prop: 'priceShipping' },
        { label: 'Revenue Share %', prop: 'revenueShare' },
        { label: 'Commission', prop: 'commission' }
      ],
      headersTBR: [
        { width: '55', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode', width: '150' },
        { label: '账单日期', prop: 'invoiceDate', width: '150' },
        { label: '账单ID', prop: 'invoiceNumber', width: '200' },
        { label: 'Date', prop: 'transactionDate', width: '150' },
        { label: 'Order ID', prop: 'orderId', width: '200' },
        {
          label: 'Transaction ID',
          prop: 'transactionId',
          width: '200'
        },
        { label: 'Quantity', prop: 'quantity' }, //
        { label: 'Currency', prop: 'currency' },
        { label: 'Price', prop: 'price' },
        { label: 'Shipping', prop: 'shipping' },
        { label: 'Cost', prop: 'cost' },
        { label: 'Shipping Cost', prop: 'shippingCost' },
        { label: 'Total Cost', prop: 'totalCost' },
        { label: 'Refund Type', prop: 'refundType', width: '150' },
        { label: 'Refunded Amount', prop: 'refundedAmount' },
        {
          label: 'Refund Responsibility %',
          prop: 'refundResponsibilityRate',
          width: '150'
        },
        {
          label: 'Refund Responsibility',
          prop: 'refundResponsibility',
          width: '150'
        },
        { label: 'Tax', prop: 'tax' },
        { label: 'Deducted Amount', prop: 'deductedAmount' }
      ],
      headersWP: [
        { width: '55', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode', width: '150' },
        { label: '账单日期', prop: 'invoiceDate', width: '150' },
        { label: '账单ID', prop: 'invoiceNumber', width: '200' },
        { label: 'Date', prop: 'transactionDate', width: '150' },
        { label: 'Order ID', prop: 'orderId', width: '200' },
        { label: 'Reason', prop: 'reason', width: '300' },
        { label: 'Currency', prop: 'currency' },
        { label: 'Withheld Amount', prop: 'withheldAmount' },
        { label: 'Withheld Tax', prop: 'withheldTax' },
        { label: 'Amount', prop: 'amount' }
      ],
      headersWTR: [
        { width: '55', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode', width: '150' },
        { label: '账单日期', prop: 'invoiceDate', width: '150' },
        { label: '账单ID', prop: 'invoiceNumber', width: '200' },
        { label: 'Date', prop: 'transactionDate', width: '150' },
        { label: 'Order ID', prop: 'orderId', width: '200' },
        { label: 'Currency', prop: 'currency' },
        { label: 'Amount Released', prop: 'amountReleased' },
        { label: 'Tax Released', prop: 'taxReleased' },
        { label: 'Amount Paid', prop: 'amountPaid' }
      ],
      headersFines: [
        { width: '55', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode', width: '150' },
        { label: '账单日期', prop: 'invoiceDate', width: '150' },
        { label: '账单ID', prop: 'invoiceNumber', width: '200' },
        { label: 'Date', prop: 'transactionDate', width: '150' },
        { label: 'Reason', prop: 'reason', width: '300' },
        { label: 'Currency', prop: 'currency' },
        { label: 'Amount', prop: 'amount' }
      ]
    }
  },
  watch: {
    wishType: function(val) {
      this.$refs.tableRef.tableList = []
      if (val === 'TBP' || val === '') {
        this.headers = this.headersTBP
        this.fn = getWishBillOrderPage
      } else if (val === 'TBR') {
        this.headers = this.headersTBR
        this.fn = getWishBillRefundedPage
      } else if (val === 'WP') {
        this.headers = this.headersWP
        this.fn = getWishBillWithheldPage
      } else if (val === 'WTR') {
        this.headers = this.headersWTR
        this.fn = getWishBillWithheldReleasedPage
      } else {
        this.headers = this.headersFines
        if (this.wishType === 'Fines') {
          this.formInfo.billType = '1'
        } else if (this.wishType === 'Fees') {
          this.formInfo.billType = '2'
        } else {
          this.formInfo.billType = '3'
        }
        this.fn = getWishBillOthersPage
      }
      this.$nextTick(() => {
        this.$refs.tableRef.load(1, this.formInfo)
      })
    }
  },
  created() {
    this.headers = this.headersTBP
  },
  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    // 选择获取数据
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
      this.formData = {}
      this.orderIdList = ''
      this.stores = ''
      this.dateTime = []
      this.init()
    },
    search() {
      this.formInfo.orderIdList = this.orderIdList
      this.formInfo.storeCode = this.stores
      if (this.dateTime && this.dateType === 'date') {
        this.formInfo.billDateBegin = this.dateTime[0]
        this.formInfo.billDateEnd = this.dateTime[1]?.replace(
          /00:00:00/,
          '23:59:59'
        )
      } else {
        this.formInfo.billDateBegin = ''
        this.formInfo.billDateEnd = ''
      }
      if (this.dateTime && this.dateType === 'invoiceDate') {
        this.formInfo.invoiceDateBegin = this.dateTime[0]
        this.formInfo.invoiceDateEnd = this.dateTime[1]?.replace(
          /00:00:00/,
          '23:59:59'
        )
      } else {
        this.formInfo.invoiceDateBegin = ''
        this.formInfo.invoiceDateEnd = ''
      }
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
    getData() {
      getStoreCodeList({ platformCode: 'WH' }).then((res) => {
        this.storeList = res.data
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
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
    width: 245px !important;
}
</style>
