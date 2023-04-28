<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="120px" :rules="rules">
      <el-form-item label="类目树" prop="categoryPath">
        {{ form.categoryPath }}
      </el-form-item>
      <el-form-item label="平台类目名称" prop="enName">
        {{ form.enName }}
      </el-form-item>
      <el-form-item label="类目销售利润率" prop="grossProfit">
        <el-input v-model="form.grossProfit" v-input.number placeholder="请输入0.01-0.99范围之间" maxlength="4" show-word-limit />
      </el-form-item>
      <div class="text-end" style="margin-top: 120px">
        <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
        <el-button type="primary" size="mini" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { updateGrossProfit } from '@/api/aliExpress/category.js'
import { deepClone } from '@/util/util'

export default {
  name: 'UpdateCategory',
  props: {
    row: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        grossProfit: null
      },
      rules: {
        grossProfit: [{ required: true, message: '类目销售利润率不能为空', trigger: 'blur' },
          { pattern: /0\.\d+/g, message: '请输入0.01-0.99之间', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.row) {
      this.form = deepClone(this.row)
    }
  },
  methods: {
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateGrossProfit({ categoryId: this.row.categoryId, grossProfit: this.form.grossProfit }).then((res) => {
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

<style lang="scss">
.select-site-option {
  .el-select-dropdown__wrap {
    max-height: 150px;
  }
}
.select-mark-option {
  .el-select-dropdown__wrap {
    max-height: 148px;
  }
}
</style>
