<template>
  <basic-container>
    <el-form
      ref="dialogForm"
      v-loading="productLoading"
      size="mini"
      class="form-col no-message"
      label-width="110px"
    >
      <!-- <div v-if="statusEdit.includes(detaildata.productStatus)" class="clearFix">
        <el-button type="primary" size="mini" class="float-end" @click="editHandle">编辑</el-button>
      </div> -->
      <el-collapse v-model="activeNames" class="add-linsting-box">
        <el-collapse-item name="baseInfo">
          <collapse-title slot="title" title="基本信息" />
          <el-row>
            <el-col :span="11">
              <span class="el-form-item__label">SKU</span>
              <div class="el-form-item__content">{{ detaildata.productSpu || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">店铺</span>
              <div class="el-form-item__content">{{ detaildata.account || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">平台SKU</span>
              <div class="el-form-item__content">{{ detaildata.sellerSku || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">来源URL</span>
              <div class="el-form-item__content">{{ detaildata.landingPageUrl || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">品牌</span>
              <div class="el-form-item__content">{{ detaildata.asin || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">UPC</span>
              <div class="el-form-item__content">{{ detaildata.upc || '-' }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">标题</span>
              <div class="el-form-item__content">{{ detaildata.title || '-' }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">标签</span>
              <div class="el-form-item__content">{{ getTags(detaildata.tags) || '-' }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">描述</span>
              <div class="el-form-item__content">{{ detaildata.description || '-' }}</div>
            </el-col>
            <el-col :span="12">
              <span class="el-form-item__label">状态</span>
              <div class="el-form-item__content">{{ detaildata.condition || '-' }}</div>
            </el-col>
            <el-col :span="12">
              <span class="el-form-item__label">重量</span>
              <div class="el-form-item__content">{{ detaildata.weight || '-' }}</div>
            </el-col>
            <el-col :span="12">
              <span class="el-form-item__label">海关HS编码</span>
              <div class="el-form-item__content">{{ detaildata.customsHsCode || '-' }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="picture">
          <collapse-title slot="title" title="图片" />
          <div class="el-form-item__content">
            <ul class="el-upload-list el-upload-list--picture-card">
              <li v-for="(citem, index) in detaildata.imgList" :key="index" class="el-upload-list__item">
                <div>
                  <g-thumb :width="146"
                           :height="146"
                           :url="citem.imageUrl"
                  />
                  <div class="el-upload-list__item-btn">
                    <el-checkbox v-model="citem.isPrime" label="主图" class="m-l-5" disabled />
                    <el-checkbox v-model="citem.isExtra" label="副图" disabled />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item name="transportation">
          <collapse-title slot="title" title="库存及运输" />
          <el-row>
            <div>
              <el-button type="primary" size="mini" @click="showFreight">查看国家运费</el-button>
            </div>
            <template v-if="!isVariation">
              <el-col :span="11">
                <span class="el-form-item__label">本地价格(CNY)</span>
                <div class="el-form-item__content">{{ detaildata.localizedPrice || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">价格(USD)</span>
                <div class="el-form-item__content">{{ detaildata.price || '-' }}</div>
              </el-col>
            </template>
            <el-col :span="11">
              <span class="el-form-item__label">本地运费(CNY)</span>
              <div class="el-form-item__content">{{ detaildata.localizedShipping || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">运费(USD)</span>
              <div class="el-form-item__content">{{ detaildata.shipping || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">MSRP</span>
              <div class="el-form-item__content">{{ detaildata.msrp || '-' }}</div>
            </el-col>
            <template v-if="!isVariation">
              <el-col :span="11">
                <span class="el-form-item__label">刊登利润率</span>
                <div class="el-form-item__content">{{ detaildata.profitRate || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">库存</span>
                <div class="el-form-item__content">{{ detaildata.inventory || '-' }}</div>
              </el-col>
            </template>
            <el-col :span="11">
              <span class="el-form-item__label">最大购买数</span>
              <div class="el-form-item__content">{{ detaildata.maxQuantity || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">运输时间</span>
              <div class="el-form-item__content">{{ detaildata.shippingTime || '-' }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item v-if="detaildata.listingType === 'Variation'?true:false" name="moreProperty">
          <collapse-title slot="title" title="多属性" />
          <el-table :data="detaildata.recordData"
                    max-height="600px"
                    stripe
                    border
                    class="g-table"
          >
            <el-table-column prop="productSku" label="子SKU" width="260">
              <template v-slot="{row}">
                <el-tooltip v-if="row.productName" class="item" effect="dark" :content="row.productName" placement="top">
                  <div>SKU：{{ row.productSku }}</div>
                </el-tooltip>
                <div v-else>SKU：{{ row.productSku }}</div>
                <div>平台：{{ row.sellerSku }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="color" label="颜色" />
            <el-table-column prop="size" label="尺寸" />
            <el-table-column prop="localizedPrice" label="售价" />
            <el-table-column prop="costPrice" label="成本" />
            <el-table-column prop="profitRate" label="刊登利润率" />
            <el-table-column prop="inventory" label="库存" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </basic-container>
</template>

<script>
import * as wishHandle from './components/wish.handle.js'
import collapseTitle from './components/collapseTitle.vue'
import AddListing from './addListing.vue'
import { deepClone } from '@/util/util'
import { getSpuDetailByProduct } from '@/api/amazon/amazon.js'
// 分割线
import { wishDetail } from '@/api/wish/wish'
import showCountryFreight from './components/showCountryFreight'
export default {
  name: 'LmsLmsWishListingListingDetail',
  components: { collapseTitle },
  props: {
    id: String,
    itemId: String,
    variationId: String, // 变体id
    productStatus: [String, Number],
    isNewPage: String,
    item: Object,
    baseProductInfo: Object
  },
  data() {
    return {
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'picture', 'transportation', 'moreProperty'],
      productLoading: false,
      statusEdit: [1, 4, 5, 7],
      detaildata: {
        recordData: []
      },
      form: {}
    }
  },
  computed: {
    // 是否为多个子sku
    isVariation() {
      return this.detaildata.listingType === 'Variation'
    },
    variationThemes() {
      let themes = ''
      this.detaildata.skuAttrs && this.detaildata.skuAttrs.filter(item => {
        if (item.name.indexOf('Map') === -1) {
          themes = themes + item.name
        }
      })
      return themes
    }

  },
  watch: {
    baseProductInfo(oldVal, newVal) {
      this.form = deepClone(this.baseProductInfo)
    }
  },
  created() {
    this.getAmazonListingDetail()
  },
  methods: {
    getTags(val) { // 标签返回数据
      if (val) {
        return this.detaildata.tags.join()
      }
    },
    getSkuDetailAjax(productSku) {
      getSpuDetailByProduct({ data: { lstProductSku: [productSku], platformCode: 'WH', storeCode: this.detaildata.accountCode } }).then(res => {
        if (res.data && res.data[0]) {
          const data = res.data[0]
          if (data.lstSku) {
            this.detaildata.recordData.forEach(item => {
              data.lstSku.filter(list => {
                if (item.productSku === list.productSku) {
                  item.productName = list.productName || ''
                }
              })
            })
            this.$set(this.detaildata.recordData)
          }
        }
      })
    },

    errorTips(msg) {
      this.$message.error({
        title: '提示',
        message: msg || '暂无数据',
        duration: this.isNewPage ? 0 : 4500
      })
    },
    // 查看国家运费
    showFreight() {
      this.$modal({
        title: '查看国家运费',
        component: showCountryFreight,
        width: '1000px',
        data: {
          id: this.id,
          countryShippingList: this.detaildata.countryShippingList
        }
      })
    },
    // 获取详情
    getAmazonListingDetail() {
      this.productLoading = true
      wishDetail(this.id).then(res => {
        if (!res.data) {
          this.errorTips(res.msg)
          return
        }
        const data = deepClone(res.data || {})
        data.localizedShipping = parseFloat(data.localizedShipping).toFixed(2)
        data.profitRate = parseFloat(data.profitRate).toFixed(2)
        data.costPrice = parseFloat(data.costPrice).toFixed(2)
        if (data.listingType === 'Variation') {
          data.wishListingVariantVOList.forEach(item => {
            item.localizedShipping = parseFloat(item.localizedShipping).toFixed(2)
            item.profitRate = parseFloat(item.profitRate).toFixed(2)
            item.costPrice = parseFloat(item.costPrice).toFixed(2)
          })
        }
        this.getSkuDetailAjax(data.productSpu)
        // this.detaildata = data
        // 多个子sku
        this.detaildata = Object.assign({
          platformCode: 'WH',
          ...data,
          ...data.amazonDraftVO,
          ...data.amazonListingExtendVO
        })

        delete this.detaildata.amazonDraftVO
        delete this.detaildata.amazonListingExtendVO
        this.detaildata.productSkus = []
        // 处理图片列表
        const { imgShowList } = wishHandle.dealPic(this.detaildata.mainImage, this.detaildata.extraImages)
        this.detaildata.imgList = imgShowList
        this.detaildata.recordData = data.wishListingVariantVOList
        // 属性
      }).finally(() => {
        this.productLoading = false
      })
    },
    // 编辑按钮事件
    editHandle() {
      this.$newTab({
        path: '/lms/wisi/edit/listing',
        title: '编辑Listing',
        component: AddListing,
        data: {
          id: this.id,
          asin: this.asin,
          variationId: this.variationId,
          productStatus: this.productStatus
        },
        clearCache: true,
        callback: data => {
          if (data) {
            this.getAmazonListingDetail() // 如果是修改的在售，获取详情要传6
          }
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.clearFix{
  clear: both;
  overflow: hidden;
}
.attr-item{
  width: 50%;
  float: left;
  line-height: 18px;
  margin: 5px 0;
  .el-label {
    width: 180px;
    text-align: right;
    display: inline-block;
    vertical-align: text-top;
  }
  .el-content {
    margin-left: 10px;
    display: inline-block;
    vertical-align: text-top;
    white-space: normal;
    word-break: break-all;
  }
}
.el-collapse {
  border-top: 0;
}
::v-deep .el-collapse-item__wrap, ::v-deep .el-collapse-item__header {
  border-bottom: 0;
}
.avue-group__header {
  margin-bottom: 0;
}
.lh24{
  padding-top: 8px;
  line-height: 24px;
}
.color999{color: #999;}
::v-deep .el-collapse-item__content {
  padding-bottom: 0;
  color: #999;
  line-height: 24px !important;
  padding-top: 8px;
}
.el-form {
  margin: 0 10px 10px 10px;
}
.el-form-item__label {
  width: 180px;
  display: inline-block;
}
.el-form-item__content {
  margin-left: 180px;
}
::v-deep .el-tree-node__content{
  height: auto;
}
::v-deep .el-tree-node__children .el-tree-node[role=treeitem]{
  width: 50%;
  float: left;
}
.pic{
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  margin: 0 8px 8px 0;
  ::v-deepdiv{
    border-radius: 4px;
  }
}
.el-upload-list__item-btn{
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  text-align: center;
  color: #fff;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  line-height: 0;
  padding: 10px 0px;
}
.desc-form{
  width: 85%;
}
.sku-attr{
  width: 50%;
  display: inline-block;
}
</style>
