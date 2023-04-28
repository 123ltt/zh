<template>
  <g-table id="zoneDataTable"
           ref="table"
           :headers="headers"
           row-key="id"
           :fetch="fetch"
           :show-order="true"
  >
    <el-table-column slot="hander" label="操作" align="center">
      <template #default="{row}">
        <el-button type="text" @click="handlerBtn(row)">删除</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>
<script>
import { partitionDetail, partitionDetailRemove } from '@/api/costOffer'
export default {
  name: 'ZoneDataTable',
  props: {
    params: Object
  },
  data() {
    return {
      current: 1,
      headers: [
        { label: '国家', prop: 'country', minWidth: '120px', align: 'center' },
        { label: '省/洲', prop: 'province', minWidth: '120px', align: 'center' },
        { label: '城市/区', prop: 'city', minWidth: '120px', align: 'center' },
        { label: '邮编', prop: 'postCode', minWidth: '120px', align: 'center' },
        { label: '服务类型', prop: 'serviceType', minWidth: '120px', align: 'center' },
        { slot: true, slotName: 'hander' }
      ]
    }
  },
  mounted() {
    this.init()
    this.updateHeight()
  },
  methods: {
    fetch({ current, size }, params) {
      return partitionDetail(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.pageSize
        }
      })
    },
    init(hasRefresh = true) {
      this.$refs.table.load(hasRefresh ? 1 : this.current, this.params)
    },

    handlerBtn(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        partitionDetailRemove(row.id).then(res => {
          this.$message.success('操作成功!')
          this.init(false)
        })
      })
    },
    updateHeight() {
      this.$nextTick(() => {
        document.querySelector('#zoneDataTable').parentElement.style.height = 400 + 'px'
        this.$refs.table.updateTableHeight()
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
