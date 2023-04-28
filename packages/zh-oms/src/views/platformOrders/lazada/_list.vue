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
          <el-tabs v-model="formData.platOrderStatusType" @tab-click="searchAndStatus">
            <el-tab-pane v-for="(item) in tabsList" :key="item.label" :label="item.label" :name="item.name" />
          </el-tabs>
          <el-row class="position-absolute top-0 end-0">
            <el-button v-if="$auth('oms_plat_lz_sync')" type="primary" size="mini" @click="batchGet">批量抓取同步</el-button>
            <el-button v-if="$auth('oms_plat_lz_export')" type="primary" size="mini" disabled>订单导出</el-button>
            <el-button v-if="$auth('oms_plat_lz_tag')" type="primary" size="mini" @click="batchSign">批量标记</el-button>
          </el-row>
        </el-row>
      </template>

      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" :currency="item.currency" />
      <el-table-column v-if="$auth('oms_plat_lz_view', 'oms_plat_lz_sync', 'oms_plat_lz_tag')" slot="handler" label="操作" width="80">
        <template slot-scope="{row}">
          <template v-if="$auth('oms_plat_lz_view')">
            <el-button type="text" @click="toOrderDetails(row)">查看</el-button><br>
          </template>
          <template v-if="$auth('oms_plat_lz_sync')">
            <el-button type="text" @click="handlerSync(row)">手工同步</el-button><br>
          </template>
          <el-button v-if="$auth('oms_plat_lz_tag')" type="text" @click="handlerSign(row)">手工标记</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getStoreByPlatform } from '@/api/common.js'
import { getListPage, getCount, batchGrabAndSync } from '@/api/lazada'
import { getDicts } from '@/api/common/dict'
import platItem from '../../components/platItem/index.js'
import toLastMonthDate from '../mixins/toLastMonthDate.js'

import formGroup from '../../components/form-group/index.vue'
import batchSynchroModal from '../modal/batchSynchroModal.vue'
import manualSignModal from '../modal/manualSignModal.vue'
import batchSignModal from '../modal/batchSignModal.vue'

export default {
  name: 'OmsPlatformOrdersLazadaList',
  components: { formGroup },
  mixins: [toLastMonthDate],
  data() {
    return {
      formAttrs: [
        { label: '创建时间', prop: 'orderTime', type: 'datetimerange' },
        { label: '抓单时间', prop: 'firstGrabDate', type: 'datetimerange' },
        { label: '订单来源', prop: 'orderType', type: 'select', items: (resolve) => this.getDicts(0, resolve) },
        { label: '销售店铺', labelField: 'displayName', valueField: 'displayName', prop: 'storeNameListStr', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getStoreCodeList },
        { label: '订单类型', prop: 'shippingTypeInt', type: 'radio', span: 8, items: (resolve) => this.getDicts(2, resolve) },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 8, items: (resolve) => this.getDicts(1, resolve) },
        { labelWidth: '0', prop: 'searchContent', type: 'GMultipleInput', attrs: { 'return-type': 'string', placeholder: '最大支持1000个，换行分割' }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        orderTime: [],
        firstGrabDate: [],
        platOrderStatusType: 'All',
        shippingTypeInt: '1',
        storeNameListStr: '',
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
      orderTypeList: [],
      shippingTypeList: [],
      pageConfig: [
        {
          path: 'storeInfo',
          itemData: [
            { label: '销售店铺', key: 'storeName', type: 'text' },
            { label: '销售站点', key: 'siteCode', type: 'text' },
            { label: '订单来源', key: 'orderTypeStr', type: 'text' },
            { label: '订单类型', key: 'shippingTypeStr', type: 'text' },
            { label: 'COD订单', key: 'isCod', type: 'text' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: ['orderId'], dyRouter: ['storeCode'], type: 'copy', url: 'oms/platformOrders/lazada/details' },
            { label: 'OMS单号', key: 'omOrderId', type: 'copy', url: 'oms/orderManagement/details' },
            { label: '平台订单状态', key: 'platStatusStr', type: 'text' },
            { label: 'OMS订单状态', key: 'omOrderStatusStr', type: 'text' },
            { label: '标记跟踪号', key: 'trackingCode', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goodList',
          currency: 'currency',
          itemData: [
            { label: '', key: 'productMainImage', type: 'image' },
            { label: '商品名称', key: 'name', type: 'text' },
            { label: 'ItemID', key: 'orderItemId', type: 'text' },
            { label: '在线SKU', key: 'sku', type: 'text' },
            { label: '数量', key: 'quantity', type: 'text', tag: 'compositeAndSecondary' },
            { label: '单价', key: 'productPriceWithoutTax', type: 'money' },
            { label: 'item状态', key: 'itemStatus', type: 'text' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '创建时间', key: 'createdAt', type: 'text' },
            { label: '抓单', key: 'firstGrabDate', type: 'text' },
            { label: '实际发货', key: 'deliveryTime', type: 'text' },
            { label: '标记', key: 'omsMarkDate', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '客付运费', key: 'freightChargesAmount', type: 'text', currency: 'currency' },
            { label: '订单总金额', key: 'orderAmountWithTax', type: 'text', currency: 'currency' }
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
      getStoreByPlatform('LZ').then(res => {
        this.storeList = res.data
        resolve(res.data)
      })
    },
    getDicts(type, resolve) {
      getDicts(['plat_search_type', 'plat_order_type', 'shipping_type'], 'oms').then(res => {
        const data = [[{ label: '全部', value: '' }, ...res.plat_order_type], res.plat_search_type, [{ label: 'ALL', value: '' }, ...res.shipping_type]][type]
        this.orderTypeList = res.plat_order_type
        this.shippingTypeList = res.shipping_type
        resolve(data)
      })
    },
    toOrderDetails({ orderId, storeCode }) {
      this.$newPage({
        path: `oms/platformOrders/lazada/details/-/${storeCode}`,
        data: { orderId }
      })
    },
    // 获取状态数量
    getOrderStatusList(data) {
      getCount({ data }).then(({ data: { total, unpaid, pending, shipped, canceled, markFailed, delivered, returned } }) => {
        this.tabsList = [
          { name: 'All', total, label: `全部(${total})` },
          { name: 'UNPAID', total, label: `待付款(${unpaid})` },
          { name: 'PENDING', total, label: `待发货(${pending})` },
          { name: 'SHIPPED', total, label: `已发货(${shipped})` },
          { name: 'CANCELED', total, label: `已取消(${canceled})` },
          { name: 'MARK_FAILED', total, label: `标记失败(${markFailed})` },
          { name: 'DELIVERED', total, label: `已完成(${delivered})` },
          { name: 'RETURNED', total, label: `已退货(${returned})` }
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

      const { orderTime, firstGrabDate, storeNameListStr } = data
      const sc = data.searchContent.match(/[^,]+/g) || []
      if (sc.length > 1000) return this.$message.error('超过1000个')

      data.searchContent = sc.toString()
      data.storeNameListStr = storeNameListStr.toString()
      data.platOrderStatusType = data.platOrderStatusType === 'All' ? '' : data.platOrderStatusType
      data.createdAtStart = orderTime[0]
      data.createdAtEnd = orderTime[1]
      data.firstGrabDateStart = firstGrabDate[0]
      data.firstGrabDateEnd = firstGrabDate[1]
      delete data.orderTime
      delete data.firstGrabDate
      return data
    },
    search(data, page = 1) {
      this.$refs.table.load(page, data)
    },
    formatterType(type) {
      const list = this.orderTypeList
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === type) return list[i].label
      }
    },
    fetch({ current, size }, params) {
      return getListPage(Object.assign({ query: { current, size } }, { data: params })).then(({ data: { records, total, size } }) => {
        const d = records.map(item => {
          item.goodList.forEach(good => {
            if (!good.compositeAndSecondary && good.isFbl === 1) good.compositeAndSecondary = 'FBL'
          })
          item.ifPreSale = item.ifPreSale === 1 ? '是' : '否'
          item.isCod = item.isCod ? '是' : '否'
          item.orderType = this.formatterType(item.orderType)
          return item
        })
        return { records: d, total, size }
      })
    },
    reset(formName) {
      const { resetFields } = this.$refs[formName].ref
      resetFields()
      this.formData.platOrderStatusType = 'All'
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
        data: { platformCode: 'LZ' }
      })
    },
    handlerSign(row) {
      this.$modal({
        title: '手工标记',
        width: '36%',
        component: manualSignModal,
        data: {
          platformCode: 'LZ',
          platOrderId: row.orderId,
          storeCode: row.storeCode,
          trackCode: row.trackingCode,
          hasItems: true
        }
      })
    },
    handlerSync({ storeCode, orderId, siteCode }) {
      this.$confirm('确定要同步吗?', '提示', { type: 'warning' }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '手工同步中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        batchGrabAndSync({ storeCode, ordersId: orderId, siteCode }).then(res => {
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
          platCode: 'LZ',
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
