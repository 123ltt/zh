<template>
  <el-button size="mini" @click="skuCompImport">{{ text }}</el-button>
</template>

<script>

/**
 * @description SKU对照表导入弹窗
 * **/

import skuCompImport from './skuCompImport.vue'
export default {
  name: 'SkuCompImportBtn',
  props: {
    text: {
      type: String,
      default: 'SKU对照表导入'
    },
    checkIds: Array,
    source: String,
    maxLimit: { // 最大限制
      type: Number,
      default: 5
    }
  },
  methods: {
    // SKU对照表导入
    skuCompImport() {
      this.$modal({
        title: 'sku对照表导入',
        width: '560px',
        component: skuCompImport,
        data: {
          ...this.$props
        },
        callback: (refresh) => {
          refresh && this.$emit('refreshList')
        }
      })
    }
  }
}
</script>

<style>

</style>
