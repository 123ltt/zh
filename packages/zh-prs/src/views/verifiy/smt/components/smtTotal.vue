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
import { getSmtBillSummary } from '@/api/stm/stm'
import { getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'SmtTotal',
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
        label: '账单时间',
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
        { label: '店铺编码', prop: 'storeCode' },
        { label: '开始时间', prop: 'billBegin' },
        { label: '结束时间', prop: 'billEnd' },
        { label: '币种', prop: 'currency' },
        { label: '期初', prop: 'beginBalance' },
        { label: '资金迁移', prop: '资金迁移' },
        { label: '放款', prop: '放款' },
        { label: '转账', prop: '转账' },
        { label: '提现手续费', prop: '提现手续费' },
        { label: '提现失败', prop: '提现失败' },
        { label: '物流费', prop: '物流费' },
        { label: '平台佣金', prop: '平台佣金' },
        { label: '联盟佣金', prop: '联盟佣金' },
        { label: '垫付还款', prop: '垫付还款' },
        { label: '物流赔付', prop: '物流赔付' },
        { label: '保险费', prop: '保险费' },
        { label: '退款', prop: '退款' },
        { label: '平台佣金退回', prop: '平台佣金退回' },
        { label: '联盟佣金退回', prop: '联盟佣金退回' },
        { label: '其他', prop: '其他' },
        { label: '期末', prop: 'endBalance' },
        { label: '差异校验', prop: 'diffCheck' }
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
    // 格式化数据动态添加表头
    dynamicData(data) {
      data.forEach(item => {
        item.feeCollectionJson = JSON.parse(item.feeCollectionJson)

        item.feeCollectionJson.forEach(ele => {
          item[ele.name] = ele.amount
        })
        // 如果没有返回表头字段数据,就'--'
        // this.headers.slice(1).forEach(ele => {
        //   item[ele.prop] || (item[ele.prop] = '--')
        // })
      })

      return data
    },
    getAllData() {
      getSmtBillSummary(1, 50000, this.formInfo).then(res => {
        this.allData = this.dynamicData(res.data.records)
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    getData() {
      getStoreCodeList({ platformCode: 'SM' }).then(res => {
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
      return getSmtBillSummary(current, size, params).then((res) => {
        this.dynamicData(res.data.records)
        this.$refs.formRef.filterData(res.data.records, this.headers.slice(1))
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
