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
import { getVovaTotal } from '@/api/vova/vova'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'VovaTotal',
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
        type: 'datePicker',
        label: '账单日期',
        prop: 'date'
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
        { label: '账单日期', prop: 'billDate' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '总收入（含佣金）', prop: 'orderTotal' },
        { label: '总收入（不含佣金）', prop: 'orderTotalNotCommission' },
        { label: '佣金', prop: 'commission' },
        { label: '退款', prop: 'refund' },
        { label: '扣款（fine）', prop: 'fineAmount' },
        { label: '支付金额', prop: 'payAmount' },
        { label: '账单理应放款', prop: 'shouldLoan' },
        { label: '文件名称', prop: 'fileName' }
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
    this.init()
    this.getData()
  },
  methods: {
    getAllData() {
      getVovaTotal(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    getData() {
      getStoreCodeList({ platformCode: 'VV' }).then(res => {
        this.formItem[0].options = res.data
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
    fetch({ current, size }, params) {
      return getVovaTotal(current, size, params).then((res) => {
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
