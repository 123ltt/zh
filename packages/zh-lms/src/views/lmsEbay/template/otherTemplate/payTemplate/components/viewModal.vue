<template>
  <basic-container style="min-width: 0">
    <el-form :model="form" size="mini" label-width="90px">
      <el-form-item label="名称">
        {{ form.policyName }}
      </el-form-item>
      <el-form-item label="默认模板">
        {{ form.isDefault ? '是' : '否' }}
      </el-form-item>
      <el-form-item label="店铺">
        {{ form.storeName }}
      </el-form-item>
      <el-form-item label="大金额paypal">
        {{ form.policyInfo.paymentEmailAddress }}
      </el-form-item>
      <el-form-item label="小金额paypal">
        {{ form.policyInfo.smallPaymentEmailAddress }}
      </el-form-item>
      <el-form-item label="付款说明">
        <el-input v-model="form.policyDesc" type="textarea" readonly />
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
export default {
  props: {
    row: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      form: this.row
    }
  }
}
</script>
