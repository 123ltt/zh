<template>
  <div class="d-flex flex-column filter-wrap">
    <div class="m-1">
      <el-input v-model.trim="keyword" placeholder="输入关键词过滤" size="mini" clearable />
    </div>
    <div class="overflow-auto filter-body py-1 px-2 border-top">
      <div v-if="list.length===0" class="text-center text-muted py-3">暂无数据</div>
      <template v-else>
        <div class="my-1">
          <el-checkbox v-model="checkedAll"
                       :indeterminate="indeterminate"
                       @change="onAllChecked"
          >（全选）</el-checkbox>
        </div>
        <template v-for="item in list">
          <div v-if="filter(item.label)" :key="item.label" class="my-1 position-relative filter-item">
            <el-checkbox v-model="item.checked" @change="onChecked">{{ item.label }}</el-checkbox>
            <div class="position-absolute end-0 top-0 px-1 only-item-btn h-100 aligin-items-center" @click.stop="onCheckedSelf(item)">仅筛选此项</div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['gTable'],
  props: {
    prop: String
  },
  data() {
    return {
      keyword: '',
      list: this.getList(),
      checkedAll: true,
      indeterminate: false
    }
  },
  watch: {
    'gTable.cacheList'() {
      if (this.gTable.excludeRowKeys.length > 0) {
        this.gTable.excludeRowKeys = [] // 设为空数组后 会触发 gTable.excludeRowKeys 的监听调用 this.reset()
      } else {
        this.reset()
      }
    },
    'gTable.excludeRowKeys'() {
      this.reset()
    }
  },
  methods: {
    reset() {
      this.list = this.getList()
      this.setCheckboxStatus()
      this.keyword = ''
    },
    getList() {
      const list = []
      if (!this.prop) return list

      const rowKey = this.gTable.rowKey
      const excludeRowKeys = this.gTable.excludeRowKeys

      const mapping = {}
      this.gTable.cacheList.forEach(item => {
        if (mapping[item[this.prop]]) return
        mapping[item[this.prop]] = true
        list.push({
          label: item[this.prop],
          checked: !excludeRowKeys.includes(item[rowKey])
        })
      })

      return list
    },
    filter(str) {
      if (!this.keyword) return true
      return String(str).toLowerCase().includes(this.keyword.toLowerCase())
    },
    onChecked() {
      this.setCheckboxStatus()
      this.updateExcludeRowKeys()
    },
    setCheckboxStatus() {
      const countChecked = this.list.filter(item => item.checked).length
      if (countChecked === this.list.length) {
        this.checkedAll = true
        this.indeterminate = false
      } else {
        this.indeterminate = countChecked > 0
        this.checkedAll = false
      }
    },
    onAllChecked(val) {
      this.list.forEach(item => {
        item.checked = val
      })
      this.indeterminate = false

      this.$nextTick(() => {
        this.updateExcludeRowKeys()
      })
    },
    updateExcludeRowKeys() {
      let excludeRowKeys = []
      const currentExlucdes = this.gTable.excludeRowKeys.concat()
      const rowKey = this.gTable.rowKey
      this.list.forEach(item => {
        this.gTable.cacheList.forEach(el => {
          if (el[this.prop] === item.label) {
            if (item.checked) {
              const index = currentExlucdes.findIndex(a => a === el[rowKey])
              if (index > -1) currentExlucdes.splice(index, 1)
            } else {
              excludeRowKeys.push(el[rowKey])
            }
          }
        })
      })

      // 去掉重复的 rowKey
      excludeRowKeys = Array.from(new Set(excludeRowKeys.concat(currentExlucdes)))

      this.gTable.excludeRowKeys = excludeRowKeys

      this.$emit('change', excludeRowKeys)
    },
    // 仅筛选此项
    onCheckedSelf(data) {
      this.list.forEach(item => {
        if (data !== item) {
          item.checked = false
        }
      })
      data.checked = true

      this.setCheckboxStatus()
      this.updateExcludeRowKeys()
    }
  }
}
</script>
