<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="120px" :rules="rules">
      <el-form-item label="平台类目" prop="categoryName">
        {{ form.categoryName }}.
      </el-form-item>
      <el-form-item label="Product tax code" prop="value">
        <el-input v-model="form.value" placeholder="请输入" />
      </el-form-item>
      <div style="text-align: right">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import { updateTaxCode } from '@/api/walmart/attribute'

export default {
  name: 'EditTaxCode',
  props: {
    row: Object
  },
  data() {
    const validateValue = (rule, value, callback) => {
      if (!/^[0-9,]+$/.test(this.form.value)) {
        this.form.value = ''
        this.$message.warning('Product Tax Code只能输入数字')
      } else {
        callback()
      }
    }
    return {
      rules: {
        value: [{
          validator: validateValue,
          trigger: 'blur'
        }]
      },
      form: {},
      oldForm: null
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    this.form = deepClone(this.row)
    this.oldForm = deepClone(this.form)
  },
  methods: {
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { attributeName, categoryName, id, title, value } = this.form
          updateTaxCode({ attributeName, categoryName, id, title, value }).then((res) => {
            this.$message.success('操作成功')
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
