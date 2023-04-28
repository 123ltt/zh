<template>
  <div class="plat-details">
    <smtDetails ref="smt" :items="itemList" :config="config" />
    <el-card class="table-card no-pb">
      <h4 slot="header" class="my-1">订单日志</h4>
      <g-table ref="table" :dense="true" :headers="logHeaders" :fetch="logFetch" :fixed-height="false" />
    </el-card>
  </div>
</template>

<script>
import itemList from './item.js'
import smtDetails from '../details/details-form.vue'
import { smtPageLog } from '@/api/platformOrder'
export default {
  components: {
    smtDetails
  },
  props: {
    platOrderId: String
  },
  data() {
    return {
      itemList: itemList,
      config: {
        params: { platOrderId: this.platOrderId },
        url: '/smplatOrdermain/detail',
        methods: 'GET'
      },
      goodsHeaders: [
        { slot: true, slotName: 'imageUrl' },
        { slot: true, slotName: 'productInfo' },
        { label: '单价', prop: 'itemPrice', formatter: (row, column, cellValue) => this.formatterMoney(cellValue), width: '120px' },
        { label: '数量', prop: 'quantityPurchased', width: '120px' },
        { label: '销售金额', prop: 'itemPrice', formatter: (row, column, cellValue) => this.formatterMoney(cellValue), width: '120px' }
      ],
      logHeaders: [
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
    this.$emit('title', 'SMT订单详情')
    this.$refs.table.load(1, { platOrderId: this.platOrderId })
  },
  methods: {
    logFetch(current) {
      const params = Object.assign({ platOrderId: this.platOrderId }, current)
      return smtPageLog(params).then(res => {
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
