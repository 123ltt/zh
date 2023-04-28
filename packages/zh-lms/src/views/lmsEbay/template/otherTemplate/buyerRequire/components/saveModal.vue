<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="85px" :rules="rules">
      <el-form-item label="名称" prop="policyName" class="mb-3">
        <el-input v-model="form.policyName" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="" class="mb-3">
        <el-checkbox v-model="form.isDefault">设置为刊登默认买家要求模板</el-checkbox>
      </el-form-item>
      <el-form-item label="店铺" prop="storeCode">
        <!-- <div v-if="row">{{ form.storeName }}</div> -->
        <el-select v-model="form.storeCode" filterable clearable placeholder="请选择店铺" class="w-100" @change="(val) => getBuyerItems(val)">
          <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="买家要求" prop="isBuyerLimit">
        <el-radio-group v-model="form.isBuyerLimit" :disabled="false">
          <el-radio :label="false">允许所有买家购买</el-radio>
          <el-radio :label="true">禁止以下买家购买</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.isBuyerLimit">
        <el-checkbox-group v-model="buyerLimitChecked">
          <el-checkbox key="buyerLimit1" label="buyerLimit1">
            <span>有
              <el-select v-model="form.unpaidCount" style="width: 20%" @click.native.prevent>
                <el-option v-for="item in unpaidCountList" :key="item" :label="item" :value="item" />
              </el-select>个拒绝付款的交易在
            </span>
            <el-select v-model="form.unpaidPeriod" style="width: 20%" @click.native.prevent>
              <el-option v-for="item in unpaidPeriodList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-checkbox>
          <el-checkbox key="shipToRegistrationCountry" label="shipToRegistrationCountry">注册地不在我的运输范围内</el-checkbox>
          <el-checkbox key="buyerLimit3" label="buyerLimit3">
            <span>有竞标或购买我的产品在过去10天并达到我的限制
              <el-select v-model="form.maximumCount" style="width: 20%" @click.native.prevent>
                <el-option v-for="item in maximumCountList" :key="item" :label="item" :value="item" />
              </el-select>
            </span>
          </el-checkbox>
          <el-checkbox key="zeroFeedback" label="zeroFeedback">
            <span>仅针对买家评分小于或等于
              <el-select v-model="form.feedbackScore" style="width: 25%" @click.native.prevent>
                <el-option v-for="item in scoreList" :key="item" :label="item" :value="item" />
              </el-select>
            </span>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="text-end">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { getBuyerItems, addPolicyTemplate, editPolicyTemplate } from '@/api/ebay/template.js'
import { deepClone } from '@/util/util'

export default {
  props: {
    storeList: Array,
    paypalList: Array,
    row: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      searchLoading: false,
      rules: {
        storeCode: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        policyName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        isBuyerLimit: [{ required: true, message: '请选择买家要求', trigger: 'change' }]
      },
      form: {
        policyType: 'BUYER_REQUIREMENTS',
        isDefault: false,
        policyInfo: {},
        unpaidCount: 2,
        unpaidPeriod: 'Days_30',
        maximumCount: 10,
        feedbackScore: 5
      },
      oldForm: {},
      buyerLimitChecked: [],
      buyerLimitCheckedCache: [],
      unpaidCountList: [],
      unpaidPeriodList: [],
      maximumCountList: [],
      scoreList: []
    }
  },
  computed: {
    submitBtnEnable() {
      return JSON.stringify(this.oldForm) === JSON.stringify(this.form) && this.buyerLimitCheckedCache.length === this.buyerLimitChecked.length
    }
  },
  created() {
    if (this.row) { // 编辑
      this.form = Object.assign(deepClone(this.row), {
        ...this.row.policyInfo
      })
      const { isBuyerLimit, unpaidCount, shipToRegistrationCountry, maximumCount, feedbackScore, storeCode } = this.form
      this.getBuyerItems(storeCode)
      if (isBuyerLimit) { // 禁止以下买家购买
        if (unpaidCount) this.buyerLimitChecked.push('buyerLimit1')
        if (shipToRegistrationCountry) this.buyerLimitChecked.push('shipToRegistrationCountry')
        if (maximumCount) this.buyerLimitChecked.push('buyerLimit3')
        if (feedbackScore) this.buyerLimitChecked.push('zeroFeedback') // 买家评分有值
      }
      this.buyerLimitCheckedCache = [...this.buyerLimitChecked]
      this.oldForm = deepClone(this.form)
    } else {
      this.getBuyerItems()
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
    },
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const {
            id,
            policyType,
            isDefault,
            storeCode,
            policyName,
            isBuyerLimit, // 是否禁止用户购买
            maximumCount,
            unpaidCount,
            unpaidPeriod,
            feedbackScore
          } = this.form
          if (isBuyerLimit && !this.buyerLimitChecked.length) {
            return this.$message.warning('请至少选择一个禁止买家购买的条件')
          }
          const dynamicInfo = {}
          if (this.buyerLimitChecked.includes('buyerLimit1')) {
            if (!unpaidCount) return this.$message.warning('请选择拒绝付款的交易数量')
            if (!unpaidPeriod) return this.$message.warning('请选择拒绝付款的交易周期')
            dynamicInfo.unpaidCount = unpaidCount
            dynamicInfo.unpaidPeriod = unpaidPeriod
          }
          if (this.buyerLimitChecked.includes('buyerLimit3')) {
            if (!maximumCount) return this.$message.warning('请选择我的限制数量')
            dynamicInfo.maximumCount = maximumCount
          }
          if (this.buyerLimitChecked.includes('zeroFeedback')) {
            if (!feedbackScore) return this.$message.warning('请选择买家评分')
            dynamicInfo.feedbackScore = feedbackScore
          }
          const policyInfo = {
            isBuyerLimit,
            shipToRegistrationCountry: this.buyerLimitChecked.includes('shipToRegistrationCountry'),
            ...dynamicInfo
          }
          if (id) { // 修改
            const obj = Object.assign({ id, policyType, isDefault, storeCode, isBuyerLimit }, {
              policyName: policyName.trim(),
              policyInfo: policyInfo
            })
            editPolicyTemplate(obj).then((res) => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          } else { // 添加
            const obj = Object.assign({ policyType, isDefault, storeCode }, {
              policyName: policyName.trim(),
              policyInfo: policyInfo
            })
            addPolicyTemplate(obj).then(() => {
              this.$message.success('添加成功')
              this.$parent.$emit('close', true)
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
