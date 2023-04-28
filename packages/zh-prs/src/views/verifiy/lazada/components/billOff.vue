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
        <cols-form ref="formRef"
                   :form-item="formItem"
                   :form-info="formInfo"
                   :form-handler="formHandler"
        />
        <el-button style="margin-left:auto;display:block" type="primary" size="mini" :disabled="btnDisabled" @click="batch">批量核销</el-button>
      </template>
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
      <el-table-column slot="status" label="状态">
        <template v-slot="{row}">
          <span>{{ getStatus(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="operation" width="150" label="操作">
        <template v-slot="{row}">
          <autoButton v-if="row.status===3" :confirm-config="{message:'确认核销该条记录？'}" auto-confirm @confirm="confirm(row)">核销</autoButton>
          <el-button v-if="row.status===2" type="text" @click="adjustBill(row)">调整</el-button>
          <el-button type="text" @click="showDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { verifyOrderPage, batchVerifyOrder, getOrderStatus } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import autoButton from '@/views/components/autoButton'
import detail from '@/views/verifiy/modal/detailBill'
import batchOperation from '@/views/verifiy/modal/batchOperation'
import billAdjust from '../../modal/billAdjust'
import { filterData } from '../../../../utils/filterData'
export default {
  name: 'OrderOff', // 账单对账下级明细页面
  components: { colsForm, autoButton },
  props: {
    verifyBillId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnDisabled: true,
      selectData: [],
      headers: [
        { type: 'selection', width: '55' },
        { label: '平台订单号', prop: 'platformOrderCode' },
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
            { label: '退款币种', prop: 'omsRefundCurrency' },
            { label: 'OMS退款', prop: 'omsRefund' }
          ]
        },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'operation' }
      ],
      formInfo: {},
      formItem: [
        { type: 'input', prop: 'platformOrderCodeList', label: '平台订单号', placeholder: '多个用英文逗号隔开' },
        { type: 'select', prop: 'status', label: '状态', options: [] }
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
    handleSelectionChange(val) {
      this.selectData = []
      val.forEach(item => {
        if (item.status === 3) {
          this.selectData.push(item.id)
        }
      })
      this.selectData.length > 0 ? (this.btnDisabled = false) : (this.btnDisabled = true)
    },
    getStatus(val) {
      return (this.formItem[1].options.find(item => (+item.key) === val))?.value
    },
    getData() {
      getOrderStatus().then(res => {
        this.formItem[1].options = res.data
      })
    },
    init() {
      this.$refs.tableRef.load(1, this.formInfo)
    },
    confirm(row) {
      batchVerifyOrder({ ids: [row.id] }).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    batch() {
      this.$modal({
        title: '批量核销',
        width: '38%',
        component: batchOperation,
        data: {
          batchColse: false,
          ids: this.selectData
        },
        callback: (val) => {
          val && this.init()
        }
      })
    },
    adjustBill(row) {
      this.$modal({
        title: '调整',
        width: '38%',
        data: {
          row: { ...row }
        },
        component: billAdjust,
        callback: (val) => {
          val && this.init()
        }
      })
    },
    showDetail(row) {
      this.$newTab({
        path: '/walmart/bill/orderOff/detail',
        title: '订单核销详情',
        component: detail,
        data: {
          info: { id: row.id, isVerify: 0, platformCode: 'LZ' }
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
      Object.assign(params, { platformCode: 'LZ', verifyBillId: this.verifyBillId })
      return verifyOrderPage(current, size, params).then(res => {
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
