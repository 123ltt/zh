<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" :dense="true">
      <template slot="header">
        <formGroup ref="formRef" :gutter="10" class="form-col no-message" :model="formData" label-width="70px" :form-attrs="formAttrs">
          <el-form-item slot="btn" label-width="10px">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="reset('formRef')">重置</el-button>
          </el-form-item>
        </formGroup>
        <el-row class="position-relative">
          <el-tabs v-model="formData.orderStatus" @tab-click="search">
            <el-tab-pane v-for="(item) in tabsList" :key="item.label" :label="item.label" :name="item.name" />
          </el-tabs>
          <el-row class="position-absolute top-0 end-0">
            <el-button v-if="$auth('oms_plat_am_sync')" type="primary" size="mini" @click="batchGet">批量抓取同步</el-button>
            <el-button v-if="$auth('oms_plat_am_tag')" type="primary" size="mini" @click="batchSign">批量标记</el-button>
          </el-row>
        </el-row>
      </template>
      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" />
      <el-table-column v-if="$auth('oms_plat_am_view', 'oms_plat_am_sync', 'oms_plat_am_tag')" slot="handler" label="操作" width="80">
        <template slot-scope="scope">
          <template v-if="$auth('oms_plat_am_view')">
            <el-button type="text" @click="toOrderDetails({platOrderId:scope.row.platOrderId})">查看</el-button><br>
          </template>
          <template v-if="$auth('oms_plat_am_sync')">
            <el-button type="text" @click="handlerSynchro(scope.row.id)">手工同步</el-button><br>
          </template>
          <el-button v-if="$auth('oms_plat_am_tag')&&showSign(scope.row.fulfillmentChannel,scope.row.orderStatus)" type="text" @click="handlerSign(scope.row)">手工标记</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getDicts } from '@/api/common/dict'
import { siteOption, page, count, amplatorderSyn } from '@/api/platformOrder'
import { getStoreByPlatform } from '@/api/common.js'
import platItem from '../../components/platItem/index.js'
import toLastMonthDate from '../mixins/toLastMonthDate.js'

import formGroup from '../../components/form-group/index.vue'
import batchSynchroModal from './modal/batchSynchroModal.vue'
import batchSignModal from '../modal/batchSignModal.vue'
import manualSignModal from '../modal/manualSignModal.vue'
export default {
  name: 'OmsPlatformOrdersAmazonList',
  components: { formGroup },
  mixins: [toLastMonthDate],
  data() {
    return {
      formAttrs: [
        { label: '付款时间', prop: 'getOrderTime', type: 'datetimerange', attrs: { valueFormat: 'yyyy-MM-dd HH:mm:ss' } },
        { label: '抓单时间', prop: 'firstGrabDate', type: 'datetimerange', attrs: { valueFormat: 'yyyy-MM-dd HH:mm:ss' } },
        {
          label: '订单来源',
          prop: 'orderType',
          type: 'select',
          items: [
            { label: '全部', value: '' },
            { label: '线上订单', value: 0 },
            { label: '手工订单', value: 1 }
          ]
        },
        {
          label: '销售店铺',
          prop: 'storeName',
          type: 'select',
          labelField: 'displayName',
          valueField: 'displayName',
          items: (resolve) => { this.getStoreByPlatform(resolve) },
          attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }
        },
        { label: '发货类型', prop: 'fulfillmentChannel', type: 'radio', items: (resolve) => { this.getDict(resolve, 0) }, span: 6 },
        { label: '搜索类型', prop: 'searchType', type: 'radio', items: (resolve) => { return this.getDict(resolve, 1) }, span: 10 },
        { labelWidth: '0', prop: 'searchContent', attrs: { returnType: 'string', placeholder: '最大支持1000个，换行分割' }, type: 'GMultipleInput', span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        storeName: [],
        platformCode: 'AM',
        fulfillmentChannel: 'MFN',
        searchType: '',
        searchContent: '',
        orderStatus: '0',
        orderType: '',
        getOrderTime: '',
        firstGrabDate: ''
      },
      platItem: platItem,
      orderTypeList: [
        { label: '全部', value: '' },
        { label: '线上订单', value: '0' },
        { label: '手工订单', value: '1' }
      ],
      headers: [
        { type: 'selection', width: 45 },
        { slot: true, slotName: 'storeInfo' },
        { slot: true, slotName: 'orderInfo' },
        { slot: true, slotName: 'productInfo' },
        { slot: true, slotName: 'timeInfo' },
        { slot: true, slotName: 'moneyInfo' },
        { slot: true, slotName: 'handler' }
      ],
      siteOption: [],
      tabsList: [],
      pageConfig: [
        {
          path: 'storeInfo',
          itemData: [
            { label: '销售站点', key: 'siteCode', type: 'text' },
            { label: '销售店铺', key: 'storeName', type: 'text' },
            { label: '订单来源', key: 'orderType', type: 'judeg' },
            { label: '买家账号', key: 'buyerName', type: 'text' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: 'platOrderId', type: 'copy', url: 'oms/platformOrders/amazon/details' },
            { label: 'OMS单号', key: 'omOrderId', type: 'copy', url: 'oms/orderManagement/details' },
            { label: '平台订单状态', key: 'orderStatus', type: 'text' },
            { label: 'OMS订单状态', key: 'omOrderStatus', type: 'text' },
            { label: '标记跟踪号', key: 'trackingNumber', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goods',
          itemData: [
            { label: '', key: 'imageUrl', type: 'image' },
            { label: 'ItemID', key: 'orderItemId', type: 'text' },
            { label: '在线SKU', key: 'sellerSku', type: 'text' },
            { label: 'ASIN', key: 'asin', type: 'text' },
            { label: '数量', key: 'quantityOrdered', type: 'text' },
            { label: '单价', key: 'itemPrice', type: 'money' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '抓单', key: 'firstGrabDate', type: 'text' },
            { label: '付款', key: 'orderTime', type: 'text' },
            { label: '实际发货', key: 'deliverDate', type: 'text' },
            { label: '标记', key: 'omsMarkDate', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '运费', key: 'freightChargesAmount', type: 'text' },
            { label: '折扣金额', key: 'promotionDiscountTotal', type: 'text' },
            { label: '订单总金额', key: 'orderTotal', type: 'text' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.formData.searchType = this.$route.params.searchType || '1'
    this.formData.searchContent = this.$route.params.searchContent || ''
    this.getSiteOption()
    this.search()
  },
  methods: {
    getStoreByPlatform(resolve) {
      getStoreByPlatform('AM').then(res => {
        resolve(res.data)
      })
    },
    getDict(resolve, key) {
      return getDicts(['am_fulfillment_channel', 'am_plat_order_search_type'], 'oms').then(res => {
        this.$nextTick(this.$refs.table.updateTableHeight)
        resolve(key ? res.am_plat_order_search_type : res.am_fulfillment_channel)
      })
    },
    // 获取状态数量
    getOrderStatusList() {
      count(this.row).then(res => {
        this.tabsList = [
          { name: '0', total: res.data.total, label: `全部(${res.data.total})` },
          { name: 'Pending', total: res.data.total, label: `待付款(${res.data.Pending})` },
          { name: 'Unshipped', total: res.data.total, label: `待发货(${res.data.Unshipped})` },
          { name: 'Shipped', total: res.data.total, label: `已发货(${res.data.Shipped})` },
          { name: 'Canceled', total: res.data.total, label: `已取消(${res.data.Canceled})` }
        ]
      })
    },
    // 获取数据
    getData() {
      const params = Object.assign({}, this.formData)
      const sc = params.searchContent.match(/[^,]+/g) || []
      if (sc.length > 1000) return this.$message.error('超过1000个')
      params.orderTimeStart = (this.formData.getOrderTime && this.formData.getOrderTime[0]) || ''
      params.orderTimeEnd = (this.formData.getOrderTime && this.formData.getOrderTime[1]) || ''
      params.firstGrabDateStart = (this.formData.firstGrabDate && this.formData.firstGrabDate[0]) || ''
      params.firstGrabDateEnd = (this.formData.firstGrabDate && this.formData.firstGrabDate[1]) || ''
      params.storeName = params.storeName.join(',')
      delete params.firstGrabDate
      delete params.getOrderTime
      this.row = params
      this.$refs.table.load(1, params)
    },
    getSiteOption() {
      siteOption({ platformCode: this.formData.platformCode }).then(res => {
        this.siteOption = res.data
      })
    },
    fetch({ current, size }, params) {
      return page(Object.assign({ current, size }, params)).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    showSign(a, b) {
      return a !== 'AFN' && b !== '待付款' && b !== '已取消'
    },
    // 查看订单详情
    toOrderDetails(row) {
      const toUrl = {
        platOrderId: 'oms/platformOrders/amazon/details',
        omOrderId: 'oms/orderManagement/details'
      }
      const keyName = Object.keys(row)[0]
      this.$newPage({
        path: toUrl[keyName],
        data: row
      })
    },
    handlerSynchro(id) {
      this.$confirm('确定要同步吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '手工同步中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        amplatorderSyn(id).then(res => {
          if (res.success) {
            loading.close()
            this.$message.success('手工同步成功！')
          }
        })
      }).catch(() => {
      })
    },
    handlerSign(row) {
      this.$modal({
        title: '手工标记',
        width: '36%',
        component: manualSignModal,
        data: { platformCode: 'AM', platOrderId: row.platOrderId },
        callback: (bool) => {
          bool && this.search()
        }
      })
    },
    reset(formName) {
      this.$refs[formName].ref.resetFields()
      this.search()
    },
    search() {
      this.getData()
      this.getOrderStatusList()
    },
    batchGet() {
      const { siteOption } = this
      this.$modal({
        title: '订单批量抓取与同步',
        width: '36%',
        component: batchSynchroModal,
        data: { siteOption, type: 'amazon' },
        callback: (bool) => {
          bool && this.search()
        }
      })
    },
    batchSign() {
      this.$modal({
        title: '批量标记',
        width: '36%',
        component: batchSignModal,
        data: { platformCode: 'AM' },
        callback: (bool) => {
          bool && this.search()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.width-100{
  width: 100% !important;
}
.data-picker{
  width: 350px;
}
::v-deep .el-radio{
  margin-right: 15px;
}
</style>
