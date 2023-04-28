<template>
  <g-select v-model="val" :items="list" key-field="id" value-field="id" label-field="value" />
</template>

<script>
import { getDeverList } from '@/api/sku'

export default {
  props: {
    value: String,
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      val: this.value,
      list: []
    }
  },
  watch: {
    val(v) {
      this.$emit('input', v)
    },
    value(v) {
      this.val = v
    }
  },
  created() {
    getDeverList(this.type).then(res => {
      this.list = res.data || []
      this.$emit('loaded', this.list)
    })
  }
}
</script>
