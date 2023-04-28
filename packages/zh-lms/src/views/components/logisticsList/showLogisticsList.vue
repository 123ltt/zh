<template>
  <div class="modal-box">
    <el-row class="mb-5">
      <el-col :span="2">
        <span class="label">子SKU</span>
      </el-col>
      <el-col :span="22">
        <div class="mb-3">{{ productSku }}</div>
        <logisticsList :logistics="logistics" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import logisticsList from './logisticsList.vue'
export default {
  name: 'ShowLogisticsList',
  components: { logisticsList },
  props: {
    logistics: {
      type: Array,
      default: () => []
    },
    productSku: String
  }
}
</script>

<style lang="scss" scoped>
.m-l-5{
  margin-left: 5px;
  margin-right: 20px;;
}
.modal-box{
  padding: 10px;
}
</style>
