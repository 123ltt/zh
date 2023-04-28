
export default {
  data() {
    return {
      __positionY: [] // 用于记录滚动位置 使得切回页面时能保留之前的位置
    }
  },
  methods: {
    mx_renderContent(type, checkedId) {
      return (h, { node, data, store }) => {
        let tip = ''
        if (type === 1 && this.useMapping) {
          tip = (
            <el-button size="mini" type="text" disabled={data.isMapped}>
              {data.isMapped ? '已映射' : '未映射'}
            </el-button>
          )
        }

        const className = {
          'custom-tree-node': true,
          active: checkedId === data[this.rowKey]
        }
        return (
          <span class={className}>
            <span>{node.data.label}</span>
            {node.isLeaf && tip}
          </span>)
      }
    },
    mx_recursionResDataAddLabel(arr) {
      const { label, labelEn, children = 'children' } = this.props
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item[label] && labelEn && item[labelEn]) {
            item.label = item[label] + `(${item[labelEn]})` // 中英文名称同时存在
          } else if (item[label]) {
            item.label = item[label]
          } else {
            item.label = item[labelEn]
          }
          this.mx_recursionResDataAddLabel(item[children])
        })
      }
    },
    // 根据id找到节点组件
    mx_getCheckedNodeComponent(ref, id, rowKey) {
      let comp = null
      function walk(ref) {
        if (ref.node && ref.node.data[rowKey] === id) {
          comp = ref
          return true
        }
        ref.$children.find(item => walk(item))
        return false
      }
      walk(ref)
      return comp
    },
    mx_scrollTop(treeRef, nodeEl) {
      treeRef.$el.parentElement.scrollTop = nodeEl.offsetTop - 28
    },
    // 从tree的ref中根据当前选中的节点获取下一个node和相应的全路径id
    mx_getNextNodeDataFromRef(ref, checkedKey, nodeChecked = false) {
      // 注意： ref.getCurrentNode 和 ref.getCurrentKey 只能获取手动点击的节点，所以在此处不能使用
      const currentNode = ref.getNode(checkedKey)

      // 递归找子孙节点中的第一个叶子节点
      const getFirstChildNode = node => {
        if (!node.isLeaf) {
          if (node.childNodes.length === 0) return node

          // 在所有的节点中查找第一个可见叶子结点
          for (let i = 0, len = node.childNodes.length; i < len; i++) {
            const child = node.childNodes[i]
            if (child.visible) {
              if (nodeChecked) return child
              if (child.isLeaf) return child
              const c = getFirstChildNode(child)
              if (c) return c
            }
          }
          return null
        }
        return node
      }

      // 注意： visible 属性表示节点是否可见（通过filter-node-method过滤会使节点的visible变成false）
      const getNextNode = node => {
        if (node.visible) {
          // 子节点中的第一个节点
          if (node.childNodes.length > 0) {
            const d = node.childNodes.find(item => item.visible)
            if (d) return d
          }

          // 同级的下一个节点
          if (node.nextSibling && node.nextSibling.visible) {
            return getFirstChildNode(node.nextSibling)
          }
        }

        // 父级的下一个相邻节点（可能是节点，也可能是叶子结点）
        let p = node.parent
        while (p) {
          if (!p.visible) {
            p = p.parent
            continue
          }

          let next = p.nextSibling
          while (next) {
            if (!next.visible) {
              next = next.nextSibling
              continue
            }
            // 如果允许选中节点，则直接返回父节点的下个相邻节点
            if (nodeChecked) return next
            const firstChild = getFirstChildNode(next)
            if (firstChild) return firstChild
            next = next.nextSibling
          }

          p = p.parent
        }
        return null
      }

      if (currentNode) {
        const nextNode = getNextNode(currentNode)
        if (nextNode) {
          return nextNode
        }
      }
      return null
    },
    // 返回node节点
    mx_getNode(rowKeyValue) {
      // node.data 与 原数据 是引用关系，所以可以通过直接修改 node.data 中的数据去修改原数据
      return this.treeRef.getNode(rowKeyValue)
    },
    // 根据自定义的字段获取对应字段的全路径
    mx_getFullpath(node, fields = []) {
      let n = node
      const o = fields.reduce((prev, item) => {
        prev[item] = []
        return prev
      }, {})

      while (n.parent) {
        fields.forEach(item => {
          o[item].unshift(n.data[item])
        })
        n = n.parent
      }
      return o
    },
    // 记录滚动条位置
    mx_recordScrollPosition($el) {
      const fn = (e) => {
        this.__positionY = e.target.scrollTop
      }
      $el.addEventListener('scroll', fn)
      this.$once('hook:beforeDestroy', () => {
        $el.removeEventListener('scroll', fn)
      })
    },
    // 还原滚动条位置
    mx_restoreScrollPosition($el) {
      const el = $el || this.$refs.container
      if (el) {
        this.$nextTick(() => {
          el.scrollTop = this.__positionY
        })
      }
    }
  },
  activated() {
    this.mx_restoreScrollPosition(this.$refs.container)
  },
  mounted() {
    if (this.$refs.container) this.mx_recordScrollPosition(this.$refs.container)
  }
}
