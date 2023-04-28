<template>
  <basic-container>
    <ProductConfig key="productLine" type="productLine" @query="queryLine" @update="updateLine" @queryById="queryLineById" />
  </basic-container>
</template>

<script>
import ProductConfig from './modal/ProductConfig'
import { queryLine, updateLine, queryLineById } from '@/api/productLineConfig'
export default {
  name: 'PmsProductLineConfig',
  components: { ProductConfig },
  methods: {
    async queryLine(data) {
      const res = await queryLine(data)
      const { code, data: { records, total } } = res
      if (code === 200) return { data: records, total }
      return { data: [], total: 0 }
    },
    async queryLineById(id) {
      return await queryLineById(id)
    },
    updateLine(data) {
      return updateLine(data).then(res => res)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
