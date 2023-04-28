<template>
  <basic-container>
    <div class="btn-head">
      <p />
      <el-button type="primary" size="mini" :disabled="submitBtnEnable" @click="handleUpdateFinance('formObjRef')">修 改</el-button>
    </div>
    <el-form
      ref="formObjRef"
      :model="formObj"
      :rules="rules"
      label-width="200px"
      size="mini"
      class="form-col"
    >
      <el-row style="width:76%;margin: auto;">
        <el-col :span="11">
          <el-form-item label="VAT税号" prop="vat">
            <el-input v-model.trim="formObj.vat" :disabled="compId?true:false" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="店铺运营价格" prop="operatingCost">
            <el-input v-model.trim="formObj.operatingCost" maxlength="8" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收款币种" prop="receiptCurrencyCode">
            <el-select v-model="formObj.receiptCurrencyCode" filterable default-first-option clearable placeholder="请选择" size="mini" style="width:200px;">
              <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结算币种" prop="settlementCurrencyCode">
            <el-select v-model="formObj.settlementCurrencyCode" filterable default-first-option clearable placeholder="请选择" size="mini" style="width:200px;">
              <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="店铺平台押金" prop="deposit">
            <div class="flex-box">
              <div>
                <el-input v-model.trim="formObj.deposit" maxlength="8" placeholder="请输入" clearable />
              </div>
              <div>
                <el-select v-model="formObj.depositCurrencyCode" clearable filterable default-first-option placeholder="请选择" style="margin-left:10px">
                  <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <p style="border-bottom:1px solid #f2f2f2" />
      <el-row v-for="(item,index) in formObj.paymentList" :key="index" style="width:76%;margin: auto;">
        <el-col :span="22">
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.type'" :rules="[{ required: true, message: '收款方式不能为空', trigger: 'change' }]" label="收款方式">
              <el-select v-model="item.type" clearable placeholder="请选择" size="mini" style="width:200px;">
                <el-option v-for="(item, index) in findForm.typeOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.subject'" :rules="[{ required: true, message: '收款注册公司/个人名字不能为空', trigger: 'blur' }]" label="收款注册公司/个人名字">
              <el-input v-model.trim="item.subject" maxlength="30" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.accountTailNumber'" :rules="[{ required: true, message: '收款ID/收款银行账户尾号不能为空', trigger: 'blur' }]" label="收款ID/收款银行账户尾号">
              <el-input v-model.trim="item.accountTailNumber" maxlength="4" placeholder="请输入" clearable class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="'paymentList.' + index + '.registrationEmail'" :rules="[{ required: true, message: '收款注册邮箱不能为空', trigger: 'blur' },{pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,message: '请输入正确的收款注册邮箱'}]" label="收款注册邮箱">
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
    </el-form>
  </basic-container>
</template>

<script>
import { getFinanceInfoById, updateFinanceInfoById } from '@/api/storeList'
import { currencyList, dictionary } from '@/api/public'
import { deepClone } from '@/util/util'
export default {
  name: 'FinanceInfo',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    }
  },
  data() {
    return {
      oldForm: {},
      formObj: {
        vat: '',
        operatingCost: '',
        receiptCurrency: '',
        settlementCurrencyCode: '',
        deposit: '',
        paymentList: [{
          storeId: '',
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
      rules: {
        deposit: [{ pattern: /^[1-9]\d*$/, message: '请输入正确的店铺平台押金', trigger: 'blur' }],
        operatingCost: [{ pattern: /^[1-9]\d*$/, message: '请输入正确的店铺运营价格', trigger: 'blur' }]
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
    this.getFinanceInfoById()
  },
  methods: {
    // 详情
    getFinanceInfoById(formName) {
      getFinanceInfoById({ id: this.compId }).then(res => {
        const data = res.data
        if (data.deposit && data.deposit != null) {
          data.deposit = parseInt(data.deposit) <= 0 ? '' : parseInt(data.deposit)
        }
        if (data.operatingCost && data.operatingCost !== null) {
          data.operatingCost = parseInt(data.operatingCost) <= 0 ? '' : parseInt(data.operatingCost)
        }
        data.paymentList.forEach(item => { item.type = item.type + '' })
        if (!data.paymentList) {
          data.paymentList = []
          data.paymentList.push({
            storeId: this.compId,
            type: '',
            subject: '',
            accountTailNumber: '',
            registrationEmail: ''
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
            updateFinanceInfoById({ ...this.formObj, id: this.compId }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', 1)
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
        storeId: this.compId,
        type: '',
        subject: '',
        accountTailNumber: '',
        registrationEmail: ''
      })
    },
    // 字典
    getDictionary(code) {
      dictionary({ code: code }).then(res => {
        this.findForm.typeOption = res.data
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

<style scoped>
.w200{
  width: 200px !important;

}
.flex-box{
  display:flex;
  justify-content:space-between;
}
</style>
