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
      <template v-slot:oms="{data}">
        <el-table-column label="OMS">
          <el-table-column v-for="item in data.list" :key="item.prop" v-bind="item" />
        </el-table-column>
      </template>
      <el-table-column slot="verifyType" label="核销类型">
        <template v-slot="{row}">
          <span>{{ getVerifyType(row.verifyType)||'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="operation" width="150" label="操作">
        <template v-slot="{row}">
          <el-button type="text" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { verifyOrderDonePage, getStoreCodeList, getVerifyType } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../utils/filterData'

export default {
  name: 'PrsVerifiyWishOrderDone', // 已核销订单
  components: { colsForm },
  data() {
    return {

      headers: [
        { label: '店铺编码', prop: 'storeCode' },
        { label: '账单ID', prop: 'billId' },
        { label: '平台订单号', prop: 'platformOrderCode' },
        { slot: true, slotName: 'verifyType' },
        { label: '核销时间', prop: 'verifyTime' },
        {
          slot: true,
          slotName: 'bill',
          list: [{ label: '账单币种', prop: 'billCurrency' },
            { label: '平台订单额', prop: 'platformOrderAmount' },
            { label: '平台退款', prop: 'platformRefund' }]
        },
        {
          slot: true,
          slotName: 'oms',
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
        {
          type: 'gselect',
          optionValue: 'value',
          prop: 'storeCode',
          label: '店铺编码',
          options: []
        },
        { type: 'select', prop: 'verifyType', label: '核销类型', options: [] },
        { type: 'input', prop: 'platformOrderCodeList', label: '平台订单号', placeholder: '多个用英文逗号隔开' }
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
      getStoreCodeList({ platformCode: 'WH' }).then(res => {
        this.formItem[0].options = res.data
      })
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
        path: '/wish/flowDone/oderDoneDetail',
        title: '订单详情',
        component: detailBill,
        data: {
          info: { id: row.id, isVerify: 1, platformCode: 'WH' }
        },
        clearCache: true

      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {

      }
      this.init()
    },
    fetch({ current, size }, params) {
      Object.assign(params, {
        platformCode: 'WH'
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
