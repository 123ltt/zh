<template>
  <el-form ref="form" :model="form" inline size="mini" :rules="rules">
    <el-form-item label="牛蛙SPU" prop="productSpu">
      <el-input v-model="form.productSpu" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { spuSync } from '@/api/sku.js'
export default {
  data() {
    return {
      form: {
        productSpu: ''
      },
      rules: {
        productSpu: [
          { required: true, message: '请填写牛蛙SPU' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          spuSync({ productSpu: this.form.productSpu }).then(res => {
            if (res.data[0].code) {
              this.$message.success(res.data[0].msg)
              this.close(true)
            } else {
              this.$message.warning(res.data[0].msg)
            }
          })
        } else {
          return false
        }
      })
    },
    close(isRefersh = false) {
      this.$parent.$emit('close', isRefersh)
    }
  }
}
</script>

<style>

</style>
