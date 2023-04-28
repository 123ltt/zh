<template>
  <!-- oms 包裹订单 - 订单详情 -->
  <div class="detail-wrap">
    <el-alert v-if="buttonInfo.topExceptionMenu" ref="alertRef" style="min-height: 30px" type="warning" @close="closeAlert(false)">
      <div v-if="exception.title" slot="title" class="fw-normal">异常类型：{{ exception.title }}</div>
      <div v-if="exception.msg">{{ exceptionType===2?'恢复':'异常' }}原因：{{ exception.msg }}</div>
    </el-alert>

    <el-row ref="formRef" v-loading="updating" :style="{height:isMore?'0px':rowHeight}" class="info mt-2">
      <el-row type="flex" :gutter="8" class="row">
        <el-col v-for="(items, i) in detailRow1" :key="i" :span="12">
          <el-card shadow="hover">
            <div v-if="i===1" slot="header" class="d-flex justify-content-between">
              <span>发货信息</span>
              <div class="btns-space">
                <span v-if="isModifyIOSS" class="text-primary" style="cursor:pointer;" @click="cancelModifyIOSS">取消</span>
                <span v-if="buttonInfo.updateAddress" class="text-primary" style="cursor:pointer;" @click="modifyIOSS">{{ isModifyIOSS?'保存':'修改' }}</span>
                <g-link v-if="sheetUrl" color="primary" target="_blank" :href="sheetUrl">下载物流面单</g-link>
                <g-link style="cursor:not-allowed;" color="muted" target="_blank">下载发票</g-link>
              </div>
            </div>
            <g-list-group :cols="3" :label-width="i===0?'60px':'96px'">
              <g-list-group-item v-for="(item, j) in items" :key="j" :label="item.label" :style="j===item.length-1?'margin-right:0':''" :sep="item.sep">
                <div class="w-100 d-flex">
                  <g-content v-if="item.prop==='vatPayCode'" v-model="form[item.prop]" type="input" :editable="isModifyIOSS" />
                  <g-text-ellipsis v-else class="flex-grow-1"> {{ item.prop==='platOrderId'?form[item.prop][0]:form[item.prop] }} </g-text-ellipsis>
                  <CombineOrder v-if="item.prop==='platOrderId'&&form.platOrderId.length>1" :orders="form.platOrderId" />
                </div>
              </g-list-group-item>
            </g-list-group>
          </el-card>
        </el-col>
      </el-row>

      <el-row type="flex" :gutter="8" class="row">
        <el-col v-for="(items, i) in detailRow2" :key="i" :span="12">
          <el-card shadow="hover">
            <div slot="header" class="d-flex justify-content-between">
              <template v-if="i===0">
                <span>地址信息</span>
                <div class="btns-space">
                  <span v-if="isModifyAddres" class="text-primary" style="cursor:pointer;" @click="cancelModify">取消</span>
                  <span v-if="buttonInfo.updateAddress" class="text-primary" style="cursor:pointer;" @click="modifyAddres">{{ isModifyAddres?'保存':'修改' }}</span>
                </div>
              </template>

              <template v-else>
                <el-dropdown v-if="amountDesc.length" placement="bottom">
                  <span class="el-dropdown-link" style="cursor: default;">
                    金额信息 <i class="el-icon-question" />
                  </span>
                  <el-dropdown-menu slot="dropdown" style="max-width:80vw;height:70vh;overflow:auto;">
                    <pre class="mx-3">{{ amountDesc }}</pre>
                  </el-dropdown-menu>
                </el-dropdown>
                <span v-else class="el-dropdown-link" style="cursor: default;">
                  金额信息 <i class="el-icon-question" />
                </span>
              </template>

            </div>
            <el-row>
              <el-col v-for="(column, k) in items" :key="k" :span="i===0?8*(k+1):8" class="mb-0">
                <g-list-group :cols="1" :label-width="i===0?'60px':'96px'">
                  <g-list-group-item v-for="(item, j) in column"
                                     :key="j"
                                     :label="item.label"
                                     :class="item.class"
                                     :sep="getSep(i, k, item.prop)"
                  >
                    <!-- i===0 地址信息  -->
                    <template v-if="i===0">
                      <g-content v-if="item.prop!=='receiveCountryCode'" v-model="form[item.prop]" :type="item.prop.startsWith('receiveAddress')?'textarea':'input'" :rows="[1,2]" :editable="item.disabled!==true&&isModifyAddres" />
                      <g-select v-else v-model="form.receiveCountryCode" :items="countryList" key-field="value" class="w-100" :class="{'g-select-disabled':true}" :disabled="true" />
                      <!-- <g-select v-else v-model="form.receiveCountryCode" :items="countryList" key-field="value" class="w-100" :class="{'g-select-disabled':!isModifyAddres}" :disabled="!isModifyAddres" /> -->
                    </template>
                    <!-- i===1 金额信息 -->
                    <span v-else class="ps-2">
                      {{ item.prop==='usd2RmbExchangeRate'?parseFloat(form[item.prop]).toFixed(6): formatterMoney(form[item.prop]) }}
                    </span>
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
                details-type="package"
                :package-status="packageStatus"
                :button-info="buttonInfo"
                :om-order-id="omOrderId"
                :package-code="packageCode"
                :plat-order-id="form.platOrderId"
                :channel-form="channelForm"
                :exception-type="exceptionType"
                :time-data="timeData"
                :modified-address="modifiedAddress"
                :package-detail-v-o="packageDetailVO"
                :om-order-main="omOrderMain"
                :store-code="form.storeCode"
                :pk-type="pkType"
                @changeIsMore="changeIsMore"
    />
  </div>
</template>

<script>
import { getPackageDetails } from '@/api/packageDetails'
import orderAndPackMixin from '../../mixins/orderAndPack.js'

export default {
  name: 'DetailsIndex',
  mixins: [orderAndPackMixin],
  props: {
    id: String,
    // omOrderId: String,
    packageCode: String,
    pkType: String
  },
  provide() {
    return {
      packDetail: this
    }
  },
  data() {
    return {
      channelForm: {},
      payRecordCurrency: '',
      isShowAlert: true,
      isModifyIOSS: false,
      form: {
        packageStatusName: '',
        storeCode: '',
        platOrderStatus: '',
        packageCode: '',
        platformCodeName: '',
        orderStatus: '',
        omOrderId: '',
        siteCode: '',
        mainSellerName: '',
        platOrderId: [],
        orderTypeName: '',
        mainCustomerServiceName: '',

        channelCode: '',
        warehouseCode: '',
        weight: '', // 实际重量
        trialWeight: '', // 试算重量
        wmsOrderNo: '',
        ifOnlineChannel: '',
        wmsStatusName: '',
        wmsSubStatusName: '',
        isVirtualWarehouse: '',
        trackCode1: '',
        trackCode2: '',

        receiveCountryCode: '',
        receiveFullName: '',
        socialContact: '',
        receiveDeltaProvince: '',
        receiveCity: '',
        taxNumber: '',
        receiveZip: '',
        phoneNumber: '',
        mobileNo: '',
        receiveEmail: '',
        receiveAddressOne: '',
        receiveAddressTwo: '',
        vatPayCode: '',

        paymentAmount: '',
        trialSalesPrice: '',
        actualSalesPrice: '',
        sellerIncomeAmount: '',
        trialFreightCost: '',
        actualFreightCost: '',
        sellerIncomeFreight: '',
        trialPackageCost: '',
        actualPackageCost: '',
        trialOrderAmount: '',
        trialProfit: '',
        usd2RmbExchangeRate: '',
        actualProfit: '',
        platformTradeAmount: ''
      },
      detailRow1: Object.freeze(
        [
          [
            { label: '包裹状态', prop: 'packageStatusName' },
            { label: '销售店铺', prop: 'storeName' },
            { label: '平台状态', prop: 'platOrderStatus' },

            { label: '包裹单号', prop: 'packageCode' },
            { label: '销售平台', prop: 'platformCodeName' },
            { label: '订单状态', prop: 'orderStatus' },

            { label: 'OMS单号', prop: 'omOrderId' },
            { label: '销售站点', prop: 'siteCode' },
            { label: '发货类型', prop: 'shippingType' },

            { label: '平台单号', prop: 'platOrderId' },
            { label: '订单来源', prop: 'orderTypeName' },
            { label: '客服人员', prop: 'mainCustomerServiceName' },

            { label: '', prop: '', sep: ' ' },
            { label: '', prop: '', sep: ' ' },
            { label: '销售人员', prop: 'mainSellerName' }
          ],
          [
            { label: '实际重量', prop: 'weight' },
            { label: '发货仓库', prop: 'warehouseName' },
            { label: '跟踪号1', prop: 'trackCode1' },
            { label: '试算重量', prop: 'trialWeight' },
            { label: '物流渠道', prop: 'channelFullName' },
            { label: '跟踪号2', prop: 'trackCode2' },
            { label: '仓库单号', prop: 'wmsOrderNo' },
            { label: '渠道类型', prop: 'ifOnlineChannel' },
            { label: '仓库包裹状态', prop: 'wmsStatusName' },
            { label: '仓库包裹子状态', prop: 'wmsSubStatusName' },
            { label: '虚仓发货', prop: 'isVirtualWarehouse' },
            { label: 'IOSS号', prop: 'vatPayCode' }
          ]
        ]),
      detailRow2: Object.freeze(
        [
          // 地址信息 共2列
          [
            [
              { label: '收件人', prop: 'receiveFullName' },
              { label: '省/州', prop: 'receiveDeltaProvince' },
              { label: '邮编', prop: 'receiveZip' },
              { label: '固定电话', prop: 'phoneNumber' },
              { label: '移动电话', prop: 'mobileNo' }
            ],
            [
              { label: '国家简称', prop: 'receiveCountryCode', class: 'fixed-class' },
              { label: '城市', prop: 'receiveCity' },
              { label: '买家邮箱', prop: 'receiveEmail' },
              { label: '地址一', prop: 'receiveAddressOne' },
              { label: '地址二', prop: 'receiveAddressTwo' }
            ]
          ],

          // 金额信息  共3列
          [
            [
              { label: '订单总金额(除税)', prop: 'paymentAmount' },
              { label: '卖家实收金额', prop: 'sellerIncomeAmount' },
              { label: '卖家实收运费', prop: 'sellerIncomeFreight' },
              { label: '试算包裹总金额', prop: 'trialOrderAmount' },
              { label: '平台交易费分摊', prop: 'platformTradeAmount' }

            ],
            [
              { label: '试算包裹销售价', prop: 'trialSalesPrice' },
              { label: '试算运费成本', prop: 'trialFreightCost' },
              { label: '试算包裹成本', prop: 'trialPackageCost' },
              { label: '试算包裹利润', prop: 'trialProfit' },
              { label: '美元转CNY汇率', prop: 'usd2RmbExchangeRate' }
            ],
            [
              { label: '出库包裹销售价', prop: 'actualSalesPrice' },
              { label: '出库运费成本', prop: 'actualFreightCost' },
              { label: '出库包裹成本', prop: 'actualPackageCost' },
              { label: '出库包裹利润', prop: 'actualProfit' }
            ]
          ]
        ]),
      originVatPayCode: undefined,
      addres: {
        id: '',
        buyerId: '',
        mobileNo: '',
        personalIdentificationNumber: '',
        phoneNumber: '',
        receiveAddressOne: '',
        receiveAddressTwo: '',
        receiveCity: '',
        receiveCountryCode: '',
        receiveDeltaProvince: '',
        receiveEmail: '',
        receiveFullName: '',
        receiveZip: '',
        socialContact: '',
        taxNumber: '' // 税号
      },
      modifiedAddress: null,
      omOrderId: '',
      packageStatus: undefined,
      sheetUrl: '',
      packageDetailVO: null,
      omOrderMain: null
    }
  },
  created() {
    this.$emit('title', '包裹详情')
    this.getDetail()
  },
  methods: {
    getSep(i, k, prop) {
      if (['usd2RmbExchangeRate'].includes(prop)) return '：'
      return i === 0 ? '：' : (k === 0 ? '：USD' : '：RMB')
    },
    formatterMoney(price) {
      if (price === 0) {
        return 'NA'
      }
      if (price === null || price === undefined) {
        return price
      } else {
        return parseFloat(price).toFixed(2)
      }
    },
    getDetail() {
      const { packageCode } = this
      getPackageDetails(packageCode).then(({ data }) => {
        this.packageDetailVO = Object.assign({}, data)
        Object.entries(data).forEach(([key, value]) => {
          this.form[key] = value ?? ''
          if (key === 'ruleId') this.form.isVirtualWarehouse = data[key] !== -1 ? '是' : '否'
          else if (key === 'platOrderIds') this.form.platOrderId = value
          else if (['trialWeight', 'weight'].includes(key) && value) this.form[key] = parseFloat(value ?? 0).toFixed(2) + 'g'
          else if (this.addres[key] !== undefined) this.addres[key] = value ?? ''
        })

        const c = data.channelCode ? `(${data.channelCode})` : ''
        this.form.channelFullName = (data.channelName || '') + c
        this.form.ifOnlineChannel = ['', '线上渠道', '线下渠道'][data.ifOnlineChannel]
        this.virtualRuleData.country = data.receiveCountryCode
        this.virtualRuleData.platCode = data.platformCode
        const {
          trialWeight, logisticsPropertyName = '', omOrderId, buttonInfo, exceptionType, amountDesc = '',
          exceptionTypeName: title, exceptionMsg: msg, channelCode, warehouseCode, packageStatus, sheetJson, ruleId
        } = data
        const code = ruleId === -1 ? warehouseCode : 'VIRTUAL,' + ruleId

        this.omOrderId = omOrderId
        this.buttonInfo = buttonInfo
        this.exceptionType = exceptionType
        this.exception = { title, msg }
        this.timeData = [data]

        this.channelForm = {
          trialWeight,
          logisticsProperty: logisticsPropertyName.join('，'),
          packageCode,
          channelCode,
          warehouseCode: code,
          isVirtualWarehouse: data.ruleId !== -1 ? '是' : '否',
          ruleId
        }
        this.amountDesc = amountDesc
        this.packageStatus = packageStatus
        this.sheetUrl = sheetJson
        this.modifiedAddress = null
      }).finally(() => {
        this.closeAlert(this.buttonInfo.topExceptionMenu)
      })
    },
    cancelModifyIOSS() {
      this.form.vatPayCode = this.originVatPayCode
      this.isModifyIOSS = false
    },
    modifyIOSS() {
      if (this.isModifyIOSS) {
        const vp = this.form.vatPayCode
        if (vp !== this.originVatPayCode) {
          this.originVatPayCode = vp
          this.omOrderMain = { vatPayCode: vp }
        }
      }
      this.isModifyIOSS = !this.isModifyIOSS
    },
    modifyOrderAddres() {
      const data = Object.assign({}, this.addres)
      let isNotChanged = true
      if (this.updating) return
      this.updating = true
      Object.keys(data).forEach(key => {
        if (data[key] !== this.form[key]) {
          data[key] = this.form[key]
          isNotChanged = false
        }
      })
      if (isNotChanged) { // 地址信息没有（/再次）被修改
        this.isModifyAddres = false
        this.updating = false
        return
      }
      Object.assign(this.packageDetailVO, data)
      data.packageCode = this.form.packageCode
      this.modifiedAddress = data

      setTimeout(() => {
        this.$message.success('地址已保存到本地, 请勿刷新当前页面')
        Object.assign(this.addres, data)
        this.isModifyAddres = false
        this.updating = false
      }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
