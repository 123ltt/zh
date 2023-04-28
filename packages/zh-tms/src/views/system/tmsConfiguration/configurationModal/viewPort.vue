<template>
  <div>
    <el-form ref="tableValid" label-width="85px" size="mini" :rules="rules" :model="formData">
      <el-row :gutter="0">
        <el-col :span="8">
          <el-form-item prop="propertyName" label="属性名称：">
            <el-input v-model.trim="formData.propertyName" style="width:295px" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="text-align:right;margin-right:0px">
        <el-button size="mini" type="primary" @click="cancel">取消</el-button>
        <el-button size="mini" type="primary" @click="saveBtn">保存</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    data: Object,
    type: String
  },
  data() {
    return {
      formData: {
        propertyName: ''
      },
      rules: {
        propertyName: [
          { required: true, message: '渠道名称不能为空', trigger: ['blur'] }
        ]
      }
    }
  },
  mounted() {
    this.type === 'add' ? this.$set(this.formData, 'propertyName', '') : this.$set(this.formData, 'propertyName', this.data.propertyName)
  },
  methods: {
    saveBtn() {
      this.$refs.tableValid.validate((valid) => {
        if (valid) {
          this.$parent.$emit('close', true, this.formData)
        }
      })
    },
    cancel() {
      this.$parent.$emit('close', false, '')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__error{
  width: 100px;
}
</style>
