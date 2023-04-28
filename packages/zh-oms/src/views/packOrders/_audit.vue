<template>
  <basic-container>
    <Orders order-type="audit" />
  </basic-container>
</template>

<script>
import Orders from './orders/index'
export default {
  name: 'OmsPackOrdersAudit',
  components: {
    Orders
  }
}
</script>

<style>

</style>
