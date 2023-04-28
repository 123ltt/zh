<template>
  <basic-container style="min-width: 0">
    <el-form :model="form" class="no-message">
      <el-form-item label="产品SKU">
        {{ row.productSku }}
      </el-form-item>
      <el-form-item label="模板名称">
        {{ row.templateName }}
      </el-form-item>
      <el-form-item label="刊登站点">
        {{ row.siteCode }}
      </el-form-item>
      <el-table :data="form.templateDetails" border stripe highlight-current-row class="form-table g-table v-table mb-4">
        <el-table-column v-for="(item, index) in tempHeadTitle" :key="index" :label="item.label" :property="item.property">
          <template slot-scope="scope">
            <div>{{ scope.row[scope.column.property] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </basic-container>
</template>

<script>
import { getCarTempDetail } from '@/api/ebay/template.js'
export default {
  name: 'ViewModal',
  props: {
    row: {
      type: Object
    }
  },
  data() {
    return {
      form: {},
      tempHeadTitle: []
    }
  },
  mounted() {
    this.getCarTempDetail()
  },
  methods: {
    getCarTempDetail() {
      getCarTempDetail({ id: this.row.templateId }).then(res => {
        const data = res.data.details
        const arr = data.map(item => JSON.parse(item.compatibilityJson))
        this.form.templateDetails = arr
        Object.keys(arr[0]).forEach(item => {
          if (item !== 'id') {
            this.tempHeadTitle.push({
              label: item,
              property: item
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.v-table {
  td {
    padding: 8px 0;
  }
}
</style>
