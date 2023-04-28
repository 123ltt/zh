<template>
  <el-cascader v-model="model"
               popper-class="g-cascader"
               :options="list"
               v-bind="cascaderProps"
               v-on="$listeners"
  />
</template>

<script>
import { deepClone } from '@/util/util'
import { findComponent } from '../../utils/componentUtil'

export default {
  name: 'GCascader',
  inject: {
    elForm: {
      default: null
    }
  },
  // 用于避免 ElForm组件 使用disabled 导致级联无法点击查看
  provide: {
    elForm: null
  },
  props: {
    value: Array,
    options: Array,
    // 传入给 elCascader 的 value 是否是叶子节点的值
    isLeaf: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: [],
      cacheValue: deepClone(this.value),
      valueField: this.$attrs.props?.value || 'value',
      childrenField: this.$attrs.props?.children || 'children',
      checkedCount: 0
    }
  },
  computed: {
    isDisabled() {
      return !!((this.elForm || {}).disabled || this.$attrs.disabled)
    },
    cascaderProps() {
      const props = Object.assign({}, this.$attrs.props)

      if (this.isDisabled) {
        props.multiple = false
      }

      return Object.assign({}, this.$attrs, {
        props,
        disabled: false,
        placeholder: this.isDisabled
          ? (this.checkedCount > 0 ? `已勾选${this.checkedCount}个，点击查看` : '未勾选')
          : this.$attrs.placeholder
      })
    },
    list() {
      if (this.isDisabled) {
        const ctx = findComponent(this, 'ElCascaderPanel')
        if (ctx) {
          ctx.activePath = [] // 去掉当前选中的层级，避免报错
        }
      }
      return this.isDisabled ? this.leafAddDisabled(this.filter()) : this.options
    }
  },
  watch: {
    options: {
      handler() {
        if (this.$attrs.props.emitPath === false) {
          this.model = this.value
        } else {
          this.model = this.isLeaf ? this.getFullPathByLeaf(this.value) : this.value
        }
        this.checkedCount = this.value.length
      },
      immediate: true
    },
    value: {
      handler(v) {
        // 如果是外部更新value值，则需要确保新值的格式与初始值的格式一致
        // 如初始值全部为叶子节点，则更新时的值也需要是叶子节点。如果是全路径值，也亦如此
        if (v === this.model) return
        if (Array.isArray(this.options) && this.options.length > 0) {
          if (this.$attrs.props.emitPath === false) {
            this.model = this.value
          } else {
            if (this.isLeaf) {
              const v = this.getFullPathByLeaf(this.value)
              this.model = this.$attrs.props?.multiple ? v : v.flat()
            } else {
              this.model = this.value
            }
          }
          this.$emit('input', this.model)
        }
      },
      immediate: true
    },
    model(v) {
      this.cacheValue = this.getLeafFromFullpath(v)
      this.checkedCount = v.length
      this.$emit('input', v)
    }
  },
  methods: {
    filter() {
      const value = this.cacheValue || []
      if (this.isLeaf) {
        return this.filterByLeaf(value)
      }

      // 提取出所有的叶子节点（默认认为数组中最后一个元素为叶子节点）
      const leafs = []
      if (this.$attrs?.props?.multiple) {
        value.forEach(item => {
          leafs.push(item[item.length - 1])
        })
      } else {
        leafs.push(value[value.length - 1])
      }
      return this.filterByLeaf(leafs)
    },
    // 根据节点或叶子节点过滤数据
    filterByLeaf(nodes = []) {
      const recursion = (arr) => {
        return arr.map(item => {
          if (nodes.indexOf(item[this.valueField]) > -1) {
            return item
          } else if (Array.isArray(item[this.childrenField]) && item[this.childrenField].length > 0) {
            const children = recursion(item[this.childrenField])
            if (children.length > 0) {
              item[this.childrenField] = children
              return item
            }
            return null
          }
          return null
        }).filter(Boolean)
      }
      return recursion(deepClone(this.options))
    },
    // 根据叶子节点找全路径
    getFullPathByLeaf(leafs = []) {
      const values = []
      const recursion = (arr, p = []) => {
        arr.forEach(item => {
          const val = item[this.valueField]
          if (leafs.indexOf(val) > -1) {
            values.push(p.concat(val))
          } else if (Array.isArray(item[this.childrenField])) {
            recursion(item[this.childrenField], p.concat(val))
          }
        })
      }
      recursion(this.options)
      return values
    },
    // 从全路径中提取出叶子节点
    getLeafFromFullpath(arr) {
      if (this.isLeaf) {
        return arr.map(item => Array.isArray(item) ? item[item.length - 1] : item)
      }
      return arr
    },
    // 给所有的叶子节点添加disabled属性
    leafAddDisabled(data) {
      const recursion = (d) => {
        if (Array.isArray(d)) {
          d.forEach(item => {
            recursion(item)
          })
        } else if (Array.isArray(d?.children)) {
          recursion(d.children)
        } else {
          d.disabled = true
        }
      }
      recursion(data)
      return data
    }
  }
}
</script>

<style lang="scss">
.g-cascader {
  .el-cascader-node.is-disabled{
    cursor: default;
    color: $--color-text-regular;
  }
}
</style>
