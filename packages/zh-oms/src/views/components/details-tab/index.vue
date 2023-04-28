<template>
  <!-- oms 包裹订单 - 包裹详情 -->
  <div class="detail-tab-wrap">
    <div class="details-bottom">
      <el-tabs id="tabs" v-model="activeName">
        <el-tab-pane v-for="tab in tabPaneList" :key="tab.name" :label="tab.label" :name="tab.name" lazy>
          <template v-if="tab.component">
            <component :is="tab.component" :ref="tab.name" :button-info="tab.name==='productInfo'?buttonInfo:''" v-bind="tab.attrs" v-on="tab.events" />
          </template>

          <template v-else-if="tab.name === 'timeInfo'">
            <g-table ref="timeTable" :headers="headers" :fetch="fetch" :page-show="false" class="pb-1" @hook:mounted="loadTimeTable" />
          </template>

          <div v-else style="height:300px;">开发中。。。</div>
        </el-tab-pane>
      </el-tabs>
      <i class="more-arrow text-primary" :class="isMore?'el-icon-d-arrow-left':'el-icon-d-arrow-right'" @click="changeIsMore" />
      <div class="btns">
        <el-button v-if="activeName==='localRemark'" type="text" size="mini" @click="addRemark">增加备注</el-button>
        <el-button v-if="activeName==='productInfo'&&buttonInfo.saveOrUpdateGood" type="text" size="mini" @click="updateProduct({}, omOrderId,packageCode, detailsType)">添加商品</el-button>
      </div>
    </div>
    <div v-if="permissionsBtns.length" ref="btnsRef" class="text-end mb-1">
      <el-button v-for="(btn, i) in permissionsBtns" :key="i" type="primary" class="mx-1" size="mini" @click="btn.event(btn.params)">{{ btn.text }}</el-button>
    </div>

    <el-dialog
      v-loading="loading"
      title="提交"
      :visible.sync="dialogVisible"
      width="36%"
      custom-class="dialog_class"
    >
      <span class="text-danger">Note:系统检测到你修改了产品信息或者收件人信息，你可以手工调整渠道，或者由系统自动重新优选渠道。</span>
      <span slot="footer">
        <el-button type="primary" size="mini" @click="(dialogVisible = false,modifyChannel())">手工优选渠道</el-button>
        <el-button type="primary" size="mini" @click="submit">系统自动优选渠道</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMaxTableHei, debounce } from '@/util/util'
import { batchRemark, exceptionAudit } from '@/api/orderManagement'
import { getChannelAndPriceByPkgDetail, packageSubmit } from '@/api/packageDetails'
import { recoveryPackage } from '@/api/packageDetails.js'
import { againForecast } from '@/api/packOrders'
import { overSearZHMixin as isOverSeaZH } from '../../mixins/is-over-sea-zh.js'

import ProductInfo from './productInfo.vue'
import LocalRemark from './localRemark.vue'
import Logs from './logs.vue'
import ParcelOrder from './parcelOrder.vue'

import UpdateProduct from './modal/updateProduct.vue'
import ManualAssign from './modal/manualAssign.vue'
import SubmitAudit from './modal/submitAudit.vue'
import VBatchRemark from 'zh-pms/src/views/batchRemark.vue'
import Channel from '../details-tab/modal/channel.vue'
import CancelOrRecoveryModal from '../details-tab/modal/cancelOrRecovery.vue'
import splitpackModal from '../../packOrders/modal/splitpackModal.vue'
import postmsgModal from '../../packOrders/modal/postmsgModal.vue'
/**
* 时间信息表格字段obj
* @typedef {object} obj
* @property {string} orderTime - 下单时间
* @property {string} payTime - 付款时间
* @property {string} grabTime - 抓单时间
* @property {string} importTime - 导入时间
* @property {string} splitPackageTime - 分仓时间
* @property {string} firstDeliveryTime - 发货时间
* @property {string} updateTime - 状态更新时间
*/
export default {
  name: 'DetailsTabIndex',
  mixins: [isOverSeaZH],
  inject: ['isChild', 'virtualRuleData', 'packDetail'],
  props: {
    id: String,
    /** @type {ZHKJ.VueProps<'order'|'package'>} */
    detailsType: {
      type: String,
      default: 'order'
    },
    packageStatus: Number,
    platOrderId: Array,
    omOrderId: {
      type: String,
      default: ''
    },
    packageCode: {
      type: String,
      default: ''
    },
    exceptionType: {
      type: Number,
      default: 1
    },
    /** @type {ZHKJ.VueProps<{trialWeight:string, logisticsProperty:string, packageCode:string}>} */
    channelForm: Object,
    /** @type {ZHKJ.VueProps<obj[]>} */
    timeData: {
      type: Array,
      default() {
        return []
      }
    },
    canRecoveryOrder: {
      type: Boolean,
      default: true
    },
    /** @type {ZHKJ.VueProps<{manualDistribute:Boolean,recoverOrder:Boolean,saveOrUpdateGood:Boolean,submitAudit:Boolean,topExceptionMenu:Boolean, updateAddress:Boolean}>} */
    buttonInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    packageDetailVO: Object,
    omOrderMain: Object,
    storeCode: String,
    pkType: String,
    modifiedAddress: Object
  },
  data() {
    return {
      dialogVisible: false,
      remark: '',
      remarkId: '',
      exception: {
        title: '',
        msg: ''
      },
      headers: [
        { label: '下单时间', prop: 'orderTime' },
        { label: '付款时间', prop: 'payTime' },
        { label: '抓单时间', prop: 'grabTime' },
        { label: '导入时间', prop: 'importTime' },
        { label: '分仓时间', prop: 'splitPackageTime' },
        {
          label: '发货时间',
          prop: 'deliveryTime',
          formatter: (row) => {
            return this.detailsType === 'order' ? row.firstDeliveryTime : row.deliveryTime
          }
        },
        { label: '状态更新时间', prop: 'updateTime' }
      ],
      activeName: 'productInfo',
      tabPaneList: [],

      orderStatus: '',
      orderType: '',
      loading: false,
      isProductChange: false,
      recoveryPackData: null, // 恢复包裹的数据（地址、商品、渠道信息）
      isMore: false
    }
  },
  computed: {
    isUpdateInfo() {
      const data = this.getModifiedData()
      return data.packageAddressDTO !== undefined || data.packageGoodList !== undefined || this.isProductChange || data.omOrderMain
    },
    auditAuth() {
      const isOrder = this.detailsType === 'order'
      let code = ''
      if (isOrder) code = 'order_audit_for_ex_' + this.exceptionType
      else if (this.pkType === 'delivery' || (this.pkType === 'all' && this.packageStatus === 13)) {
        code = 'btn_pkg_intercept_audit'
      } else if (this.pkType === 'returnGoods') {
        code = 'btn_pkg_return_audit'
      } else {
        code = 'btn_pkg_audit_' + this.exceptionType
      }
      return this.$auth(code)
    },
    permissionsBtns() {
      const {
        // attrs
        canRecoveryOrder, detailsType, isUpdateInfo, buttonInfo, omOrderId, packageCode,
        // events
        CancelOrRecovery, packageSplit: packageSplitFn, manualAssign, modifyChannel, submitAudit: submitAuditFn, outIntercept, handleReForecast
      } = this
      const isOrder = detailsType === 'order'

      // isShow
      const { recoverOrder, manualDistribute, packageSplit, submitAudit, changeChannel, cancelOrder, audit, submit, shipIntercept, reForecast } = buttonInfo

      // 恢复订单、撤单恢复按钮
      const r = isOrder ? 'oms_order_recover' : 'oms_pack_recover'
      const isRecover = this.$auth(r) && recoverOrder && canRecoveryOrder
      // 撤销订单、撤销包裹
      const c = isOrder ? 'oms_order_cancel' : 'oms_pack_cancel'
      const isCancel = this.$auth(c) && cancelOrder

      // 手工分仓按钮
      const isManualAssign = this.$auth('oms_order_manual_assign') && isOrder && manualDistribute
      // 审核按钮
      const isAudit = this.auditAuth && ((isOrder && submitAudit) || (audit && !isUpdateInfo))

      // 修改渠道
      const isChangeChannel = this.$auth('oms_pack_channel_edit') && changeChannel
      // 出库拦截
      const isShipIntercept = this.$auth('oms_pack_intercept') && shipIntercept
      // 包裹拆分
      const isPackageSplit = this.$auth('oms_pack_split') && packageSplit
      // 重新预报
      const isReForecast = this.$auth('oms_pack_reForecast') && reForecast

      const btns = [
        { isShow: isRecover, event: CancelOrRecovery, params: 'recovery' + detailsType, text: isOrder ? '恢复订单' : '撤单恢复' },
        { isShow: isManualAssign, event: manualAssign, text: '手工分仓' },
        { isShow: isAudit, event: submitAuditFn, text: '审核' },
        { isShow: isChangeChannel, event: modifyChannel, text: '修改渠道' },
        { isShow: isCancel, event: CancelOrRecovery, params: 'cancel' + detailsType, text: '撤单' },
        { isShow: isShipIntercept, event: outIntercept, text: '出库拦截' },
        { isShow: isPackageSplit, event: packageSplitFn, params: { omOrderId, packageCode }, text: '包裹拆分' },
        { isShow: isReForecast, event: handleReForecast, params: [packageCode], text: '重新预报' },
        { isShow: submit && isUpdateInfo, event: () => (this.dialogVisible = true), text: '提交' }
      ]

      // 发送站内信
      if (this.detailsType !== 'order') {
        const { receiveFullName, storeName, trackCode1, deliveryTime, platOrderIds } = this.packDetail.form
        const isPostMsg = this.packDetail.form.platformCodeName === 'eBay' && this.$auth('oms_pack_postMsg')
        btns.push({ isShow: this.packDetail ? isPostMsg : '', event: () => this.handlepostMsg(receiveFullName, packageCode, storeName, trackCode1, deliveryTime, platOrderIds.join(',')), text: '发送站内信' })
      }
      return btns.filter(item => item.isShow)
    }
  },
  watch: {
    '$parent.exception': {
      handler(obj) {
        if (obj.title || obj.msg) {
          this.updateHeight()
        }
      },
      deep: true
    },
    activeName() {
      this.updateHeight()
    }
  },
  created() {
    this.$emit('title', '订单详情')
    this.getTabPaneList()
  },
  mounted() {
    window.onresize = this.updateHeight
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.updateHeight)
    })
  },
  methods: {
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
          this.delayUpdate()
        }).finally(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    handlepostMsg(receiveFullName, id, storeName, trackCode, deliveryTime, platOrderId) {
      receiveFullName = receiveFullName ? `(${platOrderId})${receiveFullName}` : ''
      let { paramsList } = this
      if (storeName) {
        paramsList = []
        paramsList.push({ sellerId: storeName, trackCode: trackCode, deliveryTime })
      }
      this.$modal({
        component: postmsgModal,
        title: '发站内信',
        width: '40%',
        data: {
          receiveFullName: receiveFullName,
          id: [id],
          paramsList: paramsList
        },
        callback: () => {

        }
      })
    },
    changeIsMore: debounce(function() {
      this.isMore = !this.isMore
      this.$emit('changeIsMore')
    }, 300, true),
    outIntercept() {
      this.$confirm('确定拦截该包裹？', '提示').then(() => {
        const { omOrderId, packageCode } = this
        const params = [{ ifPass: 0, exceptionType: 0, remarks: '', omOrderId, packageCode }]
        exceptionAudit('out', params).then(res => {
          this.$message.success(res.msg)
        })
      }).catch(() => {})
    },
    packageSplit(data = {}) {
      const tl = this.$refs.productInfo?.[0].$refs.table.tableList
      const goodInfoList = tl.reduce((pre, { pmsSku, platformProductId, productQuantity, omOrderGoodId }) => {
        pre.push({ pmsSku, platformProductId, productQuantity, goodId: omOrderGoodId })
        return pre
      }, [])
      this.$modal({
        title: '拆分包裹',
        width: '75%',
        component: splitpackModal,
        data: {
          editType: 'packSplit',
          id: data.omOrderId,
          channelForm: this.channelForm,
          packageCode: data.packageCode,
          goodInfoList,
          virtualRuleData: this.virtualRuleData
        },
        callback: (bool) => {
          bool && this.delayUpdate()
        }
      })
    },
    delProduct() {
      this.isProductChange = true
    },
    getTabPaneList() {
      const { detailsType, omOrderId, packageCode, updateProduct, delProduct } = this
      const attrs = { detailsType, omOrderId, packageCode }
      const tabList = [
        { name: 'productInfo', label: '产品信息', component: ProductInfo, attrs: { updateProduct, ...attrs }, events: { delProduct } },
        { name: 'localRemark', label: '留言&备注', component: LocalRemark, attrs },
        { name: 'timeInfo', label: '时间信息', component: '' },
        { name: 'logs', label: '操作日志', component: Logs, attrs }
      ]
      if (detailsType === 'order') {
        tabList.splice(1, 0, { name: 'parcelOrder', label: '包裹列表', component: ParcelOrder, attrs })
      }
      this.tabPaneList = tabList
    },
    delayUpdate() {
      // 恢复订单接口(recoveryOrder)：后端是异步保存数据的，此处的延时是必要的
      setTimeout(() => {
        this.$parent.getDetail()
        this.$parent.$emit('update', true) // 通过newPage的update触发回调

        // 更新tabs表格的数据
        this.tabPaneList.forEach(item => {
          if (item.name === 'timeInfo') {
            this.loadTimeTable()
          } else {
            this.$refs[item.name] && this.$refs[item.name][0].search(-1)
          }
        })
      }, 2000)
    },
    getModifiedData() {
      const data = {}
      const ma = this.modifiedAddress
      const tl = this.$refs.productInfo?.[0].$refs.table.tableList
      if (ma) data.packageAddressDTO = ma
      if (this.isProductChange) data.packageGoodList = tl
      if (this.omOrderMain) data.omOrderMain = this.omOrderMain
      return data
    },
    modifyChannel() {
      const mData = this.getModifiedData()
      const pages = this.$refs.productInfo?.[0].$refs.table.tableList
      const { omOrderId, exceptionType, channelForm, packageDetailVO, omOrderMain, packageStatus } = this
      // 是否已撤单的包裹状态和恢复包裹有了数据
      const isRPDetails = this.recoveryPackData !== null && this.packageStatus === 11
      const detailsData = { packageDetailVO, pages }
      if (omOrderMain) detailsData.omOrderMain = omOrderMain

      this.$modal({
        title: '修改渠道',
        width: '830px',
        component: Channel,
        data: {
          omOrderId,
          channelForm,
          mData,
          detailsData,
          exceptionType,
          packageStatus,
          isRPDetails,
          virtualRuleData: this.virtualRuleData
        },
        callback: (bool, data) => {
          if (bool && data) {
            this.recoveryPackSubmit(data)
          } else if (bool) {
            this.delayUpdate()
          }
        }
      })
    },
    // 撤销包裹
    CancelOrRecovery(type) {
      const { omOrderId, packageCode, detailsType, platOrderId } = this
      const title = {
        cancelorder: '撤销订单',
        recoveryorder: '恢复订单',
        cancelpackage: '撤销包裹',
        recoverypackage: '恢复包裹'
      }[type]
      this.$modal({
        title,
        width: '500px',
        component: CancelOrRecoveryModal,
        data: { ids: [{ omOrderId, packageCode, platOrderId }], type, detailsType, isRPDetails: type === 'recoverypackage' },
        callback: (bool, data) => {
          if (bool && data?.length) {
            this.dialogVisible = true
            this.recoveryPackData = data
          } else if (bool) {
            if (type === 'recoverypackage') this.isProductChange = false
            this.delayUpdate()
          }
        }
      })
    },
    // 自动优选渠道
    submit() {
      if (this.loading) return
      this.loading = true
      const data = this.getModifiedData()
      const { packageCode, channelForm: { warehouseCode, virtualWarehouseCode }, packageDetailVO, omOrderMain } = this
      data.packageCode = packageCode
      data.warehouseCode = virtualWarehouseCode || warehouseCode

      const pages = this.$refs.productInfo?.[0].$refs.table.tableList
      const params = { packageCode, allowRushFlag: true, warehouseCode: virtualWarehouseCode || warehouseCode, pages, packageDetailVO, omOrderMain }
      const returnPkgFlag = this.packageStatus === 10
      // 是否已撤单的包裹状态和恢复包裹有了数据
      const isRPDetails = this.recoveryPackData !== null && this.packageStatus === 11
      // 泽汇海外仓不需要调接口，初始化默认数据
      if (this.isOverSeaZH(warehouseCode)) {
        data.channelUpdateDTO = { packageCode, warehouseCode: virtualWarehouseCode || warehouseCode, channelCode: '', trialFreightCost: 0, timeliness: '0', returnPkgFlag }

        if (isRPDetails) this.recoveryPackSubmit(data)
        else this.packageSubmit(data)
        return
      }
      getChannelAndPriceByPkgDetail(params).then(res => {
        if (!res.data?.length) {
          const msg = isRPDetails ? '无可用渠道，无法进行恢复包裹操作。' : '无可用渠道，请选择手工优选渠道。'
          return this.$message.error(msg)
        }
        const firstChannelPrice = res.data[0]
        data.channelUpdateDTO = { packageCode, warehouseCode: virtualWarehouseCode || warehouseCode, ...firstChannelPrice, nwDwgId: firstChannelPrice.dwgId, returnPkgFlag, trialFreightCost: firstChannelPrice.cost }
        delete data.channelUpdateDTO.cost

        if (isRPDetails) this.recoveryPackSubmit(data)
        else this.packageSubmit(data)
      }).finally(() => {
        this.loading = false
      })
    },
    recoveryPackSubmit(data) {
      data.channelUpdateDTO.hwFlag = this.isOverSeaZH(data.channelUpdateDTO.warehouseCode)
      this.recoveryPackData = this.recoveryPackData.map(item => {
        Object.assign(item, data)
        return item
      })
      recoveryPackage(this.recoveryPackData).then(res => {
        this.$message.success(res.msg)
        this.dialogVisible = false
        this.loading = false
        this.delayUpdate()
      })
    },
    packageSubmit(data) {
      data.channelUpdateDTO.hwFlag = this.isOverSeaZH(data.channelUpdateDTO.warehouseCode)
      packageSubmit(data).then(res => {
        this.$message.success(res.msg)
        this.dialogVisible = false
        this.loading = false
        this.delayUpdate()
      })
    },
    submitAudit() {
      const { omOrderId, exceptionType, detailsType, packageCode, packageStatus } = this
      this.$modal({
        title: '审核',
        component: SubmitAudit,
        data: { orderStatus: [{ omOrderId, exceptionType }], detailsType, packageStatus, packageCode },
        callback: (bool) => {
          if (bool) {
            this.delayUpdate()
          }
        }
      })
    },
    updateHeight: debounce(function(isShowAlert = true, fixHeight = 0) {
      this.$nextTick(() => {
        const refs = ['btnsRef']
        const { formRef, alertRef } = this.$parent.$refs
        const parentHeight = formRef.$el.clientHeight + (isShowAlert ? (alertRef?.$el.clientHeight ?? 0) : 0)
        const h = getMaxTableHei(this, refs, 60 + parentHeight + fixHeight)

        document.querySelector('#tabs>.el-tabs__content>#pane-' + this.activeName).style.height = h + 'px'

        if (this.activeName === 'timeInfo') {
          return this.$refs.timeTable[0].updateTableHeight()
        }
        this.$refs[this.activeName] && this.$refs[this.activeName][0].$refs.table.updateTableHeight()
      })
    }, 300),
    manualAssign() {
      const { id, omOrderId, virtualRuleData } = this
      this.$modal({
        title: '手工分仓',
        top: '5vh',
        width: '70%',
        component: ManualAssign,
        data: { id, omOrderId, virtualRuleData },
        callback: bool => {
          if (bool) {
            this.delayUpdate()
          }
        }
      })
    },
    loadTimeTable() {
      this.$refs.timeTable && this.$refs.timeTable[0].load()
    },
    fetch() {
      return Promise.resolve({
        records: this.timeData,
        total: this.timeData.length
      })
    },
    addRemark() {
      const { omOrderId, detailsType, packageCode } = this
      let ids = [`,${packageCode}`]
      if (detailsType === 'order') {
        ids = [`,${omOrderId}`]
      }
      // apiFn接口函数 ids特殊处理
      this.$modal({
        title: '增加备注',
        component: VBatchRemark,
        data: { ids: ids, apiFn: batchRemark, detailsType },
        width: '400px',
        callback: (bool) => {
          if (bool) {
            const resultId = {
              order: omOrderId, package: packageCode
            }
            this.$refs.localRemark[0].$refs.table.load(-1, resultId[detailsType])
          }
        }
      })
    },
    findProSkuItem() {
      const list = this.$refs.productInfo[0].$refs.table.tableList
      return list.reduce((totalPre, { pmsSku, platformProductId }) => {
        totalPre.push(pmsSku + platformProductId)
        return totalPre
      }, [])
    },
    // index:该行数据的表格下标；isNewProduct:true（包裹详情的新增在本地的商品，视为修改），false（新增）
    updateProduct(row, omOrderId, packageCode, detailsType, index, isNewProduct) {
      if (!omOrderId) omOrderId = this.$parent.omOrderId
      const id = row.id
      const data = {
        row,
        omOrderId,
        detailsType,
        packageCode,
        isNewProduct,
        storeCode: this.storeCode,
        virtualRuleData: this.virtualRuleData
      }
      if (!id && !isNewProduct) {
        data.proSkuItemList = this.findProSkuItem()
      }
      this.$modal({
        title: id || isNewProduct ? '修改产品：' : '添加产品：',
        width: '850px',
        component: UpdateProduct,
        data,
        callback: (isUpdate, newData) => {
          const resultId = { order: omOrderId, package: packageCode }
          const ref = this.$refs.productInfo[0].$refs.table
          if (isUpdate) {
            if (newData) {
              ref.tableList.splice(index ?? 0, index === undefined ? 0 : 1, newData)
              this.isProductChange = true
              return
            }
            ref.load(-1, resultId[detailsType])
          }
        }
      })
    },
    close() {
      this.$parent.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-tab-wrap{
  ::v-deep .dialog_class .el-dialog__body{
    padding: 0 10px;
  }
  .details-bottom{
    background-color: #fff;
    min-height: 200px;
    position: relative;
    ::v-deep .el-tabs__content>div{
      min-height: 200px;
    }
    .more-arrow{
      width: 36px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 6px;
      transition: transform 0.16s ease;
      transform: scale(1) translateX(-50%) rotateZ(-90deg);
      cursor: pointer;
      &:hover{
        transform: translateX(-50%) scale(1.5) rotateZ(-90deg);
      }
    }
    .btns{
      position: absolute;
      right: 0;
      top: 4px;
    }
  }
}
</style>
