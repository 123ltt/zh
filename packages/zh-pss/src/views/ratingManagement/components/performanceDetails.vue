<template>
  <el-table v-loading="loading" :data="detailData" max-height="400px" stripe style="width: 100%" class="g-table" size="mini" border>
    <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="130px" show-overflow-tooltip />
    <el-table-column prop="checkDate" label="考核期间" align="center" min-width="90" />
    <el-table-column prop="totalPerformance" label="综合绩效" align="center" min-width="70" />
    <el-table-column prop="onTimeDelivery" label="准时交付20分" align="center" width="75" />
    <el-table-column prop="paymentDay" label="账期10分" align="center" width="75" />
    <el-table-column prop="unsalableProcessing" label="滞销处理10分" align="center" width="75" />
    <el-table-column prop="costOptimization" label="成本优化10分" align="center" width="75" />
    <el-table-column prop="incomingQualifiedRate" label="来料合格率20分" align="center" width="80" />
    <el-table-column prop="defectiveRate" label="不良率10分" align="center" width="60" />
    <el-table-column prop="afterSaleReturnRate" label="售后退货率20分" align="center" width="80" />
  </el-table>
</template>

<script>
import { detail } from '@/api/ratingManagement/performance.js'

export default {
  name: 'PerformanceDetails',
  props: {
    supplier: Object
  },
  data() {
    return {
      detailData: [],
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      detail(this.supplier.supplierId).then(res => {
        this.detailData = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
*{
    box-sizing: border-box;
}
::v-deep .el-card{
    box-shadow: none;
    border: none!important;
    ::v-deep .el-card__body{
      padding-bottom: 0px!important;
    }
}
</style>
