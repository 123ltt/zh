<template>
  <basic-container>
    <el-row style="width:74%;margin: auto;">
      <el-col :span="12">
        <span class="el-form-item__label">公司名称/个人</span>
        <div class="el-form-item__content">{{ formObj.name || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">电话</span>
        <div class="el-form-item__content">{{ formObj.phone || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">公司类型</span>
        <div class="el-form-item__content">{{ formObj.companyTypeName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">注册时间</span>
        <div class="el-form-item__content">{{ formObj.regDate || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">信用卡卡号</span>
        <div class="el-form-item__content">{{ formObj.ccNumber || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">信用卡有效期</span>
        <div class="el-form-item__content">{{ formObj.ccExpirationDate || '-' }}</div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { getRegisterInfoById } from '@/api/storeList'
export default {
  name: 'RegisterInfoDetails',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    }
  },
  data() {
    return {
      formObj: {
        companyTypeName: '',
        name: '',
        phone: '',
        regDate: '',
        ccNumber: '',
        ccExpirationDate: ''
      }
    }
  },
  mounted() {
    this.getRegisterInfoById()
  },
  methods: {
    getRegisterInfoById() {
      getRegisterInfoById({ id: this.compId }).then(res => {
        this.formObj = res.data
      })
    }
  }

}
</script>

<style scoped>
.el-form-item__label {
  display: inline-block;
}
.el-form-item__content {
  color: #999;
}
</style>
