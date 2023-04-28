<script>
// 文本过长时根据最大显示长度限制裁剪
export default {
  name: 'GTextEllipsis',
  props: {
    // 标签
    tag: {
      type: String,
      default: 'span'
    },
    lines: {
      type: [Number, String],
      default: 1
    },
    content: String,
    // tooltip出现的位置
    // top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    placement: {
      type: String,
      default: 'top'
    },
    // 显示的主题
    // dark/light
    theme: {
      type: String,
      default: 'dark'
    },
    // tooltip显示的内容最大的长度，默认为`2000`，为0不限制
    tooltipMaxLength: {
      type: Number,
      default: 1000
    },
    // 气泡 自定义class
    popperClass: String
  },
  data() {
    return {
      textContent: this.content,
      disabled: true
    }
  },
  computed: {
    styles() {
      return { '-webkit-line-clamp': this.lines }
    }
  },
  watch: {
    content(val) {
      this.textContent = val
      this.updateDisabled()
    }
  },
  methods: {
    updateDisabled() {
      this.$nextTick(() => {
        const el = this.$el
        // 可视高度小于滚动高度，则启用tooltip
        this.disabled = el.clientHeight >= el.scrollHeight

        if (this.content === undefined) {
          this.textContent = el.textContent
        }
      })
    }
  },
  render(h) {
    this.updateDisabled(false)

    let content
    if (this.tooltipMaxLength > 0 && (this.textContent || '').length > this.tooltipMaxLength) {
      content = this.textContent.slice(0, this.tooltipMaxLength) + '...'
    } else {
      content = this.textContent
    }

    return h('el-tooltip', {
      props: {
        placement: this.placement,
        effect: this.theme,
        content,
        disabled: this.disabled,
        'popper-class': 'text-ellipsis' + [''].concat(this.popperClass).join(' ')
      }
    }, [
      h(this.tag, {
        staticClass: 'text-ellipsis-multi',
        style: this.styles
      }, [
        this.content !== undefined ? content : this.$slots.default
      ])
    ])
  }
}
</script>

<style lang="scss" scoped>
.text-ellipsis-multi {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>

<style lang="css">
.text-ellipsis.el-tooltip__popper {
  max-width: 50em;
  /* min-width: 16em; */
}
</style>
