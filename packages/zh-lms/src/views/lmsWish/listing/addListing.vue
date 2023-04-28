<template>
  <!-- 创建单个普通Listing -->
  <basic-container v-loading="productLoading > 0">
    <el-collapse v-model="activeNames" class="add-linsting-box">
      <el-collapse-item name="baseInfo">
        <collapse-title slot="title" title="基本信息" />
        <base-info ref="baseInfo"
                   v-bind="{isVariation,productLoading,baseProductInfo,isEdit}"
                   @updateAccount="updateAccount"
                   @getSkuDetail="getSkuType"
                   @productLoadingStart="productLoading++"
                   @productLoadingEnd="productLoading--"
                   @exportChangeStore="exportChangeStore"
        />
      </el-collapse-item>
      <el-collapse-item name="picture">
        <collapse-title slot="title" title="图片" />
        <pictureAttr ref="picture"
                     v-bind="{storeName:baseProductInfo.account,labelWidth, baseProductInfo,ossWaterShow:false,extraImgNum:20 }"
                     @productLoadingStart="productLoading++"
                     @productLoadingEnd="productLoading--"
        />
        <!-- <pictureAttr ref="picture"
                     v-bind="{ productLoading, labelWidth, baseProductInfo ,isEdit}"
                     @productLoadingStart="productLoading++"
                     @productLoadingEnd="productLoading--"
        /> -->
      </el-collapse-item>
      <el-collapse-item name="inventory">
        <collapse-title slot="title" title="库存及运输" />
        <inventory ref="inventory"
                   v-bind="{ labelWidth, productLoading, baseProductInfo, isVariation, isEdit,shippingTimeOption}"
                   @changeBaseProductInfo="changeBaseProductInfo"
                   @productLoadingStart="productLoading++"
                   @productLoadingEnd="productLoading--"
        />
      </el-collapse-item>
      <el-collapse-item v-if="baseProductInfo.listingType ==='Variation'" name="variantAttr">
        <collapse-title slot="title" title="多属性" />
        <variantAttr ref="variantAttr"
                     v-bind="{isVariation, labelWidth, productLoading, baseProductInfo, isVariation, isEdit,itemId,totalSku,auditTabActiveName}"
                     @productLoadingStart="productLoading++"
                     @productLoadingEnd="productLoading--"
                     @getSkuDetail="getSkuDetail"
        />
      </el-collapse-item>
    </el-collapse>
    <div class="affix isFixed">
      <div class="bottom-btn">
        <el-button @click="$emit('close', false)">取消</el-button>
        <el-button type="primary" :disabled="productLoading > 0 || translate.loading || disabledSave" @click="saveHandle">保存</el-button>
        <el-select v-model="countryCode" filterable placeholder="请选择翻译语种">
          <el-option v-for="item in languages" :key="item.value" :label="item.name" :value="item.value" :title="item.name" />
        </el-select>
        <el-button type="primary" :disabled="!countryCode || productLoading > 0 " :loading="translate.loading" @click="getTranslate">一键翻译</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import baseInfo from './components/baseInfo.vue'
import collapseTitle from './components/collapseTitle.vue'
import pictureAttr from '../../components/picture/picture.vue'
import variantAttr from './components/variantAttr.vue'
import inventory from './components/inventory.vue'
import * as wishHandle from './components/wish.handle.js'
import { addDraft, updateListing, wishDetail, shippableCountriesList, draftUpdate } from '@/api/wish/wish.js'
import {
  optionsWithPlatformCode,
  getSkuDetailByProduct,
  getSpuDetailByProduct
} from '@/api/amazon/amazon.js'
import { getTypeByProductCodes } from '@/api/pms.js'
export default {
  name: 'LmsLmsWishListingAddListing',
  components: { baseInfo, collapseTitle, pictureAttr, inventory, variantAttr },
  props: {
    id: { // 列表id
      type: String
    },
    itemId: { // 平台 产品的唯一编号
      type: String,
      default: ''
    },
    auditTabActiveName: { // 状态
      type: String
    }
  },
  data() {
    return {
      productLoading: 0,
      labelWidth: '150px',
      languages: wishHandle.languages,
      // 当前翻译语言
      countryCode: '',
      // 翻译状态
      translate: { loading: false },
      disabledSave: false,
      // Listing类型 Variation Normal Combo
      listingType: '',
      baseProductInfo: {
        account: '', // 账号
        productSpu: '',
        listingType: '', // listing类型
        type: 'SELF_BUILT', // 本地仓库类型
        warehouseId: 'Z20', // 仓库编码
        warehouseName: '/本地仓', // 仓库名称
        localizedPrice: '', // 本地价格
        localizedShipping: null, // 本地运费
        price: '', // 价格
        keywords: '',
        tags: [],
        sku: '',
        totalSku: [], // 商品编码
        fbwordConfirm: false, // 是否违禁词
        shipping: null, // 运费
        costPrice: null, // 成本
        msrp: null, // msrp
        packageWeight: null, // 包裹重量
        profitRate: '', // 销售利润率
        variantList: null, // 多变体列表
        oldLocalizedShipping: '', // 老运费
        countryShippingList: [], // 初始化国家运费
        customerUser: '', // 客服
        accountOption: [] // 店铺列表
      },
      tableDataTemp: [], // 初始化国家运费 备份
      totalSku: null, // sku集合
      platformCode: 'WH',
      olineResData: null, // 记录在售详情，用于提交时对比
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'picture', 'inventory', 'variantAttr'],
      shippingTimeOption: ['5-10', '7-14', '10-15', '14-21', '21-28'],
      shippingValStatus: false, // 本地运费是否被修改
      images: []
    }
  },
  computed: {
    // 是否为多个子sku
    isVariation() {
      return this.baseProductInfo.listingType === 'Variation'
    },
    // 编辑时部分参数不可编辑
    isEdit() {
      return Boolean(this.id)
    },
    isSaveStatus() {
      return ['Draft', 'Upload Failed', 'Rejected'].includes(this.auditTabActiveName)
    },
    isOnline() {
      return this.auditTabActiveName === 'Online'
    }
  },
  mounted() {
    this.getAccountOption()
    this.id && this.getWishDetail()
  },
  methods: {
    // 输入sku 获取类型
    getSkuType(code) {
      const sku = code || ''
      if (this.baseProductInfo.sku === sku && !this.isEdit) return false
      this.baseProductInfo.sku = sku
      getTypeByProductCodes([sku]).then(res => {
        if (res.data && res.data.length) {
          const { type } = res.data[0]
          const types = ['Variation', 'Normal', 'Combo']
          const listingType = types[Number(type) - 1]
          this.getSkuDetail(sku, listingType)
        } else {
          this.$message.error('请输入正确的sku编码')
        }
      })
    },
    // edit 获取详情
    getWishDetail() {
      this.productLoading++
      wishDetail(this.id).then(res => {
        if (!res.data) {
          this.errorTips(res.msg)
        }
        const data = res.data
        // 处理图片列表
        const { imgShowList } = wishHandle.dealPic(data.mainImage, data.extraImages)
        this.images = []
        this.images = imgShowList
        data.wishListingVariantVOList.forEach(item => { item.isChangeEnabled = false })
        data.variantList = deepClone(data.wishListingVariantVOList)
        data.countryShippingList = data.countryShippingList || []
        data.tags = Array.isArray(data.tags) && data.tags.length ? data.tags.join(',').split(',') : data.tags
        data.packageWeight = data.packageWeight / 1000 // 最大包裹重量
        data.packWeightNum = 2 / data.packageWeight // 试算重量
        data.accountOption = this.baseProductInfo.accountOption

        this.baseProductInfo = Object.assign({}, { ...data })
        data.maxQuantity && this.$set(this.baseProductInfo, 'maxQuantity', data.maxQuantity)
        // 记录在售详情，用于提交时对比
        this.olineResData = deepClone(this.baseProductInfo)
        if (this.itemId) { // 在线
          this.olineResData.tags = data.tags.join()
          this.olineResData.extraImagList = data.extraImages
        }
        // 国家运费初始化
        data.localizedShipping && this.shippableCountriesList()
        // 获取sku 详情
        // if (!(data.productSpu || data.productSku) && data.wishListingVariantVOList) {
        const productSku = data.listingType === 'Variation' ? data.productSpu : data.productSku
        this.getSkuDetail(productSku, data.listingType)
        // }
        if (!data.countryShippingId) {
          this.$message.error('国家运费缺失，请在列表页选中此listing后，点击"从后台同步"按钮先同步')
          this.disabledSave = true
        }
      }).finally(() => {
        this.productLoading--
      })
    },
    // 更新数据
    changeBaseProductInfo(val) {
      let params = {
        ...this.$refs.baseInfo.form,
        ...this.$refs.picture.form,
        ...val
      }
      if (this.isVariation) {
        params = Object.assign({}, params, { ...this.$refs.variantAttr.form })
      }
      this.baseProductInfo = deepClone(Object.assign({}, this.baseProductInfo, { ...params }))
    },
    // 更新店铺
    updateAccount(data) {
      this.baseProductInfo = Object.assign({}, this.baseProductInfo, data)
      if (this.isVariation && !this.isEdit) this.$refs.variantAttr.changeStore() // 更新店铺时调用多属性组件的清空数据方法
      if (!this.isEdit) {
        // this.$refs.baseInfo.changeStore()
      }
    },
    // 改变店铺清空 图片组件&库存及运输组件数据（代码冗余可优化-后续优化）
    exportChangeStore(val) {
      if (val) {
        // this.$refs.picture.storeChange()
        this.$refs.inventory.storeChange()
      }
    },
    // 保存事件
    saveHandle() {
      // 表单验证
      this.productLoading++
      const refs = this.$refs
      let validStatu = true
      const vaildes = ['baseInfo', 'picture', 'inventory']
      for (const item of vaildes) {
        refs[item].$refs.form.validate(valid => {
          if (!valid) {
            validStatu = false
          }
        })
      }

      // refs.baseInfo.$refs.form.validate(valid => !valid && (validStatu = false))
      // refs.picture.$refs.form.validate(valid => !valid && (validStatu = false))
      // refs.inventory.$refs.form.validate(valid => !valid && (validStatu = false))
      if (this.isVariation) {
        refs.variantAttr.$refs.form.validate(valid => !valid && (validStatu = false))
      }
      if (!validStatu) {
        this.$message.error('请根据提示完成表单')
        this.productLoading--
        return false
      }
      const inventory = refs.inventory.$data.form
      // 时间区间如果不包含，则有两种情况；一种为空，另一种为则将start和end值拼凑起来
      if (!this.shippingTimeOption.includes(inventory.shippingTime)) {
        if (inventory.shippingTime) {
          if (inventory.shippingTimeStart && inventory.shippingTimeEnd) {
            refs.inventory.$data.form.shippingTime = `${inventory.shippingTimeStart}-${inventory.shippingTimeEnd}`
          } else {
            this.$message.error('运输时间区间不能为空')
            this.productLoading--
            return false
          }
        } else {
          refs.inventory.$data.form.shippingTime = inventory.shippingTime
        }
      }
      const main = []
      const vice = []
      refs.picture.imgShowList.forEach(item => {
        if (item.isPrime) {
          main.push(item.imageUrl)
        }
        if (item.isExtra) {
          vice.push(item.imageUrl)
        }
      })
      const images = [...main, ...vice]
      // const { mainImage, imgShowList } = refs.picture.$data.form
      const { packageWeight, packWeight, sellerSku, developUser, accountCode, costPrice, countryShippingId, countryShippingList, customerUser, shippingValStatus } = this.baseProductInfo
      // const extraImagLists = imgShowList.filter(item => item.isExtra === true).map(item => item.imageUrl)
      // const mainImges = mainImage || imgShowList.filter(item => item.isExtra === false).map(item => item.imageUrl)[0]
      let params = Object.assign({},
        refs.baseInfo.form,
        refs.inventory.form,
        refs.picture.form,
        {
          mainImage: main[0],
          extraImagList: vice,
          imgShowList: images,
          images: images,
          id: this.id,
          fbwordConfirm: false, // 违禁词
          sellerSku: sellerSku,
          developUser: developUser,
          accountCode: accountCode,
          costPrice: costPrice,
          customerUser: customerUser,
          countryShippingId: countryShippingId // 国家运费id
        }
      )
      // 包装重量 千克
      params.packageWeight = this.isVariation ? packageWeight * 1000 : packWeight
      delete params.tableDataTemp
      if (this.isVariation) {
        params = Object.assign({}, params, refs.variantAttr.form)
      }
      if (!this.isEdit) { // 新增
        params.variantList.forEach(item => {
          params.skuList.forEach(list => {
            if (item.productSku === list.productSku) {
              item.packageWeight = list.packWeight
            }
          })
        })
        if (shippingValStatus) { // 改过本地售价，没点过设置国家运费按钮 需要重新赋值
          params.countryShippingList = countryShippingList.map(item => {
            if (item.regions?.length) {
              item.regions.map(acc => { acc.localizedPrice = this.baseProductInfo.localizedShipping })
            }
            item.localizedPrice = this.baseProductInfo.localizedShipping
            return item
          })
        } else {
          params.countryShippingList = countryShippingList
        }
      } else { // 编辑
        // 国家运费
        params.countryShippingList = countryShippingList.filter(item => {
          if (item.regions?.length) {
            item.regionsList = []
            item.regions.forEach(citem => {
              item.regionsList.push({
                enabled: citem.enabled,
                localizedPrice: citem.localizedPrice,
                state: citem.state,
                stateCode: citem.stateCode,
                useCountryShipping: citem.useCountryShipping // 是否使用国家运费
              })
            })
          }
          return {
            countryCode: item.countryCode,
            enabled: item.enabled,
            localizedPrice: item.localizedPrice,
            state: item.state,
            stateCode: item.stateCode,
            regions: item.regions?.length ? item.regionsList : item.regions
          }
        })
        if (!this.isVariation) {
          params.variantList.forEach(item => {
            item.localizedPrice = params.localizedPrice
            item.inventory = params.inventory
            item.localizedShipping = params.localizedShipping
            item.shippingTime = params.shippingTime
            item.msrp = params.msrp
          })
        } else {
          params.variantList.forEach(item => {
            item.localizedShipping = params.localizedShipping
            item.shippingTime = params.shippingTime
            item.msrp = params.msrp
          })
        }
      }
      // 单属性值赋值给 variantAttr[0]
      if (!this.isVariation) {
        console.log('this.baseProductInf 单属性值赋值给', this.baseProductInfo)
        params.variantList = [{
          ...params.variantList[0],
          ...refs.inventory.form,
          localizedShipping: params.localizedShipping, // 本地运费
          localizedPrice: params.localizedPrice,
          profitRate: params.profitRate
        }]
      }
      if (this.itemId) { // 在线
        params.tags = this.isSaveStatus ? params.tags : params.tags.join()
        params.itemId = this.itemId
        const conkeys = ['localizedPrice', 'inventory', 'maxQuantity', 'msrp', 'shippingTime']
        params.disableVariant = []
        params.enableVariant = []
        params.variantList.forEach((item, i) => {
          item.isUpdate = false
          const variantList = this.olineResData.variantList[i]
          // 售价，库存  当前  isupdate true 多变体
          // 多变体 上面的 最大购买数  msrp 运输时间 ，每个sku都变为isupdate true
          // 最大购买数  msrp 运输时间 售价库存  单变体 isupdate true
          if (item.localizedPrice !== variantList?.localizedPrice) {
            item.isUpdate = true
          }
          if (Number(item.inventory) !== Number(variantList?.inventory)) {
            item.isUpdate = true
          }
          if (item.color !== variantList.color) {
            item.isUpdate = true
          }
          if (item.size !== variantList.size) {
            item.isUpdate = true
          }
          if (variantList?.isEnabled !== item.isEnabled) {
            if (variantList?.isEnabled) {
              params.disableVariant.push(item.sellerSku)
            } else {
              params.enableVariant.push(item.sellerSku)
            }
          }
        })
        conkeys.forEach(citem => {
          if (params[citem] !== this.olineResData[citem]) {
            params.variantList.forEach(item => { item.isUpdate = true })
          }
        })
        if (!this.isSaveStatus) { // 在线
          params.variantDTOS = params.variantList
          params.updateField = wishHandle.dealUpdateField(this.baseProductInfo.listingType, params, this.olineResData)
          delete params.variantList
          if (params.updateField.length) {
            this.saveAjax(params)
          } else {
            this.$message.error('未修改无需提交')
            this.productLoading--
          }
        } else {
          this.saveAjax(params)
        }
      } else {
        this.saveAjax(params)
      }
    },
    saveAjax(params) {
      if (this.id) {
        params.countryShippingId = this.baseProductInfo.countryShippingId
      }
      params.countryShippingList = params.countryShippingList.filter(item => {
        return item.enabled === true
      })
      let request = null
      if (this.isEdit) {
        request = this.itemId && !this.isSaveStatus ? updateListing : draftUpdate
      } else {
        request = addDraft
      }
      request(params).then(res => {
        if (res.code === 200) {
          const msg = this.isEdit ? '修改成功！' : '创建成功！'
          this.$message.success(msg)
          this.$emit('close', true)
        } else {
          if (res.code === 201) {
          // fbwordConfirm 需要违禁词二次确认提交, 否则直接提示errorMessage 或 直接提交成功
            this.$confirm(res.msg, '警告', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.saveAjax({ ...params, fbwordConfirm: true })
            })
          } else if (res.code === 202) {
            this.$confirm(res.msg, '警告', {
              showConfirmButton: false,
              cancelButtonText: '取消'
            })
          } else {
            this.$message.error(res.msg)
          }
        }
      }).finally(() => {
        this.productLoading--
      })
    },
    // 店铺列表
    getAccountOption() {
      optionsWithPlatformCode({ platformCode: 'WH' }).then(res => {
        this.baseProductInfo.accountOption = res.data
      })
    },
    // 获取sku/spu详情
    // 获取SKU详细信息api
    getSkuDetailAjax(productSku, storeCode, isVariationType) {
      return new Promise((resolve, reject) => {
        const request = isVariationType === 'Variation' ? getSpuDetailByProduct : getSkuDetailByProduct
        this.productLoading++
        request({ data: { lstProductSku: [productSku], platformCode: this.platformCode, storeCode } }).then(res => {
          if (res.data && res.data[0]) {
            this.hasSku = true
            const data = res.data[0]
            this.baseProductInfo.totalSku = data.lstSku
            if (data.listingType !== 'Variation') {
              data.productSpu = data.productSku
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
    // 获取sku/spu详情
    getSkuDetail(productSku, type) {
      // if (this.baseProductInfo.productSpu === productSku) return false
      const { accountCode, account } = this.baseProductInfo
      this.getSkuDetailAjax(productSku, accountCode, type).then(res => {
        let data = res
        // 取当前店铺的利润率
        const accountList = this.baseProductInfo.accountOption.find(item => item.displayName === account)
        const profitRate = this.id ? this.baseProductInfo.profitRate ?? accountList?.publishGrossProfitRate : accountList?.publishGrossProfitRate
        const packWeightKg = this.id ? Number(this.baseProductInfo.packWeight) / 1000 : Number(data.packWeight) / 1000 // 包装重量转换为千克
        const keywords = data.keywords.split(',', 10)
        data = Object.assign(data, {
          productCategoryId: data.categoryId,
          productCatePath: data.categoryPath,
          description: this.id ? this.baseProductInfo.description : data.descriptionPlain, // 描述
          // weight: data.netWeight,
          firstCategory: data.rootCategoryId,
          developUser: data.developLeadUserId, // 开发人员
          listingType: this.id ? this.baseProductInfo.listingType : type, // 类型
          keywords: data.keywords,
          costPrice: this.id ? this.baseProductInfo.costPrice : data.costPrice, // 成本
          tags: this.id ? this.baseProductInfo.tags : keywords, // 标签
          localizedShipping: this.id ? this.baseProductInfo.localizedShipping : '13', // 本地运费
          localizedPrice: this.id ? this.baseProductInfo.localizedPrice : '',
          profitRate: profitRate,
          countryShippingId: this.baseProductInfo.countryShippingId, // 运费id
          title: this.id ? this.baseProductInfo.title : data.productNameEn, // 标题
          totalSku: data.lstSku,
          packageWeight: packWeightKg, // 最大购买数
          packWeightNum: Number(2 / packWeightKg),
          maxQuantity: Math.floor(Number(2 / packWeightKg)) // 最大购买数 向下取整
        })
        delete data.categoryId
        if (data.listingType === 'Variation') { // 变体
          // 变体 取最大的包装重量，拿到最大的购买数
          const maxPackWeightList = [] // 最大的包装重量list
          data.skuList = data.lstSku.map(item => {
            item.productSkuShow = `${item.nwSku} - ${item.productSku}`
            if (item.productCost && item.discountRatio) {
              // 多变体 子sku 成本
              item.costPrice = parseFloat(item.productCost * item.discountRatio).toFixed(2)
            }
            // 处理spu下sku规格属性数据 （默认填入第一个规格属性值）
            maxPackWeightList.push(item.packWeight)
            item.listingSpecs = [{ value: item.lstAttrSpecification ? item.lstAttrSpecification.fieldValue : '' }]
            return item
          })
          // 最大的包装重量
          const maxPackWeight = Math.max(...maxPackWeightList)
          const maxPackWeightKg = maxPackWeight / 1000 // 最大的包装重量
          data.packageWeight = maxPackWeightKg
          data.packWeightNum = Number(2 / maxPackWeightKg)
          data.maxQuantity = Math.floor(Number(2 / maxPackWeightKg)) // 最大购买数 向下取整
        } else {
          // 组合sku的子sku
          data.combineSku = data.lstSkuCode
        }
        // 处理图片列表
        const lstImage = res.imageInfo[0]?.lstImage || []
        const imgUrls = []
        const imgShowListImgUrls = this.images.map(item => item.imageUrl)
        const newImgUrls = lstImage.filter(item => {
          if (!imgShowListImgUrls.includes(item.imageUrl)) {
            return item
          }
        })
        newImgUrls.filter(item => {
          imgUrls.push({
            isPrime: false,
            isExtra: false,
            imageUrl: item.imageUrl
          })
        })
        this.baseProductInfo.images = [...this.images, ...imgUrls]
        this.baseProductInfo = deepClone(Object.assign({}, this.baseProductInfo, data))
        this.baseProductInfo.profitRate = parseFloat(this.baseProductInfo.profitRate).toFixed(2)
        // 初始化国家运费
        this.baseProductInfo.localizedShipping && this.shippableCountriesList()
        // 新增 多变体默认出现一条空数据
        if (type === 'Variation' && !this.isEdit) { this.$nextTick(() => { this.$refs.variantAttr.changeMenApparelSize('', 'creat') }) }
        if (!this.id) {
          if (this.baseProductInfo.combineSku || this.baseProductInfo.skuList || this.baseProductInfo.productSku) {
            this.$nextTick(() => {
              this.$refs.inventory.getCalculatePrice()
            })
          }
        }
      }).finally(() => {
        // 初始化国家运费
        this.baseProductInfo.localizedShipping && this.shippableCountriesList()
      })
      if (type === 'Variation' && !this.isEdit && this.$refs.variantAttr?.changeStore) this.$refs.variantAttr.changeStore() // 更新店铺时调用多属性组件的清空数据方法
    },
    // 初始化国家运费
    shippableCountriesList() {
      shippableCountriesList().then(res => {
        let data = res.data
        const { localizedShipping, countryShippingList } = this.baseProductInfo
        if (this.isEdit && countryShippingList?.length) { // 编辑 国家运费初始化和详情的国家运费做对比，把详情里面的数据填充到初始化里面去
          data.forEach(item => { // 新
            item.cnNameCode = `${item.cnName}_${item.code}`
            item.enabled = false
            item.countryCode = item.code
            item.isExpand = false
            countryShippingList.filter(list => {
              if (item.regions?.length) {
                item.regions.forEach(ritem => { // 新
                  list.regions?.length && list.regions.forEach(rcitem => {
                    if (ritem.regionCode === rcitem.stateCode) { // 新
                      ritem.useCountryShipping = rcitem.useCountryShipping === null ? true : rcitem.useCountryShipping
                      ritem.enabled = rcitem.enabled
                      ritem.disabled = true
                      ritem.localizedPrice = rcitem.localizedPrice
                      ritem.stateCode = ritem.regionCode // 国家编码
                      ritem.isExpand = false
                    }
                  })
                })
              }
              if (item.code === list.countryCode) {
                item.cnNameCode = `${list.cnName}_${list.countryCode}`
                item.countryCode = list.countryCode
                item.enabled = list.enabled
                item.localizedPrice = list.localizedPrice
                item.isExpand = false
              }
            })
          })
        } else { // 新增
          data = data.map(item => {
            if (item.regions.length) {
              item.useCountryShipping = true // add 默认 true
              item.regions.forEach(list => {
                list.useCountryShipping = true // 是否使用国家运费
                list.isExpand = false
                list.disabled = true // 是否禁止修改运费
                list.localizedPrice = localizedShipping // 运费
                list.stateCode = list.regionCode // 国家编码
                list.enabled = true // 是否禁用
              })
            }
            return {
              id: item.id,
              cnName: item.cnName,
              cnNameCode: `${item.cnName}_${item.code}`,
              localizedPrice: localizedShipping, // 运费
              countryCode: item.code, // 国家编码
              enabled: true, // 是否禁用
              regions: item.regions
            }
          })
        }
        const form = this.$refs.inventory.$data.form
        const params = {
          countryShippingList: data,
          tableDataTemp: data,
          msrp: form.msrp,
          shippingTime: form.shippingTime,
          inventory: form.inventory,
          shippingTimeStart: form.shippingTimeStart,
          shippingTimeEnd: form.shippingTimeEnd
        }
        if (this.isEdit) {
          this.olineResData.countryShippingList = deepClone(data)
        }
        if (this.isVariation) {
          params.variantList = this.$refs.variantAttr.form.variantList
        }
        this.baseProductInfo = deepClone(Object.assign({}, this.baseProductInfo, { ...params }))
      })
    },
    // 一键翻译 翻译字段：
    getTranslate() {
      wishHandle.getTranslateHandle(this, this.countryCode, this.translate)
    }

  }

}
</script>

<style lang="scss" scoped>
.add-linsting-box{
  padding-bottom: 60px;
}
.isFixed{
  height: 40px;
  position: fixed;
  left:50%;
  bottom:15px;
  z-index:101;
  margin-left: -194px;
  .bottom-btn{
    margin-top: 10px;
  }
  .el-select{
    margin: 0 10px;
  }
}
</style>
