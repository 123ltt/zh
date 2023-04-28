<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="90px">
      <el-form-item label="店铺" prop="templateShop">
        {{ form.templateShop }}
      </el-form-item>
      <el-form-item label="刊登站点" prop="site">
        {{ form.site }}
      </el-form-item>
      <el-form-item label="模板" prop="templateName">
        {{ form.templateName }}
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="form.isDefault" :disabled="true">设置为刊登默认描述模板</el-checkbox>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
export default {
  props: {
    row: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      form: this.row
    }
  }
}
</script>
