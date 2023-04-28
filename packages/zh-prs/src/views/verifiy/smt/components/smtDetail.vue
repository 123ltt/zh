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
    <template slot="remark">
      <el-table-column v-slot="{row}" label="备注">
        <g-text-ellipsis>
          {{ row.remark }}
        </g-text-ellipsis>
      </el-table-column>
    </template>
  </g-table>
</template>

<script>
import { getSmtBillDetail } from '@/api/stm/stm'
import { getStoreCodeList, getMyDictBiz } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import handelDownload from '@/views/components/handelDownload'
export default {
  name: 'SmtDetail',
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
        type: 'input',
        label: '订单编号',
        prop: 'platformOrderNum',
        placeholder: '多个用英文逗号隔开'

      },
      {
        type: 'datePicker',
        label: '交易时间',
        prop: 'date'
      },
      {
        type: 'select',
        label: '交易类型',
        prop: 'type',
        options: []
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
        { label: '时间', prop: 'time' },
        { label: '类型', prop: 'tradeType' },
        { label: '订单编号', prop: 'platformOrderNum' },
        { label: '流水号', prop: 'flowNum' },
        { label: '支付宝交易号', prop: 'aliTradeNum' },
        { label: '金额', prop: 'amount' },
        { label: '余额', prop: 'balance' },
        { label: '币种', prop: 'currency' },
        { slot: true, slotName: 'remark' }
      ]

    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.orderBegin = val?.[0]
      this.formInfo.orderEnd = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {

    getAllData() {
      getSmtBillDetail(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    getData() {
      getStoreCodeList({ platformCode: 'SM' }).then(res => {
        this.formItem[0].options = res.data
      })
      getMyDictBiz('smt_trade_type').then(res => {
        this.formItem[3].options = res.data
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
      return getSmtBillDetail(current, size, params).then((res) => {
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
