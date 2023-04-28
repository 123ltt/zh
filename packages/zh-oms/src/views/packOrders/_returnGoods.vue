<template>
  <basic-container>
    <Orders order-type="returnGoods" />
  </basic-container>
</template>

<script>
import Orders from './orders/index'
export default {
  name: 'OmsPackOrdersReturnGoods',
  components: {
    Orders
  }
}
</script>

<style>

</style>
