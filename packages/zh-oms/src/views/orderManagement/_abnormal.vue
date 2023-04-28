<template>
  <!-- oms 订单管理 - 异常订单 -->
  <basic-container>
    <Orders key="abnormal-orders" :is-all="false" />
  </basic-container>
</template>

<script>
import Orders from './orders/index.vue'

export default {
  name: 'OmsOrderManagementAbnormal',
  components: { Orders }
}
</script>

<style lang="scss" scoped>
</style>
