<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" :dense="true" @selection-change="handleSelectionChange">
      <template slot="header">

        <formGroup ref="formRef" :model="formData" :gutter="10" class="form-col no-message" label-width="70px" :form-attrs="formAttrs">
          <el-form-item slot="btn" label-width="10px">
            <el-button type="primary" @click="searchAndStatus">搜索</el-button>
            <el-button @click="reset('formRef')">重置</el-button>
          </el-form-item>
        </formGroup>

        <el-row style="min-height: 30px;" class="position-relative">
          <el-tabs v-model="formData.orderStatusType" @tab-click="searchAndStatus">
            <el-tab-pane v-for="(item) in tabsList" :key="item.label" :label="item.label" :name="item.name" />
          </el-tabs>
          <el-row class="position-absolute top-0 end-0">
            <el-button v-if="$auth('oms_plat_wh_sync')" type="primary" size="mini" @click="batchGet">批量抓取同步</el-button>
            <el-button v-if="$auth('oms_plat_wh_export')" type="primary" size="mini" disabled>订单导出</el-button>
            <el-button v-if="$auth('oms_plat_wh_tag')" type="primary" size="mini" @click="batchSign">批量标记</el-button>
            <!-- <el-button v-if="$auth('oms_plat_wh_merge')" type="primary" size="mini" @click="manualOrder">手工合单</el-button> -->
          </el-row>
        </el-row>
      </template>

      <component :is="platItem[item.path]" v-for="(item,index) in pageConfig" :slot="item.path" :key="index" :arr-key="item.key" :item-data="item.itemData" :label-width="item.labelWidth" />
      <el-table-column v-if="$auth('oms_plat_wh_view', 'oms_plat_wh_sync', 'oms_plat_wh_tag')" slot="handler" label="操作" width="80">
        <template slot-scope="{row}">
          <template v-if="$auth('oms_plat_wh_view')">
            <el-button type="text" @click="toOrderDetails(row)">查看</el-button><br>
          </template>
          <template v-if="$auth('oms_plat_wh_sync')">
            <el-button type="text" @click="handlerSync(row)">手工同步</el-button><br>
          </template>
          <el-button v-if="$auth('oms_plat_wh_tag')" type="text" @click="handlerSign(row)">手工标记</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { whPage, countStatus, whSyn } from '@/api/platformOrder'
import { getStoreByPlatform } from '@/api/common.js'
import { getDicts } from '@/api/common/dict'
import platItem from '../../components/platItem/index.js'
import toLastMonthDate from '../mixins/toLastMonthDate.js'

import formGroup from '../../components/form-group/index.vue'
import manualSignModal from '../modal/manualSignModal.vue'
import batchSignModal from '../modal/batchSignModal.vue'
import manualModal from './modal/manualModal.vue'
import batchSynchroModal from './modal/batchSynchroModal.vue'

export default {
  name: 'OmsPlatformOrdersWishList',
  components: { formGroup },
  mixins: [toLastMonthDate],
  data() {
    return {
      formAttrs: [
        { label: '创建时间', prop: 'orderTime', type: 'datetimerange' },
        { label: '抓单时间', prop: 'firstGrabDate', type: 'datetimerange' },
        { label: '订单来源', prop: 'orderType', type: 'select', items: (resolve) => resolve(this.orderTypeList) },
        { label: '销售店铺', labelField: 'displayName', valueField: 'displayName', prop: 'storeNameListStr', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getStoreCodeList },

        { label: '重发订单', prop: 'isReReleased', type: 'select', items: [{ label: '全部', value: '' }, { label: '是', value: 1 }, { label: '否', value: 0 }] },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 10, items: (resolve) => this.getDicts(resolve) },
        { labelWidth: '0', prop: 'searchContent', type: 'GMultipleInput', attrs: { 'return-type': 'string', placeholder: '最大支持1000个，换行分割', regExp: /\n+/ }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
      formData: {
        orderTime: [],
        firstGrabDate: [],
        orderType: '',
        storeNameListStr: '',
        isReReleased: '',
        searchType: this.$route.params.searchType || '1',
        searchContent: this.$route.params.searchContent || '',
        orderStatusType: 'All'
      },
      orderTypeList: [
        { label: '全部', value: '' },
        { label: '线上订单', value: '0' },
        { label: '手工订单', value: '1' }
      ],
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
      manualList: [],
      pageConfig: [
        {
          path: 'storeInfo',
          itemData: [
            { label: '销售店铺', key: 'storeName', type: 'text', labelWidth: '60px' },
            { label: '订单来源', key: 'orderTypeStr', type: 'text', labelWidth: '60px' },
            { label: '收件人姓名', key: 'buyerName', type: 'text', labelWidth: '60px' },
            { label: '可重发订单', key: 'isReReleased', type: 'text', labelWidth: '60px' }
          ]
        },
        {
          path: 'orderInfo',
          itemData: [
            { label: '平台单号', key: 'platOrderId', type: 'copy', url: 'oms/platformOrders/wish/details' },
            { label: 'OMS单号', key: 'omOrderId', type: 'copy', url: 'oms/orderManagement/details' },
            { label: '平台订单状态', key: 'orderStatusStr', type: 'text' },
            { label: 'OMS订单状态', key: 'omOrderStatusStr', type: 'text' },
            { label: '标记跟踪号', key: 'trackingNumber', type: 'text' }
          ]
        },
        {
          path: 'productInfo',
          key: 'goodList',
          itemData: [
            { label: '', key: 'productImageUrl', type: 'image' },
            { label: '商品名称', key: 'productName', type: 'text' },
            { label: 'ItemID', key: 'productId', type: 'text' },
            { label: '在线SKU', key: 'sellerSku', type: 'text' },
            { label: '数量', key: 'quantity', type: 'text' },
            { label: '单价', key: 'price', type: 'money' },
            { label: 'SKU编码', key: 'pmsSkuBriefList', type: 'code' }
          ]
        },
        {
          path: 'timeInfo',
          itemData: [
            { label: '允许发货', key: 'releasedToMerchantTime', type: 'text' },
            { label: '抓单', key: 'firstGrabDate', type: 'text' },
            { label: '实际发货', key: 'deliverDate', type: 'text' },
            { label: '标记', key: 'omsMarkTime', type: 'text' }
          ]
        },
        {
          path: 'moneyInfo',
          itemData: [
            { label: '客付运费', key: 'freightChargesAmount', type: 'text' },
            { label: ' 订单总金额', key: 'orderAmountWithTax', type: 'text' }
          ],
          labelWidth: '60'
        }
      ],
      showIds: []
    }
  },
  mounted() {
    this.searchAndStatus()
  },
  methods: {
    handleSelectionChange(val) {
      this.manualList = []
      this.showIds = []
      val.forEach(item => {
        if (item.orderStatus === 'APPROVED') {
          this.manualList.push(item.id)
          this.showIds.push(item.platOrderId)
          this.manualList = [...new Set(this.manualList)]
          this.showIds = [...new Set(this.showIds)]
        }
      })
    },
    getStoreCodeList(resolve) { // 获取ebay的销售店铺
      getStoreByPlatform('WH').then(res => {
        this.storeList = res.data
        resolve(res.data)
      })
    },
    getDicts(resolve) {
      getDicts(['wh_plat_order_search_type', 'plat_order_type'], 'oms').then(res => {
        const data = res.wh_plat_order_search_type
        resolve(data)
      })
    },
    handlerSign(row) {
      this.$modal({
        title: '手工标记',
        width: '36%',
        component: manualSignModal,
        data: { platformCode: 'WH', platOrderId: row.platOrderId },
        callback: (bool) => {
        }
      })
    },
    toOrderDetails({ platOrderId }) {
      this.$newPage({
        path: 'oms/platformOrders/wish/details',
        data: { platOrderId }
      })
    },
    // 获取状态数量
    getOrderStatusList(data) {
      countStatus({ data }).then(({ data: { total, requireReview, approved, shipped, markFailed, refunded } }) => {
        this.tabsList = [
          { name: 'All', total, label: `全部(${total})` },
          { name: 'REQUIRE_REVIEW', total, label: `平台审核中(${requireReview})` },
          { name: 'APPROVED', total, label: `待发货(${approved})` },
          { name: 'SHIPPED', total, label: `已发货(${shipped})` },
          { name: 'REFUNDED', total, label: `已取消(${refunded})` },
          { name: 'MARK_FAILED', total, label: `标记失败(${markFailed})` }
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
      data.orderStatusType = data.orderStatusType === 'All' ? '' : data.orderStatusType
      data.orderTimeStart = orderTime[0] || ''
      data.orderTimeEnd = orderTime[1] || ''
      data.firstGrabDateStart = firstGrabDate[0] || ''
      data.firstGrabDateEnd = firstGrabDate[1] || ''
      delete data.orderTime
      delete data.firstGrabDate
      return data
    },
    search(data, page = 1) {
      this.$refs.table.load(page, { data: data })
    },
    fetch({ current, size }, data) {
      return whPage(Object.assign({ query: { current, size }, ...data })).then(({ data: { records, total, size } }) => {
        const d = records.map(item => {
          item.isReReleased = item.isReReleased !== '' ? ['否', '是'][item.isReReleased] : item.isReReleased
          return item
        })
        return { records: d, total, size }
      })
    },
    reset(formName) {
      const { resetFields } = this.$refs[formName].ref
      resetFields()
      this.formData.orderStatusType = 'All'
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
        data: { platformCode: 'WH' },
        callback: (bool) => {
        }
      })
    },
    handlerSync({ id }) {
      this.$confirm('确定要同步吗?', '提示', { type: 'warning' }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '手工同步中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        whSyn(id).then(res => {
          this.$message.success(res.msg)
        }).finally(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    manualOrder() {
      const { manualList, showIds } = this
      if (manualList.length < 2) {
        this.$message.warning('请先选择待发货的订单，再进行订单的合并')
        return
      }
      this.$modal(
        {
          title: '手工合单',
          component: manualModal,
          width: '30%',
          top: '20%',
          data: { manualList, showIds },
          callback: (type) => {
            if (type) {
              this.searchAndStatus()
              this.manualList = []
              this.showIds = []
            }
          }
        }
      )
    },
    batchGet() {
      const { storeList } = this
      this.$modal({
        title: '订单批量抓取与同步',
        width: '36%',
        component: batchSynchroModal,
        data: { storeList },
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
