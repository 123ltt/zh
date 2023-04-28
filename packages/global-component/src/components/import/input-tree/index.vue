<template>
  <el-popover ref="popTree" placement="bottom" trigger="click" popper-class="p-0" :disabled="disabled">
    <div class="dropdown-menu py-1 w-100 d-flex flex-column">
      <div class="px-1">
        <el-input v-model="keyword" size="small" placeholder="输入关键词进行过滤" clearable />
      </div>
      <div class="h-100 overflow-auto px-1">
        <el-tree ref="tree"
                 :data="data"
                 :node-key="props.value"
                 default-expand-all
                 :props="props"
                 :filter-node-method="filterNode"
                 :default-checked-keys="defaultChecked"
                 @node-click="onChecked"
        />
      </div>
    </div>
    <div slot="reference">
      <g-input-tags v-model="checked"
                    :multiple="multiple"
                    :tag-mode="multiple"
                    show-arrow
                    clearable
                    :disabled="disabled"
                    :collapse-tags="collapseTags"
                    :placeholder="placeholder"
      />
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'InputTree',
  props: {
    value: [Array, Object, String, Number],
    // tree数据
    data: {
      type: Array,
      default: () => []
    },
    // 对于`el-tree`组件的`props`配置
    props: {
      type: Object,
      default: () => ({ label: 'title', value: 'value', children: 'children' })
    },
    // 是否多选。默认`false`
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否收起tag（`multiple`为true时生效）
    collapseTags: {
      type: Boolean,
      default: true
    },
    // 是否禁用，默认`false`
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否允许选中节点。默认`false`（即只允许选择叶子结点）
    nodeChecked: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  data() {
    const initChecked = this.getFullPathFromData(this.data)
    return {
      keyword: '',
      checked: initChecked,
      defaultChecked: this.getCheckedKeys(initChecked)
    }
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val)
    },
    checked: {
      handler(a, b) {
        this.$emit('input', this.checked)
        if (a !== undefined || b !== undefined) {
          this.updateCheckedNodes()
          this.$emit('change', this.checked)
        }
      },
      immediate: true
    },
    value(newVal) {
      if (this.checked !== newVal ||
      (Array.isArray(newVal) && newVal.some(el => typeof el !== 'object')) // 处理 value 直接 push 新的value值
      ) {
        this.checked = this.getFullPathFromData(this.data)
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label].toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    onChecked(data, node) {
      if (this.nodeChecked || node.isLeaf) {
        const currentValue = data[this.props.value]

        // 检查并处理已勾选的情况
        if (this.multiple) {
          const index = this.checked.findIndex(item => item.value === currentValue)
          if (index > -1) {
            this.checked.splice(index, 1)
            return
          }
        } else {
          if (this.checked !== undefined && this.checked.value === currentValue) {
            this.checked = null
            return
          }
        }

        const { labels, values } = this.getFullPathFromNode(node)
        const d = {
          label: data[this.props.label],
          value: currentValue,
          title: labels.join(' / '),
          values
        }
        if (this.multiple) {
          this.checked.push(d)
        } else {
          this.checked = d
          this.$refs.popTree.showPopper = false
        }
      }
    },
    getCheckedKeys(data) {
      if (data === undefined || (Array.isArray(data) && data.length === 0)) return []
      return this.multiple ? data.map(item => item[this.props.value]) : [data[this.props.value]]
    },
    // 更新tree选中
    updateCheckedNodes() {
      this.$nextTick(() => {
        const checkedKyes = this.getCheckedKeys(this.checked)
        this.$refs.tree.setCheckedKeys(checkedKyes)
      })
    },
    getFullPathFromNode(node) {
      const labels = []
      const values = []
      const walk = node => {
        if (node.parent) {
          labels.unshift(node.data[this.props.label])
          values.unshift(node.data[this.props.value])
          walk(node.parent)
        }
      }
      walk(node)
      return {
        labels: labels.slice(1), // 顶级不用显示（不然太长了）
        values
      }
    },
    getFullPathFromData(data) {
      const key = this.props.value
      const valueData = Array.isArray(this.value) ? this.value : [this.value]
      const values = valueData.map(item => {
        return typeof item === 'object' ? item[key] : item
      })
      const arr = []
      let count = 0
      const recursion = (list, p = []) => {
        for (let i = 0, len = list.length; i < len; i++) {
          if (count === values.length) return
          const item = list[i]
          const val = item[key]

          const index = values.indexOf(val)
          if (index > -1) {
            count++
            arr[index] = p.concat(item)
          } else if (Array.isArray(item.children)) {
            recursion(item.children, p.concat(item))
          }
        }
      }
      recursion(data)
      const result = arr.map((item, index) => {
        const values = []
        const labels = []
        item.forEach(el => {
          values.push(el[this.props.value])
          labels.push(el[this.props.label])
        })
        return {
          value: values[values.length - 1],
          label: labels[labels.length - 1],
          values,
          title: labels.join(' / ')
        }
      })
      return this.multiple ? result : result[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
  max-height: 360px;
  ::v-deep {
    .is-checked {
      color: var(--color-primary);
    }
  }
}
</style>
