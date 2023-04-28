<template>
  <basic-container>
    <g-table ref="table"
             :headers="headers"
             :expand-row-keys="expandKeys"
             row-key="index"
             :fetch="fetch"
    >
      <template slot="header">
        <formGroup ref="formRef" :model="formData" :gutter="10" class="form-col no-message" label-width="70px" :form-attrs="formAttrs">
          <el-form-item slot="btn" label-width="10px">
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="reset('formRef')">重置</el-button>
          </el-form-item>
        </formGroup>
      </template>
      <el-table-column slot="expand" type="expand" width="1" class-name="overflow-hidden">
        <template slot-scope="{row}">
          <ItemTable :key="row.id" :table-list="row.goodList" />
        </template>
      </el-table-column>

      <el-table-column slot="indexExpand" type="index" label="序号" width="55" class-name="index-expand-class">
        <template slot-scope="{row}">
          <div class="cursor" @click="expandHandler(row)">
            {{ row.index + 1 }}
            <i :class="expandKeys.includes(row.index)?'el-icon-arrow-down':'el-icon-arrow-right'" />
          </div>
        </template>
      </el-table-column>
      <el-table-column slot="orderId" label="平台订单号" min-width="100">
        <template slot-scope="{row}">
          <g-text-ellipsis class="linkClass text-primary" @click.native="toPlatOrOMS(row, false)">{{ row.orderId }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="omOrderId" label="OMS订单号" min-width="100">
        <template slot-scope="{row}">
          <g-text-ellipsis class="linkClass text-primary" @click.native="toPlatOrOMS(row, true)">{{ row.omOrderId }}</g-text-ellipsis>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getStoreByPlatform } from '@/api/common.js'
import { getListPage } from '@/api/refund.js'
import { getDicts } from '@/api/common/dict'
import { dateFormat } from '@/util/date.js'

import formGroup from '../components/form-group/index.vue'
import ItemTable from './modal/item-table.vue'
export default {
  name: 'OmsRefundLazada',
  components: {
    formGroup, ItemTable
  },
  data() {
    return {
      formAttrs: [
        { label: '创建时间', labelWidth: '90px', prop: 'createTime', type: 'datetimerange' },
        { label: '退款时间', prop: 'refundTime', type: 'datetimerange' },
        { label: '订单类型', prop: 'shippingTypeInt', type: 'select', items: (resolve) => this.getDicts(2, resolve) },
        { label: '销售店铺', labelField: 'displayName', valueField: 'candidateDisplayName', prop: 'storeCode', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getStoreCodeList },
        { label: 'OMS订单状态', labelWidth: '90px', prop: 'omsOrderStatus', type: 'select', items: (resolve) => this.getDicts(0, resolve) },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 6, items: (resolve) => this.getDicts(1, resolve) },
        { labelWidth: '10px', prop: 'searchContent', type: 'GMultipleInput', attrs: { 'return-type': 'string', placeholder: '最大支持1000个，换行分割' }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        createTime: [],
        refundTime: [],
        shippingTypeInt: '',
        storeCode: '',
        omsOrderStatus: '',
        searchType: '1',
        searchContent: ''
      },
      headers: [
        { slot: true, slotName: 'expand' },
        { slot: true, slotName: 'indexExpand' },
        // { label: '平台订单号', prop: 'orderId', minWidth: 100, showOverflowTooltip: true },
        // { label: 'OMS订单号', prop: 'omOrderId', minWidth: 100, showOverflowTooltip: true },
        { slot: true, slotName: 'orderId' },
        { slot: true, slotName: 'omOrderId' },
        { label: '店铺', prop: 'storeName' },
        { label: '币种', prop: 'currency', width: 60 },
        { label: '订单总金额', prop: 'price', width: 90 },
        { label: '订单退款金额', prop: 'refundPrice', width: 100 },
        { label: '是否COD', prop: 'cod', width: 80 },
        { label: 'OMS订单状态', prop: 'omsStatus', width: 100 },
        { label: '平台订单状态', prop: 'platStatusStr', width: 100 },
        { label: '订单类型', prop: 'shippingTypeIntStr' },
        { label: '退款时间', prop: 'refundTime', width: 130, formatter(row) { return (row.goodList[0] || {}).refundTime } },
        { label: '创建时间', prop: 'createdAt', width: 130, formatter(row) { return (row.goodList[0] || {}).createdAt } }
      ],
      expandKeys: []
    }
  },
  created() {
    this.setDefaultDate()
  },
  mounted() {
    this.search()
    this.$refs.table.$el.classList.add('_expand_scroll_fixed')
  },
  methods: {
    setDefaultDate() {
      const curDate = new Date()
      const curDateEndStr = dateFormat(curDate).slice(0, 11) + '23:59:59'
      curDate.setMonth(curDate.getMonth() - 1)
      const lastMonthDateStartStr = dateFormat(curDate).slice(0, 11) + '00:00:00'
      this.formData.createTime = [lastMonthDateStartStr, curDateEndStr]
    },
    toPlatOrOMS({ omOrderId, orderId }, isOMS) {
      const name = isOMS ? 'OmsOrderManagementAll' : 'OmsPlatformOrdersLazadaList'
      const params = isOMS
        ? { searchContent: omOrderId, searchType: '2' }
        : { searchContent: orderId, searchType: '1' }
      this.$router.push({ name, params }, true)
    },
    getStoreCodeList(resolve) { // 获取ebay的销售店铺
      getStoreByPlatform('LZ').then(res => {
        resolve(res.data)
      })
    },
    getDicts(type, resolve) {
      getDicts(['plat_refund_search_type', 'order_status', 'shipping_type'], 'oms').then(res => {
        const data = [[{ label: '全部', value: '' }, ...res.order_status], res.plat_refund_search_type, [{ label: '全部', value: '' }, ...res.shipping_type]][type]
        resolve(data)
      })
    },
    getSearchData() {
      const data = Object.assign({}, this.formData)
      data.createTime ??= []
      data.refundTime ??= []

      const { createTime, refundTime, storeCode } = data
      const sc = data.searchContent.match(/[^,]+/g) || []
      if (sc.length > 1000) return this.$message.error('超过1000个')

      data.searchContent = sc.toString()
      data.storeCode = storeCode.toString()
      data.createdAtStart = createTime[0]
      data.createdAtEnd = createTime[1]
      data.refundAtStart = refundTime[0]
      data.refundAtEnd = refundTime[1]
      delete data.createTime
      delete data.refundTime
      return data
    },
    search(page = 1) {
      const data = this.getSearchData()
      this.$refs.table.load(page, data)
    },
    fetch(query, data) {
      this.expandKeys = []
      return getListPage({ query, data }).then(({ data: { records, total, size } }) => {
        const d = records.map((item, i) => {
          item.cod = item.cod === 1 ? '是' : '否'
          item.index = i
          return item
        })
        return { records: d, total, size }
      })
    },
    reset(formName) {
      const { resetFields } = this.$refs[formName].ref
      resetFields()
      this.search()
    },
    expandHandler(row) {
      if (this.expandKeys.indexOf(row.index) > -1) {
        this.expandKeys = this.expandKeys.filter(item => item !== row.index)
      } else {
        this.expandKeys.push(row.index)
      }
      this.expandKeys.length > 6 && this.expandKeys.shift()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .g-table-wrap._expand_scroll_fixed>div>.g-table>.el-table__body-wrapper{
    overflow-y: auto !important;
  }
  .linkClass{
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  .el-table__expanded-cell{
    padding: 0 0 1px;
    background-color: var(--color-primary);
    overflow: hidden;
  }
  .index-expand-class{
    color: var(--color-primary);
    .cursor{
      cursor: pointer;
    }
  }
  .radio-group .el-radio{
    margin-right: 10px !important;
    &:last-child{
      margin-right: 0 !important;
    }
  }
}
</style>
