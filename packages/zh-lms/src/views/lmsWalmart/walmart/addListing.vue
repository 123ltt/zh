<template>
  <basic-container>
    <el-collapse v-model="activeNames" class="add-linsting-walmart">
      <el-collapse-item name="baseInfo">
        <collapse-title slot="title" title="基本信息" />
        <!-- 设置基本信息 -->
        <base-info
          ref="baseInfo"
          v-bind="{ labelWidth, productLoading, baseProductInfo, isVariation, isEdit}"
          @selectSkuModal="selectSkuModal"
          @getSkuDetail="getSkuType"
          @updateAccount="updateAccount"
          @updateCategoryId="updateCategoryId"
          @updateRate="updateRate"
          @upateWarehouse="upateWarehouse"
          @productLoadingStart="productLoading++"
          @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item name="categoryAttr">
        <collapse-title slot="title" title="属性" />
        <category-attr ref="categoryAttr"
                       v-bind="{ labelWidth, productLoading, baseProductInfo }"
                       @getVarAttr="getVarAttr"
                       @productLoadingStart="productLoading++"
                       @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item name="variantAttr">
        <collapse-title slot="title" title="价格及库存" />
        <variantAttr ref="variantAttr"
                     v-bind="{ labelWidth, productLoading, baseProductInfo, isVariation, isEdit}"
        />
      </el-collapse-item>
      <el-collapse-item name="description">
        <collapse-title slot="title" title="描述" />
        <description ref="description"
                     v-bind="{ labelWidth, productLoading, baseProductInfo, isEdit}"
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
import collapseTitle from '@/views/components/collapseTitle.vue'
import selectSkuModal from '@/views/components/selectSkuModal/selectSkuModal.vue'
import baseInfo from './components/baseInfo.vue'
import categoryAttr from './components/categoryAttr.vue'
import variantAttr from './components/variantAttr.vue'
import description from './components/description.vue'
import fbwordConfirm from '@/views/components/fbwordConfirm.vue'
import { getSkuDetailByProduct, getSpuDetailByProduct, getTypeByProductCodes } from '@/api/pms.js'
import * as addListingHandle from './addListing.handle.js'
import { setProductCost } from '@/views/components/utils.js'
import { walmartListingSave, walmartListingUpdate, getWalmartDetail } from '@/api/walmart/walmart.js'
const activeNames = () => ['baseInfo', 'categoryAttr', 'variantAttr', 'description', 'otherInfo']
export default {
  name: 'LmsWalmartAddListing',
  components: {
    collapseTitle,
    baseInfo,
    categoryAttr,
    variantAttr,
    description
  },
  props: {
    id: String,
    itemId: Number
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
      activeNames: activeNames(),
      platformCode: 'MW',
      baseProductInfo: {},
      listingType: '',
      labelWidth: '150px'
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
    if (this.isEdit) this.getWalmartListingDetail()
  },
  methods: {
    // 输入sku 获取类型
    getSkuType(code) {
      const sku = code ? code.trim() : ''
      if (this.baseProductInfo.productSku === sku && !this.isEdit) return false
      this.baseProductInfo.sku = sku
      getTypeByProductCodes([sku]).then(res => {
        if (res.data && res.data.length) {
          const { type } = res.data[0]
          const types = ['Variation', 'Normal', 'Combo']
          this.listingType = types[Number(type) - 1]
          this.getSkuDetail(sku)
        } else {
          this.$message.error('请输入正确的sku编码')
        }
      })
    },
    // 选择产品sku弹窗
    selectSkuModal() {
      this.$modal({
        title: '选择产品',
        component: selectSkuModal,
        width: '1000px',
        data: {
          platformCode: this.platformCode,
          account: this.baseProductInfo.storeCode
        },
        callback: (row) => {
          if (row) {
            const type = ['Variation', 'Normal', 'Combo']
            this.listingType = type[row.type - 1]
            this.getSkuDetail(row.productSku)
          }
        }
      })
    },
    // 创建时获取SKU详细信息
    getSkuDetail(productSku) {
      if (this.baseProductInfo.productSku === productSku && !this.isEdit) return false
      const { platformCode, storeCode } = this.baseProductInfo
      this.getSkuDetailAjax(platformCode, productSku, storeCode).then(res => {
        let data = res
        if (this.isEdit) { // 编辑回显产品类目
          this.baseProductInfo = deepClone(Object.assign({}, this.baseProductInfo, { productCatePath: data.categoryPath }))
          return
        }
        data = Object.assign(data, {
          productCategoryId: data.categoryId, // 产品类目id
          productCatePath: data.categoryPath, // 产品类目树
          description: data.descriptionHtml,
          shippingWeight: addListingHandle.weightUnit(data.packWeight), // 打包重
          listingType: this.listingType,
          name: addListingHandle.formatStr(data.productNameEn) // 标题
        })
        delete data.categoryId
        if (this.isVariation && this.hasSku) {
          data.skuList = data.lstSku.map(item => {
            item.imageInfo = data.imageInfo // 所有主sku图片
            addListingHandle.dealImage(item)
            item.swatchImgList = item.imgShowList // swatch图
            item.shippingWeight = addListingHandle.weightUnit(item.packWeight) // 打包重
            item.productSkuShow = `${item.productSku} - ${item.nwSku}`
            return item
          })
        } else {
          data.skuList = null
          addListingHandle.dealImage(data)
          data.swatchImgList = data.imgShowList // swatch图
          // 组合sku的子sku
          data.combineSku = data.lstSkuCode
        }
        this.isVariation ? data.skuList.forEach(item => addListingHandle.initMultiAttr(item)) : addListingHandle.initMultiAttr(data)
        this.baseProductInfo = deepClone(Object.assign({}, this.baseProductInfo, data))
        this.$refs.baseInfo.getPlatformCateId(this.baseProductInfo.productCategoryId, true)
      })
    },
    // 获取SKU详细信息api
    getSkuDetailAjax(platformCode, productSku, storeCode) {
      return new Promise((resolve, reject) => {
        const request = this.isVariation ? getSpuDetailByProduct : getSkuDetailByProduct
        this.productLoading++
        request({ data: { lstProductSku: [productSku], platformCode, storeCode } }).then(res => {
          if (res.data && res.data[0]) {
            this.hasSku = true
            const data = res.data[0]
            const type = ['Variation', 'Normal', 'Combo']
            this.listingType = this.isVariation ? type[0] : type[data.type - 1]
            if (this.isVariation) {
              // 成本 = 成本 * 折扣比例
              data.lstSku.forEach(item => {
                setProductCost(item)
                item.costPrice = item.productCost
                item.upc = ''
              })
            } else {
              setProductCost(data)
            }
            data.productCatePath = data.categoryPath
            data.costPrice = data.productCost
            data.upc = ''
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
    // 切换类目
    updateCategoryId(data, isEditInit) {
      this.baseProductInfo = Object.assign(this.baseProductInfo, data)
      this.$refs.categoryAttr.getCateogAttr(data.categoryName, '', isEditInit)
    },
    // 更新利润率
    updateRate(saleProfitRate) {
      this.baseProductInfo = Object.assign(this.baseProductInfo, { saleProfitRate })
    },
    // 切换店铺 ->
    updateAccount(data) {
      this.baseProductInfo = Object.assign(this.baseProductInfo, data)
      // 清空产品信息,平台类目
      this.baseProductInfo.name = ''
      this.baseProductInfo.categoryId = '' // 平台类目id
      this.baseProductInfo.productCatePath = ''
      this.baseProductInfo.productCategoryId = ''
      this.baseProductInfo.saleProfitRate = ''
      this.baseProductInfo.productSku = '' // 清空产品sku，方便variantAttr，description,otherInfo重置
      this.baseProductInfo.warehouseId = ''
      this.$nextTick(() => {
        this.$refs.baseInfo.form.warehouseId = ''
        this.$refs.baseInfo.form.categoryId = ''
        this.$refs.baseInfo.primaryCatePath = ''
        this.$refs.categoryAttr.getCateogAttr(data.categoryName, '')
      })
    },
    // 切换仓库
    upateWarehouse(data) {
      this.baseProductInfo = Object.assign({}, this.baseProductInfo, data)
    },
    getVarAttr(varAttr, varAttrHead, varChild, isEditInit) {
      this.$refs.variantAttr.getVarAttr(varAttr, varAttrHead, varChild, isEditInit)
    },
    // 表单验证
    saveHandleVerif() {
      // const variantDTOS = this.$refs.variantAttr.getSkuValue()
      // console.log('variantDTOS: ', variantDTOS)

      const refs = this.$refs
      let validStatu = true
      const vaildes = ['baseInfo', 'categoryAttr', 'variantAttr', 'description']
      for (const item of vaildes) {
        refs[item].$refs.form.validate(valid => {
          !valid && (validStatu = false)
        })
      }
      if (!validStatu) {
        this.$message.error('请根据提示完成表单')
        this.activeNames = activeNames()
        return false
      }
      this.saveHandle(refs)
    },
    saveHandle(refs) {
      const { productAttributes, variantAttributes } = refs.categoryAttr.getPropertyValue() // 类目属性
      const { description, keyFeatures } = refs.description.form // 描述，关键词
      const variantDTOS = this.$refs.variantAttr.getSkuValue()
      variantDTOS.forEach(item => {
        const { extendDTO } = item
        if (!extendDTO) item.extendDTO = {}
        item.extendDTO.description = description
        item.extendDTO.keyFeatures = keyFeatures
        item.extendDTO.productAttributes = JSON.stringify(productAttributes)
        item.extendDTO.variantAttributes = JSON.stringify({ ...item.extendDTO.variantAttributes, ...variantAttributes })
      })
      const { account, accountCode, listingType, listingStatus, name } = refs.baseInfo.form
      const { productSku, sellerSku, site, categoryName, category, warehouseId, isOverseasWarehouses } = this.baseProductInfo

      const params = {
        account,
        accountCode,
        listingType,
        listingStatus,
        name,
        sellerSku,
        productSpu: productSku,
        site,
        category: categoryName || category,
        overseasWarehouses: warehouseId || 'Z20',
        isOverseasWarehouses: isOverseasWarehouses || false,
        mainImage: variantDTOS[0].imageUrl, // 主图
        isAutoProductId: !variantDTOS[0].upc, // 是否从号码池获取产品ID
        id: this.id,
        isFbwordConfirmed: false,
        variantDTOS,
        fbwordConfirm: false
      }
      // console.log('baseInfo', refs.baseInfo.form)
      // sellerSku 编辑需传（从列表获取），编辑变体表格无操作按钮一列
      // console.log('params: ', params)
      this.saveLoading = true
      this.saveAjax(params)
    },
    saveAjax(params) {
      (this.isEdit ? walmartListingUpdate : walmartListingSave)(params).then(res => {
        if (res.code === 201) {
          this.$modal({
            title: '提示',
            component: fbwordConfirm,
            padding: '30px',
            minHeight: '150px',
            width: '550px',
            data: {
              message: res.msg
            },
            callback: (valid) => {
              if (valid) {
                this.saveAjax({ ...params, fbwordConfirm: true })
              }
            }
          })
        } else if (res.code === 200) {
          this.$message.success('操作成功')
          this.$emit('close', true)
        } else {
          this.$message.error(res.msg || '未知错误')
        }
      }).finally(() => {
        this.saveLoading = false
      })
    },
    // 一键翻译 翻译字段：描述、Key Features、标题、产品属性、变体属性
    getTranslate() {
      addListingHandle.getTranslateHandle(this, this.countryCode, this.translate)
    },
    // 编辑时，获取listing详情
    getWalmartListingDetail() {
      this.productLoading++
      getWalmartDetail({ id: this.id }).then(res => {
        const data = res.data
        data.name = addListingHandle.formatStr(data.name)
        if (!data) {
          this.$message.error(res.msg || '暂无数据')
          return false
        }
        this.listingType = data.listingType
        // 获取pms详情信息
        this.getSkuDetailAjax('WM', data.productSpu, data.accountCode).then(rs => {
          const lstSku = rs.lstSku || [rs]
          lstSku.forEach(item => {
            item.productSkuShow = `${item.productSku} - ${item.nwSku}`
          })
          // 描述、关键字
          const description = data.variants[0].extendVO.description || ''
          const keyFeatures = data.variants[0].extendVO.keyFeatures || ''
          data.variants.forEach((item, i) => {
            item.extendVO.variantAttributes = JSON.parse(item.extendVO.variantAttributes)
            // 图片
            item.mainImage = data.variants[i].imageUrl // 主图
            item.extraImagList = JSON.parse(data.variants[i].extendVO.imageUrls) // 副图
            item.imgShowList = addListingHandle.showListingDetailImage(item)
            addListingHandle.showSwatchImage(item) // swatch图列表
            // 多属性
            item.multiAttr = addListingHandle.attrFilter(item.multiAttr)
            // online 重量，成本回显
            const index = lstSku.findIndex(ls => ls.productSku === item.productSku)
            if (index !== -1) {
              setProductCost(lstSku[index])
              item.costPrice = lstSku[index].productCost
              item.shippingWeight = addListingHandle.weightUnit(lstSku[index].packWeight)
              // sku标题
              item.productName = lstSku[index].productName
            }
          })
          this.baseProductInfo = {
            ...data,
            lstSku: rs.lstSku, // pms 子sku列表
            productCatePath: rs.categoryPath,
            categoryPathByDetail: data.categoryPath,
            productSku: data.productSpu,
            skuList: data.variants, // 刊登详情
            description,
            keyFeatures: keyFeatures ? JSON.parse(keyFeatures) : [],
            platformCode: 'WM',
            sellerSku: data.variants[0].sellerSku,
            isOverseasWarehouses: !!Number(data.isOverseasWarehouses),
            combineSku: rs.lstSkuCode
          }
          // 产品普通属性
          const { productAttributes, variantAttributes } = data.variants[0].extendVO
          const attributes = {
            normal: {},
            variant: {}
          }
          productAttributes && (attributes.normal = JSON.parse(productAttributes))
          variantAttributes && (attributes.variant = variantAttributes)
          this.$refs.categoryAttr.getCateogAttr(data.category, attributes, true)
        })
      }).finally(() => {
        this.productLoading--
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-linsting-walmart{
  padding: 0 10px 30px 10px;
  ::v-deep .avue-group__title {
    font-size: 14px;
    font-weight: 400;
  }
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
