<template>
  <basic-container v-loading="loading" class="ps-3 pb-3">
    <el-form
      ref="dialogForm"
      size="mini"
      class="form-col no-message"
      label-width="110px"
    >
      <!-- <div v-if="statusEdit.includes(detaildata.productStatus)" class="d-flex flex-row-reverse">
        <el-button type="primary" size="mini" @click="editHandle">编辑</el-button>
      </div> -->
      <el-collapse v-model="activeNames" class="add-linsting-box">
        <el-collapse-item name="baseInfo">
          <collapse-title slot="title" title="基本信息" />
          <el-row>
            <el-col :span="11">
              <span class="el-form-item__label">店铺名称</span>
              <div class="el-form-item__content">{{ detaildata.storeName || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">SKU</span>
              <div class="el-form-item__content">{{ detaildata.spu || '-' }}</div>
            </el-col>
            <el-col v-if="detaildata.childSku && detaildata.childSku.length" :span="11">
              <span class="el-form-item__label">子SKU</span>
              <div v-if="detaildata.childSku.length > 3" class="el-form-item__content">
                <el-tooltip class="item" effect="dark" :content="detaildata.childSku.join('，')" placement="top">
                  <span>{{ showCombo() }}...</span>
                </el-tooltip>
              </div>
              <div v-else class="el-form-item__content">{{ detaildata.childSku.join(',') || '-' }}</div>
            </el-col>
            <el-col v-if="detaildata.itemId" :span="11">
              <span class="el-form-item__label">ItemID</span>
              <div class="el-form-item__content">{{ detaildata.itemId || '-' }}</div>
            </el-col>
            <el-col v-if="detaildata.sellerSku && !isVariation" :span="11">
              <span class="el-form-item__label">平台SKU</span>
              <div class="el-form-item__content">{{ detaildata.sellerSku || '-' }}</div>
            </el-col>
            <el-col :span="24">
              <span class="el-form-item__label">标题</span>
              <div class="el-form-item__content">{{ detaildata.name || '-' }}</div>
            </el-col>
            <el-col :span="24">
              <span class="el-form-item__label">平台类目</span>
              <div class="el-form-item__content">{{ detaildata.categoryId || '-' }} <span class="ms-4">{{ detaildata.categoryPath }}</span></div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="categoryAttr">
          <collapse-title slot="title" title="属性" />
          <el-row>
            <el-col v-for="(item,index) in attrList" :key="index" :span="11">
              <span class="el-form-item__label">{{ item.label }}</span>
              <span class="el-form-item__content">{{ Array.isArray(item.value) ? item.value.join(', ') : item.value || '-' }}</span>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="variantAttr">
          <collapse-title slot="title" title="价格及库存" />
          <el-row>
            <el-col v-for="(v, k, i) in detaildata.varAttr" :key="i" :span="11">
              <span class="el-form-item__label varAttr">{{ k }}</span>
              <span class="el-form-item__content varAttr d-inline-block">{{ v.join(',') || '-' }}</span>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="11">
              <span class="el-form-item__label varAttr">促销开始时间</span>
              <div class="el-form-item__content varAttr">{{ detaildata.specialFromDate || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label varAttr">促销结束时间</span>
              <div class="el-form-item__content varAttr">{{ detaildata.specialToDate || '-' }}</div>
            </el-col> -->
            <el-col :span="24">
              <variantAttrTable :detaildata="detaildata" is-detail="isDetail" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="description">
          <collapse-title slot="title" title="描述" />
          <el-col :span="22">
            <span class="el-form-item__label">长描述</span>
            <!-- eslint-disable-next-line -->
            <div class="el-form-item__content lh24 description" v-html="detaildata.description" />
          </el-col>
          <el-col :span="22">
            <span class="el-form-item__label">短描述</span>
            <!-- eslint-disable-next-line -->
            <div class="el-form-item__content lh24 description" v-html="detaildata.shortDescription" />
          </el-col>
        </el-collapse-item>
        <el-collapse-item name="otherInfo">
          <collapse-title slot="title" title="其他信息" />
          <el-col :span="11">
            <span class="el-form-item__label">What's in the box</span>
            <div class="el-form-item__content">{{ detaildata.packageContent || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">包装重量</span>
            <div class="el-form-item__content">{{ detaildata.packageWeight || '-' }} 公斤/件</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">包装尺寸</span>
            <div class="el-form-item__content">
              <span>长 {{ detaildata.packageLength || '-' }}</span>
              <span class="ms-3">宽 {{ detaildata.packageWidth || '-' }}</span>
              <span class="ms-3 me-3">高 {{ detaildata.packageHeight || '-' }}</span>单位：cm
            </div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">发布到</span>
            <div class="el-form-item__content">{{ detaildata.siteArr && detaildata.siteArr.join(',') }}</div>
          </el-col>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </basic-container>
</template>

<script>
import { getLazadaDetail } from '@/api/lazada/lazada.js'
import { getSkuDetailByProduct, getSpuDetailByProduct } from '@/api/pms.js'
import { siteList, showListingDetailImage, setAttrValue, fixed2, colorFirst } from './components/addListing.handle.js'
import collapseTitle from '@/views/components/collapseTitle.vue'
import variantAttrTable from './components/variantAttrTable.vue'
import { getCategoryAttribute } from '@/api/lazada/category.js'
import { setProductCost } from '@/views/components/utils.js'
export default {
  name: 'ListingDetail',
  components: { collapseTitle, variantAttrTable },
  props: {
    id: {
      type: String,
      default: ''
    },
    isNewPage: String
  },
  data() {
    return {
      loading: false,
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'categoryAttr', 'description', 'variantAttr', 'otherInfo'],
      detaildata: {}, // 详情
      attrList: [],
      siteList,
      isVariation: false
    }
  },
  created() {
    this.id && this.getLazadaDetails()
  },
  methods: {
    showCombo() {
      return this.detaildata.childSku.filter((item, i) => i < 3).join(',')
    },
    // 获取刊登详情
    getLazadaDetails() {
      this.loading = true
      getLazadaDetail({ id: this.id }).then(res => {
        const data = res.data
        if (!data) {
          this.errorTips(res.msg)
          return false
        }
        // 子SKU
        let childSku = []
        if (data.listingType === 'Variation') {
          childSku = data.skus.map(item => item.productSku)
          this.isVariation = true
        } else if (data.skus[0]?.combineSku) {
          childSku = JSON.parse(data.skus[0].combineSku)
          if (childSku.length) {
            childSku = childSku.map(item => `${item.sku}*${item.count}`)
          }
        }

        // 描述
        const description = (data.detail && data.detail.description) || ''
        const shortDescription = (data.detail && data.detail.shortDescription) || ''
        // 站点
        const siteArr = []
        const siteCodeArr = []
        data.site.split(',').map(item => {
          siteArr.push(siteList[item].siteName)
          siteCodeArr.push(item)
        })

        // 促销时间
        // let specialFromDate, specialToDate
        // if (!data.specialFromDate) specialFromDate = data.skus[0].specialFromDate
        // if (!data.specialToDate) specialToDate = data.skus[0].specialToDate

        // 变体属性,图片
        const varAttrObj = {}
        data.skus.forEach((item, i) => {
          item.imgShowList = showListingDetailImage(item)
          if (item.specifications) {
            item.specifications = JSON.parse(item.specifications)
          }
        })

        // 产品属性
        let attributes = {}
        if (data.detail && data.detail.attributes) {
          attributes = JSON.parse(data.detail.attributes)
          const siteCode = data.itemId ? data.site : 'MY'
          this.getCateogAttr(data.categoryId, siteCode, { attributes, skus: data.skus, varAttrObj }).then(r => {
            // sku属性拼接重新回显
            this.detaildata = Object.assign({}, this.detaildata)
          })
        }

        this.detaildata = { ...data, childSku, attributes, description, shortDescription, siteArr, siteCodeArr, varAttr: varAttrObj }
        const { packageWeight } = this.detaildata
        this.detaildata.packageWeight = Number(packageWeight).toFixed(2) < 0.02 ? 0.02 : Number(packageWeight).toFixed(2)

        // 获取pms详情信息
        this.getSkuDetailAjax(data.listingType, data.spu, data.storeCode).then(rs => {
          const lstSku = rs.lstSku || [rs]
          // online 重量，成本回显
          this.detaildata.skus.forEach((item, i) => {
            const index = lstSku.findIndex(ls => ls.productSku === item.productSku)
            if (index !== -1) {
              item.productCost = lstSku[index].productCost
              item.netWeight = lstSku[index].netWeight
              item.productWeight = fixed2(lstSku[index].packWeight) // 打包重
              item.productName = lstSku[index].productName
            }
          })
          this.detaildata = Object.assign({}, this.detaildata)
        })
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取SKU详细信息api
    getSkuDetailAjax(listingType, productSku, storeCode) {
      return new Promise((resolve, reject) => {
        const request = listingType === 'Variation' ? getSpuDetailByProduct : getSkuDetailByProduct
        this.loading = true
        request({ data: { lstProductSku: [productSku], platformCode: 'LZ', storeCode } }).then(res => {
          if (res.data && res.data[0]) {
            this.hasSku = true
            const data = res.data[0]
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
          this.loading = false
        })
      })
    },
    // 获取类目属性列表
    getCateogAttr(categoryId, siteCode, { attributes, skus, varAttrObj }) {
      if (!categoryId) {
        return
      }
      return getCategoryAttribute({ categoryId, siteCode }).then(res => {
        if (res.data) {
          const data = res.data.lazadaCategoryVOList || []
          const { varAttr, attrList } = setAttrValue(data, this, attributes)
          this.attrList = attrList.filter(item => {
            if (item.value?.length) {
              return item
            }
          })
          const speObj = {}
          skus.forEach((item, i) => {
            const specions = {}
            const skuVarKeys = item.specifications ? Object.keys(item.specifications) : []
            colorFirst(varAttr).forEach(v => {
              if (skuVarKeys.includes(v.name)) {
                specions[v.label] = item.specifications[v.name]
              }
              if (speObj[v.label]) {
                !speObj[v.label].includes(item.specifications[v.name]) && speObj[v.label].push(item.specifications[v.name])
              } else {
                speObj[v.label] = item.specifications ? [item.specifications[v.name]] : []
              }
            })
            item.specifications = specions
          })
          varAttrObj = Object.assign(varAttrObj, speObj)
        }
      })
    },
    errorTips(msg) {
      this.$message.error({
        title: '提示',
        message: msg || '暂无数据',
        duration: this.isNewPage ? 0 : 4500
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-collapse { border-top: 0; }
  .el-collapse-item__wrap, .el-collapse-item__header { border-bottom: 0; }
  .el-collapse-item__content {
    padding-bottom: 0;
    color: #999;
    line-height: 24px !important;
    padding-top: 8px;
    ul,li{
      padding: 0;
      margin: 0;
      list-style: none;
    }
  }
}
.el-form-item__label { width: 180px; display: inline-block; &.varAttr{ width: 220px; }}
.el-form-item__content {
  margin-left: 0;
  &.varAttr{ margin-left: 0; }
  ::v-deep p{ margin:0 }
  &.description{
    margin-left: 180px;
  }
}
</style>
