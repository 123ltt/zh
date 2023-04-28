<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form class="form-col no-message" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="仓库名称">
              <el-input :value="detail.warehouseName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input :value="detail.productSku" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input :value="detail.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购成本">
              <el-input :value="`${detail.purCost}  ${detail.purCostCurrencyName}`" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="包装费">
              <template>
                <el-input v-if="1==detail.packCostType" :value="`${detail.packCost} ${detail.packCostCurrencyName}`" disabled />
                <el-input v-else :value="`${detail.packCost}%`" disabled />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库操作费">
              <el-input v-if="1==detail.storageOpType" :value="`${detail.storageCost} ${detail.storageOpCurrencyName}`" disabled />
              <el-input v-else :value="`${detail.storageCost}%`" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span>操作记录</span>
      </div>
      <el-table :data="recordData" max-height="400px" stripe style="width: 100%" border>
        <el-table-column prop="createUserName" label="操作人" align="center" min-width="150" />
        <el-table-column prop="createTime" label="操作时间" align="center" min-width="150" />
        <el-table-column prop="opRecord" label="操作记录" align="center" min-width="300" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script>

import { getDetail } from '@/api/product/productcost.js'
export default {
  name: 'ProductCostDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      detail: {},
      recordData: [],
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
        this.recordData = data.productCostOpHisVOList
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
