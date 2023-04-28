<template>
  <el-form ref="form" :model="form" size="mini" label-width="165px" class="form-col" :rules="rules" @submit.native.prevent>
    <el-form-item label="所有子SKU利润率调整为：" prop="profitRate" class="mb-5">
      <el-input v-model="form.profitRate" size="mini" class="w-100" type="text" placeholder="请输入" @input="() => {form.profitRate = toFixed2(form.profitRate)}" />
    </el-form-item>
    <div class="text-end">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit('form')">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
import { toFixed2 } from '../addListing.handle.js'
export default {
  name: 'BatchUpdateRate',
  data() {
    const validate = (rule, value, callback) => {
      if (value && value > 0) {
        callback()
      } else {
        callback(new Error('利润率为大于0的数字'))
      }
    }
    return {
      toFixed2,
      form: {
        profitRate: ''
      },
      rules: {
        profitRate: [{ required: true, validator: validate, trigger: 'blur' }]
      }
    }
  },
  methods: {
    cancel() {
      this.$parent.$emit('close')
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$parent.$emit('close', this.form.profitRate)
        } else {
          return false
        }
      })
    }
  }
}
</script>
