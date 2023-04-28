<template>
  <basic-container>
    <el-form
      ref="dialogForm"
      v-loading="loading"
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
              <span class="el-form-item__label">刊登站点</span>
              <div class="el-form-item__content">{{ detaildata.publishSiteCode || '-' }}</div>
            </el-col>
            <el-col v-if="detaildata.listingType != 'Variation'" :span="11">
              <span class="el-form-item__label">SKU</span>
              <div class="el-form-item__content">{{ detaildata.spu || '-' }}{{ detaildata.combineSku }}</div>
            </el-col>
            <el-col v-else :span="11">
              <span class="el-form-item__label">SPU</span>
              <div class="el-form-item__content">{{ detaildata.spu || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">仓库</span>
              <div class="el-form-item__content">
                <template v-if="warehouseName.length > wareTexShowNum">
                  <el-tooltip class="item" effect="dark" :content="warehouseName" placement="top-start">
                    <span>{{ warehouseShowText }}</span>
                  </el-tooltip>
                </template>
                <span v-else>{{ warehouseName || '-' }}</span>
              </div>
            </el-col>
            <el-col v-if="detaildata.sellerSku" :span="11">
              <span class="el-form-item__label">平台SKU</span>
              <div class="el-form-item__content">{{ detaildata.sellerSku || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">状态</span>
              <div class="el-form-item__content">{{ status[detaildata.productStatus-1] || '-' }}</div>
            </el-col>
            <el-col v-if="detaildata.itemId" :span="11">
              <span class="el-form-item__label">ItemID</span>
              <div class="el-form-item__content">{{ detaildata.itemId || '-' }}</div>
            </el-col>
            <template v-if="detaildata.listingType != 'Variation'">
              <el-col :span="11">
                <span class="el-form-item__label">库存</span>
                <div class="el-form-item__content">{{ detaildata.listingVariations && (detaildata.listingVariations[0].stock||'0') || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">产品通用编码</span>
                <div class="el-form-item__content">{{ detaildata.productIdType || '-' }} / {{ detaildata.listingVariations && detaildata.listingVariations[0].productIdTypeValue || '-' }}</div>
              </el-col>
            </template>
            <el-col :span="11">
              <span class="el-form-item__label">Condition</span>
              <div class="el-form-item__content">{{ detaildata.conditionName || '-' }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">标题</span>
              <div class="el-form-item__content">{{ detaildata.title || '-' }}</div>
            </el-col>
            <el-col :span="24">
              <span class="el-form-item__label">类目</span>
              <div class="el-form-item__content">{{ detaildata.primaryCateId || '-' }} <span class="ms-4">{{ detaildata.primaryCatePath }}</span></div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">类目二</span>
              <div class="el-form-item__content">{{ detaildata.secondCateId || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">店铺类目一</span>
              <div class="el-form-item__content">{{ detaildata.storePrimaryCateId || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">店铺类目二</span>
              <div class="el-form-item__content">{{ detaildata.storeSecondCateId || '-' }}</div>
            </el-col>
            <template v-if="detaildata.listingType != 'Variation'">
              <el-col :span="11">
                <span class="el-form-item__label">销售类型</span>
                <div class="el-form-item__content">{{ detaildata.saleType === '1'?'固定价':'拍卖' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">{{ detaildata.saleType === '1'?'固定价天数':'拍卖天数' }}</span>
                <div class="el-form-item__content">{{ detaildata.listingDuration || '-' }}</div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">EPID</span>
                <div class="el-form-item__content">{{ detaildata.listingVariations && detaildata.listingVariations[0].epid || '-' }}</div>
              </el-col>
            </template>
            <el-col v-else :span="11">
              <span class="el-form-item__label">刊登天数</span>
              <div class="el-form-item__content">{{ detaildata.listingDuration || '-' }}</div>
            </el-col>
            <el-col v-if="detaildata.publishSiteCode&&detaildata.publishSiteCode === 'UK'" :span="11">
              <span class="el-form-item__label">VAT</span>
              <div class="el-form-item__content">{{ detaildata.vatPercent || '-' }}%</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="templateAttr">
          <collapse-title slot="title" title="属性" />
          <el-row v-if="detaildata.listingText && detaildata.listingText.productAttrs">
            <el-col v-for="(item,index) in detaildata.listingText.productAttrs" :key="index" :span="11">
              <span class="el-form-item__title">{{ item.name }}</span>
              <div v-for="(list, i) in item.value" :key="i" class="el-form-item__content">{{ list|| '-' }}</div>
            </el-col>
          </el-row>
          <el-row v-if="detaildata.itemCompatibilityEnabled && detaildata.itemCompatibilityEnabled === 'ByApplication'">
            <el-col :span="11">
              <span class="el-form-item__title">Compatibility</span>
              <div class="el-form-item__content">{{ compatibilityTemplateName }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="generalOption">
          <collapse-title slot="title" title="常规选项" />
          <div class="el-form-item tr">
            <el-button type="primary" size="mini" @click="viewOption">查看常规项</el-button>
          </div>
          <el-row>
            <el-col :span="11">
              <span class="el-form-item__label">支付模板</span>
              <div class="el-form-item__content">{{ detaildata.paymentInfo && detaildata.paymentInfo.paymentProfileName ? detaildata.paymentInfo.paymentProfileName : '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">退货模板</span>
              <div class="el-form-item__content">{{ detaildata.returnInfo && detaildata.returnInfo.returnProfileName ? detaildata.returnInfo.returnProfileName : '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">买家要求</span>
              <div class="el-form-item__content">{{ detaildata.buyerRequirementInfo && detaildata.buyerRequirementInfo.buyerRequirementProfileName ? detaildata.buyerRequirementInfo.buyerRequirementProfileName : '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">运输模板</span>
              <div class="el-form-item__content">{{ detaildata.shippingInfo && detaildata.shippingInfo.shippingProfileName ? detaildata.shippingInfo.shippingProfileName : '-' }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item v-if="listingType === 'Variation'" name="variantAttr">
          <collapse-title slot="title" title="变体信息" />
          <el-row>
            <el-col :span="24">
              <variantAttrTable :listing-variations="detaildata.listingVariations" :detaildata="detaildata" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="otherInfo">
          <collapse-title slot="title" title="其它信息" />
          <el-row>
            <el-col :span="24">
              <span class="el-form-item__label">物流</span>
              <div v-if="detaildata.logical" class="el-form-item__content mb-3">
                <logicalsList :logicals-list="detaildata.logical.cost ? [detaildata.logical] : []" />
              </div>
            </el-col>
            <template v-if="listingType !== 'Variation'">
              <el-col :span="11">
                <span class="el-form-item__label">重量(g)</span>
                <div class="el-form-item__content">{{ detaildata.logical && detaildata.logical.weight }}
                </div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">成本</span>
                <div class="el-form-item__content">{{ detaildata.listingVariations && detaildata.listingVariations[0].costPrice || '-' }}
                </div>
              </el-col>

              <!-- 固定价 -->
              <el-col v-if="detaildata.saleType === '1'" :span="11">
                <!-- test -->
                <span class="el-form-item__label">刊登实际利润率</span>
                <div class="el-form-item__content">{{ detaildata.listingVariations && detaildata.listingVariations[0].actualProfitRate || '-' }}
                </div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">{{ detaildata.saleType === '1'?'售价':'起拍价' }}</span>
                <div class="el-form-item__content">{{ detaildata.listingVariations && detaildata.listingVariations[0].startPrice }}
                </div>
              </el-col>
              <!-- 一口价 -->
              <el-col v-if="detaildata.saleType === '2'" :span="11">
                <span class="el-form-item__label">一口价</span>
                <div class="el-form-item__content">{{ detaildata.listingVariations && detaildata.listingVariations[0].buyItNowPrice || '-' }}
                </div>
              </el-col>
              <el-col :span="11">
                <span class="el-form-item__label">销售利润率</span>
                <div class="el-form-item__content">{{ detaildata.saleProfitRate }}
                </div>
              </el-col>
            </template>
            <el-col :span="24">
              <span class="el-form-item__label">图片</span>
              <div class="el-form-item__content mb-3">
                <ul v-if="detaildata.productImageUrls && detaildata.productImageUrls.imgShowList && detaildata.productImageUrls.imgShowList.length" class="el-upload-list el-upload-list--picture-card">
                  <li v-for="(item, index) in detaildata.productImageUrls.imgShowList" :key="index" class="el-upload-list__item">
                    <div>
                      <g-thumb :width="110" :height="110" :url="item.imageUrl" />
                      <div class="el-upload-list__item-btn">
                        <el-checkbox v-model="item.isPrime" label="主图" class="me-3" disabled />
                        <el-checkbox v-model="item.isExtra" label="副图" disabled />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">描述模板</span>
              <div class="el-form-item__content">{{ detaildata.descTemplateName || '-' }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">描述</span>
              <!-- <div class="el-form-item__content lh24 description" v-html="detaildata.listingText&&detaildata.listingText.description" /> -->
              <div class="el-form-item__content lh24 description">
                <iframe src="about:blank" />
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </basic-container>
</template>

<script>
import { ebayDetails } from '@/api/ebay/ebay'
import collapseTitle from './components/collapseTitle.vue'
import variantAttrTable from './components/variantAttrTable.vue' // 变体table
import * as addListingHandle from './components/addEbayListing.handle.js'
import logicalsList from './components/logicalsList.vue'
import { getSkuDetailByProduct, getSpuDetailByProduct } from '@/api/pms.js'
import { getCategoryList, getCompatibilityTemplateList } from '@/api/ebay/category.js'
import AddListing from './addListing.vue'
import viewGeneralOption from './components/generalOption/viewGeneralOption'
export default {
  name: 'LmsLmsEbayEbayListingDetail',
  components: { collapseTitle, variantAttrTable, logicalsList },
  props: {
    id: String,
    itemId: String,
    listingType: String,
    isNewPage: String
  },
  data() {
    return {
      loading: true,
      warehouseName: '',
      warehouseShowText: '',
      wareTexShowNum: 20, // 仓库名超过20字就...，鼠标悬浮显示所有
      listingDurationList: addListingHandle.listingDurationList,
      compatibilityTemplateName: '', // 车型库模板
      logisticsLoading: false,
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'otherInfo', 'templateAttr', 'variantAttr', 'generalOption'],
      status: ['Draft', 'Approving', 'Uploading', 'Upload Failed', 'Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling', 'Canceled'],
      statusEdit: [1, 4, 5, 7],
      detaildata: {} // 详情

    }
  },
  mounted() {
    this.id && this.getEbayDetails()
    const w = this.$el.querySelector('iframe')
    w.contentDocument.body && (w.contentDocument.body.innerHTML = this.detaildata.listingText ? this.detaildata.listingText.description : '')
    // w.height = 342 + 'px'
    w.height = document.documentElement.clientHeight
    w.width = 942.59 + 'px'
  },
  methods: {
    // 仓库名超过20字就...，鼠标悬浮显示所有
    delWarehouseShowText(name) {
      let text = name || ''
      if (name) {
        if (name.length > this.wareTexShowNum) {
          text = name.substring(0, this.wareTexShowNum) + '...'
        }
      }
      return text
    },
    // 获取listing详情
    getEbayDetails() {
      this.loading = true
      ebayDetails(this.id).then(res => {
        if (!res.data) {
          this.errorTips(res.msg)
          return
        }
        const data = res.data
        const request = data.listingType === 'Variation' ? getSpuDetailByProduct : getSkuDetailByProduct
        const params = {
          lstProductSku: [data.spu],
          platformCode: 'EB',
          storeCode: data.storeCode,
          siteCode: data.publishSiteCode
        }
        request({ data: params }).then(rs => {
          if (data.listingType === 'Variation') {
            data.listingVariations.forEach(item => {
              const skuObj = rs.data && rs.data[0].lstSku.find(sku => sku.productSku === item.productSku)
              if (skuObj) {
                item.weight = skuObj.netWeight
                item.productName = skuObj.productName
                item.costPrice = skuObj.productCost// 回显成本
                // item.stock = item.stock// 回显库存
              }
            })
          }
          addListingHandle.getWareHouseList(data.publishSiteCode, data.warehouseId, 'isDetail').then(res => {
            this.warehouseName = res
            this.warehouseShowText = this.delWarehouseShowText(res)
          })
          this.findPrimaryCate(data)
          data.logical = data.logical ? JSON.parse(data.logical) : {}
          if (data.listingText) {
            data.listingText.productAttrs = JSON.parse(data.listingText.productAttrs)
            data.productImageUrls = addListingHandle.showListingDetailImage(data.listingText.productImageUrls)
          }
          data.listingVariations.forEach(item => {
            item.variationPictures = addListingHandle.showListingDetailImage(item.variationPictures)
            if (item.listingSpecs) {
              item.listingSpecs = JSON.parse(item.listingSpecs)
            }
          })
          this.detaildata = data
          const w = this.$el.querySelector('iframe')
          w.contentDocument.body && (w.contentDocument.body.innerHTML = this.detaildata.listingText ? this.detaildata.listingText.description : '')
          w.height = document.documentElement.clientHeight
          w.width = 942.59 + 'px'
        }).finally(() => {
          this.loading = false
        })
      })
    },
    findPrimaryCate(data) {
      if (!data.primaryCateId) return
      getCategoryList({ size: -1, platCategoryId: data.primaryCateId, site: data.publishSiteCode }).then(res => {
        if (res.data) {
          const list = res.data.records
          list.some((item, i) => {
            if (item.leafCategory && item.platCategoryId === data.primaryCateId && item.itemCompatibilityEnabled === 'ByApplication') {
              data.itemCompatibilityEnabled = item.itemCompatibilityEnabled
              this.getCompatibilityTemplateList(data)
            }
          })
        }
      })
    },
    // 获取车型库模板列表
    getCompatibilityTemplateList(data) {
      const { primaryCateId, publishSiteCode, listingVariations, itemCompatibilityEnabled } = data
      const skus = listingVariations.map(item => item.productSku)
      if (!skus.length || !primaryCateId || !publishSiteCode || !itemCompatibilityEnabled) return
      this.loading = true
      getCompatibilityTemplateList({
        platCategoryId: primaryCateId,
        siteCode: publishSiteCode,
        skus
      }).then(res => {
        const list = res.data
        list.find(item => {
          if (item.id === data.compatibilityTemplateId) {
            this.compatibilityTemplateName = item.name
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    errorTips(msg) {
      this.$message.error({
        title: '提示',
        message: msg || '暂无数据',
        duration: this.isNewPage ? 0 : 4500
      })
    },
    // 编辑按钮事件
    editHandle() {
      this.$newTab({
        path: this.isVariation ? '/lms/ebay/edit/varylisting' : '/lms/ebay/edit/listing',
        title: this.isVariation ? '编辑Listing' : '编辑单个普通Listing',
        component: AddListing,
        data: {
          id: this.id,
          productStatus: this.productStatus,
          listingType: this.listingType
        },
        clearCache: true,
        callback: data => {
          if (data) {
            this.init(6) // 如果是修改的在售，获取详情要传6
          }
        }
      })
    },
    viewOption() {
      const row = { ...this.detaildata }
      this.$modal({
        title: '查看常规项',
        component: viewGeneralOption,
        width: '1000px',
        data: {
          row: row
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.el-upload-list__item, .el-upload--picture-card{
  width: 112px !important;
  height: 112px !important;
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
    ::v-deep .el-checkbox__label{
      padding-left: 4px;
    }
}
.el-collapse {
border-top: 0;
}
::v-deep .el-collapse-item__wrap, ::v-deep .el-collapse-item__header {
border-bottom: 0;
}
::v-deep .el-collapse-item__content {
padding-bottom: 0;
color: #999;
line-height: 24px !important;
padding-top: 8px;
}
.el-form-item__label {
width: 180px;
display: inline-block;
}
.el-form-item__title {
text-align: right;
vertical-align: middle;
float: left;
font-size: 1rem;
color: #606266;
line-height: 40px;
padding: 0 12px 0 0;
box-sizing: border-box;
min-width: 180px;

}
.el-form-item__content {
margin-left: 180px;
&>p{
margin:0 !important
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
</style>
