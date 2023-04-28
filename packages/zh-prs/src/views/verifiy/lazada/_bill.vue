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
        <cols-form :form-item="formItem" :form-info="formInfo" :form-handler="formHandler" />
        <div style="text-align: right;">
          <el-button size="mini" type="primary" :disabled="!batchCloseData.length" @click="batchClose">批量关闭</el-button>
        </div>
      </template>
      <el-table-column slot="status" label="对账状态">
        <template v-slot="{row}">
          <span>{{ getStatus(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column slot="operation" label="操作">
        <template v-slot="{row}">
          <auto-button
            v-if="row.status === 3"
            auto-confirm
            :confirm-config="{message: '确认关闭该账单？'}"
            @confirm="confirm(row)"
          >关闭</auto-button>
          <auto-button :disabled="row.status===1" @click="goDetailPage(row)">明细</auto-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import colsForm from '@/views/components/colsForm'
import AutoButton from '@/views/components/autoButton.vue'
import { getStoreCodeList, billPage, getBillStatus, batchBillColse } from '@/api/common'
import orderOff from './components/billOff'
import batchOperation from '../modal/batchOperation'
import { filterData } from '../../../utils/filterData'
export default {
  name: 'PrsVerifiyLazadaBill',
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
          label: '状态',
          type: 'select',
          prop: 'status',
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
        { width: 55, type: 'selection' },
        { label: '店铺编码', prop: 'storeCode' },
        { label: '站点', prop: 'site' },
        { label: 'Statement', prop: 'billId' },
        { label: '账单币种', prop: 'billCurrency' },
        { label: '账单放款', prop: 'billAmount' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'operation' }
      ],
      batchCloseData: []
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
      this.formInfo.platformCode = 'LZ'
      this.$refs.tableRef.load(1, this.formInfo)
    },
    fetch({ current, size }, params) {
      return billPage(current, size, params).then((res) => {
        filterData(res.data.records)
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    getStatus(val) {
      return this.formItem[1].options.find(item => (+item.key) === (val))?.value
    },
    getData() {
      getStoreCodeList({ platformCode: 'LZ' }).then((res) => {
        if (res.success && res.data) {
          this.formItem[0].options = res.data
        }
      })
      getBillStatus({ platformCode: 'LZ' }).then((res) => {
        if (res.success && res.data) {
          this.formItem[1].options = res.data
        }
      })
    },

    // 跳转到核销页面
    goDetailPage(row) {
      this.$newTab({
        path: 'lazada/bill/orderOff',
        title: '订单核销',
        component: orderOff,
        data: { verifyBillId: row.id },
        clearCache: true
      })
    },
    // 单个关闭账单
    confirm(row) {
      batchBillColse({ ids: [row.id] }).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    // 获取批量处理数据
    handleSelectionChange(val) {
      this.batchCloseData = []
      val.forEach(item => {
        if (item.status === 3) {
          this.batchCloseData.push(item.id)
        }
      })
    },
    // 批量关闭
    batchClose() {
      this.$modal({
        title: '批量关闭',
        component: batchOperation,
        width: '38%',
        data: { ids: this.batchCloseData },
        callback: val => {
          val && this.init()
        }
      })
    }
  }
}
</script>
