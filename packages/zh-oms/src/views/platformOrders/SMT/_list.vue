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
        <el-row style="min-height: 30px;" class="position-relative">
          <el-tabs v-model="formData.orderStatus" @tab-click="search">
            <el-tab-pane v-for="(item) in tabsList" :key="item.label" :label="item.label" :name="item.name" />
          </el-tabs>
          <el-row class="position-absolute top-0 end-0">
            <el-button v-if="$auth('oms_plat_sm_sync')" type="primary" size="mini" @click="batchGet">批量抓取同步</el-button>
            <el-button v-if="$auth('oms_plat_sm_tag')" type="primary" size="mini" @click="batchSign">批量标记</el-button>
          </el-row>
        </el-row>
      </template>
      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" />
      <el-table-column v-if="$auth('oms_plat_sm_view', 'oms_plat_sm_sync', 'oms_plat_sm_tag')" slot="handler" label="操作" width="80">
        <template slot-scope="scope">
          <template v-if="$auth('oms_plat_sm_view')">
            <el-button type="text" @click="toOrderDetails({platOrderId:scope.row.platOrderId})">查看</el-button><br>
          </template>
          <template v-if="$auth('oms_plat_sm_sync')">
            <el-button type="text" @click="handlerSynchro(scope.row)">手工同步</el-button><br>
          </template>
          <el-button v-if="$auth('oms_plat_sm_tag')" type="text" @click="handlerSign(scope.row)">手工标记</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { smtPage, smtCount, smtSync } from '@/api/platformOrder'
import { getStoreByPlatform } from '@/api/common.js'
import { getDicts } from '@/api/common/dict'
import platItem from '../../components/platItem/index.js'
import toLastMonthDate from '../mixins/toLastMonthDate.js'

import formGroup from '../../components/form-group/index.vue'
import manualSignModal from '../modal/manualSignModal.vue'
import batchSignModal from '../modal/batchSignModal.vue'
import batchSynchroModal from '../modal/batchSynchroModal.vue'
export default {
  name: 'OmsPlatformOrdersSMTList',
  components: { formGroup },
  mixins: [toLastMonthDate],
  data() {
    return {
      formAttrs: [
        { label: '付款时间', prop: 'payTime', type: 'datetimerange', attrs: { valueFormat: 'yyyy-MM-dd HH:mm:ss' } },
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
          attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true },
          labelField: 'displayName',
          valueField: 'displayName',
          items: (resolve) => { this.getStoreByPlatform(resolve) }
        },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 8, items: (resolve) => this.getDict(resolve) },
        { labelWidth: '0', prop: 'searchContent', type: 'GMultipleInput', attrs: { returnType: 'string', placeholder: '最大支持1000个，换行分割' }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        storeName: [],
        searchType: '',
        searchContent: '',
        orderStatus: '0',
        firstGrabDate: '',
        payTime: '',
        orderType: '',
        platformCode: 'SM'
      },
      platItem: platItem,
      orderTypeList: [
        { label: '全部', value: '' },
        { label: '线上订单', value: 0 },
        { label: '手工订单', value: 1 }
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
            { label: '销售店铺', key: 'storeName', type: 'text' },
            { label: '订单来源', key: 'orderType', type: 'judeg' },
            { label: '收件国家', key: 'countryName', type: 'text' },
            { label: '买家账号', key: 'buyerLoginId', type: 'text' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: 'platOrderId', type: 'copy', url: 'oms/platformOrders/SMT/details' },
            { label: 'OMS单号', key: 'omOrderId', type: 'copy', url: 'oms/orderManagement/details' },
            { label: '平台订单状态', key: 'orderStatus', type: 'text' },
            { label: 'OMS订单状态', key: 'omOrderStatus', type: 'text' },
            { label: '标记跟踪号1', key: 'trackingNumber1', type: 'text' },
            { label: '标记跟踪号2', key: 'trackingNumber2', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goods',
          itemData: [
            { label: '', key: 'productImgUrl', type: 'image' },
            { label: '商品名称', key: 'productName', type: 'text' },
            { label: 'ItemID', key: 'productId', type: 'text' },
            { label: '在线SKU', key: 'sellerSku', type: 'text' },
            { label: '数量', key: 'productCount', type: 'text' },
            { label: '单价', key: 'productUnitPrice', type: 'money' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '抓单', key: 'firstGrabDate', type: 'text' },
            { label: '付款', key: 'payTime', type: 'text' },
            { label: '实际发货', key: 'deliverDate', type: 'text' },
            { label: '标记', key: 'omsMarkDate', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '运费', key: 'freightChargesAmount', type: 'text' },
            { label: '折扣金额', key: 'promotionDiscountTotal', type: 'text' },
            { label: '订单总金额', key: 'orderAmount', type: 'text' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.formData.searchType = this.$route.params.searchType || '1'
    this.formData.searchContent = this.$route.params.searchContent || ''
    this.search()
  },
  methods: {
    getStoreByPlatform(resolve) {
      getStoreByPlatform('SM').then(res => {
        resolve(res.data)
      })
    },
    getDict(resolve) {
      getDicts(['sm_plat_order_search_type'], 'oms').then(res => {
        this.$nextTick(this.$refs.table.updateTableHeight)
        resolve(res.sm_plat_order_search_type)
      })
    },
    // 获取状态数量
    getOrderStatusList() {
      smtCount(this.row).then(res => {
        this.tabsList = [
          { name: '0', total: res.data.total, label: `全部(${res.data.total})` },
          { name: 'PLACE_ORDER_SUCCESS', total: res.data.total, label: `待付款(${res.data.PLACE_ORDER_SUCCESS})` },
          { name: 'IN_CANCEL', total: res.data.total, label: `取消中(${res.data.IN_CANCEL})` },
          { name: 'WAIT_SELLER_SEND_GOODS', total: res.data.total, label: `待发货(${res.data.WAIT_SELLER_SEND_GOODS})` },
          { name: 'SELLER_PART_SEND_GOODS', total: res.data.total, label: `部分发货(${res.data.SELLER_PART_SEND_GOODS})` },
          { name: 'WAIT_BUYER_ACCEPT_GOODS', total: res.data.total, label: `已发货(${res.data.WAIT_BUYER_ACCEPT_GOODS})` },
          { name: 'FUND_PROCESSING', total: res.data.total, label: `已取消(${res.data.FUND_PROCESSING})` }
        ]
      })
    },
    // 获取数据
    getData() {
      const params = Object.assign({}, this.formData)
      const sc = params.searchContent.match(/[^,]+/g) || []
      if (sc.length > 1000) return this.$message.error('超过1000个')
      params.orderTimeStart = (this.formData.payTime && this.formData.payTime[0]) || ''
      params.orderTimeEnd = (this.formData.payTime && this.formData.payTime[1]) || ''
      params.firstGrabDateStart = (this.formData.firstGrabDate && this.formData.firstGrabDate[0]) || ''
      params.firstGrabDateEnd = (this.formData.firstGrabDate && this.formData.firstGrabDate[1]) || ''
      params.storeName = params.storeName.join(',')
      delete params.payTime
      delete params.firstGrabDate
      this.row = params
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return smtPage(Object.assign({ current, size }, params)).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    batchSign() {
      this.$modal({
        title: '批量标记',
        width: '36%',
        component: batchSignModal,
        data: { platformCode: 'SM' },
        callback: (bool) => {
          bool && this.search()
        }
      })
    },
    handlerSign(row) {
      this.$modal({
        title: '手工标记',
        width: '36%',
        component: manualSignModal,
        data: { platformCode: 'SM', platOrderId: row.platOrderId },
        callback: (bool) => {
          bool && this.search()
        }
      })
    },
    // 查看订单详情
    toOrderDetails(row) {
      const toUrl = {
        platOrderId: 'oms/platformOrders/SMT/details',
        omOrderId: 'oms/orderManagement/details'
      }
      const keyName = Object.keys(row)[0]
      this.$newPage({
        path: toUrl[keyName],
        data: row
      })
    },
    handlerSynchro(row) {
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
        const params = {
          storeCode: row.storeCode,
          orderIds: [row.platOrderId]
        }
        smtSync(params).then(res => {
          if (res.success) {
            loading.close()
            this.$message.success('手工同步成功！')
          }
        })
      }).catch(() => {
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
      this.$modal({
        title: '订单批量抓取与同步',
        width: '36%',
        component: batchSynchroModal,
        data: {
          platCode: 'SM',
          type: 'smt',
          params: { store: 'storeCode', st: 'createTimeStart', et: 'createTimeEnd', ust: 'updateTimeStart', uet: 'updateTimeEnd' },
          interfaceApi: smtSync
        },
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
