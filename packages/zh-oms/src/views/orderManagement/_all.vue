<template>
  <!-- oms 订单管理 - 全部订单 -->
  <basic-container>
    <Orders key="all-orders" :is-all="true" />
  </basic-container>
</template>

<script>

import Orders from './orders/index.vue'
export default {
  name: 'OmsOrderManagementAll',
  components: { Orders }
}
</script>
