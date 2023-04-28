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

      <el-table-column slot="verifyType" width="120" label="核销类型">
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
      <el-table-column slot="operation" width="90" label="操作">
        <template v-slot="{row}">
          <el-button type="text" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import { getStoreCodeList, verifyOrderDonePage, getVerifyType } from '@/api/common'
import detailBill from '@/views/verifiy/modal/detailBill'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyLazadaOrderDone',
  components: { colsForm },
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
          label: '核销类型',
          type: 'select',
          prop: 'verifyType',
          options: []
        },
        {
          label: '平台订单号',
          prop: 'platformOrderCodeList',
          placeholder: '多个请用英文逗号隔开',
          type: 'input'
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
        { label: '站点', prop: 'site' },
        { label: '平台订单号', prop: 'platformOrderCode', width: '90' },
        { slot: true, slotName: 'verifyType' },
        { label: '核销时间', prop: 'verifyTime', width: '90' },
        {
          slot: true,
          slotName: 'bill',
          list: [
            { label: 'Statement', prop: 'billId' },
            { label: '账单币种', prop: 'billCurrency' },
            { label: '平台订单额', prop: 'platformOrderAmount', width: '90' },
            { label: '平台退款', prop: 'platformRefund' }
          ]
        },
        {
          slot: true,
          slotName: 'OMS',
          list: [
            { label: 'OMS币种', prop: 'omsCurrency' },
            { label: 'OMS订单额', prop: 'omsOrderAmount', width: '90' },
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
    search() {
      this.init()
    },
    getVerifyType(val) {
      return this.formItem[1].options.find(item => +item.key === val)?.value
    },
    init() {
      this.formInfo.platformCode = 'LZ'
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      return verifyOrderDonePage(current, size, params).then(res => {
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
      getStoreCodeList({ platformCode: 'LZ' }).then((res) => {
        if (res.success && res.data) {
          this.formItem[0].options = res.data
        }
      })
      getVerifyType().then(res => {
        this.formItem[1].options = res.data
      })
    },
    showDetail(row) {
      this.$newTab({
        path: 'lazada/orderDone/detail',
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
