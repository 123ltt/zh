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
import { getWalmartTotal } from '@/api/walmart/walmart'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'WalmartTotal',
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
        type: 'bselect',
        label: '站点名称',
        prop: 'station',
        options: ['ALL', 'CA', 'US']
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
        {
          label: '账单日期',
          prop: 'billDate'
        },
        {
          label: '店铺编码',
          prop: 'storeCode'
        },
        {
          label: '站点',
          prop: 'station'
        },

        {
          label: '币种',
          prop: 'currency'
        },
        {
          label: '总销售额',
          prop: 'totalSales'
        },
        {
          label: '总税费',
          prop: 'totalTax'
        },
        {
          label: '不含税销售额',
          prop: 'noTaxSales'
        },
        {
          label: '平台费用',
          prop: 'platformFee'
        },
        {
          label: '账单放款',
          prop: 'billLending'
        },
        {
          label: '文件名称',
          prop: 'fileName',
          width: '150'

        },
        {
          label: '备注',
          prop: 'remark'
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
    this.init()
    this.getData()
  },
  methods: {
    getAllData() {
      getWalmartTotal(1, 50000, this.formInfo).then(res => {
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
      (this.formInfo.station === 'ALL') && (this.formInfo.station = null
      )
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {

      }
      this.init()
    },
    fetch({ current, size }, params) {
      return getWalmartTotal(current, size, params).then((res) => {
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
