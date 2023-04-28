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
            <handle-down :all-data="allData"
                         :part-data="exportData"
                         :headers="headers"
                         @getAllData="getAllData"
            />
          </el-form-item>
        </cols-form>
      </template>
    </g-table>
  </basic-container>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import handleDown from '@/views/components/handleDown'
import { getTotalPage } from '@/api/query'
import { getLogisticProviders, getShipmentType } from '@/api/common'
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
        { label: '出库日期', type: 'datePicker', prop: 'date' }
      ],
      headers: [
        { type: 'selection', width: '55' },
        { label: '物流商名称', prop: 'lpAbbreviation' },
        { label: '国家', prop: 'country' },
        { label: '发货方式', prop: 'shipmentType' },
        { label: '日期', prop: 'outDeliveryTime' },
        { label: '出库订单数', prop: 'orderCount' },
        { label: '总重量', prop: 'ownWeight' },
        { label: '总运费', prop: 'ownAmount' }
      ]
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.startOutTime = val?.[0]
      this.formInfo.endOutTime = val?.[1]?.replace(/00:00:00/, '23:59:59')
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
      getLogisticProviders().then(res => {
        this.formItem[0].options = res.data
      })
      getShipmentType().then(res => {
        this.formItem[1].options = res.data
      })
    },
    search() {
      this.init()
    },
    getAllData() {
      getTotalPage(1, 50000, this.formInfo).then(res => {
        this.allData = res.data.records
      })
    },
    handleSelectionChange(val) {
      this.exportData = val
    },
    reset() {
      this.formInfo = {}
    },
    fetch({ current, size }, params) {
      return getTotalPage(current, size, params).then(res => {
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
