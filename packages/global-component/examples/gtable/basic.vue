<template>
  <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" immediate />
</template>

<script>
import { getList } from '@/api/user'
export default {
  data() {
    return {
      headers: [
        { label: '姓名', prop: 'name' },
        { label: '年龄', prop: 'age' }
      ]
    }
  },
  methods: {
    fetch({ current, size }) {
      return getList(current, size).then(res => {
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
