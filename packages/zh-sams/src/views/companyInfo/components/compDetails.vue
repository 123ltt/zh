<template>
  <basic-container>
    <div class="comp-box">
      <div class="comp-head" @click="compDown = !compDown">
        <div class="comp-title">公司信息</div>
        <el-button :icon="compDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
      </div>
      <el-row v-if="compDown" style="width:80%;margin: auto;">
        <el-col :span="12">
          <span class="el-form-item__label">公司名称</span>
          <div class="el-form-item__content">{{ formObj.name || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">属性</span>
          <div class="el-form-item__content">{{ formObj.nature || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">法人</span>
          <div class="el-form-item__content">{{ formObj.legalPerson || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">法人联系电话</span>
          <div class="el-form-item__content">{{ formObj.legalPersonPhone || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">法人关系</span>
          <div class="el-form-item__content">{{ formObj.legalPersonRelation || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">公司类型</span>
          <div class="el-form-item__content">{{ formObj.type || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">注册地址</span>
          <div class="el-form-item__content">{{ formObj.regAddress || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">注册时间</span>
          <div class="el-form-item__content">{{ formObj.regDate || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">注册资金币种</span>
          <div class="el-form-item__content">{{ formObj.regCurrencyCode }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">公司注册资金（万元）</span>
          <div class="el-form-item__content">{{ formObj.regAmount || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">统一社会信用代码</span>
          <div class="el-form-item__content">{{ formObj.unifiedSocialCreditCode || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">公司状态</span>
          <div class="el-form-item__content">{{ formObj.companyStatus || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">开户地址</span>
          <div class="el-form-item__content">{{ formObj.accountAddress || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">开户银行</span>
          <div class="el-form-item__content">{{ formObj.accountBank || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">开户账号</span>
          <div class="el-form-item__content">{{ formObj.account || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">工商年审日期</span>
          <div class="el-form-item__content">{{ formObj.annualAuditDate || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">是否年审</span>
          <div class="el-form-item__content">{{ formObj.annualAudit==true ?'是':formObj.annualAudit==null?'-':'否' }}</div>
        </el-col>
      </el-row>
      <div class="comp-head" @click="taxAgencyDown = !taxAgencyDown">
        <div class="comp-title">税务信息</div>
        <el-button :icon="taxAgencyDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
      </div>
      <el-row v-if="taxAgencyDown" style="width:80%;margin: auto;">
        <el-col :span="12">
          <span class="el-form-item__label">税务代理公司</span>
          <div class="el-form-item__content">{{ formObj.taxAgencyCompany || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">税务代理联系人</span>
          <div class="el-form-item__content">{{ formObj.taxAgencyContact || '-' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">税务代理联系电话</span>
          <div class="el-form-item__content">{{ formObj.taxAgencyPhone || '-' }}</div>
        </el-col>
      </el-row>
      <div class="comp-head" @click="europeanDown = !europeanDown">
        <div class="comp-title">欧洲代理信息</div>
        <el-button :icon="europeanDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
      </div>
      <template v-if="europeanDown">
        <EuropeanTemp :company-agent="formObj.companyAgent.uk" />
        <EuropeanTemp :company-agent="formObj.companyAgent.eu" />
      </template>
    </div>
  </basic-container>
</template>

<script>
import { companyDetail } from '@/api/companyInfo'
import { currencyList, dictionary } from '@/api/public'
import EuropeanTemp from './europeanTemp.vue'
export default {
  name: 'CompDetails',
  components: { EuropeanTemp },
  props: {
    compId: {
      type: Number
    }
  },
  data() {
    return {
      compDown: true,
      taxAgencyDown: true,
      europeanDown: true,
      formObj: {
        name: '',
        nature: '',
        companyAgent: {
          uk: {},
          eu: {}
        },
        legalPerson: '',
        legalPersonPhone: '',
        legalPersonRelation: '',
        regAddress: '',
        regDate: '',
        regAmount: '',
        regCurrency: '',
        regCurrencyCode: '',
        companyStatus: '',
        accountAddress: '',
        accountBank: '',
        audit: '',
        annualAuditDate: '',
        taxAgencyCompany: '',
        taxAgencyContact: '',
        taxAgencyPhone: ''
      }
    }
  },
  mounted() {
    if (this.compId) {
      this.companyDetail()
    }
  },
  methods: {
    // 详情
    companyDetail() {
      companyDetail({ id: this.compId }).then(res => {
        const data = res.data
        if (data.annualAuditDate && data.annualAuditDate.indexOf('00:00:00') > -1) {
          data.annualAuditDate = data.annualAuditDate.split('00:00:00')[0]
        }
        if (data.regDate && data.regDate.indexOf('00:00:00') > -1) {
          data.regDate = data.regDate.split('00:00:00')[0]
        }
        if (data.regAmount && data.regAmount != null) {
          data.regAmount = parseInt(data.regAmount) <= 0 ? '' : parseInt(data.regAmount)
        }
        this.formObj = data
        this.getCurrencyList()
        this.dictionary('sams_company_type')
        this.dictionary('sams_company_nature')
      })
    },
    // 币种
    getCurrencyList() {
      currencyList().then(res => {
        const data = res.data
        const regCurrency = data.filter(acc => acc.id === this.formObj.regCurrency)
        this.formObj.regCurrencyCode = regCurrency && regCurrency.length ? regCurrency[0].name : ''
      })
    },
    // 字典
    dictionary(code) {
      dictionary({ code: code }).then(res => {
        const arr = res.data
        if (code === 'sams_company_nature') {
          const nature = arr.filter(acc => acc.hiddenValue === this.formObj.nature)
          this.formObj.nature = nature[0].displayName
        } else {
          const type = arr.filter(acc => acc.hiddenValue === this.formObj.type)
          this.formObj.type = type[0].displayName
        }
      })
    }
  }
}
</script>

<style scoped>
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
.m-t-20 {
  margin-top: 20px;
}
.close-icon {
  z-index: 2;
}
.el-form-item__label {
  display: inline-block;
}
.el-form-item__content {
  color:#999;
}
.el-form {
  padding-right: 20px;
}
.el-form-item__content{
  color: #999;
}
</style>
