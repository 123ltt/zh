<template>
  <el-table-column label="金额" width="160">
    <template slot-scope="scope">
      <g-list-group :label-width="labelWidth+'px'" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label">
          <g-text-ellipsis>{{ scope.row[item.currency]||scope.row.currencyCode }} {{ Number(scope.row[item.key]).toFixed(2) }}</g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'MoneyInfo',
  props: {
    itemData: Array,
    labelWidth: {
      type: String,
      default: '60'
    }
  }
}
</script>
