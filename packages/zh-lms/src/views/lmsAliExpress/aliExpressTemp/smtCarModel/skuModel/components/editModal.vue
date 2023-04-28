<template>
  <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="90px" class="form-col" @submit.native.prevent="search">
    <el-form-item label="车型库模板" prop="templateName">
      <el-select v-model="form.templateName" style="width:100%">
        <el-option v-for="(item ,index) in templateNameOption" :key="index" :label="item.name" :value="item.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="SKU" prop="productSku">
      <el-input v-model="form.productSku" type="textarea" placeholder="请输入SKU，多个输入请用逗号、空格隔开" resize="none" clearable />
    </el-form-item>
    <el-form-item>
      <p class="default-p">提示：SKU与车型库模板绑定后，在创建对应SKU listing时，如出现车<br>
        型库属性要填，则自动带出绑定的车型库模板。</p>
    </el-form-item>
    <div class="text-end">
      <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
      <el-button type="primary" size="mini" @click="submitDialog('form')">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { carAttrSkuSave, getCarAttrTemplateList } from '@/api/aliExpress/temp.js'
export default {
  name: 'EditModal',
  data() {
    return {
      form: {
        templateName: '',
        templateId: '',
        productSku: ''
      },
      templateNameOption: [],
      rules: {
        templateName: [{ required: true, message: '车型库模板不能为空', trigger: 'change' }],
        productSku: [{ required: true, message: 'SKU不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getCarAttrTemplateList()
  },
  methods: {
    getCarAttrTemplateList() {
      getCarAttrTemplateList().then(res => {
        this.templateNameOption = res.data
      })
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const form = this.form
          form.templateId = this.templateNameOption.find(item => item.name === form.templateName).id
          form.productSkus = form.productSku.split(/,|，|\r|\n|\r\n|\s+/)
          delete form.productSku
          carAttrSkuSave({ ...this.form }).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }
  }

}
</script>

<style scoped>
.default-p{
  margin:0;
  line-height:16px;
  color: red;
}

</style>
