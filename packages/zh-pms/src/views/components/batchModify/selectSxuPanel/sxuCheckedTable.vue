<template>
  <el-table :data="items" border stripe class="g-table g-table-dense" :height="height">
    <el-table-column label="SPU/SKU" width="100">
      <template slot-scope="{row}">
        {{ row.productCode }}
      </template>
    </el-table-column>
    <el-table-column label="名称">
      <template slot-scope="{row}">
        <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="55">
      <template slot-scope="{row}">
        <el-button type="text" @click="onRemove(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'SxuCheckedTable',
  props: {
    items: {
      type: Array,
      default: () => [{}]
    },
    height: {
      type: Number,
      default: 360
    }
  },
  data() {
    return {

    }
  },
  methods: {
    onRemove(data) {
      this.$emit('remove', data)
    }
  }
}
</script>
