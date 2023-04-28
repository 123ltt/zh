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
      :disabled="isDetails"
      label-width="160px"
      size="mini"
    >
      <div class="comp-box">
        <div class="comp-head" @click="compDown = !compDown">
          <div class="comp-title">基础信息</div>
          <el-button :icon="compDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-if="compDown" :gutter="10">
          <el-col :span="12">
            <el-form-item
              label="公司名称"
              prop="name"
            >
              <el-input
                v-model="formObj.name"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="属性"
              prop="nature"
            >
              <el-select
                v-model="formObj.nature"
                clearable
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="(item,index) in findFormProp.natureOption"
                  :key="index"
                  :label="item.displayName"
                  :value="item.hiddenValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="formObj.nature==='1'?rules.legalPerson:[{required: false, message: '法人不能为空', trigger: 'blur'}]"
              label="法人"
              prop="legalPerson"
            >
              <el-input v-model="formObj.legalPerson" size="mini" maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="formObj.nature==='1'&&formObj.type === '1'?rules.legalPersonPhone:[{required: false, message: '法人联系电话不能为空', trigger: 'blur'}]"
              label="法人联系电话"
              prop="legalPersonPhone"
            >
              <el-input
                v-model="formObj.legalPersonPhone"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="formObj.nature==='1'&&formObj.type === '1'?rules.legalPersonRelation:[{required: false, message: '法人关系不能为空', trigger: 'blur'}]"
              label="法人关系"
              prop="legalPersonRelation"
            >
              <el-input v-model="formObj.legalPersonRelation" maxlength="10" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="公司类型"
              prop="type"
            >
              <el-select
                v-model="formObj.type"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in findFormProp.typeOption"
                  :key="index"
                  :label="item.displayName"
                  :value="item.hiddenValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="formObj.nature==='1'?rules.regAddress:[{required: false, message: '注册地址不能为空', trigger: 'blur'}]"
              label="注册地址"
              prop="regAddress"
            >
              <el-input v-model="formObj.regAddress" maxlength="50" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'?rules.regDate:[{required: false, message: '注册时间不能为空', trigger: 'blur'}]" label="注册时间" prop="regDate">
              <el-date-picker v-model="formObj.regDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'&&formObj.type === '1'?rules.regCurrency:[{required: false, message: '注册资金币种不能为空', trigger: 'change'}]" label="注册资金币种" prop="regCurrency">
              <el-select v-model="formObj.regCurrency" clearable ilterable default-first-option placeholder="请选择">
                <el-option v-for="(item,index) in findForm.regCurrencyOption" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'&&formObj.type === '1'?rules.regAmount:[{required: false, message: '公司注册资金（万元）不能为空', trigger: 'change'}]" label="公司注册资金（万元）" prop="regAmount">
              <el-input v-model="formObj.regAmount" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'&&formObj.type === '1'?rules.unifiedSocialCreditCode:[{required: false, message: '统一社会信用代码不能为空', trigger: 'blur'}]"
                          label="统一社会信用代码"
                          prop="unifiedSocialCreditCode"
            >
              <el-input v-model="formObj.unifiedSocialCreditCode" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司状态" prop="companyStatus">
              <el-select v-model="formObj.companyStatus" clearable placeholder="请选择">
                <el-option v-for="(item,index) in findForm.companyStatusOption" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户地址" prop="accountAddress">
              <el-input v-model="formObj.accountAddress" size="mini" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="accountBank">
              <el-input v-model="formObj.accountBank" size="mini" maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户账号" prop="accountBankCode">
              <el-input v-model="formObj.accountBankCode" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="formObj.nature==='1'&&formObj.type === '1'?rules.annualAuditDate:[{required: false, message: '工商年审日期不能为空', trigger: 'change'}]"
              label="工商年审日期"
              prop="annualAuditDate"
            >
              <el-date-picker v-model="formObj.annualAuditDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'&&formObj.type === '1'?rules.audit:[{required: false, message: '是否年审不能为空', trigger: 'change'}]" label="是否年审" prop="audit">
              <el-select v-model="formObj.audit" clearable placeholder="请选择">
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
          <div class="comp-title">运营信息</div>
          <el-button :icon="taxAgencyDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-if="taxAgencyDown" :gutter="10">
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'&&formObj.type === '1'?rules.taxAgencyCompany:[{required: false, message: '税务代理公司不能为空', trigger: 'blur'}]" label="税务代理公司" prop="taxAgencyCompany">
              <el-input v-model="formObj.taxAgencyCompany" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务代理联系人" prop="taxAgencyContact">
              <el-input v-model="formObj.taxAgencyContact" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务代理联系电话" prop="taxAgencyPhone">
              <el-input v-model="formObj.taxAgencyPhone" size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="comp-head" @click="taxAgencyDown = !taxAgencyDown">
          <div class="comp-title">注册信息</div>
          <el-button :icon="taxAgencyDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
        </div>
        <el-row v-if="taxAgencyDown" :gutter="10">
          <el-col :span="12">
            <el-form-item :rules="formObj.nature==='1'&&formObj.type === '1'?rules.taxAgencyCompany:[{required: false, message: '税务代理公司不能为空', trigger: 'blur'}]" label="税务代理公司" prop="taxAgencyCompany">
              <el-input v-model="formObj.taxAgencyCompany" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务代理联系人" prop="taxAgencyContact">
              <el-input v-model="formObj.taxAgencyContact" size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税务代理联系电话" prop="taxAgencyPhone">
              <el-input v-model="formObj.taxAgencyPhone" size="mini" />
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
  name: 'AuditDetails',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    findFormProp: {
      type: Object,
      request: true
    },
    isDetails: { // 是否查看
      type: Boolean,
      default: false
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
        audit: '',
        annualAuditDate: '',
        taxAgencyCompany: '',
        taxAgencyContact: '',
        taxAgencyPhone: ''
      },
      findForm: {
        typeOption: [], // 公司类型
        natureOption: [], // 属性
        regCurrencyOption: [], // 币种
        companyStatusOption: [], // 公司状态
        auditOption: [] // 是否年审
      },
      rules: {
        legalPerson: [{ required: true, message: '法人不能为空', trigger: 'blur' }],
        regAddress: [{ required: true, message: '注册地址不能为空', trigger: 'blur' }],
        regDate: [{ required: true, message: '注册时间不能为空', trigger: 'blur' }],
        legalPersonRelation: [{ required: true, message: '法人关系不能为空', trigger: 'blur' }],
        legalPersonPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        accountBankCode: [{ pattern: /^[1-9]\d{9,29}$/, message: '请输入正确的开户账号!' }],
        unifiedSocialCreditCode: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
          { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '请输入正确的统一社会信用代码!' }],
        regCurrency: [{ required: true, message: '注册资金币种不能为空', trigger: 'change' }],
        regAmount: [{ required: true, message: '公司注册资金（万元）不能为空', trigger: 'blur' }],
        annualAuditDate: [{ required: true, message: '工商年审日期不能为空', trigger: 'change' }],
        audit: [{ required: true, message: '是否年审不能为空', trigger: 'change' }],
        taxAgencyCompany: [{ required: true, message: '税务代理公司不能为空', trigger: 'blur' }]
      }

    }
  },
  mounted() {
    this.getCurrencyList()
  },
  methods: {
    companyDetail() {
      companyDetail({ id: this.compId }).then(res => {
        this.formObj = res.data
      })
    },
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.compId) {
            updateCompany({ ...this.formObj }).then(res => {
              this.$message.success(res.msg)
            })
          } else {
            addCompany({ ...this.formObj }).then(res => {
              this.$message.success(res.msg)
            })
          }
          this.$emit('close', 1)
        }
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

</style>
