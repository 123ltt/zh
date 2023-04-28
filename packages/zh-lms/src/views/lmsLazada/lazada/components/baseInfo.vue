<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="w-90 form-col">
    <el-row>
      <el-col :span="12">
        <el-form-item label="店铺名称" prop="storeName">
          <el-row class="m0">
            <el-col class="mb-0">
              <el-select v-model="form.storeName" :disabled="isEdit" filterable placeholder="请选择店铺" class="g-w100" @change="changeAccount">
                <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-loading="productLoading > 0" label="SKU" prop="productSku">
          <div class="d-flex justify-content-between">
            <el-input v-model="form.productSku" :disabled="!form.storeName || isEdit" placeholder="请输入新系统SKU，只能单个输入" @blur="productBlur" />
            <el-button :disabled="!form.storeName || isEdit" type="primary" class="ms-2" @click="$emit('selectSkuModal')">select</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col v-if="childSkus" :span="12">
        <el-form-item label="子SKU">
          <el-input v-model="childSkus" disabled class="no-border" />
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit && !isVariation" :span="12">
        <el-form-item label="平台SKU">
          <el-input v-model="baseProductInfo.sellerSku" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="baseProductInfo.itemId" :span="12">
        <el-form-item label="ItemID">
          <el-input v-model="baseProductInfo.itemId" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" placeholder="请输入标题" class="g-w100" maxlength="255" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="产品类目" prop="productCatePath">
          <el-input v-model="baseProductInfo.productCatePath" disabled class="g-w100 no-border" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="平台类目" prop="categoryId">
          <el-row :gutter="4" class="ms-0 me-0">
            <el-col :span="6" class="cate d-flex justify-content-between">
              <el-input v-model="form.categoryId"
                        v-input.positive.numeric
                        :disabled="!form.storeName || Boolean(baseProductInfo.itemId)"
                        class="w-100"
                        placeholder="请选择"
                        @blur="(event) => findPrimaryCate(event.target.value, form.storeName)"
              />
              <div v-if="form.storeName && !Boolean(baseProductInfo.itemId)" v-loading="cateSearchLoading" class="cate ms-2 me-2">
                <g-select
                  ref="gselect"
                  :loading="cateSearchLoading"
                  :items="cateSearchList"
                  :item-title="true"
                  dropdown-width="calc(100% - 500px)"
                  placement="bottom-start"
                  key-field="categoryId"
                  label-field="path"
                  value-field="categoryId"
                  class="cate-change"
                  @keyword="queryCategorySearch"
                  @change="selectPlatformCateId"
                />
                <el-button :disabled="!form.storeName || Boolean(baseProductInfo.itemId)" icon="el-icon-search" />
              </div>
              <div v-if="form.storeName && !Boolean(baseProductInfo.itemId)">
                <div v-if="form.storeName">
                  <el-cascader ref="setPlatformCate" :props="cateProps" class="cate-cascader cate-change" @change="changePlatformCateId" @blur="cateBlur" />
                </div>
                <el-button :disabled="!form.storeName || Boolean(baseProductInfo.itemId)" icon="el-icon-menu" />
              </div>
            </el-col>
            <el-col v-if="primaryCatePath" :span="18">
              <el-input v-model="primaryCatePath" disabled class="no-border" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { getCateByStoreName, getLevelCategory, getCateogries, checkCategory, checkCateById } from '@/api/lazada/category.js'
export default {
  name: 'BaseInfo',
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    isEdit: Boolean,
    productLoading: Number,
    isVariation: Boolean,
    baseProductInfo: Object
  },
  data() {
    const that = this
    return {
      form: {
        platformCode: 'LZ',
        storeName: '',
        storeCode: '',
        listingType: '', // Listing类型 Variation Normal Combo
        listingStatus: this.isEdit ? this.baseProductInfo.listingStatus : 1,
        productSku: '',
        name: '', // 标题
        categoryId: '',
        site: 'MY'
      },
      rules: {
        storeName: [{ required: true, message: '店铺不能为空', trigger: 'blur' }],
        productSku: [{ required: true, message: `${this.isVariation ? 'SKU' : 'SKU'}不能为空`, trigger: 'blur' }],
        name: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        categoryId: [{ required: true, message: '平台类目不能为空', trigger: 'blur' }]
      },
      storeList: [],
      cateId: '',
      primaryCatePath: '', // 平台类目名称树
      cateSearchLoading: false,
      cateSearchList: [],
      // 类目选择列表配置
      cateProps: {
        lazy: true,
        leaf: 'isLeaf',
        label: 'name',
        value: 'categoryId',
        lazyLoad(node, resolve) {
          if (node.level) {
            getLevelCategory({
              siteCode: that.form.site,
              categoryId: node.data && node.data.categoryId
            }).then(res => {
              const data = res.data
              resolve(data)
            })
          } else { // 第一级
            getCateByStoreName({
              storeName: that.form.storeName,
              siteCode: that.form.site,
              listingStatus: that.form.listingStatus
            }).then(res => {
              const data = res.data
              resolve(data)
            })
          }
        }
      },
      childSkus: ''
    }
  },
  watch: {
    // 选择产品后，更新sku
    'baseProductInfo.productSku'(val) {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key]
      })
      this.form.site = this.baseProductInfo.itemId ? this.form.site : 'MY'
      this.childSkus = ''
      // 显示子sku
      const { skuList, combineSku } = this.baseProductInfo
      if (this.isVariation) {
        this.childSkus = skuList.map(item => item.productSku).join(',')
      } else if (combineSku) {
        this.childSkus = combineSku.map(item => `${item.sku}*${item.count}`).join(',')
      }
      // sku 改变，清空类目，多变体，短描述等
      this.form.categoryId = ''
      this.primaryCatePath = ''
      this.changeAccount(this.form.storeName, true) // 重置店铺下的一级类目
    }
  },
  created() {
    this.getAccount()
  },
  methods: {
    // 获取店铺列表
    getAccount() {
      this.$emit('productLoadingStart')
      storeOptionsWithPlatformCode({
        platformCode: this.form.platformCode
      }).then(res => {
        this.storeList = res.data
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 选择店铺事件
    changeAccount(value, isSkuChange) {
      return new Promise((resolve, reject) => {
        this.form.storeName = ''
        setTimeout(() => {
          this.form.storeName = value
          this.$refs.form.validateField('storeName')
          this.storeList.find(item => {
            if (item.displayName === value) {
              this.form.storeCode = item.candidateDisplayName
              this.form.accountGrossProfit = (item.publishGrossProfitRate && (+item.publishGrossProfitRate > 0)) ? item.publishGrossProfitRate : ''
              if (!isSkuChange) this.$emit('updateAccount', this.form)
              resolve(1)
            }
          })
        }, 200)
      })
    },
    // 手动输入sku获取详细信息
    productBlur(event) {
      const value = event.target.value
      if (value) {
        this.$emit('getSkuDetail', value)
      }
    },
    // 获取平台类目 (类目对照接口)
    getPlatformCateId(isNewSku = '', productCategoryId) {
      if (!productCategoryId) {
        return false
      }
      this.$emit('productLoadingStart')
      checkCategory({
        productCateId: productCategoryId,
        siteCode: this.form.site
      }).then(res => {
        if (res.data && res.data[0]) {
          const cateObj = res.data.find(item => item.isLeaf) || {}
          this.form.categoryId = cateObj.categoryId || ''
          this.primaryCatePath = cateObj.path || ''
          this.form.saleProfitRate = cateObj.profitRate || this.baseProductInfo.accountGrossProfit
          this.$refs.form.validateField('categoryId')
          this.$emit('updateCategoryId', { ...this.form, cateProfitRate: cateObj.profitRate })
          if (isNewSku && this.form.id) {
            this.$refs.form.validateField('storeName')
          }
        }
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 类目模糊搜索 (限制输入最少10个字母才能搜索)
    queryCategorySearch(name) {
      if (!name || name.length < 3) {
        // this.$message.error('输入最少3个字母才能搜索')
        return false
      }
      const { storeName, site, listingStatus } = this.form
      this.cateSearchLoading = true
      getCateogries({
        name,
        storeName,
        siteCode: site,
        listingStatus
      }).then(res => {
        this.cateSearchList = res.data
      }).finally(() => {
        this.cateSearchLoading = false
      })
    },
    // 手动选择平台类目（下拉框）
    selectPlatformCateId(data, selectedList) {
      if (data) {
        this.form.categoryId = data.categoryId
        this.primaryCatePath = data.path
        this.form.saleProfitRate = data.profitRate || this.baseProductInfo.accountGrossProfit
        this.$emit('updateCategoryId', { ...this.form, cateProfitRate: data.profitRate })
        this.$refs.form.validateField('categoryId')
      }
    },
    // 手动选择平台类目（级联）
    changePlatformCateId(value) {
      if (value && value.length) {
        setTimeout(() => {
          const data = this.$refs.setPlatformCate.getCheckedNodes(true)[0].data
          this.form.categoryId = data.categoryId
          this.form.saleProfitRate = data.profitRate || this.baseProductInfo.accountGrossProfit
          this.primaryCatePath = this.$refs.setPlatformCate.presentText.replace(/\s\/\s/g, '/')
          this.$emit('updateCategoryId', { ...this.form, cateProfitRate: data.profitRate })
          this.$refs.form.validateField('categoryId')
        }, 200)
      }
    },
    // 手动输入平台类目ID
    findPrimaryCate(categoryId, storeName, status, siteCode) {
      // 点击类目id输入框，id没变，不调类目和属性接口
      if (categoryId && Number(categoryId) === this.form.categoryId) {
        return false
      }
      const { site, listingStatus } = this.form
      const statuss = listingStatus || status
      if (!categoryId) return
      checkCateById({ categoryId, storeName, siteCode: siteCode || site, listingStatus: statuss }).then(res => {
        const { data } = res
        this.form.categoryId = data.categoryId
        this.primaryCatePath = data.path
        // if (status) return
        this.form.saleProfitRate = data.profitRate || this.baseProductInfo.accountGrossProfit
        this.$emit('updateCategoryId', { ...this.form, cateProfitRate: data.profitRate }, status)
        this.$refs.form.validateField('categoryId')
      }).catch(() => {
        this.primaryCatePath = ''
      })
    },
    cateBlur(value) {
      setTimeout(() => {
        this.$refs.setPlatformCate.inputValue = this.form.categoryId
      }, 600)
    }
  }
}
</script>

<style lang="scss" scoped>
.w-90{
  width: 90%;
}
.el-cate-dropdown-list{
  max-height: 285px;
  overflow-y: auto;
}
.cate-cascader{
  width: 42px !important;
}
.cate{
  position: relative;
}
.no-border{
  ::v-deep input{
    border: 0;
  }
}
.cate-change{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
  opacity: 0;
}
</style>
