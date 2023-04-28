<template>
  <basic-container>
    <Orders order-type="abnormal" />
  </basic-container>
</template>

<script>
import Orders from './orders/index'
export default {
  name: 'OmsPackOrdersAbnormal',
  components: {
    Orders
  }
}
</script>

<style>

</style>
