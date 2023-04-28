<template>
  <el-form ref="rulesForm" v-loading="loading" :model="openData" label-width="90px" size="mini">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="supplierId" label="供应商名称" :rules="{ required: true, message: '供应商名称不能为空', trigger: 'change' }">
          <g-select v-model="openData.supplierId" :disabled="!isAdd" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="categoryId" label="商品类目" :rules="{ required: true, message: '商品类目不能为空', trigger: 'change' }">
          <category-cascader v-model="openData.categoryId" check-strictly :disabled="!isAdd" :multiple="false" style="width:100%" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="goodsBrand" label="品牌名称" :rules="{ required: true, message: '品牌名称不能为空', trigger: 'blur' }">
          <el-input
            v-model="openData.goodsBrand"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="brandDesc">
          <span slot="label">
            品牌说明:</span>
          <el-input
            v-model="openData.brandDesc"
            :autosize="{ minRows: 4, maxRows: 6}"
            type="textarea"
            clearable
            maxlength="500"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">{{ isAdd?'保存':'修改' }}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { save, update } from '@/api/goodsManagement/goodsBrand.js'
import { supplier } from '@/api/commonApi/common.js'
import CategoryCascader from '@/components/category-cascader/index.vue'

export default {
  name: 'GoodsBrandAdd',
  components: { CategoryCascader },
  props: {
    isAdd: Boolean,
    openData: Object // 父传子的表格参数
  },
  data() {
    return {
      supplierList: [],
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      supplier().then(res => {
        this.supplierList = res.data
        this.loading = false
      })
    },
    // 保存
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          (this.isAdd ? save : update)(this.openData).then(() => {
            this.$parent.$emit('close', true)
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
    box-sizing: border-box;
}
</style>
