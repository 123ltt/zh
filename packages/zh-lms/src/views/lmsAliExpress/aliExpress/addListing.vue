<template>
  <basic-container>
    <el-collapse v-model="activeNames" class="add-linsting-box">
      <el-collapse-item v-loading="productLoading > 0" name="baseInfo">
        <collapse-title slot="title" title="基本信息" />
        <base-info ref="baseInfo"
                   v-bind="{ productLoading, baseProductInfo, isVariation, labelWidth, isEdit }"
                   @selectSkuModal="selectSkuModal"
                   @getSkuType="getSkuType"
                   @updateCategoryId="updateCategoryId"
                   @updateAccount="updateAccount"
                   @updateGroupId="updateGroupId"
                   @productLoadingStart="productLoading++"
                   @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="productLoading > 0" name="categoryAttr">
        <collapse-title slot="title" title="属性及图片" />
        <category-attr ref="categoryAttr"
                       v-bind="{ productLoading, labelWidth, baseProductInfo }"
                       @updateVarAttr="updateVarAttr"
                       @productLoadingStart="productLoading++"
                       @productLoadingEnd="productLoading--"
        />
        <setPicture ref="picture"
                    v-bind="{ productLoading, labelWidth, baseProductInfo }"
                    @productLoadingStart="productLoading++"
                    @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="productLoading > 0" name="price">
        <collapse-title slot="title" title="价格及库存" />
        <variantAttr ref="variantAttr"
                     v-bind="{ productLoading, labelWidth, baseProductInfo, isVariation, isEdit }"
                     @upateGrossWeight="upateGrossWeight"
                     @productLoadingStart="productLoading++"
                     @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="productLoading > 0" name="othInfo">
        <collapse-title slot="title" title="其它信息" />
        <otherInfo ref="otherInfo"
                   v-bind="{ productLoading, labelWidth, baseProductInfo, isEdit }"
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
                   @click="saveHandle"
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
import collapseTitle from './components/collapseTitle.vue'
import baseInfo from './components/baseInfo.vue'
import categoryAttr from './components/categoryAttr.vue'
import setPicture from './components/picture/picture.vue'
import variantAttr from './components/variantAttr.vue'
import otherInfo from './components/otherInfo.vue'
import selectSkuModal from '@/views/components/selectSkuModal/selectSkuModal.vue'
import fbwordConfirm from '@/views/components/fbwordConfirm.vue'
import { getSkuDetailByProduct, getSpuDetailByProduct, getTypeByProductCodes } from '@/api/pms.js'
import * as Api from '@/api/aliExpress/aliexpress.js'
import * as addListingHandle from './components/aliExpress.handle.js'
import { getShortStoreByCode } from '@/api/sams.js'
import { setProductCost } from '@/views/components/utils.js'
const activeNames = () => ['baseInfo', 'categoryAttr', 'price', 'othInfo']
export default {
  name: 'LmsAliExpressAddListing',
  components: {
    collapseTitle,
    baseInfo,
    categoryAttr,
    setPicture,
    variantAttr,
    otherInfo
  },
  props: {
    id: String,
    itemId: Number
  },
  data() {
    return {
      activeNames: activeNames(), // 折叠面板默认展开
      productLoading: 0,
      saveLoading: false,
      baseProductInfo: {},
      platformCode: 'SM',
      listingType: '',
      labelWidth: '150px',
      translate: { loading: false },
      countryCode: '',
      languages: [{ value: 'en', name: '英语' }]
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
      this.getAliexpresslisting()
    }
  },
  methods: {
    // 获取listing详情
    getAliexpresslisting() {
      this.productLoading++
      Api.getAliexpressListingDetail({ id: this.id }).then(res => {
        const data = res.data
        if (!data) {
          this.$message.error(res.msg)
        }
        this.listingType = data.listingType
        const { categoryId, account, accountCode, productSpu, imageUrls, marketImages, property } = data
        const detailInfo = addListingHandle.detailToJson(data) // 描述转json
        data.imgShowList = addListingHandle.showListingDetailImage(imageUrls).imgShowList
        data.imgShowMarketList = addListingHandle.showListingDetailMarketImage(marketImages)
        const { skuProperty } = data
        this.$refs.categoryAttr.getCateogAttr(categoryId, account, property).then(r => {
          if (typeof r === 'string') {
            this.$message.error(r || '未知错误')
            return false
          }
          this.getSkuDetailAjax(productSpu, accountCode).then(rs => {
            // 获取店铺等级 站点id
            this.productLoading++
            getShortStoreByCode(data.accountCode).then(store => {
              addListingHandle.dealEditSkuImage(rs, data)
              data.variants.forEach(item => {
                item.logisticsInfo = item.logisticsInfoJson ? JSON.parse(item.logisticsInfoJson) : ''
                if (this.isVariation) {
                  const i = rs.lstSku.findIndex(s => s.productSku === item.productSku)
                  if (i > -1) {
                    const { costPrice, packWeight, productName, productSkuShow } = rs.lstSku[i]
                    item.costPrice = costPrice
                    item.packWeight = packWeight
                    item.productName = productName
                    item.productSkuShow = productSkuShow
                  }
                } else {
                  item.costPrice = rs.costPrice
                  item.packWeight = rs.packWeight
                  item.productName = rs.productName
                  item.productSkuShow = rs.productSkuShow
                }
              })
              if (this.isVariation && this.hasSku) {
                data.skuList = rs.lstSku.map(item => {
                  // addListingHandle.dealImage(item)
                  return item
                })
              }
              this.baseProductInfo = Object.assign({}, data, detailInfo, {
                combineSku: this.isVariation ? undefined : rs.lstSkuCode,
                property: skuProperty,
                productCatePath: rs.categoryPath,
                productUnit: String(data.productUnit),
                packageType: String(data.packageType),
                developUser: rs.developLeadUserId,
                costPrice: rs.costPrice,
                packWeight: rs.packWeight,
                sizeLongPack: rs.sizeLongPack,
                sizeWidthPack: rs.sizeWidthPack,
                sizeHeightPack: rs.sizeHeightPack,
                descriptionPlain: rs.descriptionPlain,
                descriptionHtml: rs.descriptionHtml,
                accountGrossProfit: store.data.publishGrossProfitRate
              })
              // 回显产品类目树和平台类目树
              this.$refs.baseInfo.findPrimaryCate({ target: { value: categoryId } }, 'init')
              this.$refs.variantAttr.getAllPriceAdjustTemplate(account, 'init') // 区域调价模板
            }).finally(_ => {
              this.productLoading--
            })
          })
        })
        this.updateHandleByAccount(account, accountCode)
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
          platformCode: this.platformCode,
          account: this.baseProductInfo.account
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
    // 输入sku 获取类型
    getSkuType(code) {
      const sku = code ? code.trim() : ''
      if (this.baseProductInfo.productSpu === sku && !this.isEdit) return false
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
    // 创建时获取SKU详细信息
    getSkuDetail(productSku) {
      if (this.baseProductInfo.productSpu === productSku) return false
      const { accountCode } = this.baseProductInfo
      this.productLoading++
      this.getSkuDetailAjax(productSku, accountCode).then(res => {
        let data = res
        data = Object.assign(data, {
          productCategoryId: data.categoryId,
          productCatePath: data.categoryPath,
          firstCategory: data.rootCategoryId,
          listingType: this.listingType,
          subject: data.productNameEn,
          // packageLength: data.sizeLongPack,
          // packageWidth: data.sizeWidthPack,
          // packageHeight: data.sizeHeightPack,
          // grossWeight: data.packWeight,
          reduceStrategy: 'place_order_withhold',
          productUnit: '100000015', // 最小计量单位
          packageType: 'false', // 销售方式
          deliveryTime: 4,
          developUser: data.developLeadUserId,
          lstAttrHead: [{ name: 'Varition attributes' }],
          productName: data.productName
        })
        delete data.categoryId
        if (this.isVariation && this.hasSku) {
          data.skuList = data.lstSku.map(item => {
            addListingHandle.dealImage(item)
            return item
          })
        } else {
          // 组合sku的子sku
          data.combineSku = data.lstSkuCode
        }
        data.imgShowMarketList = addListingHandle.showListingDetailMarketImage()
        addListingHandle.dealImage(data)
        this.baseProductInfo = deepClone(Object.assign(this.baseProductInfo, data))
      }).finally(_ => {
        this.productLoading--
      })
    },
    // 获取SKU详细信息api
    getSkuDetailAjax(productSku, storeCode, siteCode) {
      return new Promise((resolve, reject) => {
        const request = this.isVariation ? getSpuDetailByProduct : getSkuDetailByProduct
        this.productLoading++
        request({ data: { lstProductSku: [productSku], platformCode: this.platformCode, storeCode, siteCode } }).then(res => {
          if (res.data && res.data[0]) {
            this.hasSku = true
            const data = res.data[0]
            const type = ['Variation', 'Normal', 'Combo']
            this.listingType = this.isVariation ? type[0] : type[data.type - 1]
            if (this.listingType !== 'Variation') {
              data.productSpu = data.productSku
            }
            if (this.isVariation) {
              // 成本 = 成本 * 折扣比例
              data.lstSku.forEach(item => {
                setProductCost(item)
                item.packWeight = addListingHandle.weightKg(item.packWeight)
                item.costPrice = item.productCost
                item.productSkuShow = `${item.nwSku} - ${item.productSku}`
              })
            } else {
              setProductCost(data)
              data.packWeight = addListingHandle.weightKg(data.packWeight)
              data.costPrice = data.productCost
              data.productSkuShow = `${data.nwSku} - ${data.productSku}`
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
    // 切换类目
    updateCategoryId(data, init) {
      const { categoryId, account } = data
      this.baseProductInfo = Object.assign(this.baseProductInfo, data)
      !init && this.$refs.categoryAttr.getCateogAttr(categoryId, account)
    },
    updateAccount(data) {
      const { account, accountCode } = data
      this.baseProductInfo = Object.assign(this.baseProductInfo, { ...data, imgShowList: [] })
      this.$refs.categoryAttr.clearAttr()
      this.$refs.picture.reset()
      this.updateHandleByAccount(account, accountCode)
      this.$refs.variantAttr.getAllPriceAdjustTemplate(account) // 区域调价模板
    },
    updateGroupId(groupId) {
      this.baseProductInfo = Object.assign(this.baseProductInfo, { groupId })
    },
    updateHandleByAccount(account, accountCode) {
      this.$refs.baseInfo.getProductGroup(account) // 产品分组
      this.$refs.otherInfo.getFreightTemp(account, accountCode) // 运费模板
      this.$refs.otherInfo.getProductTempList(account) // 产品模板
    },
    updateVarAttr(list) {
      this.$refs.variantAttr.updateVarAttr(list)
    },
    // 最大重量更新
    upateGrossWeight(data) {
      this.baseProductInfo = Object.assign({}, this.baseProductInfo, data)
    },
    // 保存事件
    saveHandle() {
      // 表单验证
      const refs = this.$refs
      let validStatu = true
      const vaildes = ['baseInfo', 'categoryAttr', 'picture', 'variantAttr', 'otherInfo']
      for (const item of vaildes) {
        refs[item].$refs.form.validate(valid => {
          if (!valid) {
            validStatu = false
          }
        })
      }
      console.log('validStatu', validStatu)
      if (!validStatu) {
        this.$message.error('请根据提示完成表单')
        this.activeNames = activeNames()
        return false
      }
      // const { itemId } = this.baseProductInfo
      const params = Object.assign({},
        refs.baseInfo.form,
        refs.otherInfo.form,
        refs.variantAttr.form,
        refs.picture.form,
        {
          detail: addListingHandle.detailToString(refs.otherInfo.form),
          property: refs.categoryAttr.getPropertyValue(),
          imageUrls: refs.picture.form.imageUrls.join(';'),
          variants: refs.variantAttr.getSkuValue(),
          fbwordConfirm: false
        }
      )
      params.packageHeight = +params.packageHeight
      params.packageLength = +params.packageLength
      params.packageWidth = +params.packageWidth
      params.groupId = params.groupId.length ? params.groupId[params.groupId.length - 1] : ''
      // 营销图片
      params.marketImages = params.marketImages.filter(item => {
        if (item.url && item.isCheck) { return item }
      })
      if (params.marketImages.length === 0) { params.marketImages = null }
      this.saveAjax(params)
    },
    saveAjax(params) {
      const request = this.isEdit ? Api.aliexpressListingUpdate : Api.aliexpressListingSave
      this.saveLoading = true
      request(params).then(res => {
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
    // 一键翻译 翻译字段：标题，属性，描述
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
}
::v-deep {
  .el-collapse-item__wrap, .el-collapse-item__header {
    border-bottom: 0;
  }
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
