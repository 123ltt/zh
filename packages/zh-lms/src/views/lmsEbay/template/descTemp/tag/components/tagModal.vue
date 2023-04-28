<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="110px" :rules="rules" @submit.native.prevent>
      <el-form-item label="标签名称" prop="typeName">
        <el-input v-model="form.typeName" placeholder="请输入" maxlength="50" show-word-limit @keyup.native="changeToLowercase" />
      </el-form-item>
      <el-form-item label="标签类型" prop="typeLevel">
        <el-radio-group v-model="form.typeLevel" :disabled="false">
          <el-radio label="1">自定义</el-radio>
          <el-radio label="0">系统</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status" :disabled="false">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="text-end">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import { saveTagType, updateTagType } from '@/api/ebay/tag.js'

export default {
  name: 'EditTagType',
  props: ['row'],
  data() {
    const validateTypeName = (rule, value, callback) => {
      if (value && /^[a-z][a-z0-9_-]{1,}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入字母开头，字母、数字、中划线或下划线'))
      }
    }
    return {
      rules: {
        typeName: [{ required: true, validator: validateTypeName, trigger: 'blur' }]
      },
      form: {
        typeLevel: '1',
        status: '1'
      },
      oldForm: null
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    // 编辑
    if (this.row) {
      const { status, typeLevel } = this.row
      this.form = Object.assign(deepClone(this.row), {
        status: String(status),
        typeLevel: String(typeLevel)
      })
      this.oldForm = deepClone(this.form)
    }
  },
  methods: {
    changeToLowercase() {
      if (/[A-Z]/.test(this.form.typeName)) {
        this.form.typeName = this.form.typeName.toLowerCase()
      }
    },
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { id, typeName, status, typeLevel } = this.form
          const obj = Object.assign({}, {
            id,
            typeName,
            status: Number(status),
            typeLevel: Number(typeLevel)
          })
          if (id) { // 修改
            updateTagType(obj).then((res) => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          } else { // 添加
            saveTagType(this.form).then((res) => {
              this.$message.success('添加成功')
              this.$parent.$emit('close', true)
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
