<template>
  <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch" :page-show="false">
    <el-table-column slot="superiorInfo" label="上级人员" prop="superiorInfo">
      <template slot-scope="{row}">
        <p v-for="(item,index) in row.superiorInfo" :key="index" class="desc">{{ item }}</p>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { listSellerList } from '@/api/storeList'
export default {
  name: 'SellerTable',
  props: {
    compId: {
      type: String
    }
  },
  data() {
    return {
      columns: [{
        label: '序号',
        type: 'index',
        width: '60px'
      }, {
        label: '销售员',
        prop: 'sellerInfo'
      }, {
        slot: true,
        slotName: 'superiorInfo'
      }
      ]
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    fetch() {
      return listSellerList({ id: this.compId }).then(res => {
        return {
          records: res.data
        }
      })
    }
  }

}
</script>

<style scoped>
.desc{
  padding:0;
  margin:0;
}
</style>
