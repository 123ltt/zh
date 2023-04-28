<template>
  <el-table
    :data="logistics"
    :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
    class="g-table"
    border
    stripe
    size="small"
    style="width: 100%"
  >
    <el-table-column label="物流渠道代码" prop="channelCode" />
    <el-table-column label="物流运费" prop="cost">
      <template slot-scope="{ row }">
        {{ row.cost ? row.cost * 1 : '-' }}
      </template>
    </el-table-column>
    <el-table-column label="时效(天)" prop="timeliness" />
    <el-table-column label="泡比" prop="lightgoods" />
    <el-table-column label="金额区间" prop="priceLow">
      <template slot-scope="{ row }">
        {{ row.priceLow ? row.priceLow * 1 : '' }} - {{ row.priceHigh ? row.priceHigh * 1 : '' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'LogisticsList', // 物流列表展示
  props: {
    logistics: Array
  }
}
</script>
