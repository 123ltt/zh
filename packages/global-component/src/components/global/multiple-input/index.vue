<template>
  <el-input v-model="val"
            type="textarea"
            :autosize="autosize"
            :placeholder="placeholder"
            resize="none"
            v-bind="$attrs"
  />
</template>

<script>
import { debounce } from '@/util/util'
export default {
  name: 'GMultipleInput',
  props: {
    value: [String, Array],
    placeholder: {
      type: String,
      default: '请输入'
    },
    // 最大行数
    maxRows: {
      type: Number,
      default: 3
    },
    // 返回给v-model的值类型，只支持 array 和 string
    returnType: {
      type: String,
      default: 'array'
    },
    // 分割字符串的正则表达式
    regExp: {
      type: RegExp,
      default: () => /\s+/
    }
  },
  data() {
    return {
      val: '',
      cache: '', // 记录上次的值
      autosize: {
        minRows: 1,
        maxRows: this.maxRows
      },
      cacheHeight: 0
    }
  },
  watch: {
    val(v) {
      let arr = v === '' ? [] : v.split(this.regExp)
      arr = [...new Set(arr.filter(Boolean))]
      this.cache = this.returnType === 'string' ? arr.join(',') : arr
      this.$emit('input', this.cache)
    },
    value: {
      handler(v) {
        if (v === this.cache) return
        if (Array.isArray(v)) {
          this.val = v.join('\n')
        } else {
          this.val = v
        }
      },
      immediate: true
    }
  },
  mounted() {
    const $textarea = this.$el.querySelector('textarea')
    this.cacheHeight = $textarea.offsetHeight

    const fn = debounce(() => {
      if (this.cacheHeight !== $textarea.offsetHeight) {
        this.cacheHeight = $textarea.offsetHeight
        this.$store.commit('SET_WINDOW_RESIZE')
      }
    }, 200)

    $textarea.addEventListener('input', fn)
    this.$once('hook:beforeDestroy', () => {
      $textarea.removeEventListener('input', fn)
    })
  }
}
</script>
