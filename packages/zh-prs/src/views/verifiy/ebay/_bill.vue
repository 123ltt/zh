<template>
  <basic-container>
    <g-table ref="tableRef"
             :fetch="fetch"
             :header-cell-style="{'text-align':'center'}"
             :cell-style="{'text-align':'center'}"
             :headers="headers"
             @selection-change="handleSelectionChange"
    >
      <template #header>
        <cols-form :form-item="formItem"
                   :form-info="formInfo"
                   :form-handler="formHandler"
        />
        <el-button style="margin-left:auto;display:block" type="primary" size="mini" :disabled="btnDisabled" @click="batchColse">批量关闭</el-button>
      </template>
      <el-table-column slot="status" label="对账状态">
        <template v-slot="{row}">
          <span>{{ getStatus(row.status)||'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="operation" width="200" label="操作">

        <template v-slot="{row}">
          <el-button type="text" :disabled="row.status===1" @click="showDetail(row)">明细</el-button>
          <autoButton v-if="row.status===3" :confirm-config="{message:'确认关闭该账单？'}" auto-confirm @confirm="confirm(row)">关闭</autoButton>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>

import { billPage, getBillStatus, batchBillColse, getStoreCodeList } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import autoButton from '@/views/components/autoButton'
import orderOff from './components/orderOff'
import batchOperation from '@/views/verifiy/modal/batchOperation'
import { filterData } from '../../../utils/filterData'

export default {
  name: 'PrsVerifiyEbayBill', // 账单对账
  components: { colsForm, autoButton },
  data() {
    return {
      selectData: [],
      btnDisabled: true,
      headers: [
        { type: 'selection', width: '55' },
        { label: 'PayPal账户/店铺编码', prop: 'storeCode' },
        { label: '账期开始时间', prop: 'billStartTime' },
        { label: '账期结束时间', prop: 'billEndTime' },
        { label: '账单币种', prop: 'billCurrency' },
        { label: '订单合计', prop: 'billAmount' },
        { label: '退款合计', prop: 'billRefundAmount' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'operation' }
      ],
      formInfo: { platformCode: 'EB' },
      formItem: [
        {
          type: 'gselect',
          optionValue: 'value',
          prop: 'storeCode',
          label: '店铺编码',
          options: []
        },
        { type: 'select', prop: 'status', label: '状态', options: [] },
        { type: 'input', prop: 'mainAccountNumberList', label: 'PayPal账户', placeholder: '多个用英文逗号隔开' }
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
    getStatus(val) {
      return this.formItem[1].options.find(item => (+item.key) === (val))?.value
    },
    getData() {
      getBillStatus().then(res => {
        this.formItem[1].options = res.data
      })
      getStoreCodeList({ platformCode: 'EB' }).then(res => {
        this.formItem[0].options = res.data
      })
    },
    handleSelectionChange(val) {
      this.selectData = []
      val.forEach(item => {
        if (item.status === 3) {
          this.selectData.push(item.id)
        }
      })
      this.selectData.length > 0 ? (this.btnDisabled = false) : (this.btnDisabled = true)
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    showDetail(row) {
      this.$newTab({
        path: '/ebay/bill/orderOff',
        title: '订单核销',
        component: orderOff,
        clearCache: true,
        data: {
          verifyBillId: row.id
        }
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formInfo = {
        platformCode: 'EB'
      }
      this.init()
    },
    confirm(row) {
      batchBillColse({ ids: [row.id] }).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    batchColse() {
      this.$modal({
        title: '批量关闭',
        width: '38%',
        data: {
          ids: this.selectData
        },
        component: batchOperation,
        callback: (val) => {
          val && this.init()
        }
      })
    },
    fetch({ current, size }, params) {
      return billPage(current, size, params).then(res => {
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
