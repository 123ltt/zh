<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="formObj" size="mini" label-width="95px" :rules="rules">
      <el-form-item label="名称" prop="policyName" class="mb-3">
        <el-input v-model="formObj.policyName" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="" class="mb-3">
        <el-checkbox v-model="formObj.isDefault">设置为刊登默认支付模板</el-checkbox>
      </el-form-item>
      <el-form-item label="刊登站点" prop="siteCode">
        <el-select v-model="formObj.siteCode" filterable clearable placeholder="请选择刊登站点" class="w-100">
          <el-option v-for="item in siteOption" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺" prop="storeCode">
        <!-- <div v-if="row">{{ formObj.storeName }}</div> -->
        <el-select v-model="formObj.storeCode" filterable clearable placeholder="请选择店铺" class="w-100">
          <el-option v-for="item in storeOption" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否接受退货" prop="policyInfo.accepted">
        <el-radio-group v-model="formObj.policyInfo.accepted">
          <el-radio v-for="(v,item,index) in constList.businessPolicyReturnAccepted" :key="index" :label="item">{{ v }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formObj.policyInfo.accepted !== 'ReturnsNotAccepted'">
        <el-form-item label="退款天数" prop="policyInfo.days" :rules="formObj.policyInfo.accepted === 'ReturnsAccepted'?rules['policyInfo.days']:[{required:false}]">
          <el-select v-model="formObj.policyInfo.days" filterable clearable placeholder="请选择" style="width: 100%">
            <el-option v-for="(v,item,index) in constList.businessPolicyReturnDays" :key="index" :label="v" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="退款方式" prop="policyInfo.type" :rules="formObj.policyInfo.accepted === 'ReturnsAccepted'?rules['policyInfo.type']:[{required:false}]">
          <el-select v-model="formObj.policyInfo.type" filterable clearable placeholder="请选择" style="width: 100%">
            <el-option v-for="(v,keys,index) in constList.businessPolicyReturnType" :key="index" :label="v" :value="keys" />
          </el-select>
        </el-form-item>
        <el-form-item label="运费承担" prop="policyInfo.costPaidType" :rules="formObj.policyInfo.accepted === 'ReturnsAccepted'?rules['policyInfo.costPaidType']:[{required:false}]">
          <el-radio-group v-model="formObj.policyInfo.costPaidType">
            <el-radio v-for="(v,item,index) in constList.businessPolicyReturnCostPaid" :key="index" :label="item">{{ v }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="displayContent">
          <el-form-item label="退货政策" prop="policyInfo.content">
            <el-input v-model="formObj.policyInfo.content" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" :maxlength="maxlength" show-word-limit />
          </el-form-item>
        </template>
      </template>
      <div class="text-end">
        <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { addPolicyTemplate, editPolicyTemplate } from '@/api/ebay/template.js'

import { deepClone } from '@/util/util'
export default {
  name: 'SaveModal',
  props: {
    storeOption: {
      type: Array
    },
    row: {
      type: Object
    },
    siteOption: {
      type: Array
    },
    constList: {
      type: Object
    }
  },
  data() {
    return {
      formObj: {
        policyType: 'RETURN_POLICY',
        isDefault: false,
        policyInfo: {
          accepted: 'ReturnsAccepted'
        }
      },
      oldForm: {},
      rules: {
        policyName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        siteCode: [{ required: true, message: '请选择刊登站点', trigger: 'change' }],
        'policyInfo.accepted': [{ required: true, message: '请选择是否接受退货', trigger: 'change' }],
        'policyInfo.days': [{ required: true, message: '请选择退款天数', trigger: 'change' }],
        'policyInfo.type': [{ required: true, message: '请选择退货方式', trigger: 'change' }],
        'policyInfo.costPaidType': [{ required: true, message: '请选择运费承担', trigger: 'change' }]
      }
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.formObj))
    },
    displayContent() {
      const arr = ['DE', 'AT', 'FR', 'IT', 'ES']
      return this.formObj.siteCode && arr.includes(this.formObj.siteCode)
    },
    maxlength() {
      const siteCodeFive = ['FR', 'IT', 'ES']
      return siteCodeFive.includes(this.formObj.siteCode) ? 5000 : 8000
    }
  },
  created() {
    if (this.row) { // 编辑
      this.formObj = deepClone(this.row)
      this.oldForm = deepClone(this.row)
    }
  },
  methods: {
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formObj.policyName = this.formObj.policyName.trim()
          if (this.row && this.row.id) { // 修改
            editPolicyTemplate({ ...this.formObj }).then((res) => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          } else { // 添加
            addPolicyTemplate({ ...this.formObj }).then((res) => {
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

<style>

</style>
