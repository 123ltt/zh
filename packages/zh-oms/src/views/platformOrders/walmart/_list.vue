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
          <el-tabs v-model="formData.orderStatus" @tab-click="searchAndStatus">
            <el-tab-pane v-for="(item) in tabsList" :key="item.label" :label="item.label" :name="item.name" />
          </el-tabs>
          <el-row class="position-absolute top-0 end-0">
            <el-button v-if="$auth('oms_plat_wm_sync')" type="primary" size="mini" @click="batchGet">批量抓取同步</el-button>
            <el-button v-if="$auth('oms_plat_wm_export')" type="primary" size="mini" disabled>订单导出</el-button>
            <el-button v-if="$auth('oms_plat_wm_tag')" type="primary" size="mini" @click="batchSign">批量标记</el-button>
            <el-button v-if="$auth('oms_plat_wm_merge')" type="primary" size="mini" @click="canMergeOrderHandler">可合并订单</el-button>
          </el-row>
        </el-row>
      </template>

      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" :currency="item.currency" :label-width="item.labelWidth" />
      <el-table-column v-if="$auth('oms_plat_wm_view', 'oms_plat_wm_sync', 'oms_plat_wm_tag')" slot="handler" label="操作" width="80">
        <template slot-scope="{row}">
          <template v-if="$auth('oms_plat_wm_view')">
            <el-button type="text" @click="toOrderDetails(row)">查看</el-button><br>
          </template>
          <template v-if="$auth('oms_plat_wm_sync')">
            <el-button type="text" @click="handlerSync(row)">手工同步</el-button><br>
          </template>
          <el-button v-if="$auth('oms_plat_wm_tag')" type="text" @click="handlerSign(row)">手工标记</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getStoreByPlatform } from '@/api/common.js'
import { getWmPlatList, getCountList, batchGrabAndSync } from '@/api/walmart.js'
import { getDicts } from '@/api/common/dict'
import platItem from '../../components/platItem/index.js'
import toLastMonthDate from '../mixins/toLastMonthDate.js'

import formGroup from '../../components/form-group/index.vue'
import batchSynchroModal from '../modal/batchSynchroModal.vue'
import manualSignModal from '../modal/manualSignModal.vue'
import batchSignModal from '../modal/batchSignModal.vue'
import CanMergeOrderDetail from './canMergeOrderDetail.vue'

export default {
  name: 'OmsPlatformOrdersWalmartList',
  components: { formGroup },
  mixins: [toLastMonthDate],
  data() {
    return {
      formAttrs: [
        { label: '创建时间', prop: 'orderTime', type: 'datetimerange' },
        { label: '抓单时间', prop: 'firstGrabDate', type: 'datetimerange' },
        { label: '订单来源', prop: 'orderType', offsetright: 6, type: 'select', items: (resolve) => this.getDicts(0, resolve) },
        { label: '销售店铺', prop: 'storeCode', labelField: 'displayName', valueField: 'candidateDisplayName', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getStoreCodeList },
        { label: '发货类型', prop: 'shipNode', type: 'radio', span: 6, items: (resolve) => this.getDicts(1, resolve) },
        { label: '订单类型', prop: 'platOrderType', type: 'radio', span: 6, items: (resolve) => this.getDicts(2, resolve) },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 12, items: (resolve) => this.getDicts(3, resolve) },
        { labelWidth: '10px', prop: 'searchContent', type: 'GMultipleInput', attrs: { 'return-type': 'string', placeholder: '最大支持1000个，换行分割', regExp: /\n+/ }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        orderTime: [],
        firstGrabDate: [],
        orderStatus: 'All',
        platOrderType: 'REGULAR',
        shipNode: 'SellerFulfilled',
        storeCode: '',
        searchType: this.$route.params.searchType || '1',
        searchContent: this.$route.params.searchContent || '',
        orderType: ''
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
      storeList: [],
      tabsList: [],
      orderTypeList: [], // 订单来源
      platOrderTypeList: [], // 订单类型
      pageConfig: [
        {
          path: 'storeInfo',
          itemData: [
            { label: '销售店铺', key: 'storeName', type: 'text' },
            { label: '销售站点', key: 'siteCode', type: 'text' },
            { label: '订单来源', key: 'orderType', type: 'text' },
            { label: '订单类型', key: 'platOrderType', type: 'text' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: 'purchaseOrderId', type: 'copy', url: 'oms/platformOrders/walmart/details' },
            { label: 'OMS单号', key: 'omOrderId', type: 'copy', url: 'oms/orderManagement/details' },
            { label: '平台订单状态', key: 'orderStatus', type: 'text' },
            { label: 'OMS订单状态', key: 'omOrderStatus', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goods',
          currency: 'shippingCurrency',
          labelWidth: '60px',
          itemData: [
            { label: '', key: 'productImgUrl', type: 'image' },
            { label: '商品名称', key: 'productName', type: 'text' },
            { label: 'ItemID', key: 'lineNumber', type: 'text' },
            { label: '在线SKU', key: 'sku', type: 'text' },
            { label: '数量', key: 'quantity', type: 'text' },
            { label: '单价', key: 'itemPrice', type: 'money' },
            { label: 'item状态', key: 'lineStatus', type: 'text' },
            { label: '标记跟踪号', key: 'trackingNumber', type: 'text' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '创建时间', key: 'orderDate', type: 'text' },
            { label: '抓单时间', key: 'firstGrabDate', type: 'text' },
            { label: '标记时间', key: 'omsMarkDate', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '订单总金额', key: 'orderAmount', type: 'text', currency: 'shippingCurrency' },
            { label: '客付运费', key: 'freightChargesAmount', type: 'text', currency: 'shippingCurrency' },
            { label: '税费', key: 'taxAmount', type: 'text', currency: 'shippingCurrency' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.searchAndStatus()
  },
  methods: {
    canMergeOrderHandler() {
      this.$newTab({
        path: '/CanMergeOrderDetail',
        title: '可合并订单详情',
        component: CanMergeOrderDetail,
        clearCache: true
      })
    },
    getStoreCodeList(resolve) { // 获取walmart的销售店铺
      getStoreByPlatform('WM').then(res => {
        this.storeList = res.data
        resolve(res.data)
      })
    },
    getDicts(type, resolve) {
      getDicts(['wm_plat_search_type', 'wm_plat_order_type', 'plat_order_type', 'wm_plat_delivery_type'], 'oms').then(res => {
        const data = [
          [{ label: '全部', value: '' }, ...res.plat_order_type],
          [{ label: 'ALL', value: '' }, ...res.wm_plat_delivery_type],
          res.wm_plat_order_type,
          res.wm_plat_search_type
        ][type]
        this.orderTypeList = res.plat_order_type
        this.platOrderTypeList = res.wm_plat_order_type
        resolve(data)
      })
    },
    toOrderDetails({ purchaseOrderId }) {
      this.$newPage({
        path: 'oms/platformOrders/walmart/details',
        data: { purchaseOrderId }
      })
    },
    // 获取状态数量
    getOrderStatusList(data) {
      getCountList(data).then(({ data: { total, created, acknowledged, shipped, delivered, cancelled, markFailed } }) => {
        this.tabsList = [
          { name: 'All', total, label: `全部(${total})` },
          { name: 'created', total, label: `待确认(${created})` },
          { name: 'acknowledged', total, label: `待发货(${acknowledged})` },
          { name: 'shipped', total, label: `已发货(${shipped})` },
          { name: 'delivered', total, label: `已完成(${delivered})` },
          { name: 'cancelled', total, label: `已取消(${cancelled})` },
          { name: 'markFailed', total, label: `标记失败(${markFailed})` }
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

      const { orderTime, firstGrabDate, storeCode } = data
      const sc = data.searchContent.match(/[^,]+/g) || []
      if (sc.length > 1000) return this.$message.error('超过1000个')

      if (data.orderStatus === 'All')data.orderStatus = ''
      else if (data.orderStatus === 'markFailed') {
        data.markStatus = 1
        delete data.orderStatus
      }
      data.searchContent = sc.toString()
      data.storeCode = storeCode.toString()
      data.orderDateStart = orderTime[0]
      data.orderDateEnd = orderTime[1]
      data.firstGrabDateStart = firstGrabDate[0]
      data.firstGrabDateEnd = firstGrabDate[1]
      delete data.orderTime
      delete data.firstGrabDate
      return data
    },
    search(data, page = 1) {
      this.$refs.table.load(page, data)
    },
    formatterType(type, list) {
      list ??= []
      for (let i = 0; i < list.length; i++) {
        if (+list[i].value === type) return list[i].label
      }
    },
    fetch(query, data) {
      return getWmPlatList({ ...query, ...data }).then(({ data: { records, total, size } }) => {
        const d = (records || []).map(item => {
          item.orderType = this.formatterType(item.orderType, this.orderTypeList)
          item.shippingCurrency = Array.isArray(item.goods) && item.goods[0]?.shippingCurrency
          return item
        })
        return { records: d, total, size }
      })
    },
    reset(formName) {
      const { resetFields } = this.$refs[formName].ref
      resetFields()
      this.formData.orderStatus = 'All'
      this.formData.searchType = '1'
      this.formData.searchContent = ''
      this.$nextTick(() => {
        this.searchAndStatus()
      })
    },
    batchSign() {
      this.$modal({
        title: '批量标记',
        width: '36%',
        component: batchSignModal,
        data: { platformCode: 'WM' }
      })
    },
    handlerSign(row) {
      this.$modal({
        title: '手工标记',
        width: '36%',
        component: manualSignModal,
        data: { platformCode: 'WM', platOrderId: row.purchaseOrderId, trackCode: row.trackingNumber, hasItems: true }
      })
    },
    handlerSync({ storeCode, purchaseOrderId, siteCode }) {
      this.$confirm('确定要同步吗?', '提示', { type: 'warning' }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '手工同步中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        batchGrabAndSync({ storeCode, ordersId: purchaseOrderId, siteCode }).then(res => {
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
        data: {
          platCode: 'WM',
          hasSite: true,
          params: { store: 'storeCode', st: 'updateTimeAction', et: 'updateTimeEnding', ust: 'updateTimeAction', uet: 'updateTimeEnding', sc: 'ordersId' },
          interfaceApi: batchGrabAndSync
        },
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
