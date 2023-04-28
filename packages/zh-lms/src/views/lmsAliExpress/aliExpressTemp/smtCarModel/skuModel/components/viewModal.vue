<template>
  <el-form :model="form" class="no-message">
    <el-form-item label="产品SKU">
      {{ form.productSku }}
    </el-form-item>
    <el-form-item label="模板名称">
      {{ form.templateName }}
    </el-form-item>
    <el-table ref="table" class="g-table" :data="form.templateDetails">
      <el-table-column label="COUNTRY" prop="country" />
      <el-table-column label="MAKE" prop="make" />
      <el-table-column label="MODEL" prop="model" />
      <el-table-column label="Year" prop="year" />
      <el-table-column label="TRIM" prop="trim" />
      <el-table-column label="ENGINE" prop="engine" />
    </el-table>
  </el-form>
</template>

<script>
import { carAttrSkuDetail } from '@/api/aliExpress/temp.js'
export default {
  name: 'ViewModal',
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    this.getCarAttrSkuDetail()
  },
  methods: {
    getCarAttrSkuDetail() {
      carAttrSkuDetail({ id: this.id }).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style>

</style>
