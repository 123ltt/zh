<template>
  <!-- oms 订单管理 - 订单详情 v-if="exception.title||exception.msg" -->
  <div class="detail-wrap">
    <el-alert v-if="buttonInfo.topExceptionMenu" ref="alertRef" style="min-height: 30px" type="warning" @close="closeAlert(false)">
      <div v-if="exception.title" slot="title" class="fw-normal">异常类型：{{ exception.title }}</div>
      <div v-if="exception.msg">异常原因：{{ exception.msg }}</div>
    </el-alert>

    <el-row ref="formRef" :style="{height:isMore?'0px':rowHeight}" class="info mt-2">
      <el-row :gutter="8" type="flex" class="row">
        <el-col v-for="(column, index) in detailRow1" :key="index">
          <el-card shadow="hover">
            <g-list-group :cols="1" label-width="60px">
              <g-list-group-item v-for="item in column" :key="item.prop" :label="item.label">
                <div class="w-100 d-flex">
                  <g-text-ellipsis> {{ item.prop==='platOrderId'?form[item.prop][0]:form[item.prop] }}</g-text-ellipsis>
                  <CombineOrder v-if="item.prop==='platOrderId'&&form.platOrderId.length>1" :orders="form.platOrderId" />
                </div>
              </g-list-group-item>
            </g-list-group>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="8" type="flex" class="row">
        <el-col v-for="(items, index) in detailRow2" :key="index" :span="12">
          <el-card v-loading="updating&&index===0" shadow="hover">
            <div slot="header" class="d-flex justify-content-between">
              <template v-if="index===0">
                <span>地址信息</span>
                <div class="btns-space">
                  <span v-if="isModifyAddres" class="text-primary" style="cursor:pointer;" @click="cancelModify">取消</span>
                  <span v-if="buttonInfo.updateAddress" class="text-primary" style="cursor:pointer;" @click="modifyAddres">{{ isModifyAddres?'保存':'修改' }}</span>
                </div>
              </template>

              <template v-else>
                <el-dropdown v-if="amountDesc.length">
                  <span class="el-dropdown-link" style="cursor: default;">
                    金额信息 <i class="el-icon-question" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <pre class="mx-3">{{ amountDesc }}</pre>
                  </el-dropdown-menu>
                </el-dropdown>

                <span v-else class="el-dropdown-link" style="cursor: default;">
                  金额信息 <i class="el-icon-question" />
                </span>
                <div class="btns-space">
                  <g-link v-if="$auth('oms_order_export_invoice')" style="cursor:not-allowed;" color="muted" target="_blank">导出发票</g-link>
                </div>
              </template>

            </div>
            <el-row>
              <el-col v-for="(column, k) in items" :key="k" :span="index===0?8*(k+1):12" class="mb-0">
                <g-list-group :cols="1" :label-width="index===0?'60px':'96px'">
                  <g-list-group-item v-for="(item, j) in column"
                                     :key="j"
                                     :label="item.label"
                                     :class="item.class"
                  >
                    <g-content v-if="item.prop!=='receiveCountryCode'" v-model="form[item.prop]" :type="item.prop.startsWith('receiveAddress')?'textarea':'input'" :rows="[1,2]" :editable="item.disabled!==true&&index===0&&isModifyAddres" />
                    <g-select v-else v-model="form.receiveCountryCode" :items="countryList" key-field="value" class="w-100" :class="{'g-select-disabled':true}" :disabled="true" />
                    <!-- <g-select v-else v-model="form.receiveCountryCode" :items="countryList" key-field="value" class="w-100" :class="{'g-select-disabled':!isModifyAddres}" :disabled="!isModifyAddres" /> -->
                  </g-list-group-item>
                </g-list-group>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-row>

    <DetailsTab :id="id"
                ref="detailsTabRef"
                :button-info="buttonInfo"
                :exception-type="exceptionType"
                :om-order-id="omOrderId"
                :plat-order-id="platOrderId"
                :time-data="timeData"
                :can-recovery-order="canRecoveryOrder"
                :store-code="form.storeCode"
                @changeIsMore="changeIsMore"
    />
  </div>
</template>

<script>
import { getDetail, modifyOrderAddres } from '@/api/orderManagement'
import orderAndPackMixin from '../mixins/orderAndPack.js'

export default {
  name: 'DetailsIndex',
  mixins: [orderAndPackMixin],
  props: {
    id: String,
    omOrderId: String
  },
  provide() {
    return {
      packDetail: this
    }
  },
  data() {
    return {
      headers: [
        { label: '下单时间', prop: 'orderTime' },
        { label: '付款时间', prop: 'payTime' },
        { label: '抓单时间', prop: 'grabTime' },
        { label: '导入时间', prop: 'importTime' },
        { label: '分仓时间', prop: 'splitPackageTime' },
        { label: '发货时间', prop: 'firstDeliveryTime' },
        { label: '状态更新时间', prop: 'updateTime' }
      ],
      form: {
        orderStatus: '',
        platOrderId: [],
        omOrderId: '',
        storeCode: '',
        storeName: '',
        platformCodeName: '',
        siteCode: '',
        orderType: '',
        guestChooseFreight: '',
        platTrackingNo: '',
        serviceStaff: '',
        salesman: '',
        shippingType: '',
        ifMarketingOrder: '',

        buyerId: '',
        receiveCountryCode: '',
        receiveFullName: '',
        receiveDeltaProvince: '',
        receiveCity: '',
        receiveEmail: '',
        receiveZip: '',
        personalIdentificationNumber: '',
        phoneNumber: '',
        receiveAddressOne: '',
        mobileNo: '',
        receiveAddressTwo: '',
        socialContact: '',
        taxNumber: '',
        vatPayCode: '',

        orderAmount: '',
        platformTradeAmount: '',
        paymentAmount: '',
        excellentCostAmount: '',
        sellerIncomeAmount: '',
        sellerAdjustAmount: '',
        exchangeRate: '',
        usd2RmbExchangeRate: '',
        paymentType: '',
        transactionId: '',
        receivableAccount: ''
      },
      detailRow1: Object.freeze([
        [
          { label: '订单状态', prop: 'orderStatus' },
          { label: 'OMS单号', prop: 'omOrderId' },
          { label: '平台单号', prop: 'platOrderId' }
        ],
        [

          { label: '销售店铺', prop: 'storeName' },
          { label: '销售平台', prop: 'platformCodeName' },
          { label: '销售站点', prop: 'siteCode' }
        ],
        [
          { label: '订单来源', prop: 'orderType' },
          { label: '发货类型', prop: 'shippingType' },
          { label: '营销订单', prop: 'ifMarketingOrder' }
        ],
        [
          { label: '客选物流', prop: 'guestChooseFreight' },
          { label: '线上跟踪号', prop: 'platTrackingNo' }
        ],
        [
          { label: '客服人员', prop: 'serviceStaff' },
          { label: '销售人员', prop: 'salesman' }
        ]
      ]),
      detailRow2: Object.freeze([
        [
          // 地址信息 共2列
          [
            { label: '收件人', prop: 'receiveFullName' },
            { label: '省/州', prop: 'receiveDeltaProvince' },
            { label: '邮编', prop: 'receiveZip' },
            { label: '固定电话', prop: 'phoneNumber' },
            { label: '移动电话', prop: 'mobileNo' }
            // { label: '个人识别号：', prop: 'personalIdentificationNumber' },
            // { label: '买家账号：', prop: 'buyerId', disabled: true },
            // { label: '社交账号：', prop: 'socialContact', disabled: true },
            // { label: '税号：', prop: 'taxNumber', disabled: true }
          ],
          [
            { label: '国家简称', prop: 'receiveCountryCode', class: 'fixed-class' },
            { label: '城市', prop: 'receiveCity' },
            { label: '买家邮箱', prop: 'receiveEmail' },
            { label: '地址一', prop: 'receiveAddressOne' },
            { label: '地址二', prop: 'receiveAddressTwo' }
          ]
        ],
        // 金额信息 共2列
        [
          [
            { label: '订单总金额(除税)', prop: 'orderAmount' },
            { label: '买家实付金额', prop: 'paymentAmount' },
            { label: '卖家实收金额', prop: 'sellerIncomeAmount' },
            { label: '美元转当地币汇率', prop: 'exchangeRate' },
            { label: '美元转CNY汇率', prop: 'usd2RmbExchangeRate' },
            { label: '交易号', prop: 'transactionId' }

          ],
          [
            { label: '平台交易费', prop: 'platformTradeAmount' },
            { label: '优惠金额', prop: 'excellentCostAmount' },
            { label: '调整金额', prop: 'sellerAdjustAmount' },
            { label: '付款方式', prop: 'paymentType' },
            { label: '收款账号', prop: 'receivableAccount' },
            { label: 'IOSS号', prop: 'vatPayCode' }
          ]
        ]
      ]),
      canRecoveryOrder: false,
      addres: {
        buyerId: '',
        receiveCountryCode: '',
        receiveFullName: '',
        receiveDeltaProvince: '',
        receiveCity: '',
        receiveEmail: '',
        receiveZip: '',
        personalIdentificationNumber: '',
        phoneNumber: '',
        receiveAddressOne: '',
        mobileNo: '',
        receiveAddressTwo: '',
        socialContact: '',
        taxNumber: ''
      },
      platOrderId: []
    }
  },
  created() {
    this.$emit('title', '订单详情')
    this.getDetail()
  },
  methods: {
    formatterMoney(price) {
      let res = 'USD '
      if (price === null || price === undefined) {
        res += price
      } else {
        res += parseFloat(price).toFixed(2)
      }
      return res
    },
    modifyOrderAddres() {
      const data = Object.assign({}, this.addres)
      if (this.updating) return
      this.updating = true
      Object.keys(data).forEach(key => {
        data[key] = this.form[key]
      })
      data.omOrderId = this.form.omOrderId

      modifyOrderAddres(data).then((res) => {
        this.$message.success(res.msg || '')
        Object.assign(this.addres, data)
        this.isModifyAddres = false
      }).finally(() => {
        this.updating = false
      })
    },
    getDetail() {
      getDetail(this.omOrderId).then(({ data }) => {
        const addUSD = ['orderAmount', 'platformTradeAmount', 'paymentAmount', 'excellentCostAmount', 'sellerIncomeAmount', 'sellerAdjustAmount']

        Object.keys(this.form).forEach(key => {
          switch (true) {
            // case Object.keys(this.addres).includes(key):
            case key === 'orderStatus':
              this.form[key] = data[key].msg
              this.orderStatus = data[key].code
              break
            case key === 'orderType':
              this.form[key] = data[key].name
              this.orderType = data[key].orderType
              break
            case ['exchangeRate', 'usd2RmbExchangeRate'].includes(key):
              this.form[key] = parseFloat(data[key]).toFixed(6)
              break
            case addUSD.includes(key):
              this.form[key] = this.formatterMoney(data[key])
              break
            default:
              this.form[key] = data[key]
              this.addres[key] = data[key]
              if (key === 'platOrderId') {
                this.form[key] = this.addres[key] = data.platOrderIds
              } else if (key === 'siteCode' && data.platformCodeName === 'wish') this.form[key] = ''
              else if (key === 'ifMarketingOrder') this.form[key] = data[key] === 1 ? '是' : '否'
              break
          }
        })
        const {
          buttonInfo, orderStatus, remarkId, exceptionType, platOrderIds,
          amountDesc = '', exceptionTypeName: title, exceptionMsg: msg
        } = data
        this.virtualRuleData.country = data.receiveCountryCode
        this.virtualRuleData.platCode = data.platformCode
        this.buttonInfo = buttonInfo
        this.canRecoveryOrder = orderStatus.code === 5
        this.remarkId = remarkId
        this.timeData = [data]
        this.exceptionType = exceptionType
        this.exception = { title, msg }
        this.amountDesc = amountDesc
        this.platOrderId = platOrderIds
      }).finally(() => {
        this.closeAlert(this.buttonInfo.topExceptionMenu)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../packOrders/details/index.scss"
</style>
