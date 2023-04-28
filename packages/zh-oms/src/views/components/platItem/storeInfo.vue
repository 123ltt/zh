<template>
  <el-table-column label="店铺信息" width="155">
    <template slot-scope="scope">
      <g-list-group label-width="50px" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label" :label-width="item.labelWidth">
          <g-text-ellipsis v-if="item.type==='text'"> {{ scope.row[item.key] }}</g-text-ellipsis>
          <g-text-ellipsis v-if="item.type==='judeg'"> {{ scope.row[item.key]?'手工订单':'线上订单' }}</g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'StoreInfo',
  props: {
    itemData: Array
  }
}
</script>
