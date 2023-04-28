<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="demo-form-inline form-col">
    <div class="el-form-item tr">
      <el-button type="primary" size="mini" @click="editOption">编辑常规项</el-button>
    </div>
    <el-row>
      <el-col v-if="isShowPay" :span="12" :gutter="10">
        <el-form-item label="支付模板" prop="payId">
          <el-select v-model="form.payId" filterable placeholder="请选择" class="g-w100" @change="(value) => getPayVal(value, undefined, 'changed')">
            <el-option v-for="item in payTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退货模板" prop="returnId">
          <el-select v-model="form.returnId" filterable placeholder="请选择" class="g-w100" @change="getReturnVal">
            <el-option v-for="item in returnTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="买家要求" prop="buyerId">
          <el-select v-model="form.buyerId" filterable placeholder="请选择" class="g-w100" @change="getBuyerVal">
            <el-option v-for="item in buyerTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="运输模板" prop="transportId">
          <el-select v-model="form.transportId" filterable placeholder="请选择" class="g-w100" @change="getTransVal">
            <el-option v-for="item in transportTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getPolicyList, getPolicyDetails, getPolicyDefaults } from '@/api/ebay/template.js'
import { deepClone } from '@/util/util'
import editGeneralOption from './editGeneralOption.vue'
export default {
  name: 'GenaralOption',
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 请求详细信息加载状态
    productLoading: Number,
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isShowPay: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      payTemplateList: [],
      returnTemplateList: [],
      buyerTemplateList: [],
      transportTemplateList: [],
      form: {},
      params: {},
      rules: {
        payId: [{ required: true, message: '请选择支付模板', trigger: 'change' }]
        // returnId: [{ required: true, message: '请选择退货模板', trigger: 'change' }],
        // buyerId: [{ required: true, message: '请选择买家要求模板', trigger: 'change' }],
        // transportId: [{ required: true, message: '请选择运输模板', trigger: 'change' }]
      },
      generalOptionInfo: {
        paymentInfo: {},
        returnInfo: {},
        shippingInfo: {},
        buyerRequirementInfo: {}
      },
      sellingPrice: '',
      editedForm: {},
      init: true
    }
  },
  watch: {
    baseProductInfo(val) {
      const { listingVariations } = deepClone(this.baseProductInfo)
      if (listingVariations && listingVariations.length) {
        const priceList = listingVariations.map(item => item.startPrice)
        this.sellingPrice = priceList.join()
      }
    },
    generalOptionInfo: {
      handler(newV) {
        if (!this.isEdit) return
        this.selectedTempId(newV)
      },
      deep: true
    }
  },
  methods: {
    handlePayInfo(data, changed) {
      const { id, policyName, policyDesc, policyInfo } = data
      this.$set(this.form, 'payId', id)
      const obj = {
        paymentInstructions: policyDesc,
        paymentProfileId: id,
        paymentProfileName: policyName,
        paypalEmailAddress: policyInfo.paymentEmailAddress
      }
      if (JSON.stringify(this.editedForm) === '{}') {
        this.generalOptionInfo.paymentInfo = obj
      } else {
        this.editedForm.paymentInfo = obj
      }
      (changed || this.init) && this.$emit('payIdChange', this.generalOptionInfo.paymentInfo.paypalEmailAddress, this.init, changed)
      this.init = false
    },
    handleReturnInfo(data) {
      const { id, policyName, policyInfo } = data
      this.$set(this.form, 'returnId', id)
      const obj = {
        returnProfileId: id,
        returnProfileName: policyName,
        description: policyInfo.content,
        returnsAcceptedOption: policyInfo.accepted || 'ReturnsAccepted',
        refundOption: policyInfo.type, // 退款方式
        returnsWithinOption: policyInfo.days, // 退款天数
        shippingCostPaidByOption: policyInfo.costPaidType // 运费承担
      }
      if (JSON.stringify(this.editedForm) === '{}') {
        this.generalOptionInfo.returnInfo = obj
      } else {
        this.editedForm.returnInfo = obj
      }
    },
    handleBuyerInfo(data) {
      const { id, policyName, policyInfo } = data
      this.$set(this.form, 'buyerId', id)
      const obj = {
        buyerRequirementProfileId: id,
        buyerRequirementProfileName: policyName,
        disableBuyerRequirements: policyInfo.isBuyerLimit,
        itemMaximumItemCount: policyInfo.maximumCount,
        maximumUnpaidItemStrikesInfoCount: policyInfo.unpaidCount,
        maximumUnpaidItemStrikesInfoPeriod: policyInfo.unpaidPeriod,
        minimumFeedbackScore: policyInfo.feedbackScore, // 最低买家评分
        shipToRegistrationCountry: policyInfo.shipToRegistrationCountry
      }
      if (JSON.stringify(this.editedForm) === '{}') {
        this.generalOptionInfo.buyerRequirementInfo = obj
      } else {
        this.editedForm.buyerRequirementInfo = obj
      }
    },
    handleTransInfo(data) {
      const { id, policyName, policyInfo } = data
      this.$set(this.form, 'transportId', id)
      if (policyInfo.domesticInfo && policyInfo.domesticInfo.length) { // 处理国内运输方式明细
        policyInfo.domesticInfo = this.handleField(policyInfo.domesticInfo)
      }
      if (policyInfo.intlInfo && policyInfo.intlInfo.length) { // 处理国际运输方式明细
        policyInfo.intlInfo = this.handleField(policyInfo.intlInfo)
      }
      const obj = {
        shippingProfileId: id,
        shippingProfileName: policyName,
        country: policyInfo.countryOrRegion,
        location: policyInfo.listingLocation,
        postcode: policyInfo.postCode, // 邮编
        dispatchTimeMax: policyInfo.dispatchTimeMax,
        domesticShippingServiceOptionList: policyInfo.domesticInfo,
        internationalServiceOptionsList: policyInfo.intlInfo
      }
      if (JSON.stringify(this.editedForm) === '{}') {
        this.generalOptionInfo.shippingInfo = obj
      } else {
        this.editedForm.shippingInfo = obj
      }
    },
    handleField(arr) { // 属性重命名
      return JSON.parse(JSON.stringify(arr).replace(/freightAdditional/g, 'shippingServiceAdditionalCost').replace(/freight/g, 'shippingServiceCost').replace(/isFree/g, 'freeShipping').replace(/shipToLocation/g, 'shippingToLocations'))
    },
    getPayVal(val, amounts, changed) {
      const amount = amounts === undefined ? this.sellingPrice : amounts
      if (val) {
        const params = {
          id: val,
          storeCode: this.params.storeCode,
          siteCode: this.params.siteCode,
          amounts: amount,
          policyType: 'PAYMENT'
        }
        getPolicyDetails(params).then(res => {
          this.handlePayInfo(res.data, changed)
        })
      }
    },
    getReturnVal(val) {
      if (val) {
        getPolicyDetails({ id: val, policyType: 'RETURN_POLICY' }).then(res => {
          this.handleReturnInfo(res.data)
        })
      }
    },
    getBuyerVal(val) {
      if (val) {
        getPolicyDetails({ id: val, policyType: 'BUYER_REQUIREMENTS' }).then(res => {
          this.handleBuyerInfo(res.data)
        })
      }
    },
    getTransVal(val) {
      if (val) {
        getPolicyDetails({ id: val, policyType: 'SHIPPING' }).then(res => {
          this.handleTransInfo(res.data)
        })
      }
    },
    // 获取模板列表
    async getPolicyTemplate(publishSiteCode, storeCode) {
      this.params = {
        storeCode: storeCode,
        siteCode: publishSiteCode
      }
      this.payTemplateList = await this.getPolicyPage('PAYMENT', { storeCode: storeCode })
      this.returnTemplateList = await this.getPolicyPage('RETURN_POLICY')
      this.buyerTemplateList = await this.getPolicyPage('BUYER_REQUIREMENTS', { storeCode: storeCode })
      this.transportTemplateList = await this.getPolicyPage('SHIPPING')
    },
    getPolicyPage(type, obj) {
      const params = Object.assign(obj || this.params, { policyType: type })
      return getPolicyList(params).then(res => res.data)
    },
    // 站点或店铺改变，获取默认模板详情
    getDefaultTemplateDetails(publishSiteCode, storeCode) {
      const params = {
        storeCode: storeCode,
        siteCode: publishSiteCode
      }
      getPolicyDefaults(params).then(res => {
        const data = res.data
        // 清空上一次结果
        this.generalOptionInfo = {
          paymentInfo: {},
          returnInfo: {},
          shippingInfo: {},
          buyerRequirementInfo: {}
        }
        // 清空编辑中的值
        this.editedForm = {}
        data.forEach(item => {
          if (item.policyType === 'PAYMENT') {
            this.handlePayInfo(item)
          } else if (item.policyType === 'RETURN_POLICY') {
            this.handleReturnInfo(item)
          } else if (item.policyType === 'BUYER_REQUIREMENTS') {
            this.handleBuyerInfo(item)
          } else if (item.policyType === 'SHIPPING') {
            this.handleTransInfo(item)
          }
        })
      })
    },
    selectedTempId(obj) {
      const { paymentInfo, buyerRequirementInfo, returnInfo, shippingInfo } = obj
      if (paymentInfo && paymentInfo.paymentProfileId) {
        paymentInfo.paymentProfileId = String(paymentInfo.paymentProfileId)
        this.$set(this.form, 'payId', paymentInfo.paymentProfileId)
      }
      if (buyerRequirementInfo && buyerRequirementInfo.buyerRequirementProfileId) {
        buyerRequirementInfo.buyerRequirementProfileId = String(buyerRequirementInfo.buyerRequirementProfileId)
        this.$set(this.form, 'buyerId', buyerRequirementInfo.buyerRequirementProfileId)
      }
      if (returnInfo && returnInfo.returnProfileId) {
        returnInfo.returnProfileId = String(returnInfo.returnProfileId)
        this.$set(this.form, 'returnId', returnInfo.returnProfileId)
      }
      if (shippingInfo && shippingInfo.shippingProfileId) {
        shippingInfo.shippingProfileId = String(shippingInfo.shippingProfileId)
        this.$set(this.form, 'transportId', shippingInfo.shippingProfileId)
      }
    },
    // 编辑常规项
    editOption() {
      if (!this.params.siteCode) return this.$message.warning('请选择刊登站点')
      // console.log('this.editedForm', this.editedForm)
      // 是否已经编辑过常规项
      // const row = JSON.stringify(this.editedForm) === '{}' ? deepClone(this.generalOptionInfo) : deepClone(this.editedForm)
      const row = deepClone(this.generalOptionInfo)
      this.$modal({
        title: '编辑常规项',
        component: editGeneralOption,
        width: '1000px',
        data: {
          payTemplateList: this.payTemplateList,
          returnTemplateList: this.returnTemplateList,
          buyerTemplateList: this.buyerTemplateList,
          transportTemplateList: this.transportTemplateList,
          row: row, // 已选模板详情
          params: this.params, // 当前选中店铺和刊登站点
          sellingPrice: this.sellingPrice,
          isShowPay: this.isShowPay
        },
        callback: (refresh) => {
          if (refresh) {
            // console.log('编辑后的值: ', refresh)
            // this.editedForm = refresh
            this.generalOptionInfo = refresh
            // paypal账号改变，更新售价
            if (row.paymentInfo.paypalEmailAddress !== this.generalOptionInfo.paymentInfo.paypalEmailAddress) {
              this.$emit('payIdChange', this.generalOptionInfo.paymentInfo.paypalEmailAddress)
            }
            // 更新父组件列表选中值
            this.selectedTempId(refresh)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline {
  width: 90%;
}
</style>
