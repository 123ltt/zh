<template>
  <basic-container>
    <g-table ref="table"
             :headers="headers"
             :fetch="fetch"
             row-key="id"
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
              <el-form-item label="采购编码：">
                <el-input v-model="searchData.purchaseCode" clearable>6</el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请编码：">
                <el-input v-model="searchData.applyCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采购平台：" prop="purchasePlatformName">
                <g-select
                  v-model="searchData.purchasePlatformName"
                  :items="PlatformList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictKey"
                  clearable
                  style="width:100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="第三方单号：">
                <el-input v-model="searchData.orderCode" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="付款条件：" prop="paymentTypeCode">
                <g-select
                  v-model="searchData.paymentTypeCode"
                  :items="paymentTypeList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictValue"
                  clearable
                  style="width:100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="付款单状态：" prop="paymentStatus">
                <g-select
                  v-model="searchData.paymentStatus"
                  :items="statusList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictKey"
                  clearable
                  style="width:100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="支付方式：" prop="allowPayWay">
                <g-select
                  v-model="searchData.allowPayWay"
                  :items="orderPayWayList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictValue"
                  clearable
                  style="width:100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采购主体名称：" prop="purchaseCompanyName">
                <g-select
                  v-model="searchData.purchaseCompanyName"
                  :items="conditionList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictValue"
                  clearable
                  style="width:100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="供应商名称：">
                <el-input v-model="searchData.supplierName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请人：">
                <el-input v-model="searchData.applyUserName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应结算日期：" prop="settlementDate">
                <g-select
                  v-model="searchData.settlementDate"
                  :items="settlementList"
                  key-field="dictKey"
                  label-field="dictValue"
                  value-field="dictValue"
                  clearable
                  style="width:100%"
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" style="margin-left:100px">
              <el-button type="primary" icon="el-icon-search" size="mini" class="me-1" @click="initialization">查询</el-button>
              <el-button icon="el-icon-delete" size="mini" class="me-1" @click="reset">重置</el-button>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col>
              <el-button type="primary" size="mini" class="me-1" @click="batchPayEvent()">批量付款</el-button>
              <el-button type="primary" size="mini" class="me-1">批量驳回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column
        slot="handler"
        label="操作"
        fixed="right"
        align="center"
        min-width="120px"
      >
        <template v-slot="scope">
          <el-button v-if="scope.row.paymentStatus=='waitpayback'" type="text" @click="batchPayEvent(scope.row.id)">付款</el-button>
          <el-button v-if="scope.row.paymentStatusName=='核对异常'" type="text" @click="reject(scope.row)">驳回</el-button>
          <el-button type="text" @click="details(scope.row,'unimprest')">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { getPlatformInfo, getPlatfor } from '@/api/orderListInfo'// 字典数据（平台，状态，付款方式）
import { getList, batchPay, purchaseDictionary } from '@/api/payList'// 表格列表+批量付款+采购主体
import reject from './payModal/reject.vue'// 驳回弹框组件
import detail from './payModal/detail.vue'// 详情组件
export default {
  data() {
    return {
      headers: [
        { type: 'selection', width: 50, align: 'center' },
        { label: '付款编码', prop: 'payCode', minWidth: '120px', align: 'center' },
        { label: '申请编码', prop: 'applyCode', minWidth: '80px', align: 'center' },
        { label: '采购编码', prop: 'purchaseCode', minWidth: '80px', align: 'center' },
        { label: '采购平台', prop: 'purchasePlatformName', minWidth: '70px', align: 'center' },
        { label: '第三方单号', prop: 'orderCode', minWidth: '90px', align: 'center' },
        { label: '采购主体名称', prop: 'purchaseCompanyName', minWidth: '120px', align: 'center' },
        { label: '供应商名称', prop: 'supplierName', minWidth: '120px', align: 'center' },
        { label: '产品金额', prop: 'purchaseAmount', minWidth: '70px', align: 'center' },
        { label: '物流运费', prop: 'shippingAmount', minWidth: '70px', align: 'center' },
        { label: '优惠金额', prop: 'discountAmount', minWidth: '70px', align: 'center' },
        { label: '应付金额', prop: 'paymentAmount', minWidth: '70px', align: 'center' },
        { label: '已付金额', prop: 'paidAmount', minWidth: '70px', align: 'center' },
        { label: '到货金额', prop: 'paidAmount', minWidth: '70px', align: 'center' },
        { label: '退款金额', prop: 'paidAmount', minWidth: '70px', align: 'center' },
        { label: '付款条件', prop: '', minWidth: '70px', align: 'center' },
        { label: '请款金额', prop: 'applyAmount', minWidth: '70px', align: 'center' },
        { label: '申请人', prop: 'applyUserName', minWidth: '70px', align: 'center' },
        { label: '申请时间', prop: 'applyDate', minWidth: '70px', align: 'center' },
        { label: '状态', prop: 'paymentStatusName', minWidth: '70px', align: 'center' },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      PlatformList: [],
      statusList: [],
      searchData: {
        purchaseCode: '', // 采购编码
        applyCode: '', // 申请编码
        getPlatforCode: '', // 采购平台
        orderCode: '', // 第三方单号
        paymentTypeCode: '', // 付款条件
        paymentStatus: '', // 付款单状态
        allowPayWay: '', // 支付方式
        purchaseCompanyName: '', // 采购主体名称
        supplierName: '', // 供应商名称
        applyUserName: '', // 申请人
        settlementDate: '', // 应结算
        queryType: 2// 查询类型（1：预付款；2：非预非款）
      },
      obj: {
      },
      paymentApplyIds: [], // 批量付款申请单ID集合
      orderPayWayList: [], // 支付方式列表
      paymentTypeList: [], // 付款条件列表
      settlementList: [], // 应结算
      conditionList: []// 采购主体
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 重置
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
    },

    // 批量付款-付款
    batchPayEvent(id) {
      if (id) {
        const paymentApplyIds = []
        paymentApplyIds.push(id)
        this.obj.paymentApplyIds = paymentApplyIds
      } else {
        this.obj.paymentApplyIds = this.paymentApplyIds
      }
      batchPay(this.obj).then(res => {
        window.open(res.data, '_blank')
      })
    },
    // 全选
    handleSelectionChange(val) {
      this.paymentApplyIds = []
      val.forEach(item => {
        this.paymentApplyIds.push(item.id)
      })
    },
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
    // 搜索
    initialization(originalRefresh = true) {
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },
    // 数据集合
    getData() {
      Promise.all([
        // 平台数据
        getPlatfor({ code: 'ips_pur_platform' }), // 平台数据
        getPlatformInfo({ code: 'payment_status' }), // 付款单状态
        getPlatformInfo({ code: 'alibaba_order_pay_way' }), // 支付方式
        getPlatformInfo({ code: 'payment_type' }), // 付款条件
        getPlatformInfo({ code: 'settlement_date' }), // 应结算
        purchaseDictionary({ code: 'ips_payment_condition' })// 采购主体
      ]).then(res => {
        this.PlatformList = res[0].data
        this.statusList = res[1].data
        this.orderPayWayList = res[2].data
        this.paymentTypeList = res[3].data
        this.settlementList = res[4].data
        this.conditionList = res[5].data
      })
    },
    // 详情
    details(row, name) {
      this.$newTab({
        path: '/unimprest/detail',
        title: '非预付款单付款详情',
        component: detail,
        clearCache: true,
        data: {
          row,
          name
        },
        callback: (bool) => {
        }
      })
    },

    // 驳回
    reject(val) {
      this.$modal({
        title: '线上付款单驳回',
        component: reject,
        width: '600px',
        data: {
          row: val
        },
        callback: (bool) => {
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.row{
  margin-top: 10px;
  margin-bottom: 10px;
}

</style>
