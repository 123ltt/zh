<script>
export default {
  props: {
    value: {
      type: String,
      default: 'se'
    }
  },
  data() {
    return {
      active: this.value
    }
  },
  watch: {
    value(v) {
      this.active = v
    }
  },
  render(h) {
    const list = [
      { value: 'nw', icon: 'top-left' },
      { value: 'north', icon: 'top' },
      { value: 'ne', icon: 'top-right' },
      { value: 'west', icon: 'back' },
      { value: 'center', icon: 'minus' },
      { value: 'east', icon: 'right' },
      { value: 'sw', icon: 'bottom-left' },
      { value: 'south', icon: 'bottom' },
      { value: 'se', icon: 'bottom-right' }
    ]

    const items = list.map(item => {
      return h('li', {
        staticClass: 'el-icon-' + item.icon,
        class: { active: this.active === item.value },
        on: {
          click: () => {
            this.active = item.value
            this.$emit('input', this.active)
          }
        }
      })
    })

    return h('ul', { staticClass: 'position-select' }, items)
  }
}
</script>

<style lang="scss" scoped>
$size: 30px;
$borderColor: #ddd;
.position-select {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
  widtH: $size * 3 + 6px;
  border: 1px $borderColor solid;
  li {
    width: $size;
    height: $size;
    border: 1px $borderColor solid;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
    &.active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }
  }
}
</style>
