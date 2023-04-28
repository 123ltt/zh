/* eslint-disable vue/no-unused-vars */
<template>
  <!-- 库存成本详情 -->
  <basic-container ref="box" v-loading="loading">
    <el-card ref="infoBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message" :model="detailData">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="产品编码">
              <el-input :value="detailData.productSku" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input :value="detailData.skuInfo.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类目">
              <el-input :value="detailData.skuInfo.categoryName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库类型">
              <el-input :value="warehouseTypeObj[detailData.warehouseType]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库归属">
              <el-input :value="warehouseBelongObj[detailData.warehouseBelong] " disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库名称">
              <el-input :value="detailData.warehouseName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货权">
              <el-input :value="detailData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货主">
              <el-input :value="detailData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="平均库龄">
              <el-input :value="detailData.averageStockAge" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存数量">
              <el-input :value="detailData.availableStock" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">库龄明细</span>
      </div>

      <el-form label-width="100px" size="mini" class="no-message" :model="submit">
        <el-row>
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input v-model.trim="submit.batchCode" clearable placeholder="请填写" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="stockData" size="mini" max-height="450" stripe border class="g-table">
        <el-table-column prop="batchCode" label="批次号" align="center" min-width="150" />
        <el-table-column prop="stockAgeDate" label="库龄日期" align="center" min-width="150" />
        <el-table-column prop="stockLocationCode" label="库位号" align="center" min-width="150" />
        <el-table-column prop="stockLocationQty" align="center" min-width="150">
          <template slot="header" slot-scope="scope">
            <span>库位数量  </span><span style="color:blue"> 合计：{{ detailData.availableStock ||scope[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stockAge" align="center" min-width="150">
          <template slot="header" slot-scope="scope">
            <span>库龄   </span><span style="color:blue">  均值：{{ detailData.averageStockAge || scope[0] }}</span>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/stockAnalysis/age.js'

export default {
  name: 'CostDetail',
  props: {
    parData: Object,
    warehouseBelongObj: Object,
    warehouseTypeObj: Object
  },
  data() {
    return {
      submit: {
        batchCode: ''
      },
      stockData: [],
      detailData: {
        skuInfo: {}
      },
      loading: false,
      oldStockData: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getDetail(this.parData.id).then(res => {
        this.detailData = res.data
        if (!this.detailData.availableStock) {
          this.detailData.availableStock = 0
        }
        if (!this.detailData.averageStockAge) {
          this.detailData.averageStockAge = 0
        }
        this.stockData = res.data.details
        this.oldStockData = res.data.details
        this.loading = false
      })
    },
    search() {
      if (this.submit.batchCode) {
        this.stockData = this.oldStockData.filter(item => { return item.batchCode === this.submit.batchCode })
      } else {
        this.reset()
      }
    },
    reset() {
      this.submit.batchCode = ''
      this.stockData = this.oldStockData
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
