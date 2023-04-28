<template>
  <basic-container>
    <g-table ref="tableRef"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
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
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <el-table-column slot="status" label="匹配状态">
        <template v-slot="{row}">
          {{ getFlowStatus(row.status)||'--' }}
        </template>
      </el-table-column>
      <el-table-column slot="operation" width="150" label="操作">
        <template v-slot="{row}">
          <el-button v-if="row.status===5" type="text" @click="matchFlow(row)">匹配流水</el-button>
          <el-button v-if="row.status===3" type="text" @click="adjustFlow(row)">调整</el-button>
          <el-button type="text" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getFlowPage, getStoreCodeList, getFlowStatus } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import flowAdjust from '@/views/verifiy/modal/flowAdjust'
import matchBill from '@/views/verifiy/modal/matchBill'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyJoomFlow', // 流水核销
  components: { colsForm },
  data() {
    return {
      headers: [
        {
          slot: true,
          slotName: 'bill',
          list: [
            { label: '文件名称', prop: 'fileName' },
            { label: '主账号', prop: 'mainAccountNumber' },
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
      formInfo: {},
      formItem: [
        {
          type: 'input',
          prop: 'mainAccountNumber',
          label: '主账号',
          placeholder: '多个请用英文逗号隔开'
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
  created() {

  },
  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    getData() {
      getStoreCodeList({ platformCode: 'JM' }).then(res => {
        this.formItem[0].options = res.data
      })
      getFlowStatus().then(res => {
        this.formItem[1].options = res.data
      })
    },
    getFlowStatus(val) {
      return this.formItem[1].options.find(item => item.key === val)?.value
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },

    matchFlow(row) {
      this.$modal({
        title: '匹配流水',
        width: '38%',
        data: { row: { ...row, platformCode: 'JM' } },
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
        path: '/joom/flow/detail',
        title: '流水核销详情',
        component: detailBill,
        clearCache: true,
        data: {
          info: { id: row.id, isVerify: 0, platformCode: 'JM' },
          detailType: 'flow'
        }
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
      Object.assign(params, { platformCode: 'JM' })
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
