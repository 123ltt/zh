<template>
  <basic-container>
    <el-form
      ref="dialogForm"
      v-loading="productLoading"
      size="mini"
      class="form-col no-message"
      label-width="110px"
    >
      <!-- <div v-if="statusEdit.includes(detaildata.listingStatus)" class="clearFix">
        <el-button type="primary" size="mini" class="float-end" @click="editHandle">编辑</el-button>
      </div> -->
      <el-collapse v-model="activeNames" class="add-linsting-box">
        <el-collapse-item name="baseInfo">
          <collapse-title slot="title" title="基本信息" />
          <el-row>
            <el-col :span="11">
              <span class="el-form-item__label">站点</span>
              <div class="el-form-item__content">{{ detaildata.amazonSite || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">店铺名称</span>
              <div class="el-form-item__content">{{ detaildata.account || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">{{ isVariation ? 'SPU' : 'SKU' }}</span>
              <div class="el-form-item__content">
                <span>{{ isVariation ? detaildata.productSku : detaildata.combineSku || detaildata.productSku }}</span>
              </div>
            </el-col>
            <el-col v-if="isVariation" :span="11">
              <span class="el-form-item__label">SKU</span>
              <div class="el-form-item__content">{{ detaildata.productSkus || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">品牌</span>
              <div class="el-form-item__content">{{ detaildata.brand || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">平台SKU</span>
              <div class="el-form-item__content">{{ detaildata.sellerSku || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">状态</span>
              <div class="el-form-item__content">{{ status[detaildata.listingStatus-1] || '-' }}</div>
            </el-col>
            <el-col v-if="+detaildata.listingStatus >= 5" :span="11">
              <span class="el-form-item__label">ASIN</span>
              <div class="el-form-item__content">{{ detaildata.asin || '-' }}</div>
            </el-col>
            <el-col v-if="!isVariation" :span="11">
              <span class="el-form-item__label">库存</span>
              <div class="el-form-item__content">{{ detaildata.quantity }}</div>
            </el-col>
            <el-col v-if="!isVariation" :span="11">
              <span class="el-form-item__label">产品通用编码</span>
              <div class="el-form-item__content">{{ detaildata.standardProdcutIdType || '-' }} - {{ detaildata.standardProdcutIdValue || '-' }}
              </div>
            </el-col>
            <el-col v-if="!isVariation" :span="11">
              <span class="el-form-item__label">Condition</span>
              <div class="el-form-item__content">{{ detaildata.condition || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">标题</span>
              <div class="el-form-item__content lh24">{{ detaildata.title || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">类目</span>
              <div class="el-form-item__content lh24">{{ detaildata.categoryId || '-' }} - {{ detaildata.category || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">模板</span>
              <div class="el-form-item__content">{{ detaildata.productType || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">制造商</span>
              <div class="el-form-item__content lh24">{{ detaildata.manufacturer || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">发货方式</span>
              <div class="el-form-item__content lh24">{{ detaildata.fulfillmentChannel || '-' }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="templateAttr">
          <collapse-title slot="title" title="属性" />
          <div v-if="!isVariation && (detaildata.variationThemes || (detaildata.skuAttrs && detaildata.skuAttrs.length))">
            <el-row>
              <el-col :span="12">
                <span class="el-form-item__label">变体主题</span>
                <div class="el-form-item__content">
                  <span v-if="detaildata.variationThemes">{{ detaildata.variationThemes }}</span>
                  <span v-else-if="detaildata.skuAttrs">{{ variationThemes }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <span class="el-form-item__label">变体属性</span>
                <div class="el-form-item__content">
                  <span v-for="(item, i) in detaildata.skuAttrs" :key="i" class="me-2">
                    {{ item.name }} : {{ item.value }} {{ item.unit }}
                    <span v-if="i+1 < detaildata.skuAttrs.length">;</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-tree
            :data="detaildata.attributes"
            :props="{ children: 'children', label: 'attrName' }"
            node-key="id"
            default-expand-all
            :expand-on-click-node="true"
          >
            <span slot-scope="{ data }" class="custom-tree-node">
              <span v-if="data.children && data.children.length">{{ data.attrName }}</span>
              <div v-else class="attr-item">
                <span class="el-label">{{ data.attrName || 'attrName' }}</span>
                <div class="el-content">
                  <div v-for="(value, index) in data.values" :key="index" :class="data.values.length > 1 && 'mb-3'">
                    {{ value || '-' }}
                    <span v-if="data.unit">{{ data.unit }}</span>
                  </div>
                </div>
              </div>
            </span>
          </el-tree>
        </el-collapse-item>
        <el-collapse-item v-if="isVariation" name="variantAttr">
          <collapse-title slot="title" title="变体信息" />
          <el-row>
            <el-col :span="11">
              <span class="el-form-item__label">促销开始时间</span>
              <div class="el-form-item__content">{{ detaildata.saleStartDate || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">促销结束时间</span>
              <div class="el-form-item__content">{{ detaildata.saleEndDate || '-' }}</div>
            </el-col>
            <el-col>
              <div v-if="detaildata.amazonDraftSkuVOList" class="el-form-item__content ms-0">
                <el-table
                  :data="detaildata.amazonDraftSkuVOList"
                  :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
                  border
                  stripe
                  class="g-table"
                  size="small"
                  style="width: 100%"
                >
                  <el-table-column label="子SKU" prop="productSku" width="100">
                    <template slot-scope="{ row }">
                      <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
                        <span>{{ row.productSku }}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="图片" prop="img" width="110">
                    <template slot-scope="{ row, index }">
                      <span v-if="row.imgList && row.imgList.length" class="d-flex">
                        <!-- <g-thumb v-for="(item, index) in row.imgList" :key="index" :width="40" :height="40" :url="item" class="pic" /> -->
                        <g-thumb :width="40" :height="40" :url="row.imgList[0].imageUrl" class="pic" />
                        <el-button type="text" @click="changeImgModal(row, index)">more</el-button>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="产品通用编码" prop="cost" width="120">
                    <template slot-scope="{ row }">
                      {{ row.standardProdcutIdType || '-' }} / {{ row.standardProdcutIdValue || '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Condition" prop="condition" width="100" />
                  <el-table-column label="变体属性" prop="skuAttrs">
                    <template slot-scope="{ row }">
                      <div v-if="row.skuAttrs">
                        <div v-for="(attr, idx) in row.skuAttrs" :key="idx" class="sku-attr">
                          {{ attr.name }}:
                          <span class="color999">{{ attr.value }}</span>
                          <span v-if="attr.unit" class="color999">{{ attr.unit }}</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" prop="standardPrice" width="90" />
                  <el-table-column label="促销价" prop="salePrice" width="90" />
                  <el-table-column label="成本|利润率" prop="logistics" width="100">
                    <template slot-scope="{ row }">
                      {{ row.costPrice }} - {{ row.profitMargin }}
                    </template>
                  </el-table-column>
                  <el-table-column label="库存" prop="quantity" width="80" />
                  <el-table-column label="物流" prop="logistics" width="90">
                    <template slot-scope="{ row }">
                      <el-button type="text" @click="showLogisticsList(row)">{{ row.logistics && row.logistics.channelCode }} | {{ row.logistics && row.logistics.cost }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="otherInfo">
          <collapse-title slot="title" title="其它信息" />
          <el-row>
            <div v-if="!isVariation">
              <el-col>
                <span class="el-form-item__label">物流</span>
                <div class="el-form-item__content">
                  <logisticsList :logistics="logisticsList" />
                </div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">重量(g)</span>
                <div class="el-form-item__content">{{ detaildata.logistics && detaildata.logistics.weight || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">成本</span>
                <div class="el-form-item__content">{{ detaildata.costPrice || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">售价</span>
                <div class="el-form-item__content">{{ detaildata.standardPrice || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">促销价</span>
                <div class="el-form-item__content">{{ detaildata.salePrice || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">促销开始时间</span>
                <div class="el-form-item__content">{{ detaildata.saleStartDate || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">促销结束时间</span>
                <div class="el-form-item__content">{{ detaildata.saleEndDate || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">刊登实际利润率</span>
                <div class="el-form-item__content">{{ detaildata.profitMargin || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">销售利润率</span>
                <div class="el-form-item__content">{{ detaildata.grossProfit || '-' }}</div>
              </el-col>
              <el-col>
                <span class="el-form-item__label">图片</span>
                <div class="el-form-item__content">
                  <ul class="el-upload-list el-upload-list--picture-card">
                    <li v-for="(item, index) in detaildata.imgList" :key="index" class="el-upload-list__item">
                      <div>
                        <g-thumb :width="146" :height="146" :url="item.imageUrl" />
                        <div class="el-upload-list__item-btn">
                          <el-checkbox v-model="item.isPrime" label="主图" class="m-l-5" disabled />
                          <el-checkbox v-model="item.isExtra" label="副图" disabled />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-col>
            </div>
            <div class="desc-form">
              <el-col v-for="(k, v, index) in detaildata.bulletPoint" :key="index">
                <span class="el-form-item__label">卖点{{ +v + 1 }}</span>
                <div class="el-form-item__content lh24">{{ k || '-' }}</div>
              </el-col>
              <el-col>
                <span class="el-form-item__label">关键词</span>
                <div class="el-form-item__content lh24">{{ detaildata.searchTerms || '-' }}</div>
              </el-col>
              <el-col>
                <span class="el-form-item__label">描述</span>
                <!-- eslint-disable-next-line -->
              <div class="el-form-item__content lh24" v-html="detaildata.description" />
              </el-col>
            </div>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </basic-container>
</template>

<script>
import * as addListingHandle from './components/addListing.handle.js'
import collapseTitle from './components/collapseTitle.vue'
import changeChildSkuImg from './components/changeChildSkuImg.vue'
import { getAmazonListingDetail, getAmazonListingOlineDetail } from '@/api/amazon/amazon.js'
import { getSpuDetailByProduct } from '@/api/pms.js'
import AddListing from './addListing.vue'
import AddVaryListing from './addVaryListing.vue'
import logisticsList from './components/logisticsList.vue'
import showLogisticsList from './components/showLogisticsList.vue'
import { deepClone } from '@/util/util'
export default {
  name: 'LmsAmazonAmazonAmazonDetail',
  components: { collapseTitle, logisticsList },
  props: {
    id: String,
    asin: String,
    variationId: String, // 变体id
    listingStatus: [String, Number],
    isNewPage: String
  },
  data() {
    return {
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'otherInfo', 'templateAttr', 'variantAttr'],
      productLoading: false,
      status: ['Draft', 'Approving', 'Uploading', 'Upload Failed', 'Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling', 'Canceled'],
      statusEdit: [1, 4, 5, 7],
      detaildata: {},
      logisticsList: [],
      isVariation: false
    }
  },
  computed: {
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
  created() {
    this.init()
  },
  methods: {
    getSpuDetailByProduct() {
      getSpuDetailByProduct({}).then(res => {

      })
    },
    init() {
      if (this.asin) {
        this.getAmazonListingOlineDetail()
      } else {
        this.getAmazonListingDetail()
      }
    },
    errorTips(msg) {
      this.$message.error({
        title: '提示',
        message: msg || '暂无数据',
        duration: this.isNewPage ? 0 : 4500
      })
    },
    // 获取在售详情
    getAmazonListingOlineDetail() {
      const listingStatus = this.listingStatus
      console.log('获取在售详情')
      this.productLoading = true
      getAmazonListingOlineDetail({
        listingStatus,
        amazonListingId: this.id, // listing主键ID
        amazonVariantId: this.variationId || undefined // 变体主键ID
      }).then(res => {
        !res.data && this.errorTips(res.msg)
        const data = deepClone(res.data || {})
        const { attributes, bulletPoint, imageUrls } = data.extend
        const $bulletPoint = { 0: '', 1: '', 2: '', 3: '', 4: '' }
        if (bulletPoint) {
          bulletPoint.split(';').filter((item, index) => {
            (index <= 4) && ($bulletPoint[index] = item)
          })
        }
        // 处理图片列表
        const { imgShowList } = addListingHandle.dealPic(res.data.mainImage, imageUrls)
        if (this.detaildata.bulletPoint) {
          this.detaildata.bulletPoint.split(';').map((item, index) => {
            if (index <= 4) {
              bulletPoint[index] = item
            }
            this.detaildata.bulletPoint = bulletPoint
          })
        }
        getSpuDetailByProduct({ data: { lstProductSku: [data.productSku], platformCode: 'US', storeCode: data.account } }).then(rs => {
          const allSku = rs.data ? rs.data[0].lstSku : []
          this.detaildata.amazonDraftSkuVOList.map(item => {
            allSku.map(list => {
              if (item.productSku === list.productSku) {
                item.productName = list.productName
              }
            })
          })
          const { profitMargin, grossProfit, costPrice, condition, standardProdcutIdType, standardProdcutIdValue, logistics } = data.draftSku
          this.detaildata = Object.assign({
            ...data,
            ...data.extend,
            standardPrice: data.price,
            imgList: imgShowList,
            profitMargin,
            grossProfit,
            costPrice,
            condition: condition || data.itemCondition,
            standardProdcutIdType,
            standardProdcutIdValue,
            skuAttrs: data.skuAttrs ? JSON.parse(data.skuAttrs) : [],
            bulletPoint: $bulletPoint
          })
          // 物流
          if (logistics) {
            this.detaildata.logistics = JSON.parse(logistics)
            this.logisticsList = [this.detaildata.logistics]
          }
          // 属性
          this.detaildata.attributes = attributes ? JSON.parse(attributes) : []
          // 获取模板属性
          this.getTemplateAttrList(data.productType, this.detaildata.attributes)
        }).finally(() => {
          this.productLoading = false
        })
      })
    },
    // 获取草稿详情
    getAmazonListingDetail() {
      const listingStatus = this.listingStatus
      const id = this.id
      console.log('获取草稿详情')
      this.productLoading = true
      getAmazonListingDetail({ id, listingStatus }).then(res => {
        if (!res.data) {
          this.errorTips(res.msg)
          return
        }
        const data = deepClone(res.data || {})
        // 卖点
        const bulletPoint = { 0: '', 1: '', 2: '', 3: '', 4: '' }
        if (data.amazonListingExtendVO.bulletPoint) {
          data.amazonListingExtendVO.bulletPoint.split(';').filter((item, index) => {
            (index <= 4) && (bulletPoint[index] = item)
          })
        }
        // 多个子sku
        if (data.listingType === 'Variation') {
          this.isVariation = true
          this.detaildata = Object.assign({
            platformCode: 'AM',
            ...data,
            ...data.amazonDraftVO,
            ...data.amazonListingExtendVO,
            bulletPoint
          })
          delete this.detaildata.amazonDraftVO
          delete this.detaildata.amazonListingExtendVO
          this.detaildata.productSkus = []
          getSpuDetailByProduct({ data: { lstProductSku: [data.productSku], platformCode: 'US', storeCode: data.account } }).then(rs => {
            const allSku = rs.data ? rs.data[0].lstSku : []
            this.detaildata.amazonDraftSkuVOList.map(item => {
              allSku.map(list => {
                if (item.productSku === list.productSku) {
                  item.productName = list.productName
                }
              })
            })
            this.detaildata.amazonDraftSkuVOList.map(item => {
              this.detaildata.productSkus.push(item.productSku)
              // 变体
              if (item.skuAttrs) {
                item.skuAttrs = item.skuAttrs ? JSON.parse(item.skuAttrs) : []
              }
              // 物流
              item.logistics = item.logistics && JSON.parse(item.logistics)
              // 处理图片列表
              const { imgShowList } = addListingHandle.dealPic(item.mainImage, item.extraImages)
              item.imgList = imgShowList
            })
          })
        } else {
          // 单个普通
          this.detaildata = Object.assign({
            platformCode: 'AM',
            ...res.data,
            ...data.amazonDraftSkuVOList[0],
            ...data.amazonDraftVO,
            ...data.amazonListingExtendVO,
            bulletPoint
          })
          delete this.detaildata.amazonDraftSkuVOList
          delete this.detaildata.amazonDraftVO
          delete this.detaildata.amazonListingExtendVO
          // 组合sku
          if (this.detaildata && this.detaildata.combineSku) {
            const comboSku = []
            const combineSku = JSON.parse(this.detaildata.combineSku)
            combineSku && combineSku.map(item => {
              comboSku.push(item.sku + '*' + item.count)
            })
            this.detaildata.combineSku = comboSku.length ? `${this.detaildata.productSku} [ ${comboSku.join(',')} ]` : ''
          }
          // 物流
          if (this.detaildata.logistics) {
            this.detaildata.logistics = JSON.parse(this.detaildata.logistics)
            this.logisticsList = [this.detaildata.logistics]
          }
          // 处理图片列表
          const { imgShowList } = addListingHandle.dealPic(this.detaildata.mainImage, this.detaildata.extraImages)
          this.detaildata.imgList = imgShowList
        }
        // 属性
        this.detaildata.attributes = this.detaildata.attributes ? JSON.parse(this.detaildata.attributes) : []
        // 获取模板属性
        this.getTemplateAttrList(data.productType, this.detaildata.attributes)
      }).finally(() => {
        this.productLoading = false
      })
    },
    // 获取SKU详细信息api
    // getSkuDetailAjax(listingType, productSku, storeCode) {
    //   return new Promise((resolve, reject) => {
    //     const request = listingType === 'Variation' ? getSpuDetailByProduct : getSkuDetailByProduct
    //     this.loading = true
    //     request({ data: { lstProductSku: [productSku], platformCode: 'AM', storeCode } }).then(res => {
    //       if (res.data && res.data[0]) {
    //         const data = res.data[0]
    //         resolve(data)
    //       } else {
    //         this.$message.error(res.msg)
    //       }
    //     }).finally(() => {
    //       this.loading = false
    //     })
    //   })
    // },
    // 选择子SKU图片
    changeImgModal(row, index) {
      this.$modal({
        title: '请选择子SKU图片',
        component: changeChildSkuImg,
        width: '1000px',
        padding: '20px',
        data: {
          data: {
            productSku: row.productSku,
            imgShowList: row.imgList,
            extraImagList: []
          },
          isReadOnly: true
        }
      })
    },
    // 编辑按钮事件
    editHandle() {
      this.$newTab({
        path: this.isVariation ? '/lms/amazon/edit/varylisting' : '/lms/amazon/edit/listing',
        title: this.isVariation ? '编辑Listing' : '编辑单个普通Listing',
        component: this.isVariation ? AddListing : AddVaryListing,
        data: {
          id: this.id,
          asin: this.asin,
          variationId: this.variationId,
          listingStatus: this.listingStatus
        },
        clearCache: true,
        callback: data => {
          if (data) {
            this.init() // 如果是修改的在售，获取详情要传6
          }
        }
      })
    },
    getTemplateAttrList(templateName, attributes) {
      const attrRoute = []
      attributes.filter(item => {
        const route = item.route.substring(0, item.route.lastIndexOf('--'))
        const attrName = item.route.substring(item.route.lastIndexOf('--') + 2)
        const index = attrRoute.findIndex(a => a.attrName === route)
        if (index === -1) {
          attrRoute.push({
            attrName: route,
            children: [
              { attrName, values: item.values, unit: item.unit }
            ]
          })
        } else {
          attrRoute[index].children.push({ attrName, values: item.values, unit: item.unit })
        }
      })
      this.detaildata.attributes = attrRoute
    },
    // 查看子SKU物流列表
    showLogisticsList(row) {
      this.$modal({
        title: '子SKU物流列表',
        component: showLogisticsList,
        width: '1000px',
        data: {
          logistics: row.logistics ? [row.logistics] : [],
          productSku: row.productSku
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
