<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" :dense="true">
      <template slot="header">

        <formGroup ref="formRef" :model="formData" :gutter="10" class="form-col no-message" label-width="70px" :form-attrs="formAttrs">
          <el-form-item slot="btn" label-width="10px">
            <el-button type="primary" @click="searchAndStatus">搜索</el-button>
            <el-button @click="reset('formRef')">重置</el-button>
          </el-form-item>
        </formGroup>

        <el-row style="min-height: 30px;" class="position-relative">
          <el-tabs v-model="formData.orderType" @tab-click="searchAndStatus">
            <el-tab-pane v-for="(item) in tabsList" :key="item.label" :label="item.label" :name="item.name" />
          </el-tabs>
          <el-row class="position-absolute top-0 end-0">
            <el-button v-if="$auth('oms_plat_eb_sync')" type="primary" size="mini" @click="batchGet">批量抓取同步</el-button>
            <el-button v-if="$auth('oms_plat_eb_export')" type="primary" size="mini" disabled>订单导出</el-button>
            <el-button v-if="$auth('oms_plat_eb_tag')" type="primary" size="mini" @click="batchSign">批量标记</el-button>
          </el-row>
        </el-row>
      </template>

      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" />
      <el-table-column v-if="$auth('oms_plat_eb_view', 'oms_plat_eb_sync', 'oms_plat_eb_tag')" slot="handler" label="操作" width="80">
        <template slot-scope="{row}">
          <template v-if="$auth('oms_plat_eb_view')">
            <el-button type="text" @click="toOrderDetails(row)">查看</el-button><br>
          </template>
          <template v-if="$auth('oms_plat_eb_sync')">
            <el-button type="text" @click="handlerSync(row)">手工同步</el-button><br>
          </template>
          <el-button v-if="$auth('oms_plat_eb_tag')" type="text" @click="handlerSign(row)">手工标记</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getStoreByPlatform } from '@/api/common.js'
import { getListPage, getCount, batchGrabAndSync } from '@/api/ebay'
import { getDicts } from '@/api/common/dict'
import platItem from '../../components/platItem/index.js'
import toLastMonthDate from '../mixins/toLastMonthDate.js'

import batchSynchroModal from '../modal/batchSynchroModal.vue'
import formGroup from '../../components/form-group/index.vue'
import manualSignModal from '../modal/manualSignModal.vue'
import batchSignModal from '../modal/batchSignModal.vue'
export default {
  name: 'OmsPlatformOrdersEbayList',
  components: { formGroup },
  mixins: [toLastMonthDate],
  data() {
    return {
      formAttrs: [
        { label: '付款时间', prop: 'orderTime', type: 'datetimerange' },
        { label: '抓单时间', prop: 'firstGrabDate', type: 'datetimerange' },
        { label: '订单来源', prop: 'orderStatus', type: 'select', items: (resolve) => this.getDicts(1, resolve) },
        { label: '销售店铺', labelField: 'displayName', valueField: 'displayName', prop: 'storeName', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getStoreCodeList },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 8, items: (resolve) => this.getDicts(0, resolve) },
        { labelWidth: '0', prop: 'searchContent', type: 'GMultipleInput', attrs: { 'return-type': 'string', placeholder: '最大支持1000个，换行分割' }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        orderTime: [],
        firstGrabDate: [],
        orderStatus: '',
        storeName: '',
        searchType: this.$route.params.searchType || '1',
        searchContent: this.$route.params.searchContent || '',
        orderType: 'All'
      },
      platItem: platItem,
      headers: [
        { type: 'selection', width: 45 },
        { slot: true, slotName: 'storeInfo' },
        { slot: true, slotName: 'orderInfo' },
        { slot: true, slotName: 'productInfo' },
        { slot: true, slotName: 'timeInfo' },
        { slot: true, slotName: 'moneyInfo' },
        { slot: true, slotName: 'handler' }
      ],
      tabsList: [],
      pageConfig: [
        {
          path: 'storeInfo',
          itemData: [
            { label: '销售店铺', key: 'storeName', type: 'text' },
            { label: '销售站点', key: 'siteCode', type: 'text' },
            { label: '订单来源', key: 'platOrderStatus', type: 'text' },
            { label: '买家账号', key: 'buyerUserId', type: 'text' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: 'platOrderId', type: 'copy', url: 'oms/platformOrders/ebay/details' },
            { label: 'OMS单号', key: 'omOrderId', type: 'copy', url: 'oms/orderManagement/details' },
            { label: '平台订单状态', key: 'orderStatus', type: 'text' },
            { label: 'OMS订单状态', key: 'omOrderStatus', type: 'text' },
            { label: '标记跟踪号', key: 'trackingNumber', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goodList',
          itemData: [
            { label: '', key: 'imageUrl', type: 'image' },
            { label: '商品名称', key: 'title', type: 'text' },
            { label: 'ItemID', key: 'itemId', type: 'text' },
            { label: '在线SKU', key: 'sku', type: 'text' },
            { label: '数量', key: 'quantityPurchased', type: 'text' },
            { label: '单价', key: 'itemPrice', type: 'money' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '抓单', key: 'firstGrabDate', type: 'text' },
            { label: '付款', key: 'paidTime', type: 'text' },
            { label: '实际发货', key: 'deliverDate', type: 'text' },
            { label: '标记', key: 'omsMarkDate', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '运费', key: 'shippingServiceCost', type: 'text' },
            { label: '折扣金额', key: 'disCountAmount', type: 'text' },
            { label: '订单总金额', key: 'total', type: 'text' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.searchAndStatus()
  },
  methods: {
    getStoreCodeList(resolve) { // 获取ebay的销售店铺
      getStoreByPlatform('EB').then(res => {
        resolve(res.data)
      })
    },
    getDicts(type, resolve) {
      getDicts(['plat_search_type', 'plat_order_type'], 'oms').then(res => {
        const data = type ? [{ label: '全部', value: '' }, ...res.plat_order_type] : res.plat_search_type
        resolve(data)
      })
    },
    toOrderDetails({ platOrderId }) {
      this.$newPage({
        path: 'oms/platformOrders/ebay/details',
        data: { platOrderId }
      })
    },
    // 获取状态数量
    getOrderStatusList(data) {
      getCount(data).then(({ data: { total, PENDING, NOT_SHIPPED, Shipped, Canceling, Canceled, MarkFailed } }) => {
        this.tabsList = [
          { name: 'All', total, label: `全部(${total})` },
          { name: 'PENDING', total, label: `未到账(${PENDING})` },
          { name: 'NOT_SHIPPED', total, label: `待发货(${NOT_SHIPPED})` },
          { name: 'SHIPPED', total, label: `已发货(${Shipped})` },
          { name: 'CANCELING', total, label: `取消中(${Canceling})` },
          { name: 'CANCELED', total, label: `已取消(${Canceled})` },
          { name: 'MARK_FAILED', total, label: `标记失败(${MarkFailed})` }
        ]
      })
    },
    searchAndStatus() {
      const data = this.getSearchData()
      this.search(data)
      this.getOrderStatusList(data)
    },
    getSearchData() {
      const data = Object.assign({}, this.formData)
      data.orderTime ??= []
      data.firstGrabDate ??= []

      const { orderTime, firstGrabDate, storeName } = data
      const sc = data.searchContent.match(/[^,]+/g) || []
      if (sc.length > 1000) return this.$message.error('超过1000个')

      data.searchContent = sc.toString()
      data.storeName = storeName.toString()
      data.orderType = data.orderType === 'All' ? '' : data.orderType
      data.orderTimeStart = orderTime[0]
      data.orderTimeEnd = orderTime[1]
      data.firstGrabDateStart = firstGrabDate[0]
      data.firstGrabDateEnd = firstGrabDate[1]
      delete data.orderTime
      delete data.firstGrabDate
      return data
    },
    search(data, page = 1) {
      this.$refs.table.load(page, data)
    },
    fetch({ current, size }, params) {
      return getListPage(Object.assign({ current, size }, params)).then(({ data: { records, total, size } }) => {
        return { records, total, size }
      })
    },
    reset(formName) {
      const { resetFields } = this.$refs[formName].ref
      resetFields()
      this.formData.searchType = '1'
      this.formData.searchContent = ''
      this.formData.orderType = 'All'
      this.$nextTick(() => {
        this.searchAndStatus()
      })
    },
    batchSign() {
      this.$modal({
        title: '批量标记',
        width: '36%',
        component: batchSignModal,
        data: { platformCode: 'EB' }
      })
    },
    handlerSign(row) {
      this.$modal({
        title: '手工标记',
        width: '36%',
        component: manualSignModal,
        data: { platformCode: 'EB', platOrderId: row.platOrderId }
      })
    },
    handlerSync({ storeCode: store, platOrderId: searchContent }) {
      this.$confirm('确定要同步吗?', '提示', { type: 'warning' }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '手工同步中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        batchGrabAndSync({ store, searchContent }).then(res => {
          this.$message.success(res.msg)
        }).finally(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    batchGet() {
      this.$modal({
        title: '订单批量抓取与同步',
        width: '36%',
        component: batchSynchroModal,
        data: { platCode: 'EB' },
        callback: (bool) => {
          if (bool) {
            this.searchAndStatus()
          }
        }
      })
    }
  }
}
</script>
