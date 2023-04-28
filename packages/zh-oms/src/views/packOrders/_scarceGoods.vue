<template>
  <basic-container>
    <Orders order-type="scarceGoods" />
  </basic-container>
</template>

<script>
import Orders from './orders/index'
export default {
  name: 'OmsPackOrdersScarceGoods',
  components: {
    Orders
  }
}
</script>

<style>

</style>
