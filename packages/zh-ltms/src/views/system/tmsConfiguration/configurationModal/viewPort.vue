<template>
  <div>
    <el-form ref="tableValid" label-width="100px" size="mini" :rules="rules" :model="formData">
      <el-row :gutter="10">

        <el-form-item prop="propertyName" label="属性名称：" class="ms-2">
          <el-input v-model.trim="formData.propertyName"
                    style="width:95%"
                    placeholder="请输入"
                    clearable
          />
        </el-form-item>
      </el-row>
      <el-row :gutter="10" class="text-end pe-4">
        <el-button size="mini" @click="cancel">取消</el-button>
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
    this.type === 'add'
      ? this.$set(this.formData, 'propertyName', '')
      : this.$set(this.formData, 'propertyName', this.data.propertyName)
  },
  methods: {
    saveBtn() {
      this.$refs.tableValid.validate((valid) => {
        if (valid) {
          this.$parent.$emit('close', true, this.formData.propertyName)
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
  width: 400px;
}
</style>
