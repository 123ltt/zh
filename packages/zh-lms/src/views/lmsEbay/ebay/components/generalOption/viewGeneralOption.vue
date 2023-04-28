<template>
  <basic-container>
    <el-collapse v-model="activeNames" class="view-option-box">
      <el-form ref="form" :model="form" size="mini" label-width="100px">
        <el-collapse-item name="payInfo">
          <collapse-title slot="title" title="支付信息" />
          <el-col :span="20">
            <el-form-item label="支付模板">
              <div class="value-color">{{ form.paymentInfo && form.paymentInfo.paymentProfileName ? form.paymentInfo.paymentProfileName : '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item v-if="form.paymentInfo.paymentProfileId" label="paypal" prop="paymentInfo.paypalEmailAddress">
              <div class="value-color">{{ form.paymentInfo.paypalEmailAddress }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="付款说明" prop="paymentInfo.paymentInstructions">
              <el-input v-model="form.paymentInfo.paymentInstructions" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" style="width: 70%" readonly />
            </el-form-item>
          </el-col>
        </el-collapse-item>
        <el-collapse-item name="transInfo">
          <collapse-title slot="title" title="运输信息" />
          <el-col :span="20">
            <el-form-item label="运输模板" prop="shippingInfo.shippingProfileName">
              <div class="value-color">{{ form.shippingInfo && form.shippingInfo.shippingProfileName ? form.shippingInfo.shippingProfileName : '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品所在地" prop="shippingInfo.location">
              <div class="value-color">{{ form.shippingInfo.location || '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="2" />
          <el-col :span="10">
            <el-form-item label="国家或地区" prop="shippingInfo.country">
              <div class="value-color">{{ form.shippingInfo.country || '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="邮编" prop="shippingInfo.postcode">
              <div class="value-color">{{ form.shippingInfo.postcode || '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="2" />
          <el-col :span="10">
            <el-form-item label="处理时间" prop="shippingInfo.dispatchTimeMax">
              <div class="value-color">{{ form.shippingInfo.dispatchTimeMax ? form.shippingInfo.dispatchTimeMax + ' 个工作日' : '-' }} </div>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="国内运输">
              <el-card shadow="never">
                <el-row :gutter="18">
                  <el-col :span="9">运输方式</el-col>
                  <el-col :span="6">运费</el-col>
                  <el-col :span="6">额外每件加收</el-col>
                  <el-col :span="3" />
                </el-row>
                <el-row v-for="(item, i) in form.shippingInfo.domesticShippingServiceOptionList" :key="i" :gutter="20" style="margin-bottom:4px;">
                  <el-col :span="9">
                    <el-form-item>
                      <g-text-ellipsis><div class="value-color">{{ item.shippingService }}</div></g-text-ellipsis>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <div class="value-color">{{ item.shippingServiceCost }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <div class="value-color">{{ item.shippingServiceAdditionalCost }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox v-model="item.freeShipping" disabled>免运费</el-checkbox>
                  </el-col>
                </el-row>
              </el-card>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="国际运输">
              <el-card shadow="never">
                <el-row :gutter="18">
                  <el-col :span="9">运输方式</el-col>
                  <el-col :span="6">运费</el-col>
                  <el-col :span="6">额外每件加收</el-col>
                  <!-- <el-col :span="3" /> -->
                </el-row>
                <div v-for="(item, i) in form.shippingInfo.internationalServiceOptionsList " :key="i">
                  <el-row :gutter="20" style="margin-bottom:4px;">
                    <el-col :span="9">
                      <el-form-item>
                        <g-text-ellipsis><div class="value-color">{{ item.shippingService }}</div></g-text-ellipsis>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <div class="value-color">{{ item.shippingServiceCost }}</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <div class="value-color">{{ item.shippingServiceAdditionalCost }}</div>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="3">
                      <el-checkbox v-model="item.freeShipping" disabled>免运费</el-checkbox>
                    </el-col> -->
                  </el-row>
                  <div>
                    <span class="me-3">运输地区</span>
                    <el-checkbox v-model="item.isALLCheckShoppingLocation" class="mb-4" :indeterminate="item.isIndeterminate" disabled>全选</el-checkbox>
                  </div>
                  <el-checkbox-group v-model="item.shippingToLocations" disabled>
                    <el-checkbox v-for="citem in shoppingLocationDetails" :key="citem.name" :label="citem.value">{{ citem.name }}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-card>
            </el-form-item>
          </el-col>
        </el-collapse-item>
        <el-collapse-item name="returnInfo">
          <collapse-title slot="title" title="退货信息" />
          <el-col :span="20">
            <el-form-item label="退货模板" prop="returnId">
              <div class="value-color">{{ form.returnInfo&& form.returnInfo.returnProfileName ? form.returnInfo.returnProfileName : '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="是否接受退货" prop="returnInfo.returnsAcceptedOption">
              <el-radio-group v-model="form.returnInfo.returnsAcceptedOption">
                <el-radio v-for="(v,item,index) in constList.businessPolicyReturnAccepted" :key="index" :label="item" :disabled="true">{{ v }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="form.returnInfo.returnsAcceptedOption === 'ReturnsAccepted'">
            <el-col :span="10">
              <el-form-item label="退款天数" label-width="160px" prop="returnInfo.returnsWithinOption">
                <div class="value-color">{{ form.returnInfo.returnsWithinOption }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="1" />
            <el-col :span="10">
              <el-form-item label="退款方式" label-width="160px" prop="returnInfo.refundOption">
                <div class="value-color">{{ form.returnInfo.refundOption }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="运费承担" label-width="160px" prop="returnInfo.shippingCostPaidByOption">
                <div class="value-color">{{ form.returnInfo.shippingCostPaidByOption === 'Buyer' ? '买家承担' : '卖家承担' }}</div>
              </el-form-item>
            </el-col>
            <el-col v-if="siteCodeArr.includes(form.publishSiteCode)" :span="21">
              <el-form-item label="退货政策" label-width="160px" prop="returnInfo.description">
                <el-input v-model="form.returnInfo.description" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" readonly />
              </el-form-item>
            </el-col>
          </template>
        </el-collapse-item>
        <el-collapse-item name="buyerRequire">
          <collapse-title slot="title" title="买家要求" />
          <el-col :span="20">
            <el-form-item label="买家要求模板" prop="buyerRequirementInfo.buyerRequirementProfileId">
              <div class="value-color">{{ form.buyerRequirementInfo && form.buyerRequirementInfo.buyerRequirementProfileName ? form.buyerRequirementInfo.buyerRequirementProfileName : '-' }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="买家要求" prop="buyerRequirementInfo.disableBuyerRequirements">
              <el-radio-group v-model="form.buyerRequirementInfo.disableBuyerRequirements" :disabled="true">
                <el-radio :label="false">允许所有买家购买</el-radio>
                <el-radio :label="true">禁止以下买家购买</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.buyerRequirementInfo.disableBuyerRequirements">
              <el-checkbox-group v-model="buyerLimitChecked" disabled>
                <el-checkbox key="buyerLimit1" label="buyerLimit1">
                  <span>有
                    <el-select v-model="form.buyerRequirementInfo.maximumUnpaidItemStrikesInfoCount" style="width: 31%" disabled>
                      <el-option v-for="item in unpaidCountList" :key="item" :label="item" :value="item" />
                    </el-select>个拒绝付款的交易在
                  </span>
                  <el-select v-model="form.buyerRequirementInfo.maximumUnpaidItemStrikesInfoPeriod" style="width: 31%" disabled>
                    <el-option v-for="item in unpaidPeriodList" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-checkbox>
                <el-checkbox key="shipToRegistrationCountry" label="shipToRegistrationCountry">注册地不在我的运输范围内</el-checkbox>
                <el-checkbox key="buyerLimit3" label="buyerLimit3">
                  <span>有竞标或购买我的产品在过去10天并达到我的限制
                    <el-select v-model="form.buyerRequirementInfo.itemMaximumItemCount" style="width: 31%" disabled>
                      <el-option v-for="item in maximumCountList" :key="item" :label="item" :value="item" />
                    </el-select>
                  </span>
                </el-checkbox>
                <el-checkbox key="zeroFeedback" label="zeroFeedback">
                  <span>仅针对买家评分小于或等于
                    <el-select v-model="form.buyerRequirementInfo.minimumFeedbackScore" style="width: 31%" disabled>
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
  </basic-container>
</template>

<script>
import collapseTitle from '../collapseTitle.vue'
import { getBuyerItems, getShoppingItems } from '@/api/ebay/template.js'
import { ebayconstants } from '@/api/ebay/ebay.js'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { deepClone } from '@/util/util'

export default {
  name: 'ViewGenaralOption',
  components: { collapseTitle },
  props: {
    row: Object
  },
  data() {
    return {
      constList: {},
      isBoolean: true,
      // 折叠面板默认展开
      activeNames: ['transInfo'],
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
        shippingToLocations: [],
        isALLCheckShoppingLocation: false,
        isIndeterminate: false
      },
      siteCodeArr: ['DE', 'AT', 'FR', 'IT', 'ES'],
      storeName: ''
    }
  },
  created() {
    this.initData()
    this.getStoreList()
  },
  methods: {
    // 查询所有店铺code
    getStoreList() {
      storeOptionsWithPlatformCode({ platformCode: 'EB' }).then(res => {
        this.storeList = res.data
        this.storeName = this.storeList.find(item => item.candidateDisplayName === this.form.storeCode) && this.storeList.find(item => item.candidateDisplayName === this.form.storeCode).displayName
        this.getBuyerItems() // 获取买家要求项
        this.getEbayConstants() // 获取各种常量
      })
    },
    initData() {
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
          shippingInfo.domesticShippingServiceOptionList.push(this.shoppingItem)
        }
        if (shippingInfo.internationalServiceOptionsList && !shippingInfo.internationalServiceOptionsList.length) { // 国际运输为空
          shippingInfo.internationalServiceOptionsList.push(this.shoppingItem)
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
    getBuyerItems(val) {
      getBuyerItems({ siteCode: 'US', storeAccount: val }).then(res => {
        const { feedbackScoreData, maximumCountData, unpaidCountData, unpaidPeriodData } = res.data
        this.unpaidCountList = unpaidCountData
        this.unpaidPeriodList = unpaidPeriodData
        this.maximumCountList = maximumCountData
        this.scoreList = feedbackScoreData
      })
    },
    getEbayConstants() {
      ebayconstants().then(res => {
        const { returnInfo } = this.form
        this.constList = res.data.constants
        Object.keys(this.constList.businessPolicyReturnDays).forEach(item => {
          if (item === returnInfo.returnsWithinOption) {
            returnInfo.returnsWithinOption = this.constList.businessPolicyReturnDays[item]
          }
        })
        Object.keys(this.constList.businessPolicyReturnType).forEach(item => {
          if (item === returnInfo.refundOption) {
            returnInfo.refundOption = this.constList.businessPolicyReturnType[item]
          }
        })
        // 获取国家，处理时间，国内外运输方式，运输地区
        this.chagneSiteCode()
      })
    },
    chagneSiteCode() {
      this.getShoppingItems('CountryDetails')
      this.getShoppingItems('ShippingLocationDetails')
      this.getShoppingItems('ShippingServiceDetails')
      this.getShoppingItems('ShippingServiceDetails', true)
    },
    getShoppingItems(itemType, isBoolean = false) {
      getShoppingItems({ siteCode: this.form.publishSiteCode, storeAccount: this.storeName, itemType: itemType, international: isBoolean }).then(res => {
        const data = res.data
        const { shippingInfo } = this.form
        if (itemType === 'CountryDetails') { // 国家
          this.countryOption = data
          shippingInfo.country = this.countryOption.find(item => item.value === shippingInfo.country) && this.countryOption.find(item => item.value === shippingInfo.country).name
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
        } else if (itemType === 'ShippingServiceDetails' && isBoolean) { // 国际运输方式
          const { internationalServiceOptionsList } = this.form.shippingInfo
          if (internationalServiceOptionsList && internationalServiceOptionsList.length) {
            internationalServiceOptionsList.forEach(item => {
              item.shippingService = data.find(e => e.value === item.shippingService) && data.find(e => e.value === item.shippingService).name
            })
          }
        } else if (itemType === 'ShippingServiceDetails' && !isBoolean) { // 国内运输方式
          const { domesticShippingServiceOptionList } = this.form.shippingInfo
          if (domesticShippingServiceOptionList && domesticShippingServiceOptionList.length) {
            domesticShippingServiceOptionList.forEach(item => {
              item.shippingService = data.find(e => e.value === item.shippingService) && data.find(e => e.value === item.shippingService).name
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.view-option-box {
  padding: 0 10px 25px 10px;
  border-top: 0;
  border-bottom: 0;
  .el-collapse-item__wrap,.el-collapse-item__header {
    border-bottom: 0;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-col{
    margin-bottom: 1px;
  }
  .value-color, .el-textarea__inner {
    color: #999;
  }
}
</style>
