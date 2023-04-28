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
      <el-table-column slot="verifyType" label="核销类型">
        <template v-slot="{row}">
          <span>{{ getVerifyType(row.verifyType) }}</span>
        </template>
      </el-table-column>
      <template v-slot:bill="{data}">
        <el-table-column label="账单">
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <template v-slot:OMS="{data}">
        <el-table-column label="OMS">
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <el-table-column slot="operation" label="操作">
        <template v-slot="{row}">
          <el-button type="text" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import { verifyOrderDonePage, getVerifyType } from '@/api/common'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../../utils/filterData'
export default {
  components: { colsForm },
  props: {
    verifyBillId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formInfo: {},
      formItem: [
        {
          label: '平台订单号',
          prop: 'platformOrderCodeList',
          type: 'input',
          placeHolder: '多个用英文逗号隔开',
          options: []
        },
        {
          label: '核销类型',
          type: 'select',
          prop: 'verifyType',
          options: []
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
        { label: '平台订单号', prop: 'platformOrderCode' },
        { slot: true, slotName: 'verifyType' },
        { label: '核销时间', prop: 'verifyTime' },
        {
          slot: true,
          slotName: 'bill',
          list: [
            { label: '账单币种', prop: 'billCurrency' },
            { label: '平台订单额', prop: 'platformOrderAmount' },
            { label: '平台退款', prop: 'platformRefund' }
          ]
        },
        {
          slot: true,
          slotName: 'OMS',
          list: [
            { label: 'OMS币种', prop: 'omsCurrency' },
            { label: 'OMS订单额', prop: 'omsOrderAmount' },
            { label: 'OMS退款', prop: 'omsRefund' }
          ]
        },
        { label: '核销金额', prop: 'verifyAmount' },
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
    getData() {
      getVerifyType().then(res => {
        this.formItem[1].options = res.data
      })
    },
    search() {
      this.init()
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      Object.assign(params, { platformCode: 'LZ', verifyBillId: this.verifyBillId })
      return verifyOrderDonePage(current, size, params).then(res => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    getVerifyType(val) {
      return this.formItem[1].options.find(item => +item.key === val)?.value
    },
    showDetail(row) {
      this.$newTab({
        path: 'lazada/flow/billDoneDetail/detail',
        title: '订单详情',
        component: detailBill,
        clearCache: true,
        data: {
          info: { id: row.id, isVerify: 1, platformCode: 'LZ' }
        }
      })
    }
  }
}
</script>
