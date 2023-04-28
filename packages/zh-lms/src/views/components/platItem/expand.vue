<template>
  <el-table-column label="" type="expand">
    <template slot-scope="scope">
      <div v-for="(item,index) in itemData" :key="index" :label="item.label">
        {{ item.tableData }}
        <el-table :data="scope.row.childrens">
          <template v-for="(list) in item.table">
            <el-table-column :key="list" :label="list.label">
              <template slot-scope="tscope">
                <g-list-group v-if="list.type==='label-text'" :label-width="labelWidth+'px'" label-align="center">
                  <g-list-group-item v-for="(tItem,index) in list.item" :key="index" :label="tItem.label">
                    <g-text-ellipsis>{{ tscope.row[tItem.key] }}</g-text-ellipsis>
                  </g-list-group-item>
                </g-list-group>
                <g-thumb v-if="list.type==='image'" :url="tscope.row[list.key]" />
                <g-text-ellipsis v-if="list.type==='text'">{{ tscope.row[list.key] }}</g-text-ellipsis>
              </template>
            </el-table-column>
            <!-- <template v-for="(tItem) in list">
              <el-table-column v-if="tItem.type==='text'" :key="tItem.id" :label="tItem.label">
                <template slot-scope="tscope">
                  <g-list-group :label-width="labelWidth+'px'" label-align="center">
                    <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label" :sep="' '">
                      <g-text-ellipsis>{{ scope.row[item.key] }}</g-text-ellipsis>
                    </g-list-group-item>
                  </g-list-group>
                </template>
              </el-table-column>
            </template> -->

          </template>
        </el-table>
      </div>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: 'Expand',
  props: {
    itemData: Array,
    labelWidth: {
      type: String,
      default: '60'
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style>

</style>
