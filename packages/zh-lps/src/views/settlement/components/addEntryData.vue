<template>
  <basic-container>
    <g-table ref="tableRef"
             :headers="headers"
             :fetch="fetch"
             @selection-change="handleSelectionChange"
    >
      <template #header>
        <cols-form :form-item="formItem" :form-info="formInfo">
          <el-form-item slot="handleBtn">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button :disabled="!addData.length" type="primary" @click="add">添加</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item><cols-form /></cols-form>
      </template>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import { getEntryList } from '@/api/settlement'
export default {
  components: {
    colsForm
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    billDates: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formInfo: {
        lpAbbreviation: this.tableData[0].lpAbbreviation,
        shipmentType: this.tableData[0].shipmentType,
        status: 2
      },
      addData: [],
      formItem: [
        { label: '物流商简称', type: 'select', prop: 'lpAbbreviation', disabled: true, options: [] },
        { label: '发货方式', type: 'select', prop: 'shipmentType', disabled: true, options: [] },
        { label: '账单日期', type: 'datePicker', prop: 'date' }
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
        { label: '金额差异', prop: 'amountDiff' }
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
  },
  methods: {
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    search() {
      this.init()
    },
    add() {
      this.$emit('close', this.addData)
    },
    cancel() {
      this.$emit('close')
    },
    handleSelectionChange(val) {
      this.addData = val
    },
    fetch({ current, size }, params) {
      return getEntryList(current, size, params).then(res => {
        const data = res.data.records.filter(item => {
          return !this.billDates.includes(item.billDate)
        })
        return {
          records: data,
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
