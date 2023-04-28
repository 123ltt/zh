<template>
  <div class="basic-container-box">
    <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch" :fixed-height="false" />
  </div>
</template>

<script>
import { listByStoreId } from '@/api/storeList'
export default {
  name: 'RecordInfo',
  props: {
    // eslint-disable-next-line vue/require-default-prop
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
        label: '操作人',
        prop: 'operator'
      }, {
        label: '内容',
        prop: 'content'
      }, {
        label: '操作时间',
        prop: 'createTime'
      }]
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    fetch({ current, size }) {
      return listByStoreId({ id: this.compId, current, size }).then(res => {
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
