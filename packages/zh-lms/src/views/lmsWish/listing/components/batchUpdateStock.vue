<template>
  <el-form ref="form" :model="form" size="mini" label-width="130px" class="form-col" :rules="rules">
    <el-form-item :label="`批量修改${typeTitle}为：`" prop="quantity" :rules="typeNum === 2?[{ required: true, pattern: /0\.\d+/g, message: '请输入0.01-0.99之间', trigger: 'blur' }]:[{ required: true, message: `请输入${typeTitle}数`, trigger: 'blur' }]">
      <!-- 售价 利润率 -->
      <el-input v-if="typeNum !== 3" v-model="form.quantity" v-input.positive.number size="mini" :maxlength="typeNum === 3?'4':''" class="w-100" type="text" placeholder="请输入" />
      <el-input v-else v-model="form.quantity" v-input.numeric size="mini" maxlength="4" class="w-100" type="text" placeholder="请输入" />
    </el-form-item>
    <div class="text-end">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit('form')">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'BatchUpdateStock',
  props: {
    typeTitle: String,
    typeNum: Number
  },
  data() {
    return {
      form: {
        quantity: ''
      },
      rules: {
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
          this.$parent.$emit('close', this.form.quantity)
        } else {
          return false
        }
      })
    }
  }
}
</script>
