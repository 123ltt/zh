<template>
  <el-cascader
    :value="value"
    size="mini"
    :disabled="disabled"
    :options="warehouseList"
    :props="Object.assign({ label: 'warehouseName', value: 'warehouseCode' },props)"
    v-bind="$attrs"
    @change="changeCode"
  />
</template>

<script>
import { getWarehouse } from '@/api/presuffixResolution'
import { getWarehouseWithVirtualRule } from '@/api/common.js'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => ({})
    },
    changeFn: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    virtualRuleData: Object
  },
  data() {
    return {
      warehouseList: []
    }
  },
  mounted() {
    const api = this.virtualRuleData ? getWarehouseWithVirtualRule(this.virtualRuleData) : getWarehouse()
    api.then(res => {
      this.warehouseList = this.recursiveTree(res.data)
      this.$emit('rendered', res.data)
    })
  },
  methods: {
    recursiveTree(tree) {
      tree.forEach(item => {
        if (item.children?.length === 0) {
          item.children = null
          if (item.warehouseCode === 'VIRTUAL') item.disabled = true
        } else if (item.children?.length > 0) {
          this.recursiveTree(item.children)
        }
      })
      return tree
    },
    changeCode(val) {
      this.$emit('update:value', val)
      this.$emit('changeFn')
    }
  }
}
</script>

<style>

</style>
