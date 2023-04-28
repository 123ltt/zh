<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="90px" :rules="rules">
      <el-form-item label="店铺" prop="templateShop">
        <div v-if="row">{{ form.templateShop }}</div>
        <el-select v-else v-model="form.templateShop" filterable multiple clearable placeholder="请选择店铺" style="width: 96%">
          <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="刊登站点" prop="site">
        <el-select v-model="form.site" filterable placeholder="请选择" style="width: 96%" @change="changeSite">
          <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="模板" prop="templateId">
        <el-select v-model="form.templateId" filterable placeholder="请选择" style="width: 96%">
          <el-option v-for="item in templateList" :key="item.id" :label="item.templateName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="form.isDefault">设置为刊登默认描述模板</el-checkbox>
      </el-form-item>
      <div class="text-end">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { addTemplateShops, updateTemplateShops, getTemplateList } from '@/api/ebay/tag.js'
import { deepClone } from '@/util/util'

export default {
  props: {
    storeList: Array,
    siteList: Array,
    row: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      rules: {
        templateShop: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        site: [{ required: true, message: '请选择刊登站点', trigger: 'change' }],
        templateId: [{ required: true, message: '请选择模板', trigger: 'change' }]
      },
      templateList: [],
      form: {
        templateShop: []
      },
      oldForm: {}
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    this.getTemplateList()
    if (this.row) { // 编辑
      this.form = deepClone(this.row)
      this.oldForm = deepClone(this.row)
    }
  },
  methods: {
    changeSite() {
      this.getTemplateList()
      this.$set(this.form, 'templateId', '')
    },
    // 模板列表
    getTemplateList() {
      getTemplateList({ size: -1, status: 1, templateSite: this.form.site }).then(res => {
        this.templateList = res.data.records
      })
    },
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { id, site, templateId, templateShop, isDefault } = this.form
          if (id) { // 修改
            const { id, site, templateId, templateShopCode, isDefault } = this.form
            updateTemplateShops({ id, site, templateId, templateShopCode, isDefault }).then((res) => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          } else { // 添加
            const obj = Object.assign({ site, templateId, isDefault }, {
              templateShopCodes: templateShop.join(',')
            })
            addTemplateShops(obj).then((res) => {
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
