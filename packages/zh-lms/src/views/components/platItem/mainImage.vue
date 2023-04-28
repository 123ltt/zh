<template>
  <el-table-column label="主图" width="80px">
    <template slot-scope="scope">
      <g-list-group :label-width="labelWidth+'px'" label-align="center">
        <div v-for="(item,index) in itemData" :key="index">
          <g-thumb :url="scope.row[item.key]" />
        </div>
      </g-list-group>
    </template>
  </el-table-column>

</template>
<script>

export default {
  name: 'MainImage',
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
