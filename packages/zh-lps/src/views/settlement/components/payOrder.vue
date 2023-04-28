<template>
  <basic-container>
    <div>
      <cols-form ref="colsForm" :form-item="formItem" :form-info="formInfo" :input-width="'180px'" :label-width="'96px'" :message-style="false" :inline-message="true" />
      <div class="btn">
        <el-button size="mini" type="primary" @click="add">新增</el-button>
        <el-button size="mini" type="primary" @click="submit">提交</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>

    <el-table :data="tableData" border stripe :header-cell-style="{background:'#f7f7f7'}">
      <el-table-column
        type="index"
        label="序号"
        width="55"
      />
      <el-table-column prop="settlementNum" label="结算单号" />
      <el-table-column prop="shipmentType" label="发货方式" />
      <el-table-column prop="discount" label="折扣情况" />
      <el-table-column prop="logisticWeight" label="物流方重量" />
      <el-table-column prop="logisticAmount" label="物流方金额" />
      <el-table-column prop="ownWeight" label="公司重量" />
      <el-table-column prop="ownAmount" label="公司金额" />
      <el-table-column prop="returnAmount" label="退款金额" />
      <el-table-column prop="rebateAmount" label="返利金额" />
      <el-table-column prop="adjustAmount" label="其他调整" />
      <el-table-column prop="shouldSettleAmount" label="本期应结算" />
      <el-table-column prop="actualPayAmount" label="本期实付款" />
      <el-table-column prop="currentBalanceAmount" label="本期末余额" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="tableData.length<2"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import addStatement from './addStatement'
import { getLpReceipts } from '@/api/common'
import { getPayNum, addPayMent } from '@/api/payment'
export default {
  components: {
    colsForm
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formInfo: {
        settlementList: []
      },
      // settmentId: '',
      receiptList: [],
      // payNum: '',
      formItem: [
        { label: '付款单号', type: 'input', prop: 'payNum', disabled: true, required: true },
        { label: '物流商名称', type: 'input', prop: 'lpAbbreviation', disabled: true, required: true },
        { label: '收款单位', type: 'select', prop: 'receiptCompany', required: true, options: [] },
        { label: '开户行', type: 'input', prop: 'openAccount', required: true, disabled: true },
        { label: '收款账号', type: 'input', prop: 'receiptAccount', required: true, disabled: true },
        { label: '结算币种', type: 'select', prop: 'settlementCurrency', options: ['RMB', 'USD'], required: true },
        { label: '汇率', type: 'input', prop: 'exchangeRate', required: true },
        // { label: '金蝶物流商编码', type: 'input', prop: 'lpCode' },
        { label: '主体公司', type: 'select', prop: 'compannyEntity', required: true, options: ['111', '222'] },
        { label: '付款方式', type: 'input', prop: 'payType', required: true },
        { label: '金额', type: 'input', prop: 'amount', required: true },
        { label: '来源', type: 'input', prop: '10', required: true },
        { label: '实付总金额', type: 'input', prop: 'actualPayAmount', required: true, disabled: true },
        { label: '结算周期', type: 'input', prop: 'payPeriod', required: true },
        { label: '付款依据', type: 'uploadFile', prop: 'file', required: true },
        { label: '备注', type: 'textarea', prop: 'remark', contentWidth: '474px', required: true }
      ]
    }
  },
  computed: {

  },
  watch: {
    'formInfo.file'(val) {
      this.formInfo.accordingName = val[0]?.name
      this.formInfo.accordingUrl = val[0]?.url
    },
    tableData: {
      handler(val) {
        this.formInfo.lpAbbreviation = val[0]?.lpAbbreviation
        let actPayTotal = 0
        this.formInfo.actualPayAmount = val.forEach(item => {
          actPayTotal += Number(item.actualPayAmount) * 10000
        })
        this.formInfo.actualPayAmount = actPayTotal / 10000
      },
      deep: true,
      immediate: true
    },
    'formInfo.receiptCompany'(val) {
      const arr = this.receiptList.filter(item => {
        return item.payee === val
      })
      this.formInfo.openAccount = arr[0].bankName
      this.formInfo.receiptAccount = arr[0].accountNumber
    }
  },
  created() {
    this.getSelectData()
  },
  mounted() {

  },
  methods: {
    submit() {
      this.formInfo.settlementList = this.tableData.map(item => item.settlementNum)
      this.$refs.colsForm.validate(addPayMent)
      // this.$emit('close')
    },
    add() {
      this.$newTab({
        path: 'settlement/payOrder/addStatementBill',
        title: '添加结算单',
        component: addStatement,
        clearCache: true,
        data: {
          tableData: this.tableData
        },
        callback: (val) => {
          val && this.tableData.push(...val)
        }
      })
    },
    getSelectData() {
      // if()
      getPayNum().then(res => {
        this.$set(this.formInfo, 'payNum', res.data)
      })
      getLpReceipts({ lpAbbreviation: this.formInfo.lpAbbreviation }).then(res => {
        this.receiptList = res.data
        const options = res.data.map(item => item.payee)
        this.formItem[2].options = options
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table {
    ::v-deep th {
      padding: 2px ;
    }
    ::v-deep td {
      padding: 2px ;
    }
  }
  .btn {
    margin-bottom: 6px;
  }
</style>
