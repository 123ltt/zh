<template>
  <el-form ref="rulesForm" size="mini" label-width="120px" :model="caseData">
    <el-row>
      <el-col :span="12">
        <el-form-item label="应付编码">
          <el-input :value="openData.shouldCode" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="采购方名称">
          <el-input :value="openData.purDemander.name" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="供应商名称">
          <el-input :value="openData.supplierInfo.supplierName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="采购编码">
          <el-input :value="openData.purCode" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="账单账期">
          <el-input :value="openData.accountPeriod.startTime" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="采购金额">
          <el-input :value="openData.purTotalMoney" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="预付金额">
          <el-input :value="openData.prepayTotalMoney" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退款金额">
          <el-input :value="openData.returnedTotalMoney" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="应付金额">
          <el-input :value="openData.shouldPayTotalMoney" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="已请款金额">
          <el-input :value="openData.requiredTotalMoney" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="待付金额">
          <el-input :value="openData.unRequiredTotalMoney" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="requireMoney" label="请款金额" :rules="{ required: true, message: '请输入请款金额', trigger: 'blur' }">
          <el-input v-model.trim="caseData.requireMoney" placeholder="请输入" style="width:60%" />
          <el-select v-model="caseData.requiredAccountCurrency" placeholder="请选择" style="width:40%">
            <el-option v-for="item in currencyList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="accountType">
          <span slot="label">
            <span><span class="redStar">* </span>账号类型</span>
          </span>
          <el-select v-model="accountType" clearable placeholder="请选择" filterable style="width:100%" @input="changeType">
            <el-option v-for="item in accountTypeList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="supplierAccountId" label="收款人" :rules="{ required: true, message: '请输入收款人', trigger: 'change' }">
          <el-select v-model="caseData.supplierAccountId" clearable placeholder="请选择" filterable style="width:100%" @input="chengeAccount">
            <el-option v-for="item in accountList" :key="item.id" :label="item.account" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="收款账号">
          <el-input :value="accountNumber" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收款银行">
          <el-input :value="accountBankName" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model.trim="caseData.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入" />
        </el-form-item>
      </el-col>
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

import { getSupplierAccount, save } from '@/api/payableManagement/payableManagement.js'
export default {
  name: 'CycleDetail',
  props: {
    openData: Object
  },
  data() {
    return {
      loading: false,
      isShow: false,
      caseData: {
        remark: '',
        requireMoney: '',
        supplierAccountId: '',
        requiredAccountCurrency: '',
        purOrderShouldPayId: ''
      },
      currencyList: [
        { value: 1, name: 'RMB' },
        { value: 2, name: 'USD' },
        { value: 3, name: 'EUR' }
      ],
      accountTypeListall: [
        { value: 1, name: '银行卡支付' },
        { value: 2, name: '支付宝' },
        { value: 3, name: '微信支付' }
      ],
      accountTypeList: [],
      accountType: '',
      accountNumber: '',
      accountBankName: '',
      accountList: [],
      allList: []
    }
  },
  mounted() {
    this.caseData.purOrderShouldPayId = this.openData.id
    this.caseData.requiredAccountCurrency = 1
    this.getData()
  },
  methods: {
    getData() {
      if (this.openData.supplierInfo.id) {
        getSupplierAccount(this.openData.supplierInfo.id).then(res => {
          if (res.data.accountAccountList.length !== 0) {
            this.allList = res.data.accountAccountList
            this.accountList = JSON.parse(JSON.stringify(this.allList))
            res.data.accountTypeList.forEach(item => {
              this.accountTypeListall.forEach(item2 => {
                if (item2.value === item) {
                  this.accountTypeList.push(item2)
                }
              })
            })
          } else {
            this.$message.error('没有供应商账号信息，请先在供应商系统维护结算账号！')
          }
        })
      } else {
        this.$message.error('没有供应商信息，不能请款！')
      }
    },
    changeType(val) {
      if (val !== '') {
        this.caseData.supplierAccountId = ''
        this.accountList = []
        this.allList.forEach(item => {
          if (item.accountType === val) {
            this.accountList.push(item)
          }
        })
      } else {
        this.accountList = JSON.parse(JSON.stringify(this.allList))
      }
    },
    chengeAccount(val) {
      this.accountList.forEach(item => {
        if (val === item.id) {
          this.accountType = item.accountType
          this.accountNumber = item.accountNumber
          this.accountBankName = item.accountBankName
        }
      })
    },
    define() {
      this.isShow = true
      this.$confirm('确定要提交采购请款？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.rulesForm.validate((valid) => {
          if (valid) {
            if (+this.openData.unRequiredTotalMoney < +this.caseData.requireMoney) {
              this.$message.error('请款金额不能大于待付金额！')
            } else {
              save(this.caseData).then(res => {
                this.isShow = false
                this.$parent.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          } else {
            this.isShow = false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog--center .el-dialog__body{
    padding: 0;
}
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.caozuo{
  ::v-deep .el-table td, .el-table th{
    padding: 5px 0;
  }
}
.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
.redStar{
  color: red;
  font-size: 12px;
}
</style>
