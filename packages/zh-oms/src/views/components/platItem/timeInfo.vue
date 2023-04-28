<template>
  <el-table-column slot="timeInfo" label="时间信息" width="200">
    <template slot-scope="scope">
      <g-list-group label-width="50px" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label">
          <g-text-ellipsis>
            {{ scope.row[item.key] }}
          </g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'TimeInfo',
  props: {
    itemData: Array
  }
}
</script>
