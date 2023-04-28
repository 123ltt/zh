<template>
  <el-table-column label="时间" width="160">
    <template slot-scope="scope">
      <g-list-group :label-width="labelWidth+'px'" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label">
          <g-text-ellipsis>{{ scope.row[item.key] }}</g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
    </template>
  </el-table-column>

</template>

<script>
export default {
  name: 'Time',
  props: {
    itemData: Array,
    labelWidth: {
      type: String,
      default: '60'
    }
  }
}
</script>

<style>

</style>
