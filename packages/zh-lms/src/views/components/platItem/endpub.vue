<template>
  <el-table-column label="后端刊登" width="80">
    <template slot-scope="scope">
      <g-list-group :label-width="labelWidth+'px'" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label" :sep="' '">
          <span v-if="item.type==='select'">{{ item.selectList[scope.row[item.key]?1:0] }}</span>
        </g-list-group-item>
      </g-list-group>
    </template>
  </el-table-column>

</template>

<script>
export default {
  name: 'Endpub',
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
