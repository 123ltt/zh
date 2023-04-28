<template>
  <!-- 新增转移产品 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="ruleData" label-width="100px" :rules="rules">
    <el-row>
      <el-col :span="24">
        <el-form-item label="产品周期性" prop="productCycleType" class="is-required">
          <el-radio-group v-model="ruleData.productCycleType" :disabled="!isTable" @change="changeVal">
            <el-radio label="in_season">应季产品</el-radio>
            <el-radio label="not_season">非应季产品</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="typeShow">
      <el-col :span="24">
        <el-form-item label="季节属性" prop="seasonNatureCode">
          <el-select v-model="ruleData.seasonNatureCode" clearable placeholder="请选择" filterable style="width:100%" :disabled="!isTable" @change="checkDeta">
            <el-option v-for="item in seasonNatureList" :key="item.seasonNatureCode" :label="item.seasonNatureName" :value="item.seasonNatureCode" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="seasonPeriod" label="季节周期" class="is-required">
          <el-input v-model.trim="ruleData.seasonPeriod" clearable placeholder="请输入" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="unsalableDateList" label="滞销日期">
          <el-cascader v-model="ruleData.unsalableDateList" :options="options" clearable placeholder="请选择" style="width:100%" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!typeShow">
      <el-col :span="24">
        <el-form-item prop="productAgeValue" label="产品库龄">
          <el-input v-model="ruleData.productAgeValue" placeholder="请输入" maxlength="6" @input="getAgeValue">
            <el-select slot="prepend" v-model="ruleData.productAgeOperate" placeholder="请选择">
              <el-option v-for="item in characterList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="productTurnoverDayValue" label="产品周转天数">
          <el-input v-model="ruleData.productTurnoverDayValue" placeholder="请输入" maxlength="6" @input="getDayValue">
            <el-select slot="prepend" v-model="ruleData.productTurnoverDayOperate" placeholder="请选择">
              <el-option v-for="item in characterList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="productSalesValue" label="产品销量">
          <el-input v-model="ruleData.productSalesValue" placeholder="请输入" maxlength="6" @input="getSalesValue">
            <el-select slot="prepend" v-model="ruleData.productSalesOperate" placeholder="请选择">
              <el-option v-for="item in characterList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>
import { getEnableSeasonPeriodList } from '@/api/base/unsalableRules.js'
import { getDictBiz } from '@/api/public/public.js'
import { dataData } from '@/api/base/dateData.js'
import { deepClone } from '@/util/util'

export default {
  name: 'RuleAdd',
  props: {
    isTable: Boolean,
    tableData: Object
  },
  data() {
    return {
      loading: false,
      options: dataData,
      typeShow: true,
      oldAgeValue: '',
      oldDayValue: '',
      oldSalesValue: '',
      characterList: [],
      seasonNatureList: [],
      rules: {
        seasonNatureCode: [{ required: true, message: '请选择季节属性！', trigger: 'change' }],
        unsalableDateList: [{ required: true, message: '请选择滞销日期！', trigger: 'change' }],
        seasonPeriod: [{ required: true, message: '请选择季节周期！', trigger: 'blur' }],
        productAgeValue: [{ required: true, message: '请填写产品库龄！', trigger: 'blur' }],
        productTurnoverDayValue: [{ required: true, message: '请选择产品周转天数！', trigger: 'blur' }]
      },
      oldBeforeValue: '',
      oldAfterValue: '',
      ruleData: {
        productCycleType: 'in_season',
        seasonNatureCode: '',
        seasonPeriod: '',
        seasonNatureName: '',
        unsalableDate: '',
        unsalableDateList: [],
        productAgeOperate: '',
        productAgeValue: '',
        productTurnoverDayValue: '',
        productTurnoverDayOperate: '',
        productSalesValue: '',
        productSalesOperate: ''
      },
      categoryPath: '',
      productName: '',
      getYes: true,
      hasCantent: '',
      ishas: true,
      availableStock: '',
      oldval: '',
      outsideList: [],
      warehouseList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 清除校验
      this.$refs.rulesForm.clearValidate()
    })
    this.getData()
    this.dealWith()
  },
  methods: {
    getData() {
      // 季节属性
      getEnableSeasonPeriodList().then(res => {
        this.seasonNatureList = res.data
      })
      // 操作符
      getDictBiz('operator').then(res => {
        this.characterList = res.data
      })
    },
    changeVal(val) {
      if (val === 'in_season') {
        this.typeShow = true
        this.ruleData.productAgeOperate = ''
        this.ruleData.productAgeValue = ''
        this.ruleData.productTurnoverDayValue = ''
        this.ruleData.productTurnoverDayOperate = ''
        this.ruleData.productSalesValue = ''
        this.ruleData.productSalesOperate = ''
        this.oldAgeValue = ''
        this.oldDayValue = ''
        this.oldSalesValue = ''
        this.$nextTick(() => {
          // 清除校验
          this.$refs.rulesForm.clearValidate()
        })
      } else if (val === 'not_season') {
        this.typeShow = false
        this.ruleData.seasonNatureCode = ''
        this.ruleData.seasonPeriod = ''
        this.ruleData.unsalableDate = ''
        this.ruleData.seasonNatureName = ''
        this.ruleData.unsalableDateList = []
        this.$nextTick(() => {
          // 清除校验
          this.$refs.rulesForm.clearValidate()
        })
      }
    },

    checkDeta(val) {
      if (val) {
        const checkObj = this.seasonNatureList.filter(item => {
          return item.seasonNatureCode === val
        })[0]
        this.ruleData.seasonNatureName = checkObj.seasonNatureName
        this.ruleData.seasonPeriodBegin = checkObj.seasonPeriodStartDate
        this.ruleData.seasonPeriodEnd = checkObj.seasonPeriodEndDate
        this.ruleData.seasonPeriod = `${this.replaceDate(checkObj.seasonPeriodStartDate)} ~ ${this.replaceDate(checkObj.seasonPeriodEndDate)}`
      } else {
        this.ruleData.seasonPeriod = ''
      }
    },
    replaceDate(val) {
      if (val) {
        const strA = val.split('-')[0]
        const strB = val.split('-')[1]
        return `${strA}月 ${strB}日`
      }
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if ((this.ruleData.productAgeOperate && this.ruleData.productTurnoverDayOperate && this.ruleData.productSalesOperate) || this.ruleData.productCycleType === 'in_season') {
            this.ruleData.unsalableDate = this.ruleData.unsalableDateList[0].slice(0, 2) + '-' + this.ruleData.unsalableDateList[1].slice(0, 2)
            this.$parent.$emit('close', this.ruleData)
          } else {
            this.$message.error('请先选择产品库龄、产品周转天数和产品销量的限制')
          }
        }
      })
    },
    dealWith() {
      if (!this.isTable) {
        this.loading = true
        this.ruleData = deepClone(this.tableData)
        this.ruleData.seasonPeriod = `${this.replaceDate(this.ruleData.seasonPeriodBegin)} ~ ${this.replaceDate(this.ruleData.seasonPeriodEnd)}`
        this.changeVal(this.ruleData.productCycleType)
        if (this.tableData.unsalableDate) {
          this.ruleData.unsalableDateList = this.replaceDate(this.tableData.unsalableDate).split(' ')
        }
        this.loading = false
      }
    },
    getAgeValue(val) {
      if (this.getRules(val)) {
        this.oldAgeValue = val
      } else {
        this.ruleData.productAgeValue = this.oldAgeValue
      }
    },
    getDayValue(val) {
      if (this.getRules(val)) {
        this.oldDayValue = val
      } else {
        this.ruleData.productTurnoverDayValue = this.oldDayValue
      }
    },
    getSalesValue(val) {
      if (this.getRules(val)) {
        this.oldSalesValue = val
      } else {
        this.ruleData.productSalesValue = this.oldSalesValue
      }
    },
    getRules(val) {
      if (val) {
        if (/^[0-9]+$/.test(val)) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }
::v-deep .el-input-group__prepend{
  width: 45%;
}

</style>
