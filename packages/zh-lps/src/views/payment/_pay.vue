<template>
  <basic-container>
    <g-table ref="tableRef"
             :headers="headers"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
             @selection-change="handleSelectionChange"
    >
      <template #header>
        <cols-form :form-info="formInfo" :form-item="formItem" :label-width="'110px'">
          <el-form-item slot="handleBtn">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item slot="handleBtn">
            <el-button type="primary" @click="add">添加物流付款单</el-button>
            <handle-down :all-data="allData"
                         :part-data="exportData"
                         :headers="headers.filter(item => {return item.slotName !== 'operation'})"
                         @getAllData="getAllData"
            />
          </el-form-item>
        </cols-form>
      </template>
      <el-table-column slot="operation" label="操作" width="150px" fixed="right">
        <template>
          <el-button type="text">审核</el-button>
          <el-button type="text">打回</el-button>
          <el-button type="text">删除</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">出纳付款</el-button>
          <el-button type="text">附件下载</el-button>
          <el-button type="text">操作记录</el-button>
          <el-button type="text" @click="printPay">打印</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import addPay from './components/addPay.vue'
import colsForm from '@/views/components/colsForm.vue'
import handleDown from '@/views/components/handleDown'
import { getPayPage } from '@/api/payment'
import { getPageDict } from '@/api/system/dictbiz'
import { getLogisticProviders } from '@/api/common'
export default {
  name: 'LpsSettlementEntry',
  components: {
    colsForm,
    handleDown
  },
  data() {
    return {
      formInfo: {},
      allData: [],
      exportData: [],
      selectDate: [],
      formItem: [
        {
          label: '物流商简称',
          type: 'gselect',
          prop: 'lpAbbreviation',
          optionValue: 'lpAbbreviation',
          optionLabel: 'lpAbbreviation',
          options: []
        },
        { label: '付款周期', type: 'select', prop: 'settlePeriod' },
        { label: '币种', type: 'select', prop: '22', options: [] },
        { label: '状态', type: 'select', prop: '11' },
        {
          labelSlot: true,
          labelProp: 'dataType',
          labelOptions: [{ key: 1, value: '付款时间' }, { key: 2, value: '申请时间' }],
          type: 'datePicker',
          prop: 'date1'
        }
      ],
      headers: [
        { type: 'selection', width: '55' },
        { label: '付款单号', prop: 'payNum' },
        { label: '物流商金蝶编码', prop: 'lpCode' },
        { label: '物流商名称', prop: 'lpAbbreviation' },
        { label: '付款方式', prop: 'payType' },
        { label: '结算周期', prop: 'payPeriod' },
        { label: '申付金额', prop: '' },
        { label: '实付金额', prop: 'actualPayAmount' },
        { label: '币种', prop: 'settlementCurrency' },
        { label: '账期', prop: 'billPeriod' },
        { label: '申请人', prop: 'createUser' },
        { label: '申请时间', prop: 'createTime' },
        { label: '审核人', prop: 'updateUser' },
        { label: '审核时间', prop: 'updateTime' },
        { label: '付款时间', prop: 'payTime' },
        { label: '单据状态', prop: 'status' },
        { slot: true, slotName: 'operation' }
      ]
    }
  },
  mounted() {
    this.init()
    this.getSelectData()
  },
  methods: {
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    handleSelectionChange(val) {
      this.selectDate = val
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
    },
    getSelectData() {
      getLogisticProviders().then(res => {
        this.formItem[0].options = res.data
      })
      getPageDict({ code: 'settle_period' }).then(res => {
        this.formItem[1].options = res.data[0].children
      })
      getPageDict({ code: 'settle_currency' }).then(res => {
        this.formItem[2].options = res.data[0].children
      })
      getPageDict({ code: 'logistic_payment_status' }).then(res => {
        this.formItem[3].options = res.data[0].children
      })
    },
    add() {
      this.$modal({
        title: '添加物流付款单',
        width: '820px',
        component: addPay,
        clearCache: true,
        data: {
          // verifyBillId: row.id
        },
        callback: (val) => {
          // val && this.init()
        }
      })
    },
    printPay() {
      this.$newPage({
        path: 'lps/newpage/paymentTicket', // 对应 src/views/pms/test.vue 文件
        data: {
          name: ''
          // age: 18
        },
        callback() {

        }
      })
    },
    getAllData() {
      getPayPage(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    fetch({ current, size }, params) {
      return getPayPage(current, size, params).then(res => {
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
