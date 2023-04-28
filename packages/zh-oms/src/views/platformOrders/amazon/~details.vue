<template>
  <div class="plat-details">
    <amazonDetails ref="amazon" :items="itemList" :config="config" />
    <el-card class="table-card no-pb">
      <h4 slot="header" class="my-1">订单日志</h4>
      <g-table ref="table" :dense="true" :headers="headers" :fetch="fetch" :fixed-height="false" />
    </el-card>
  </div>
</template>

<script>
import itemList from './item.js'
import amazonDetails from '../details/details-form.vue'
import { pageTable } from '@/api/platformOrder'

export default {
  components: {
    amazonDetails
  },
  props: {
    platOrderId: String
  },
  data() {
    return {
      itemList: itemList,
      config: {
        params: { platOrderId: this.platOrderId },
        url: '/amplatorder/detail',
        methods: 'GET'
      },
      labelWidth: 'auto',
      formData: {},
      disabled: true,
      tableData: [],
      headers: [
        { label: '序号', type: 'index', align: 'center' },
        { label: '操作属性', prop: 'logger', align: 'center' },
        { label: '描述', prop: 'msgBrief', align: 'center' },
        { label: '用户ID', prop: 'createUserAccount', align: 'center' },
        { label: '首次写入时间', prop: 'createTime', align: 'center' },
        { label: '最近写入时间', prop: 'updateTime', align: 'center' }
      ]
    }
  },
  mounted() {
    this.$emit('title', 'amazon订单详情')
    this.$refs.table.load(1, { platOrderId: this.platOrderId })
  },
  methods: {
    fetch({ current, size }, params) {
      return pageTable(Object.assign({ current, size }, params)).then(res => {
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
<style lang="scss" scoped>
.plat-details ::v-deep {
  .table-card {
    .el-card__header{
        background: linear-gradient(to right, #f5f4f4,#fff);
    }
    .el-card__body{
      padding: 2px 0 16px;
    }
  }
  .no-pb .el-card__body{
    padding-bottom: 0;
  }
}
</style>
