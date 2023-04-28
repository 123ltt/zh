<template>
  <el-form ref="form" :model="form" size="mini" label-width="120px" class="form-col" :rules="rules">
    <el-form-item label="批量修改售价为：" prop="startPrice">
      <el-input v-model="form.startPrice" v-input.positive.numeric size="mini" maxlength="4" class="w-100" type="text" placeholder="请输入" />
    </el-form-item>
    <div class="text-end">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit('form')">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'BatchUpdatePrice',
  data() {
    return {
      form: {
        startPrice: ''
      },
      rules: {
        startPrice: [
          { required: true, message: '请输入售价', trigger: 'blur' }
        ]
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
          this.form.startPrice = Number(this.form.startPrice).toFixed(2)
          this.$parent.$emit('close', this.form.startPrice)
        } else {
          return false
        }
      })
    }
  }
}
</script>
