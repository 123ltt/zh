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
        <colsForm :form-info="formInfo" :form-item="formItem">
          <el-form-item slot="handleBtn">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item slot="handleBtn">
            <el-button type="primary" plain size="mini" icon="el-icon-upload2" @click="uploadFee">导入费用</el-button>
            <el-button type="danger" plain size="mini" icon="el-icon-delete" :disabled="isDisabled" @click="batchDel">批量删除</el-button>
            <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="conditionDel">条件删除</el-button>
            <handle-down :all-data="allData"
                         :part-data="exportData"
                         :headers="headers"
                         @getAllData="getAllData"
            />
          </el-form-item>
        </colsForm>
      </template>
      <el-table-column slot="dataSources" width="110px" label="数据来源">
        <template v-slot="{row}">
          <span v-if="row.status===1">牛蛙</span>
          <span v-if="row.status===2">物流系统</span>
        </template>
      </el-table-column>
      <el-table-column slot="status" fixed="right" label="状态">
        <template v-slot="{row}">
          <span>{{ getStatus(row.status) || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="operation" fixed="right" width="110px" label="操作">
        <template v-slot="{row}">
          <el-button :disabled="!(row.status===1||row.status===2)" type="text" @click="adjust(row)">调整</el-button>
          <el-button type="text" @click="operationLog(row.id)">操作日志</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import uploadFee from './components/uploadFee.vue'
import batchDelete from './components/batchDelete.vue'
import operationLog from './components/operationLog.vue'
import handleDown from '@/views/components/handleDown'
import adjust from './components/adjust.vue'
import colsForm from '@/views/components/colsForm.vue'
import { getCheckList, delBill } from '@/api/settlement'
import { getPageDict } from '@/api/system/dictbiz'
import { getShipmentType, getLogisticProviders } from '@/api/common'

export default {
  name: 'LpsSettlementCheck',
  components: {
    handleDown,
    colsForm
  },
  data() {
    return {
      formInfo: {},
      isDisabled: true,
      formItem: [
        {
          label: '物流商',
          type: 'gselect',
          prop: 'lpAbbreviation',
          optionValue: 'lpAbbreviation',
          optionLabel: 'lpAbbreviation',
          options: []
        },
        { label: '跟踪号', type: 'input', prop: 'trackingNumber' },
        { label: '状态', type: 'select', prop: 'status', options: [] },
        { label: '平台订单号', type: 'input', prop: 'platformOrderCode' },
        { label: '发货方式', type: 'select', prop: 'shipmentType', options: [] },
        { label: '账单日期', type: 'datePicker', prop: 'date1' },
        { label: '出库时间', type: 'datePicker', prop: 'date2' }

      ],
      editable: [],
      allData: [],
      exportData: [],
      billStatus: [],
      headers: [
        { type: 'selection', width: '55' },
        { label: '平台订单号', prop: 'platformOrderCode', width: 90 },
        { label: '物流商简称', prop: 'lpAbbreviation', width: 90 },
        { label: '发货方式', prop: 'shipmentType' },
        { label: '跟踪号', prop: 'trackingNumber' },
        { label: '订单号', prop: 'platformOrderCode' },
        { label: '国家', prop: 'country' },
        { label: '账单日期', prop: 'billDate', width: 90 },
        { label: '物流商重量', prop: 'logisticWeight', width: 96 },
        { label: '物流商金额', prop: 'logisticAmount', width: 96 },
        { slot: true, slotName: 'dataSources', label: '数据来源' },
        { label: '出库单号', prop: 'warehouseOutNum' },
        { label: '出库时间', prop: 'warehouseTime' },
        { label: '我方重量', prop: 'ownWeight' },
        { label: '我方金额', prop: 'ownAmount' },
        { label: '重量差异', prop: 'weightDiff' },
        { label: '金额差异', prop: 'amountDiff' },
        { label: '平台', prop: 'platform' },
        { label: '店铺', prop: 'storeName' },
        // { label: '状态', prop: 'status' },
        { slot: true, slotName: 'status', label: '状态' },
        { label: '结算单号', prop: 'settlementNum' },
        { label: '备注', prop: 'remark' },
        { slot: true, slotName: 'operation', label: '操作' }
      ]
    }
  },
  watch: {
    'formInfo.date1'(val) {
      this.formInfo.billStartTime = val?.[0]
      this.formInfo.billEndTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
    },
    'formInfo.date2'(val) {
      this.formInfo.warehouseStartTime = val?.[0]
      this.formInfo.warehouseEndTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  mounted() {
    this.init()
    this.getSelectData()
  },
  methods: {
    getAllData() {
      getCheckList(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    getStatus(data) {
      return this.formItem[2].options[data - 1]?.dictValue
    },
    // 接口获取下拉列表数据
    getSelectData() {
      getShipmentType().then(res => {
        this.formItem[4].options = res.data
      })
      getPageDict({ code: 'logistic_bill_status' }).then(res => {
        this.formItem[2].options = res.data = res.data[0].children
      })
      getLogisticProviders().then(res => {
        this.formItem[0].options = res.data
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    adjust(row) {
      const { logisticAmount, ownWeight, logisticWeight, ownAmount, id } = row
      this.$modal({
        title: '调整',
        width: '360px',
        component: adjust,
        clearCache: true,
        data: {
          rowData: {
            logisticAmount,
            ownWeight,
            logisticWeight,
            ownAmount,
            id
          }
        },
        callback: (val) => {
          val && this.init()
        }
      })
    },

    uploadFee() {
      const that = this
      this.$modal({
        title: '导入费用',
        width: '380px',
        component: uploadFee,
        callback(val) {
          val && that.init()
        }
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
      this.isDisabled = (!this.exportData.length) || !this.exportData.every(item => {
        return item.status === 1 || item.status === 2
      })
    },
    // 按条件删除
    conditionDel() {
      const that = this
      this.$modal({
        title: '按条件删除',
        width: '360px',
        component: batchDelete,
        callback(val) {
          val && that.init()
        }
      })
    },
    // 批量删除
    batchDel() {
      const ids = this.exportData.map(item => {
        return item.id
      }).join(',')
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBill({ ids }).then(res => {
          this.$message.success(res.msg)
          this.init()
        })
      }).catch(() => {

      })
    },
    // 查看操作日志
    operationLog(id) {
      this.$modal({
        title: '操作日志',
        width: '780px',
        height: '300px',
        component: operationLog,
        data: {
          id
        },
        callback(val) {
          // val && that.init()
        }
      })
    },
    fetch({ current, size }, params) {
      return getCheckList(current, size, params).then(res => {
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
