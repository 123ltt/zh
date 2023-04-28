<template>
  <g-table ref="tableRef" :headers="headers" />
</template>

<script>
export default {
  name: 'OperationRecords',
  prop: {
    fn: {
      type: Function,
      default: null
    }
  },
  fetch({ current, size }, params) {

    // return fn(current, size, params).then(res => {
    //     return {
    //       records: res.data.records,
    //       total: res.data.total,
    //       size: res.data.pageSize
    //     }
    //   })
  },
  data() {
    return {
      headers: [
        { label: '操作人', prop: 'createUser' },
        { label: '操作时间', prop: 'createTime' },
        { label: '操作记录', prop: 'content' }
      ]
    }
  },
  mounted() {
    this.$refs.tableRef.tableList = [
      { createUser: '张三', createTime: '2020-10-20', content: '我是操作记录' },
      { createUser: '张三', createTime: '2020-10-20', content: '我是操作记录' },
      { createUser: '张三', createTime: '2020-10-20', content: '我是操作记录' },
      { createUser: '张三', createTime: '2020-10-20', content: '我是操作记录' },
      { createUser: '张三', createTime: '2020-10-20', content: '我是操作记录' },
      { createUser: '张三', createTime: '2020-10-20', content: '我是操作记录' }
    ]
    // this.init()
  },
  init() {
    // this.$refs.tableRef.load(1)

  }

}
</script>

<style>

</style>
