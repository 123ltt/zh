<template>
  <basic-container>
    <el-form
      ref="dialogForm"
      v-loading="productLoading"
      size="mini"
      class="form-col no-message"
      label-width="110px"
    />
    <el-collapse v-model="activeNames" class="add-linsting-box">
      <el-collapse-item name="baseInfo">
        <collapse-title slot="title" title="基本信息" />
        <el-row>
          <el-col :span="11">
            <span class="el-form-item__label">SKU</span>
            <div class="el-form-item__content">{{ detaildata.productSpu || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">店铺</span>
            <div class="el-form-item__content">{{ detaildata.account || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">标题</span>
            <div class="el-form-item__content">{{ detaildata.name || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">产品类目</span>
            <div class="el-form-item__content">{{ detaildata.productCatePath || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">平台类目</span>
            <div class="el-form-item__content">{{ detaildata.categoryId || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">Condition</span>
            <div class="el-form-item__content">{{ detaildata.Condition || '-' }}</div>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="categoryAttr">
        <collapse-title slot="title" title="属性及图片" />
        <el-row>
          <el-col :span="11">
            <span class="el-form-item__label">Manufacturer</span>
            <div class="el-form-item__content">{{ detaildata.productSpu || '-' }}</div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import { detail } from '@/api/shopee/shopee.js'
export default {
  name: 'ListingDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'categoryAttr', 'price', 'othInfo'],
      productLoading: false,
      detaildata: {}
    }
  },
  mounted() {
    this.id && this.getDetails()
  },
  methods: {
    getDetails() {
      this.productLoading = true
      detail({ id: this.id }).then(res => {
        this.productLoading = false
        this.detaildata = res.data
        this.detaildata.tierVariationJson = JSON.parse(res.data.tierVariationJson)
        this.detaildata.attributeJson = JSON.parse(this.detaildata.attributeJson)
        const attributes = JSON.parse(this.detaildata.attributes)
        this.detaildata.attributes = attributes.form
        console.log('🚀 ~ file: ~listingDetail.vue ~ line 88 ~ detail ~ this.detaildata.attributes', this.detaildata.attributes)
        this.detaildata.shopeeListingVariantDTOList = attributes.shopeeListingVariantDTOList
        this.detaildata.platCategoryPath = attributes.platCategoryPath
        this.detaildata.images = JSON.parse(this.detaildata.images)
      })
    }
  }

}
</script>

<style>

</style>
