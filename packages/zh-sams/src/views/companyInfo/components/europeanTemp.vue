<template>
  <el-row style="width:80%;margin: auto;">
    <el-col :span="12">
      <span class="el-form-item__label">代理公司</span>
      <div class="el-form-item__content">{{ companyAgent.company || '-' }}</div>
    </el-col>
    <el-col :span="12">
      <span class="el-form-item__label">代理邮箱</span>
      <div class="el-form-item__content">{{ companyAgent.email || '-' }}</div>
    </el-col>
    <el-col :span="12">
      <span class="el-form-item__label">代理联系人</span>
      <div class="el-form-item__content">{{ companyAgent.contact || '-' }}</div>
    </el-col>
    <el-col :span="12">
      <span class="el-form-item__label">代理联系电话</span>
      <div class="el-form-item__content">{{ companyAgent.phone || '-' }}</div>
    </el-col>
    <el-col :span="12">
      <span class="el-form-item__label">代理公司地址</span>
      <div class="el-form-item__content">{{ companyAgent.companyAddress || '-' }}</div>
    </el-col>
    <el-col :span="12">
      <span class="el-form-item__label">代理的国家</span>
      <div class="el-form-item__content">{{ companyAgent.country===1 ?'欧代':'英代'|| '-' }}</div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'EuropeanTemp',
  props: {
    type: String,
    companyAgent: Object
  }
}
</script>

<style>

</style>
