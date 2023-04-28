<template>
  <!-- 币种编辑 -->
  <el-form ref="currEditForm" :model="openData" label-width="auto" size="small">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="currName" label="币种名称" :rules="{ required: true, message: '币种名称不能为空', trigger: 'change' }">
          <el-input v-model="openData.currName" size="small" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="currCode" label="币种代码" :rules="{ required: true, message: '币种代码不能为空', trigger: 'change' }">
          <el-input v-model="openData.currCode" size="small" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;">
          <el-button size="small" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="small" type="primary" @click="define()">修改</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

import { update } from '@/api/currency.js'
export default {
  name: 'CurrencyAdd',
  props: {
    openData: Object
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
  },
  methods: {
    // 确认新增
    define() {
      this.$refs.currEditForm.validate((valid) => {
        if (valid) {
          update(this.openData).then(() => {
            this.$parent.$emit('close', true)
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-item {
    margin-bottom: 10px !important;
  }
  .el-button {
    width: 60px;
  }
  .redStar {
    color: red;
    font-size: 12px;
  }
</style>
