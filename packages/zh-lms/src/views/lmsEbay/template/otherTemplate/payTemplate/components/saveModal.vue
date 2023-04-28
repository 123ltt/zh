<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="95px" :rules="rules">
      <el-form-item label="名称" prop="policyName" class="mb-3">
        <el-input v-model="form.policyName" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="" class="mb-3">
        <el-checkbox v-model="form.isDefault">设置为刊登默认支付模板</el-checkbox>
      </el-form-item>
      <el-form-item label="店铺" prop="storeCode">
        <!-- <div v-if="row">{{ form.storeName }}</div> -->
        <el-select v-model="form.storeCode" filterable clearable placeholder="请选择店铺" class="w-100">
          <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="大金额paypal" prop="paymentEmailAddress">
        <g-select v-model="form.paymentEmailAddress" :items="paypalList" key-field="id" label-field="paypalAddress" value-field="paypalAddress" class="w-100" />
      </el-form-item>
      <el-form-item label="小金额paypal" prop="smallPaymentEmailAddress">
        <g-select v-model="form.smallPaymentEmailAddress" :items="paypalList" key-field="id" label-field="paypalAddress" value-field="paypalAddress" class="w-100" />
      </el-form-item>
      <el-form-item label="付款说明" prop="policyDesc">
        <el-input v-model="form.policyDesc" type="textarea" maxlength="500" show-word-limit />
      </el-form-item>
      <div class="text-end">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { addPolicyTemplate, editPolicyTemplate } from '@/api/ebay/template.js'
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
        paymentEmailAddress: [{ required: true, message: '请选择大金额paypal', trigger: 'change' }],
        smallPaymentEmailAddress: [{ required: true, message: '请选择小金额paypal', trigger: 'change' }]
      },
      form: {
        isDefault: false,
        policyType: 'PAYMENT',
        policyInfo: {}
      },
      oldForm: {}
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    if (this.row) { // 编辑
      const { paymentEmailAddress, smallPaymentEmailAddress } = this.row.policyInfo
      this.form = Object.assign(deepClone(this.row), {
        paymentEmailAddress: paymentEmailAddress || '',
        smallPaymentEmailAddress: smallPaymentEmailAddress || ''
      })
      this.oldForm = deepClone(this.form)
    }
  },
  methods: {
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { id, policyType, isDefault, storeCode, policyName, policyDesc, paymentEmailAddress, smallPaymentEmailAddress } = this.form
          if (id) { // 修改
            const obj = Object.assign({ id, policyType, isDefault, storeCode, policyDesc }, {
              policyName: policyName.trim(),
              policyInfo: {
                paymentEmailAddress: paymentEmailAddress,
                smallPaymentEmailAddress: smallPaymentEmailAddress
              }
            })
            editPolicyTemplate(obj).then((res) => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          } else { // 添加
            const obj = Object.assign({ policyType, isDefault, storeCode, policyDesc }, {
              policyName: policyName.trim(),
              policyInfo: {
                paymentEmailAddress: paymentEmailAddress,
                smallPaymentEmailAddress: smallPaymentEmailAddress
              }
            })
            addPolicyTemplate(obj).then((res) => {
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
