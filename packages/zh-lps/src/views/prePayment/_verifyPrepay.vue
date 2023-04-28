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
        <colsForm :form-info="formInfo" :form-item="formItem" :label-width="'96px'">
          <el-form-item slot="handleBtn">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item slot="handleBtn">
            <el-button type="primary" plain size="mini" icon="el-icon-upload2" @click="upload">导入</el-button>
            <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="add">新增</el-button>
            <handle-down :all-data="allData"
                         :part-data="exportData"
                         :headers="headers"
                         @getAllData="getAllData"
            />
          </el-form-item>
        </colsForm>
      </template>
      <el-table-column slot="status" label="状态">
        <template v-slot="{row}">
          <span>{{ getStatus(row) || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="operation" fixed="right" width="110px" label="操作">
        <template v-slot="{row}">
          <el-button type="text" :disabled="row.status!==1&&row.status!==2" @click="edit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import handleDown from '@/views/components/handleDown'
import colsForm from '@/views/components/colsForm.vue'
import uploadFile from './components/uploadFile.vue'
import addPrepay from './components/addPrepay.vue'
import { getPrePayPage } from '@/api/prePay'
import { getPageDict } from '@/api/system/dictbiz'
export default {
  name: 'LpsSettlementCheck',
  components: {
    handleDown,
    colsForm
  },
  data() {
    return {
      formInfo: {},
      formItem: [
        {
          label: '物流商简称',
          type: 'gselect',
          prop: 'lpAbbreviation',
          optionValue: 'lpAbbreviation',
          optionLabel: 'lpAbbreviation',
          options: []
        },
        { label: '物流商金蝶编码', type: 'input', prop: 'logisticsProviderCode' },
        { label: '付款方式', type: 'select', prop: 'payType' },
        { label: '币种', type: 'select', prop: 'currency', options: [] },
        { label: '状态', type: 'select', prop: 'status', options: [] },
        { label: '申请时间', type: 'datePicker', prop: 'date' }
      ],
      editable: [],
      allData: [],
      exportData: [],
      headers: [
        { type: 'selection', width: '55' },
        { label: '付款单号', prop: 'prePayNum' },
        { label: '物流商金蝶编码', prop: 'kdLogisticsProviderCode' },
        { label: '物流商名称', prop: 'lpAbbreviation' },
        { label: '付款主体', prop: 'payerMain' },
        { label: '付款方式', prop: 'payType' },
        { label: '付款账号', prop: 'payAccount' },
        { label: '收款单位', prop: 'receiptCompany' },
        { label: '收款账号', prop: 'receiptAccount' },
        { label: '开户行', prop: 'receiveBankName' },
        { label: '申请人', prop: 'petitioner' },
        { label: '申请时间', prop: 'petitionDate' },
        { label: '预付金额', prop: 'prePayAmount' },
        { label: '付款币种', prop: 'currency' },
        { label: '预付金额（RMB）', prop: 'prePayAmountRmb' },
        { label: '已核销金额（RMB）', prop: 'verifyDoneAmountRmb' },
        { label: '核销中（RMB）', prop: 'verifyInAmountRmb' },
        { label: '待核销金额（RMB）', prop: 'verifyNotAmountRmb' },
        { slot: true, slotName: 'status' },
        { label: '结清时间', prop: 'settlementDate' },
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
    getSelectData() {
      getPageDict({ code: 'logistic_payment_pre_status' }).then(res => {
        this.formItem[4].options = res.data[0].children
      })
    },
    getAllData() {
      getPrePayPage(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    getStatus(row) {
      return this.formItem[4].options[row.status - 1]?.dictValue
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    upload() {
      const that = this
      this.$modal({
        title: '导入费用',
        width: '360px',
        component: uploadFile,
        callback(val) {
          val && that.init()
        }
      })
    },
    add() {
      const that = this
      this.$modal({
        title: '新增预付款单',
        width: '690px',
        component: addPrepay,
        callback(val) {
          val && that.init()
        }
      })
    },
    fetch({ current, size }, params) {
      return getPrePayPage(current, size, params).then(res => {
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

<style lang="scss" scoped>

</style>
