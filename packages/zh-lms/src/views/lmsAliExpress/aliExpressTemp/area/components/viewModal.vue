<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" />
</template>

<script>
import { aliexpressopslogList } from '@/api/aliExpress/log.js'
export default {
  name: 'ViewModal',
  data() {
    return {
      headers: [{
        label: '修改内容',
        prop: 'content'
      },
      {
        label: '修改人',
        prop: 'createUserName'
      }, {
        label: '修改时间',
        prop: 'createTime'
      }]
    }
  },
  prop: {
    id: {
      type: String
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    fetch({ current, size }) {
      return aliexpressopslogList({ current, size, relationId: this.id, module: 'PRICE_ADJUST' }).then(res => {
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

<style>

</style>
