<template>
  <div>
    <div v-for="(link,index) in items" :key="index" class="d-flex my-1">
      <el-input v-model="items[index]"
                type="text"
                maxlength="400"
                :placeholder="placeholder"
                class="me-2"
      />
      <el-button v-if="index===items.length-1" class="el-icon-plus" @click="onPlus(index)" />
      <el-button v-if="items.length>1" class="el-icon-minus" @click="onMinus(index)" />
    </div>
  </div>
</template>

<script>
export default {
  inject: {
    elFormItem: { default: null }
  },
  props: {
    /** @type {ZHKJ.VueProps<string[]>} */
    items: Array,
    placeholder: String
  },
  created() {
    if (this.elFormItem) {
      const unwatch = this.$watch('items', () => {
        this.elFormItem.$emit('el.form.change')
      }, { deep: true })
      this.$once('hook:beforeDestroy', unwatch)
    }
  },
  methods: {
    onPlus() {
      this.items.push('')
    },
    onMinus(index) {
      this.items.splice(index, 1)
    }
  }
}
</script>
