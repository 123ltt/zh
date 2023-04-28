<template>
  <!-- 补货采购详情 -->
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form size="mini" label-width="120px" class="no-message">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="需求编码">
              <el-input :value="detail.rqmtCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求方货主">
              <el-input :value="detail.demander" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求人">
              <el-input :value="detail.rqmtUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求数量">
              <el-input :value="detail.rqmtTotalQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目的仓库">
              <el-input :value="detail.destWarehouse" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求时间">
              <el-input :value="openData.createTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span>销售欠单</span>
      </div>
      <el-table :data="frontlineData" max-height="400px" stripe border style="width:410px" class="g-table">
        <el-table-column prop="orderCode" label="订单编码" align="center" min-width="120" />
        <el-table-column prop="productQty" label="产品数量" align="center" width="110" />
        <el-table-column prop="orderTime" label="下单时间" align="center" width="170" />
      </el-table>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span>需求产品</span>
      </div>
      <el-table :data="goodsTable" max-height="600px" stripe style="width: 100%" border class="g-table">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="100" />
        <el-table-column prop="productImg" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.productImg" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="category" label="产品类目" align="center" min-width="100" />
        <el-table-column prop="rqmtQty" label="需求数量" align="center" min-width="150" />
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>

import { getOweOrderDetail } from '@/api/purchaseDemand/stock.js'
export default {
  name: 'OweSingleDetail',
  props: {
    audit: Boolean,
    openData: Object
  },
  data() {
    return {
      detail: {},
      frontlineData: [],
      goodsTable: [],
      loading: false
    }
  },
  mounted() {
    this.getData(this.openData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getOweOrderDetail(val).then(res => {
        const data = res.data
        this.detail = data
        this.goodsTable = data.requirementProductVOList
        this.frontlineData = data.requirementOrderVOList
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.footer{
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
</style>
