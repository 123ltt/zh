<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="60px" :rules="rules">
      <el-form-item label="站点" prop="site">
        <el-select v-model="form.site" clearable filterable placeholder="请选择站点" style="width:100%;" popper-class="select-site-option">
          <el-option v-for="(item, index) in sites" :key="index" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
      <div class="text-end" style="margin-top: 120px">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { updateCategory } from '@/api/ebay/category'

export default {
  name: 'EditGrossProfit',
  props: ['sites'],
  data() {
    return {
      form: {},
      rules: {
        site: [{ required: true, message: '请选择站点', trigger: 'change' }]
      }
    }
  },
  methods: {
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { site } = this.form
          updateCategory({ site }).then((res) => {
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
