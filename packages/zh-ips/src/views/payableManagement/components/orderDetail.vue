<template>
  <!-- 详情 -->
  <div v-loading="loading">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form class="no-message" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购编码">
              <el-input :value="detail.purchaseCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购方名称">
              <el-input :value="detail.purSquareName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input :value="detail.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品金额">
              <el-input :value="detail.purchaseDetails.productTotalAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流运费">
              <el-input :value="detail.logisticsFreight" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购金额">
              <el-input :value="detail.purAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预付金额">
              <el-input :value="orderData.prepayTotalMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款金额">
              <el-input :value="orderData.returnedTotalMoney" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应付金额">
              <el-input :value="orderData.shouldPayTotalMoney" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span>应付明细</span>
      </div>
      <el-table :data="tableData" max-height="400px" stripe style="width: 100%" border class="g-table">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="100" />
        <el-table-column prop="productImg" label="产品图片" align="center" min-width="100">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.productImg"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center" min-width="100" />
        <el-table-column prop="productName" label="产品类目" align="center" min-width="100" />
        <el-table-column prop="purQty" label="采购数量" align="center" min-width="100" />
        <el-table-column prop="productPrice" label="采购单价" align="center" min-width="100" />
        <el-table-column prop="productTotalAmount" label="商品金额" align="center" min-width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script>

import { getOrderDetail } from '@/api/payableManagement/payableManagement.js'
export default {
  name: 'OrderDetail',
  props: {
    orderData: Object
  },
  data() {
    return {
      detail: {
        purchaseDetails: {
          productTotalAmount: ''
        }
      },
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getOrderDetail(this.orderData.purOrderId).then(res => {
        const data = res.data
        this.detail = data
        this.tableData = data.purchaseDetails
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
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
