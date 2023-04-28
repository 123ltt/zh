<template>
  <basic-container>
    <!-- 公司信息 -->
    <div class="btn-head">
      <p />
      <el-button
        type="primary"
        size="mini"
        @click="handleSave('formObjRef')"
      >保存</el-button>
    </div>
    <el-form
      ref="formObjRef"
      :model="formObj"
      label-width="170px"
      :rules="rules"
      size="mini"
      class="form-col"
    >
      <div class="comp-box">
        <div class="comp-head" @click="compDown = !compDown">
          <div class="comp-title">公司信息</div>
          <el-button :icon="compDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-if="compDown" style="width:80%;margin:0 auto;">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model.trim="formObj.name" size="mini" maxlength="30" show-word-limit class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="属性" prop="nature">
              <el-select v-model="formObj.nature" clearable placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findFormProp.natureOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'?rules.legalPerson:[{required: false}]" label="法人" prop="legalPerson">
              <el-input v-model.trim="formObj.legalPerson" size="mini" maxlength="10" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="validate?rules.legalPersonPhone:rules.legalPersonPhone2" label="法人联系电话" prop="legalPersonPhone">
              <el-input v-model.trim="formObj.legalPersonPhone" size="mini" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="validate?rules.legalPersonRelation:[{required: false, message: '法人关系不能为空', trigger: 'blur'},{}]"
              label="法人关系"
              prop="legalPersonRelation"
            >
              <el-input v-model.trim="formObj.legalPersonRelation" maxlength="10" size="mini" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司类型" prop="type">
              <el-select v-model="formObj.type" clearable placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findFormProp.typeOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="formObj.nature==='1'?rules.regAddress:[{required: false, message: '注册地址不能为空', trigger: 'blur'}]"
              label="注册地址"
              prop="regAddress"
            >
              <el-input v-model.trim="formObj.regAddress" maxlength="50" size="mini" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'?rules.regDate:[{required: false, message: '注册时间不能为空', trigger: 'blur'}]" label="注册时间" prop="regDate">
              <el-date-picker v-model="formObj.regDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width:200px" :picker-options="pickerOptions" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="validate?rules.regCurrency:[{required: false, message: '注册资金币种不能为空', trigger: 'change'}]" label="注册资金币种" prop="regCurrency">
              <el-select v-model="formObj.regCurrency" clearable filterable placeholder="请选择" size="mini" style="width:200px">
                <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="validate?rules.regAmount:[{required: false, message: '公司注册资金（万元）不能为空', trigger: 'change'}]" label="公司注册资金（万元）" prop="regAmount">
              <el-input v-model.trim="formObj.regAmount" size="mini" maxlength="8" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="validate?rules.unifiedSocialCreditCode:[{required: false, message: '统一社会信用代码不能为空', trigger: 'blur'}]" label="统一社会信用代码" prop="unifiedSocialCreditCode">
              <el-input v-model.trim="formObj.unifiedSocialCreditCode" size="mini" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司状态" prop="companyStatus">
              <el-input v-model.trim="formObj.companyStatus" maxlength="10" show-word-limit size="mini" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户地址" prop="accountAddress">
              <el-input v-model.trim="formObj.accountAddress" size="mini" maxlength="50" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="accountBank">
              <el-input v-model.trim="formObj.accountBank" size="mini" maxlength="10" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户账号" prop="account">
              <el-input v-model.trim="formObj.account" size="mini" maxlength="30" class="w200" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="validate?rules.annualAuditDate:[{required: false, message: '工商年审日期不能为空', trigger: 'change'}]"
              label="工商年审日期"
              prop="annualAuditDate"
            >
              <el-date-picker v-model="formObj.annualAuditDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini" style="width:200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="validate?rules.annualAudit:[{required: false, message: '是否年审不能为空', trigger: 'change'}]" label="是否年审" prop="annualAudit">
              <el-select v-model="formObj.annualAudit" style="width:200px" clearable placeholder="请选择" size="mini">
                <el-option
                  v-for="(item,index) in findFormProp.auditOption"
                  :key="index"
                  :label="item.displayName"
                  :value="item.hiddenValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="comp-head" @click="taxAgencyDown = !taxAgencyDown">
          <div class="comp-title">税务信息</div>
          <el-button :icon="taxAgencyDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-if="taxAgencyDown" style="width:80%;margin: auto;">
          <el-col :span="12">
            <el-form-item :rules="validate?rules.taxAgencyCompany:[{required: false, message: '税务代理公司不能为空', trigger: 'blur'}]" label="税务代理公司" prop="taxAgencyCompany">
              <el-input v-model.trim="formObj.taxAgencyCompany" class="w200" size="mini" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务代理联系人" prop="taxAgencyContact">
              <el-input v-model.trim="formObj.taxAgencyContact" class="w200" size="mini" maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务代理联系电话" prop="taxAgencyPhone">
              <el-input v-model.trim="formObj.taxAgencyPhone" class="w200" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { addCompany, companyDetail, updateCompany } from '@/api/companyInfo'
import { currencyList } from '@/api/public'
import { isPhone, isMobile } from '@/util/validate'
export default {
  name: 'CompEdit',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    findFormProp: {
      type: Object,
      request: true
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isMobile(value) || isPhone(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的联系电话'))
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      compDown: true,
      taxAgencyDown: true,
      formObj: {
        name: '',
        nature: '',
        legalPerson: '',
        legalPersonPhone: '',
        legalPersonRelation: '',
        regAddress: '',
        regDate: '',
        regAmount: '',
        regCurrency: '',
        companyStatus: '',
        accountAddress: '',
        accountBank: '',
        annualAudit: '',
        annualAuditDate: '',
        taxAgencyCompany: '',
        taxAgencyContact: '',
        taxAgencyPhone: ''
      },
      findForm: {
        typeOption: [], // 公司类型
        natureOption: [], // 属性
        regCurrencyOption: [], // 币种
        auditOption: [] // 是否年审
      },
      rules: {
        name: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
        nature: [{ required: true, message: '属性不能为空', trigger: 'change' }],
        legalPerson: [{ required: true, message: '法人不能为空', trigger: 'blur' }],
        regAddress: [{ required: true, message: '注册地址不能为空', trigger: 'blur' }],
        regDate: [{ required: true, message: '注册时间不能为空', trigger: 'blur' }],
        legalPersonRelation: [{ required: true, message: '法人关系不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '公司类型不能为空', trigger: 'change' }],
        legalPersonPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        legalPersonPhone2: [{ required: false }],
        unifiedSocialCreditCode: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }, { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入正确的统一社会信用代码!' }],
        account: [{ pattern: /^[1-9]\d{9,29}$/, message: '请输入正确的开户账号!' }],
        regCurrency: [{ required: true, message: '注册资金币种不能为空', trigger: 'change' }],
        regAmount: [{ required: true, message: '公司注册资金（万元）不能为空', trigger: 'blur' }, { pattern: /^[1-9]\d*$/, message: '请输入正确的公司注册资金（万元）' }],
        annualAuditDate: [{ required: true, message: '工商年审日期不能为空', trigger: 'change' }],
        annualAudit: [{ required: true, message: '是否年审不能为空', trigger: 'change' }],
        taxAgencyCompany: [{ required: true, message: '税务代理公司不能为空', trigger: 'blur' }]
      }

    }
  },
  computed: {
    validate() {
      return this.formObj.nature === '1' && this.formObj.type === '1'
    }
  },
  mounted() {
    this.getCurrencyList()
    if (this.compId) {
      this.companyDetail()
    }
  },
  methods: {
    // 详情
    companyDetail() {
      companyDetail({ id: this.compId }).then(res => {
        const data = res.data
        data.annualAudit = data.annualAudit !== null ? data.annualAudit + '' : ''
        // data.type = data.type.toString()
        if (data.regAmount && data.regAmount != null) {
          data.regAmount = parseInt(data.regAmount) <= 0 ? '' : parseInt(data.regAmount)
        }
        data.regAmount = data.regAmount && parseInt(data.regAmount)
        this.formObj = data
      })
    },
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formObj.regDate && this.formObj.regDate.indexOf('00:00:00') === -1) {
            this.formObj.regDate = `${this.formObj.regDate} 00:00:00`
          }
          if (this.formObj.annualAuditDate && this.formObj.annualAuditDate.indexOf('00:00:00') === -1) {
            this.formObj.annualAuditDate = `${this.formObj.annualAuditDate} 00:00:00`
          }
          if (this.compId) {
            updateCompany({ ...this.formObj }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          } else {
            addCompany({ ...this.formObj }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          }
        }
      })
    },

    // 币种
    getCurrencyList() {
      currencyList().then(res => {
        this.findForm.regCurrencyOption = res.data
      })
    }
    // 字典
    // getDictionary(code) {
    //   dictionary({ code: code }).then(res => {
    //     const data = res.data
    //     this.findForm.typeOption = data
    //   })
    // }
  }

}
</script>

<style scoped>
.w200{
  width: 200px!important;
}

.comp-head {
  display: flex;
  justify-content: space-between;
  height: 40px;
  border-bottom:1px solid #ebeef5;
  padding: 0 20px;
  margin-bottom: 20px;
  cursor:pointer;
}
.comp-title {
  font-size: 15px;
  font-weight: bold;
  line-height: 40px;
}
</style>
