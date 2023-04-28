<!-- 创建单个普通Listing -->
<template>
  <basic-container v-loading="productLoading > 0">
    <el-collapse v-model="activeNames" class="add-linsting-box">
      <el-collapse-item v-loading="productLoading > 0" name="baseInfo">
        <collapse-title slot="title" title="基本信息" />
        <base-info ref="baseInfo"
                   v-bind="{ productLoading, hasSku, baseProductInfo, isVariation, labelWidth, isEdit, conditionList, standardProdcutIdTypeList }"
                   @getSkuDetail="getSkuDetail"
                   @updateCategoryId="updateCategoryId"
                   @upatePublishSite="upatePublishSite"
                   @updateSite="updateSite"
                   @updateAccount="updateAccount"
                   @updateSaleType="updateSaleType"
                   @upateWarehouse="upateWarehouse"
                   @productLoadingStart="productLoading++"
                   @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="productLoading > 0" name="categoryAttr">
        <collapse-title slot="title" title="属性" />
        <category-attr ref="categoryAttr"
                       v-bind="{ productLoading, labelWidth, baseProductInfo, isVariation }"
                       @updateVarAttr="updateVarAttr"
                       @productLoadingStart="productLoading++"
                       @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <!-- 常规选项 -->
      <el-collapse-item v-loading="productLoading > 0" name="generalOption">
        <collapse-title slot="title" title="常规选项" />
        <general-option ref="generalOption"
                        v-bind="{ productLoading, labelWidth, baseProductInfo, isEdit, isShowPay }"
                        @payIdChange="payIdChange"
        />
      </el-collapse-item>
      <el-collapse-item v-if="isVariation" v-loading="productLoading > 0" name="variantAttr">
        <collapse-title slot="title" title="变体信息" />
        <variant-attr ref="variantAttr"
                      v-bind="{ productLoading, labelWidth, baseProductInfo, standardProdcutIdTypeList, conditionList, isEdit,isVariation,lstAttrHead, isShowPay }"
                      @changeSellingPrice="getSellingPrice"
                      @productLoadingStart="productLoading++"
                      @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="productLoading > 0" name="otherInfo">
        <collapse-title slot="title" title="其它信息" />
        <!-- 物流，运费，成本，毛利率…… -->
        <other-info v-if="!isVariation"
                    ref="otherInfo"
                    v-loading="productLoading > 0"
                    v-bind="{ productLoading, labelWidth, baseProductInfo, isEdit, isShowPay }"
                    @changeSellingPrice="getSellingPrice"
                    @productLoadingStart="productLoading++"
                    @productLoadingEnd="productLoading--"
                    @getStartPrice="getStartPrice"
        />
        <description ref="description"
                     v-loading="productLoading > 0"
                     v-bind="{ productLoading, labelWidth, baseProductInfo, isEdit }"
                     @editDesc="editDesc"
                     @productLoadingStart="productLoading++"
                     @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
    </el-collapse>
    <div class="affix isFixed">
      <div class="bottom-btn">
        <el-button @click="$emit('close', false)">取消</el-button>
        <el-button :disabled="productLoading > 0 || translate.loading"
                   :loading="saveLoading"
                   type="primary"
                   @click="saveHandleVerif"
        >保存</el-button>
        <el-select v-model="countryCode" filterable placeholder="请选择翻译语种">
          <el-option v-for="item in languages" :key="item.value" :label="item.name" :value="item.value" :title="item.name" />
        </el-select>
        <el-button type="primary" :disabled="!countryCode || productLoading > 0 || saveLoading" :loading="translate.loading" @click="getTranslate">一键翻译</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import * as addListingHandle from './components/addEbayListing.handle.js'
import description from './components/description.vue'
import otherInfo from './components/otherInfo.vue'
import baseInfo from './components/baseInfo.vue'
import categoryAttr from './components/categoryAttr.vue'
import variantAttr from './components/variantAttr.vue'
import collapseTitle from './components/collapseTitle.vue'
import generalOption from './components/generalOption/generalOption.vue'
import { getSkuDetailByProduct, getSpuDetailByProduct } from '@/api/amazon/amazon.js'
import { getEbayConditionType } from '@/api/ebay/category.js'
import { getShoppingItems } from '@/api/ebay/template.js'
// import { getShortStoreByCode } from '@/api/sams'
import { ebayListingSave, ebayListingUpdate, getEbayListingDetail } from '@/api/ebay/ebayAdd.js'
const activeNames = () => ['baseInfo', 'otherInfo', 'categoryAttr', 'generalOption', 'variantAttr']
export default {
  name: 'LmsLmsEbayEbayAddListing',
  components: {
    description,
    otherInfo,
    baseInfo,
    categoryAttr,
    variantAttr,
    collapseTitle,
    generalOption
  },
  props: {
    id: String,
    itemId: String
  },
  data() {
    return {
      lstAttrHead: [],
      activeNames: activeNames(), // 折叠面板默认展开
      // 当前翻译语言
      countryCode: '',
      languages: addListingHandle.languages,
      translate: { loading: false },
      // 产品通用编码
      standardProdcutIdTypeList: ['UPC', 'EAN'],
      // 产品基本信息
      baseProductInfo: { platformCode: 'EB' },
      // Listing类型 Variation Normal Combo
      listingType: '',
      // 表单label统一宽度
      labelWidth: '150px',
      conditionList: {},
      // 是否有获取到sku信息
      hasSku: true,
      olineResData: null, // 记录在售详情，用于提交时对比
      productLoading: 0,
      saveLoading: false,
      saleData: '',
      isShowPay: true,
      cateVariantAttr: [] // 类目带出的变体属性
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
  created() {
    if (this.isEdit) {
      this.getEbayListingDetail()
    } else this.getConditionList()
  },
  methods: {
    // 获取国内运输方式列表
    getShipping() {
      const { publishSiteCode, storeName } = this.baseProductInfo
      return getShoppingItems({ siteCode: publishSiteCode, storeAccount: storeName, itemType: 'ShippingServiceDetails', international: false }).then(res => res.data)
    },
    // 获取condition列表
    getConditionList() {
      this.productLoading++
      getEbayConditionType().then(res => {
        this.conditionList = deepClone(res.data) || {}
      }).finally(() => {
        this.productLoading--
      })
    },
    // 获取售价data数据
    getStartPrice(data) {
      this.saleData = data
    },
    // 获取SKU详细信息api
    getSkuDetailAjax(productSku, platformCode, storeCode, siteCode) {
      return new Promise((resolve, reject) => {
        const request = this.isVariation ? getSpuDetailByProduct : getSkuDetailByProduct
        this.productLoading++
        request({ data: { lstProductSku: [productSku], platformCode, storeCode, siteCode } }).then(res => {
          if (res.data && res.data[0]) {
            const data = res.data[0]
            this.hasSku = true
            const type = ['Variation', 'Normal', 'Combo']
            this.listingType = this.isVariation ? type[0] : type[data.type - 1]
            if (this.isVariation) {
              // 1新的PMS的sku取SPU的规格属性展示 2老的SKU直接取第一个SKU的规格属性名和值
              if (data.source === 1) {
                // 过滤为空的
                data.spuSpecificationAttrs = data.spuSpecificationAttrs.filter(item => item)
              } else {
                data.spuSpecificationAttrs = []
                const lstAttrSpe = data.lstSku[0].lstAttrSpecification || []
                lstAttrSpe.filter(item => {
                  if (item.fieldNameEn || item.fieldValue) {
                    data.spuSpecificationAttrs.push(`${item.fieldNameEn || '-'} : ${item.fieldValue || '-'}`)
                  }
                })
              }
              // 成本 = 成本 * 折扣比例
              data.lstSku.forEach(item => {
                item.productCost = item.productCost * item.discountRatio
              })
            } else {
              data.productCost = data.productCost * data.discountRatio
            }
            resolve(data)
          } else {
            this.$message.error(res.msg)
            this.hasSku = false
          }
        }).finally(() => {
          this.productLoading--
        })
      })
    },
    // 创建时获取SKU详细信息
    getSkuDetail(productSku, type) {
      if (this.baseProductInfo.productSku === productSku) return false
      const { platformCode, storeCode, publishSiteCode } = this.baseProductInfo
      this.getSkuDetailAjax(productSku, platformCode, storeCode, publishSiteCode).then(res => {
        let data = res
        const { lstAttrHead } = addListingHandle.setAttrHead(this, data)
        data = Object.assign(data, {
          costPrice: data.productCost,
          productCategoryId: data.categoryId,
          description: data.descriptionHtml,
          weight: data.netWeight,
          firstCategory: data.rootCategoryId,
          developer: data.developLeadUserId,
          listingType: this.listingType,
          title: data.type === 3 ? data.productNameEn : data.productName,
          lstAttrHead,
          startPrice: data.startPrice || this.saleData // 将售价赋值
        })
        if (this.isVariation && this.hasSku) {
          addListingHandle.dealImage(data)
          data.skuList = data.lstSku.map(item => {
            item.costPrice = item.productCost
            item.weight = item.netWeight
            item.productSkuShow = `${item.nwSku} - ${item.productSku}`
            item.productIdTypeValue = 'Does Not Apply'
            addListingHandle.dealImage(item)
            addListingHandle.setAttrValue(data, item, lstAttrHead)
            return item
          })
        } else {
          addListingHandle.dealImage(data)
          // 组合sku的子sku
          data.combineSku = data.lstSkuCode && data.lstSkuCode.join(',')
        }
        this.baseProductInfo = Object.assign({}, this.baseProductInfo, data)
        this.$refs.baseInfo.getPlatformCateId('isNewSku')
        // this.$refs.categoryAttr.getCompatibilityTemplateList(this.baseProductInfo)
        // 切换SKU-清空属性和属性值
        this.$refs.categoryAttr.resetAttr()
        this.$refs.categoryAttr.form.attr = []
        setTimeout(() => {
          if (this.isVariation) {
            !!this.$refs.baseInfo.form.warehouseId && this.$refs.variantAttr.getOtherInfo()
          } else {
            !!this.$refs.baseInfo.form.warehouseId && this.$refs.otherInfo.getOtherInfo()
          }
        }, 600)
      })
    },
    // 获取listing详情
    getEbayListingDetail() {
      this.productLoading++
      getEbayListingDetail({ id: this.id }).then(res => {
        if (!res.data) {
          this.$message.error(res.msg)
        }
        const { description, productAttrs, productImageUrls } = res.data.listingText
        const { paymentInfo, returnInfo, buyerRequirementInfo, shippingInfo, logical, saleProfitRate } = res.data
        let listingVariation = {}
        if (!this.isVariation) {
          listingVariation = res.data.listingVariations[0]
        }
        const productSku = res.data.spu
        const { imgShowList, mainImage, extraImagList } = addListingHandle.showListingDetailImage(productImageUrls)
        let baseProductInfo = deepClone(Object.assign(res.data, listingVariation, {
          platformCode: 'EB',
          description,
          productAttrs,
          logical: logical ? JSON.parse(logical) : {},
          productSku,
          productImageUrls,
          imgShowList,
          mainImage,
          extraImagList,
          saleProfitRate
        }))
        const { platformCode, storeCode, publishSiteCode, primaryCateId, compatibilityTemplateId } = baseProductInfo
        this.$refs.description.getTemplateList(publishSiteCode, storeCode)
        this.$refs.categoryAttr.showDetailSpecificList(productAttrs, compatibilityTemplateId)
        this.$refs.categoryAttr.getCateSpecificList(publishSiteCode, primaryCateId, productAttrs)// 获取属性接口
        // 获取仓库信息
        this.$refs.baseInfo.getWareHouseList(res.data.publishSiteCode).then(ware => {
          let virtualWarehouse, warehouse, warehouseType, skuSuffix
          ware.findIndex(item => {
            const warehouseId = addListingHandle.getWarehouseId(res.data)
            if (item.warehouseId === warehouseId) {
              virtualWarehouse = item.virtualWarehouse
              warehouse = warehouseId
              item.warehouseId = warehouseId
              skuSuffix = item.affixContent
              warehouseType = item.type
            }
          })
          baseProductInfo = Object.assign(baseProductInfo, { virtualWarehouse, warehouseId: warehouse, warehouse, warehouseType, skuSuffix })
          // 获取pms详情信息
          this.getSkuDetailAjax(productSku, platformCode, storeCode, publishSiteCode).then(rs => {
            this.$refs.generalOption.getPolicyTemplate(publishSiteCode, storeCode)
            this.$refs.generalOption.generalOptionInfo = { paymentInfo, returnInfo, buyerRequirementInfo, shippingInfo }
            if (!shippingInfo.internationalServiceOptionsList) shippingInfo.internationalServiceOptionsList = []
            if (this.isVariation) { // 多变体
              addListingHandle.dealEditSkuImage(rs, baseProductInfo)
              const { skuList, lstAttrHead } = addListingHandle.dealListingDetailVar(res.data.listingVariations, rs)
              listingVariation = { skuList, lstAttrHead }
              baseProductInfo = Object.assign(baseProductInfo, listingVariation, {
                listingType: this.listingType,
                developer: rs.developLeadUserId,
                lstSku: rs.lstSku
              })
            } else { // 单个普通
              baseProductInfo = Object.assign(baseProductInfo, {
                listingType: this.listingType,
                costPrice: rs.productCost,
                developer: rs.developLeadUserId,
                weight: rs.netWeight
              })
              addListingHandle.dealEditSkuImage(rs, baseProductInfo)
            }
            baseProductInfo.pmsDesc = rs.descriptionHtml
            baseProductInfo.varAttr = this.cateVariantAttr
            this.olineResData = deepClone(baseProductInfo)
            this.baseProductInfo = baseProductInfo
            setTimeout(() => {
              this.$refs.baseInfo.$refs.form.validateField('warehouseId')
              this.$refs.baseInfo.findPrimaryCate({ target: { value: primaryCateId } }, 'init')
              this.$refs.baseInfo.getIsShowPay().then(res => {
                this.isShowPay = res
                !this.isShowPay && this.$refs.otherInfo.$refs.form.clearValidate('saleProfitRate')
                const ref = this.isVariation ? this.$refs.variantAttr : this.$refs.otherInfo
                ref.getOtherInfo('isEditInit').then(y => {
                  this.isShowPay && this.$refs.generalOption.getPayVal(this.$refs.generalOption.form.payId)
                })
              })
            }, 200)
          })
        })
      }).finally(() => {
        this.productLoading--
      })
    },
    // 店铺站点切换
    updateSite(data) {
      this.upatePublishSite(data)
    },
    // 刊登站点切换时 重置物流,类目，类目利率, 类目属性，政策模板
    upatePublishSite(data) {
      const refs = this.$refs
      if (this.isVariation) {
        refs.variantAttr.$refs.form.resetFields()
        refs.variantAttr.form.skuList = []
      } else {
        refs.otherInfo.$refs.form.resetFields()
        refs.otherInfo.logicalsList = []
      }
      refs.categoryAttr.$refs.form.resetFields()
      refs.categoryAttr.form.attr = []
      refs.description.$refs.form.resetFields()
      setTimeout(() => {
        this.baseProductInfo = Object.assign({}, this.baseProductInfo, data, {
          weight: '',
          skuList: [],
          imgShowList: [],
          mainImage: '',
          extraImagList: [],
          variationPictures: [],
          description: '',
          costPrice: '',
          warehouse: ''
        })
        refs.description.imgShowList = []
      })
      refs.description.getTemplateList(data.publishSiteCode, data.storeCode, true)
      this.$set(refs.generalOption, 'form', {})
      refs.generalOption.getPolicyTemplate(data.publishSiteCode, data.storeCode)
      refs.generalOption.getDefaultTemplateDetails(data.publishSiteCode, data.storeCode)
    },
    // 切换销售类型
    updateSaleType(data) {
      this.baseProductInfo = Object.assign({}, this.baseProductInfo, data)
    },
    // 切换仓库
    upateWarehouse(data, init) {
      if (!data.warehouseId) {
        this.isVariation ? this.$set(this.$refs.variantAttr, 'logicalsList', []) : this.$set(this.$refs.otherInfo, 'logicalsList', [])
        return
      }
      const obj = this.baseProductInfo
      !init && this.isVariation && (obj.skuList = this.$refs.variantAttr.form.skuList)
      this.baseProductInfo = Object.assign({}, obj, data)
      this.$nextTick(() => {
        if (!init) {
          this.isVariation ? this.$refs.variantAttr.getOptimize() : this.$refs.otherInfo.getOptimize()
        }
      })
    },
    // 店铺切换 => 更新物流 更新店铺类目 更新描述模板 是否更新利润率 更新政策模板
    updateAccount(data, isShowPay) {
      if (!data.storeName) return
      this.isShowPay = isShowPay
      if (data.accountGrossProfit && !this.baseProductInfo.saleProfitRate) {
        // 实际刊登利润率
        this.baseProductInfo.actualProfitRate = data.accountGrossProfit
        // 销售利润率
        this.baseProductInfo.saleProfitRate = data.accountGrossProfit
      }
      !this.isEdit && this.$nextTick(() => {
        if (!this.isVariation) {
          this.$refs.otherInfo.getOptimize().then(res => {
            this.$refs.otherInfo.$refs.form.validateField('saleProfitRate')
          })
          // this.baseProductInfo.saleProfitRate && this.$refs.otherInfo.upateGrossModifyPrice()
        } else {
          this.$refs.variantAttr.form.saleProfitRate = data.accountGrossProfit
          this.$refs.variantAttr.getOptimize()
          // this.baseProductInfo.saleProfitRate && this.$refs.variantAttr.upateGrossModifyPrice()
          // this.$refs.variantAttr.$refs.form.validateField('saleProfitRate')
        }
      })
      this.baseProductInfo.storePrimaryCateId = ''
      this.baseProductInfo.storeSecondCateId = ''
      this.baseProductInfo.paypalAccount = ''
      this.$refs.baseInfo.form.storePrimaryCateId = ''
      this.$refs.baseInfo.form.storeSecondCateId = ''
      this.baseProductInfo = Object.assign({}, this.baseProductInfo, data, { skuList: [], description: '' })
      // this.$refs.description.getTemplateList(data.publishSiteCode, data.storeCode, true)
      this.$set(this.$refs.generalOption, 'form', {})
      // this.$refs.generalOption.getPolicyTemplate(data.publishSiteCode, data.storeCode)
      // this.$refs.generalOption.getDefaultTemplateDetails(data.publishSiteCode, data.storeCode)
      this.upatePublishSite(data)
    },
    // 类目属性改变
    updateVarAttr(varAttr) {
      if (this.isEdit) this.cateVariantAttr = varAttr
      const data = this.baseProductInfo
      if (data.lstSku && this.isVariation) {
        data.varAttr = varAttr
        data.skuList = this.$refs.variantAttr.form.skuList
        const { lstAttrHead } = addListingHandle.setAttrHead(this, data)
        data.skuList.forEach(item => {
          addListingHandle.setAttrValue(data, item, lstAttrHead)
        })
        this.baseProductInfo = Object.assign({}, data, { lstAttrHead })
        this.lstAttrHead = lstAttrHead
      }
    },
    // 售价改变，更新支付模板详情
    getSellingPrice(data) {
      if (!this.isShowPay) return
      const price = Array.isArray(data) ? data.join() : data
      if (this.$refs.generalOption.form.payId) { // 支付模板已选
        this.$refs.generalOption.getPayVal(this.$refs.generalOption.form.payId, price)
      } else { // 未选
        this.$refs.generalOption.sellingPrice = price
      }
    },
    // 选择支付模板 获取售价
    payIdChange(paypalAccount, init, isChanged) {
      this.baseProductInfo = Object.assign({}, this.baseProductInfo, { paypalAccount })
      this.$nextTick(() => {
        if (isChanged) {
          this.isVariation ? this.$refs.variantAttr.controlFlag = true : this.$refs.otherInfo.controlFlag = true
          const ref = this.isVariation ? this.$refs.variantAttr.$refs : this.$refs.otherInfo.$refs
          ref.form.validateField('saleProfitRate')
        }
      })
    },
    // 切换类目
    updateCategoryId(data, cateInfo) {
      const { publishSiteCode, primaryCateId } = data
      if (!cateInfo.isInit) {
        this.isVariation && (this.baseProductInfo.skuList = this.$refs.variantAttr.form.skuList)
        this.baseProductInfo = Object.assign({}, this.baseProductInfo, data, cateInfo, { startPrice: data.startPrice || this.saleData }) // 将缓存的售价赋值过来
        this.$refs.categoryAttr.getCateSpecificList(publishSiteCode, primaryCateId)
      }
      // 是否显示车型库，并获取车型库列表
      cateInfo.itemCompatibilityEnabled === 'ByApplication' && this.$refs.categoryAttr.getCompatibilityTemplateList(this.baseProductInfo, cateInfo)
      if (this.isVariation) {
        if (!cateInfo.isVariationsEnabled) {
          primaryCateId && this.$message.info('此类目不支持Variation Listing')
        }
      }
      // !cateInfo.isVariationsEnabled && this.$message.info('此类目不支持Variation Listing')
    },
    // 表单验证
    async saveHandleVerif() {
      const refs = this.$refs
      let validStatu = true
      await refs.baseInfo.$refs.form.validate(valid => !valid && (validStatu = false))
      await refs.categoryAttr.$refs.form.validate(valid => !valid && (validStatu = false))
      await refs.description.$refs.form.validate(valid => !valid && (validStatu = false))
      await refs.generalOption.$refs.form.validate(valid => !valid && (validStatu = false))
      if (this.isVariation) {
        await refs.variantAttr.$refs.form.validate(valid => {
          !valid && (validStatu = false)
          this.saveHandle(validStatu)
        })
      } else {
        await refs.otherInfo.$refs.form.validate(valid => {
          !valid && (validStatu = false)
          this.saveHandle(validStatu)
        })
      }
    },
    // 保存事件
    async saveHandle(validStatu) {
      const refs = this.$refs
      if (!validStatu) {
        this.$message.error('请根据提示完成表单')
        this.activeNames = activeNames()
        return false
      }
      const generalOptionInfo = refs.generalOption.generalOptionInfo
      // 处理国际运输方式为空的情况
      const { internationalServiceOptionsList, domesticShippingServiceOptionList } = generalOptionInfo.shippingInfo
      if (internationalServiceOptionsList && internationalServiceOptionsList.length) {
        generalOptionInfo.shippingInfo.internationalServiceOptionsList = internationalServiceOptionsList.filter(item => item.shippingService)
        generalOptionInfo.shippingInfo.internationalServiceOptionsList.forEach((e, index) => {
          e.shippingServicePriority = index + 1
          delete e.isALLCheckShoppingLocation
          delete e.isIndeterminate
        })
      }
      // 处理国内运输方式
      if (domesticShippingServiceOptionList && domesticShippingServiceOptionList.length) {
        const res = await this.getShipping()
        generalOptionInfo.shippingInfo.domesticShippingServiceOptionList.forEach((e, index) => {
          const serviceName = res.find(item => item.value === e.shippingService)
          e.shippingServicePriority = index + 1
          e.shippingServiceName = serviceName && serviceName.name
        })
      }
      // 是否显示和提交支付模板信息
      if (!this.isShowPay) {
        delete generalOptionInfo.paymentInfo
      }
      // console.log('常规选项', generalOptionInfo)

      const { developer, itemId, sellerSku, skuSuffix } = this.baseProductInfo
      const { stock, productIdTypeValue, productSku, isFromNumPool, epid } = refs.baseInfo.form
      const productAttrs = addListingHandle.getAttrValue(refs.categoryAttr.form.attr)
      const { id, listingId } = this.baseProductInfo.listingVariations ? this.baseProductInfo.listingVariations[0] : {}
      const description = refs.description
      const ebayListingDTO = Object.assign({},
        refs.baseInfo.form,
        refs.description.form, {
          description: addListingHandle.escapeToHtml(refs.description.form.description), // 转义描述
          id: listingId,
          sellerSku,
          developer,
          itemId,
          spu: productSku,
          skuSuffix,
          warehouseId: addListingHandle.setWarehouseId(refs.baseInfo.form),
          listingType: this.listingType,
          logical: this.isVariation ? JSON.stringify(refs.variantAttr.form.logical) : JSON.stringify(refs.otherInfo.form.logical),
          productAttrs: productAttrs ? JSON.stringify(productAttrs) : '',
          compatibilityTemplateId: refs.categoryAttr.form.compatibilityTemplateId,
          isFromNumPool: isFromNumPool ? 1 : 0,
          productImageUrls: [description.mainImage, ...description.extraImagList]
        })
      let ebayListingVariationDTO = []
      let saleProfitRate = ''
      // 是否ebay变体
      if (this.isVariation) {
        saleProfitRate = refs.variantAttr.form.saleProfitRate
        ebayListingVariationDTO = refs.variantAttr.getSkuValue()
      } else {
        saleProfitRate = refs.otherInfo.form.saleProfitRate
        ebayListingVariationDTO = [Object.assign({}, refs.otherInfo.form, {
          id,
          sellerSku,
          listingId,
          stock,
          productIdTypeValue,
          productSku,
          epid
        })]
      }
      const params = { ...ebayListingDTO, ebayListingVariationDTO, isFbwordConfirmed: false, ...generalOptionInfo, saleProfitRate }
      // 在售修改字段 1:产品 2:售价|促销价|促销时间 3:库存 4:图片=
      if (this.itemId) {
        params.updateField = addListingHandle.dealUpdateField(this.isVariation, params, this.olineResData)
        params.updateField.length ? this.saveAjax(params) : this.$message.error('未修改无需提交')
      } else {
        this.saveAjax(params)
      }
    },
    saveAjax(params) {
      const request = this.isEdit ? ebayListingUpdate : ebayListingSave
      this.saveLoading = true
      request(params).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.$emit('close', true)
        } else if (res.code === 201) {
          // isFbwordConfirmed 需要违禁词二次确认提交, 否则直接提示errorMessage 或 直接提交成功
          this.$confirm(res.msg, '警告', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.saveAjax({ ...params, isFbwordConfirmed: true })
          })
        } else if (res.code === 202) {
          this.$confirm(res.msg, '警告', {
            showConfirmButton: false,
            cancelButtonText: '取消'
          })
        } else {
          this.$message.error(res.msg || '未知错误')
        }
      }).catch(error => {
        this.$message.error(error)
      }).finally(() => {
        this.saveLoading = false
      })
    },
    editDesc(value) {
      this.olineResData && (this.olineResData.description = value)
    },
    // 一键翻译 翻译字段：标题，卖点， 关键词， 描述，属性
    getTranslate() {
      addListingHandle.getTranslateHandle(this, this.countryCode, this.translate)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-linsting-box{
  padding: 10px 10px 45px 10px;
}
.el-collapse {
  border-top: 0;
  border-bottom: 0;
}
::v-deep .el-collapse-item__wrap, ::v-deep .el-collapse-item__header {
  border-bottom: 0;
}
::v-deep .el-collapse-item__content {
  padding-top: 10px;
  padding-bottom: 0;
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
