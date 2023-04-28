<template>
  <g-table ref="table"
           :headers="headers"
           row-key="id"
           :fetch="fetch"
           :show-order="true"
  >
    <el-table-column slot="content" label="操作记录" align="center">
      <template v-slot="{row}">
        <g-text-ellipsis popper-class="addClass" :tooltip-max-length="0">
          {{ row.content }}
        </g-text-ellipsis>
      </template>
    </el-table-column>
  </g-table>
</template>
<script>
import { getLogisticsLog } from '@/api/common'
export default {
  name: 'RecordsTable',
  props: {
    logType: String,
    bizId: String
  },
  data() {
    return {
      headers: [
        { label: '操作人', prop: 'createUser', width: '120px', align: 'center' },
        { label: '操作时间', prop: 'createTime', width: '180px', align: 'center' },
        { slot: true, slotName: 'content' }
      ]
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    init() {
      const params = {
        logType: this.logType,
        bizId: this.bizId
      }
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return getLogisticsLog(current, size, params).then(res => {
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.pageSize
        }
      })
    }
  }
}
</script>
<style lang="scss">
.addClass.el-tooltip__popper {
  word-break: break-all;
}
</style>
