<template>
  <basic-container>
    <el-row style="width:74%;margin: auto;">
      <el-col :span="12">
        <span class="el-form-item__label">VAT税号</span>
        <div class="el-form-item__content">{{ formObj.vat || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺运营价格</span>
        <div class="el-form-item__content">{{ formObj.operatingCost === -1?'-':formObj.operatingCost||'-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">收款币种</span>
        <div class="el-form-item__content">{{ formObj.receiptCurrencyCode || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">结算币种</span>
        <div class="el-form-item__content">{{ formObj.settlementCurrencyCode || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺平台押金</span>
        <div class="el-form-item__content">{{ formObj.deposit===-1?'-':formObj.deposit||'-' }} {{ formObj.depositCurrencyCode }}</div>
      </el-col>
    </el-row>
    <p v-if="formObj.paymentList.length" style="border-bottom:1px solid #f2f2f2" />
    <el-row v-for="(item,index) in formObj.paymentList" :key="index" style="width:76%;margin: auto;">
      <el-col :span="12">
        <span class="el-form-item__label">收款方式</span>
        <div class="el-form-item__content">{{ item.typeName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">收款注册公司/个人名字</span>
        <div class="el-form-item__content">{{ item.subject || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">收款ID/收款银行账户尾号</span>
        <div class="el-form-item__content">{{ item.accountTailNumber || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">收款注册邮箱</span>
        <div class="el-form-item__content">{{ item.registrationEmail || '-' }}</div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { getFinanceInfoById } from '@/api/storeList'
export default {
  name: 'FinanceInfoDetails',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    }
  },
  data() {
    return {
      formObj: {
        vat: '',
        operatingCost: '',
        receiptCurrency: '',
        settlementCurrency: '',
        depositCurrencyCode: '',
        deposit: '',
        paymentList: [{
          type: '',
          subject: '',
          accountTailNumber: '',
          registrationEmail: ''
        }]
      }
    }
  },
  mounted() {
    this.getFinanceInfoById()
  },
  methods: {
    // 详情
    getFinanceInfoById() {
      if (this.compId) {
        getFinanceInfoById({ id: this.compId }).then(res => {
          const data = res.data
          data.operatingCost = parseInt(data.operatingCost)
          data.deposit = parseInt(data.deposit)
          this.formObj = data
        })
      }
    }
  }
}
</script>

<style scoped>
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
  color: #999;
}
.el-form {
  padding-right: 20px;
}
</style>
