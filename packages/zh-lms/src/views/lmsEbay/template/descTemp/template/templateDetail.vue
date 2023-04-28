<template>
  <basic-container>
    <el-form ref="dialogForm" :model="form" size="mini" label-width="110px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="模板名称" prop="templateName">
            <div class="template-details">{{ form.templateName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="6"><el-button size="mini" type="primary" :disabled="!form.templateContext" @click="review">预览</el-button></el-col>
      </el-row>
      <el-form-item label="刊登站点" prop="templateSite">
        <div class="template-details">{{ form.templateSite }}</div>
      </el-form-item>
      <!-- <el-form-item label="店铺名" prop="templateShop">
        <div class="template-details">{{ form.templateShop }}</div>
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <div class="template-details">{{ form.status ? '启用' : '禁用' }}</div>
      </el-form-item>
      <el-row>
        <el-col :span="16">
          <el-form-item label="模板内容" prop="templateContext">
            <div class="template-content-box">
              <editor v-model="form.templateContext" :disabled="true" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </basic-container>
</template>

<script>
// import { templateDetail } from '@/api/ebay/tag.js'
import { Editor } from 'global-components'

export default {
  name: 'TemplateDetail',
  components: { Editor },
  props: {
    row: {
      type: Object
    }
  },
  data() {
    return {
      form: this.row
    }
  },
  // created() {
  //   this.getTemplateDetail()
  // }
  methods: {
    review() {
      this.$modal({
        title: '模板预览',
        component: this.form.templateContext,
        minHeight: '200px'
      })
    }
  //   getTemplateDetail() {
  //     const { id, templateName, templateShop, templateShopCode, templateSite } = this.row
  //     templateDetail({ id, templateName, templateShop, templateShopCode, templateSite }).then(res => {
  //       console.log(res)
  //     })
  //   }
  }
}
</script>

<style lang="scss" scoped>
.template-details {
  font-size: 12px;
  color: #606266;
}
</style>
