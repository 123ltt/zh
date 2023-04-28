<template>
  <basic-container class="ps-3 pb-5">
    <el-collapse v-model="activeNames">
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
                     @productLoadingStart="productLoading++"
                     @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item name="description">
        <collapse-title slot="title" title="描述" />
        <description ref="description"
                     v-bind="{ labelWidth, productLoading, baseProductInfo, isEdit}"
        />
      </el-collapse-item>
      <el-collapse-item name="otherInfo">
        <collapse-title slot="title" title="其他信息" />
        <otherInfo ref="otherInfo"
                   v-bind="{ productLoading, labelWidth, baseProductInfo, isVariation, isEdit }"
                   @updateSite="updateSite"
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
        <el-button v-if="permission.lz_translate" type="primary" :disabled="!countryCode || productLoading > 0 || saveLoading" :loading="translate.loading" @click="getTranslate">一键翻译</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import baseInfo from './components/baseInfo.vue'
import categoryAttr from './components/categoryAttr.vue'
import variantAttr from './components/variantAttr.vue'
import otherInfo from './components/otherInfo.vue'
import collapseTitle from '@/views/components/collapseTitle.vue'
import selectSkuModal from '@/views/components/selectSkuModal/selectSkuModal.vue'
import description from './components/description.vue'
import fbwordConfirm from '@/views/components/fbwordConfirm.vue'
import { getSkuDetailByProduct, getSpuDetailByProduct, getTypeByProductCodes } from '@/api/pms.js'
import * as addListingHandle from './components/addListing.handle.js'
import { setProductCost } from '@/views/components/utils.js'
import { lazadaListingSave, lazadaListingUpdate, getLazadaDetail, checkSkuRepeat } from '@/api/lazada/lazada'
import { mapGetters } from 'vuex'
const activeNames = () => ['baseInfo', 'categoryAttr', 'variantAttr', 'description', 'otherInfo']

export default {
  name: 'LmsShopeeAddListing',
  components: {
    collapseTitle,
    baseInfo,
    categoryAttr,
    variantAttr,
    description,
    otherInfo
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
      platformCode: 'LZ',
      baseProductInfo: {},
      listingType: '',
      labelWidth: '150px',
      site: 'MY'
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
    },
    ...mapGetters(['userInfo', 'permission'])
  },
  created() {
    if (this.isEdit) this.getLazadaListingDetail()
  },
  methods: {
    // 输入sku 获取类型
    getSkuType(code) {
      const sku = code ? code.trim() : ''
      if (this.baseProductInfo.productSku === sku && !this.isEdit) return false
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
    // sku重复性校验
    checkSkuRepeat() {
      const { listingStatus, storeCode, siteArr, productSku, lstSku } = this.baseProductInfo
      const siteList = Object.keys(addListingHandle.siteList)
      const productSkuList = this.isVariation ? lstSku.map(item => item.productSku) : [productSku]
      const publishSiteCode = siteArr ? siteArr.join() : siteList.join()
      const params = {
        listingId: this.id,
        listingStatus,
        productSkuList,
        publishSiteCode,
        storeCode
      }
      checkSkuRepeat(params).then(res => {
        const data = res.data
        const repeatSku = []
        for (const key in data) {
          if (data[key]) {
            repeatSku.push(key)
          }
        }
        if (repeatSku.length) {
          this.$message({
            showClose: true,
            message: `同店铺下的listing中sku不能重复，重复sku为${repeatSku.join(' , ')}`,
            type: 'error',
            duration: 5000
          })
          if (this.isVariation) {
            lstSku.forEach(item => {
              if (repeatSku.includes(item.productSku)) item.disabled = true
            })
            this.baseProductInfo = deepClone(Object.assign({}, this.baseProductInfo, { lstSku }))
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
          productWeight: addListingHandle.fixed2(data.packWeight), // 打包重
          listingType: this.listingType,
          name: data.productNameEn // 标题
        })
        delete data.categoryId
        if (this.isVariation && this.hasSku) {
          data.skuList = data.lstSku.map(item => {
            item.imageInfo = data.imageInfo
            item.productWeight = addListingHandle.fixed2(item.packWeight)
            item.productSkuShow = `${item.nwSku} - ${item.productSku}`
            addListingHandle.dealImage(item)
            return item
          })
        } else {
          data.skuList = null
          addListingHandle.dealImage(data)
          // 组合sku的子sku
          data.combineSku = data.lstSkuCode
        }
        this.baseProductInfo = deepClone(Object.assign({}, this.baseProductInfo, data))
        this.$refs.baseInfo.getPlatformCateId('isNewSku', this.baseProductInfo.productCategoryId) // 选择sku，带出标题
        this.checkSkuRepeat()
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
              data.lstSku.forEach(item => setProductCost(item))
            } else {
              setProductCost(data)
            }
            data.productCatePath = data.categoryPath
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
    // 修改刊登站点
    updateSite(data, currSite, isChecked) {
      this.$refs.variantAttr.siteArr = data
      this.baseProductInfo.siteArr = data
      this.setBaseListProfitRate(data.saleProfitRate)
      this.$refs.variantAttr.setPrice(this.baseProductInfo.saleProfitRate, 'updateSite', currSite, isChecked)
    },
    // 切换类目
    updateCategoryId(data, init) {
      this.baseProductInfo = Object.assign({}, this.baseProductInfo, data)
      // this.$refs.variantAttr.setProfitRate(data.saleProfitRate)
      !init && data.cateProfitRate && this.setBaseListProfitRate(data.saleProfitRate)
      !init && data.cateProfitRate && this.$refs.variantAttr.setPrice(this.baseProductInfo.saleProfitRate, 'updateCategoryId')
      !init && this.$refs.categoryAttr.getCateogAttr(data.categoryId, '', this.site)
    },
    setBaseListProfitRate(profitRate) {
      const siteList = Object.keys(addListingHandle.siteList)
      this.baseProductInfo.skuList && this.baseProductInfo.skuList.forEach(item => {
        item.profitRate = profitRate
        item.price = ''
        item.specialPrice = ''
        // 同步站点所属利润
        siteList.forEach(site => {
          item[`${site.toLocaleLowerCase()}ProfitRate`] = item.profitRate
          item[`${site.toLocaleLowerCase()}RetailPrice`] = '' // 售价
          item[`${site.toLocaleLowerCase()}SalesPrice`] = '' // 促销价
        })
      })
    },
    // 切换店铺 ->
    updateAccount(data) {
      this.baseProductInfo = Object.assign(this.baseProductInfo, data)
      if (!this.isEdit) { // 创建时，切换店铺
        // 清空产品信息,平台类目
        this.baseProductInfo.name = ''
        this.baseProductInfo.categoryId = '' // 平台类目id
        this.baseProductInfo.productCatePath = ''
        this.baseProductInfo.productCategoryId = ''
        this.baseProductInfo.saleProfitRate = ''
        this.baseProductInfo.productSku = '' // 清空产品sku，方便variantAttr，description,otherInfo重置
        this.$refs.baseInfo.form.categoryId = ''
        this.$refs.baseInfo.primaryCatePath = ''
        this.$refs.categoryAttr.getCateogAttr(data.categoryId, '', this.site)
      }
    },
    getVarAttr(list) {
      this.$refs.variantAttr.getVarAttr(list)
    },
    func(arr, site, item) {
      const skus = arr.map(item => item.productSku).join(' , ')
      return this.$message({
        showClose: true,
        message: `SKU为 ${skus} 的价格不满足${site}站点限价区间：${item.priceRange} ${item.currency}`,
        type: 'error',
        duration: 5000
      })
    },
    // 表单验证
    async saveHandleVerif() {
      // const lazadaProductSkuDTOList = this.$refs.variantAttr.getSkuValue()
      // console.log('lazadaProductSkuDTOList: ', lazadaProductSkuDTOList)
      const refs = this.$refs
      let validStatu = true
      await refs.baseInfo.$refs.form.validate(valid => !valid && (validStatu = false))
      await refs.categoryAttr.$refs.form.validate(valid => !valid && (validStatu = false))
      await refs.description.$refs.form.validate(valid => !valid && (validStatu = false))
      await refs.variantAttr.$refs.form.validate(valid => !valid && (validStatu = false))
      await refs.otherInfo.$refs.form.validate(valid => !valid && (validStatu = false))
      if (!validStatu) {
        this.$message.error('请根据提示完成表单')
        this.activeNames = activeNames()
        return false
      }
      this.saveHandle(refs)
    },
    saveHandle(refs) {
      const attributes = refs.categoryAttr.getPropertyValue() // 类目属性
      const otherInfo = deepClone(refs.otherInfo.form) // 其他信息
      delete otherInfo.siteArr
      const { developLeadUserId, productSku } = this.baseProductInfo
      const lazadaProductSkuDTOList = refs.variantAttr.getSkuValue()
      // 校验sku站点限价
      const siteList = addListingHandle.siteList
      for (const key in siteList) {
        if (refs.otherInfo.form.siteArr.includes(key)) {
          const [start, end] = siteList[key].priceRange.split('-')
          const arr = lazadaProductSkuDTOList.filter(item => {
            const site = key.toLocaleLowerCase()
            return +item[`${site}RetailPrice`] < start || +item[`${site}RetailPrice`] > end || +item[`${site}SalesPrice`] < start || +item[`${site}SalesPrice`] > end
          })
          if (arr.length) {
            this.func(arr, key, siteList[key])
            return
          }
        }
      }
      const params = {
        ...refs.baseInfo.form, // 基本信息
        ...refs.description.form,
        ...otherInfo,
        attributes,
        site: refs.otherInfo.form.siteArr.join(','),
        id: this.id,
        developer: developLeadUserId,
        isFbwordConfirmed: false,
        saleUser: this.userInfo.user_id,
        spu: productSku,
        lazadaProductSkuDTOList
      }
      // 创建编辑 中文校验
      const errorList = [];
      [refs.baseInfo.form, { attributes }, refs.description.form, otherInfo, Object.assign({}, ...lazadaProductSkuDTOList.map((item, i) => ({ [`specifications${i}`]: item.specifications })))].forEach((item, i) => {
        for (const v in item) {
          if (/[\u4e00-\u9fa5]{1,}/.test(item[v])) {
            errorList.push(['基本信息-字段中包含中文', '属性-字段中包含中文', '描述—字段中包含中文', '其他信息-字段中包含中文', '价格及库存-字段中包含中文'][i])
            break
          }
        }
      })
      if (errorList.length) return this.$message.error(`${[...errorList]}`)
      // sellerSku 编辑需传（从列表获取），编辑时Pending QC 后显示单站点，编辑变体表格无操作按钮一列
      // console.log('params: ', params)
      this.saveAjax(params)
    },
    saveAjax(params) {
      (this.isEdit ? lazadaListingUpdate : lazadaListingSave)(params).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.$emit('close', true)
        } else if (res.code === 201) {
          // isFbwordConfirmed 需要违禁词二次确认提交, 否则直接提示errorMessage 或 直接提交成功
          this.$modal({
            title: '提示',
            component: fbwordConfirm,
            padding: '20px 20px 0',
            width: '550px',
            data: {
              message: res.msg
            },
            callback: (valid) => {
              if (valid) {
                this.saveAjax({ ...params, isFbwordConfirmed: true })
              }
            }
          })
        } else if (res.code === 202) {
          this.$confirm(res.msg, '警告', {
            showConfirmButton: false,
            cancelButtonText: '取消'
          })
        } else {
          this.$message.error(res.msg || '未知错误')
        }
      })
    },
    // 一键翻译 翻译字段：长短描述、标题、产品属性、变体属性、what's the box
    getTranslate() {
      addListingHandle.getTranslateHandle(this, this.countryCode, this.translate)
    },
    // 编辑时，获取listing详情
    getLazadaListingDetail() {
      this.productLoading++
      getLazadaDetail({ id: this.id }).then(res => {
        const data = res.data
        if (!data) {
          this.$message.error(res.msg || '暂无数据')
          return false
        }
        this.listingType = data.listingType
        // 获取pms详情信息
        this.getSkuDetailAjax('LZ', data.spu, data.storeCode).then(rs => {
          const lstSku = rs.lstSku || [rs]
          lstSku.forEach(item => {
            item.productSkuShow = `${item.nwSku} - ${item.productSku}`
            item.productWeight = addListingHandle.fixed2(item.packWeight)
          })
          // 描述
          const description = data.detail.description || ''
          const shortDescription = data.detail.shortDescription || ''

          // 促销时间
          let specialFromDate, specialToDate
          if (!data.specialFromDate) specialFromDate = data.skus[0]?.specialFromDate
          if (!data.specialToDate) specialToDate = data.skus[0]?.specialToDate
          const pic = addListingHandle.dealImage(rs)
          data.skus.forEach((item, i) => {
            // 图片
            item.mainImage = item.masterImage
            item.extraImagList = item.allImages ? JSON.parse(item.allImages).filter((item, i) => i > 0 && item) : []
            item.imgShowList = addListingHandle.showListingDetailImage(item)
            // 将未选择的图片也展示在编辑页
            item.imgShowList.push(...pic.filter(its => !JSON.parse(item.allImages).includes(its.imageUrl)))
            // online 重量，成本回显
            const index = lstSku.findIndex(ls => ls.productSku === item.productSku)
            if (index !== -1) {
              setProductCost(lstSku[index])
              item.productCost = lstSku[index].productCost
              item.netWeight = lstSku[index].netWeight
              item.productWeight = addListingHandle.fixed2(lstSku[index].packWeight)
              // sku标题
              item.productName = lstSku[index].productName
            }
            // 站点价格信息
            item[`${data.site.toLocaleLowerCase()}RetailPrice`] = item.price // 售价
            item[`${data.site.toLocaleLowerCase()}SalesPrice`] = item.specialPrice // 促销价
            item[`${data.site.toLocaleLowerCase()}ProfitRate`] = item.profitRate
          })
          this.baseProductInfo = {
            ...data,
            lstSku: rs.lstSku, // pms 子sku详情
            productCatePath: rs.categoryPath,
            categoryPathByDetail: data.categoryPath,
            productSku: data.spu,
            siteArr: data.site.split(','),
            skuList: data.skus, // 刊登详情
            description,
            shortDescription,
            specialFromDate,
            specialToDate,
            platformCode: 'LZ'
          }
          this.site = data.itemId ? data.site : 'MY'
          // 产品属性
          let attributes = {}
          data.detail.attributes && (attributes = JSON.parse(data.detail.attributes))
          this.$refs.categoryAttr.getCateogAttr(data.categoryId, attributes, this.site)
          // 获取店铺利润率
          this.$refs.baseInfo.changeAccount(data.storeName).then(res => {
            // 回显产品类目树和平台类目树
            this.$refs.baseInfo.findPrimaryCate(data.categoryId, data.storeName, data.listingStatus, this.site)
          })
          this.checkSkuRepeat()
        })
      }).finally(() => {
        this.productLoading--
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-collapse {
  border-top: 0;
  border-bottom: 0;
}
::v-deep .el-collapse-item__wrap, ::v-deep .el-collapse-item__header {
  border-bottom: 0;
  overflow: initial; // 富文本menu-tooltip被挡
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
