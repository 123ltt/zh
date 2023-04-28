<template>
  <basic-container>
    <g-table ref="tableRef"
             :headers="headers"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
    >
      <template #header>
        <cols-form :form-item="formItem" :form-info="formInfo" :form-handler="formHandler" />
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
      <el-table-column slot="operation" width="120" label="操作">
        <template v-slot="{row}">
          <auto-button @click="goDetailPage(row)">详情</auto-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import AutoButton from '@/views/components/autoButton.vue'
import { getStoreCodeList, getFlowDonePage } from '@/api/common'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyJdFlowDone',
  components: { colsForm, AutoButton },
  data() {
    return {
      formInfo: {},
      formItem: [
        {
          label: '店铺编码',
          prop: 'storeCode',
          type: 'gselect',
          optionValue: 'value',
          options: []
        },
        {
          label: '账单ID',
          prop: 'billId',
          type: 'input',
          placeholder: '多个请用英文逗号隔开'
        }
      ],
      formHandler: [
        {
          label: '查询',
          handler: () => { this.search() }
        },
        {
          label: '重置',
          handler: () => { this.reset() }
        }
      ],
      headers: [
        { label: '店铺编码', prop: 'storeCode' },
        {
          slot: true,
          slotName: 'bill',
          list: [
            { label: '账单ID', prop: 'billId' },
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
        { slot: true, slotName: 'operation' }
      ]
    }
  },
  mounted() {
    this.init()
    this.getData()
  },
  methods: {
    reset() {
      this.formInfo = {}
      this.init()
    },
    search() {
      this.init()
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      Object.assign(params, { platformCode: 'JD' })
      return getFlowDonePage(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 获取店铺列表
    getData() {
      getStoreCodeList({ platformCode: 'JD' }).then((res) => {
        if (res.success && res.data) {
          this.formItem[0].options = res.data
        }
      })
    },
    // 跳转到详情页面
    goDetailPage(row) {
      this.$newTab({
        path: 'jd/flowDone/detail',
        title: '流水核销详情',
        component: detailBill,
        clearCache: true,
        data: {
          info: { id: row.id, isVerify: 1, platformCode: 'JD' },
          detailType: 'flow'
        }
      })
    }
  }
}
</script>
