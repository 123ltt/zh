<template>
  <!-- 新增共享产品 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="productData" label-width="100px" :rules="rules">
    <el-row :gutter="10">
      <el-col :span="16">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="productSku" label="产品编码">
              <el-input v-model.trim="productData.productSku" clearable placeholder="请输入" @change="getInfo" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="productName" label="产品名称" class="is-required">
              <el-input v-model.trim="productName" disabled placeholder="由产品编码自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="categoryPath" label="产品类目" class="is-required">
              <el-input v-model.trim="categoryPath" disabled placeholder="由产品编码自动生成" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <div class="imgBox">
          <el-image style="width: 60%;" :src="imageUrl?imageUrl:'https://img.zcool.cn/community/017bcb58b4db5fa801219c7719b5ff.jpg@1280w_1l_2o_100sh.jpg'" />
        </div>
      </el-col>
      <el-col :span="12">
        <el-form-item label="共享数量" class="is-required">
          <el-input value="全部" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="共享前价格" prop="priceBeforeSharing">
          <el-input v-model.trim="productData.priceBeforeSharing" v-input.positive placeholder="请输入" style="width:100%" @input="beforePrice">
            <template slot="append">RMB</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="共享后价格" prop="priceAfterSharing">
          <el-input v-model.trim="productData.priceAfterSharing" v-input.positive placeholder="请输入" style="width:100%" @input="afterPrice">
            <template slot="append">RMB</template>
          </el-input>
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

import { getProductInfo } from '@/api/handle/shared.js'
import { deepClone } from '@/util/util'

export default {
  name: 'SharedProductsAdd',
  props: {
    tableData: Object,
    isTable: Boolean
  },
  data() {
    return {
      loading: false,
      rules: {
        productSku: [{ required: true, message: '请填写产品编码！', trigger: 'blur' }],
        priceBeforeSharing: [{ required: true, message: '请填写共享前价格！', trigger: 'blur' }],
        priceAfterSharing: [{ required: true, message: '请填写共享后价格！', trigger: 'blur' }]

      },
      oldBeforeValue: '',
      oldAfterValue: '',
      productData: {
        skuInfo: {
          productName: '',
          imageUrl: '',
          categoryPath: ''
        },
        productSku: '',
        sharingQuantity: '-1',
        priceBeforeSharing: '',
        priceAfterSharing: ''
      },
      productName: '',
      categoryPath: '',
      imageUrl: '',
      getYes: true
    }
  },
  mounted() {
    this.dealWith()
  },
  methods: {
    // 获取产品信息
    getInfo(val) {
      if (val) {
        getProductInfo(val).then(res => {
          this.productName = res.data.productName
          this.categoryPath = res.data.categoryPath
          this.imageUrl = res.data.imageUrl
          this.getYes = true
        }).catch(() => {
          this.productName = ''
          this.categoryPath = ''
          this.imageUrl = ''
          this.getYes = false
        })
      } else {
        this.productName = ''
        this.categoryPath = ''
        this.imageUrl = ''
        this.getYes = false
      }
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.productData.sharingQuantity = '-1'
          if (!this.getYes) {
            this.$message.error('请填写正确的产品编码！')
          } else {
            this.productData.skuInfo.productName = this.productName
            this.productData.skuInfo.categoryPath = this.categoryPath
            this.productData.skuInfo.imageUrl = this.imageUrl
            this.$parent.$emit('close', this.productData)
          }
        }
      })
    },
    isYes(val) {
      if (val.indexOf('.') !== -1) {
        if (val.split('.')[1].length > 2) {
          return true
        }
      } else {
        if (val.length > 6) {
          return true
        }
      }
      return false
    },
    // 控制输入两位小数
    beforePrice(val) {
      if (this.isYes(val)) {
        this.productData.priceBeforeSharing = this.oldBeforeValue
      } else {
        this.oldBeforeValue = val
      }
    },
    afterPrice(val) {
      if (this.isYes(val)) {
        this.productData.priceAfterSharing = this.oldAfterValue
      } else {
        this.oldAfterValue = val
      }
    },
    dealWith() {
      if (!this.isTable) {
        this.productData = deepClone(this.tableData)
        this.categoryPath = this.productData.skuInfo.categoryPath
        this.productName = this.productData.skuInfo.productName
        this.imageUrl = this.productData.skuInfo.imageUrl
      }
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }

.divider{
  display: inline-block;
  width: 10%;
  text-align: center;
  color: #c4c7cf;
}

.redStar{
  color: red;
  font-size: 12px;
}
.imgBox{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items:flex-start;
  }
</style>
