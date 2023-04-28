// 自定义列头，对应 el-table-column 的 header 插槽
<template>
  <div>{{ label }}
    <el-popover v-model="show" popper-class="p-0 custom-filter-popover">
      <VFilter v-if="show||inited" :prop="prop" @change="onChange" />
      <i slot="reference"
         class="position-absolute bottom-0 end-0 filter-btn"
         :class="isTipFiltering?'el-icon-filter-fill':'el-icon-filter'"
         @click="inited=true"
      />
    </el-popover>
  </div>
</template>

<script>
import VFilter from './filter.vue'

export default {
  name: 'GTableColumnHeader',
  inject: ['gTable'],
  components: { VFilter },
  props: {
    // 表头标题
    label: String,
    // 对应数据的字段名
    prop: String
  },
  data() {
    return {
      show: false,
      inited: false,
      isTipFiltering: false
    }
  },
  watch: {
    'gTable.excludeRowKeys'(arr) {
      if (arr.length === 0) {
        this.isTipFiltering = false
      }
    }
  },
  created() {
    if (!this.gTable) throw new Error('GTableColumnHeader组件必须在GTable中使用')
  },
  methods: {
    onChange(excludeRowKeys) {
      this.isTipFiltering = excludeRowKeys.length > 0
    }
  }
}
</script>
