<template>
  <el-button :loading="loading" v-bind="$attrs" :type="type" @click="submit">
    <slot />
  </el-button>
</template>

<script>
import { debounce } from '@/util/util'
export default {
  name: 'AutoButton',
  inheritAttrs: false,
  props: {
    // button类型,默认text
    type: {
      type: String,
      default: 'text'
    },
    // 自动显示loading
    autoLoading: {
      type: Boolean,
      default: false
    },
    confirmConfig: {
      type: Object,
      default: () => ({})
    },

    autoConfirm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    submit: debounce(
      function() {
        this.autoLoading && (this.loading = true)
        this.$emit('click', () => {
          this.loading = false
        })
        if (this.autoConfirm) {
          const {
            message = '你确定删除该数据',
            title = '提示',
            confirmButtonText = '确定',
            cancelButtonText = '取消',
            type = 'warning'
          } = this.confirmConfig
          this.$confirm(message, title, {
            confirmButtonText,
            cancelButtonText,
            type
          })
            .then(() => {
              this.$emit('confirm')
            })
            .catch(() => {
              this.$emit('cancel')
            })
        }
      }, 1000, true
    )

  }

}
</script>

<style>

</style>
