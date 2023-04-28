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
        <cols-form :form-info="formInfo" :form-item="formItem">
          <el-form-item slot="handleBtn">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item v-if="!$route.query.id" slot="handleBtn">
            <handle-down :all-data="allData"
                         :part-data="exportData"
                         :headers="headers.filter(item => {return item.slotName !== 'operation'})"
                         @getAllData="getAllData"
            />
            <el-button type="primary" size="mini" :disabled="isVerify" @click="geneartePayOrder">生成付款单</el-button>
            <el-button type="primary" size="mini" :disabled="isVerify" @click="verify(1)">批量反审</el-button>
            <el-button type="primary" size="mini" :disabled="isNoVerify" @click="verify(2)">批量审核</el-button>
            <el-button type="primary" size="mini" :disabled="isNoVerify" @click="batchDel">批量删除</el-button>
          </el-form-item>
        </cols-form>
      </template>
      <el-table-column slot="settlePeriod" label="结算周期">
        <template v-slot="{row}">
          <span>{{ getSettlePeriod(row.settlePeriod) || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="status" label="状态">
        <template v-slot="{row}">
          <span>{{ getStatus(row.status) || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="operation" fixed="right" width="110px" label="操作">
        <template v-slot="{row}">
          <el-button type="text">查看明细</el-button>
          <el-button type="text" :disabled="!(row.status==1)" @click="edit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import handleDown from '@/views/components/handleDown'
import colsForm from '@/views/components/colsForm.vue'
import payOrder from './components/payOrder.vue'
import newStatement from './components/newStatement.vue'
import { getSettlementList, settlementVerify, settlementBatchDele } from '@/api/settlement'
import { getPageDict } from '@/api/system/dictbiz'
import { getShipmentType, getLogisticProviders } from '@/api/common'
export default {
  name: 'LpsSettlementSettlement',
  components: {
    handleDown,
    colsForm
  },
  data() {
    return {
      exportData: [],
      allData: [],
      formInfo: {},
      ids: '',
      isVerify: true,
      isNoVerify: true,
      settlePeriod: '',
      formItem: [
        {
          label: '物流商简称',
          type: 'gselect',
          prop: 'lpAbbreviation',
          optionValue: 'lpAbbreviation',
          optionLabel: 'lpAbbreviation',
          options: []
        },
        { label: '结算单号', type: 'input', prop: 'settlementNum' },
        { label: '发货方式', type: 'select', prop: 'shipmentType', options: [] },
        { label: '状态', type: 'select', prop: 'status', options: [] }
      ],
      headers: [
        { type: 'selection', width: '55' },
        { label: '结算单号', prop: 'settlementNum' },
        { label: '物流商简称', prop: 'lpAbbreviation' },
        // { label: '结算周期', prop: 'settlePeriod' },
        { slot: true, slotName: 'settlePeriod' },
        { label: '发货方式', prop: 'shipmentType' },
        { label: '折扣情况', prop: 'discount' },
        { label: '物流商重量', prop: 'logisticWeight' },
        { label: '物流商金额', prop: 'logisticAmount' },
        { label: '公司重量', prop: 'ownWeight' },
        { label: '公司金额', prop: 'ownAmount' },
        { label: '退款金额', prop: 'returnAmount' },
        { label: '返利金额', prop: 'rebateAmount' },
        { label: '其他调整', prop: 'adjustAmount' },
        { label: '本期应结算', prop: 'shouldSettleAmount' },
        { label: '核销金额', prop: 'prePaymentAmount' },
        { label: '本期实付款', prop: 'actualPayAmount' },
        { label: '本期末余额', prop: 'currentBalanceAmount' },
        { label: '备注', prop: 'remark' },
        { label: '付款单号', prop: 'payNum' },
        // { label: '状态', prop: 'status' },
        { slot: true, slotName: 'status', label: '状态' },
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
    getStatus(data) {
      return this.formItem[3].options[data - 1]?.dictValue
    },
    getSettlePeriod(data) {
      return this.settlePeriod[data - 1]?.dictValue
    },
    getSelectData() {
      getPageDict({ code: 'logistic_settlement_status' }).then(res => {
        this.formItem[3].options = res.data[0].children
      })
      getPageDict({ code: 'settle_period' }).then(res => {
        this.settlePeriod = res.data[0].children
      })
      getShipmentType().then(res => {
        this.formItem[2].options = res.data
      })
      getLogisticProviders().then(res => {
        this.formItem[0].options = res.data
      })
    },
    // 查询导出的所有数据
    getAllData() {
      getSettlementList(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    search() {
      this.init()
    },
    handleSelectionChange(val) {
      this.exportData = val
      if (!this.exportData.length) {
        this.isVerify = true
        this.isNoVerify = true
      } else {
        this.isVerify = this.exportData.some(item => { return item.status === 1 })
        this.isNoVerify = this.exportData.some(item => { return item.status === 2 })
        this.ids = this.exportData.map(item => item.id).join(',')
      }
    },

    verify(status) {
      settlementVerify({ ids: this.ids, status }).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    batchDel() {
      settlementBatchDele({ ids: this.ids }).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    edit(row) {
      this.$newTab({
        path: 'settlement/entry/editStatement',
        title: '编辑' + row.settlementNum,
        component: newStatement,
        clearCache: true,
        data: {
          tableData: [],
          rowData: row
        },
        callback: (val) => {
          val && this.init()
        }
      })
    },
    geneartePayOrder() {
      this.$newTab({
        path: 'settlement/settlement/payOrder',
        title: '生成付款单',
        component: payOrder,
        clearCache: true,
        data: {
          tableData: this.exportData
        }
      })
    },
    fetch({ current, size }, params) {
      return getSettlementList(current, size, params).then(res => {
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
