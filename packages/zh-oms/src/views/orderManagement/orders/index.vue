<template>
  <!-- oms 订单管理 - 全部订单、异常订单 -->
  <g-table ref="table"
           :headers="headers"
           row-key="id"
           dense
           :fetch="fetch"
           @selection-change="checkedHandler"
  >
    <template slot="header">
      <Search ref="searchForm" :update-table-height="updateTableHeight" :search="search" :is-all="isAll" />
    </template>
    <el-table-column slot="platOrderIdSlot"
                     label="单号"
                     min-width="196px"
    >
      <div slot-scope="{row:{omOrderId, platOrderId, platformCode}, $index}"
           @mouseover="isCopy=$index"
           @mouseleave="isCopy=''"
      >
        <g-list-group label-width="28px">
          <g-list-group-item label="OMS">
            <div class="w-100 d-flex">
              <g-text-ellipsis class="link-class" @click.native="showDetails(omOrderId)">
                {{ omOrderId }}
              </g-text-ellipsis>
              <i v-show="isCopy===$index"
                 v-clipboard="()=>omOrderId"
                 v-clipboard:success="()=>clipboardSuccessHandler('OMS单号')"
                 v-clipboard:error="()=>clipboardErrorHandler('OMS单号')"
                 class="el-icon-document-copy mt-1 ms-1 copy-hover-i"
                 style="cursor:pointer;"
              />
            </div>
          </g-list-group-item>
          <g-list-group-item label="平台">
            <div class="w-100 d-flex">
              <g-text-ellipsis class="link-class" @click.native="toPlatList(platOrderId[0], platformCode)">
                {{ platOrderId[0] }}
              </g-text-ellipsis>
              <CombineOrder v-if="platOrderId.length>1" :is-copy="true" :is-link="true" pre-text="平台单号" :orders="platOrderId" @toDetails="(v)=>toPlatList(v,platformCode)" />
              <i v-else
                 v-show="isCopy===$index"
                 v-clipboard="()=>platOrderId[0]"
                 v-clipboard:success="()=>clipboardSuccessHandler('平台单号')"
                 v-clipboard:error="()=>clipboardErrorHandler('平台单号')"
                 class="el-icon-document-copy mt-1 ms-1 copy-hover-i"
                 style="cursor:pointer;"
              />
            </div>
          </g-list-group-item>
        </g-list-group>
      </div>
    </el-table-column>
    <el-table-column slot="platformSlot" label="平台" min-width="152px">
      <template slot-scope="{row:{platformCode,siteCode,storeName,buyerId,receiveCountryCode}}">
        <g-list-group label-width="56px">
          <g-list-group-item label="平台-站点">
            <g-text-ellipsis>{{ formatterOrder(platformCode, 'platformCode') }}
              {{ !['WH','SM', ''].includes(platformCode)&&siteCode?'- '+ siteCode: '' }}
            </g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="销售店铺"><g-text-ellipsis>{{ storeName }}</g-text-ellipsis></g-list-group-item>
          <g-list-group-item label="买家账号">
            <g-text-ellipsis>{{ buyerId }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="收件国家">
            <g-text-ellipsis>{{ formatterOrder(receiveCountryCode, 'receiveCountryCode') }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>

    <el-table-column slot="amountSlot" label="金额（USD）" min-width="150px">
      <template slot-scope="{row:{orderAmount, sellerIncomeAmount}}">
        <g-list-group label-width="68px">
          <g-list-group-item label="总金额(除税)">{{ formatterMoney(orderAmount) }}
          </g-list-group-item>
          <g-list-group-item label="卖家实收">{{ formatterMoney(sellerIncomeAmount) }}
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>

    <el-table-column slot="timeSlot" label="时间" width="168px">
      <template slot-scope="{row}">
        <div>抓单：{{ row.firstGrabTime }}</div>
        <div>付款：{{ row.payTime }}</div>
      </template>
    </el-table-column>
    <el-table-column slot="statusSlot" label="状态" :width="isAll?'170px':'144px'">
      <template slot-scope="{row}">
        <g-list-group>
          <g-list-group-item label="平台">
            <g-text-ellipsis>{{ row.platStatus }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="OMS">
            <g-text-ellipsis>{{ formatterOrder(row.orderStatus, 'orderStatus') }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="订单来源">{{ formatterOrder(row.orderType, 'orderOrigin') }}
          </g-list-group-item>
          <g-list-group-item v-if="!isAll" label="停留时间">
            <span style="color:red;">{{ row.stayTime }}</span>
          </g-list-group-item>
        </g-list-group>

      </template>
    </el-table-column>
    <el-table-column slot="invoiceSlot" label="负责人" :width="isAll?'176px':'124px'">
      <template slot-scope="{row}">
        <g-list-group>
          <g-list-group-item label="客服">{{ row.csName }}
          </g-list-group-item>
          <g-list-group-item label="销售">{{ row.sellerName }}
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>
    <el-table-column v-if="!isAll" slot="msgOrReasonSlot" label="异常" min-width="136px">
      <template slot-scope="{row:{exceptionType,exceptionMsg}}">
        <g-list-group>
          <g-list-group-item label="类型">
            <g-text-ellipsis>{{ formatterOrder(exceptionType, 'exceptionType') }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="内容">
            <g-text-ellipsis :lines="3">{{ exceptionMsg }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" width="60">
      <template slot-scope="{ row }">
        <el-button v-if="$auth('oms_order_view')" type="text" @click="showDetails(row.omOrderId)">详情</el-button><br>
        <BtnsMenu v-if="isShowOpBtns(row.buttonInfo)" name="操作" :menus="getMenus(row)" />
      </template>
    </el-table-column>
    <div slot="footer-left">
      <BtnsMenu name="批量操作" type="primary" :disabled="checkedCRData.length===0" :menus="getBatchMenus()" />
    </div>
  </g-table>
</template>

<script>
import { getPageList, batchRemark } from '@/api/orderManagement'
import { getDicts } from '@/api/common/dict'
import { throttle } from '@/util/util'
import platPaths from '@/api/platPaths.js'

import VBatchRemark from 'zh-pms/src/views/batchRemark.vue'
import SubmitAudit from '@/views/components/details-tab/modal/submitAudit.vue'
import CancelOrRecoveryModal from '@/views/components/details-tab/modal/cancelOrRecovery.vue'
import Search from './search.vue'
import ManualAssign from '@/views/components/details-tab/modal/manualAssign.vue'
import CombineOrder from '@/views/components/combine-order/index.vue'
import BtnsMenu from '../../components/btns-menu.vue'
export default {
  name: 'OrdersIndex',
  components: { Search, CombineOrder, BtnsMenu },
  props: {
    isAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCopy: '',
      headers: [
        // { slot: true, slotName: 'selectionSlot' },
        { type: 'selection', width: '40px' },
        { slot: true, slotName: 'platOrderIdSlot' },
        { slot: true, slotName: 'orderSlot' },
        { slot: true, slotName: 'platformSlot' },
        { slot: true, slotName: 'amountSlot' },
        { slot: true, slotName: 'timeSlot' },
        { slot: true, slotName: 'statusSlot' },
        { slot: true, slotName: 'invoiceSlot' },
        { slot: true, slotName: 'msgOrReasonSlot' },
        { slot: true, slotName: 'handler' }
      ],
      checkedRemarkIds: [],
      checkedAuditIds: [],
      orderStatusList: [],
      checkedCRData: [],
      exceptionTypeList: [],
      platformList: [],
      batchBtns: {
        submitAudit: true,
        cancelOrder: true,
        recoverOrder: true
      }
    }
  },
  computed: {
    getCodeAuths() {
      const { $auth } = this
      const code = {
        cancel: $auth('oms_order_cancel'),
        recover: $auth('oms_order_recover'),
        manual: $auth('oms_order_manual_assign')
      }
      return code
    }
  },
  created() {
    getDicts(['order_status', 'om_order_exception_type'], 'oms').then(res => {
      this.orderStatusList = res.order_status
      this.exceptionTypeList = res.om_order_exception_type
    })
  },
  mounted() {
    this.$refs.table.load(1, this.$refs.searchForm.form)
  },
  methods: {
    toPlatList(platOrderId, platformCode) {
      const name = platPaths[platformCode]
      const params = { searchContent: platOrderId || '', searchType: '1' }
      this.$router.push({ name, params }, true)
    },
    checkedHandler(data) {
      this.checkedRemarkIds = []
      this.checkedAuditIds = []
      this.checkedCRData = []
      const btns = []
      const KEYS = Object.keys(this.batchBtns)
      const originObj = {
        cancelOrder: this.getCodeAuths.cancel,
        recoverOrder: this.getCodeAuths.recover
      }

      data.forEach(({ id, omOrderId, exceptionType, platOrderId, buttonInfo }, i) => {
        this.checkedRemarkIds.push(`${id},${omOrderId}`)
        this.checkedAuditIds.push({ omOrderId, exceptionType })
        this.checkedCRData.push({ omOrderId, platOrderId })

        const submitAudit = this.$auth('order_audit_for_ex_' + exceptionType)
        const obj = Object.assign({ submitAudit }, originObj)
        btns.push(merge(buttonInfo, obj))
      })

      // filter true buttons
      filterBtn(this.batchBtns)
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
        submitAudit: submitAuditFn, CancelOrRecovery, batchRemark,
        // attrs
        batchBtns: { submitAudit, cancelOrder, recoverOrder }, checkedCRData
      } = this
      return [
        { name: '批量备注', show: true, event: () => batchRemark() },
        { name: '批量审核', show: submitAudit, event: () => submitAuditFn() },
        { name: '批量撤单', show: cancelOrder, event: () => CancelOrRecovery('cancelorder', checkedCRData, '批量撤单') },
        { name: '批量恢复订单', show: recoverOrder, event: () => CancelOrRecovery('recoveryorder', checkedCRData, '批量恢复订单') }
      ]
    },
    // 单一操作
    getMenus({ buttonInfo, omOrderId, exceptionType, platOrderId, receiveCountryCode, platformCode }) {
      // attrs
      const { submitAudit, cancelOrder, recoverOrder, manualDistribute } = buttonInfo
      const crData = [{ omOrderId, platOrderId }]
      const { getCodeAuths: { cancel, recover, manual } } = this
      const isAudit = this.$auth('order_audit_for_ex_' + exceptionType)
      // events
      const { submitAudit: submitAuditFn, CancelOrRecovery, manualAssign } = this
      return [
        { name: '审核', show: isAudit && submitAudit, event: () => submitAuditFn([{ omOrderId, exceptionType }]) },
        { name: '撤单', show: cancel && cancelOrder, event: () => CancelOrRecovery('cancelorder', crData, '撤单') },
        { name: '恢复订单', show: recover && recoverOrder, event: () => CancelOrRecovery('recoveryorder', crData, '恢复订单') },
        { name: '手工分仓', show: manual && manualDistribute, event: () => manualAssign({ omOrderId, receiveCountryCode, platformCode }) }
      ]
    },
    isShowOpBtns(btns = {}) {
      return Object.values(btns).some(bool => bool)
    },
    clipboardSuccessHandler: throttle(function(type) {
      this.$message.success(type + '复制成功')
    }, 500),
    clipboardErrorHandler: throttle(function(type) {
      this.$message.success(type + '复制失败')
    }, 500),
    formatterMoney(price) {
      if (price === '0.0') {
        return 0
      } else if (price === null || price === undefined) {
        return price
      }
      return parseFloat(price).toFixed(2)
    },
    formatterOrder(val, type) {
      const { orderOriginList, platformList, countryList } = this.$refs.searchForm
      const list = {
        orderStatus: this.orderStatusList,
        exceptionType: this.exceptionTypeList,
        orderOrigin: orderOriginList,
        platformCode: platformList,
        receiveCountryCode: countryList
      }[type] ?? []
      let res = val
      list.forEach(item => {
        val + '' === item.value && (res = item.label)
      })
      return res
    },
    updateTableHeight() {
      this.$nextTick(this.$refs.table.updateTableHeight)
    },
    fetch({ current, size }, params) {
      const { firstGrabTime, amount, mainCustomerServiceId, storeName } = params
      const roleType = this.$refs.searchForm.roleType
      const data = JSON.parse(JSON.stringify(params))

      // data.paymentAmount = [amount.min, amount.max]
      data.sellerIncomeAmount = [amount.min, amount.max]
      delete data.amount

      data.forExceptionOrders = !this.isAll
      data[roleType] = mainCustomerServiceId ? mainCustomerServiceId.id : ''
      if (roleType === 'mainSellerId') delete data.mainCustomerServiceId
      data.time = firstGrabTime
      delete data.firstGrabTime

      if (this.isAll) {
        data.orderStatus = data.exceptionType
        delete data.exceptionCreateTime
        delete data.exceptionType
      } else {
        // delete data.isUndoOrder
      }
      data.ifCombinedOrder || delete data.ifCombinedOrder

      if (!Array.isArray(storeName)) {
        data.storeName = data.storeName.split(/\r|\n|\r\n|\s/).filter(item => item !== '')
      }

      return getPageList({ ...data, current, size }).then(res => {
        return {
          records: res.data.records || [], // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search(page = 1) {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(page, this.$refs.searchForm.form)
    },
    manualAssign({ omOrderId, receiveCountryCode: country, platformCode: platCode }) {
      this.$modal({
        title: '手工分仓',
        top: '5vh',
        width: '70%',
        component: ManualAssign,
        data: { omOrderId, virtualRuleData: { country, platCode } },
        callback: bool => {
          if (bool) this.delayUpdate()
        }
      })
    },
    // 撤销订单、恢复订单
    CancelOrRecovery(type, ids, title) {
      this.$modal({
        title,
        width: '500px',
        component: CancelOrRecoveryModal,
        data: { ids, type, detailsType: 'order' },
        callback: (bool) => {
          if (bool) this.delayUpdate()
        }
      })
    },
    submitAudit(val) {
      const orderStatus = val || this.checkedAuditIds
      const title = val ? '提交审核' : '批量提交审核'
      this.$modal({
        title,
        component: SubmitAudit,
        data: { orderStatus },
        callback: (bool) => {
          if (bool) this.delayUpdate()
        }
      })
    },
    // 提交批量备注
    batchRemark() {
      const ids = this.checkedRemarkIds
      if (ids.length > 0) {
        this.$modal({
          title: '批量备注',
          component: VBatchRemark,
          data: { ids, apiFn: batchRemark },
          width: '400px'
        })
      }
    },
    showDetails(omOrderId) {
      this.$newPage({
        path: 'oms/orderManagement/details',
        data: { omOrderId },
        callback: (bool) => {
          if (bool) this.delayUpdate()
        }
      })
    },
    delayUpdate() {
      setTimeout(() => {
        this.search(-1)
        this.$refs.searchForm.getOrderStatusCount()
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-hover-i:hover{
  color: $--color-primary;
}
.link-class{
  color: var(--color-primary);
  &:hover{
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
