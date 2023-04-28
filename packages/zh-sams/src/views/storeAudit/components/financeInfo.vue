<template>
  <basic-container>
    <el-form
      ref="formObjRef"
      :model="formObj"
      :rules="rules"
      label-width="180px"
      size="mini"
      class="form-col"
    >
      <el-row :style="{width:isAllFinanceInfo ? '92%':'76%'}" style="margin: auto;">
        <el-col :span="11">
          <el-form-item label="VAT税号" prop="vat">
            <el-input v-model.trim="formObj.vat" maxlength="50" :disabled="compId?true:false" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="店铺运营价格" prop="operatingCost">
            <el-input v-model.trim="formObj.operatingCost" maxlength="8" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收款币种" prop="receiptCurrencyCode">
            <el-select v-model="formObj.receiptCurrencyCode" clearable filterable default-first-option placeholder="请选择" size="mini" style="width:200px;">
              <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结算币种" prop="settlementCurrencyCode">
            <el-select v-model="formObj.settlementCurrencyCode" clearable filterable default-first-option placeholder="请选择" size="mini" style="width:200px;">
              <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="店铺平台押金" prop="deposit">
            <div class="flex-box">
              <el-input v-model.trim="formObj.deposit" maxlength="8" placeholder="请输入" clearable />

              <el-select v-model="formObj.depositCurrencyCode" clearable filterable default-first-option placeholder="请选择" style="margin-left:10px;">
                <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <p v-if="formObj.paymentList.length" style="border-bottom:1px solid #f2f2f2" />
      <el-row v-for="(item,index) in formObj.paymentList" :key="index" :style="{width:isAllFinanceInfo ? '92%':'76%'}" style="margin: auto;">
        <el-col :span="22">
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.type'" :rules="[{ required: true, message: '收款方式不能为空', trigger: 'blur' }]" label="收款方式">
              <el-select v-model="item.type" clearable filterable placeholder="请选择" size="mini" style="width:200px;">
                <el-option v-for="(item, index) in findForm.typeOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.subject'" :rules="[{ required: true, message: '收款注册公司/个人名字不能为空', trigger: 'blur' }]" label="收款注册公司/个人名字">
              <el-input v-model.trim="item.subject" :maxlength="30" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.accountTailNumber'" :rules="[{ required: true, message: '收款ID/收款银行账户尾号不能为空', trigger: 'blur' }, {pattern:/^[0-9]*$/, message: '请输入正确的数字',trigger: 'blur' }]" label="收款ID/收款银行账户尾号">
              <el-input v-model.trim="item.accountTailNumber" maxlength="4" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.registrationEmail'" :rules="[{ required: true, trigger: 'blur',message:'收款注册邮箱不能为空'},{ pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/ ,message:'请输入正确的邮箱地址',trigger: 'blur' }]" label="收款注册邮箱">
              <el-input v-model.trim="item.registrationEmail" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col v-if="index===0" :span="1" style="margin-left:10px">
          <el-button icon="el-icon-plus" size="mini" @click="handleAddFinance" />
        </el-col>
        <el-col v-if="index!==0" :span="1" style="margin-left:10px">
          <el-button icon="el-icon-minus" size="mini" @click="handleReduceFinance(item,index)" />
        </el-col>
      </el-row>
      <div v-if="!isAllFinanceInfo" style="margin:40px 0 80px 338px">
        <el-button type="primary" size="medium" :disabled="submitBtnEnable" @click="handleUpdateFinance('formObjRef')">保存</el-button>
      </div>
    </el-form>
    <!-- 批量更新财务信息 -->
    <div v-if="isAllFinanceInfo" class="footer" style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取消</el-button>
      <el-button size="medium" type="primary" @click="updateALLFinanceInfo('formObjRef')">保存</el-button>
    </div>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import { LIMIT } from '@/config/form'
import { updateFinanceInfo, financeInfoDetails, updateALLFinanceInfo } from '@/api/storeAudit'
import { currencyList, dictionary } from '@/api/public'
export default {
  name: 'FinanceInfo',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    },
    ids: { // 批量id
      type: Array
    },
    isAllFinanceInfo: { // 是否批量
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      LIMIT,
      formObj: {
        vat: '',
        operatingCost: '',
        receiptCurrency: '',
        settlementCurrency: '',
        deposit: '',
        paymentList: [{
          type: '',
          subject: '',
          accountTailNumber: '',
          registrationEmail: ''
        }]
      },
      findForm: {
        regCurrencyOption: [],
        typeOption: []// 收款方式
      },
      oldForm: {},
      rules: {
        vat: [{ pattern: /^[A-Za-z0-9]+$/, message: '请输入正确的VAT税号', trigger: 'blur' }],
        deposit: [{ trigger: 'blur', message: '请输入有效数字', pattern: /^\d{1,}$/ }],
        operatingCost: [{ trigger: 'blur', message: '请输入有效数字', pattern: /^\d{1,}$/ }]
      }
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.formObj))
    }
  },
  mounted() {
    this.getDictionary('sams_payment_type')
    this.getCurrencyList()
    if (this.compId) {
      this.getFinanceInfoDetails()
    }
  },
  methods: {
    // 批量更新财务信息
    updateALLFinanceInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateALLFinanceInfo({ ids: this.ids, ...this.formObj }).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    // 详情
    getFinanceInfoDetails(formName) {
      financeInfoDetails({ id: this.compId }).then(res => {
        const data = res.data
        if (data.deposit && data.deposit != null) {
          data.deposit = parseInt(data.deposit) <= 0 ? '' : parseInt(data.deposit)
        }
        if (data.operatingCost && data.operatingCost !== null) {
          data.operatingCost = parseInt(data.operatingCost) <= 0 ? '' : parseInt(data.operatingCost)
        }
        if (!data.paymentList.length) {
          data.paymentList.push({
            type: '',
            subject: '',
            accountTailNumber: '',
            registrationEmail: ''
          })
        }
        if (data.paymentList) {
          data.paymentList.forEach(acc => {
            acc.type = acc.type + ''
          })
        }
        this.formObj = data
        this.oldForm = deepClone(this.formObj)
      })
    },

    // 编辑
    handleUpdateFinance(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.compId) {
            updateFinanceInfo({ id: this.compId, ...this.formObj }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          }
        }
      })
    },

    // 删除
    handleReduceFinance(item) {
      const index = this.formObj.paymentList.indexOf(item)
      if (index !== -1) {
        this.formObj.paymentList.splice(index, 1)
      }
    },
    // 添加
    handleAddFinance() {
      this.formObj.paymentList.push({
        type: '',
        subject: '',
        accountTailNumber: '',
        registrationEmail: ''
      })
    },
    // 字典
    getDictionary(code) {
      dictionary({ code: code }).then(res => {
        const data = res.data
        this.findForm.typeOption = data
      })
    },
    // 币种
    getCurrencyList() {
      currencyList().then(res => {
        this.findForm.regCurrencyOption = res.data
      })
    }

  }

}
</script>

<style>
.flex-box{
  width: 200px !important;
  display:flex;
  justify-content:space-between;
}
</style>
