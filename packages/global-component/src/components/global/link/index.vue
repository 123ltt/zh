<script>
export default {
  name: 'GLink',
  props: {
    // 自定义标签。默认`a`
    tag: {
      type: String,
      default: 'a'
    },
    color: String,
    // 只在tag为a标签时生效
    href: String,
    // tag为a标签且设置了href时生效。是否在新页面打开。默认`true`
    blank: {
      type: Boolean,
      default: true
    }
  },
  render(h) {
    const classList = ['link-tag']
    if (this.color) {
      classList.push('text-' + this.color)
    }
    const data = {
      class: classList,
      props: this.$attrs,
      on: this.$listeners
    }

    if (this.tag === 'a' && this.href) {
      data.domProps = {
        href: this.href,
        target: this.blank ? '_blank' : '_self'
      }
    }

    return h(this.tag, data, [
      this.$slots.default
    ])
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/element-var.scss";
.link-tag {
  cursor: pointer;
  color: $--color-text-regular;
  &:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
}
</style>
