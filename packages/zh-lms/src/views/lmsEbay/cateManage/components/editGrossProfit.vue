<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="110px" :rules="rules">
      <el-form-item label="站点" prop="site">
        {{ form.site }}
      </el-form-item>
      <el-form-item label="类目树" prop="platCategoryPath">
        {{ form.platCategoryPath }}
      </el-form-item>
      <el-form-item label="平台类目名称" prop="platCategoryName">
        {{ form.platCategoryName }}
      </el-form-item>
      <el-form-item label="类目销售利润率" prop="profitRate">
        <el-input v-model="form.profitRate" v-input.number placeholder="请输入" maxlength="4" show-word-limit />
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
import { updateGrossProfit } from '@/api/ebay/category'

export default {
  name: 'EditGrossProfit',
  props: {
    row: Object
  },
  data() {
    const validateProfit = (rule, value, callback) => {
      if (value && value > 0 && value < 1) {
        callback()
      } else {
        callback(new Error('销售利润率为大于0，小于1的数字'))
      }
    }
    return {
      rules: {
        profitRate: [{ required: true, validator: validateProfit, trigger: 'blur' }]
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
          const { id, profitRate } = this.form
          updateGrossProfit({ id, profitRate }).then((res) => {
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
