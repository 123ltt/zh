<template>
  <g-table ref="table"
           row-key="id"
           :headers="headers"
           :fetch="fetch"
           :dense="true"
           @selection-change="checkedHandler"
  >
    <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
    <template slot="header">
      <Search ref="search" :search="search" :order-type="orderType" :update-table-height="updateTableHeight" />
    </template>
    <el-table-column slot="slotOrder" label="单号" width="230">
      <div slot-scope="{row:{packageCode,platOrderId,omOrderId,platformCode},$index}" @mouseover="()=>{isActive = $index}" @mouseleave="()=>{isActive = -1}">
        <g-list-group label-width="30px" label-align="center">
          <g-list-group-item label="包裹">
            <Copy :id="packageCode" :index="$index" :active="isActive" />
          </g-list-group-item>
          <g-list-group-item label="OMS">
            <Copy :id="omOrderId" :cursor="true" :index="$index" :active="isActive" @toDetails="toDetails({omOrderId})" />
          </g-list-group-item>
          <g-list-group-item label="平台">
            <div class="d-flex">
              <Copy :id="platOrderId&&platOrderId[0]" :cursor="true" :index="$index" :active="isActive" @toDetails="toDetails({platOrderId,platformCode})" />
              <CombineOrder v-if="platOrderId&&platOrderId.length>1" :orders="platOrderId" :is-copy="true" :is-link="true" @toDetails="(v)=>toDetail(v,platformCode)" />
            </div>
          </g-list-group-item>
        </g-list-group>
      </div>
    </el-table-column>
    <el-table-column slot="slotPlatform" label="平台">
      <template slot-scope="{row:{platform,storeName,receiveCountry,receiveFullName}}">
        <g-list-group label-align="center">
          <g-list-group-item label="销售平台">
            <g-text-ellipsis>{{ platform }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="销售店铺">
            <g-text-ellipsis>{{ storeName }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="收件国家">{{ receiveCountry }}</g-list-group-item>
          <g-list-group-item label="收件人">
            <g-text-ellipsis>{{ receiveFullName }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>
    <el-table-column slot="slotLogistics" label="物流" :width="orderType!=='all'||orderType!=='audit'?'auto':'150'">
      <template slot-scope="{row:{channelCode,channelName,warehouseName,ifOnlineChannel}}">
        <g-list-group label-align="center">
          <g-list-group-item label="渠道类型">
            <g-text-ellipsis>{{ ['', '线上渠道', '线下渠道'][ifOnlineChannel] }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="物流渠道">
            <g-text-ellipsis>{{ getChannelFullName(channelName,channelCode) }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="发货仓库">
            <g-text-ellipsis>{{ warehouseName }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>
    <el-table-column slot="slotTime" label="时间">
      <template slot-scope="{row:{firstGrabTime,payTime,exceptionCreateTime,oosInTime,deliveryDeadline}}">
        <g-list-group label-align="center">
          <g-list-group-item label="抓单">
            <g-text-ellipsis>{{ firstGrabTime }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="付款">
            <g-text-ellipsis>{{ payTime }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item v-if="itemShow(['scarceGoods','abnormal'])" label="最晚发货">
            <g-text-ellipsis>{{ deliveryDeadline }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item v-if="itemShow(['scarceGoods'])" label="缺货时长"><span class="text-danger">{{ computeTime(oosInTime) }}</span></g-list-group-item>
          <g-list-group-item v-if="itemShow(['abnormal'])" label="异常停留"> <span class="text-danger">{{ computeTime(exceptionCreateTime) }}</span></g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>
    <el-table-column v-if="itemShow(['all','audit','delivery'])" slot="slotCost" label="费用" min-width="115">
      <template slot-scope="{row:{orderAmount,trialFreightCost,grossWeightTotal,trialProfit,actualFreightCost,weight,actualProfit}}">
        <g-list-group label-align="center" label-width="100px">
          <g-list-group-item label="订单总金额(除税)">
            <g-text-ellipsis>
              {{ 'USD '+ Number(orderAmount).toFixed(2) }}
            </g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item :label="orderType==='delivery'?'出库运费成本':'试算运费成本'">
            <g-text-ellipsis>
              {{ 'RMB '+ Number(orderType==='delivery'?actualFreightCost:trialFreightCost).toFixed(2) }}
            </g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item :label="orderType==='delivery'?'出库包裹利润':'试算包裹利润'">
            <g-text-ellipsis>
              <span v-if="orderType!=='delivery'" :class="Number(trialProfit)<0?'text-danger':''"> {{ 'RMB '+ Number(trialProfit).toFixed(2) }}</span>
              <span v-else :class="Number(actualProfit)<0?'text-danger':''"> {{ 'RMB '+ Number(actualProfit).toFixed(2) }}</span>
            </g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item :label="orderType==='delivery'?'出库重量(g)':'试算重量(g)'">
            <g-text-ellipsis>
              {{ Number(orderType==='delivery'?weight:grossWeightTotal).toFixed(2) }}
            </g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>
    <el-table-column v-if="itemShow(['delivery','returnGoods'])" slot="slotIntercept" :label="orderType==='delivery'?'拦截原因':'退货原因'" min-width="115">
      <template slot-scope="{row:{exceptionMsg}}">
        <g-text-ellipsis>
          {{ exceptionMsg }}
        </g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column v-if="itemShow(['all','audit'])" slot="slotPacktype" label="包裹类型" width="100">
      <template slot-scope="{row:{ifProfit,packageStatus}}">
        <g-list-group label-align="center">
          <g-list-group-item label="负利润">
            <span :class="ifProfit?'text-danger':''">{{ ifProfit?'是':'否' }}</span>
          </g-list-group-item>
          <g-list-group-item label="渠道异常">{{ packageStatus===3?"是":"否" }}</g-list-group-item>
          <g-list-group-item label="缺货">{{ packageStatus===5?"是":"否" }}</g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>
    <el-table-column slot="slotStatus" label="状态" :width="orderType==='all'||orderType==='audit'?140:'auto'">
      <template slot-scope="{row:{wmsStatus,platOrderStatus,packageStatusName,channelExceptionType,channelGetStatus}}">
        <g-list-group label-align="center">
          <g-list-group-item label="平台">
            <g-text-ellipsis>
              {{ platOrderStatus }}
            </g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="订单包裹">
            <g-text-ellipsis>
              {{ packageStatusName }}
            </g-text-ellipsis>
          </g-list-group-item>
          <template v-if="itemShow(['all'])">
            <g-list-group-item label="仓库包裹">{{ wmsStatus }}</g-list-group-item>
            <g-list-group-item label="轨迹">{{ "" }}</g-list-group-item>
          </template>
          <template v-if="itemShow(['abnormal'])">
            <g-list-group-item label="异常类型">{{ getExceptionType(channelExceptionType) }}</g-list-group-item>
            <g-list-group-item label="物流信息">{{ getStatus(channelGetStatus) }}</g-list-group-item>
          </template>
        </g-list-group>
      </template>
    </el-table-column>
    <template v-if="itemShow(['scarceGoods'])">
      <el-table-column slot="slotLackSKU" label="缺货SKU内容" width="130">
        <template slot-scope="{row:{outOfStockSkuList}}">
          <div v-for="item in (outOfStockSkuList||[]).slice(0,(outOfStockSkuList||[]).length>4?3:4)" :key="item.sku">{{ item.sku }}：-{{ item.lackNum }}</div>
          <el-popover
            v-if="(outOfStockSkuList||[]).length>4"
            placement="right"
            width="150"
            trigger="hover"
          >
            <div style="max-height: 400px; overflow-y: auto;">
              <div v-for="item in outOfStockSkuList" :key="item.sku">{{ item.sku }}：{{ item.lackNum }}</div>
            </div>
            <span slot="reference" class="text-primary" style="cursor: default;">更多</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column slot="slotPriority" label="发货优先级" width="130">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.deliveryPriority" size="mini" :disabled="true" class="w-100" controls-position="right" :min="1" :max="99" />
        </template>
      </el-table-column>
    </template>

    <el-table-column v-if="itemShow(['abnormal'])" slot="slotReason" label="原因" width="100">
      <template slot-scope="scope">
        <g-text-ellipsis :lines="4">{{ scope.row.exceptionMsg }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" width="70">
      <template slot-scope="{row}">
        <el-button v-if="$auth('oms_pack_detail')" type="text" @click="showDetails(row.packageCode)">详情</el-button>
        <BtnsMenu v-if="handlerShow(row.buttonInfo,row)" name="操作" type="text" :menus="getMenus(row)" />
      </template>
    </el-table-column>
    <template slot="footer-left">
      <BtnsMenu name="批量操作" type="primary" :disabled="checkedCRData.length===0" :menus="getBatchMenus()" />
    </template>
  </g-table>
</template>

<script>
import { exceptionAudit, batchRemark } from '@/api/orderManagement'
import { packpage, againForecast } from '@/api/packOrders'
import { getPackageDetails } from '@/api/packageDetails'
import platPaths from '@/api/platPaths.js'

import CombineOrder from '../../components/combine-order/index.vue'
import cancelOrderModal from '../../components/details-tab/modal/cancelOrRecovery.vue'
import channel from '../../components/details-tab/modal/channel.vue'
import Copy from '../../components/copy'
import BtnsMenu from '../../components/btns-menu.vue'
import Search from './search'
import splitpackModal from '../modal/splitpackModal.vue'
import SubmitAudit from '@/views/components/details-tab/modal/submitAudit.vue'
import VBatchRemark from 'zh-pms/src/views/batchRemark.vue'
import postmsgModal from '../modal/postmsgModal.vue'
export default {
  components: { Search, Copy, CombineOrder, BtnsMenu },
  props: {
    orderType: String
  },
  data() {
    return {
      isActive: -1,
      headers: [
        { type: 'selection', width: 50 },
        { slot: true, slotName: 'slotOrder' },
        { slot: true, slotName: 'slotPlatform' },
        { slot: true, slotName: 'slotLogistics' },
        { slot: true, slotName: 'slotTime' },
        { slot: true, slotName: 'slotCost' },
        { slot: true, slotName: 'slotPacktype' },
        { slot: true, slotName: 'slotStatus' },
        { slot: true, slotName: 'slotIntercept' },
        { slot: true, slotName: 'slotLackSKU' },
        { slot: true, slotName: 'slotPriority' },
        { slot: true, slotName: 'slotReason' },
        { slot: true, slotName: 'handler' }
      ],
      checkedRemarkIds: [],
      checkedAuditIds: [],
      checkedPackageStatus: [],
      checkedCRData: [],
      checkPostId: [],
      fullNameList: [],
      paramsList: [],
      checkedPackCodes: [],
      batchBtns: {
        audit: true,
        cancelOrder: true,
        recoverOrder: true,
        shipIntercept: true,
        postMsg: true,
        reForecast: true
      }

    }
  },
  methods: {
    isAuditAuth(exceptionType, packageStatus) {
      if (this.orderType === 'all' && packageStatus === 13) {
        return this.$auth('btn_pkg_intercept_audit')
      }
      const auditCode = {
        delivery: 'btn_pkg_intercept_audit',
        returnGoods: 'btn_pkg_return_audit'
      }[this.orderType] || 'btn_pkg_audit_' + exceptionType
      return this.$auth(auditCode)
    },
    getChannelFullName(name, code) {
      const c = code ? `(${code})` : ''
      return (name || '') + c
    },
    checkedHandler(data) {
      this.checkedRemarkIds = []
      this.checkedAuditIds = []
      this.checkedPackageStatus = []
      this.checkedOutIds = []
      this.checkedCRData = []
      this.checkPostId = []
      this.fullNameList = []
      this.paramsList = []
      this.checkedPackCodes = []

      const btns = []
      const KEYS = Object.keys(this.batchBtns)
      const originObj = {
        cancelOrder: this.$auth('oms_pack_cancel'),
        recoverOrder: this.$auth('oms_pack_recover'),
        shipIntercept: this.$auth('oms_pack_intercept'),
        postMsg: this.$auth('oms_pack_postMsg'),
        reForecast: this.$auth('oms_pack_reForecast')
      }

      data.forEach(({ id, omOrderId, packageCode, exceptionType, platOrderId, buttonInfo, packageStatus, receiveFullName, storeName, trackCode1, deliveryTime, platform }) => {
        this.checkedRemarkIds.push(`${id},${packageCode}`)
        this.checkedAuditIds.push({ omOrderId, packageCode, exceptionType })
        this.checkedPackageStatus.push(packageStatus)
        this.checkedOutIds.push({ omOrderId, packageCode, ifPass: 0, remarks: '' })
        this.checkedCRData.push({ omOrderId, platOrderId, packageCode })
        this.checkPostId.push(packageCode)
        this.fullNameList.push(`(${platOrderId.join(',')})${receiveFullName}`)
        this.paramsList.push({ sellerId: storeName, trackCode: trackCode1, deliveryTime })
        this.checkedPackCodes.push(packageCode)

        const audit = this.isAuditAuth(exceptionType, packageStatus)
        const obj = Object.assign({ audit }, originObj)
        const isPostMsg = platform !== 'ebay'
        if (isPostMsg) obj.postMsg = false
        // 收集每一行的按钮权限
        btns.push(merge(buttonInfo, obj))
      })

      filterBtn(this.batchBtns)
      // filter true buttons
      function filterBtn(target) {
        const obj = KEYS.reduce((obj, curKey) => {
          obj[curKey] = btns.every(btn => btn[curKey])
          return obj
        }, {})
        Object.assign(target, obj)
      }

      // 合并布尔值对象，同true为true，否则为false
      function merge(obj1, obj2) {
        return KEYS.reduce((obj, key) => Object.assign(obj, { [key]: obj1[key] && obj2[key] })
          , {})
      }
    },
    // 批量操作
    getBatchMenus() {
      const {
        // events
        batchRemark, handleAudit, CancelOrRecovery, handleShipIntercept, handleReForecast,

        // attrs
        batchBtns: { audit, cancelOrder, recoverOrder, shipIntercept, postMsg, reForecast }, checkedCRData, checkedOutIds, handlepostMsg, checkedPackCodes
      } = this
      const { isShowAudit } = this.dealPackageStatus()// 是否是统一包裹状态的

      return [
        { name: '批量备注', show: true, event: () => batchRemark() },
        { name: '批量审核', show: isShowAudit && audit, event: () => handleAudit() },
        { name: '批量撤单', show: cancelOrder, event: () => CancelOrRecovery('cancelpackage', checkedCRData, '批量撤单') },
        { name: '批量恢复撤单', show: recoverOrder, event: () => CancelOrRecovery('recoverypackage', checkedCRData, '批量恢复撤单') },
        { name: '批量出库拦截', show: shipIntercept, event: () => handleShipIntercept(checkedOutIds, '确定要批量出库拦截？') },
        { name: '批量发送站内信', show: postMsg, event: () => handlepostMsg() },
        { name: '批量重新预报', show: reForecast, event: () => handleReForecast(checkedPackCodes) }
      ]
    },
    // 单一操作
    getMenus({ buttonInfo, packageCode, omOrderId, platOrderId, packageStatus, exceptionType, warehouseCode, receiveCountryCode, platformCode, receiveFullName, platform, storeName, trackCode1, deliveryTime }) {
      // attrs
      const { audit, cancelOrder, recoverOrder, shipIntercept, changeChannel, updateAddress, packageSplit, saveOrUpdateGood, changeWarehouse, reForecast } = buttonInfo
      const crData = [{ omOrderId, packageCode, platOrderId }]
      // 恢复订单、撤单恢复按钮
      const isRecover = this.$auth('oms_pack_recover') && recoverOrder
      // 撤销订单、撤销包裹
      const isCancel = this.$auth('oms_pack_cancel') && cancelOrder
      // 修改渠道
      const isChange = this.$auth('oms_pack_channel_edit') && changeChannel
      // 出库拦截
      const isShipIntercept = this.$auth('oms_pack_intercept') && shipIntercept
      // 包裹拆分
      const isPackageSplit = this.$auth('oms_pack_split') && packageSplit
      const isView = this.$auth('oms_pack_detail')
      // 审核
      const isAudit = this.isAuditAuth(exceptionType, packageStatus) && isView && audit
      // 发送站内信
      const isPostMsg = platform === 'ebay' && this.$auth('oms_pack_postMsg')
      // 重新预报
      const isReForecast = this.$auth('oms_pack_reForecast') && reForecast

      // events
      const { CancelOrRecovery, handleShipIntercept, handleChannel, showDetails, handlePacksplit, handlepostMsg, handleReForecast } = this
      return [
        { name: '审核', show: isAudit, event: () => showDetails(packageCode) },
        { name: '修改收件人信息', show: isView && updateAddress, event: () => showDetails(packageCode) },
        { name: '修改商品', show: isView && saveOrUpdateGood, event: () => showDetails(packageCode) },

        { name: '撤单', show: isCancel, event: () => CancelOrRecovery('cancelpackage', crData, '撤单') },
        { name: '恢复撤单', show: isRecover, event: () => CancelOrRecovery('recoverypackage', crData, '恢复撤单') },
        { name: '出库拦截', show: isShipIntercept, event: () => handleShipIntercept([{ omOrderId, packageCode, ifPass: 0, remarks: '' }], '确定要出库拦截？') },
        { name: '修改渠道', show: isChange, event: () => handleChannel({ packageCode, omOrderId, packageStatus, warehouseCode, receiveCountryCode, platformCode }) },
        { name: '转仓', show: changeWarehouse, event: () => handleChannel({ packageCode, omOrderId, packageStatus, warehouseCode, receiveCountryCode, platformCode }) },
        { name: '拆分包裹', show: isPackageSplit, event: () => handlePacksplit({ omOrderId, packageCode, receiveCountryCode, platformCode }) },
        { name: '发送站内信', show: isPostMsg, event: () => handlepostMsg(receiveFullName, packageCode, storeName, trackCode1, deliveryTime, platOrderId) },
        { name: '重新预报', show: isReForecast, event: () => handleReForecast([packageCode]) }
      ]
    },
    handleReForecast(data) {
      this.$confirm('确定执行重新预报的操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在请求中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        againForecast(data).then(res => {
          this.$message.success(res.msg)
          this.$refs.search.submitSearch(1, -1)
        }).finally(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    handlepostMsg(receiveFullName, id, storeName, trackCode, deliveryTime, platOrderId) {
      receiveFullName = receiveFullName ? `(${platOrderId})${receiveFullName}` : ''
      let { fullNameList, checkPostId, paramsList } = this
      if (storeName) {
        paramsList = []
        paramsList.push({ sellerId: storeName, trackCode: trackCode, deliveryTime })
      }
      this.$modal({
        component: postmsgModal,
        title: '发站内信',
        width: '40%',
        data: {
          receiveFullName: receiveFullName || fullNameList,
          id: id ? [id] : checkPostId,
          paramsList: paramsList
        },
        callback: () => {

        }
      })
    },
    batchRemark() {
      const ids = this.checkedRemarkIds
      if (ids.length > 0) {
        this.$modal({
          component: VBatchRemark,
          title: '批量备注',
          data: { ids, apiFn: batchRemark, detailsType: 'package' },
          width: '400px'
        })
      }
    },
    showDetails(packageCode) {
      this.$newPage({
        path: 'oms/packOrders/details/index',
        data: { pkType: this.orderType, packageCode },
        callback: () => {
          this.$refs.search.submitSearch(1, -1)
        }
      })
    },
    search(page = 1, params) {
      this.$refs.table.load(page, params)
    },
    fetch({ current, size }, params) {
      return packpage(Object.assign({ current, size }, params)).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    itemShow(item) {
      const orderTypeList = {
        all: 'all',
        audit: 'audit',
        scarceGoods: 'scarceGoods',
        abnormal: 'abnormal',
        delivery: 'delivery',
        returnGoods: 'returnGoods'
      }
      let type = false
      type = item.some(res => orderTypeList[res] === this.orderType)
      return type
    },
    toDetail(item, platformCode) {
      const row = {
        platOrderId: [item],
        platformCode
      }
      this.toDetails(row)
    },
    // 撤销包裹、恢复包裹
    CancelOrRecovery(type, ids, title) {
      this.$modal({
        title,
        width: '500px',
        component: cancelOrderModal,
        data: { ids, type, detailsType: 'package' },
        callback: (bool) => {
          if (bool) this.delayUpdate()
        }
      })
    },
    // 是否是统一包裹状态的, 退货包裹：10， 出库包裹：13
    dealPackageStatus() {
      const list = this.checkedPackageStatus
      const out = list.every(status => status === 13)
      const returnGoods = list.every(status => status === 10)
      const other = list.every(status => status !== 13 && status !== 10)
      return ({ isShowAudit: out || returnGoods || other, status: list[0] })
    },
    // 当前列表页批量审核
    handleAudit() {
      const orderStatus = this.checkedAuditIds
      const data = { orderStatus, detailsType: 'package' }
      const { isShowAudit, status } = this.dealPackageStatus()
      if (isShowAudit) data.packageStatus = status

      this.$modal({
        title: '批量提交审核',
        component: SubmitAudit,
        data,
        callback: (bool) => {
          if (bool) this.delayUpdate()
        }
      })
    },
    async handleChannel({
      packageCode, omOrderId, packageStatus,
      warehouseCode, receiveCountryCode: country, platformCode: platCode
    }) {
      try {
        const res = await getPackageDetails(packageCode)
        const { logisticsPropertyName, trialWeight, channelCode, ruleId } = res.data
        const code = ruleId === -1 ? warehouseCode : 'VIRTUAL,' + ruleId

        const channelForm = {
          packageCode,
          logisticsProperty: logisticsPropertyName.join(','),
          trialWeight: trialWeight,
          allowRushFlag: true,
          channelCode: channelCode,
          warehouseCode: code,
          isVirtualWarehouse: ruleId !== -1 ? '是' : '否',
          ruleId
        }
        this.$modal({
          title: '修改渠道',
          width: '830px',
          component: channel,
          data: {
            omOrderId,
            channelForm,
            packageStatus,
            virtualRuleData: { country, platCode }
          },
          callback: bool => {
            if (bool) this.$refs.search.submitSearch(1, -1)
          }
        })
      } catch (error) {}
    },
    handlePacksplit({ omOrderId, packageCode, receiveCountryCode: country, platformCode: platCode }) {
      this.$modal({
        title: '拆分包裹',
        width: '75%',
        component: splitpackModal,
        data: {
          editType: 'packSplit',
          id: omOrderId,
          packageCode,
          virtualRuleData: { country, platCode }
        },
        callback: (type) => {
          type && this.$refs.search.submitSearch(1, -1)
        }
      })
    },
    handleShipIntercept(params, title) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '手工拦截中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        exceptionAudit('out', params).then(res => {
          if (res.success) {
            this.$refs.search.submitSearch(1, -1)
            this.$message.success('手工拦截成功！')
          }
        }).finally(() => {
          loading.close()
        })
      }).catch(() => {
      })
    },
    // 前往包裹详情页
    toDetails(row) {
      const name = platPaths[row.platformCode]
      const toUrl = {
        omOrderId: {
          name: 'OmsOrderManagementAll',
          data: { searchContent: row.omOrderId, searchType: '2' }
        }, // 订单管理-全部订单
        platOrderId: {
          name,
          data: { searchContent: (row.platOrderId && row.platOrderId[0]) || '', searchType: '1' }
        }// 平台订单-amazon平台订单
      }
      const keyName = Object.keys(row)[0]
      this.$router.push({
        name: toUrl[keyName].name,
        params: { ...toUrl[keyName].data, pkType: this.orderType }
      }, true)
    },
    handlerShow(btns = {}, row) {
      if (row.platform === 'ebay') {
        btns.postMsg = true
      }
      return Object.values(btns).some(bool => bool)
    },
    updateTableHeight() {
      this.$nextTick(this.$refs.table.updateTableHeight)
    },
    // 异常类型
    getExceptionType(val) {
      if (!val) {
        return ''
      }
      const ExceptionList = [
        '无跟踪号',
        '无面单',
        '无跟踪号面单',
        '系统异常'
      ]
      return ExceptionList[val]
    },
    // 获取状态
    getStatus(val) {
      if (!val) {
        return ''
      }
      const statusList = [
        '未调用优选接口',
        '请求中',
        '请求失败',
        '返回失败'
      ]
      return statusList[val]
    },
    // 计算异常停留时间
    computeTime(val) {
      if (!val) {
        return
      }
      const nowDate = new Date()
      const endDate = new Date(val)
      return this.getHHmm(parseInt(nowDate - endDate))
    },
    getHHmm(data) {
      let s = ''
      const dd = parseInt((data / (1000 * 60 * 60 * 24)))
      const hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60))
      s = (dd > 0 ? dd + 'd' : '') + (hours > 0 ? hours + 'h' : '') + minutes + 'm'
      return s
    },
    delayUpdate() {
      setTimeout(() => {
        this.$refs.search.submitSearch(1, -1)
      }, 2000)
    }
  }
}
</script>
