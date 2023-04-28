// 自定义列
export default {
  data() {
    return {
      activedColumn: false, // popover的显示隐藏
      showCustomBtn: false // 自定义列按钮的显示隐藏
    }
  },
  mounted() {
    if (this.draggable) {
      let f

      // 处理自定义列按钮的显示隐藏
      this._on([
        this.$refs.tableRef.$el.querySelector('table.el-table__header'),
        this.$refs.popover.$el
      ], {
        mouseenter: () => {
          clearTimeout(f)
          this.showCustomBtn = true
        },
        mouseleave: () => {
          clearTimeout(f)
          f = setTimeout(() => {
            this.showCustomBtn = false
          }, 300)
        }
      })
    }
  },
  methods: {
    _onColumnChange(headers) {
      const updatedHeaders = this.headers.map((item, index) => {
        if (this.specialColumnTypes.includes(item.type)) return item
        const d = headers.find(el => el._index === index)
        if (d) {
          item.visible = true
          item._sort = d._sort
        } else {
          item.visible = false
          item._sort = undefined
        }
        return item
      })

      this.updateHeaders(updatedHeaders)
    },
    _on(el, options) {
      const els = Array.isArray(el) ? el : [el]
      const arr = Object.entries(options)
      const offs = []
      arr.forEach(([eventName, fn]) => {
        els.forEach(e => {
          e.addEventListener(eventName, fn)
          offs.push(e, eventName, fn)
        })
      })
      this.$once('beforeDestroy', () => {
        arr.forEach(([eventName, fn]) => {
          els.forEach(e => {
            e.removeEventListener(eventName, fn)
          })
        })
      })
    }
  }
}
