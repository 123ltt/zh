// 供应商信息
<template>
  <el-form :rules="rules"
           :model="form"
           size="mini"
           label-width="140px"
           disabled
           class="form-readonly"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="供应商编码" prop="supplierCode">
          <el-input v-model="form.supplierCode" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="供货价格(RMB)">
          <el-input v-model.number="form.supplierPrice" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="供应商产品编码" prop="supplierSku">
          <el-input v-model="form.supplierSku" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { required } from '@/util/formRules'

export default {
  props: {
    formData: Object
  },
  data() {
    const requiredRule = required()
    return {
      form: { ...this.formData },
      rules: {
        supplierSku: requiredRule,
        supplierCode: requiredRule
      }
    }
  }
}
</script>
