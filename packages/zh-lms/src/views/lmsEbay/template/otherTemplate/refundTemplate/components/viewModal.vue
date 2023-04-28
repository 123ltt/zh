<template>
  <basic-container style="min-width: 0">
    <el-form :model="form" size="mini" label-width="90px">
      <el-form-item label="名称" prop="templateShop">
        {{ form.policyName }}
      </el-form-item>
      <el-form-item label="默认模板" prop="site">
        {{ form.isDefault ? '是' : '否' }}
      </el-form-item>
      <el-form-item label="刊登站点" prop="">
        {{ form.siteCode }}
      </el-form-item>
      <el-form-item label="店铺" prop="storeName">
        {{ form.storeName }}
      </el-form-item>
      <el-form-item label="是否接受退货" prop="">
        {{ form.policyInfo.accepted==='ReturnsAccepted'?'是':'否' }}
      </el-form-item>
      <el-form-item label="退款天数" prop="">
        {{ form.policyInfo.days }}
      </el-form-item>
      <el-form-item label="退款方式" prop="">
        {{ form.policyInfo.type }}
      </el-form-item>
      <el-form-item label="运费承担" prop="">
        {{ form.policyInfo.costPaidType === 'Seller'?'卖家承担': '买家承担' }}
      </el-form-item>
      <el-form-item label="退货政策">
        <el-input v-model="form.policyInfo.content" type="textarea" readonly />
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
    },
    constList: {
      type: Object
    }
  },
  data() {
    return {
      form: this.row
    }
  },
  created() {
    const constList = this.constList
    Object.keys(constList.businessPolicyReturnType).forEach(item => {
      if (this.form.policyInfo.type === item) {
        this.form.policyInfo.type = constList.businessPolicyReturnType[item]
      }
    })
    Object.keys(constList.businessPolicyReturnDays).forEach(item => {
      if (this.form.policyInfo.days === item) {
        this.form.policyInfo.days = constList.businessPolicyReturnDays[item]
      }
    })
  }
}
</script>
