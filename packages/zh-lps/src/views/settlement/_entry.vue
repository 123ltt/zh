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
        <cols-form :form-info="formInfo" :form-item="formItem" :label-width="'auto'">
          <el-form-item slot="handleBtn">
            <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
            <el-button type="primary" size="mini" icon="el-icon-upload2" :disabled="isDisabled" @click="createSettle">生成结算单</el-button>
          </el-form-item>
        </cols-form>
      </template>
      <el-table-column slot="status" label="结算状态">
        <template v-slot="{row}">
          <span>{{ getStatus(row.status) || '--' }}</span>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import newStatement from './components/newStatement.vue'
import colsForm from '@/views/components/colsForm.vue'
import { getEntryList } from '@/api/settlement'
import { getPageDict } from '@/api/system/dictbiz'
import { getShipmentType, getLogisticProviders } from '@/api/common'
export default {
  name: 'LpsSettlementEntry',
  components: {
    colsForm
  },
  data() {
    return {
      formInfo: {},
      selectDate: [],
      isDisabled: true,
      formItem: [
        {
          label: '物流商简称',
          type: 'gselect',
          prop: 'lpAbbreviation',
          optionValue: 'lpAbbreviation',
          optionLabel: 'lpAbbreviation',
          options: []
        },
        { label: '发货方式', type: 'select', prop: 'shipmentType', options: [] },
        { label: '账单日期', type: 'datePicker', prop: 'date' },
        { label: '状态', type: 'select', prop: 'status', options: [] }
      ],
      headers: [
        { type: 'selection', width: '55' },
        { label: '物流商简称', prop: 'lpAbbreviation' },
        { label: '发货方式', prop: 'shipmentType' },
        { label: '账单日期', prop: 'billDate' },
        { label: '物流商重量', prop: 'logisticWeight' },
        { label: '物流商金额', prop: 'logisticAmount' },
        { label: '我方重量', prop: 'ownWeight' },
        { label: '我方金额', prop: 'ownAmount' },
        { label: '重量差异', prop: 'weightDiff' },
        { label: '金额差异', prop: 'amountDiff' },
        // { label: '结算状态', prop: 'status' },
        { slot: true, slotName: 'status' },
        { label: '结算单号', prop: 'settlementNum' }
      ]
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.billStartTime = val?.[0]
      this.formInfo.billEndTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
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
      this.isDisabled = (!this.selectDate.length) || (this.selectDate.some((item) => {
        return this.selectDate[0].lpAbbreviation !== item.lpAbbreviation || this.selectDate[0].shipmentType !== item.shipmentType || this.selectDate[0].status !== 2
      }))
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    getStatus(data) {
      return this.formItem[3].options[data - 1]?.dictValue
    },
    getSelectData() {
      getShipmentType().then(res => {
        this.formItem[1].options = res.data
      })
      getPageDict({ code: 'logistic_bill_status' }).then(res => {
        this.formItem[3].options = res.data[0].children
      })
      getLogisticProviders().then(res => {
        this.formItem[0].options = res.data
      })
    },
    createSettle() {
      this.$newTab({
        path: 'settlement/entry/newStatement',
        title: '生成结算单',
        component: newStatement,
        clearCache: true,
        data: {
          tableData: this.selectDate
        },
        callback: (val) => {
          val && this.init()
        }
      })
    },
    fetch({ current, size }, params) {
      return getEntryList(current, size, params).then(res => {
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
