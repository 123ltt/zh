<template>
  <basic-container>
    <el-collapse v-model="activeNames" class="add-linsting-shopee">
      <el-collapse-item name="baseInfo">
        <collapse-title slot="title" title="基本信息" />
        <!-- 设置基本信息 -->
        <base-info
          ref="baseInfo"
          :form="form"
          :headers="headers"
          :rules="rules"
        >
          <el-col slot="name" :span="12">
            <el-form-item label="名字" label-width="80px" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
        </base-info>
        <el-button @click="change">改变值</el-button>
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
                     v-bind="{ labelWidth, productLoading, baseProductInfo}"
                     @editDesc="editDesc"
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
        <el-button type="primary" :disabled="!countryCode || productLoading > 0 || saveLoading" :loading="translate.loading" @click="getTranslate">一键翻译</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getIndex } from '../../components/utils.js'
import { deepClone } from '@/util/util'
import baseInfo from '../../components/baseInfo.vue'
import categoryAttr from './components/categoryAttr.vue'
import variantAttr from './components/variantAttr.vue'
import otherInfo from './components/otherInfo.vue'
import collapseTitle from './components/collapseTitle.vue'
import selectSkuModal from '@/views/components/selectSkuModal/selectSkuModal.vue'
import description from './components/description.vue'
import errorTips from '../../components/fbwordConfirm.vue'
import { getSkuDetailByProduct, getSpuDetailByProduct } from '@/api/pms.js'
import * as addListingHandle from './components/addListing.handle'
import { lazadaListingSave, lazadaListingUpdate, getLazadaDetail } from '@/api/lazada/lazada'
import { showListingDetailImage } from './components/addListing.handle.js'
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
      site: 'MY',
      form: { index: '', name: '5', sex: '', site: '', radio: '', sku: '' },
      headers: [
        {
          type: 'input',
          prop: 'index',
          label: 'index',
          span: 12,
          value: '1',
          attrs: {
            maxlength: '10',
            showWordLimit: true
          }
        },
        { slot: true, slotName: 'name' },
        {
          type: 'select',
          selectList: [{ value: '1', label: '男' }, { value: '2', label: '女' }],
          label: '性别',
          prop: 'sex',
          span: 12,
          value: '1',
          attrs: {
            class: 'w-100'
          },
          event: {
            change: (val) => {
              console.log(val)
              const index = getIndex('site', this.headers)
              this.form.name = ''
              this.headers[index].disabled = false
              this.headers[index].selectList = [{ value: '1', label: 'us' }, { value: '2', label: 'ck' }]
            }
          }
        },
        {
          type: 'select',
          selectList: [],
          label: '站点',
          prop: 'site',
          span: 12,
          value: '1',
          attrs: {
            class: 'w-100',
            disabled: true
          },
          event: {
            change: (val) => {
              console.log(val)
            }
          }
        },
        {
          type: 'radio',
          prop: 'radio',
          radioList: [{ label: '1' }],
          label: '单选'
        },
        {
          type: 'selectBtn',
          prop: 'sku',
          textDisable: false,
          btnDisable: false,
          label: 'sku',
          span: 12,
          components: {
            component: selectSkuModal,
            title: '选择产品',
            width: '1000px',
            data: () => {
              return {
                platformCode: this.platformCode,
                account: this.form.name
              }
            },
            callback: (row) => {
              if (row) {
                const type = ['Variation', 'Normal', 'Combo']
                this.listingType = type[row.type - 1]
                this.getSkuDetail(row.productSku)
              }
            }
          }
        }
      ],
      rules: {
        index: [
          { required: true }
        ],
        name: [
          { required: true }
        ]
      }
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
    ...mapGetters(['userInfo'])
  },
  created() {
    if (this.isEdit) this.getLazadaListingDetail()
  },
  methods: {
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
      if (this.baseProductInfo.productSku === productSku) return false
      const { platformCode, storeCode } = this.baseProductInfo
      this.getSkuDetailAjax(platformCode, productSku, storeCode).then(res => {
        let data = res
        data = Object.assign(data, {
          productCategoryId: data.categoryId, // 产品类目id
          productCatePath: data.categoryPath, // 产品类目树
          description: data.descriptionHtml,
          productWeight: data.netWeight, // 净重
          listingType: this.listingType,
          name: data.productName // 标题
        })
        delete data.categoryId
        if (this.isVariation && this.hasSku) {
          data.skuList = data.lstSku.map(item => {
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
                item.productCost = Number(item.productCost * item.discountRatio).toFixed(2)
              })
            } else {
              data.productCost = Number(data.productCost * data.discountRatio).toFixed(2)
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
    // 修改刊登站点
    updateSite(data) {
      this.$refs.variantAttr.siteArr = data
    },
    // 切换类目
    updateCategoryId(data) {
      this.baseProductInfo = Object.assign(this.baseProductInfo, data)
      this.$refs.categoryAttr.getCateogAttr(data.categoryId, '', this.site)
    },
    // 切换店铺 ->
    updateAccount(data) {
      this.baseProductInfo = Object.assign(this.baseProductInfo, data)
      this.$refs.categoryAttr.getCateogAttr(data.categoryId, '', this.site)
      // 清空产品信息,平台类目
      this.baseProductInfo.name = ''
      this.baseProductInfo.categoryId = '' // 平台类目id
      this.baseProductInfo.productCatePath = ''
      this.baseProductInfo.productCategoryId = ''
      this.baseProductInfo.productSku = '' // 清空产品sku，方便variantAttr，description,otherInfo重置
      this.$refs.baseInfo.form.categoryId = ''
      this.$refs.baseInfo.primaryCatePath = ''
    },
    getVarAttr(list) {
      this.$refs.variantAttr.getVarAttr(list)
    },
    // 描述改变
    editDesc(val) {

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
    change() {
      this.form.sex = '2'
    },
    saveHandle(refs) {
      const attributes = refs.categoryAttr.getPropertyValue() // 类目属性
      const otherInfo = deepClone(refs.otherInfo.form) // 其他信息
      delete otherInfo.siteArr
      const { developLeadUserId, productSku } = this.baseProductInfo
      const lazadaProductSkuDTOList = refs.variantAttr.getSkuValue()
      lazadaProductSkuDTOList.forEach(item => {
        item.combineSku = JSON.stringify(item.combineSku)
      })
      // console.log('lazadaProductSkuDTOList: ', lazadaProductSkuDTOList)
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

      // sellerSku 编辑需传（从列表获取），编辑时Pending QC 后显示单站点，编辑变体表格无操作按钮一列
      // console.log('params: ', params)
      this.saveAjax(params)
    },
    saveAjax(params) {
      (this.isEdit ? lazadaListingUpdate : lazadaListingSave)(params).then(res => {
        if (res.code === 201) {
          // isFbwordConfirmed 需要违禁词二次确认提交, 否则直接提示errorMessage 或 直接提交成功
          this.$modal({
            title: '提示',
            component: errorTips,
            padding: '30px',
            minHeight: '150px',
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
        } else if (res.code === 200) {
          this.$message.success('操作成功')
          this.$emit('close', true)
        } else {
          this.$message.error(res.msg || '未知错误')
        }
      })
    },
    // 一键翻译 翻译字段：标题，卖点， 关键词， 描述，属性
    getTranslate() {
      // addListingHandle.getTranslateHandle(this, this.countryCode, this.translate)
    },
    // 获取listing详情
    getLazadaListingDetail() {
      this.productLoading++
      getLazadaDetail({ id: this.id }).then(res => {
        const data = res.data
        if (!data) {
          this.$message.error(res.msg || '暂无数据')
          return false
        }
        this.listingType = data.listingType

        // 描述
        const description = data.detail.description || ''
        const shortDescription = data.detail.shortDescription || ''

        // 促销时间
        let specialFromDate, specialToDate
        if (!data.specialFromDate) specialFromDate = data.skus[0].specialFromDate
        if (!data.specialToDate) specialToDate = data.skus[0].specialToDate

        // 图片
        data.skus.forEach((item, i) => {
          item.mainImage = item.masterImage
          item.extraImagList = item.allImages ? JSON.parse(item.allImages).filter((item, i) => i > 0 && item) : []
          item.imgShowList = showListingDetailImage(item)
        })

        this.baseProductInfo = {
          ...data,
          categoryPathByDetail: data.categoryPath,
          productSku: data.spu,
          siteArr: data.site.split(','),
          skuList: data.skus,
          description,
          shortDescription,
          specialFromDate,
          specialToDate,
          platformCode: 'LZ'
        }
        this.site = data.listingStatus > 4 ? data.site : 'MY'
        // this.$refs.baseInfo.findPrimaryCate(data.categoryId, data.storeName)
        // 产品属性
        let attributes = {}
        data.detail.attributes && (attributes = JSON.parse(data.detail.attributes))
        this.$refs.categoryAttr.getCateogAttr(data.categoryId, attributes, this.site)
      }).finally(() => {
        this.productLoading--
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-linsting-shopee{
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
