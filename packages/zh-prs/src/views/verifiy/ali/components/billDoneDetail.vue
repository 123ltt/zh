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
import { verifyOrderDonePage, getVerifyType } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import detail from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../../utils/filterData'

export default {
  name: 'BillDownDetail', // 已关闭账单下级页面明细
  components: { colsForm },
  props: {
    verifyBillId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

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
      ],
      formInfo: {},
      formItem: [
        { type: 'input', prop: 'platformOrderCodeList', label: '平台订单号', options: [] },
        { type: 'select', prop: 'verifyType', label: '核销类型', options: [] }
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
      getVerifyType().then(res => {
        this.formItem[1].options = res.data
      })
    },
    getVerifyType(val) {
      return this.formItem[1].options.find(item => +item.key === val)?.value
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    showDetail(row) {
      this.$newTab({
        path: '/ali/flow/billDoneDetail/detail',
        title: '订单详情',
        component: detail,
        clearCache: true,
        data: {
          info: { id: row.id, isVerify: 1, platformCode: 'AI' }

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
      Object.assign(params, {
        platformCode: 'AI', verifyBillId: this.verifyBillId
      })
      return verifyOrderDonePage(current, size, params).then(res => {
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
