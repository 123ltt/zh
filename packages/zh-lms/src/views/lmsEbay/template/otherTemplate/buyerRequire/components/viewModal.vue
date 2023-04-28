<template>
  <basic-container style="min-width: 0">
    <el-form :model="form" size="mini" label-width="90px">
      <el-form-item label="名称" prop="templateShop">
        {{ form.policyName }}
      </el-form-item>
      <el-form-item label="默认模板" prop="site">
        {{ form.isDefault ? '是' : '否' }}
      </el-form-item>
      <el-form-item label="店铺" prop="storeName">
        {{ form.storeName }}
      </el-form-item>
      <el-form-item label="买家要求" prop="">
        <el-radio-group v-model="form.policyInfo.isBuyerLimit" :disabled="false">
          <el-radio :label="false" disabled>允许所有买家购买</el-radio>
          <el-radio :label="true" disabled>禁止以下买家购买</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.isBuyerLimit">
        <el-checkbox-group v-model="buyerLimitChecked" disabled>
          <el-checkbox key="buyerLimit1" label="buyerLimit1">
            <span>有
              <el-select v-model="form.unpaidCount" style="width: 20%" disabled>
                <el-option v-for="item in unpaidCountList" :key="item" :label="item" :value="item" />
              </el-select>个拒绝付款的交易在
            </span>
            <el-select v-model="form.unpaidPeriod" style="width: 20%" disabled>
              <el-option v-for="item in unpaidPeriodList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-checkbox>
          <el-checkbox key="shipToRegistrationCountry" label="shipToRegistrationCountry">注册地不在我的运输范围内</el-checkbox>
          <el-checkbox key="buyerLimit3" label="buyerLimit3">
            <span>有竞标或购买我的产品在过去10天并达到我的限制
              <el-select v-model="form.maximumCount" style="width: 20%" disabled>
                <el-option v-for="item in maximumCountList" :key="item" :label="item" :value="item" />
              </el-select>
            </span>
          </el-checkbox>
          <el-checkbox key="zeroFeedback" label="zeroFeedback">
            <span>仅针对买家评分小于或等于
              <el-select v-model="form.zeroFeedbackScore" style="width: 25%" disabled>
                <el-option v-for="item in scoreList" :key="item" :label="item" :value="item" />
              </el-select>
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { getBuyerItems } from '@/api/ebay/template.js'
export default {
  props: {
    row: {
      required: false,
      type: Object
    },
    storeList: Array
  },
  data() {
    return {
      buyerLimitChecked: [],
      unpaidCountList: [],
      unpaidPeriodList: [],
      maximumCountList: [],
      scoreList: [],
      form: {}
    }
  },
  created() {
    this.form = Object.assign(this.row, {
      ...this.row.policyInfo
    })
    const { isBuyerLimit, unpaidCount, shipToRegistrationCountry, maximumCount, zeroFeedback, storeCode } = this.form
    this.getBuyerItems(storeCode)
    if (isBuyerLimit) { // 禁止以下买家购买
      if (unpaidCount) this.buyerLimitChecked.push('buyerLimit1')
      if (shipToRegistrationCountry) this.buyerLimitChecked.push('shipToRegistrationCountry')
      if (maximumCount) this.buyerLimitChecked.push('buyerLimit3')
      if (zeroFeedback) this.buyerLimitChecked.push('zeroFeedback')
    }
  },
  methods: {
    getBuyerItems(val) {
      const displayName = val ? (this.storeList.find(item => item.candidateDisplayName === val)?.displayName) : ''
      getBuyerItems({ siteCode: 'US', storeAccount: displayName }).then(res => {
        const { feedbackScoreData, maximumCountData, unpaidCountData, unpaidPeriodData } = res.data
        this.unpaidCountList = unpaidCountData
        this.unpaidPeriodList = unpaidPeriodData
        this.maximumCountList = maximumCountData
        this.scoreList = feedbackScoreData
      })
    }
  }
}
</script>
