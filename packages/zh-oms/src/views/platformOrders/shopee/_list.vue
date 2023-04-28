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
            <el-button v-if="$auth('oms_plat_sh_sync')" type="primary" size="mini" @click="batchGet">批量抓取同步</el-button>
            <el-button v-if="$auth('oms_plat_sh_export')" type="primary" size="mini" disabled>订单导出</el-button>
          </el-row>
        </el-row>
      </template>

      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" :currency="item.currency" />

      <el-table-column v-if="$auth('oms_plat_sh_view', 'oms_plat_sh_sync')" slot="handler" label="操作" width="80">
        <template slot-scope="{row}">
          <template v-if="$auth('oms_plat_sh_view')">
            <el-button type="text" @click="toOrderDetails(row)">查看</el-button><br>
          </template>
          <el-button v-if="$auth('oms_plat_sh_sync')" type="text" @click="handlerSync(row)">手工同步</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getStoreByPlatform } from '@/api/common.js'
import { getListPage, getCount, batchGrabAndSync } from '@/api/shopee'
import { getDicts } from '@/api/common/dict'
import platItem from '../../components/platItem/index.js'
import toLastMonthDate from '../mixins/toLastMonthDate.js'

import formGroup from '../../components/form-group/index.vue'
import batchSynchroModal from '../modal/batchSynchroModal.vue'

export default {
  name: 'OmsPlatformOrdersShopeeList',
  components: { formGroup },
  mixins: [toLastMonthDate],
  data() {
    return {
      formAttrs: [
        { label: '付款时间', prop: 'orderTime', type: 'datetimerange' },
        { label: '抓单时间', prop: 'firstGrabDate', type: 'datetimerange' },
        { label: '订单来源', prop: 'orderType', type: 'select', items: (resolve) => this.getDicts(1, resolve) },
        { label: '销售店铺', labelField: 'displayName', valueField: 'displayName', prop: 'storeName', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getStoreCodeList },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 8, items: (resolve) => this.getDicts(0, resolve) },
        { labelWidth: '0', prop: 'searchContent', type: 'GMultipleInput', attrs: { 'return-type': 'string', placeholder: '最大支持1000个，换行分割' }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        orderTime: [],
        firstGrabDate: [],
        orderStatus: 'All',
        storeName: '',
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
      tabsList: [],
      orderTypeList: [],
      pageConfig: [
        {
          path: 'storeInfo',
          itemData: [
            { label: '销售店铺', key: 'storeName', type: 'text' },
            { label: '销售站点', key: 'siteCode', type: 'text' },
            { label: '买家账号', key: 'buyerUserName', type: 'text' },
            { label: '订单来源', key: 'orderType', type: 'text' },
            { label: '预售订单', key: 'ifPreSale', type: 'text' },
            { label: 'COD订单', key: 'ifCashOnOelivery', type: 'text' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: 'platOrderId', type: 'copy', url: 'oms/platformOrders/shopee/details' },
            { label: 'OMS单号', key: 'omOrderId', type: 'copy', url: 'oms/orderManagement/details' },
            { label: '平台订单状态', key: 'platOrderStatus', type: 'text' },
            { label: 'OMS订单状态', key: 'omOrderStatus', type: 'text' },
            { label: '标记跟踪号', key: 'trackingNo', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goodList',
          currency: 'orderCurrency',
          itemData: [
            { label: '', key: 'imgUrl', type: 'image' },
            { label: '商品名称', key: 'skuName', type: 'text' },
            { label: 'ItemID', key: 'itemId', type: 'text' },
            { label: '在线SKU', key: 'sellerSku', type: 'text' },
            { label: '数量', key: 'productCount', type: 'text' },
            { label: '单价', key: 'originalPrice', type: 'money' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '抓单', key: 'firstGrabDate', type: 'text' },
            { label: '付款', key: 'payTime', type: 'text' },
            { label: '实际发货', key: 'deliveryTime', type: 'text' },
            { label: '标记', key: 'omsMarkDate', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '运费', key: 'buyerPaysFreight', type: 'text', currency: 'orderCurrency' },
            { label: '折扣金额', key: 'disCountAmount', type: 'text', currency: 'orderCurrency' },
            { label: '订单总金额', key: 'totalOrderAmount', type: 'text', currency: 'orderCurrency' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.searchAndStatus()
  },
  methods: {
    getStoreCodeList(resolve) { // 获取shopee的销售店铺
      getStoreByPlatform('sp').then(res => {
        resolve(res.data)
      })
    },
    getDicts(type, resolve) {
      getDicts(['plat_search_type', 'plat_order_type'], 'oms').then(res => {
        const data = type ? [{ label: '全部', value: '' }, ...res.plat_order_type] : res.plat_search_type
        this.orderTypeList = res.plat_order_type
        resolve(data)
      })
    },
    toOrderDetails({ platOrderId }) {
      this.$newPage({
        path: 'oms/platformOrders/shopee/details',
        data: { platOrderId }
      })
    },
    // 获取状态数量
    getOrderStatusList(data) {
      getCount(data).then(({ data: { total, UNPAID, READY_TO_SHIP, COMPLETED, IN_CANCEL, CANCELLED, TO_RETURN, MarkFailed } }) => {
        this.tabsList = [
          { name: 'All', total, label: `全部(${total})` },
          { name: 'UNPAID', total, label: `未到账(${UNPAID})` },
          { name: 'READY_TO_SHIP', total, label: `待发货(${READY_TO_SHIP})` },
          { name: 'COMPLETED', total, label: `已发货(${COMPLETED})` },
          { name: 'IN_CANCEL', total, label: `取消中(${IN_CANCEL})` },
          { name: 'CANCELLED', total, label: `已取消(${CANCELLED})` },
          { name: 'TO_RETURN', total, label: `待退货(${TO_RETURN})` },
          { name: 'MarkFailed', total, label: `标记失败(${MarkFailed})` }
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
      data.orderStatus = data.orderStatus === 'All' ? '' : data.orderStatus
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
    formatterType(type) {
      const list = this.orderTypeList
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === type) return list[i].label
      }
    },
    fetch({ current, size }, params) {
      return getListPage(Object.assign({ current, size }, params)).then(({ data: { records, total, size } }) => {
        const d = records.map(item => {
          item.ifPreSale = item.ifPreSale === 1 ? '是' : '否'
          item.ifCashOnOelivery = item.ifCashOnOelivery ? '是' : '否'
          item.orderType = this.formatterType(item.orderType)
          return item
        })
        return { records: d, total, size }
      })
    },
    reset(formName) {
      const { resetFields } = this.$refs[formName].ref
      resetFields()
      this.formData.searchType = '1'
      this.formData.searchContent = ''
      this.formData.orderStatus = 'All'
      this.$nextTick(() => {
        this.searchAndStatus()
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
        data: { platCode: 'sp', interfaceApi: batchGrabAndSync },
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
