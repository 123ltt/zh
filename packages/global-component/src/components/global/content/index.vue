<template>
  <div :class="wrapClass" class="h-100 px-1">
    <el-input v-if="editable"
              v-model="content"
              :type="type"
              resize="none"
              :autosize="autosize"
              v-on="$listeners"
              @focus="onFocus"
              @blur="onBlur"
    />
    <template v-else>
      <g-text-ellipsis v-if="content&&ellipsis" :content="content" :lines="ellipsisLines" />
      <span v-else class="d-inline-block">{{ content }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GContent',
  props: {
    value: String,
    // 是否启用编辑功能
    editable: {
      type: Boolean,
      default: false
    },
    // 输入框的类型，可选值：`input`，`textarea`
    type: {
      type: String,
      default: 'input'
    },
    // 只有type为textarea有效, [min, max]
    rows: {
      default: () => ([1, Infinity]),
      validator(arr) {
        if (!Array.isArray(arr)) return false
        if (arr.length !== 2) return false
        const valid = arr.every(item => typeof item === 'number')
        if (!valid) return false
        return arr[0] >= 0 && arr[0] <= arr[1]
      }
    },
    // 文本过长是否裁剪（显示省略号）
    ellipsis: {
      type: Boolean,
      default: true
    },
    // 文本超过几行时开始裁剪（ellipsis 为 true 才会生效）
    ellipsisLines: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      content: this.value,
      currentRows: this.rows[0],
      focusing: false
    }
  },
  computed: {
    wrapClass() {
      const c = []
      if (this.editable) {
        c.push('bottom-line d-flex')
      }
      if (this.focusing) c.push('bottom-line-focus')
      return c.join(' ')
    },
    autosize() {
      const [minRows, maxRows] = this.rows
      return { minRows, maxRows }
    }
  },
  watch: {
    value(v) {
      this.content = v
    },
    content(v) {
      this.$emit('input', v)
    }
  },
  methods: {
    onFocus() {
      this.focusing = true
    },
    onBlur() {
      this.focusing = false
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-line {
  box-shadow: 0 -1px 0 0 $--border-color-base inset;
  &-focus {
   box-shadow: 0 -1px 0 0 var(--color-primary) inset;
  }
  ::v-deep {
    input, textarea {
      height: 16px;
      line-height: 16px!important;
      border: none;
      padding: 0;
      font-size: $--font-size-base;
      background-color: transparent;
      outline: none;
      display: block;
    }
  }
}
</style>
