<template>
  <basic-container>
    <div>
      <cols-form ref="colsForm" :form-item="formItem" :form-info="formInfo" :input-width="'260px'" :label-width="'110px'" :message-style="false">
        <el-form-item slot="others" class="double-input" label-width="110px" label="预付款核销">
          <el-select v-model="formInfo.prePaymentNum" clearable style="width: 180px">
            <el-option v-for="item in preVerifyList" :key="item.prePayNum" :value="item.prePayNum" :label="item.prePayNum" clearable />
          </el-select>
          <el-input v-model="formInfo.prePaymentAmount" style="width: 80px" />
        </el-form-item>
      </cols-form>
      <el-button size="mini" type="primary" @click="add">添加</el-button>
      <el-button size="mini" type="primary" @click="submit">提交</el-button>
      <el-button size="mini" @click="$emit('close')">取消</el-button>
    </div>
    <el-table :data="tableData" border stripe :header-cell-style="{background:'#f7f7f7'}">
      <el-table-column
        type="index"
        label="序号"
        width="55"
      />
      <el-table-column prop="lpAbbreviation" label="物流商简称" />
      <el-table-column prop="shipmentType" label="发货方式" />
      <el-table-column prop="billDate" label="账单日期" />
      <el-table-column prop="logisticWeight" label="物流商重量" />
      <el-table-column prop="logisticAmount" label="物流商金额" />
      <el-table-column prop="ownWeight" label="我方重量" />
      <el-table-column prop="ownAmount" label="我方金额" />
      <el-table-column prop="weightDiff" label="重量差异" />
      <el-table-column prop="amountDiff" label="金额差异" />
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="tableData.length<=1"
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
import addEntryData from './addEntryData.vue'
import { addSettlement, getEntryList, editSettlement, getSettleNum } from '@/api/settlement'
import { getPageDict } from '@/api/system/dictbiz'
import { getVerifyPayment } from '@/api/common'
export default {
  components: {
    colsForm
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formInfo: {
      },
      preVerifyList: [],
      formItem: [
        { label: '结算单号', type: 'input', disabled: true, prop: 'settlementNum', required: true },
        { label: '物流商简称', type: 'input', disabled: true, prop: 'lpAbbreviation', required: true, options: [] },
        { label: '发货方式', type: 'input', disabled: true, prop: 'shipmentType', required: true },
        { label: '结算周期', type: 'select', prop: 'settlePeriod', options: [], required: true },
        { label: '账单周期', type: 'datePicker', prop: 'date', required: true },
        { label: '物流方重量', type: 'input', prop: 'logisticWeight', disabled: true, options: [], required: true },
        { label: '物流方金额', type: 'input', prop: 'logisticAmount', disabled: true, required: true },
        { label: '公司重量', type: 'input', disabled: true, prop: 'ownWeight', required: true },
        { label: '公司金额', type: 'input', disabled: true, prop: 'ownAmount', required: true },
        { label: '退款金额', type: 'input', prop: 'returnAmount', required: true },
        { label: '返利金额', type: 'input', prop: 'rebateAmount', required: true },
        { label: '折扣情况', type: 'input', prop: 'discount', required: true },
        { label: '其他调整', type: 'input', prop: 'adjustAmount', required: true },
        { label: '本期应结算', type: 'input', prop: 'shouldSettleAmount', required: true },
        { slot: true },
        { label: '本期实付金额', type: 'input', prop: 'actualPayAmount', required: true },
        { label: '取数日期', type: 'textarea', disabled: true, prop: 'billDateStr', required: true },
        { label: '备注', type: 'textarea', prop: 'remark' }
      ]
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.formInfo.lpAbbreviation = val[0]?.lpAbbreviation
        this.formInfo.shipmentType = val[0]?.shipmentType
        const arr = []
        let lWTotal = 0
        let oWtotal = 0
        let lATotal = 0
        let oATotal = 0
        val.forEach(item => {
          lWTotal += Number(item.logisticWeight) * 10000
          lATotal += Number(item.logisticAmount) * 10000
          oWtotal += Number(item.ownWeight) * 10000
          oATotal += Number(item.ownAmount) * 10000
          arr.push(item.billDate)
        })
        this.formInfo.logisticWeight = (lWTotal / 10000).toFixed(4)
        this.formInfo.logisticAmount = (lATotal / 10000).toFixed(4)
        this.formInfo.ownWeight = (oWtotal / 10000).toFixed(4)
        this.formInfo.ownAmount = (oATotal / 10000).toFixed(4)
        this.formInfo.billDateStr = arr.join(',')
      },
      deep: true,
      immediate: true
    },
    'formInfo.date'(val) {
      this.formInfo.settleStartDate = val?.[0]
      this.formInfo.settleEndDate = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.getTableData()
    this.getSelectData()
  },
  methods: {
    getSelectData() {
      getPageDict({ code: 'settle_period' }).then(res => {
        debugger
        this.formItem[3].options = res.data[0].children
      })
      getVerifyPayment({ lpAbbreviation: this.formInfo.lpAbbreviation || this.rowData.lpAbbreviation }).then(res => {
        this.preVerifyList = res.data
      })
      if (!this.rowData) {
        getSettleNum().then(res => {
          this.$set(this.formInfo, 'settlementNum', res.data)
        })
      } else {
        this.$set(this.formInfo, 'settlementNum', this.rowData.settlementNum)
      }
    },
    getTableData() {
      // 结算单页面编辑
      if (this.rowData && this.rowData.settlementNum) {
        this.formInfo = this.rowData
        this.formInfo.date = [this.rowData.settleStartDate, this.rowData.settleEndDate]
        getEntryList(1, 200000, { settlementNum: this.rowData.settlementNum }).then(res => {
          this.tableData.push(...res.data.records)
        })
      }
    },
    submit() {
      this.formInfo.billDateList = this.formInfo.billDateStr.split(',')
      const fn = this.rowData ? editSettlement : addSettlement
      this.$refs.colsForm.validate(fn)
    },
    add() {
      this.$newTab({
        path: 'settlement/entry/newStatement/addEntryBill',
        title: '添加入账单',
        component: addEntryData,
        clearCache: true,
        data: {
          billDates: this.formInfo.billDateStr.split(','),
          tableData: this.tableData
        },
        callback: (val) => {
          val && this.tableData.push(...val)
        }
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>

.double-input{
  height: 28px;
}
.el-form--inline .el-form-item{
  margin-right: 0
}
  .btn-box {
      text-align: center;
    }
  .el-table {
    ::v-deep th {
      padding: 4px ;
    }
    ::v-deep td {
      padding: 4px ;
    }
  }
</style>
