<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" />
</template>

<script>
import { getLogList } from '@/api/ebay/log.js'
export default {
  name: 'ViewModal',
  props: {
    id: String
  },
  data() {
    return {
      headers: [{
        label: '修改内容',
        prop: 'optContent'
      }, {
        label: '修改人',
        prop: 'createUser'
      }, {
        label: '修改时间',
        prop: 'createTime'
      }]
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    fetch({ current, size }) {
      return getLogList({ current, size, optBusId: this.id }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    }
  }

}
</script>

<style scoped>
.moduleContent{
  list-style:none;
  display: flex;
  flex-wrap:wrap;
  flex-direction:row;

}
.moduleContent li{
  width: 80px;
  height: 80px;
}
</style>
