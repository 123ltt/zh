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
            <el-button type="primary" @click="search">查询</el-button>
            <el-button :disabled="!addData.length" type="primary" @click="add">添加</el-button>
            <el-button @click="cancel">取消</el-button>
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
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import { getSettlementList } from '@/api/settlement'
import { getPageDict } from '@/api/system/dictbiz'
export default {
  components: {
    colsForm
  },
  data() {
    return {
      formInfo: {
        status: 2
      },
      formItem: [
        { label: '物流商简称', prop: 'lpAbbreviation', type: 'input', disabled: true },
        { label: '结算单号', prop: 'settlementNum', type: 'input' }
      ],
      settlePeriod: [],
      statuList: [],
      addData: [],
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
        { slot: true, slotName: 'status', label: '状态' }
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
    search() {
      this.init()
    },
    getSettlePeriod(data) {
      return this.settlePeriod[data - 1]?.dictValue
    },
    getStatus(data) {
      return this.statuList[data - 1]?.dictValue
    },
    getSelectData() {
      getPageDict({ code: 'logistic_settlement_status' }).then(res => {
        this.statuList = res.data[0].children
      })
      getPageDict({ code: 'settle_period' }).then(res => {
        this.settlePeriod = res.data[0].children
      })
    },
    handleSelectionChange(val) {
      this.addData = val
    },
    add() {
      this.$emit('close', this.addData)
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
