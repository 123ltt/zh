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
        <cols-form ref="formRef" :cols="2" :form-item="formItem" :form-info="formInfo" :form-handler="formHandler" />
      </template>
      <template v-slot:bill="{data}">
        <el-table-column label="账单">
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <template v-slot:flow="{data}">
        <el-table-column label="流水">
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <el-table-column slot="status" label="匹配状态">
        <template v-slot="{row}">
          {{ getFlowStatus(row.status) || "--" }}
        </template>
      </el-table-column>
      <el-table-column slot="operation" width="120" label="操作">
        <template v-slot="{row}">
          <auto-button v-if="row.status === 1" auto-confirm :confirm-config="{message: '确认核销该条记录？'}" @confirm="doBillOff(row)">核销</auto-button>
          <el-button v-if="row.status === 3" type="text" @click="adjustBill(row)">调整</el-button>
          <el-button v-if="row.status === 5" type="text" @click="matchWater(row)">匹配流水</el-button>
          <el-button v-if="row.status === 6" type="text" @click="carryForward(row)">结转</el-button>
          <el-button type="text" @click="goDetailPage(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import AutoButton from '@/views/components/autoButton.vue'
import { getStoreCodeList, getFlowPage, getFlowStatus } from '@/api/common'
import carryForward from '@/views/verifiy/modal/carryForward'
import batchOperation from '../modal/batchOperation'
import matchBill from '../modal/matchBill'
import flowAdjust from '../modal/flowAdjust'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyJdFlow',
  components: { colsForm, AutoButton },
  data() {
    return {
      formInfo: {},
      formItem: [
        {
          label: '店铺编码',
          prop: 'storeCode',
          type: 'gselect',
          optionValue: 'value',
          options: []
        },
        {
          label: '匹配状态',
          type: 'select',
          prop: 'status',
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
      headers: [
        { width: '50', type: 'selection' },
        { label: '店铺编码', prop: 'storeCode' },
        {
          slot: true,
          slotName: 'bill',
          list: [
            { label: '账单ID', prop: 'billId' },
            { label: '账单币种', prop: 'billCurrency' },
            { label: '账单放款', prop: 'billAmount' }
          ]
        },
        {
          slot: true,
          slotName: 'flow',
          list: [
            { label: '收款账号', prop: 'payeeAccount' },
            { label: '到账时间', prop: 'receivedDate' },
            { label: '交易流水号', prop: 'flowNumber' },
            { label: '流水币种', prop: 'flowCurrency' },
            { label: '到账流水', prop: 'flowReceived' }
          ]
        },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'operation' }
      ],
      batchData: []
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    reset() {
      this.formInfo = {}
      this.init()
    },
    search() {
      this.init()
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      Object.assign(params, { platformCode: 'JD' })
      return getFlowPage(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 获取下拉列表数据
    getData() {
      getStoreCodeList({ platformCode: 'JD' }).then((res) => {
        if (res.success && res.data) {
          this.formItem[0].options = res.data
        }
      })
      getFlowStatus().then(res => {
        this.formItem[1].options = res.data
      })
    },
    getFlowStatus(val) {
      return this.formItem[1].options.find(item => item.key === val)?.value
    },
    // 选中
    handleSelectionChange(val) {
      this.batchData = val
    },
    // 单个核销
    doBillOff(row) {
      this.$message({
        type: 'success',
        message: '核销成功'
      })
    },
    // 批量核销
    batchVerify() {
      if (!this.batchData.length) {
        return this.$message({
          type: 'warning',
          message: '请至少选择一条记录'
        })
      }
      this.$modal({
        title: '批量核销',
        component: batchOperation,
        width: '38%',
        data: this.batchData,
        callback: (val) => {
          val && this.init()
        }
      })
    },
    // 匹配流水
    matchWater(row) {
      this.$modal({
        title: '匹配流水',
        component: matchBill,
        width: '38%',
        data: { row: { ...row, platformCode: 'JD' } },
        callback: val => {
          val && this.init()
        }
      })
    },
    // 人工调整
    adjustBill(row) {
      this.$modal({
        title: '调整',
        component: flowAdjust,
        width: '30%',
        data: { row: { ...row } },
        callback: val => {
          val && this.init()
        }
      })
    },
    // 结转
    carryForward(row) {
      this.$modal({
        width: '38%',
        title: '结转',
        component: carryForward,
        callback: (val) => {
          val && this.init()
        },
        data: { row: { ...row } }
      })
    },
    // 查看详情
    goDetailPage(row) {
      this.$newTab({
        path: 'jd/flow/detail',
        title: '订单核销详情',
        component: detailBill,
        clearCache: true,
        data: {
          info: { id: row.id, isVerify: 0, platformCode: 'JD' },
          detailType: 'flow'
        }
      })
    }
  }
}
</script>
