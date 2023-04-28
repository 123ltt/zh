<template>
  <basic-container>
    <g-table
      ref="table"
      :headers="headers"
      row-key="id"
      :fetch="fetch"
      @selection-change="handleSelectionChange"
    >
      <template slot="header">
        <el-form
          ref="form"
          label-width="100px"
          size="mini"
          class="form-col no-message"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="采购平台:" prop="purchasePlatformName">
                <g-select
                  v-model="searchData.purchasePlatformName"
                  style="width: 100%"
                  :items="PlatformList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictKey"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="第三方单号:" prop="orderCode">
                <el-input v-model="searchData.orderCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="退款单号:" prop="refundCode">
                <el-input v-model="searchData.refundCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="买家账号:" prop="buyerAccount">
                <g-select
                  v-model="searchData.buyerAccount"
                  style="width: 100%"
                  :items="buyNumList"
                  key-field="buyerId"
                  label-field="buyerAccount"
                  value-field="buyerAccount"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="交易状态:" prop="transactionStatus">
                <g-select
                  v-model="searchData.transactionStatus"
                  style="width: 100%"
                  :items="statusList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictValue"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商名称:">
                <el-input
                  v-model="searchData.supplierName"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" style="padding-left: 40px">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                class="me-1"
                @click="initialization"
              >查询</el-button>
              <el-button
                icon="el-icon-delete"
                size="mini"
                class="me-1"
                @click="reset"
              >重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </g-table>
  </basic-container>
</template>
<script>
import { getList } from '@/api/refundRecord'
import { getPlatformInfo, getPlatfor, getBuyerInfo } from '@/api/orderListInfo' // 字典数据（平台，状态，付款方式）+买家账号
export default {
  data() {
    return {
      headers: [
        { type: 'selection', width: 50, aling: 'center' },
        {
          label: '采购平台',
          prop: 'purchasePlatformName',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '第三方单号',
          prop: 'orderCode',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '退款单号',
          prop: 'refundCode',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '买家账号',
          prop: 'buyerAccount',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '买家主账号id',
          prop: 'buyerId',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '采购主体名称',
          prop: 'purchaseCompanyName',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '付款条件',
          prop: 'paymentTypeCode',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '订单金额',
          prop: 'orderCode',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '退款金额',
          prop: 'refundAmount',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '交易状态',
          prop: 'transactionStatus',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '退款时间',
          prop: 'shippingAmount',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '下单账号',
          prop: 'orderAccount',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '下单时间',
          prop: 'orderDate',
          minWidth: '120px',
          align: 'center'
        }
      ],
      // 搜索条件
      searchData: {
        purchasePlatformName: '', // 采购平台
        orderCode: '', // 第三方单号
        refundCode: '', // 退款单号
        buyerAccount: '', // 买家账号
        supplierName: '' // 供应商名称
      },
      PlatformList: [], // 采购平台列表
      statusList: [], // 状态
      buyNumList: [] // 买家账号
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 自定义封装表格绑定的方法 ，只获取表格数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then((res) => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    // 重置
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索
    initialization(originalRefresh = true) {
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },
    getData() {
      Promise.all([
        getPlatfor({ code: 'ips_pur_platform' }), // 平台数据
        getPlatformInfo({ code: 'alibaba_order_status' }), // 状态
        getBuyerInfo() // 买家账号
      ]).then((res) => {
        this.PlatformList = res[0].data
        this.statusList = res[1].data
        this.buyNumList = res[2].data
      })
    }
  }
}
</script>

<style></style>
