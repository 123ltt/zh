<template>
  <!-- 仓库信息新增 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="openData" label-width="100px">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="warehouseType" label="仓库类型" :rules="{ required: true, message: '请输入仓库类型', trigger: 'change' }">
            <el-select v-model="openData.warehouseType" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%">
              <el-option v-for="item in warehouseTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="warehouseBelong" label="仓库归属" :rules="{ required: true, message: '请选择仓库归属', trigger: 'change' }">
            <el-select v-model="openData.warehouseBelong" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%">
              <el-option v-for="item in warehouseBelongList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="countryCode" label="国家编码" :rules="{ required: true, message: '请输入国家编码', trigger: 'change' }">
            <el-select v-model="openData.countryCode" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%">
              <el-option v-for="item in countryList" :key="item.id" :label="item.showName" :value="item.countryCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="warehouseName" label="仓库名称" :rules="{ required: true, message: '请输入仓库名称', trigger: 'blur' }">
            <el-input v-model.trim="openData.warehouseName" clearable placeholder="请输入" :disabled="!isAdd" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="warehouseNumber" label="仓库代码" :rules="{ required: true, message: '请输入仓库代码', trigger: 'blur' }">
            <el-input v-model.trim="openData.warehouseNumber" placeholder="请输入" :disabled="!isAdd" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="warehouseUse" label="仓库用途" :rules="{ required: true, message: '请输入仓库用途', trigger: 'change' }">
            <el-select v-model="openData.warehouseUse" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%">
              <el-option v-for="item in useList" :key="item.value" :label="item.desc" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">仓库地址</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="contacter" label="联系人" :rules="{ required: true, message: '请输入联系人', trigger: 'blur' }">
            <el-input v-model.trim="openData.contacter" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="mobilePhone" label="移动电话" :rules="{ required: true, message: '请输入移动电话', trigger: 'blur' }">
            <el-input v-model.trim="openData.mobilePhone" v-input.positive.numeric clearable placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <span slot="label">
              固定电话</span>
            <el-input v-model.trim="telCode" maxlength="4" clearable style="width:30%" placeholder="请输入" />
            <span class="divider"> — </span>
            <el-input v-model.trim="telNumber" v-input.positive.numeric style="width:60%" class="telNumber" clearable placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item prop="address" label="仓库地址:" :rules="{ required: true, message: '请输入仓库地址', trigger: 'blur' }">
            <el-input v-model.trim="openData.address" clearable placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item style="text-align: right;padding-right: 20px;">
            <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
            <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
          </el-form-item>
        </el-col>

      </el-row>
    </el-card>

  </el-form>
</template>

<script>

import { update, save, getUseList, updateDetail, getCountry } from '@/api/base/imsWarehouse.js'

export default {
  name: 'ImsWarehouseAdd',
  props: {
    isAdd: Boolean,
    addData: Object,
    warehouseTypeList: Array,
    warehouseBelongList: Array
  },
  data() {
    return {
      loading: false,
      openData: {},
      productCategory: '',
      productName: '',
      telCode: '',
      telNumber: '',
      flg: false,
      countryList: [],
      useList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.rulesForm.clearValidate() // 先清空校验
    })
    this.dealWith()
  },
  methods: {
    // 检验固定电话
    isTel() {
      if (this.telNumber !== '' || this.telCode !== '') {
        if (this.telNumber === '' || this.telCode === '') {
          this.$message.error('固定号码不完整，请重填！')
          return false
        } else if (!(/^0\d{2,3}$/.test(this.telCode)) || !(/^\d{7,8}$/.test(this.telNumber))) {
          this.$message.error('固定号码有误，请重填！')
          return false
        } else {
          this.openData.telephone = this.telCode + '-' + this.telNumber
          return true
        }
      } else {
        return true
      }
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!(/^1[3456789]\d{9}$/.test(this.openData.mobilePhone))) {
            this.$message.error('手机号码有误，请重填！')
          } else if (this.isTel()) {
            if (this.isAdd) {
              save(this.openData).then(() => {
                this.$parent.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            } else {
              update(this.openData).then(() => {
                this.$parent.$emit('close', true)
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        }
      })
    },
    // 编辑处理
    dealWith() {
      this.loading = true
      getCountry().then(res => {
        this.countryList = res.data
      })
      getUseList().then(res => {
        this.useList = res.data
      })
      if (this.isAdd) {
        this.openData = JSON.parse(JSON.stringify(this.addData))
        this.loading = false
      } else {
        updateDetail(this.addData.id).then(res => {
          this.openData = res.data
          this.openData.warehouseType = this.openData.warehouseType.value
          this.openData.warehouseUse = this.openData.warehouseUse.value
          if (this.openData.telephone) {
            this.telCode = this.openData.telephone.split('-')[0]
            this.telNumber = this.openData.telephone.split('-')[1]
          }
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }

.divider{
  display: inline-block;
  width: 10%;
  text-align: center;
  color: #c4c7cf;
}

.redStar{
  color: red;
  font-size: 12px;
}
</style>
