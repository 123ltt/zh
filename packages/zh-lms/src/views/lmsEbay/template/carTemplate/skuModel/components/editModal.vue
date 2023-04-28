<template>
  <basic-container style="min-width: 0">
    <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="90px" class="form-col">
      <el-form-item label="刊登站点" prop="siteCode">
        <el-select v-model="form.siteCode" class="w-100" @change="changeSite">
          <el-option v-for="(item, index) in siteOption" :key="index" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="车型库模板" prop="templateId">
        <el-select v-model="form.templateId" style="width:100%">
          <el-option v-for="(item ,index) in templateNameOption" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SKU" prop="productSku">
        <el-input v-model="form.productSku" type="textarea" placeholder="请输入产品SKU，多个输入请用空格隔开" resize="none" clearable />
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
  </basic-container>
</template>

<script>
import { bindSku, getCarTempList } from '@/api/ebay/template.js'
import { deepClone } from '@/util/util'
export default {
  name: 'EditModal',
  props: {
    siteOption: Array
  },
  data() {
    // const validateSku = (rule, value, callback) => {
    //   if (value) {
    //     const params = value.split(' ')
    //     getTypeByProductCodes(params).then(res => {
    //       const data = res.data
    //       const deletedArr = []
    //       data.forEach(item => {
    //         if (item.type === 1) {
    //           deletedArr.push(item)
    //         }
    //       })
    //       const str = deletedArr.join()
    //       str && callback(new Error(`只能绑定sku或组合sku，${str}为spu不能绑定，请删除`))
    //     })
    //   } else {
    //     callback(new Error('请输入产品SKU'))
    //   }
    // }
    return {
      form: {},
      templateNameOption: [],
      rules: {
        siteCode: [{ required: true, message: '请选择刊登站点', trigger: 'change' }],
        templateId: [{ required: true, message: '请选择车型库模板', trigger: 'change' }],
        productSku: [{ required: true, message: '请输入产品SKU', trigger: 'blur' }]
      }
    }
  },
  methods: {
    changeSite() {
      this.getCarTempList()
      this.$set(this.form, 'templateId', '')
    },
    getCarTempList() {
      getCarTempList({ siteCode: this.form.siteCode }).then(res => {
        this.templateNameOption = res.data.records
      })
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const form = deepClone(this.form)
          form.productSkus = form.productSku.trim().split(/\s+/)
          delete form.productSku
          bindSku({ ...form }).then(res => {
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
