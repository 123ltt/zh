<template>
  <g-table ref="tableRef"
           :headers="headers"
           :fetch="fetch"
           :header-cell-style="{'text-align':'center'}"
           :cell-style="{'text-align':'center'}"
           @selection-change="handleSelectionChange"
  >
    <template #header>
      <cols-form ref="formRef" :cols="2" :form-info="formInfo" :form-item="formItem" :form-handler="formHandler" />
      <el-row type="flex">
        <sort-button ref="sortRef"
                     :list="buttonList"
                     @sortClick="sortClick"
        />
        <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
      </el-row>
    </template>
  </g-table>
</template>
<script>
import handelDownload from '@/views/components/handelDownload'
import { getPaidStatus, getLazadaDetail } from '@/api/lazada/lazada'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import sortButton from '@/views/components/sortButtonOne'

export default {
  name: 'LazadaDetail',
  components: { handelDownload, colsForm, sortButton },
  data() {
    return {
      buttonList: [
        { label: '交易日期', value: 1 },
        { label: 'Amount', value: 2 }
      ],
      allData: [],
      headers: [
        { width: '55', type: 'selection' },

        { label: '店铺编码', prop: 'storeCode' },
        { label: '站点', prop: 'site' },
        { label: 'transactionDate', prop: 'transactionDate', width: '100' },
        { label: 'Transaction Number', prop: 'transactionNumber' },
        { label: 'Seller SKU', prop: 'sellerSku' },
        { label: 'Lazada SKU', prop: 'lazadaSku' },
        { label: 'Order No.', prop: 'orderNo' },
        { label: 'Fee Name', prop: 'feeName' },
        { label: 'Amount', prop: 'amount', width: '100' },
        { label: 'VAT in Amount', prop: 'vatInAmount' },
        { label: 'WHT Amount', prop: 'whtAmount' },
        { label: 'Statement', prop: 'statement' },
        { label: 'Paid Status', prop: 'paidStatus' },
        { label: 'Comment', prop: 'comment' },
        { label: 'PaymentRefId', prop: 'paymentRefId' }

      ],
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          label: '店铺编码',
          prop: 'storeCode',
          options: []
        },

        {
          type: 'input',
          label: 'Statement',
          prop: 'statementList',
          placeholder: '多个用英文逗号隔开'
        },
        {
          type: 'datePicker',
          label: '交易日期',
          prop: 'date'

        },
        {
          type: 'bselect',
          label: 'Paid status',
          prop: 'paidStatus',
          options: []
        }

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
      exportData: [],
      formInfo: {
        storeCode: '',
        billDateBegin: '',
        billDateEnd: '',
        statementList: '',
        paidStatus: '',
        sortOrder: '',
        sortField: ''
      },
      date: [],
      storeList: {},
      payList: {}
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.billDateBegin = val?.[0]
      this.formInfo.billDateEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.getData()
    this.init()
  },

  methods: {
    sortClick(value, type) {
      this.formInfo.sortField = value
      this.formInfo.sortOrder = type
      this.init()
    },

    getAllData() {
      getLazadaDetail(1, 5000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {
        statementList: ''
      }
      // 重置排序
      this.$refs.sortRef.resetSort()
      this.init()
    },
    getData() {
      getPaidStatus().then((res) => {
        this.payList = res.data
        this.payList.unshift('All')
        this.formItem[3].options = this.payList
      })

      getStoreCodeList({ platformCode: 'LZ' }).then((res) => {
        this.storeList = res.data
        this.formItem[0].options = this.storeList
      })
    },
    init() {
    // 当选择all,传null过去
      (this.formInfo.paidStatus === 'All') && (this.formInfo.paidStatus = null
      )
      this.$refs.tableRef.load(1, this.formInfo)
    },
    // 选择获取数据
    handleSelectionChange(val) {
      this.exportData = val
    },
    fetch({ current, size }, params) {
      return getLazadaDetail(current, size, params).then((res) => {
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

  </style>
