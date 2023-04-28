<template>
  <!-- 新增分销方 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="tenantsData" label-width="100px" :rules="rules">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="productAuthId" label="分销方(货权)">
          <el-select v-model="tenantsData.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getName">
            <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="分销方(货主)">
          <el-input value="全部货主" disabled style="width:80%" />
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

import { getOrg } from '@/api/public/public.js'

export default {
  name: 'TenantsAdd',
  props: {},
  data() {
    return {
      loading: false,
      orgList: [],
      rules: {
        productAuthId: [{ required: true, message: '请选择共享方(货权)', trigger: 'change' }]
      },
      tenantsData: {
        productAuthId: '',
        productAuthName: '',
        productOwnerId: '-1'
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取下拉数据
    getData() {
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getName(val) {
      const arr = this.orgList.filter(item => {
        return item.tenantId === val
      })
      this.tenantsData.productAuthName = arr[0].tenantName
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        this.$parent.$emit('close', this.tenantsData)
      })
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
