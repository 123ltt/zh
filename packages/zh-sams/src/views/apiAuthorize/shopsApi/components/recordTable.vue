<template>
  <div>
    <g-table ref="table" :headers="columns" row-key="id" :fixed-height="false" :fetch="fetch" />
  </div>
</template>

<script>
import { recordList } from '@/api/shopsApi'
export default {
  name: 'RecordTable',
  props: {
    authorizeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: [{
        label: '序号',
        type: 'index'
      },
      {
        label: '店铺名称',
        prop: 'storeName'
      },
      {
        label: '操作内容',
        prop: 'content',
        'show-overflow-tooltip': true
      },
      {
        label: '操作人',
        prop: 'createUserName'
      },
      {
        label: '操作时间',
        prop: 'createTime'
      }]
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    // 获取日志列表
    fetch({ current, size }) {
      return recordList({ id: this.authorizeId, current, size }).then(res => {
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size // 每页最大记录数
        }
      })
    }
  }

}
</script>

<style>
</style>
