<template>
  <el-card v-loading="fetching" class="h-100" :class="{'is-header':!!title}">
    <div v-if="title" slot="header">
      <b>{{ title }}</b>
    </div>
    <el-form inline size="mini" class="no-message" @submit.native.prevent="search">
      <slot name="title" />
      <el-form-item v-if="showFormStatus" label="状态">
        <el-select v-model="status" style="width:100px">
          <el-option v-for="el in options" :key="el.value" :label="el.label" :value="el.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类目名称">
        <el-input v-model="keyword" placeholder="输入关键词模糊搜索" clearable />
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <div ref="container" class="overflow-auto" style="height:calc(100% - 46px)">
      <template v-if="lazy">
        <el-tree v-if="!isSearchMode"
                 key="async"
                 ref="asyncTree"
                 lazy
                 :load="loadData"
                 :props="props"
                 :render-content="mx_renderContent(1,checkedId)"
                 :highlight-current="false"
                 :filter-node-method="filterNode"
                 :node-key="rowKey"
                 :default-expanded-keys="expandedIds"
                 @node-click="nodeClick"
        />
        <el-tree v-else
                 key="search"
                 ref="searchTree"
                 :data="list"
                 :props="props"
                 :render-content="mx_renderContent(1,checkedId)"
                 :highlight-current="false"
                 :node-key="rowKey"
                 default-expand-all
                 :default-expanded-keys="expandedIds"
                 @node-click="nodeClick"
        />
      </template>
      <el-tree v-else
               key="sync"
               ref="syncTree"
               :data="list"
               :props="props"
               :render-content="mx_renderContent(1,checkedId)"
               :highlight-current="false"
               :filter-node-method="filterNode"
               :node-key="rowKey"
               :default-expanded-keys="expandedIds"
               @node-click="nodeClick"
      />
    </div>
  </el-card>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    props: {
      type: Object,
      default: () => ({
        label: 'name',
        children: 'childrenList',
        isLeaf: 'isLeaf'
      })
    },
    title: String,
    lazy: {
      type: Boolean,
      default: false
    },
    // 传入load方法则会启用懒加载模式
    treeRequest: Function,
    searchRequest: Function,
    // 是否允许选中节点。默认只允许选中叶子结点
    nodeChecked: {
      type: Boolean,
      default: false
    },
    // 是否显示搜索表单中的 状态 字段
    showFormStatus: {
      type: Boolean,
      default: true
    },
    // 外部附加给 treeRequest 和 searchRequest 的参数
    params: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 是否使用映射功能
    useMapping: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fetching: this.loading,
      keyword: '',
      isSearchMode: false,
      list: [],
      checkedId: this.value,
      expandedIds: [],
      status: 0,
      options: [
        { label: '全部', value: 0 },
        { label: '未映射', value: 1 },
        { label: '已映射', value: 2 }
      ]
    }
  },
  computed: {
    treeRef() {
      return this.lazy
        ? this.isSearchMode
          ? this.$refs.searchTree
          : this.$refs.asyncTree
        : this.$refs.syncTree
    }
  },
  watch: {
    checkedId(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.checkedId = val
    },
    fetching(val) {
      this.$emit('update:loading', val)
    }
  },
  created() {
    if (!this.lazy) this.getData()
  },
  methods: {
    getData() {
      this.fetching = true
      this.treeRequest().then(res => {
        this.mx_recursionResDataAddLabel(res.data)
        this.list = res.data
      }).finally(() => {
        this.fetching = false
      })
    },
    loadData(node, resolve) {
      // 如果是叶子节点则不需要请求下级
      if (node.isLeaf) return resolve([])

      const id = node.level === 0 ? '' : node.data.id
      this.fetching = true
      this.treeRequest(id, this.params).then(res => {
        if (res.data.length === 0) {
          this.checkedId = id
        } else {
          this.mx_recursionResDataAddLabel(res.data)
        }
        resolve(res.data)
      }).finally(() => {
        this.fetching = false
      })
    },
    search() {
      const keyword = this.keyword.trim()
      const status = this.status
      this.checkedId = ''
      if (keyword === '' && status !== 1 && status !== 2) {
        this.isSearchMode = false
        this.reset().then()
      } else {
        if (this.lazy) {
          if (keyword.length < 2) return this.$message.error('至少需要输入2个字')
          this.fetching = true
          this.searchRequest(keyword, this.params).then(res => {
            this.mx_recursionResDataAddLabel(res.data)
            this.list = res.data
          }).finally(() => {
            this.fetching = false
          })
        } else {
          this.treeRef.filter({ keyword, status })
        }
        this.isSearchMode = true
      }
    },
    filterNode({ keyword, status }, data) {
      if (keyword === '' && status === 0) return true
      const includeName = data.name.indexOf(keyword) !== -1
      switch (status) {
        case 1:
          return includeName && data.isMapped === false
        case 2:
          return includeName && data.isMapped === true
        default:
          return includeName
      }
    },
    nodeClick(data, node) {
      if (this.nodeChecked || node.isLeaf) {
        this.checkedId = data.id
        this.$emit('nodeClick', data, node)
      }
    },
    reset() {
      return new Promise(resolve => {
        const cache = this.list
        this.list = []
        this.$nextTick(() => {
          this.list = cache
          resolve()
        })
      })
    },
    async next(cb) {
      const nextNode = this.mx_getNextNodeDataFromRef(this.treeRef, this.checkedId, this.nodeChecked)
      if (nextNode) {
        const nextId = nextNode.data[this.rowKey]
        this.checkedId = nextId
        this.expandedIds = [nextId]
        this.treeRef.setCheckedKeys([nextId])

        if (nextNode.isLeaf) {
          cb(nextNode.data) // 将节点数据传递给cb，用于自动定位右侧tree关联的节点
          this.$nextTick(() => {
          // 需要使用setTimeout，避免跨级切换时dom元素找不到
            setTimeout(() => {
              const comp = this.mx_getCheckedNodeComponent(this.treeRef, nextId, this.rowKey)
              this.mx_scrollTop(this.treeRef, comp.$el)
            }, 100)
          })
        } else {
          // 如果找到的下一个是节点，则先加载子节点，再重新找下一个
          const unwatch = this.$watch('fetching', (val) => {
            if (!val) {
              unwatch()
              this.$nextTick(() => {
                this.next(cb)
              })
            }
          })
        }
      } else {
        this.$message.info('未找到下一个')
      }
    }
  }
}
</script>
