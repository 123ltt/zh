<template>
  <el-btp
    v-loading="loading"
    :data="tableData"
    :columns="columns"
    :defaultcolumnconfig="defaultColumnConfig"
    :haspage="true"
    :page="page"
    border
    stripe
  />
</template>

<script>
import { recordList } from '@/api/storeList'
export default {
  name: 'RecordTemp',
  data() {
    return {
      defaultColumnConfig: {
        align: 'center'
      },
      tableData: [],
      loading: false,
      columns: [{
        label: '序号',
        type: 'index',
        width: '60px'
      }, {
        label: '操作人',
        prop: 'operator'
      }, {
        label: '文件名',
        prop: 'content'
      }, {
        label: '操作时间',
        prop: 'createTime'
      }
      ],
      page: { // 分页
        'page-sizes': [10, 40, 50, 80],
        'page-size': 10,
        'current-page': 1,
        total: 0,
        'size-change': this.getRecordList,
        'current-change': this.getRecordList
      }
    }
  },
  mounted() {
    this.getRecordList()
  },
  methods: {
    getRecordList({ current, size } = {}) {
      this.loading = true
      current = current || this.page['current-page']
      size = size || this.page['page-size']
      recordList({ current, size }).then(res => {
        this.loading = false
        const data = res.data
        this.tableData = data.records
        this.page.total = data.total
      })
    }
  }

}
</script>

<style>

</style>
