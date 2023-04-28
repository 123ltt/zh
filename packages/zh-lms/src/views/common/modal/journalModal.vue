<template>
  <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" style="min-height:300px" />
</template>

<script>
import { logList } from '@/api/common.js'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: [
        { label: '修改内容', prop: 'content' },
        { label: '修改人', prop: 'updateUserName' },
        { label: '修改时间', prop: 'updateTime' }
      ]
    }
  },
  mounted() {
    const params = {
      relationId: this.id
    }
    this.$refs.table.load(1, params)
  },
  methods: {
    fetch({ current, size }, params) {
      return logList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    }
  }
}
</script>

<style>

</style>
