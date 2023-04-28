<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="w-90 form-col">
    <el-row>
      <el-col :span="12">
        <el-form-item label="店铺名称" prop="account">
          <el-select v-model="form.account" :disabled="isEdit" filterable placeholder="请选择店铺" class="g-w100" @change="changeAccount">
            <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-loading="productLoading > 0" :label="isVariation ? 'SPU' : 'SKU'" prop="productSpu">
          <div class="d-flex justify-content-between">
            <el-input v-model="form.productSpu" :disabled="!form.account || isEdit" placeholder="请输入新系统SKU，只能单个输入" @blur="productBlur" />
            <el-button :disabled="!form.account || isEdit" type="primary" class="ms-2" @click="$emit('selectSkuModal')">select</el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col v-if="childSkus" :span="12">
        <el-form-item label="子SKU">
          <el-input v-model="childSkus" disabled class="no-border" />
        </el-form-item>
      </el-col>
      <el-col v-if="baseProductInfo.itemId" :span="12">
        <el-form-item label="ItemID">
          <el-input v-model="baseProductInfo.itemId" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="标题" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入标题" class="g-w100" maxlength="128" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="产品类目" prop="productCatePath">
          <el-input v-model="baseProductInfo.productCatePath" disabled class="g-w100 no-border" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="平台类目" prop="categoryId">
          <el-row :gutter="6" class="ms-0 me-0">
            <el-col :span="6" class="cate d-flex justify-content-between">
              <el-input v-model="form.categoryId"
                        v-input.positive.numeric
                        :disabled="!form.account"
                        class="g-100"
                        placeholder="请选择"
                        @blur="(event) => findPrimaryCate(event)"
              />
              <div v-loading="cateSearchLoading" class="cate ms-2 me-2">
                <g-select
                  ref="gselect"
                  :loading="cateSearchLoading"
                  :items="cateSearchList"
                  :item-title="true"
                  :disabled="!form.account"
                  dropdown-width="calc(100% - 500px)"
                  placement="bottom-start"
                  key-field="id"
                  label-field="categoryPath"
                  value-field="categoryId"
                  class="cate-change"
                  @keyword="queryCategorySearch"
                  @change="(data, selectedList) => data && selectPlatformCateId(data, selectedList)"
                />
                <el-button :disabled="!form.account" icon="el-icon-search" />
              </div>
              <div>
                <el-cascader ref="setPlatformCate" :disabled="!form.account" :props="cateProps" class="cate-cascader cate-change" @change="changePlatformCateId" @blur="cateBlur" />
                <el-button :disabled="!form.account" icon="el-icon-menu" />
              </div>
            </el-col>
            <el-col v-if="form.categoryName" :span="18">
              <el-input v-model="form.categoryName" disabled class="no-border" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品分组" prop="productGroup">
          <el-row :gutter="4" class="ms-0 me-0">
            <el-col :span="18" class="mb-0">
              <el-cascader
                v-model="form.groupId"
                :options="productOptions"
                :props="{label: 'groupName',value: 'groupId'}"
                class="g-w100"
                :disabled="!form.account"
                clearable
              />
            </el-col>
            <el-col :span="6" class="mb-0">
              <el-button :disabled="!form.account" type="primary" class="w-100" @click="updateProductGroup">更新分组</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col v-if="carAttrTemplate.show" :span="12">
        <el-form-item label="车型库模板" prop="account">
          <el-row :gutter="4" class="ms-0 me-0">
            <el-col :span="16">
              <el-select v-model="form.carAttrTemplateId" filterable placeholder="请选择" class="g-w100">
                <el-option v-for="item in carAttrTemplate.list" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-col>
            <el-col :span="8"><el-link type="primary" :underline="false" @click="goLink">查看车型库模板</el-link></el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util.js'
import smtCarModel from '../../aliExpressTemp/smtCarModel/_smtCarModel.vue'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { getLevelCategory, getCateogries, checkCategory, categoryList } from '@/api/aliExpress/category.js'
import { getProductGroup, updateProductGroup } from '@/api/aliExpress/product.js'
import { carAttrTemplate, dealProductGroupData, showGroupId, getCarAttrTempList } from './aliExpress.handle.js'
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
    const cateValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('类目不能为空'))
      } else if (!this.isEffectCateId) {
        callback(new Error('无效的类目id'))
      } else {
        callback()
      }
    }
    return {
      // {label: 'groupName',value: 'groupId', emitPath: false}
      propObj: {
        // multiple: true,
        label: 'groupName',
        value: 'groupId',
        leaf: 'isLeaf',
        emitPath: false
      },
      isEffectCateId: true, // 输入的类目id是否有效
      form: {
        id: undefined,
        itemId: undefined,
        account: '',
        accountCode: '',
        customerUser: '', // 客服
        developUser: '',
        listingType: '', // Listing类型 Variation Normal Combo
        listingStatus: this.isEdit ? this.baseProductInfo.listingStatus : 1,
        productSpu: '',
        subject: '', // 标题
        categoryId: '',
        categoryName: '',
        groupId: [],
        carAttrTemplateId: '' // 车模型id
      },
      childSkus: '', // 子SKU
      rules: {
        account: [{ required: true, message: '店铺不能为空', trigger: ['blur', 'change'] }],
        productSpu: [{ required: true, message: `${this.isVariation ? 'SPU' : 'SKU'}不能为空`, trigger: ['blur', 'change'] }],
        subject: [{ required: true, message: '标题不能为空', trigger: ['blur', 'change'] }],
        categoryId: [{ required: true, validator: cateValid, trigger: 'blur' }],
        groupId: [{ required: true, message: '产品分组不能为空', trigger: 'blur' }]
      },
      storeList: [],
      combineSku: '',
      cateSearchLoading: false,
      cateSearchList: [],
      carAttrTemplate,
      // 类目选择列表配置
      cateProps: {
        lazy: true,
        leaf: 'isLeaf',
        label: 'cnName',
        value: 'categoryId',
        lazyLoad(node, resolve) {
          getLevelCategory({
            categoryId: node.data && node.data.categoryId
          }).then(res => {
            const data = res.data
            resolve(data)
          })
        }
      },
      // 产品分组
      productOptions: []
    }
  },
  watch: {
    'baseProductInfo.productSpu'(old, yy) {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key]
        if (key === 'groupId') {
          this.form[key] = showGroupId(this.productOptions, data[key])
        }
      })
      // 显示子sku
      this.childSkus = ''
      const { skuList, combineSku } = this.baseProductInfo
      if (this.isVariation) {
        this.childSkus = skuList.map(item => item.productSku).join(',')
      } else if (combineSku) {
        this.childSkus = combineSku.map(item => `${item.sku}*${item.count}`).join(',')
      }
      if (!this.isEdit && this.carAttrTemplate.show) { // 切换sku,并且类目支持车型库
        getCarAttrTempList(this)
      }
      if (!this.isEdit) {
        this.setGroupValue()
        this.getPlatformCateId()
      }
    },
    'carAttrTemplate.show'(value) { // 隐藏车型库选项时，车型库置空
      if (!value) {
        this.form.carAttrTemplateId = ''
      }
    }
  },
  beforeDestroy(to, from, next) {
    carAttrTemplate.show = false
  },
  created() {
    this.getAccount()
  },
  methods: {
    // 手动输入sku获取详细信息
    productBlur(event) {
      const value = event.target.value
      if (value) {
        this.$refs.form.validateField('productSpu')
        this.$emit('getSkuType', value)
      }
    },
    // 获取产品分组
    getProductGroup(account) {
      this.$emit('productLoadingStart')
      this.form.groupId = ''
      account && getProductGroup({ account }).then(res => {
        this.setGroupRes(res)
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    setGroupRes(res) {
      this.productOptions = dealProductGroupData(res.data, 'groupId', 'parentGroupId', 0)
      this.setGroupValue()
    },
    setGroupValue() {
      // 默认 new arrival
      this.form.groupId = showGroupId(this.productOptions, 513634404)
      this.baseProductInfo.groupId = this.form.groupId
      const groupId = this.form.groupId.length ? this.form.groupId[this.form.groupId.length - 1] : ''
      this.$emit('updateGroupId', groupId)
    },
    // 获取店铺列表
    getAccount() {
      this.$emit('productLoadingStart')
      storeOptionsWithPlatformCode({
        platformCode: 'SM'
      }).then(res => {
        this.storeList = res.data
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 选择店铺事件
    changeAccount(value) {
      this.form.account = ''
      this.getProductGroup(value)
      setTimeout(() => {
        this.$refs.form.validateField('account')
        this.storeList.find(item => {
          if (item.displayName === value) {
            this.reset()
            this.form.account = value
            this.form.accountGrossProfit = item.publishGrossProfitRate
            this.form.accountCode = item.candidateDisplayName
            this.form.customerUser = item.customerServiceId
            this.$emit('updateAccount', { ...this.form, productCatePath: '' })
          }
        })
      }, 200)
    },
    reset() {
      this.form.categoryName = ''
      this.$refs.form.resetFields()
    },
    // 获取平台类目 (类目对照接口)
    getPlatformCateId() {
      const productCategoryId = this.baseProductInfo.productCategoryId
      if (!productCategoryId) {
        return false
      }
      this.$emit('productLoadingStart')
      checkCategory({ productCategoryId }).then(res => {
        const cateObj = res.data || {}
        this.form.categoryId = cateObj.categoryId || ''
        this.form.categoryName = cateObj.categoryPath || ''
        this.form.categoryGrossProfit = cateObj.grossProfit || ''
        this.isEffectCateId = true
        this.$emit('updateCategoryId', this.form)
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 类目模糊搜索 (限制输入最少10个字母才能搜索)
    queryCategorySearch(categoryPath) {
      // if (!categoryPath || categoryPath.length < 3) {
      //   this.$message.error('输入最少3个字符才能搜索')
      //   return false
      // }
      if (!categoryPath) {
        return false
      }
      this.cateSearchLoading = true
      getCateogries({
        // leafCategory: true,
        categoryPath
      }).then(res => {
        console.log(res)
        this.cateSearchList = res.data
      }).finally(() => {
        this.cateSearchLoading = false
      })
    },
    // 手动选择平台类目(模糊搜索)
    selectPlatformCateId(data, selectedList) {
      this.form.categoryId = data.categoryId
      this.form.categoryName = data.categoryPath
      this.form.categoryGrossProfit = data.grossProfit
      this.isEffectCateId = true
      this.$emit('updateCategoryId', this.form)
      // console.log(data, selectedList)
    },
    // 手动选择平台类目
    changePlatformCateId(value) {
      if (value && value.length) {
        setTimeout(() => {
          const data = this.$refs.setPlatformCate.getCheckedNodes(true)[0].data
          this.form.categoryId = data.categoryId
          this.form.categoryName = data.categoryPath
          this.form.categoryGrossProfit = data.grossProfit
          this.isEffectCateId = true
          this.$emit('updateCategoryId', this.form)
          this.$refs.form.validateField('categoryId')
        }, 200)
      }
    },
    // 手动输入平台类目
    findPrimaryCate(event, init) {
      const categoryId = event.target.value
      if (!categoryId) return
      categoryList({ size: 9999, categoryId }).then(res => {
        let index = -1
        if (res.data) {
          const list = res.data.records
          list.some((item, i) => {
            if (item.isLeaf && item.categoryId === +categoryId) {
              index = i
              // this.form.saleProfitRate = item.grossProfit || this.baseProductInfo.accountGrossProfit
              // this.form.actualProfitRate = item.grossProfit || this.baseProductInfo.accountGrossProfit
              this.form.categoryId = item.categoryId
              this.form.categoryName = item.categoryPath
              this.form.categoryGrossProfit = item.grossProfit
              this.$emit('updateCategoryId', this.form, init)
              this.isEffectCateId = true
              return i
            }
          })
        }
        if (index === -1) {
          this.isEffectCateId = false
        }
        this.$refs.form.validateField('categoryId')
      })
    },
    cateBlur(value) {
      setTimeout(() => {
        this.$refs.setPlatformCate.inputValue = this.form.categoryId
      }, 600)
    },
    // 更新产品分组
    updateProductGroup() {
      this.$emit('productLoadingStart')
      this.form.groupId = ''
      updateProductGroup({ account: this.form.account }).then(res => {
        this.$message.success('更新分组成功')
        this.setGroupRes(res)
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    goLink() {
      this.$newTab({
        path: '/lms/lmsAliExpress/aliExpressTemp/smtCarModel/smtCarModel',
        title: '查看车型库模板详情',
        component: smtCarModel,
        clearCache: true
      })
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
