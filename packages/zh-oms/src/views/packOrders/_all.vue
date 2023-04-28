<template>
  <basic-container>
    <Orders order-type="all" />
  </basic-container>
</template>

<script>
import Orders from './orders/index'
export default {
  name: 'OmsPackOrdersAll',
  components: {
    Orders
  }
}
</script>

<style>

</style>
