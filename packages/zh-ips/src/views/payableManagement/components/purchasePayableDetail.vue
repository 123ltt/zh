<template>
  <!-- 详情 -->
  <basic-container v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-form class="no-message" size="mini" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="应付编码">
                <el-input :value="detail.productSku" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购编码">
                <el-input :value="detail.purCode" disabled />
              </el-form-item>
            </el-col>
            <el-row v-if="single">
              <el-col :span="8">
                <el-form-item prop="platformCode" label="平台编码">
                  <el-input :value="detail.platformCode" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="8">
              <el-form-item label="采购方名称">
                <el-input :value="detail.purDemander.name" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input :value="detail.supplierInfo.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购金额">
                <el-input :value="detail.purAmount" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="物流运费">
                <el-input :value="detail.logisticsFreightMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购总金额">
                <el-input :value="detail.purTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预付金额">
                <el-input :value="detail.prepayTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退款金额">
                <el-input :value="detail.returnedTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="应付金额">
                <el-input :value="detail.shouldPayTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已请款金额">
                <el-input :value="detail.requiredTotalMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-input :value="detail.shouldPayStatus" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">
                <el-input :value="detail.createTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后修改时间">
                <el-input :value="detail.updateTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="应付明细" name="2">
        <el-table v-if="single" size="mini" class="g-table" :data="tableData" max-height="400px" stripe style="width: 100%" border>
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="100" />
          <el-table-column prop="productImg" label="产品图片" align="center" min-width="70">
            <template slot-scope="scope">
              <g-thumb class="d-table-cell" :url="scope.row.productImg" />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center" min-width="100" />
          <el-table-column prop="productName" label="产品类目" align="center" min-width="100" />
          <el-table-column prop="purQty" label="采购数量" align="center" min-width="100" />
          <el-table-column prop="productPrice" label="采购单价" align="center" min-width="100" />
          <el-table-column prop="productTotalAmount" label="产品金额" align="center" min-width="100" />
        </el-table>
        <el-table v-else :data="paymentData" max-height="400px" stripe style="width: 100%" border class="g-table">
          <el-table-column prop="purCode" label="采购编码" align="center" min-width="100" />
          <el-table-column prop="platformCode" label="平台单号" align="center" min-width="100" />
          <el-table-column prop="purQty" label="采购数量" align="center" min-width="80" />
          <el-table-column prop="purTotalMoney" label="产品金额" align="center" min-width="80" />
          <el-table-column prop="logisticsFreight" label="物流运费" align="center" min-width="80" />
          <el-table-column prop="purAmount" label="采购金额" align="center" min-width="80" />
          <el-table-column prop="prepayTotalMoney" label="预付金额" align="center" min-width="80" />
          <el-table-column prop="returnedTotalMoney" label="退款金额" align="center" min-width="80" />
          <el-table-column label="已请款金额" align="center" min-width="80" />
          <el-table-column label="应付金额" align="center" min-width="80" />
          <el-table-column prop="purAccountCurrency" label="币种" align="center" min-width="90" />
          <el-table-column prop="status" label="操作" align="center" min-width="90" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="detailBtn(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="应付请款" name="3">
        <el-table :data="shouldPayData" size="mini" max-height="400px" stripe style="width: 100%" border class="g-table">
          <el-table-column prop="requireCode" label="请款编码" align="center" min-width="130" />
          <el-table-column prop="requireMoney" label="请款金额" align="center" min-width="100" />
          <el-table-column prop="supplierAccount.accountCurrency" label="请款币种" align="center" min-width="100" />
          <el-table-column prop="opRecord" label="收款人" align="center" min-width="100" />
          <el-table-column prop="opRecord" label="收款账号" align="center" min-width="100" />
          <el-table-column prop="remark" label="备注" align="center" min-width="100" />
          <el-table-column prop="requireStatus" label="状态" align="center" min-width="100" />
          <el-table-column prop="createUserName" label="请款人" align="center" min-width="100" />
          <el-table-column prop="opRecord" label="请款时间" align="center" min-width="100" />
          <el-table-column prop="opRecord" label="结束时间" align="center" min-width="100" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import orderDetail from './orderDetail.vue'
import { getSimpleDetail, getAccountPeriodDetail } from '@/api/payableManagement/payableManagement.js'
export default {
  name: 'PayableManagementDetail',
  props: {
    detailData: Object,
    single: Boolean
  },
  data() {
    return {
      detail: {
        purDemander: { name: '' },
        supplierInfo: { supplierName: '' }
      },
      shouldPayData: [],
      paymentData: [],
      tableData: [],
      orderData: {},
      loading: false,
      activeNames: ['1', '2', '3']
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    // 加币种
    addCurrency(val) {
      if (val) {
        return `${val}${this.detail.requiredAccountCurrency}`
      } else {
        return val
      }
    },
    getData(val) {
      this.loading = true
      if (this.single) {
        getSimpleDetail(val).then(res => {
          const data = res.data
          this.detail = data
          this.tableData = data.purchaseDetails
          this.shouldPayData = data.shouldPayDetailList
          this.loading = false
        })
      } else {
        getAccountPeriodDetail(val).then(res => {
          const data = res.data
          this.detail = data
          this.paymentData = data.shouldPayBindOrderList
          this.shouldPayData = data.shouldPayDetailList
          this.loading = false
        })
      }
    },
    detailBtn(val) {
      this.orderData = JSON.parse(JSON.stringify(val))
      this.$newTab({
        path: '/ips/purchasePayable/detail/detail',
        title: '采购应付明细详情',
        component: orderDetail,
        data: {
          orderData: this.orderData
        },
        clearCache: true,
        callback: (bool) => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
::v-deep .el-collapse-item__content {
  padding-bottom: 10px;
}
.caozuo{
  ::v-deep .el-table td, .el-table th{
    padding: 5px 0;
  }
}
.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
</style>
