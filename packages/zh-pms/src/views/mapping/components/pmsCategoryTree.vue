<template>
  <el-popover ref="popover"
              placement="right"
              trigger="click"
              popper-class="p-0"
              class="ms-2"
              @show="onShow"
  >
    <div style="height:60vh;min-height:300px;max-width:500px;" class="category-mapping">
      <PmsTree ref="pmsTree"
               v-model="pmsCategoryId"
               :tree-request="request.getChildren"
               :search-request="request.queryCategory"
               :show-form-status="false"
               lazy
               :props="{label:'name',labelEn:'nameEn',isLeaf:data=>!!data.isLeaf}"
               :use-mapping="false"
               @nodeClick="onSelectPmsCategory"
      />
    </div>
    <el-button slot="reference" size="mini">{{ pmsCategoryLabel || '请选择' }} <i class="el-icon-arrow-right el-icon--right" /></el-button>
  </el-popover>
</template>

<script>
import { getChildren, queryCategory } from '@/api/categoryManagement'

export default {
  name: 'PmsCategoryTree',
  components: {
    PmsTree: () => import('./left.vue')
  },
  props: {
    value: [String, Number]
  },
  data() {
    return {
      pmsCategoryId: this.value,
      pmsCategoryLabel: ''
    }
  },
  computed: {
    request() {
      return { getChildren, queryCategory }
    }
  },
  watch: {
    pmsCategoryId(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onSelectPmsCategory(data, node) {
      const result = this.$refs.pmsTree.mx_getFullpath(node, ['name', 'id'])
      this.pmsCategoryLabel = result.name.join(' / ')
      this.$refs.popover.showPopper = false
    },
    onShow() {
      this.$refs.pmsTree.mx_restoreScrollPosition()
    }
  }
}
</script>
