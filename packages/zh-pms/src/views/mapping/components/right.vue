<template>
  <el-card v-loading="fetching" class="ms-2 h-100" :class="{'is-header':!!title}">
    <div v-if="title" slot="header">
      <b>{{ title }}</b>
    </div>
    <div v-if="isTriggerLoad" class="h-100 d-flex align-items-center justify-content-center text-muted">暂无数据</div>
    <template v-else>
      <el-form inline size="mini" class="no-message" @submit.native.prevent="search">
        <slot name="title" />
        <el-form-item label="类目名称">
          <el-input v-model="keyword" placeholder="输入关键词模糊搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
      <div ref="container" class="overflow-auto" style="height:calc(100% - 46px)">
        <el-tree v-if="isLazy"
                 :key="key"
                 ref="asyncTree"
                 lazy
                 :load="load"
                 :props="props"
                 :node-key="rowKey"
                 :render-content="mx_renderContent(2,checkedId)"
                 :default-expanded-keys="expandedIds"
                 :default-checked-keys="checkedIds"
                 @node-click="nodeClick"
        />
        <el-tree v-else
                 key="b"
                 ref="syncTree"
                 :data="searchList"
                 :props="props"
                 :node-key="rowKey"
                 :render-content="mx_renderContent(2,checkedId)"
                 :default-expanded-keys="expandedIds"
                 :default-checked-keys="checkedIds"
                 default-expand-all
                 @node-click="nodeClick"
        />
      </div>
    </template>
  </el-card>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    value: [String, Number],
    title: String,
    props: {
      type: Object,
      default: () => ({ label: 'label', isLeaf: 'isLeaf' })
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    // tree数据请求
    treeRequest: Function,
    // 搜索请求
    searchRequest: Function,
    loading: {
      type: Boolean,
      default: false
    },
    // 选中的全路径id
    checked: {
      type: Array,
      default: () => []
    },
    // 是否需要通过调用 triggerLoad 方法来触发加载tree
    isTrigger: {
      type: Boolean,
      default: false
    },
    // 是否允许选中节点。默认只允许选中叶子结点
    nodeChecked: {
      type: Boolean,
      default: false
    },
    // 懒加载下级时传入id对应的字段（主要针对平台亚马逊）
    parentKey: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      fetching: this.loading,
      checkedId: this.value,
      checkedPathId: [], // 已选中的全路径id
      keyword: '',
      expandedIds: [],
      willAutoLocationKeys: [], // 将要自动定位到的类目ID
      checkedIds: [],
      // 是否启用懒加载
      isLazy: true,
      searchList: [],
      isTriggerLoad: this.isTrigger,
      key: 'a',
      params: {}
    }
  },
  computed: {
    treeRef() {
      return this.isLazy ? this.$refs.asyncTree : this.$refs.syncTree
    }
  },
  watch: {
    value(val) {
      this.checkedId = val
    },
    fetching(val) {
      this.$emit('update:loading', val)
    },
    checkedId(val) {
      this.$emit('input', val)
    },
    checkedPathId(val) {
      this.$emit('update:checked', val)
    }
  },
  methods: {
    load(node, resolve) {
      const id = node.level === 0 ? '' : node.data[this.parentKey]
      this.fetching = true
      this.treeRequest(id, this.params).then(res => {
        this.mx_recursionResDataAddLabel(res.data)

        // 如果有自动定位到的类目时，根据id一级一级的加载
        if (this.willAutoLocationKeys.length > 0) {
          this.treeRef.$nextTick(() => {
            const expandId = this.willAutoLocationKeys.shift()
            this.expandedIds = [expandId]
          })
        } else if (this.willAutoLocationKeys.length === 0 && this.expandedIds.length > 0) {
          this.treeRef.$nextTick(() => {
            setTimeout(() => {
              const id = this.expandedIds[this.expandedIds.length - 1]
              const comp = this.mx_getCheckedNodeComponent(this.treeRef, id, this.rowKey)
              if (comp) {
                this.mx_scrollTop(this.treeRef, comp.$el)
              }
            }, 200)
          })
        }
        resolve(res.data)
      }).finally(() => {
        if (this.willAutoLocationKeys.length === 0) {
          clearTimeout(this.f)
          this.fetching = false
        } else {
          this.f = setTimeout(() => {
            this.fetching = false
          }, 5000)
        }
      })
    },
    autoLocation(categoryPathIdList) {
      if (this.isLazy) {
        this.expandedIds = []
        this._autoLocation(categoryPathIdList)
      } else {
        this.keyword = ''
        this.isLazy = true
        // 监听是否切换到asyncTree
        this.$nextTick(() => {
          // 监听切换到asyncTree后 是否加载完数据
          const unwatch = this.$watch(() => this.fetching, newVal => {
            if (newVal === false) {
              unwatch()
              // 加载完数据后 监听类目是否渲染完成
              this.$nextTick(() => {
                this.expandedIds = []
                this._autoLocation(categoryPathIdList)
              })
            }
          })
        })
      }
    },
    // 根据id自动定位到叶子节点
    _autoLocation(categoryPathIdList) {
      if (!categoryPathIdList || (Array.isArray(categoryPathIdList) && categoryPathIdList.length === 0)) return
      this.checkedPathId = categoryPathIdList // 将categoryPathIdList设置为当前选中的全路径id
      let ids = [].concat(categoryPathIdList)
      const latestId = ids[ids.length - 1]

      // 过滤已加载的层级（已加载的层级通过 expandedIds 展开时不会触发load方法，导致不能自动定位）
      const index = ids.findIndex(item => {
        return this.mx_getCheckedNodeComponent(this.treeRef, item, this.rowKey) === null
      })
      ids = ids.slice(index - 1)

      const nodeComponent = this.mx_getCheckedNodeComponent(this.treeRef, latestId, this.rowKey)
      // 如果找到节点组件，则说明数据已加载不会走load方法
      if (nodeComponent) {
        this.expandedIds.push(latestId)
        let node = nodeComponent.node
        let count = 0
        while (node) {
          node = node.parent
          if (node && !node.expanded) {
            count++
          }
        }
        setTimeout(() => {
          this.mx_scrollTop(this.treeRef, nodeComponent.$el)
        }, count * 200)
      } else {
        // 如果未找到节点组件，则需要通过load加载数据
        // 通过更新 expandedIds 的值触发load方法
        this.expandedIds.push(ids.shift())
        this.willAutoLocationKeys = ids
        // 选中节点（根据后端返回的节点id，取最后一个即最后一级）
        this.checkedIds = [latestId]
      }
      this.checkedId = latestId
    },
    nodeClick(data, node) {
      // 点击节点时，将expandedIds清空，避免触发load时又重新定位
      if (!node.isLeaf) {
        this.expandedIds = []
      }

      if (this.nodeChecked || node.isLeaf) {
        // 获取各种字段全路径
        const rowkeys = []
        const fields = this.props.fields || []
        const obj = {}
        fields.forEach(key => {
          obj[key] = []
        })

        let $node = node
        while ($node.parent) {
          rowkeys.unshift($node.data[this.rowKey])

          fields.forEach(key => {
            obj[key].unshift($node.data[key])
          })

          $node = $node.parent
        }
        this.checkedPathId = rowkeys

        this.checkedId = data[this.rowKey]

        // 根据 props.fields 的配置返回对应字段的全路径数据
        this.$emit('nodeClick', obj)
      }
    },
    // 外部调用触发加载tree（`isTrigger`为`true`时生效）
    triggerLoad(key, params) {
      if (this.isTrigger) {
        this.isLazy = true
        this.keyword = ''
        this.params = params
        this.key = key
        this.isTriggerLoad = false
      }
    },
    // 重置 数据
    resetLoad() {
      this.isLazy = true
      this.keyword = ''
      this.params = {}
      this.key = 'a'
      this.isTriggerLoad = this.isTrigger
    },
    search() {
      const keyword = this.keyword.trim()
      this.checkedId = ''
      if (keyword === '') {
        this.isLazy = true
      } else {
        if (keyword.length < 2) return this.$message.error('至少需要输入2个字')
        this.isLazy = false
        this.fetching = true
        this.searchRequest(keyword, this.params).then(res => {
          this.mx_recursionResDataAddLabel(res.data)
          this.searchList = res.data
        }).finally(() => {
          this.fetching = false
        })
      }
    },
    // 清空选中的节点
    _resetChecked() {
      this.checkedId = null
      this.checkedIds = []
      this.treeRef.setCurrentKey(null)
    }
  }
}
</script>
