<template>
  <!-- 月度汇率新增 -->
  <el-form ref="monthlyReportAddForm" size="small" :model="openData" label-width="auto">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item prop="origCurrCode" label="原币种" :rules="{ required: true, message: '原币种不能为空', trigger: 'change' }">
          <el-select ref="input" v-model="openData.origCurrCode" clearable placeholder="请选择" filterable>
            <el-option v-for="item in currencyList" :key="item.currCode" :label="item.currName+item.currCode" :value="item.currCode" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="trgtCurrCode" label="目标币" :rules="{ required: true, message: '目标币不能为空', trigger: 'change' }">
          <el-select ref="input" v-model="openData.trgtCurrCode" clearable placeholder="请选择" filterable>
            <el-option v-for="item in currencyList" :key="item.currCode" :label="item.currName+item.currCode" :value="item.currCode" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="rateType" label="汇率类型" :rules="{ required: true, message: '汇率类型不能为空', trigger: 'change' }">
          <el-select ref="input" v-model="openData.rateType" clearable placeholder="请选择" filterable>
            <el-option v-for="item in rateTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="directRate" label="直接汇率" :rules="{ required: true, message: '直接汇率不能为空', trigger: 'blur' }">
          <el-input v-model="openData.directRate" v-input.positive clearable placeholder="请输入非负数" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="indirectRate" label="间接汇率" :rules="{ required: true, message: '间接汇率不能为空', trigger: 'blur' }">
          <el-input v-model="openData.indirectRate" v-input.positive clearable placeholder="请输入非负数" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="effectiveDate" label="生效日期:" :rules="{ required: true, message: '生效日期不能为空', trigger: 'change' }">
          <el-date-picker v-model="openData.effectiveDate" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" :picker-options="startPicker()" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="exprDate" label="失效日期" :rules="{ required: true, message: '失效日期不能为空', trigger: 'change' }">
          <el-date-picker v-model="openData.exprDate" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" :picker-options="endPicker()" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;">
          <el-button size="small" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="small" type="primary" @click="define()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>

import { save } from '@/api/monthlyReport.js'
export default {
  name: 'CurrencyAdd',
  props: {
    currencyList: Array,
    rateTypeList: Array
  },
  data() {
    return {
      loading: false,
      openData: {
        origCurrCode: '',
        trgtCurrCode: '',
        rateType: '',
        directRate: '',
        indirectRate: '',
        effectiveDate: '',
        exprDate: ''
      }
    }
  },
  methods: {
    // 确认新增
    define() {
      this.$refs.monthlyReportAddForm.validate((valid) => {
        if (valid) {
          save(this.openData).then(() => {
            this.$parent.$emit('close')
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }
      })
    },
    // 选择生效时间处理
    startPicker() {
      return {
        disabledDate: (time) => {
          // 生效时间和失效时间同时存在，放开生效时间限制
          if (this.openData.exprDate && this.openData.effectiveDate) {
            return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
          } else if (this.openData.exprDate) {
            // 失效时间存在，生效时间小于等于失效时间
            return (time.getTime() >= new Date(this.openData.exprDate).getTime() || time.getTime() < (Date.now() - 24 * 60 * 60 * 1000))
          } else {
            return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }
    },
    // 选择失效时间处理
    endPicker() {
      return {
        disabledDate: (time) => {
          if (this.openData.effectiveDate) {
            // 生效时间存在，失效时间大于等于生效时间
            return time.getTime() <= (new Date(this.openData.effectiveDate).getTime() - 24 * 60 * 60 * 1000)
          } else {
            return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-item {
    margin-bottom: 10px !important;
  }
  .el-select {
    width: 100%;
  }
  .el-button {
    width: 60px;
  }
  .redStar {
    color: red;
    font-size: 12px;
  }
</style>
