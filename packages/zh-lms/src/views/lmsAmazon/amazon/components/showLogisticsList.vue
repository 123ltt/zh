<template>
  <div class="modal-box">
    <el-row class="m-t-30">
      <el-col :span="2">
        <span class="label">子SKU</span>
      </el-col>
      <el-col :span="22">
        <div class="m-t-30">{{ productSku }}</div>
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
.m-t-30{
  margin-bottom: 30px;
  line-height: 30px;
}
.modal-box{
  padding: 20px;
}
</style>
