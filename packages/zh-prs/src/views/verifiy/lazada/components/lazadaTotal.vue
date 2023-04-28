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
      <handel-download :all-data="allData" :part-data="exportData" :headers="headers" @getAllData="getAllData" />
    </template>
  </g-table>
</template>
<script>
import handelDownload from '@/views/components/handelDownload'
import { getPaidStatus, getLazadaTotal } from '@/api/lazada/lazada'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'

export default {
  name: 'LazadaTotal',
  components: { handelDownload, colsForm },

  data() {
    return {
      allData: [],
      headers: [
        { width: '55', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单开始时间', prop: 'billDateBegin' },
        { label: '账单结束时间', prop: 'billDateEnd' },
        { label: '站点', prop: 'site' },
        { label: 'Paid status', prop: 'paidStatus' },
        { label: 'Statement', prop: 'statement' },
        { label: '费用明细', prop: 'feeName' },
        { label: '金额（原币）', prop: 'billAmount' },
        { label: '金额（USD）', prop: 'billAmountUsd' }

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
          label: '账单时间',
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
        paidStatus: ''
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
    getAllData() {
      getLazadaTotal(1, 5000, this.formInfo).then(res => {
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
      return getLazadaTotal(current, size, params).then((res) => {
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
