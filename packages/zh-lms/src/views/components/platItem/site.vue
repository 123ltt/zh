<template>
  <el-table-column label="已选站点" width="80">
    <template slot-scope="scope">
      <g-list-group :label-width="labelWidth+'px'" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label" :sep="' '">
          <g-text-ellipsis>{{ scope.row[item.key] }}</g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
    </template>
  </el-table-column>

</template>

<script>
export default {
  name: 'Site',
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
