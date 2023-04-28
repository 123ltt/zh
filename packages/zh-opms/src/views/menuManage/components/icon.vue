<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    isSvg() {
      return /^svg:/.test(this.icon)
    }
  },
  methods: {
    svgIcon() {
      return this.icon.replace(/^svg:/, '')
    }
  },
  render(h) {
    if (/^svg:/.test(this.icon)) {
      return h('svgicon', {
        props: {
          icon: this.svgIcon()
        }
      })
    } else {
      return h('i', {
        staticClass: this.icon
      })
    }
  }
}
</script>
