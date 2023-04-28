<template>
  <div class="h-100 d-flex flex-column">
    <div class="d-flex align-items-center fw-bold border-bottom py-1 mb-1">
      <span class="flex-shrink-0 me-2">待选平台</span>
      <el-input v-model="keyword" size="mini" placeholder="搜索平台" />
    </div>
    <div class="flex-grow-1 overflow-auto">
      <el-tree v-if="list.length>0"
               ref="tree"
               :data="list"
               node-key="id"
               :show-checkbox="multiple"
               :filter-node-method="filterNode"
               @check="onCheck"
               @node-click="onNodeClick"
      />
    </div>
  </div>
</template>

<script>
import { getPlatformTree } from '@/api/info'

export default {
  props: {
    // 是否多选（即是否使用CheckBox）
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      keyword: ''
    }
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getPlatformTree().then(res => {
        this.list = res.data.map(item => {
          const data = {
            id: item.platCode,
            label: item.platName,
            code: item.platCode,
            level: 0
          }
          data.children = item.lstSite.map(el => {
            return {
              id: item.platCode + '-' + el.siteCode,
              parent: data,
              code: el.siteCode,
              label: el.siteName,
              level: 1
            }
          })
          return data
        })
      })
    },
    onCheck(keys, node) {
      const codePath = []
      node.checkedNodes.forEach(item => {
        let data

        if (Array.isArray(item.children)) {
          // 平台且没有站点
          if (item.children.length === 0) {
            data = { platformCode: item.code, platformName: item.label, siteCode: null, siteName: null }
          }
        } else {
          data = { platformCode: item.parent.code, platformName: item.parent.label, siteCode: item.code, siteName: item.label }
        }
        data && codePath.push(data)
      })
      this.$emit('check', codePath)
    },
    onNodeClick(data, node) {
      if (node.isLeaf) {
        let d
        if (data.parent) {
          d = { platformCode: data.parent.code, platformName: data.parent.label, siteCode: data.code, siteName: data.label }
        } else {
          d = { platformCode: data.code, platformName: data.label, siteCode: null, siteName: null }
        }
        if (this.multiple) {
          this.$emit('nodeClick', d) // 只有多选才触发 nodeClick
        } else {
          this.$emit('check', [d])
        }
      }
    },
    filterNode(keyword, data, node) {
      // 可根据平台的 label 和 code 进行搜索
      const d = data.level === 1 ? node.parent.data : data
      return [d.label, d.code].some(item => item.toLowerCase().indexOf(keyword.toLowerCase()) > -1)
    },
    removeChecked(willRemoveKeys = []) {
      const all = this.$refs.tree.getCheckedKeys()
      const keys = all.filter(item => !willRemoveKeys.includes(item))

      this.$refs.tree.setCheckedKeys(keys)
    },
    // 重置树（目前只是简单清空单选选中状态）
    reset() {
      this.$refs.tree.setCurrentKey(null)
    }
  }
}
</script>
