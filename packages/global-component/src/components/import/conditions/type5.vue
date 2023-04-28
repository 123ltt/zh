<template>
  <div class="type5">
    <el-input v-model="form.amount"
              v-input.number
              :size="size"
              :disabled="disabled"
              class="t5-amount"
              @input="emitValue"
    />
    <g-select v-model="form.currencyCode"
              key-field="value"
              :items="values"
              :readonly="disabled"
              class="ms-1 t5-select"
              @change="emitValue"
    />
  </div>
</template>

<script>
export default {
  name: 'Type5',
  inject: ['extendsField'],
  props: {
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    /** @type {ZHKJ.VueProps<Promise<CONDITION.BaseItem[]>>} 获取币种下拉列表的请求 */
    currencyRequest: Function,
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      form: {
        amount: '',
        currencyCode: ''
      },
      values: []
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal === '') {
          this.form.amount = ''
          this.form.currencyCode = ''
          return
        }
        try {
          const v = JSON.parse(newVal)
          if (Array.isArray(v)) {
            this.form.amount = v[0].amount
            this.form.currencyCode = v[0].currencyCode
          }
        } catch (err) {
          console.error(err)
        }
      },
      immediate: true
    },
    extendsField: {
      handler() {
        this.emitValue()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (typeof this.currencyRequest === 'function') {
      this.currencyRequest().then(res => {
        this.values = res
      })
    }
  },
  methods: {
    emitValue() {
      const d = Object.assign({}, this.extendsField['5'] || {}, this.form)
      // 后端需要json数组
      this.$emit('input', JSON.stringify([d]))
    }
  }
}
</script>

<style lang="scss" scoped>
.type5 {
  .t5-amount {
    width: 80px
  }
  .t5-select {
    width: 116px;
  }
}
</style>
