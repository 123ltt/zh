<template>
  <div v-loading="loading">
    <div v-if="list.length===0" class="text-center my-4 text-muted">🙂提示：请 <b class="text-warning">添加SKU</b> 和 <b class="text-warning">选择平台/站点</b></div>
    <el-table v-else class="g-table w-100" border stripe size="small" :data="list">
      <el-table-column label="SKU" width="120px" fixed="left">
        <template v-slot="{row}">
          <el-tooltip :content="row.title" placement="top">
            <span>{{ row.skuCode }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-for="item in headers" :key="item.prop" width="120px">
        <template #header>
          {{ item.label }}
          <!-- <el-button icon="el-icon-close" type="text" @click="onRemove(item)" /> -->
        </template>
        <template v-slot="{row}">
          <span>{{ setText(row[item.prop]) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPmsAttrsBySku } from '@/api/attrMapping'

export default {
  props: {
    /** @type {ZHKJ.VueProps<{id:string; code:string; title:string}[]>} */
    skuList: Array
  },
  data() {
    return {
      loading: false,
      list: [],
      attrMapping: {},
      /** @type {{attrId:string; attrName:string; relationId:string}[]} */
      headers: [] // 所有sku属性集合
    }
  },
  watch: {
    skuList() {
      this.getData()
    }
  },
  methods: {
    // pms属性取值 与 值（数据格式屎般的存在）
    getDefaultValue(data) {
      try {
        let s
        const val = data.defaultValueItemList
        if (Array.isArray(val)) {
          s = val[0]
        } else if (typeof val === 'string') {
          s = val
        }
        const values = JSON.parse(s)

        if (data.valueItemList.length > 0) {
          const arr = JSON.parse(data.valueItemList[0].cutName)
          if (arr.length === 0) return values // 输入框形式
          return values.map(item => {
            const d = arr.find(el => el.code === item)
            return d ? d.value : ''
          })
        } else {
          return values
        }
      } catch (err) {
        return ['--']
      }
    },
    setText(data) {
      return (Array.isArray(data) ? data.join('、') : '') || '--'
    },
    // 获取单个sku的属性 并组装好单个sku的数据
    fetch(skuId, data) {
      return getPmsAttrsBySku(skuId)
        .then(res => {
          const obj = {}
          res.data.forEach(item => {
            obj[item.attrId] = this.getDefaultValue(item)
            if (!this.attrMapping[item.attrId]) {
              this.attrMapping[item.attrId] = item.attrName
            }
          })
          return Object.assign({ fetchFail: false }, data, obj)
        }) // 过滤出类目属性
        .catch(() => {
          this.$message.error(`sku: ${data.skuCode} 获取属性失败`)
          return Object.assign({ fetchFail: true }, data)
        })
    },
    getData() {
      this.attrMapping = {}
      this.loading = true
      const p = this.skuList.map(item => this.fetch(item.id, item))
      Promise.all(p).then(result => {
        this.headers = Object.entries(this.attrMapping).map(([attrId, name]) => {
          return { prop: attrId, label: name }
        })
        this.list = result
        this.emitChange()
      }).finally(() => {
        this.loading = false
      })
    },
    // 删除列
    onRemove(item) {
      this.headers = this.headers.filter(el => el !== item)
      this.$emit('removeCol', this.headers)
    },
    emitChange() {
      this.$emit('loaded', this.list, this.headers)
    }
  }
}
</script>
