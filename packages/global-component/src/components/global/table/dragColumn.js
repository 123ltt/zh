// 拖拽表头排序
import Sortable from 'sortablejs/modular/sortable.core.esm.js'

export default {
  methods: {
    // 表头拖拽排序
    _tableHeadDrageable() {
      const thead = this.$refs.tableRef.$el.querySelector('thead>tr')
      const sortable = new Sortable(thead, {
        onEnd: evt => {
          const newIndex = evt.newIndex
          const oldIndex = evt.oldIndex
          if (newIndex === oldIndex) return

          const headers = this.tableHeaders.map(item => Object.assign({}, item))
          headers.splice(newIndex, 0, ...headers.splice(oldIndex, 1))

          const arr = this.headers.map(item => {
            const index = headers.findIndex(el => {
              if (item.slot && el.slot && item.slotName === el.slotName) {
                return true
              }
              if (item.slot === undefined && el.slot === undefined && item.prop === el.prop) {
                return true
              }
              return false
            })
            if (index > -1) {
              return Object.assign({}, item, { _sort: index })
            }
            return Object.assign({}, item)
          })

          this.updateHeaders(arr)
        }
      })
      this.$once('hook:beforeDestroy', () => {
        sortable.destroy()
      })
    }
  }
}
