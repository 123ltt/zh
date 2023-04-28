<template>
  <basic-container>
    <ProductConfig key="securityRules" type="securityRules" @query="querySafety" @update="updateSafety" @queryById="querySafetyById" @delSafety="delSafety" />
  </basic-container>
</template>

<script>
import ProductConfig from './modal/ProductConfig'
import { querySafety, updateSafety, querySafetyById, delSafety } from '@/api/securityRulesConfig'
export default {
  name: 'PmsSecurityRulesConfig',
  components: { ProductConfig },
  methods: {
    async querySafety(data) {
      const res = await querySafety(data)
      const { code, data: { records, total } } = res
      if (code === 200) return { data: records, total }
      return { data: [], total: 0 }
    },
    async querySafetyById(id) {
      return await querySafetyById(id)
    },
    async delSafety(ids, data) {
      const res = await delSafety(ids)
      return res.code === 200
    },
    updateSafety(data) {
      return updateSafety(data)
    }
  }
}
</script>
