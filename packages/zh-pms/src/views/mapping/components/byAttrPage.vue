<template>
  <div>
    <div v-if="data.length===0" class="text-center text-muted my-3">🙂提示：请选择 <b class="text-warning">平台/站点</b></div>
    <div v-for="item in data" :key="item.id" class="pb-3">
      <AttrToAttr :title="item.title"
                  :params="{platformCode:item.platformCode,siteCode:item.siteCode,categoryId}"
                  :value-attrs="valueAttrs"
                  :use-remove="useRemove"
                  :show-category-name="showCategoryName"
                  @remove="onRemove"
      />
    </div>
  </div>
</template>

<script>
import { queryAttr } from '@/api/propertyManagement'
import AttrToAttr from './attrToAttr.vue'

export default {
  name: 'ByAttrPage',
  components: { AttrToAttr },
  props: {
    data: Array,
    categoryId: {
      type: String,
      default: ''
    },
    useRemove: {
      type: Boolean,
      default: false
    },
    showCategoryName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valueAttrs: []
    }
  },
  created() {
    this.getPmsAttrs()
  },
  methods: {
    getScrollTop(index) {
      const el = this.$el.children[index]
      return el ? el.offsetTop : -1
    },
    // 获取pms的规格属性
    getPmsAttrs() {
      // 目前后端size最大只支持500（如果数据总数超过500可能会存在问题）
      queryAttr({ attrType: 6, current: 1, size: 1000 }).then(res => {
        this.valueAttrs = res.data.records.map(item => {
          return {
            id: item.id, // 属性id
            label: item.attrName,
            labelEn: item.attrNameEn
          }
        })
      })
    },
    // 移除一项
    onRemove(...agrs) {
      this.$emit('remove', ...agrs)
    }
  }
}
</script>
