<template>
  <basic-container>
    <Orders order-type="delivery" />
  </basic-container>
</template>

<script>
import Orders from './orders/index'
export default {
  name: 'OmsPackOrdersDelivery',
  components: {
    Orders
  }
}
</script>

<style>

</style>
