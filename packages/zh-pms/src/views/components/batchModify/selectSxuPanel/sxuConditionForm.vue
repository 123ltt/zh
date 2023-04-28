<template>
  <el-form label-width="130px" size="mini" class="form-col no-message" @submit.native.prevent>
    <el-row>
      <el-col :span="11">
        <el-form-item label="类目">
          <CategoryCascader v-model="form.categoryIds" lazy-multiple class="w-100" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="供应商名称">
          <CheckSupplier v-model="supplier" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item label="SPU/SKU编码">
          <g-multiple-input v-model="form.productCodes" placeholder="多个可换行或空格隔开" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="牛蛙SPU/SKU编码">
          <g-multiple-input v-model="form.nwProductCodes" placeholder="多个可换行或空格隔开" />
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item label-width="10px">
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import CategoryCascader from '@/components/category-cascader/index.vue'
import CheckSupplier from '../../checkSupplier.vue'

export default {
  components: { CategoryCascader, CheckSupplier },
  data() {
    return {
      supplier: '',
      form: {
        categoryIds: [],
        supplierName: '',
        productCodes: [],
        nwProductCodes: []
      }
    }
  },
  watch: {
    supplier(val) {
      this.form.supplierName = val.supplierName
    }
  },
  methods: {
    onSearch() {
      this.$emit('submit', deepClone(this.form))
    }
  }
}
</script>
