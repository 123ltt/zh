<template>
  <!-- 周转新增，编辑 -->
  <el-form ref="rulesForm" size="mini" :model="openData" label-width="120px">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item prop="productSku" label="产品编码" :rules="{ required: true, message: '请输入产品编码', trigger: 'blur' }">
          <el-input v-model.trim="openData.productSku" clearable :disabled="!isAdd" placeholder="请输入" @input="toget" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="productName" label="产品名称">
          <el-input v-model.trim="productName" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="productCategory" label="产品类目">
          <el-input v-model.trim="productCategory" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="monthlyTurnoverDays" label="月周转天数" :rules="{ required: true, message: '请输入月周转天数', trigger: 'blur' }">
          <el-input v-model.trim="openData.monthlyTurnoverDays" v-input.numeric.positive maxlength="2" clearable placeholder="请输入正整数">
            <template slot="prepend">大于等于</template>
          </el-input>
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

import { searchSkuTopN, update, save } from '@/api/basicManagement/turnoverRules.js'
export default {
  name: 'TurnoverRulesAdd',
  props: {
    isAdd: Boolean,
    openData: Object
  },
  data() {
    return {
      productCategory: '',
      productName: '',
      flg: false
    }
  },
  mounted() {
    this.dealWith()
  },
  methods: {
    // 获取产品名称，类目
    toget(val) {
      if (val) {
        const obj = {
          data: {
            lstProductSku: [val],
            lstStatus: [2]
          }
        }
        searchSkuTopN(obj).then(res => {
          const data = res.data.records
          if (data.length !== 0) {
            this.flg = true
            this.productCategory = data[0].categoryName
            this.productName = data[0].productName
          } else {
            this.flg = false
            this.productCategory = ''
            this.productName = ''
          }
        })
      } else {
        this.productCategory = ''
        this.productName = ''
      }
    },
    // 封装判断函数
    bool(val) {
      if (val == null || val === '') {
        return true
      }
      return false
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.flg) {
            this.$message.error('请填写正确产品编码!')
          } else if (this.openData.monthlyTurnoverDays > 31) {
            this.$message.error('月周转天数不能超过31天!')
          } else {
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
      if (this.isAdd) {
        this.flg = false
      } else {
        this.flg = true
        const obj = {
          data: {
            lstProductSku: [this.openData.productSku],
            lstStatus: [2]
          }
        }
        searchSkuTopN(obj).then(res => {
          const data = res.data.records
          this.productCategory = data[0].categoryName
          this.productName = data[0].productName
        })
      }
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
