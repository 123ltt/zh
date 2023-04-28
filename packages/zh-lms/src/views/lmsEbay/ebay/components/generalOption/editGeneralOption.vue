<template>
  <basic-container>
    <el-collapse v-model="activeNames" class="border-0 edit-option-box">
      <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
        <el-collapse-item v-if="isShowPay" name="payInfo">
          <collapse-title slot="title" title="支付信息" />
          <el-col :span="20">
            <el-form-item label="支付模板" prop="paymentInfo.paymentProfileId">
              <el-select v-model="form.paymentInfo.paymentProfileId" filterable placeholder="请选择" class="g-w100" @change="getPayVal">
                <el-option v-for="item in payTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="paypal">
              <div>{{ form.paymentInfo.paypalEmailAddress }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="付款说明" prop="paymentInfo.paymentInstructions">
              <el-input v-model="form.paymentInfo.paymentInstructions" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" style="width: 70%" />
            </el-form-item>
          </el-col>
        </el-collapse-item>
        <el-collapse-item name="transInfo">
          <collapse-title slot="title" title="运输信息" />
          <el-col :span="20">
            <el-form-item label="运输模板" prop="shippingInfo.shippingProfileId">
              <el-select v-model="form.shippingInfo.shippingProfileId" filterable placeholder="请选择" class="g-w100" @change="getTransVal">
                <el-option v-for="item in transportTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品所在地" prop="shippingInfo.location">
              <el-input v-model="form.shippingInfo.location" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="2" />
          <el-col :span="10">
            <el-form-item label="国家或地区" prop="shippingInfo.country">
              <el-select v-model="form.shippingInfo.country" filterable clearable placeholder="请选择国家或地区" class="w-100">
                <el-option v-for="item in countryOption" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="邮编" prop="shippingInfo.postcode">
              <el-input v-model="form.shippingInfo.postcode" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="2" />
          <el-col :span="10">
            <el-form-item label="处理时间" prop="shippingInfo.dispatchTimeMax">
              <el-select v-model="form.shippingInfo.dispatchTimeMax" filterable clearable placeholder="请选择处理时间" style="width:80%;margin-right:10px">
                <el-option v-for="item in dispatchTimeMaxOption" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>工作日
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="国内运输" required>
              <el-card shadow="never">
                <el-row :gutter="24">
                  <el-col :span="6">运输方式</el-col>
                  <el-col :span="6">运费</el-col>
                  <el-col :span="6">额外每件加收</el-col>
                  <el-col :span="3" />
                  <el-col :span="3" />
                </el-row>
                <el-row v-for="(item, i) in form.shippingInfo.domesticShippingServiceOptionList" :key="i" :gutter="20" style="margin-bottom:4px;">
                  <el-col :span="6">
                    <el-form-item :prop="'shippingInfo.domesticShippingServiceOptionList.'+ i +'.shippingService'"
                                  :rules="{required: true, message: '请选择国内运输方式', trigger: 'change'}"
                    >
                      <el-select v-model="item.shippingService" filterable class="w-100">
                        <el-option v-for="(list,index) in shippingServiceDetails" :key="index" :label="list.name" :value="list.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item :prop="'shippingInfo.domesticShippingServiceOptionList.'+ i +'.shippingServiceCost'"
                                  :rules="{required: true, message: '请输入运费金额', trigger: ['blur','change']}"
                    >
                      <el-input
                        v-model="item.shippingServiceCost"
                        v-input.positive
                        :disabled="item.freeShipping"
                        size="mini"
                        type="text"
                        @input="() => { item.shippingServiceCost = toFixed2(item.shippingServiceCost) }"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input
                        v-model="item.shippingServiceAdditionalCost"
                        v-input.positive
                        :disabled="item.freeShipping"
                        @input="() => { item.shippingServiceAdditionalCost = toFixed2(item.shippingServiceAdditionalCost) }"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox v-model="item.freeShipping" @change="(value) => changeIsFree(value, i ,'domesticShippingServiceOptionList')">免运费</el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-button icon="el-icon-plus" circle size="mini" @click="addInfo('domesticShippingServiceOptionList')" />
                    <el-button icon="el-icon-minus" circle size="mini" :disabled="i===0" @click="delInfo('domesticShippingServiceOptionList',i)" />
                  </el-col>
                </el-row>
              </el-card>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="国际运输">
              <el-card shadow="never">
                <el-row :gutter="24">
                  <el-col :span="6">运输方式</el-col>
                  <el-col :span="6">运费</el-col>
                  <el-col :span="6">额外每件加收</el-col>
                  <el-col :span="3" />
                  <el-col :span="3" />
                </el-row>
                <div v-for="(item, i) in form.shippingInfo.internationalServiceOptionsList " :key="i">
                  <el-row :gutter="20" style="margin-bottom:4px;">
                    <el-col :span="6">
                      <el-form-item :prop="'shippingInfo.internationalServiceOptionsList.'+ i +'.shippingService'"
                                    :rules="item.shippingServiceCost||item.shippingToLocations.length?{required: true, message: '请选择国际运输方式', trigger: 'change'}:{required:false}"
                      >
                        <el-select v-model="item.shippingService" filterable clearable class="w-100">
                          <el-option v-for="(citem,index) in shippingInternationalServiceDetails" :key="index" :label="citem.name" :value="citem.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item :prop="'shippingInfo.internationalServiceOptionsList.'+ i +'.shippingServiceCost'"
                                    :rules="item.shippingService?{
                                      required: true, message: '运费不能为空', trigger: 'blur'
                                    }:{required:false}"
                      >
                        <el-input v-model="item.shippingServiceCost" v-input.positive :disabled="item.freeShipping" size="mini" @input="() => { item.shippingServiceCost = toFixed2(item.shippingServiceCost) }" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-model="item.shippingServiceAdditionalCost" v-input.positive :disabled="item.freeShipping" size="mini" @input="() => { item.shippingServiceAdditionalCost = toFixed2(item.shippingServiceAdditionalCost) }" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <!-- <el-checkbox v-model="item.freeShipping" @change="(value) => changeIsFree(value, i ,'internationalServiceOptionsList')">免运费</el-checkbox> -->
                    </el-col>
                    <el-col :span="3">
                      <el-button icon="el-icon-plus" circle size="mini" @click="addInfo('internationalServiceOptionsList')" />
                      <el-button icon="el-icon-minus" circle size="mini" :disabled="i===0" @click="delInfo('internationalServiceOptionsList',i)" />
                    </el-col>
                  </el-row>
                  <div>
                    <span class="me-3">运输地区</span>
                    <el-checkbox v-model="item.isALLCheckShoppingLocation" class="mb-4" :indeterminate="item.isIndeterminate" @change="(value)=>changeAllCheck(value, i)">全选</el-checkbox>
                  </div>
                  <el-form-item :prop="'shippingInfo.internationalServiceOptionsList.' + i + '.shippingToLocations'"
                                :rules="item.shippingService?{
                                  required: true, message: '运输地区不能为空', trigger: 'change'
                                }:{required:false}"
                  >
                    <el-checkbox-group v-model="item.shippingToLocations" @change="(value)=>handleCheckedLocation(value,i)">
                      <el-checkbox v-for="citem in shoppingLocationDetails" :key="citem.name" :label="citem.value">{{ citem.name }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
              </el-card>
            </el-form-item>
          </el-col>
        </el-collapse-item>
        <el-collapse-item name="returnInfo">
          <collapse-title slot="title" title="退货信息" />
          <el-col :span="20">
            <el-form-item label="退货模板" prop="returnId">
              <el-select v-model="form.returnInfo.returnProfileId" filterable placeholder="请选择" class="g-w100" @change="getReturnVal">
                <el-option v-for="item in returnTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="是否接受退货" prop="returnInfo.returnsAcceptedOption">
              <el-radio-group v-model="form.returnInfo.returnsAcceptedOption">
                <el-radio v-for="(v,item,index) in constList.businessPolicyReturnAccepted" :key="index" :label="item">{{ v }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="form.returnInfo.returnsAcceptedOption === 'ReturnsAccepted'">
            <el-col :span="10">
              <el-form-item label="退款天数" label-width="160px" prop="returnInfo.returnsWithinOption" :rules="form.returnInfo.returnsAcceptedOption === 'ReturnsAccepted'?rules['returnInfo.returnsWithinOption']:[{required:false}]">
                <el-select v-model="form.returnInfo.returnsWithinOption" filterable clearable placeholder="请选择" class="w-100">
                  <el-option v-for="(v,item,index) in constList.businessPolicyReturnDays" :key="index" :label="v" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" />
            <el-col :span="10">
              <el-form-item label="退款方式" label-width="160px" prop="returnInfo.refundOption" :rules="form.returnInfo.returnsAcceptedOption === 'ReturnsAccepted'?rules['returnInfo.refundOption']:[{required:false}]">
                <el-select v-model="form.returnInfo.refundOption" filterable clearable placeholder="请选择" class="w-100">
                  <el-option v-for="(v,keys,index) in constList.businessPolicyReturnType" :key="index" :label="v" :value="keys" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="运费承担" label-width="160px" prop="returnInfo.shippingCostPaidByOption" :rules="form.returnInfo.returnsAcceptedOption === 'ReturnsAccepted'?rules['returnInfo.shippingCostPaidByOption']:[{required:false}]">
                <el-radio-group v-model="form.returnInfo.shippingCostPaidByOption">
                  <el-radio v-for="(v,item,index) in constList.businessPolicyReturnCostPaid" :key="index" :label="item">{{ v }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="siteCodeArr.includes(params.siteCode)" :span="21">
              <el-form-item label="退货政策" label-width="160px" prop="returnInfo.description" :rules="form.returnInfo.returnsAcceptedOption === 'ReturnsAccepted'?rules['returnInfo.description']:[{required:false}]">
                <el-input v-model="form.returnInfo.description" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" :maxlength="siteCodeFive.includes(params.siteCode) ? 5000 : 8000" show-word-limit />
              </el-form-item>
            </el-col>
          </template>
        </el-collapse-item>
        <el-collapse-item name="buyerRequire">
          <collapse-title slot="title" title="买家要求" />
          <el-col :span="20">
            <el-form-item label="买家要求模板" prop="buyerRequirementInfo.buyerRequirementProfileId">
              <el-select v-model="form.buyerRequirementInfo.buyerRequirementProfileId" filterable placeholder="请选择" class="g-w100" @change="getBuyerVal">
                <el-option v-for="item in buyerTemplateList" :key="item.id" :label="item.policyName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="买家要求" prop="buyerRequirementInfo.disableBuyerRequirements">
              <el-radio-group v-model="form.buyerRequirementInfo.disableBuyerRequirements" :disabled="false">
                <el-radio :label="false">允许所有买家购买</el-radio>
                <el-radio :label="true">禁止以下买家购买</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.buyerRequirementInfo.disableBuyerRequirements">
              <el-checkbox-group v-model="buyerLimitChecked">
                <el-checkbox key="buyerLimit1" label="buyerLimit1">
                  <span>有
                    <el-select v-model="form.buyerRequirementInfo.maximumUnpaidItemStrikesInfoCount" style="width: 31%" @click.native.prevent>
                      <el-option v-for="item in unpaidCountList" :key="item" :label="item" :value="item" />
                    </el-select>个拒绝付款的交易在
                  </span>
                  <el-select v-model="form.buyerRequirementInfo.maximumUnpaidItemStrikesInfoPeriod" style="width: 31%" @click.native.prevent>
                    <el-option v-for="item in unpaidPeriodList" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-checkbox>
                <el-checkbox key="shipToRegistrationCountry" label="shipToRegistrationCountry">注册地不在我的运输范围内</el-checkbox>
                <el-checkbox key="buyerLimit3" label="buyerLimit3">
                  <span>有竞标或购买我的产品在过去10天并达到我的限制
                    <el-select v-model="form.buyerRequirementInfo.itemMaximumItemCount" style="width: 31%" @click.native.prevent>
                      <el-option v-for="item in maximumCountList" :key="item" :label="item" :value="item" />
                    </el-select>
                  </span>
                </el-checkbox>
                <el-checkbox key="zeroFeedback" label="zeroFeedback">
                  <span>仅针对买家评分小于或等于
                    <el-select v-model="form.buyerRequirementInfo.minimumFeedbackScore" style="width: 31%" @click.native.prevent>
                      <el-option v-for="item in scoreList" :key="item" :label="item" :value="item" />
                    </el-select>
                  </span>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-collapse-item>
      </el-form>
    </el-collapse>
    <div class="text-end">
      <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
      <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('form')">保存</el-button>
    </div>
  </basic-container>
</template>

<script>
import collapseTitle from '../collapseTitle.vue'
import { getBuyerItems, getShoppingItems, getPolicyDetails } from '@/api/ebay/template.js'
import { ebayconstants } from '@/api/ebay/ebay.js'
import { deepClone } from '@/util/util'
import { toFixed2 } from '@/views/lmsAmazon/amazon/components/addListing.handle.js'
import { storeOptionsWithPlatformCode } from '@/api/sams'

export default {
  name: 'EditGenaralOption',
  components: { collapseTitle },
  props: {
    payTemplateList: Array,
    returnTemplateList: Array,
    buyerTemplateList: Array,
    transportTemplateList: Array,
    row: Object, // 已选模板详情
    params: Object, // 店铺，刊登站点
    sellingPrice: [String, Number], // 售价
    isShowPay: Boolean
  },
  data() {
    const validateLocation = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)) {
          callback(new Error('商品所在地不可以输入中文'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入商品所在地'))
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value) || value === '') {
        callback()
      } else {
        callback(new Error('邮编不可以输入中文'))
      }
    }
    return {
      toFixed2,
      constList: {},
      isBoolean: true,
      // 折叠面板默认展开
      activeNames: ['transInfo'],
      oldForm: {},
      form: {
        paymentInfo: {},
        returnInfo: {},
        shippingInfo: {
          domesticShippingServiceOptionList: [{
            shippingItemType: '',
            shippingServiceCost: '',
            shippingServiceAdditionalCost: '',
            freeShipping: false,
            shippingToLocations: []
          }],
          internationalServiceOptionsList: [{
            shippingItemType: '',
            shippingServiceCost: '',
            shippingServiceAdditionalCost: '',
            freeShipping: false,
            shippingToLocations: []
          }]
        },
        buyerRequirementInfo: {
          maximumUnpaidItemStrikesInfoCount: 2,
          maximumUnpaidItemStrikesInfoPeriod: 'Days_30',
          itemMaximumItemCount: 10,
          minimumFeedbackScore: 5
        }
      },
      rules: {
        'paymentInfo.paymentProfileId': [{ required: true, message: '请选择支付模板', trigger: 'change' }],
        'shippingInfo.location': [{ required: true, validator: validateLocation }],
        'shippingInfo.postcode': [{ validator: validateEmail }],
        'shippingInfo.country': [{ required: true, message: '请选择国家或地区', trigger: 'change' }],
        'shippingInfo.dispatchTimeMax': [{ required: true, message: '请选择处理时间', trigger: 'change' }],
        'returnInfo.returnsAcceptedOption': [{ required: true, message: '请选择是否接受退货', trigger: 'change' }],
        'returnInfo.returnsWithinOption': [{ required: true, message: '请选择退款天数', trigger: 'change' }],
        'returnInfo.refundOption': [{ required: true, message: '请选择退货方式', trigger: 'change' }],
        'returnInfo.shippingCostPaidByOption': [{ required: true, message: '请选择运费承担', trigger: 'change' }],
        // 'returnInfo.description': [{ required: true, message: '请输入退货政策', trigger: 'blur' }],
        'buyerRequirementInfo.disableBuyerRequirements': [{ required: true, message: '请选择买家要求', trigger: 'change' }]
      },
      // 买家要求
      buyerLimitChecked: [],
      unpaidCountList: [],
      unpaidPeriodList: [],
      maximumCountList: [],
      scoreList: [],
      // 运输模板
      countryOption: [], // 国家地区
      shippingServiceDetails: [],
      shippingServiceDetailsTemp: [],
      shippingInternationalServiceDetails: [], // 国际运输方式
      shippingInternationalServiceDetailsTemp: [], // 国际运输方式副本
      shoppingLocationDetails: [],
      dispatchTimeMaxOption: [],
      shoppingItem: {
        shippingItemType: '',
        shippingServiceCost: '',
        shippingServiceAdditionalCost: '',
        freeShipping: false,
        shippingToLocations: []
      },
      siteCodeArr: ['DE', 'AT', 'FR', 'IT', 'ES'],
      siteCodeFive: ['FR', 'IT', 'ES'],
      storeName: '' // 店铺名
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    this.activeNames = ['transInfo']
    this.getStoreList()
    this.initData()
  },
  methods: {
    // 查询所有店铺code
    getStoreList() {
      storeOptionsWithPlatformCode({ platformCode: 'EB' }).then(res => {
        this.storeList = res.data
        this.storeName = this.storeList.find(item => item.candidateDisplayName === this.params.storeCode) && this.storeList.find(item => item.candidateDisplayName === this.params.storeCode).displayName
        this.getBuyerItems() // 获取买家要求项
        this.getEbayconstants() // 获取各种常量
      })
    },
    initData() {
      // console.log('传值：', this.row)
      const { paymentInfo, returnInfo, shippingInfo, buyerRequirementInfo } = this.row
      // 判断运输模板是否为空
      this.initShipping(shippingInfo, this.row)
      // 买家要求
      if (buyerRequirementInfo) this.initBuyer(buyerRequirementInfo)

      if (!paymentInfo) this.form.paymentInfo = {}
      if (!returnInfo) this.form.returnInfo = {}
      if (!buyerRequirementInfo) this.form.buyerRequirementInfo = {}
    },
    initShipping(shippingInfo, row) {
      if (shippingInfo && (shippingInfo.shippingProfileId || shippingInfo.location)) { // 或有国家（必填项），保存过
        this.form = deepClone(row)
        const { shippingInfo } = this.form
        if (shippingInfo.dispatchTimeMax) {
          shippingInfo.dispatchTimeMax = String(shippingInfo.dispatchTimeMax)
        }
        if (shippingInfo.domesticShippingServiceOptionList && !shippingInfo.domesticShippingServiceOptionList.length) { // 国内运输为空
          shippingInfo.domesticShippingServiceOptionList.push(deepClone(this.shoppingItem))
        }
        if (shippingInfo.internationalServiceOptionsList && !shippingInfo.internationalServiceOptionsList.length) { // 国际运输为空
          shippingInfo.internationalServiceOptionsList.push(deepClone(this.shoppingItem))
        }
      } else {
        // 运输模板设置默认值，便于用户输入
        this.form = Object.assign(deepClone(row), { shippingInfo: this.form.shippingInfo })
      }
    },
    initBuyer(buyerRequirementInfo) {
      const { disableBuyerRequirements, maximumUnpaidItemStrikesInfoCount, shipToRegistrationCountry, itemMaximumItemCount, minimumFeedbackScore } = buyerRequirementInfo
      if (disableBuyerRequirements) { // 禁止以下买家购买
        if (maximumUnpaidItemStrikesInfoCount) this.buyerLimitChecked.push('buyerLimit1')
        if (shipToRegistrationCountry) this.buyerLimitChecked.push('shipToRegistrationCountry')
        if (itemMaximumItemCount) this.buyerLimitChecked.push('buyerLimit3')
        if (minimumFeedbackScore) this.buyerLimitChecked.push('zeroFeedback') // 买家评分有值
      }
    },
    chagneSiteCode() {
      for (const i in this.constList.shippingItemType) {
        this.getShoppingItems(i)
      }
      this.getShoppingItems('ShippingServiceDetails', true)
    },
    getBuyerItems() {
      getBuyerItems({ siteCode: 'US', storeAccount: this.storeName }).then(res => {
        const { feedbackScoreData, maximumCountData, unpaidCountData, unpaidPeriodData } = res.data
        this.unpaidCountList = unpaidCountData
        this.unpaidPeriodList = unpaidPeriodData
        this.maximumCountList = maximumCountData
        this.scoreList = feedbackScoreData
      })
    },
    getEbayconstants() {
      ebayconstants().then(res => {
        this.constList = res.data.constants
        // 获取国家，处理时间，国内外运输方式，运输地区
        this.chagneSiteCode()
      })
    },
    getShoppingItems(itemType, international = false) {
      getShoppingItems({ siteCode: this.params.siteCode, storeAccount: this.storeName, itemType: itemType, international: international }).then(res => {
        const data = res.data
        if (itemType === 'CountryDetails') { // 国家
          this.countryOption = data.sort((a, b) => a.name.localeCompare(b.name))
        } else if (itemType === 'ShippingServiceDetails' && !international) { // 国内运输方式
          this.shippingServiceDetails = data.sort((a, b) => a.name.localeCompare(b.name))
          this.shippingServiceDetailsTemp = data.sort((a, b) => a.name.localeCompare(b.name))
        } else if (itemType === 'ShippingServiceDetails' && international) { // 国际运输方式
          this.shippingInternationalServiceDetails = data.sort((a, b) => a.name.localeCompare(b.name))
          this.shippingInternationalServiceDetailsTemp = data.sort((a, b) => a.name.localeCompare(b.name))
        } else if (itemType === 'ShippingLocationDetails') { // 运输地区
          this.shoppingLocationDetails = data
          // 处理国际运输地区是否多选
          const { internationalServiceOptionsList } = this.form.shippingInfo
          if (internationalServiceOptionsList && internationalServiceOptionsList.length) {
            internationalServiceOptionsList.forEach(item => {
              const checkedCount = item.shippingToLocations.length
              if (checkedCount && checkedCount === data.length) { // 全选
                item.isALLCheckShoppingLocation = true
                item.isIndeterminate = false
              } else if (checkedCount) { // 半选
                item.checkAll = false
                item.isIndeterminate = true
              } else { // 不选
                item.checkAll = false
                item.isIndeterminate = false
              }
            })
          }
        } else { // 处理时间
          this.dispatchTimeMaxOption = data
        }
      })
    },
    // 是否免运费
    changeIsFree(val, index, type) {
      if (val) {
        this.form.shippingInfo[type][index].shippingServiceCost = '0.00'
        this.form.shippingInfo[type][index].shippingServiceAdditionalCost = '0.00'
      } else {
        this.form.shippingInfo[type][index].shippingServiceCost = ''
        this.form.shippingInfo[type][index].shippingServiceAdditionalCost = ''
      }
    },
    addInfo(info) {
      const obj = deepClone(this.shoppingItem)
      if (info === 'internationalServiceOptionsList' && this.form.shippingInfo[info].length <= 4) {
        this.form.shippingInfo[info].push(obj)
      }
      if (info === 'domesticShippingServiceOptionList') {
        this.form.shippingInfo[info].push(obj)
      }
    },
    delInfo(info, index) {
      this.form.shippingInfo[info].splice(index, 1)
    },
    // 全选
    changeAllCheck(val, index) {
      if (val) {
        this.form.shippingInfo.internationalServiceOptionsList[index].shippingToLocations = this.shoppingLocationDetails.map(acc => acc.value)
      } else {
        this.form.shippingInfo.internationalServiceOptionsList[index].shippingToLocations = []
      }
      this.form.shippingInfo.internationalServiceOptionsList[index].isIndeterminate = false
    },
    // 运输地区change
    handleCheckedLocation(value, index) {
      const checkedCount = value.length
      const totalCount = this.shoppingLocationDetails.length
      const d = this.form.shippingInfo.internationalServiceOptionsList[index]
      this.form.shippingInfo.internationalServiceOptionsList.splice(index, 1, Object.assign(d, {
        isALLCheckShoppingLocation: totalCount && checkedCount === totalCount,
        isIndeterminate: checkedCount > 0 && checkedCount < totalCount
      }))
    },
    handlePayInfo(data) {
      const { id, policyName, policyDesc, policyInfo } = data
      this.form.paymentInfo = {
        paymentInstructions: policyDesc,
        paymentProfileId: id,
        paymentProfileName: policyName,
        paypalEmailAddress: policyInfo.paymentEmailAddress
      }
    },
    handleReturnInfo(data) {
      const { id, policyName, policyInfo } = data
      this.form.returnInfo = {
        returnProfileId: id,
        returnProfileName: policyName,
        description: policyInfo.content,
        returnsAcceptedOption: policyInfo.accepted || 'ReturnsAccepted',
        refundOption: policyInfo.type, // 退款方式
        returnsWithinOption: policyInfo.days, // 退款天数
        shippingCostPaidByOption: policyInfo.costPaidType // 运费承担
      }
    },
    handleBuyerInfo(data) {
      const { id, policyName, policyInfo } = data
      this.form.buyerRequirementInfo = {
        buyerRequirementProfileId: id,
        buyerRequirementProfileName: policyName,
        disableBuyerRequirements: policyInfo.isBuyerLimit,
        itemMaximumItemCount: policyInfo.maximumCount,
        maximumUnpaidItemStrikesInfoCount: policyInfo.unpaidCount,
        maximumUnpaidItemStrikesInfoPeriod: policyInfo.unpaidPeriod,
        minimumFeedbackScore: policyInfo.feedbackScore, // 最低买家评分
        shipToRegistrationCountry: policyInfo.shipToRegistrationCountry
      }
      this.initBuyer(this.form.buyerRequirementInfo)
    },
    handleTransInfo(data) {
      const { id, policyName, policyInfo } = data
      if (policyInfo.domesticInfo && policyInfo.domesticInfo.length) { // 处理国内运输方式明细
        policyInfo.domesticInfo = this.handleField(policyInfo.domesticInfo)
      }
      if (policyInfo.intlInfo && policyInfo.intlInfo.length) { // 处理国际运输方式明细
        policyInfo.intlInfo = this.handleField(policyInfo.intlInfo)
      }
      this.form.shippingInfo = {
        shippingProfileId: id,
        shippingProfileName: policyName,
        country: policyInfo.countryOrRegion,
        location: policyInfo.listingLocation,
        postcode: policyInfo.postCode, // 邮编
        dispatchTimeMax: policyInfo.dispatchTimeMax,
        domesticShippingServiceOptionList: policyInfo.domesticInfo,
        internationalServiceOptionsList: policyInfo.intlInfo
      }
      this.initShipping(this.form.shippingInfo, this.form)
    },
    handleField(arr) { // 属性重命名
      return JSON.parse(JSON.stringify(arr).replace(/freightAdditional/g, 'shippingServiceAdditionalCost').replace(/freight/g, 'shippingServiceCost').replace(/isFree/g, 'freeShipping').replace(/shipToLocation/g, 'shippingToLocations'))
    },
    // 模板改变
    getPayVal(val) {
      const params = {
        id: val,
        storeCode: this.params.storeCode,
        amounts: this.sellingPrice,
        policyType: 'PAYMENT'
      }
      getPolicyDetails(params).then(res => {
        this.handlePayInfo(res.data)
      })
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
    // 保存
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form)
          /* 买家要求提交校验 */
          const buyerRequire = this.form.buyerRequirementInfo
          const { disableBuyerRequirements, maximumUnpaidItemStrikesInfoCount, maximumUnpaidItemStrikesInfoPeriod, itemMaximumItemCount, minimumFeedbackScore } = buyerRequire
          if (disableBuyerRequirements && !this.buyerLimitChecked.length) return this.$message.warning('请至少选择一个禁止买家购买的条件')
          if (this.buyerLimitChecked.includes('buyerLimit1')) {
            if (!maximumUnpaidItemStrikesInfoCount) return this.$message.warning('请选择拒绝付款的交易数量')
            if (!maximumUnpaidItemStrikesInfoPeriod) return this.$message.warning('请选择拒绝付款的交易周期')
          } else {
            buyerRequire.maximumUnpaidItemStrikesInfoCount = null
            buyerRequire.maximumUnpaidItemStrikesInfoPeriod = null
          }
          if (this.buyerLimitChecked.includes('buyerLimit3')) {
            if (!itemMaximumItemCount) return this.$message.warning('请选择我的限制数量')
          } else {
            buyerRequire.itemMaximumItemCount = null
          }
          if (this.buyerLimitChecked.includes('zeroFeedback')) {
            if (!minimumFeedbackScore) return this.$message.warning('请选择买家评分')
          } else {
            buyerRequire.minimumFeedbackScore = null
          }
          this.form.buyerRequirementInfo = Object.assign(this.form.buyerRequirementInfo, {
            shipToRegistrationCountry: this.buyerLimitChecked.includes('shipToRegistrationCountry')
          })
          this.$parent.$emit('close', this.form)
        } else {
          this.activeNames = ['transInfo', 'returnInfo', 'payInfo', 'buyerRequire']
          return this.$message.error('请选择模板或者编辑常规项填写具体的信息')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.edit-option-box {
  padding: 0 10px 25px 10px;
  .el-collapse-item__wrap,.el-collapse-item__header {
    border-bottom: 0;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-col{
    margin-bottom: 1px;
  }
}
</style>
