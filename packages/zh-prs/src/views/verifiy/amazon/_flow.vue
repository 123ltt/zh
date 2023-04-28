<template>
  <basic-container>
    <g-table ref="tableRef"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center' }"
             :cell-style="{'text-align':'center'}"
             :headers="headers"
    >
      <template #header>
        <cols-form :form-item="formItem"
                   :form-info="formInfo"
                   :form-handler="formHandler"
        />
      </template>
      <template v-slot:bill="{data}">
        <el-table-column label="账单">
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <template v-slot:flow="{data}">
        <el-table-column label="流水">
          <el-table-column label="收款方式">
            <template v-slot="{row}">
              {{ getPayeeType(row.payeeType)||'--' }}
            </template>
          </el-table-column>
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <el-table-column slot="status" label="匹配状态">
        <template v-slot="{row}">
          {{ getFlowStatus(row.status) ||'--' }}
        </template>
      </el-table-column>
      <el-table-column slot="operation" width="150" label="操作">
        <template v-slot="{row}">
          <el-button v-if="row.status===5" type="text" @click="matchFlow(row)">匹配流水</el-button>
          <el-button v-if="row.status===6" type="text" @click="carryForward(row)">结转</el-button>
          <el-button v-if="row.status===3" type="text" @click="adjustFlow(row)">调整</el-button>
          <el-button type="text" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getFlowPage, getStoreCodeList, getFlowStatus, getpayeeTypes } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import flowAdjust from '@/views/verifiy/modal/flowAdjust'
import matchBill from '@/views/verifiy/modal/matchBill'
import carryForward from '@/views/verifiy/modal/carryForward'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyAmazonFlow', // 流水核销
  components: { colsForm },
  data() {
    return {
      headers: [
        { label: '店铺编码', prop: 'storeCode' },
        { label: '站点', prop: 'site' },
        {
          slot: true,
          slotName: 'bill',
          list: [
            { label: '账单ID', prop: 'billId' },
            { label: '账单币种', prop: 'billCurrency' },
            { label: '账单放款', prop: 'billAmount' },
            { label: '账单放款（流水币种）', prop: 'conversionAmount', width: '150' }
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
      formInfo: {},
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          prop: 'storeCode',
          label: '店铺编码',
          options: []
        },
        {
          type: 'input',
          prop: 'billId',
          label: '账单ID',
          options: [],
          placeholder: '多个用英文逗号隔开'
        },
        {
          type: 'select',
          prop: 'payeeType',
          label: '收款方式',
          options: []

        },
        {
          type: 'input',
          prop: 'payeeAccount',
          label: '收款账号',
          options: [],
          placeholder: '多个用英文逗号隔开'
        },
        { type: 'select', prop: 'status', label: '匹配状态', options: [] }
      ],
      formHandler: [{
        label: '查询',
        handler: () => {
          this.search()
        }
      }, {
        label: '重置',
        handler: () => {
          this.reset()
        }
      }]
    }
  },

  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    getData() {
      getStoreCodeList({ platformCode: 'AM' }).then(res => {
        this.formItem[0].options = res.data
      })
      getFlowStatus().then(res => {
        this.formItem[4].options = res.data
      })
      getpayeeTypes().then(res => {
        this.formItem[2].options = res.data
      })
    },
    getPayeeType(val) {
      return this.formItem[2].options.find(item => item.key === val)?.value
    },
    getFlowStatus(val) {
      return this.formItem[4].options.find(item => item.key === val)?.value
    },

    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },

    matchFlow(row) {
      this.$modal({
        title: '匹配流水',
        width: '38%',
        data: { row: { ...row, platformCode: 'AM' } },
        component: matchBill,
        callback: (val) => {
          val && this.init()
        }
      })
    },
    adjustFlow(row) {
      this.$modal({
        title: '调整',
        width: '38%',
        data: { row: { ...row } },
        component: flowAdjust,
        callback: (val) => {
          val && this.init()
        }
      })
    },
    showDetail(row) {
      this.$newTab({
        path: '/amazon/flow/detail',
        title: '流水核销详情',
        component: detailBill,
        clearCache: true,
        data: {
          info: { id: row.id, isVerify: 0, platformCode: 'AM' },
          detailType: 'flow'
        }
      })
    },
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
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {}
      this.init()
    },
    fetch({ current, size }, params) {
      Object.assign(params, { platformCode: 'AM' })
      return getFlowPage(current, size, params).then(res => {
        filterData(res.data.records)
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

<style scoped lang="scss">

</style>
