<template>
  <!-- 浮动汇率新增 -->
  <el-form ref="floatRateForm" size="small" :model="openData" label-width="auto">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item prop="origCurrCode" label="原币种" :rules="{ required: true, message: '原币种不能为空', trigger: 'change' }">
          <el-select ref="input" v-model="openData.origCurrCode" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%">
            <el-option v-for="item in currencyList" :key="item.currCode" :label="item.currName+item.currCode" :value="item.currCode" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="trgtCurrCode" label="目标币" :rules="{ required: true, message: '目标币不能为空', trigger: 'change' }">
          <el-select ref="input" v-model="openData.trgtCurrCode" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%">
            <el-option v-for="item in currencyList" :key="item.currCode" :label="item.currName+item.currCode" :value="item.currCode" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="latestRate" label="浮动汇率" :rules="{ required: true, message: '请输入非负数', trigger: 'blur' }">
          <el-input v-model="openData.latestRate" v-input.positive clearable placeholder="请输入非负数" style="width:100%" @input="changeFloatRate" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="effectiveType" label="生效类型" :rules="{ required: true, message: '生效类型不能为空', trigger: 'change' }">
          <el-select ref="input" v-model="openData.effectiveType" clearable placeholder="请选择" filterable style="width:100%" @input="effectiveTypePicker()">
            <el-option v-for="item in effectiveTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="effectiveDate" label="生效日期" :rules="{ required: true, message: '生效日期不能为空', trigger: 'change' }">
          <el-date-picker v-model="openData.effectiveDate" type="date" placeholder="选择日期时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:100%" :picker-options="effectiveTimePicker()" :disabled="isEffectiveType" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right">
          <el-button size="small" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="small" type="primary" @click="define()">{{ isAdd ? '保存' :
            isAdjust ? '调整' : '修改' }}
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

import { save, adjust, update } from '@/api/floatRate.js'
import { dateFormat } from '@/util/date'
export default {
  name: 'FloatRateAdd',
  props: {
    isAdd: Boolean,
    isAdjust: Boolean,
    openData: Object,
    currencyList: Array,
    effectiveTypeList: Array
  },
  data() {
    return {
      loading: false,
      // 生效类型判断
      isEffectiveType: false
    }
  },
  mounted() {
    this.delWith()
  },
  methods: {
    // 确认新增
    define() {
      this.$refs.floatRateForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            save(this.openData).then(() => {
              this.$parent.$emit('close')
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          } else {
            if (this.isAdjust) {
              adjust(this.openData).then(() => {
                this.$parent.$emit('close')
                this.$message({
                  type: 'success',
                  message: '调整成功!'
                })
                this.close()
              })
            } else {
              update(this.openData).then(() => {
                this.$parent.$emit('close')
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                this.close()
              })
            }
          }
        }
      })
    },
    // 选择生效时间处理
    effectiveTimePicker() {
      return {
        disabledDate: (time) => {
          // 生效类型选择立即生效，生效日期自动带出当前天且不可更改
          if (this.openData.effectiveType === '1') {
            this.isEffectiveType = true
            return true
          } else if (this.openData.effectiveType === '2') {
            this.isEffectiveType = false
            // 生效类型选择预期生效，则生效日期只能选择大于当前天的日期
            return time.getTime() < Date.now()
          } else {
            this.isEffectiveType = false
            return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }
    },
    // 生效类型处理
    effectiveTypePicker() {
      if (this.openData.effectiveType === '1') {
        this.isEffectiveType = true
        // 立即生效，默认赋值生效日期为当前时间
        const date = new Date()
        this.openData.effectiveDate = dateFormat(date).split(' ')[0]
      } else {
        this.openData.effectiveDate = ''
        this.isEffectiveType = false
      }
    },
    changeFloatRate(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 6) {
        this.openData.latestRate = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    delWith() {
      if (!this.isAdd) {
        // 转换数据类型
        this.openData.effectiveType = this.openData.effectiveType + ''
        if (this.openData.effectiveType === '1') {
          this.isEffectiveType = true
          if (this.isAdjust) {
          // 立即生效，默认赋值生效日期为当前时间
            const date = new Date()
            this.openData.effectiveDate = dateFormat(date).split(' ')[0]
          }
        } else {
          this.isEffectiveType = false
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
  .el-button {
    width: 60px;
  }
  .redStar {
    color: red;
    font-size: 12px;
  }
</style>
