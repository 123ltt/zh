<template>
  <el-table-column label="SKU" width="160">
    <template slot-scope="scope">
      <g-list-group :label-width="labelWidth+'px'" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label">
          <g-text-ellipsis>
            <span class="d-block"> {{ scope.row[item.key] }}
              <template v-if="scope.row.listingType === item.inlineType">(子 {{ scope.row[item.inlineText] }}）</template>
            </span>
          </g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
    </template>
  </el-table-column>

</template>

<script>
export default {
  name: 'SKU',
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
