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
    <el-table-column slot="accountingPeriod" label="账单月份">
      <template v-slot="{row}">
        <span>{{ row.accountingPeriod.slice(0,7) }}</span>
      </template>
    </el-table-column>
  </g-table>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import { getEbayBillTotal } from '@/api/ebay/ebay'
import handelDownload from '@/views/components/handelDownload'
import { filterData } from '../../../../utils/filterData'
import { getMyDictBiz } from '@/api/common'
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
        { type: 'input', label: 'paypal账户', prop: 'mainAccountNumberList', placeholder: '多个用英文逗号隔开' },
        { type: 'select', label: '账单币种', prop: 'ebayCurrency', options: [] },
        { type: 'datePicker', label: '账单月份', prop: 'date', dateType: 'monthrange', valueFormat: 'yyyyMM' },
        { type: 'select', label: '余额影响', prop: 'causeChangesBalance', options: [] },
        { type: 'input', label: '文件名称', prop: 'fileName', placeholder: '模糊查询' }
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
        { label: 'PayPal账号', prop: 'mainAccountNumber', width: '150' },
        // { label: '账单月份', prop: 'accountingPeriod' },
        { slot: true, slotName: 'accountingPeriod' },
        { label: '类型', prop: 'ebayType', width: '150' },
        { label: '币种', prop: 'ebayCurrency' },
        { label: '余额影响', prop: 'causeChangesBalance' },
        { label: '总额', prop: 'ebayTotal' },
        { label: '费用', prop: 'ebayCost' },
        { label: '净额', prop: 'ebayNet' },
        { label: '文件名', prop: 'fileName', width: '150' }
      ],
      exportData: [], // 导出数据
      allData: [],
      dateTime: [],
      fn: getEbayBillTotal // 接口名
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.billBegin = val?.[0]
      this.formInfo.billEnd = val?.[1]
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
      getMyDictBiz('account_currency').then((res) => {
        if (res.data) {
          this.formItem[1].options = res.data
        }
      })
      getMyDictBiz('cause_changes_balance').then((res) => {
        if (res.data) {
          this.formItem[3].options = res.data
        }
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
