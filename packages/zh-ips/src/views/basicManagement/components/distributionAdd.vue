<template>
  <!-- 库存新增，编辑 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="openData" label-width="100px" :rules="rules">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="supplierId" label="供应商名称">
          <g-select v-model="openData.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" :disabled="!isAdd" value-field="supplierId" @change="changeSup" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="developerId" label="开发员">
          <g-select v-model="openData.developerId" style="width:100%;" :items="userList" key-field="id" label-field="account" value-field="id" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="productDirectorId" label="产品对接员">
          <g-select v-model="openData.productDirectorId" style="width:100%;" :items="userList" key-field="id" label-field="account" value-field="id" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="localPurchaserId" label="本地仓采购员">
          <g-select v-model="openData.localPurchaserId" style="width:100%;" :items="userList" key-field="id" label-field="account" value-field="id" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="overseaPurchaserId" label="海外仓采购员">
          <g-select v-model="openData.overseaPurchaserId" style="width:100%;" :items="userList" key-field="id" label-field="account" value-field="id" />
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

import { supplier, getUser } from '@/api/commonApi.js'
import { save, update, getDetail } from '@/api/basicManagement/distribution.js'
export default {
  name: 'CycleAdd',
  props: {
    isAdd: Boolean,
    editData: Object
  },
  data() {
    return {
      loading: false,
      userList: [],
      supplierList: [],
      openData: {
        id: '',
        supplierId: '',
        developerId: '',
        productDirectorId: '',
        localPurchaserId: '',
        overseaPurchaserId: ''
      },
      rules: {
        supplierId: [{ required: true, message: '请选择供应商名称', trigger: 'change' }],
        developerId: [{ required: true, message: '请选择开发员', trigger: 'change' }],
        productDirectorId: [{ required: true, message: '请选择产品对接员', trigger: 'change' }],
        localPurchaserId: [{ required: true, message: '请选择本地仓采购员', trigger: 'change' }],
        overseaPurchaserId: [{ required: true, message: '请选择海外仓采购员', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getshu() {
      this.loading = true
      supplier().then(res => {
        this.supplierList = res.data
        this.loading = false
      })
      getUser().then(res => {
        this.userList = res.data.records
      })
    },
    async getData() {
      await this.getshu()
      if (!this.isAdd) {
        this.loading = true
        await getDetail(this.editData.id).then(res => {
          const data = res.data
          Object.keys(this.openData).forEach(item => {
            this.openData[item] = data[item]
          })
          this.conversion(this.openData)
          this.loading = false
        })
      }
    },
    changeSup(val) {
      if (val) {
        this.openData.developerId = val.data.assignUserId + ''
      } else {
        this.openData.developerId = ''
      }
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
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
      })
    },
    // 数字转字符
    conversion(val) {
      Object.keys(val).forEach(item => {
        if (val[item] === +val[item]) {
          val[item] = val[item] + ''
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.redStar{
  color: red;
  font-size: 12px;
}
</style>
