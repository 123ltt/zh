<template>
  <basic-container class="category">
    <el-form :model="form" label-width="80px" size="mini" @submit.native.prevent>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="类目名称" prop="filterText">
            <el-input v-model="form.filterText" size="mini" placeholder="请输入类目名称进行模糊查询" @keyup.13.native="onSubmit" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button ref="search" type="primary" size="mini" @click="onSubmit">搜 索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="!isLazy" class="empty-tree">暂无数据</div>
    <el-tree
      v-if="isLazy"
      ref="tree"
      key="lazyTree"
      v-loading="treeLoading"
      :data="treeData"
      :load="loadNode"
      lazy
      :props="defaultProps"
      :render-content="renderContent"
      :expand-on-click-node="false"
      :default-expanded-keys="defaultExpandedKeys"
      node-key="id"
      accordion
      class="filter-tree"
      @node-click="nodeClick"
    />
    <!-- <el-tree
      v-else
      ref="notLazyTree"
      key="notLazyTree"
      v-loading="treeLoading"
      :data="treeData"

      :props="defaultProps"
      :render-content="renderContent"
      :expand-on-click-node="false"
      default-expand-all
      node-key="id"
      accordion
      class="filter-tree"
      @node-click="nodeClick"
      @node-expand="nodeExpand"
    /> -->
  </basic-container>
</template>

<script>
import { delCategory, getChildren, queryCategory } from '@/api/categoryManagement'
import ConfigureProps from '@/views/configureProps.vue'
import CategoryModal from './modal/categoryModal.vue'

export default {
  name: 'PmsCategoryManagement',
  components: {},
  props: {},
  data() {
    return {
      level: 1,
      isSearch: false,
      defaultExpandedKeys: ['STATICID'],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'fullName',
        isLeaf: 'isLeaf'
      },
      form: { filterText: '' },
      filterText: '',
      treeLoading: false,
      isLazy: true
    }
  },
  watch: {
    // 'form.filterText'(val) {
    //   if (val === '') {
    //     this.isLazy = true
    //   }
    // },
    level(val) {
      this.$refs.search.click()
    }
  },
  methods: {
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ id: 'STATICID', fullName: '类目 (Category)', isLeaf: false }])
      } else {
        const res = await getChildren(node.level === 1 ? null : node.key)
        const data = this.mapTree(res.data)
        return resolve(data)
      }
    },
    async onSubmit() {
      this.isLazy = true
      await this.$nextTick()
      const { filterText } = this.form
      // this.isLazy = filterText === ''
      if (!filterText) {
        this.treeData = []
        const { data } = await getChildren()
        const children = this.mapTree(data)
        this.updateKey(children)
        return
      }
      queryCategory(filterText).then(async res => {
        if (res.data === null) {
          // this.treeData = []
          this.isLazy = false
          return
        }
        const children = this.mapTree(res.data)
        const data = [{ id: 'STATICID', fullName: '类目 (Category)', isLeaf: false, children }]
        // this.treeData = data
        this.updateKey(data)

        const lastIds = this.findLastkey(data)
        this.defaultExpandedKeys = ['STATICID', ...lastIds]
      })
    },
    mapTree(arr) {
      return arr.map(item => {
        item.isLeaf = item.isLeaf === 1
        item.fullName = `${item.name} (${item.nameEn})`
        if (item.children && item.children.length) {
          item.children = this.mapTree(item.children)
        }
        return item
      })
    },
    updateKey(arr) {
      if (!this.treeData.length) {
        this.treeData = [{ id: 'STATICID', fullName: '类目 (Category)', isLeaf: 0 }]
        this.$refs.tree.updateKeyChildren('STATICID', arr)
      }
      arr.forEach(item => {
        if (item.children) {
          item.fullName = `${item.name} (${item.nameEn})`
          this.$refs.tree.updateKeyChildren(item.id, item.children)
          item.children.length && this.updateKey(item.children)
        }
      })
    },
    findLastkey(arr) {
      const keys = []
      arr.forEach(item => {
        if (item.children) {
          if (item.children.length) {
            keys.push(...this.findLastkey(item.children))
          } else item.parentId !== '0' && keys.push(item.id)
        }
      })
      return keys
    },
    async nodeExpand(data, node, self) {
      const res = await getChildren(node.key)
      this.$refs.notLazyTree.updateKeyChildren(node.key, this.mapTree(res.data))
      const nodeList = this.$refs.notLazyTree.store._getAllNodes()
      setTimeout(() => {
        nodeList.forEach(node => {
          node.expanded = true
        })
      }, 1000)
    },
    nodeClick(data, node, self) {
      if (data.id === 'STATICID') {
        this.$refs.tree.setCurrentKey(null)
        return
      }

      this.$modal({
        title: '类目关联属性',
        component: ConfigureProps,
        width: '900px',
        data: {
          type: 0,
          myData: data
        }
      })
    },
    appendNode(nodeData, e) {
      e.stopPropagation()
      const parentId = nodeData.id === 'STATICID' ? '' : nodeData.id
      this.$modal({
        title: '新增子类目：',
        width: '400px',
        data: { parentId },
        component: CategoryModal,
        callback: (bool, newChild) => {
          if (bool) {
            this.$set(nodeData, 'children', [])
            nodeData.children.push(newChild)
            this.defaultExpandedKeys.splice(1, 1, parentId)
          }
        }
      })
    },
    modifyNode(nodeData, e) {
      e.stopPropagation()
      const { id, name, nameEn } = nodeData
      this.$modal({
        title: '修改类目名称：',
        width: '400px',
        data: { parentId: id, names: { name, nameEn } },
        component: CategoryModal,
        callback: (bool, names) => {
          if (bool) {
            this.$nextTick(() => {
              nodeData.fullName = `${names.name} (${names.nameEn})`
              nodeData.name = names.name
              nodeData.nameEn = names.nameEn
            })
          }
        }
      })
    },
    removeNode(node, data, e) {
      e.stopPropagation()
      this.$confirm(`确认要删除该类目：${data.name}？`, '删除类目：', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCategory(data.id)
            .then(res => {
              const parent = node.parent
              const children = parent.childNodes
              const index = children.findIndex(d => d.data.id === data.id)
              children.splice(index, 1)
              if (res.code === 200) {
                this.$message.success(`删除${data.name}成功`)
                this.defaultExpandedKeys.splice(1, 1, node.parent.key)
              }
            })
            .catch(() => {
              this.$message.error(`删除${data.name}失败`)
            })
        })
        .catch(() => {})
    },
    renderContent(h, { node, data, store }) {
      const btn = data.level === 1 ? <span class="mx-2">
        <el-button
          size='mini'
          type='text'
          on-click={$event => this.modifyNode(data, $event)}
        >
              修改
        </el-button>
        <el-button
          size='mini'
          type='text'
          on-click={$event => this.removeNode(node, data, $event)}
        >
              删除
        </el-button>
      </span> : ''
      const dom = <span class='custom-tree-node'>
        <g-text-ellipsis>{node.label}</g-text-ellipsis>
        <span>
          <el-button
            size='mini'
            type='text'
            on-click={$event => this.appendNode(data, $event)}
          >
                增加子类目
          </el-button>
          {btn}
        </span>
      </span>
      return (dom)
    }
  }
}
</script>

<style scoped lang="scss">

.category ::v-deep {
  .empty-tree{
    width: 100%;
    margin-top: 20%;
    box-sizing: border-box;
    text-align:center;
    color:#909399;
  }
  .filter-tree {
    height: calc(100vh - 180px);
    overflow: auto;
  }
  .custom-tree-node {
    white-space: normal;
    width: 100%;
    box-sizing: border-box;;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    &>span:nth-child(1){
      max-width: 960px;
    }
    span:nth-child(2){
      width: 140px;
    }
  }
  .appendClass > .el-message-box__content {
    color: red !important;
    display: flex;
    align-items: center;
    .el-message-box__input {
      margin-top: 0;
    }
  }
  .bottom-btn {
    text-align: right;
    margin-top: 10px;
    // margin-bottom: 20px;
  }
  .el-dialog__body {
    padding: 0 20px 10px;
  }
}
</style>
