<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">采购产品</span>
      </div>
      <el-form class="no-message" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input :value="detail.productSku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input :value="detail.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品类目">
              <el-input :value="detail.category" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购单价">
              <el-input :value="detail.purchasePrice" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="询价备注">
              <el-input :value="detail.remarks" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span style="font-weight: 600;">供应商产品</span>
      </div>
      <el-form class="no-message" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input :value="detail.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品编码">
              <el-input :value="detail.goodsCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input :value="detail.goodsName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品价格">
              <el-input :value="detail.goodsPrice" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import { getDetail } from '@/api/ordermanagement/price'

export default {
  name: 'PriceDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      detail: {},
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        const data = res.data
        this.detail = data
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

.cardBox{
  ::v-deep .el-card__body{
    padding-bottom: 0;
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
