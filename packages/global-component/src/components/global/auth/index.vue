<script>
// 根据传入的code判断是否有权限，如果有权限则显示默认插槽的内容
export default {
  name: 'GAuth',
  props: {
    // 对应 菜单标签 的值
    code: [String, Array]
  },
  computed: {
    permission() {
      return this.$store.state.user.permission || {}
    }
  },
  render(h) {
    if (
      (Array.isArray(this.code) && this.code.some(item => this.permission[item])) ||
      this.permission[this.code]
    ) {
      return this.$slots.default
    }
    return h()
  }
}
</script>
