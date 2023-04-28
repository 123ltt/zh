<template>
  <el-table :data="recordData" size="mini" height="400px" stripe style="width: 100%" border class="g-table">
    <el-table-column prop="orderCode" label="订单编码" align="center" min-width="130" show-overflow-tooltip />
    <el-table-column prop="productSku" label="SKU编码" align="center" min-width="130" show-overflow-tooltip />
    <el-table-column prop="oosQuantity" label="产品缺货数量" align="center" min-width="100" />
    <el-table-column prop="orderTime" label="下单时间" align="center" min-width="150" />
  </el-table>
</template>

<script>

import { getDetail } from '@/api/warningManagement/stockoos.js'
export default {
  name: 'StockoosDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      recordData: [],
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getDetail(1, -1, { stockOosId: this.detailData.id }).then(res => {
        this.recordData = res.data.records
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
