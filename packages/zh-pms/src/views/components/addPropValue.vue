// 添加属性值
<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px" @submit.native.prevent="submit">
    <el-form-item label="中文名称" prop="cnName">
      <el-input v-model="form.cnName" />
    </el-form-item>
    <el-form-item label="英文名称" prop="enName">
      <el-input v-model="form.enName" />
    </el-form-item>
    <el-form-item label="取值编码" prop="code">
      <el-input v-model="form.code" />
    </el-form-item>
    <el-form-item class="text-end mb-0">
      <el-button size="small" @click="$parent.$emit('close')">取消</el-button>
      <el-button size="small" type="primary" native-type="submit" :loading="submitting">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { required } from '@/util/formRules'
import { saveInsertProp } from '@/api/sku'

export default {
  props: {
    id: String,
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    const requiredRule = required()
    return {
      submitting: false,
      form: {
        cnName: '',
        enName: '',
        code: ''
      },
      rules: {
        cnName: requiredRule,
        enName: requiredRule,
        code: requiredRule
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            value: this.form.cnName.trim(),
            valueEn: this.form.enName.trim(),
            code: this.form.code.trim()
          }

          // 判断 value, valueEn, code 是否没有存在this.list列表中
          const ok = this.list.every(item => {
            return Object.entries(item).every(([key, value]) => {
              if (value === data[key]) {
                this.$message.error(`${value} 已存在`)
                return false
              }
              return true
            })
          })

          if (ok) {
            this.submitting = true
            data.default = false
            const list = [...this.list, data]
            saveInsertProp({
              fieldId: this.id,
              newCutName: JSON.stringify(data)
            }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', list, data)
            }).finally(() => {
              this.submitting = false
            })
          }
        }
      })
    }
  }
}
</script>
