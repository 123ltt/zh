<template>
  <!-- 报关 -->
  <el-form ref="rulesForm" v-loading="loading" :model="openData" size="mini" label-width="70px" :rules="rules">
    <el-row>
      <el-col :span="24">
        <el-form-item prop="declaredProductName" label="申报品名">
          <el-input v-model.trim="openData.declaredProductName" clearable placeholder="请填写" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="brand" label="品牌">
          <el-input v-model.trim="openData.brand" clearable placeholder="请填写" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="model" label="型号">
          <el-input v-model.trim="openData.model" clearable placeholder="请填写" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="unit" label="单位">
          <el-input v-model.trim="openData.unit" clearable placeholder="请填写" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

import { getInfo, declareAdd, declareUpdate } from '@/api/basicManagement/product.js'

export default {
  name: 'ProductAddDeclare',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      openData: {
        declaredProductName: '',
        productMatchGoodsId: this.id,
        model: '',
        unit: '',
        brand: ''
      },
      rules: {
        declaredProductName: [{ required: true, message: '请输入申报品名', trigger: 'blur' }],
        brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
        model: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }]
      },
      isAdd: true
    }
  },
  mounted() {
    this.dealWith()
  },
  methods: {
    dealWith() {
      this.loading = true
      getInfo(this.id).then(res => {
        if (JSON.stringify(res.data) !== '{}') {
          this.openData = res.data
          this.isAdd = false
        } else {
          this.isAdd = true
        }
        this.loading = false
      })
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          (this.isAdd ? declareAdd : declareUpdate)(this.openData).then(() => {
            this.$parent.$emit('close', true)
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.redStar{
  color: red;
  font-size: 12px;
}
.cardBox{
  ::v-deep .el-card__body{
    padding-bottom: 0;
  }
}
.btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 40px!important;
        }
    }
.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
</style>
