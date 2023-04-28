<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="w-90 form-col">
    <el-row>
      <el-col v-if="isEdit" :span="12">
        <el-form-item label="站点名称" prop="amazonSite">
          <el-select v-model="form.amazonSite" :disabled="isEdit" filterable placeholder="请选择站点" class="g-w100">
            <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="店铺名称" prop="account">
          <el-row :gutter="isEdit ? 0 : 4" class="ms-0 me-0">
            <el-col v-if="!isEdit" :span="8" class="mb-0">
              <el-select v-model="form.amazonSite" :disabled="isEdit" filterable placeholder="请选择站点" class="g-w100" @change="changeSite">
                <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-col>
            <el-col :span="isEdit ? 24 : 16" class="mb-0">
              <el-select v-model="form.account" :disabled="isEdit" filterable placeholder="请选择店铺" class="g-w100" @change="changeAccount">
                <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit && form.asin" :span="12">
        <el-form-item label="ASIN" prop="ASIN">
          <el-input v-model="form.asin" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="!isVariation" :span="12">
        <el-form-item label="Condition" prop="condition">
          <el-select v-model="form.condition" :disabled="isEdit" filterable clearable placeholder="请选择" class="g-w100" @change="$emit('updateCondition', form)">
            <el-option v-for="item in conditionList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit" :span="12">
        <el-form-item v-loading="productLoading > 0" :label="isVariation ? 'SPU' : 'SKU'" prop="productSku">
          <el-input v-if="combineSkus" v-model="combineSkus" disabled placeholder="请输入SKU" />
          <el-input v-else v-model="form.productSku" disabled :placeholder="isVariation ? '请输入SPU' : '请输入SKU'" />
        </el-form-item>
      </el-col>
      <el-col v-else :span="combineSku ? 24 :12">
        <el-row :gutter="4" class="ms-0 me-0">
          <el-col :span="combineSku ? 12 : 24" class="mb-0">
            <el-form-item v-loading="productLoading > 0" :label="isVariation ? 'SPU' : 'SKU'" prop="productSku">
              <el-row :gutter="4" class="ms-0 me-0">
                <el-col :span="20" class="mb-0">
                  <el-input v-model="form.productSku" :disabled="isEdit || !form.account" :placeholder="isVariation ? '请输入SPU' : '请输入SKU'" @blur="productBlur" />
                </el-col>
                <el-col :span="4" class="mb-0">
                  <el-button :disabled="!form.account" type="primary" class="g-w100" @click="$emit('selectSkuModal')">select</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col v-if="combineSku" :span="12">
            <el-input v-model="combineSku" disabled size="mini" class="no-border" placeholder="请输入SKU" />
          </el-col>
        </el-row>
      </el-col>
      <el-col v-if="baseProductInfo.sellerSku" :span="12">
        <el-form-item label="平台SKU" prop="sellerSku">
          <el-input v-model="baseProductInfo.sellerSku" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="isVariation" :span="12">
        <el-form-item v-loading="productLoading > 0" label="SKU" prop="productSku">
          <el-input v-model="productSkus" placeholder="请输入SKU" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="isEdit" :span="12">
        <el-form-item label="状态" prop="listingStatus">
          <el-input :value="status[baseProductInfo.listingStatus-1]" disabled />
        </el-form-item>
      </el-col>
      <!-- 测试说在售要展示这个字段 -->
      <el-col v-if="!isVariation" :span="12">
        <el-form-item label="产品通用编码" :prop="isEdit ? '' : 'standardProdcutIdValue'">
          <div>
            <el-row :gutter="4" class="ms-0 me-0">
              <el-col :span="6" class="mb-0">
                <el-select v-model="form.standardProdcutIdType" :disabled="isEdit" placeholder="请选择" class="g-w100" @change="$refs.form.validateField('standardProdcutIdValue')">
                  <el-option v-for="item in standardProdcutIdTypeList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-col>
              <el-col :span="isEdit ? 18 : 11" class="mb-0">
                <el-input v-model="form.standardProdcutIdValue" :disabled="isEdit || form.isAutoProdcutId" @change="$emit('updateCondition', form)" />
              </el-col>
              <el-col v-if="!isEdit" :span="7" class="mb-0">
                <el-checkbox v-model="form.isAutoProdcutId" @change="isAutoProdcutIdChange">从号码池自动获取</el-checkbox>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-col>
      <el-col v-if="!isVariation" :span="12">
        <el-form-item label="库存" prop="quantity">
          <el-input v-model="form.quantity" v-input.positive.numeric placeholder="请输入库存" maxlength="4" @change="$emit('updateCondition', form)" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入品牌" maxlength="100" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="制造商" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入制造商" maxlength="100" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" class="g-w100" maxlength="200" show-word-limit />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="类目" prop="categoryId">
          <el-row :gutter="6" class="ms-0 me-0">
            <el-col :span="6" class="cate d-flex justify-content-between">
              <el-input v-model="form.categoryId"
                        v-input.positive.numeric
                        :disabled="!form.amazonSite"
                        class="w-100"
                        placeholder="请选择"
                        @blur="findPrimaryCate"
              />
              <div v-loading="cateSearchLoading" class="cate ms-2 me-2">
                <g-select
                  ref="gselect"
                  :loading="cateSearchLoading"
                  :disabled="!form.amazonSite"
                  :items="cateSearchList"
                  :item-title="true"
                  dropdown-width="calc(100% - 500px)"
                  placement="bottom-start"
                  key-field="browseNodeId"
                  label-field="browsePathByName"
                  value-field="browseNodeId"
                  class="cate-change"
                  @keyword="queryCategorySearch"
                  @change="selectPlatformCateId"
                />
                <el-button :disabled="!form.amazonSite" icon="el-icon-search" />
              </div>
              <div>
                <div v-if="form.amazonSite">
                  <el-cascader ref="setPlatformCate" :props="cateProps" class="cate-cascader cate-change" @change="changePlatformCateId" @blur="cateBlur" />
                </div>
                <el-button :disabled="!form.amazonSite" icon="el-icon-menu" />
              </div>
            </el-col>
            <el-col v-if="form.category" :span="18">
              <el-input v-model="form.category" disabled class="no-border" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="模板" prop="productType">
          <el-select v-model="form.productType"
                     v-loading="templateLoading"
                     :disabled="isEdit && baseProductInfo.listingStatus && baseProductInfo.listingStatus >= 5"
                     filterable
                     placeholder="请选择模板"
                     class="g-w100"
                     @change="changeTemplate"
          >
            <el-option v-for="item in templateChangeList" :key="item.value" :label="item.value" :value="item.name" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发货方式" prop="fulfillmentChannel">
          <el-radio-group v-model="form.fulfillmentChannel" disabled class="ms-3">
            <el-radio v-for="(k, v,index) in merchantShippingGroup" :key="index" :label="v">{{ k }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { storeOptionsWithPlatformCode, getShortStoreByCode } from '@/api/sams'
import { getPlatformCateId, optionsSiteCode, getCateogries } from '@/api/amazon/amazon.js'
import { templateName, tempOption } from '@/api/amazon/templateList.js'
import { getLevelCategory, getCategoryList } from '@/api/amazon/category.js'
import { merchantShippingGroup } from './../components/addListing.handle.js'
export default {
  name: 'BaseInfo',
  props: {
    labelWidth: {
      type: String,
      default: '80px'
    },
    // 请求详细信息加载状态
    productLoading: Number,
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    },
    // 是否为vary Listing
    isVariation: Boolean,
    // 产品通用编码
    standardProdcutIdTypeList: Array,
    conditionList: Array,
    // 是否禁用
    isEdit: Boolean,
    templateLoading: Boolean,
    hasSku: Boolean
  },
  data() {
    const that = this
    const standardProdcutType = (rule, value, callback) => {
      if ((this.form.standardProdcutIdValue || this.form.isAutoProdcutId) && this.form.standardProdcutIdType) {
        callback()
      } else {
        callback(new Error('产品通用编码不能为空'))
      }
    }
    const cateValid = (rule, value, callback) => {
      if (!this.form.categoryId) {
        callback(new Error('类目不能为空'))
      } else if (!this.isEffectCateId) {
        callback(new Error('无效的类目id'))
      } else {
        callback()
      }
    }
    const productSkuValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('SKU不能为空'))
      } else if (!this.hasSku) {
        callback(new Error('sku无数据'))
      } else {
        callback()
      }
    }
    return {
      // 显示隐藏上级菜单选择popover
      showParentTree: false,
      cateSearchLoading: false,
      cateSearchList: [],
      form: {
        platformCode: 'AM', // 当前平台
        amazonSite: '', // 站点
        account: '', // 店铺
        customerUser: undefined, // 客服id
        condition: '', // 物品状况
        productSku: '', // 产品SKU
        title: '', // 标题
        categoryId: '', // 类目主键id
        category: '', // 平台类目树
        productType: '', // 模板
        // 产品通用编码
        standardProdcutIdType: 'UPC', // 对应标准产品id类型
        standardProdcutIdValue: '', // 标准产品id值
        brand: '', // 品牌
        quantity: '', // 库存
        manufacturer: '', // 制造商,
        grossProfitCate: '', // 类目销售利润率
        isAutoProdcutId: false,
        fulfillmentChannel: 'FBM',
        asin: '' // asin码
      },
      cateId: '',
      isEffectCateId: true, // 输入的类目id是否有效
      rules: {
        productSku: [{ required: true, validator: productSkuValid, trigger: 'blur' }],
        account: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        manufacturer: [{ required: true, message: '制造商不能为空', trigger: 'blur' }],
        categoryId: [{ required: true, validator: cateValid, trigger: 'blur' }],
        productType: [{ required: true, message: '模板不能为空', trigger: 'blur' }],
        fulfillmentChannel: [{ required: true, message: '发货方式不能为空', trigger: 'blur' }],
        standardProdcutIdValue: [{ required: true, validator: standardProdcutType, trigger: 'blur' }],
        brand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
        quantity: [{ required: true, message: '库存不能为空', trigger: 'blur' }]
      },
      status: ['Draft', 'Approving', 'Uploading', 'Upload Failed', 'Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling', 'Canceled'],
      // 站点列表
      siteList: [],
      // 店铺列表
      storeList: [],
      // 模板下拉列表
      templateChangeList: [],
      // 类目选择列表配置
      cateProps: {
        lazy: true,
        leaf: 'isLeaf',
        label: 'browseNodeName',
        value: 'browseNodeId',
        lazyLoad(node, resolve) {
          getLevelCategory({
            amazonSite: that.form.amazonSite,
            id: node.data && node.data.id
          }).then(res => {
            const data = res.data.map(item => {
              if (item.hasChildren) {
                item.isLeaf = false
              } else {
                item.isLeaf = true
              }
              delete item.hasChildren
              return item
            })
            resolve(data)
          })
        }
      },
      // combo类型 +子SKU编码
      combineSkus: '',
      combineSku: '',
      // 子SKU编码
      productSkus: '',
      merchantShippingGroup
    }
  },
  watch: {
    conditionList() {
      if (!this.isEdit && !this.isVariation && this.conditionList.length) {
        this.form.condition = this.conditionList[0]
      }
    },
    'baseProductInfo.productSku'(old, yy) {
      const baseProductInfo = deepClone(this.baseProductInfo)
      this.form = Object.assign(this.form, baseProductInfo)
      !this.isEdit && this.$refs.form.validateField('productSku')
      this.$refs.form.validateField('title')
      if (this.$refs.setPlatformCate) {
        this.$refs.setPlatformCate.checkedValue = []
      }
      setTimeout(() => {
        this.form.amazonSite && (this.$refs.setPlatformCate.inputValue = this.form.categoryId)
      }, 600)
      if (this.isVariation) {
        this.productSkus = this.baseProductInfo.skuList && this.baseProductInfo.skuList.map(item => item.productSku).join(',')
      }
      if (this.baseProductInfo.combineSku) {
        const comboSku = []
        this.baseProductInfo.combineSku.map(item => {
          comboSku.push(item.sku + '*' + item.count)
        })
        this.combineSkus = `${this.baseProductInfo.productSku} [ ${comboSku.join(',')} ]`
        this.combineSku = comboSku.join(',')
      }
    }
  },
  created() {
    this.getTemplateNameOption()
    !this.isEdit && this.getSiteList()
  },
  methods: {
    // 类目模糊搜索 (限制输入最少10个字母才能搜索)
    queryCategorySearch(browsePathByName) {
      if (!browsePathByName || browsePathByName.length < 3) {
        this.$message.error('输入最少3个字母才能搜索')
        return false
      }
      this.cateSearchLoading = true
      getCateogries({
        amazonSite: this.form.amazonSite,
        hasChildren: false,
        browsePathByName
      }).then(res => {
        this.cateSearchList = res.data
      }).finally(() => {
        this.cateSearchLoading = false
      })
    },
    // 选择店铺事件
    changeAccount(value) {
      this.$refs.form.validateField('account')
      this.storeList.find(item => {
        if (item.displayName === value) {
          this.form.accountGrossProfit = item.publishGrossProfitRate
          this.form.storeRiskLevel = item.storeRiskLevel
          this.form.accountPrefix = item.externalSkuPrefix
          this.form.accountCode = item.candidateDisplayName
          this.form.customerUser = item.customerServiceId
          this.$emit('productLoadingStart')
          getShortStoreByCode(item.candidateDisplayName).then(res => {
            const data = res.data
            if (data) {
              const siteId = data.siteId
              const storeLevelId = data.storeLevelId
              this.$emit('updateAccount', { ...this.form, siteId, storeLevelId })
            }
          }).finally(() => {
            this.$emit('productLoadingEnd')
          })
        }
      })
    },
    // 查询当前平台的站点code
    getSiteList() {
      // platformCode: 平台简码（亚马逊-AM）
      optionsSiteCode({ platformCode: this.form.platformCode }).then(res => {
        this.siteList = res.data
      })
    },
    // 选择站点时 获取店铺列表
    changeSite(value) {
      let siteId = ''
      // 切换其他站点时，清空再赋值 可以重启类目tree
      this.form.account = ''
      this.form.categoryId = ''
      this.form.category = ''
      this.cateSearchList = []
      this.form.grossProfitCate = ''
      this.cateId = ''
      this.form.amazonSite = ''
      setTimeout(() => {
        this.form.amazonSite = value
        this.$emit('updateSite', this.form)
        this.siteList.find(item => {
          if (item.displayName === value) {
            siteId = item.hiddenValue
          }
        })
        this.$emit('productLoadingStart')
        storeOptionsWithPlatformCode({
          platformCode: this.form.platformCode,
          siteId: siteId
        }).then(res => {
          this.storeList = res.data
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
        this.getPlatformCateId()
      }, 200)
    },
    // 获取平台类目 (类目对照接口)
    getPlatformCateId(isNewSku = '') {
      if (!this.form.amazonSite || !this.baseProductInfo.productSku) {
        return false
      }
      this.$emit('productLoadingStart')
      getPlatformCateId({
        amazonSite: this.form.amazonSite,
        productCategoryId: this.baseProductInfo.productCategoryId
      }).then(res => {
        const cateObj = res.data.find(item => !item.hasChildren) || {}
        this.cateId = cateObj.id
        this.form.categoryId = cateObj.browseNodeId || ''
        this.form.category = cateObj.browsePathByName || ''
        this.$refs.setPlatformCate.inputValue = cateObj.browseNodeId || ''
        this.form.grossProfitCate = cateObj.grossProfit || ''
        this.$emit('updateCategoryId', this.form)
        // this.getTemplateNameOption(this.cateId)
        !isNewSku && this.getTemplateName(this.cateId)
        if (isNewSku && this.form.categoryId) {
          this.$refs.form.validateField('account')
        }
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 手动选择平台类目(模糊搜索)
    selectPlatformCateId(data, selectedList) {
      this.form.categoryId = data.browseNodeId
      this.form.category = data.browsePathByName
      this.cateId = data.id
      // 获取类目的毛利率
      this.form.grossProfitCate = data.grossProfit || ''
      if (data.grossProfit) {
        this.form.grossProfit = data.grossProfit
      }
      // 非在售切换类目需要联动模板属性
      if (!this.baseProductInfo.asin) {
        this.form.productType = ''
        this.getTemplateName(this.cateId)
      }
      this.$emit('updateCategoryId', this.form)
      this.$refs.form.validateField('categoryId')
    },
    // 手动选择平台类目
    changePlatformCateId(value) {
      if (value && value.length) {
        setTimeout(() => {
          const data = this.$refs.setPlatformCate.getCheckedNodes(true)[0].data
          this.form.categoryId = data.browseNodeId
          // 获取类目的毛利率
          this.form.grossProfitCate = data.grossProfit || ''
          if (data.grossProfit) {
            this.form.grossProfit = data.grossProfit
          }
          this.cateId = data.id
          this.form.category = this.$refs.setPlatformCate.presentText.replace(/\s\/\s/g, ',')
          // 非在售切换类目需要联动模板属性
          if (!this.baseProductInfo.asin) {
            this.form.productType = ''
            this.getTemplateName(this.cateId)
          }
          this.$emit('updateCategoryId', this.form)
          this.$refs.form.validateField('categoryId')
        }, 600)
      }
    },
    // 手动输入平台类目ID
    findPrimaryCate(event) {
      const browseNodeId = event.target.value
      if (!browseNodeId) return
      getCategoryList({ size: -1, browseNodeId, amazonSite: this.baseProductInfo.amazonSite }).then(res => {
        let index = -1
        if (res.data) {
          const list = res.data.records
          list.some((item, i) => {
            if (!item.hasChildren && item.browseNodeId === browseNodeId) {
              index = i
              // 获取类目的毛利率
              this.form.grossProfitCate = item.grossProfit || ''
              if (item.grossProfit) {
                this.form.grossProfit = item.grossProfit
              }

              this.form.categoryId = item.browseNodeId
              this.form.category = item.browsePathByName
              this.cateId = item.id
              this.$emit('updateCategoryId', this.form)
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
    // 手动输入sku获取详细信息
    productBlur(event) {
      const value = event.target.value
      if (value) {
        this.$emit('getSkuDetail', value)
      }
    },
    // 获取模板下拉列表
    getTemplateNameOption(amazonCategoryId) {
      this.templateChangeList = []
      this.$emit('productLoadingStart')
      tempOption().then(res => {
        this.templateChangeList = res.data
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 获取类目关联的模板名
    getTemplateName(amazonCategoryId) {
      this.$emit('productLoadingStart')
      templateName({ amazonCategoryId }).then(res => {
        this.form.productType = res.data
        this.$emit('getTemplateAttrList', this.form.productType, false, true)
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 获取模板下的属性
    changeTemplate(value) {
      this.$emit('getTemplateAttrList', value, false, true)
    },
    // 从号码池自动获取
    isAutoProdcutIdChange(value) {
      this.$refs.form.validateField('standardProdcutIdValue')
      if (value) {
        this.form.standardProdcutIdValue = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cate-dropdown-list{
  max-height: 285px;
  overflow-y: auto;
}
.cate-cascader{
  // width: calc(100% - 42px) !important;
  width: 42px !important;
}
.cate{
  position: relative;
}
.no-border{
  ::v-deepinput{
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
