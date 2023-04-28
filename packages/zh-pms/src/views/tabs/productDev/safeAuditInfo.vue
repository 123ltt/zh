<template>
  <div class="safeAuditInfo">
    <SafetyAuditInfo :id="id" :form-data="formData" :api-fn="saveSafeInfo" v-bind="attrs" />
  </div>
</template>

<script>
export default {
  name: 'SafeAuditInfo',
  components: {
    SafetyAuditInfo: () => import('../../addInfo/safetyAuditInfo.vue')
  },
  props: {
    id: String,
    saveSafeInfo: Function,
    formData: Object
  },
  data() {
    return {
      attrs: this.$attrs
    }
  }
}
</script>
