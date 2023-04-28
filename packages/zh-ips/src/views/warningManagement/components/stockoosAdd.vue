<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header" style="heigt:20px;line-height:20px;">
        <span style="font-weight: 600;">基本信息</span>
        <div style="float: right">
          <el-button size="mini" type="primary" @click="$emit('close')">返回</el-button>
          <el-button size="mini" type="primary" @click="saveData">确认需求</el-button>
        </div>
      </div>
      <el-form ref="rulesForm" :model="addData" size="mini" label-width="50px" class="no-message">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="productAuthName" label="货权">
              <el-input v-model.trim="addData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="productOwnerName" label="货主">
              <el-input v-model.trim="addData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="warehouseName" label="仓库">
              <el-input v-model.trim="addData.warehouseName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span style="font-weight: 600;">发货明细</span>
      </div>
      <el-table v-show="isOk" :data="goodsTable" size="mini" max-height="400px" class="g-table" stripe style="width: 100%" border>
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="90">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.productSku }} </g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="产品图片" align="center" width="75">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.skuInfo.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center" min-width="120">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.productName }} </g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="产品类目" align="center" min-width="90">
          <template slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.categoryName }} </g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="采购中/在途/可用/备用库存" align="center" min-width="170">
          <template slot-scope="scope">
            <span>
              {{ scope.row.purchasingStock == -1?0:scope.row.purchasingStock }} / {{ scope.row.intransitStock == -1?0:scope.row.intransitStock }} / {{ scope.row.availableStock == -1?0:scope.row.availableStock }} / {{ scope.row.reserveStock == -1?0:scope.row.reserveStock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="oosQuantity" label="缺货库存" align="center" min-width="80" />
        <el-table-column prop="prePurchaseQuantity" label="采购确认中" align="center" min-width="100" />
        <el-table-column prop="averageDailySales" label="产品日均销量" align="center" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.averageDailySales == -1?'':row.averageDailySales }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplyCycle" label="产品供货周期(天)" align="center" min-width="120">
          <template slot-scope="{row}">
            <span>{{ row.supplyCycle == -1?'':row.supplyCycle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseEstimateQuantity" label="预计待采数量" align="center" min-width="100" />
        <el-table-column prop="rqmtQty" label="需求数量" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.rqmtQty" v-input.positive.numeric clearable placeholder="请填写" size="mini" maxlength="6" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </basic-container>
</template>

<script>

import { getOtherInfo, save } from '@/api/warningManagement/stockoos.js'
import { deepClone } from '@/util/util'

export default {
  name: 'ProductAdd',
  props: {
    addData: Object,
    parData: Array,
    equallyData: Array
  },
  data() {
    return {
      loading: false,
      isOk: true,
      goodsTable: [],
      paramsData: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.isOk = false
      getOtherInfo(this.parData).then(res => {
        this.goodsTable = deepClone(this.equallyData)
        res.data.forEach(item => {
          for (let i = 0; i < this.goodsTable.length; i++) {
            if (this.goodsTable[i].productSku === item.productSku) {
              this.goodsTable[i] = Object.assign(this.goodsTable[i], item)
              this.goodsTable[i].rqmtQty = this.goodsTable[i].purchaseEstimateQuantity
            }
          }
        })
        this.loading = false
        this.isOk = true
      })
    },
    saveData() {
      const arr = this.goodsTable.filter(item => {
        if (!item.rqmtQty) { return true }
      })
      if (arr.length) {
        this.$message.error('请填写表中的需求数量！')
      } else {
        this.paramsData = deepClone(this.addData)
        this.paramsData.requirementProductDTOList = this.goodsTable
        save(this.paramsData).then(res => {
          this.$emit('close', true)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
</style>
