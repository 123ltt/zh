<template>
  <basic-container>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-loading="loading" name="baseInfo" title="基本信息">
        <!-- 设置基本信息 -->
        <base-info
          ref="baseInfo"
          :form="baseProductInfo"
          :headers="headers"
          :rules="rules"
        >
          <el-col v-if="zShow" slot="zskuSlot" :span="12">
            <el-form-item label="子SKU" label-width="80px" prop="sellerSku">
              <el-input v-model="baseProductInfo.sellerSku" disabled />
            </el-form-item>
          </el-col>
          <el-col slot="cateSlot" :span="24">
            <el-form-item label="平台类目" label-width="80px" prop="sellerSku">
              <el-col :span="6">
                <el-input v-model="baseProductInfo.categoryId" disabled />
              </el-col>
              <el-col :span="1">
                <serachCate class="mx-2" :disabled="cateDisabled&&!isEdit" :options="{label:'categoryName'}" :api-fn="getCateogries" params-key="categoryPath" :params="params" @get="getData" />
              </el-col>
              <el-col :span="1">
                <el-dropdown ref="drop" trigger="click" class="mx-1">
                  <el-button icon="el-icon-menu" :disabled="!baseProductInfo.productSpu" />
                  <el-dropdown-menu slot="dropdown" class="p-0">
                    <el-cascader-panel ref="setPlatformCate" v-model="baseProductInfo.categoryId" :props="cateProps" @change="changePlatformCateId" />
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col v-if="baseProductInfo.platCategoryPath" :span="16">
                <el-input v-model="baseProductInfo.platCategoryPath" disabled />
              </el-col>
            </el-form-item>
          </el-col>
        </base-info>
      </el-collapse-item>
      <el-collapse-item v-loading="loading" name="categoryAttr" title="属性及图片">
        <category-attr ref="categoryAttr"
                       v-bind="{ labelWidth, baseProductInfo:baseProductInfo,isEdit }"
        />
        <setPicture ref="picture"
                    v-loading="loading"
                    v-bind="{storeName:baseProductInfo.account,isoss:true, labelWidth, baseProductInfo,ossWaterShow:true }"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="loading" name="price" title="价格、库存、描述">
        <variantAttr ref="variantAttr"
                     v-bind="{ labelWidth, baseProductInfo, isVariation, isEdit,imageInfo,skuObj,isOnline}"
        />
      </el-collapse-item>
      <el-collapse-item v-loading="loading" name="othInfo" title="其他信息">
        <otherInfo ref="otherInfo"
                   v-bind="{ labelWidth, baseProductInfo }"
        />
      </el-collapse-item>
    </el-collapse>
    <btnHandle :translate-data="translateData" :that="that" :submit="submit" />
  </basic-container>
</template>

<script>
import { getCateogries, getLevelCategory } from '@/api/shopee/category.js'
import serachCate from '../../components/serachCate.vue'
import myMix from './myMix.js'
import baseInfo from '../../components/baseInfo.vue'
import categoryAttr from './components/categoryAttr.vue'
import setPicture from '../../components/picture/picture.vue'
import variantAttr from './components/variantAttr.vue'
import otherInfo from './components/otherInfo.vue'
import { getSkuDetailByProduct, getSpuDetailByProduct } from '@/api/amazon/amazon.js'
import { save, detail } from '@/api/shopee/shopee.js'
import btnHandle from '../../components/btnHandle.vue'
export default {
  name: 'LmsShopeeAddListing',
  components: {
    baseInfo,
    categoryAttr,
    setPicture,
    variantAttr,
    otherInfo,
    btnHandle,
    serachCate
  },
  mixins: [myMix],
  props: {
    id: {
      type: String,
      default: ''
    },
    auditTabActiveName: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateSku = (rule, value, callback) => {
      if (!value) {
        callback(new Error('SKU不能为空'))
      }
      if (this.validateSku) {
        callback(new Error('SKU有误'))
      } else {
        callback()
      }
    }
    return {
      validateSku: false,
      isAble: this.ableEdit,
      isType: this.type,
      params: () => {
        return {
          site: (this.baseProductInfo.account && this.baseProductInfo.account.split('.')[1]) || '',
          categoryPath: ''
        }
      },
      getCateogries: getCateogries,
      cateDisabled: true,
      that: this,
      translateData: [
        { baseInfo: ['name'] },
        { variantAttr: ['description'] }
      ],
      cateProps: {
        lazy: true,
        label: 'categoryPath',
        value: 'categoryId',
        lazyLoad: (node, resolve) => {
          getLevelCategory({
            categoryId: (node.data && node.data.categoryId) || ''
          }).then(res => {
            let data = res.data
            data = data.map(item => {
              item.leaf = !item.hasChildren
              return item
            })
            resolve(data)
          })
        }
      },
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'categoryAttr', 'price', 'othInfo'],
      platformCode: 'SP',
      baseProductInfo: {
        account: '', accountCode: '', platCategoryPath: '', accountPrefix: '', productSpu: '', sellerSku: '', name: '', condition: '', categoryId: null, productCatePath: '', productCost: '', netWeight: '', descriptionPlain: ''
      },
      listingType: '',
      labelWidth: '150px',
      rules: {
        account: [
          { required: true, message: '店铺名称不能为空' }
        ],
        productSpu: [
          { required: true, validator: validateSku, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '标题不能为空' }
        ]
      },
      zShow: false,
      imageInfo: [],
      skuObj: { skuList: [] },
      loading: Boolean(this.id)
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
    isOnline() {
      return this.auditTabActiveName === 'Online'
    }
  },
  watch: {
    id() {
      this.init()
    }
  },
  mounted() {
    if (this.id) {
      this.init()
    }
  },
  methods: {
    init() {
      this.getDetails()
      if (this.isOnline) {
        const watchName = ['name', 'categoryId']
        watchName.forEach(item => {
          const unWatch = this.$watch(() => this.baseProductInfo[item], (val, oldVal) => {
            if (oldVal !== undefined && val !== oldVal) {
              this.baseProductInfo.updateField.push(1)
            }
          })
          this.$once('hook:beforeDestory', unWatch)
        })
      }
    },
    getData(val) {
      this.baseProductInfo.categoryId = val.categoryId
      this.baseProductInfo.platCategoryPath = val.categoryPath
      const { categoryId, account } = this.baseProductInfo
      // 设置利润率
      if (val.grossProfit) {
        this.$refs.variantAttr.$refs.oneListing.setForm('profitRate', val.grossProfit)
      }
      this.$refs.categoryAttr.getCateogAttr(categoryId, account)
    },
    getDetails() {
      this.loading = true
      detail({ id: this.id }).then(res => {
        res.data.images = JSON.parse(res.data.images).map((Iitem, i) => {
          const item = {}
          item.imageUrl = Iitem
          if (!i) {
            item.isPrime = true
            item.isExtra = false
          } else {
            item.isPrime = false
            item.isExtra = true
          }
          return item
        })
        this.baseProductInfo = res.data
        this.baseProductInfo.updateField = []
        this.listingType = res.data.listingType
        const data = this.baseProductInfo
        this.getSkuDetail(res.data.productSpu)
        data.tierVariation = JSON.parse(res.data.tierVariation)
        data.attributes = JSON.parse(data.attributes)
        const attributeJson = JSON.parse(data.attributeJson)
        if (attributeJson) {
          data.accountPrefix = attributeJson.accountPrefix
          data.oneListing = attributeJson.oneListing
          data.platCategoryPath = attributeJson.platCategoryPath
        }
        data.shopeeListingVariantDTOList = res.data.shopeeListingVariantVOList
        // 多变体处理
        if (this.isVariation) {
          data.shopeeListingVariantDTOList = res.data.shopeeListingVariantDTOList
        }
        if (this.listingType === 'Combo') {
          this.zShow = true
        }
        this.loading = false
      })
    },
    submit() {
      const refs = this.$refs
      let validStatu = true
      const vaildes = ['baseInfo', 'categoryAttr', 'picture', 'otherInfo']
      for (const item of vaildes) {
        refs[item].$refs.form.validate(valid => {
          if (!valid) {
            validStatu = false
          }
        })
      }
      if (this.isVariation) { // 多变体验证
        refs.variantAttr.$refs.varyListing.$refs.form.validate(valid => !valid && (validStatu = false))
        if (!this.baseProductInfo.shopeeListingVariantDTOList?.length) {
          this.$message.warning('多变体不能为空，请设置多变体')
          return false
        }
      } else {
        refs.variantAttr.$refs.oneListing.$refs.form.validate(valid => !valid && (validStatu = false))
      }
      if (!validStatu) {
        this.$message.warning('请根据表单提示完成信息的填写')
        return new Promise((resolve, reject) => {
          const err = false
          reject(err)
        })
      }
      if (this.baseProductInfo?.checkMsg) {
        this.$message.warning(this.baseProductInfo.checkMsg)
        return
      }
      const oneListing = refs.variantAttr.$refs?.oneListing?.form || {}
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
      const attributeJson = { platCategoryPath: this.baseProductInfo?.platCategoryPath || '', shopeeListingVariantDTOList: this.baseProductInfo?.shopeeListingVariantDTOList?.filter(item => item.variantDraftStatus !== 'delete') || [], oneListing, accountPrefix: this.baseProductInfo.accountPrefix }
      if (this.listingType === 'Variation') {
        this.baseProductInfo.tierVariation.forEach(tItem => {
          tItem.options.forEach(item => {
            delete item.id
            delete item.tierIndex
          })
        })
        const check = this.baseProductInfo?.tierVariation[0]?.options.every(item => item.imageUrl?.length === 0)
        check && this.baseProductInfo.tierVariation.forEach(tItem => {
          tItem.options.forEach(item => {
            delete item.imageUrl
            delete item.tierIndex
          })
        })
      }
      const otherInfo = Object.assign({}, refs.otherInfo.form || '')
      otherInfo.logistics = JSON.stringify(otherInfo.logistics.map(logItem => {
        return {
          logistic_id: logItem,
          enabled: true
        }
      })) || ''
      const attributes = refs?.categoryAttr?.form.property.map(item => {
        delete item.options
        return { attribute_id: item.attributeId, attribute_value: item.value }
      }) || ''
      const params = {
        listingType: this.listingType,
        attributeJson: JSON.stringify(attributeJson),
        images: JSON.stringify(images),
        attributes: JSON.stringify(attributes),
        ...otherInfo,
        ...oneListing,
        ...this.$refs.variantAttr.form,
        fbwordConfirm: false
      }
      this.isOnline && (params.updateField = [...new Set(this.baseProductInfo.updateField)])
      const filterParams = [
        'account', 'accountCode', 'platCategoryPath', 'accountPrefix', 'productSpu', 'sellerSku', 'name', 'condition', 'categoryId', 'productCatePath'
      ]
      if (this.id)filterParams.push('id', 'shopeeListingVariantDTOList')
      filterParams.forEach(item => {
        params[item] = this.baseProductInfo[item]
      })
      if (this.listingType === 'Variation') {
        params.tierVariation = JSON.stringify(this.baseProductInfo.tierVariation)
        params.shopeeListingVariantDTOList = this.baseProductInfo.shopeeListingVariantDTOList
        params.description = refs.variantAttr.$refs.varyListing.form.description
      }
      return save(params, this.id).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.$emit('close')
        }
      })
    },
    // 创建时获取SKU详细信息
    getSkuDetail(productSku) {
      if (productSku.length === 0) return
      this.getSkuDetailAjax(productSku, this.baseProductInfo.account).then(res => {
        this.validateSku = false
        let data = res
        data = Object.assign(data, {
          description: data.descriptionHtml,
          weight: data.netWeight,
          firstCategory: data.rootCategoryId,
          developer: data.developLeadUserId
        })
        const lstImage = res.imageInfo[0]?.lstImage || []
        this.$refs.picture.setList(lstImage, this.baseProductInfo.account, this.isEdit)
        if (this.isOnline) {
          const unWatch = this.$watch(() => this.$refs.picture.imgShowList, (val, oldVal) => {
            this.baseProductInfo.updateField.push(2)
          }, { deep: true })
          this.$once('hook:beforeDestory', unWatch)
        }
        if (!this.isEdit) {
          this.baseProductInfo.name = res.productName
        }
        this.imageInfo = lstImage
        delete data.categoryId
        if (this.isVariation) {
          this.skuObj.skuList = []
          data.lstSku.forEach(item => {
            this.skuObj.skuList.push({ value: item.productSku, netWeight: item.netWeight, costPrice: item.productCost, discountRatio: item.discountRatio, title: item.productName, label: `${item.nwSku}-${item.productSku}` })
          })
        }
        if (!this.isVariation) {
          this.$refs.variantAttr.$refs.oneListing.setForm(['discountRatio', 'productCost'], [res.discountRatio, res.productCost])
          this.baseProductInfo.productCost = res.productCost
          this.baseProductInfo.netWeight = res.netWeight
          this.baseProductInfo.descriptionPlain = res.descriptionPlain
        }
        this.$refs.otherInfo.form.count = res.lstSkuCode?.[0]?.count || 0
        this.baseProductInfo.productCatePath = res.categoryPath
        if (this.listingType === 'Combo') {
          this.zShow = true
          this.baseProductInfo.sellerSku = res.lstSkuCode[0].sku + '*' + res.lstSkuCode[0].count
        } else {
          this.zShow = false
        }
      }).catch(() => {
        this.validateSku = true
      })
    },
    changePlatformCateId(val) {
      this.baseProductInfo.categoryId = val[val.length - 1]
      this.$refs.drop.hide()
      this.baseProductInfo.platCategoryPath = this.$refs.setPlatformCate.getCheckedNodes()[0].data.categoryPath
      this.$refs.categoryAttr.getCateogAttr(this.baseProductInfo.categoryId, this.baseProductInfo.account)
    },
    // 获取SKU详细信息api
    getSkuDetailAjax(productSku, storeCode) {
      return new Promise((resolve, reject) => {
        const request = this.isVariation ? getSpuDetailByProduct : getSkuDetailByProduct
        request({ data: { lstProductSku: [productSku], platformCode: this.platformCode, storeCode } }).then(res => {
          if (res.data && res.data[0]) {
            const data = res.data[0]
            const type = ['Variation', 'Normal', 'Combo']
            this.listingType = this.isVariation ? type[0] : type[data.type - 1]
            if (this.listingType !== 'Variation') {
              data.productSpu = data.productSku
            }
            resolve(data)
          } else {
            this.validateSku = true
            this.$refs.baseInfo.$refs.form.validateField('productSpu')
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
}
</script>
