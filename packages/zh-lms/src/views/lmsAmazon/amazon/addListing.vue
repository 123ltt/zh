<!-- 创建单个普通Listing -->
<template>
  <basic-container>
    <el-collapse v-model="activeNames" class="add-linsting-box">
      <el-collapse-item v-loading="productLoading > 0" name="baseInfo">
        <collapse-title slot="title" title="基本信息" />
        <!-- 设置基本信息 -->
        <base-info
          ref="baseInfo"
          v-bind="{hasSku, productLoading, baseProductInfo, standardProdcutIdTypeList, conditionList, isVariation, isEdit}"
          @selectSkuModal="selectSkuModal"
          @getSkuDetail="getSkuDetail"
          @getTemplateAttrList="getTemplateAttrList"
          @updateSite="updateSite"
          @updateAccount="updateAccount"
          @updateCategoryId="updateCategoryId"
          @updateCondition="updateCondition"
          @productLoadingStart="productLoading++"
          @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="productLoading > 0" name="templateAttr">
        <collapse-title slot="title" title="属性" />
        <!-- 设置模板属性列表 -->
        <template-attr ref="templateAttr" v-loading="templateLoading" v-bind="{labelWidth, templateAttrList, baseProductInfo, variationId, id, productAttrShowList}" />
      </el-collapse-item>
      <el-collapse-item v-if="isVariation" v-loading="productLoading > 0" name="variantAttr">
        <collapse-title slot="title" title="变体信息" />
        <variant-attr ref="variantAttr"
                      v-bind="{ labelWidth, baseProductInfo, standardProdcutIdTypeList, conditionList, isEdit,lstSku }"
                      @productLoadingStart="productLoading++"
                      @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="productLoading > 0" name="otherInfo">
        <collapse-title slot="title" title="其它信息" />
        <!-- 物流，运费，成本，毛利率…… -->
        <other-info v-if="!isVariation"
                    ref="otherInfo"
                    v-bind="{ labelWidth, baseProductInfo, isEdit }"
                    @productLoadingStart="productLoading++"
                    @productLoadingEnd="productLoading--"
        />
        <!-- 设置卖点1...5 关键词 描述 -->
        <selling-point ref="sellingPoint" v-bind="{ labelWidth, baseProductInfo, isEdit, productAttrShowList }" @editDesc="editDesc" />
      </el-collapse-item>
    </el-collapse>
    <div v-loading="productLoading > 0" class="affix isFixed">
      <div class="bottom-btn">
        <el-button @click="$emit('close', false)">取消</el-button>
        <el-button type="primary"
                   :disabled="productLoading > 0 || translate.loading"
                   :loading="saveLoading"
                   @click="saveHandle"
        >保存{{ listingStatus && (listingStatus === 4 ? '为 Draft' : listingStatus === 7 ? '为 Updating' : '') }}</el-button>
        <el-select v-model="countryCode" filterable placeholder="请选择翻译语种">
          <el-option v-for="item in languages" :key="item.value" :label="item.name" :value="item.value" :title="item.name" />
        </el-select>
        <el-button type="primary"
                   :disabled="!countryCode || productLoading > 0 || saveLoading"
                   :loading="translate.loading"
                   @click="getTranslate"
        >一键翻译</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import * as addListingHandle from './components/addListing.handle.js'
import sellingPoint from './components/sellingPoint.vue'
import otherInfo from './components/otherInfo.vue'
import baseInfo from './components/baseInfo.vue'
import selectSkuModal from '@/views/components/selectSkuModal/selectSkuModal.vue'
import templateAttr from './components/templateAttr.vue'
import variantAttr from './components/variantAttr.vue'
import collapseTitle from './components/collapseTitle.vue'
import fbwordConfirm from '@/views/components/fbwordConfirm.vue'
import {
  getSkuDetailByProduct,
  getSpuDetailByProduct,
  amazonlistingSave,
  getConditionList,
  getAmazonListingDetail,
  amazonListingUpdateDraft,
  getAmazonListingOlineDetail,
  amazonlistingvariantUpdate
  // getImageDetailList
} from '@/api/amazon/amazon.js'
import { getShortStoreByCode } from '@/api/sams'
import { getPublishAttr } from '@/api/amazon/templateList.js'
export default {
  name: 'LmsAmazonAddListing',
  components: {
    sellingPoint,
    otherInfo,
    baseInfo,
    templateAttr,
    variantAttr,
    collapseTitle
  },
  props: {
    id: String,
    asin: String,
    variationId: String, // 变体id
    listingStatus: [String, Number]
  },
  data() {
    return {
      // 翻译语种
      languages: addListingHandle.languages,
      // 当前翻译语言
      countryCode: '',
      // 翻译状态
      translate: { loading: false },
      productLoading: 0,
      saveLoading: false,
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'otherInfo', 'templateAttr', 'variantAttr'],
      // 产品基本信息
      baseProductInfo: { platformCode: 'AM' },
      // 模板属性列表
      templateAttrList: [],
      // 表单label统一宽度
      labelWidth: '120px',
      // Listing类型 Variation Normal Combo
      listingType: '',
      // 产品通用编码
      standardProdcutIdTypeList: ['UPC', 'EAN', 'GCID', 'GTIN'],
      conditionList: [],
      params: null,
      // skuId
      skuId: '',
      skuVOId: '',
      // 草稿id
      amazonDraftVOId: '',
      // 扩展属性id
      amazonListingExtendVOId: '',
      templateLoading: false,
      // 是否有获取到sku信息
      hasSku: true,
      olineResData: null,
      productAttrShowList: [], // 产品属性弹窗列表,
      lstSku: []
    }
  },
  computed: {
    // 是否为多个子sku
    isVariation() {
      return this.listingType === 'Variation'
    },
    // 编辑时部分参数不可编辑
    isEdit() {
      return Boolean(this.id)
    }
  },
  watch: {
    'id'() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.isEdit) {
        console.log('获取sku详情')
        // 在售状态 详情
        if (this.listingStatus >= 5) {
          this.getAmazonListingOlineDetail()
        } else {
          this.getAmazonListingDetail()
        }
        this.isVariation && this.getConditionList()
      } else {
        this.getConditionList()
      }
    },
    editGetSkuDetail(productSku, siteCode, storeCode) {
      return new Promise((resolve, reject) => {
        const request = this.isVariation ? getSpuDetailByProduct : getSkuDetailByProduct
        this.productLoading++
        request({ data: { lstProductSku: [productSku], platformCode: 'AM', storeCode, siteCode } }).then(res => {
          // if (res.data) resolve(res.data[0])
          const data = res.data[0]
          this.setProductCost(data)
          if (res.data) {
            data.productSku && this.getAttrList(data.productSku)
            this.getShortStoreByCode(storeCode).then(store => {
              resolve({
                ...data,
                accountGrossProfit: store.publishGrossProfitRate,
                siteId: store.siteId,
                storeLevelId: store.storeLevelId,
                accountPrefix: store.externalSkuPrefix
              })
            })
          } else {
            this.$message.error(res.msg)
          }
        }).finally(() => {
          this.productLoading--
        })
      })
    },
    // 获取店铺等级 站点id
    getShortStoreByCode(storeCode) {
      return new Promise((resolve, reject) => {
        this.productLoading++
        getShortStoreByCode(storeCode).then(res => {
          if (res.data) resolve(res.data)
        }).finally(() => {
          this.productLoading--
        })
      })
    },
    // 获取在售详情
    getAmazonListingOlineDetail() {
      console.log('获取在售详情')
      this.productLoading++
      getAmazonListingOlineDetail({
        listingStatus: this.listingStatus, // 产品状态 可选值5,7,8
        amazonListingId: this.id, // 在售的SPU主键ID
        amazonVariantId: this.variationId || undefined // 变体主键ID
      }).then(rs => {
        if (!rs.data) {
          this.$message.error(rs.msg)
          return
        }
        this.listingType = rs.data.listingType
        const { category, mainImage, price, itemCondition, skuAttrs, extend, draftSku, productType } = rs.data
        // 扩展属性值
        const { imageUrls, attributes } = extend
        const { grossProfit, logistics } = draftSku
        // 处理图片列表
        const { extraImagList, imgShowList } = addListingHandle.dealPic(mainImage, imageUrls)
        const logisticsObj = logistics ? JSON.parse(logistics) : {}
        const baseProductInfo = Object.assign({}, draftSku, extend, rs.data, {
          platformCode: 'AM',
          category,
          weight: logisticsObj && logisticsObj.weight, // 重量回显
          condition: itemCondition,
          standardPrice: price,
          extraImagList,
          imgShowList,
          skuAttrs: JSON.parse(skuAttrs)
        })
        this.olineResData = deepClone(baseProductInfo)
        // 获取模板属性
        this.getTemplateAttrList(productType, attributes)
        // 编辑时通过店铺编码获取产品成本价，然后去获取总成本
        this.editGetSkuDetail(baseProductInfo.productSku, baseProductInfo.amazonSite, baseProductInfo.accountCode).then(res => {
          const type = ['Variation', 'Normal', 'Combo']
          if (!this.isVariation) {
            this.listingType = type[res.type - 1]
          } else {
            this.listingType = type[0]
          }
          addListingHandle.dealEditSkuImage(res, baseProductInfo)
          this.baseProductInfo = deepClone(Object.assign({}, baseProductInfo, {
            accountGrossProfit: res.accountGrossProfit,
            listingType: this.listingType,
            productCost: res.productCost,
            costPrice: res.productCost,
            developUser: res.developLeadUserId,
            storeLevelId: res.storeLevelId,
            siteId: res.siteId,
            accountPrefix: res.accountPrefix
          }))
          // 获取销售利润率
          setTimeout(() => {
            const otherInfo = this.$refs.otherInfo
            if (this.isEdit && !grossProfit) {
              this.baseProductInfo.category && otherInfo.getGrossprofit({
                name: this.baseProductInfo.account,
                browsePathByName: this.baseProductInfo.category
              }).then(res => {
                this.baseProductInfo.grossProfit = res
                this.baseProductInfo.grossProfitCate = res
              })
            }
            // 获取物流及总成本
            otherInfo.getOtherInfo(this.isEdit)
          }, 600)
        })
      }).finally(() => {
        this.productLoading--
      })
    },
    // 获取草稿详情
    getAmazonListingDetail() {
      const listingStatus = this.listingStatus
      const id = this.id
      console.log('获取草稿详情')
      this.productLoading++
      getAmazonListingDetail({ id, listingStatus }).then(res => {
        // getImageDetailList({ skuList: [res.data.productSku], sizeList: ['1500*1500'] }).then(res => {
        //   // console.log(res)
        // })
        this.listingType = res.data.listingType
        let baseInfoData = {}
        // 单个SKU
        if (!this.isVariation) {
          const { amazonListingExtendVO, amazonDraftVO, category, amazonDraftSkuVOList, id, combineSku, productType } = res.data
          const { mainImage, extraImages, logistics } = amazonDraftSkuVOList[0] // sku信息
          this.skuId = id
          this.skuVOId = amazonDraftSkuVOList[0].id
          this.amazonDraftVOId = res.data.amazonDraftVO.id
          this.amazonListingExtendVOId = res.data.amazonListingExtendVO.id
          // 处理图片列表
          const { extraImagList, imgShowList } = addListingHandle.dealPic(mainImage, extraImages)
          const logisticsObj = JSON.parse(logistics)
          baseInfoData = deepClone(Object.assign({}, amazonDraftVO, amazonListingExtendVO, res.data, amazonDraftSkuVOList[0], {
            platformCode: 'AM', // 当前平台
            category,
            weight: logisticsObj && logisticsObj.weight, // 重量回显
            extraImagList,
            imgShowList,
            productType,
            combineSku: combineSku ? JSON.parse(combineSku) : ''
          }))
          // 编辑时通过店铺编码获取产品成本价，然后去获取总成本
          this.editGetSkuDetail(baseInfoData.productSku, baseInfoData.amazonSite, baseInfoData.accountCode).then(res => {
            baseInfoData.accountGrossProfit = res.accountGrossProfit
            baseInfoData.productCost = res.productCost
            baseInfoData.costPrice = res.productCost
            baseInfoData.storeLevelId = res.storeLevelId
            baseInfoData.siteId = res.siteId
            baseInfoData.accountPrefix = res.accountPrefix
            addListingHandle.dealEditSkuImage(res, baseInfoData)
            this.baseProductInfo = baseInfoData
            setTimeout(() => {
              // 获取物流及总成本
              this.$refs.otherInfo.getOtherInfo(this.isEdit)
            }, 600)
            // 获取模板
            const productType = this.baseProductInfo.productType
            productType && this.getTemplateAttrList(productType, this.baseProductInfo.attributes)
          })
        } else {
          // 多个子SKU
          const { amazonDraftSkuVOList, category, amazonListingExtendVO, amazonDraftVO, productType } = res.data
          this.skuId = id
          this.amazonDraftVOId = amazonDraftVO.id
          this.amazonListingExtendVOId = res.data.amazonListingExtendVO.id
          // sku信息
          const skuList = amazonDraftSkuVOList.map(sku => {
            const { mainImage, extraImages, logistics, skuAttrs } = sku
            // 处理图片列表
            const { extraImagList, imgShowList } = addListingHandle.dealPic(mainImage, extraImages)
            const logisticsObj = JSON.parse(logistics)
            const $skuAttrs = JSON.parse(skuAttrs)
            return Object.assign(sku, {
              extraImagList,
              imgShowList,
              logisticsObj,
              skuAttrs: $skuAttrs
            })
          })
          baseInfoData = Object.assign(res.data, amazonListingExtendVO, amazonDraftVO, {
            platformCode: 'AM', // 当前平台
            category,
            skuList,
            productType,
            grossProfit: skuList.length && skuList[0].grossProfit,
            saleStartDate: skuList.length && skuList[0].saleStartDate,
            saleEndDate: skuList.length && skuList[0].saleEndDate
          })
          // 编辑时通过店铺编码获取产品成本价，然后去获取总成本
          this.editGetSkuDetail(baseInfoData.productSku, baseInfoData.amazonSite, baseInfoData.accountCode).then(res => {
            baseInfoData.accountGrossProfit = res.accountGrossProfit
            baseInfoData.skuList.forEach(sku => {
              const index = res.lstSku.findIndex(item => sku.productSku === item.productSku)
              if (index > -1) {
                sku.productCost = res.lstSku[index].productCost
                sku.costPrice = res.lstSku[index].productCost
                baseInfoData.storeLevelId = res.storeLevelId
                baseInfoData.siteId = res.siteId
                baseInfoData.accountPrefix = res.accountPrefix
                addListingHandle.dealEditSkuImage(res.lstSku[index], sku)
              } else {
                // 无权刊登
                sku.variantDraftStatus = 'delete'
                sku.noPermission = true
              }
            })
            addListingHandle.dealLstSku(res.lstSku)
            baseInfoData.lstSku = res.lstSku
            this.lstSku = baseInfoData.lstSku
            this.lstSku.forEach(item => {
              item.productSkuShow = `${item.nwSku} - ${item.productSku}`
            })
            this.baseProductInfo = baseInfoData
            setTimeout(() => {
              // 获取物流及总成本
              this.$refs.variantAttr.getOtherInfo(this.isEdit)
            }, 600)
            // 获取模板
            const productType = this.baseProductInfo.productType
            productType && this.getTemplateAttrList(productType, this.baseProductInfo.attributes)
          })
        }
      }).finally(() => {
        this.productLoading--
      })
    },
    // 选择产品sku弹窗
    selectSkuModal() {
      this.$modal({
        title: '选择产品',
        component: selectSkuModal,
        width: '1000px',
        data: {
          isVariation: this.isVariation,
          showType: this.isVariation ? 'spu' : 'sku',
          platformCode: 'AM',
          account: this.baseProductInfo.accountCode,
          siteCode: this.baseProductInfo.amazonSite
        },
        callback: (row) => {
          if (row) {
            this.getSkuDetail(row.productSku, row.type)
          }
        }
      })
    },
    // 获取产品属性
    getAttrList(productSku) {
      this.productLoading++
      addListingHandle.getAttrList(productSku).then(res => {
        this.productAttrShowList = res
      }).finally(() => {
        this.productLoading--
      })
    },
    // 获取SKU详细信息
    getSkuDetail(productSku, type) {
      if (this.baseProductInfo.productSku === productSku) {
        return false
      }
      const request = this.isVariation ? getSpuDetailByProduct : getSkuDetailByProduct
      const platformCode = this.baseProductInfo.platformCode
      const storeCode = this.baseProductInfo.accountCode
      const siteCode = this.baseProductInfo.amazonSite
      this.productLoading++
      request({ data: { lstProductSku: [productSku], platformCode, storeCode, siteCode } }).then(res => {
        this.hasSku = Boolean(res.data && res.data[0])
        let data = (res.data && res.data[0]) || {
          categoryId: '',
          category: '',
          productSku,
          title: '',
          mainImage: '',
          extraImages: '',
          standardProdcutIdType: '',
          standardProdcutIdValue: '',
          manufacturer: '',
          searchTerms: '',
          description: '',
          weight: ''
        }
        this.setProductCost(data)
        data = Object.assign(data, {
          productCategoryId: data.categoryId, // 产品类目
          categoryId: '', // 平台类目
          category: '',
          searchTerms: data.keywords,
          // description: data.descriptionHtml,
          description: data.descriptionPlain,
          weight: data.netWeight,
          brand: data.brandName,
          firstCategory: data.rootCategoryId,
          developUser: data.developLeadUserId,
          listingType: this.listingType,
          title: data.productName
        })
        this.getAttrList(data.productSku)
        const type = ['Variation', 'Normal', 'Combo']
        if (!this.isVariation) {
          this.listingType = type[data.type - 1]
        } else {
          this.listingType = type[0]
        }
        // 图片列表取分辨率为800*800
        if (this.isVariation && this.hasSku) {
          data.skuList = addListingHandle.dealLstSku(data.lstSku)
          // const lstSku = rs.lstSku || [rs]
          data.lstSku.forEach(item => {
            item.productSkuShow = `${item.nwSku} - ${item.productSku}`
          })
        } else {
          addListingHandle.dealImage(data)
          // 组合sku的子sku
          data.combineSku = data.lstSkuCode || []
        }
        this.baseProductInfo = deepClone(Object.assign(this.baseProductInfo, data))
        this.$refs.baseInfo.getPlatformCateId('isNewSku')
        setTimeout(() => {
          if (this.isVariation) {
            this.$refs.variantAttr.getOtherInfo()
          } else {
            this.$refs.otherInfo.getOtherInfo()
          }
        }, 600)
      }).finally(() => {
        this.productLoading--
      })
    },
    // 获取condition列表
    getConditionList() {
      getConditionList().then(res => {
        this.conditionList = res.data
      })
    },
    setProductCost(data) {
      if (this.isVariation) {
        // 成本 = 成本 * 折扣比例
        data.lstSku && data.lstSku.forEach(item => {
          item.costPrice = item.productCost * item.discountRatio
        })
      } else {
        data.costPrice = data.productCost * data.discountRatio
      }
    },
    // 店铺切换 更新物流 是否更新利润率
    updateAccount(data) {
      if (!data.account) return
      const { account, accountPrefix, accountGrossProfit, storeRiskLevel, accountCode, siteId, storeLevelId } = data
      this.baseProductInfo = Object.assign(this.baseProductInfo, { account, accountPrefix, accountGrossProfit, storeRiskLevel, accountCode, siteId, storeLevelId })
      if (data.accountGrossProfit && !this.baseProductInfo.grossProfitCate) {
        // 实际刊登利润率
        this.baseProductInfo.profitMargin = data.accountGrossProfit
        // 销售利润率
        this.baseProductInfo.grossProfit = data.accountGrossProfit
      }
      !this.isEdit && setTimeout(() => {
        if (!this.isVariation) {
          this.$refs.otherInfo.getOptimize()
          this.baseProductInfo.grossProfit && this.$refs.otherInfo.upateGrossModifyPrice()
          this.$refs.otherInfo.$refs.form.validateField('grossProfit')
        } else {
          this.$refs.variantAttr.getOptimize()
          this.baseProductInfo.grossProfit && this.$refs.variantAttr.upateGrossModifyPrice()
          this.$refs.variantAttr.$refs.form.validateField('grossProfit')
        }
      }, 600)
    },
    // 切换类目 更新利润率
    updateCategoryId(data) {
      this.baseProductInfo.categoryId = data.categoryId
      this.baseProductInfo.category = data.category
      // 类目销售利润率
      this.baseProductInfo.grossProfitCate = data.grossProfitCate
      if (data.grossProfitCate !== this.baseProductInfo.grossProfit) {
        // 实际刊登利润率
        this.baseProductInfo.profitMargin = data.grossProfitCate || this.baseProductInfo.accountGrossProfit
        // 销售利润率
        this.baseProductInfo.grossProfit = data.grossProfitCate || this.baseProductInfo.accountGrossProfit
        setTimeout(() => {
          if (this.isVariation) {
            this.$refs.variantAttr.upateGrossModifyPrice(this.baseProductInfo.grossProfit)
            this.$refs.variantAttr.$refs.form.validateField('grossProfit')
          } else {
            this.$refs.otherInfo.upateGrossModifyPrice(this.baseProductInfo.grossProfit)
            this.$refs.otherInfo.$refs.form.validateField('grossProfit')
          }
        }, 600)
      }
    },
    // 更新condition
    updateCondition(data) {
      const { condition, quantity, standardProdcutIdType, standardProdcutIdValue } = data
      this.baseProductInfo = Object.assign(this.baseProductInfo, {
        condition, quantity, standardProdcutIdType, standardProdcutIdValue
      })
    },
    // 站点切换时 重置物流,类目，类目利率
    updateSite(data) {
      const resetData = {
        categoryId: '',
        category: '',
        productSku: '',
        title: '',
        mainImage: '',
        extraImages: '',
        standardProdcutIdType: '',
        standardProdcutIdValue: '',
        manufacturer: '',
        searchTerms: '',
        description: '',
        weight: '',
        quantity: '',
        productType: '',
        salePrice: '',
        standardPrice: '',
        costPrice: '',
        profitMargin: '',
        grossProfit: '',
        freight: '',
        skuList: [],
        combineSku: [],
        account: ''
      }
      this.templateAttrList = []
      setTimeout(() => {
        this.$refs.templateAttr.resetAttr()
      }, 200)
      this.isVariation && this.$refs.variantAttr.clearVarThemeList()
      const { platformCode, amazonSite, categoryId, category, grossProfitCate, amazonSiteId } = data
      this.baseProductInfo = deepClone(Object.assign(this.baseProductInfo, { platformCode, amazonSite, categoryId, category, grossProfitCate, amazonSiteId }, resetData))
    },
    editDesc(value) {
      this.olineResData && this.olineResData.extend && (this.olineResData.extend.description = value)
    },
    // 加载模板下的属性列表 templateName模板名称， attributes属性值, changed联动变化
    getTemplateAttrList(templateName, attributes, changed) {
      if (templateName) {
        this.templateLoading = true
        this.productLoading++
        getPublishAttr({ templateName }).then(res => {
          if (res.data) {
            const data = res.data
            this.templateAttrList = []
            for (const item in data) {
              const filterStatus = (this.variationId || this.isVariation) ? item.indexOf('VariationData') === -1 : true
              filterStatus && this.templateAttrList.push({
                attrName: item,
                children: data[item]
              })
            }
            const attrs = attributes ? JSON.parse(attributes) : ''
            addListingHandle.setAttrValue(this.templateAttrList, attrs)
            // 获取变体主题列表
            if (this.isVariation) {
              this.$refs.variantAttr.getVarList(templateName, attributes ? this.baseProductInfo.variationThemes : '')
              if (changed) {
                this.$refs.variantAttr.clearVarThemeList()
              }
            }
            setTimeout(() => {
              this.$refs.templateAttr.resetAttr()
            }, 600)
          }
        }).finally(() => {
          this.templateLoading = false
          this.productLoading--
        })
      } else if (this.templateAttrList.length) {
        this.templateAttrList = []
        setTimeout(() => {
          this.$refs.templateAttr.resetAttr()
        }, 200)
        this.isVariation && this.$refs.variantAttr.clearVarThemeList()
      }
    },
    // 保存事件
    saveHandle() {
      // 表单验证
      const refs = this.$refs
      let validStatu = true
      if (this.isVariation) {
        refs.variantAttr.$refs.form.validate(valid => !valid && (validStatu = false))
      } else {
        refs.otherInfo.$refs.form.validate(valid => {
          !valid && (validStatu = false)
        })
      }
      refs.baseInfo.$refs.form.validate(valid => !valid && (validStatu = false))
      refs.templateAttr.$refs.form.validate(valid => !valid && (validStatu = false))
      refs.sellingPoint.$refs.form.validate(valid => !valid && (validStatu = false))
      console.log('validStatu', validStatu)
      if (!validStatu) {
        this.$message.error('请根据提示完成表单')
        return false
      }
      let params = {}
      // 修改在售的子sku
      if (this.isEdit && this.listingStatus >= 5) {
        this.amazonlistingvariantUpdate()
        return false
      }
      // 新增SKU 草稿
      const { accountPrefix, storeRiskLevel, rootCategoryId, developUser, combineSku, accountCode } = this.baseProductInfo
      const {
        account, brand, manufacturer, productType, amazonSite, category, categoryId, fulfillmentChannel,
        title, condition, productSku, quantity, standardProdcutIdType, standardProdcutIdValue, customerUser
      } = refs.baseInfo.$data.form
      const { attr } = refs.templateAttr.$data.form
      const { bulletPoint, searchTerms, description } = refs.sellingPoint.form
      const descContent = addListingHandle.dealDescNbsp(description)
      const attributesStr = addListingHandle.getAttrValue(attr)
      // 新增多个子sku
      if (this.isVariation) {
        const { variationThemes } = refs.variantAttr.$data.form
        params = {
          amazonDraftDTO: {
            id: this.amazonDraftVOId,
            fulfillmentChannel,
            brand, // 品牌
            manufacturer, // 制造商
            saleVariant: 1, // 售卖形式-是否为变体 0：非变体 1:变体
            variationThemes // 变体主题
          },
          amazonDraftSkuDTOList: refs.variantAttr.getSkuValue(),
          amazonListingExtendDTO: {
            id: this.amazonListingExtendVOId,
            // 模板下的属性
            attributes: attributesStr ? JSON.stringify(attributesStr) : attributesStr,
            bulletPoint: Object.values(bulletPoint).join(';'), // 卖点
            searchTerms, // 搜索词
            description: descContent // 描述
          },
          id: this.skuId,
          productType, // 模板
          account,
          amazonSite,
          productSku,
          category,
          categoryId,
          title,
          isAutoProdcutId: refs.variantAttr.$data.form.isAutoProdcutId,
          listingType: this.listingType, // listing类型
          developUser, // 开发人员
          customerUser, // 客服字段
          storeRiskLevel, // 店铺安全等级
          accountCode,
          listingStatus: this.isEdit ? this.listingStatus : undefined,
          accountPrefix, // 店铺前缀
          rootCategoryId // 产品一级类目ID
        }
      } else {
      // 单个主sku
        const {
          standardPrice, salePrice, saleStartDate, saleEndDate, costPrice, profitMargin,
          mainImage, extraImagList, logisticsObj
        } = refs.otherInfo.$data.form
        params = {
          amazonDraftDTO: {
            id: this.amazonDraftVOId,
            fulfillmentChannel,
            brand, // 品牌
            manufacturer, // 制造商
            saleVariant: 0, // 售卖形式-是否为变体 0：非变体 1:变体
            variationThemes: '' // 变体主题
          },
          amazonDraftSkuDTOList: [
            {
              id: this.skuVOId,
              variantDraftStatus: this.isEdit ? 'uppdate' : 'add',
              condition,
              costPrice, // 成本价格
              extraImages: extraImagList.join(';'),
              // 销售毛利率
              grossProfit: this.baseProductInfo.grossProfitCate || this.baseProductInfo.accountGrossProfit,
              profitMargin, // 实际刊登毛利率
              logistics: logisticsObj ? JSON.stringify(logisticsObj) : logisticsObj, // 计算符合的物流信息
              mainImage,
              productSku,
              quantity, // 库存数量
              saleEndDate,
              salePrice, // 促销价
              saleStartDate,
              standardPrice, // 售价
              standardProdcutIdType, // 标准产品id类型
              standardProdcutIdValue
            }
          ],
          amazonListingExtendDTO: {
            id: this.amazonListingExtendVOId,
            // 模板下的属性
            attributes: attributesStr ? JSON.stringify(attributesStr) : attributesStr,
            bulletPoint: Object.values(bulletPoint).join(';'), // 卖点
            searchTerms, // 搜索词
            description: descContent // 描述
          },
          id: this.skuId,
          productType, // 模板
          account,
          amazonSite,
          category,
          categoryId,
          title,
          productSku,
          isAutoProdcutId: refs.baseInfo.$data.form.isAutoProdcutId,
          listingType: this.listingType, // listing类型
          developUser, // 开发人员
          storeRiskLevel, // 店铺安全等级
          accountCode,
          accountPrefix, // 店铺前缀
          listingStatus: this.isEdit ? this.listingStatus : undefined,
          rootCategoryId, // 产品一级类目ID
          combineSku: JSON.stringify(combineSku)
        }
      }
      params.fbwordConfirm = false
      this.saveAjax(params)
    },
    // 修改在售的子sku
    amazonlistingvariantUpdate(isCheck = false) {
      const refs = this.$refs
      const { id, amazonListingId, listingId, account, productSku, sellerSku, asin, listingStatus, amazonSite, itemCondition, skuAttrs, grossProfit } = this.baseProductInfo
      const { brand, manufacturer, productType, category, categoryId, quantity, standardProdcutIdType, standardProdcutIdValue, title, fulfillmentChannel } = refs.baseInfo.form
      const { standardPrice, salePrice, saleStartDate, saleEndDate, costPrice, profitMargin, mainImage, extraImagList, logisticsObj } = refs.otherInfo.form
      const { bulletPoint, searchTerms, description } = refs.sellingPoint.$data.form
      const { attr } = refs.templateAttr.$data.form
      const attributesStr = addListingHandle.getAttrValue(attr)
      const params = {
        id,
        isCheck,
        amazonListingId,
        listingId,
        account,
        title,
        productSku,
        sellerSku,
        asin,
        category,
        categoryId,
        mainImage,
        listingStatus,
        amazonSite,
        costPrice,
        price: standardPrice,
        salePrice,
        saleStartDate,
        saleEndDate,
        quantity,
        fulfillmentChannel,
        itemCondition,
        skuAttrs: skuAttrs ? JSON.stringify(skuAttrs) : skuAttrs,
        manufacturer,
        grossProfit,
        brand,
        productType,
        extend: {
          attributes: attributesStr ? JSON.stringify(attributesStr) : attributesStr,
          bulletPoint: Object.values(bulletPoint).join(';'), // 卖点
          searchTerms, // 搜索词
          description, // 描述
          imageUrls: extraImagList.join(';')
        },
        draftSku: {
          standardProdcutIdType,
          standardProdcutIdValue,
          profitMargin,
          grossProfit,
          logistics: logisticsObj ? JSON.stringify(logisticsObj) : logisticsObj
        }
      }
      // 修改字段 1:产品 2:售价|促销价|促销时间 3:库存 4:图片
      params.updateField = addListingHandle.dealUpdateField(params, this.olineResData)
      if (params.updateField.length) {
        this.saveAjaxOnline(params)
      } else {
        this.$message.error('未修改无需提交')
      }
    },
    saveAjaxOnline(params) {
      this.saveLoading = true
      amazonlistingvariantUpdate(params).then(res => {
        this.thenMethod(res, this.saveAjaxOnline, params, 'isCheck')
      }).catch(error => {
        this.$message.error(error)
      }).finally(() => {
        this.saveLoading = false
      })
    },
    // 草稿请求事件 编辑/新增
    saveAjax(params) {
      const request = this.isEdit ? amazonListingUpdateDraft : amazonlistingSave
      this.saveLoading = true
      request(params).then(res => {
        this.thenMethod(res, this.saveAjax, params, 'fbwordConfirm')
      }).finally(() => {
        this.saveLoading = false
      })
    },
    thenMethod(res, request, params, isCheck) {
      if (res.code === 200) {
        this.$message.success('操作成功')
        this.$emit('close', true)
      } else if (res.code === 201) {
        this.$modal({
          title: '提示',
          component: fbwordConfirm,
          padding: '30px',
          minHeight: '120px',
          width: '550px',
          data: {
            message: res.msg
          },
          callback: (valid) => {
            if (valid) {
              request({ ...params, [isCheck]: true })
            }
          }
        })
      } else if (res.code === 202) {
        this.$confirm(res.msg, '警告', {
          showConfirmButton: false,
          cancelButtonText: '取消'
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    // 一键翻译 翻译字段：标题，卖点， 关键词， 描述，属性
    getTranslate() {
      addListingHandle.getTranslateHandle(this.$refs, this.countryCode, this.translate)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-linsting-box{
  padding: 10px 10px 30px 10px;
}
.el-collapse {
  border-top: 0;
  border-bottom: 0;
}
::v-deep .el-collapse-item__wrap, ::v-deep  .el-collapse-item__header {
  border-bottom: 0;
}
::v-deep .el-collapse-item__content {
  padding-top: 10px;
}
.isFixed{
  position: fixed;
  bottom: 10px;
  z-index: 101;
  margin-left: 20%;
  .el-select{
    margin: 0 10px;
  }
}
</style>
