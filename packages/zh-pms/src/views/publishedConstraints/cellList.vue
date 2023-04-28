<template>
  <el-table-column :label="label">
    <template slot-scope="{row}">
      <span>{{ text(row) + ellipsis }}</span>
      <span class="ms-1 cl-count">({{ count(row) }})</span>
    </template>
  </el-table-column>

</template>

<script>
export default {
  props: {
    field: String,
    label: String
  },
  data() {
    return {
      ellipsis: ''
    }
  },
  methods: {
    count(row) {
      const list = row[this.field]
      const count = Array.isArray(list) ? list.length : 0
      if (count > 1) this.ellipsis = '...'
      return count
    },
    text(row) {
      const list = row[this.field]
      return Array.isArray(list) ? list[0] : list
    }
  }
}
</script>

<style lang="scss" scoped>
.cl-count {
  color: #999;
}
</style>
