<template>
  <el-form ref="form" :model="formInfo" :rules="rules" label-width="70px" size="mini" class="form-col">
    <el-form-item label="账单日期" prop="date">
      <el-date-picker
        v-model="formInfo.date"
        type="daterange"
        value-format="yyyy-MM-dd"
        style="width:245px"
        range-separator="至"
        :start-placeholder="'开始日期'"
        :end-placeholder="'结束日期'"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { conditionDelBill } from '@/api/settlement'
export default {
  data() {
    return {
      formInfo: {
      },
      rules: {
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'formInfo.date'(val) {
      this.formInfo.startDate = val?.[0]
      this.formInfo.endDate = val?.[1]?.replace(/00:00:00/, '23:59:59')
    }
  },
  methods: {
    cancel() {
      this.$parent.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          conditionDelBill(this.formInfo).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>
