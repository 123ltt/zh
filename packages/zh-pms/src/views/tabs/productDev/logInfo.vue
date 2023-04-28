<template>
  <el-card :body-style="{padding:'10px 0px'}">
    <h4 slot="header" class="m-1">修改记录</h4>
    <g-table ref="table"
             v-loading="loading"
             :headers="columns"
             :fetch="fetch"
             :fixed-height="false"
    >
      <el-table-column slot="msgBrief" label="结果">
        <template slot-scope="{row}">
          <g-text-ellipsis>{{ row.msgBrief }}</g-text-ellipsis>
        </template>
      </el-table-column>
    </g-table>
  </el-card>
</template>

<script>
import { queryLog } from '@/api/myAudit'
export default {
  name: 'LogInfo',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      defaultColumnConfig: {
        align: 'center',
        fixed: 'right'
      },
      tableData: [],
      columns: [
        { label: '审核人', prop: 'createUserName', width: 160 },
        { label: '操作时间', prop: 'createTime', width: 160 },
        { label: '操作类型', prop: 'loggerDesc', width: 180 },
        { slot: true, slotName: 'msgBrief' }
      ]
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    fetch({ current, size }, params) {
      this.loading = true
      return queryLog(this.id, 'NEW_PRODUCT', current, size).then(res => res.data).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
