<template>
  <basic-container>
    <el-form
      ref="dialogForm"
      v-loading="productLoading"
      size="mini"
      class="form-col no-message"
      label-width="110px"
    >
      <el-collapse v-model="activeNames" class="add-linsting-box">
        <el-collapse-item name="baseInfo">
          <collapse-title slot="title" title="基本信息" />
          <el-row>
            <el-col :span="11">
              <span class="el-form-item__label">店铺名称</span>
              <div class="el-form-item__content">{{ detaildata.account || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">{{ isVariation ? 'SPU' : 'SKU' }}</span>
              <div class="el-form-item__content">
                <span>{{ detaildata.productSpu }}</span>
              </div>
            </el-col>
            <el-col v-if="detaildata.childSkus" :span="11">
              <span class="el-form-item__label">子SKU</span>
              <div class="el-form-item__content">{{ detaildata.childSkus || '-' }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">标题</span>
              <div class="el-form-item__content lh24">{{ detaildata.subject || '-' }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">平台类目</span>
              <div class="el-form-item__content">{{ detaildata.categoryId || '-' }} - {{ detaildata.categoryName || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">产品分组</span>
              <div class="el-form-item__content lh24">{{ detaildata.groupName || '-' }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="categoryAttr">
          <collapse-title slot="title" title="属性及图片" />
          <el-row v-if="detaildata.property && detaildata.property.length" :gutter="10" class="attr-box">
            <el-col v-for="(item, index) in detaildata.property" :key="index" :span="11">
              <span class="el-form-item__label">{{ item.names }}</span>
              <div class="el-form-item__content lh24">{{ item.otherValue || item.attrValue }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <span class="el-form-item__label">产品图片</span>
              <div class="el-form-item__content">
                <ul class="el-upload-list el-upload-list--picture-card">
                  <li v-for="(item, index) in detaildata.imageUrlsList" :key="index" class="el-upload-list__item">
                    <g-thumb :width="110"
                             :height="110"
                             :url="item"
                    />
                  </li>
                </ul>
              </div>
            </el-col>
            <el-col>
              <span class="el-form-item__label">营销图片</span>
              <div class="el-form-item__content">
                <ul class="el-upload-list el-upload-list--picture-card">
                  <li v-for="(item, index) in detaildata.marketImages" :key="index" class="el-upload-list__item">
                    <div>
                      <g-thumb :width="110"
                               :height="110"
                               :url="item.url"
                      />
                      <div class="el-upload-list__item-btn noproduct">
                        <span v-if="item.imageType === 2" class="text">白底图</span>
                        <span v-if="item.imageType === 1" class="text">场景图</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="price">
          <collapse-title slot="title" title="价格及库存" />
          <el-row>
            <el-col :span="6">
              <span class="el-form-item__label">最小计量单位</span>
              <div class="el-form-item__content">{{ detaildata.productUnitName }}</div>
            </el-col>
            <el-col :span="10">
              <span class="el-form-item__label">销售方式</span>
              <div v-if="!detaildata.packageType" class="el-form-item__content">打包出售
                <span class="ms-3">每包{{ detaildata.lotNum }}{{ detaildata.productUnitName }}</span>
              </div>
              <div v-else class="el-form-item__content">{{ detaildata.productUnitName }}</div>
            </el-col>
          </el-row>
          <template v-for="item in skuAttrList">
            <el-form-item :key="item.id" :label="item.names" prop="" label-width="180px" class="mb-3">
              {{ item.valueName || '-' }}
              <div v-if="item.customizedName || item.customizedPic">
                <div class="d-inline-block yy">
                  <customized :data="item"
                              :customized="customized"
                              :is-read-only="true"
                  />
                </div>
              </div>
            </el-form-item>
          </template>
          <el-row :gutter="8" class="mb-3">
            <el-col v-if="detaildata.variants" :span="24">
              <el-table :data="detaildata.variants"
                        row-key="skuId"
                        border
                        stripe
                        highlight-current-row
                        class="form-table g-table g-table-dense"
              >
                <el-table-column label="发货地" prop="skuPropertyName" width="60">
                  <template slot-scope="{ row }">{{ showAttrName2(row) }}</template>
                </el-table-column>
                <el-table-column label="仓库" min-width="60">
                  <template slot-scope="{ row }">
                    <div class="py-1">{{ row.warehouseName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="商品编码" min-width="70">
                  <template slot-scope="{ row }">
                    <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
                      <span>{{ row.productSku }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <template v-for="(attr, i) in lstAttrHead" text="变体属性">
                  <el-table-column v-if="attr.attributeId !== 200007763" :key="i" :label="attr.names" prop="skuPropertyName" min-width="80">
                    <template slot-scope="{ row }">{{ showAttrName(row, i) }}</template>
                  </el-table-column>
                </template>
                <el-table-column label="库存" min-width="60">
                  <template slot="header"><span class="has-error">库存</span></template>
                  <template slot-scope="{ row }">
                    {{ row.ipmSkuStock }}
                  </template>
                </el-table-column>
                <el-table-column label="零售价" min-width="80">
                  <template slot="header">
                    <span class="has-error">零售价</span>
                  </template>
                  <template slot-scope="{ row }">
                    {{ row.skuPrice }}
                  </template>
                </el-table-column>
                <el-table-column label="利润率" min-width="60">
                  <template slot="header"><span class="has-error">利润率</span></template>
                  <template slot-scope="{ row }">{{ row.profitRate }}</template>
                </el-table-column>
                <el-table-column label="利润" min-width="60">
                  <template slot="header"><span class="has-error">利润</span></template>
                  <template slot-scope="{ row }">
                    {{ row.profitAmount }}
                  </template>
                </el-table-column>
                <el-table-column label="运费" min-width="40">
                  <template slot-scope="{ row }">
                    <el-button type="text" @click="showLogisticsList(row)">{{ row.logisticsInfo && row.logisticsInfo.cost * 1 || '-' }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="价格/库存参考信息" min-width="80">
                  <template v-if="row.logisticsInfo" slot-scope="{ row }">
                    采购成本：{{ row.logisticsInfo.costPrice * 1 }}<br>
                    重量：{{ row.logisticsInfo.packWeight }}<br>
                    <span v-if="isOverseasWarehouse({...row.logisticsInfo, warehouseId: row.warehouseId})">
                      海运：{{ row.logisticsInfo.oceanPriceRange }}<br>
                      空运：{{ row.logisticsInfo.airPriceRange }}
                    </span>
                    <span v-else>本地：{{ row.logisticsInfo.priceRange }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="3" />
          </el-row>
          <el-col :span="22">
            <span class="el-form-item__label">批发价</span>
            <div class="el-form-item__content">
              购买数量 <el-input v-model="detaildata.bulkOrder" size="mini" class="w90" disabled /> 件及以上时，每件价格在零售价的基础上减免
              <el-input v-model="detaildata.bulkDiscount" size="mini" class="w90" disabled /> %</div>
          </el-col>
          <el-col :span="6">
            <span class="el-form-item__label">区域调价</span>
            <div class="el-form-item__content">{{ detaildata.nationQuoteCountry }}</div>
          </el-col>
          <el-col :span="10">
            <span class="el-form-item__label">区域调价模板</span>
            <div class="el-form-item__content">{{ detaildata.nationQuoteTemplateName }}</div>
          </el-col>
        </el-collapse-item>
        <el-collapse-item name="othInfo">
          <collapse-title slot="title" title="其它信息" />
          <el-row>
            <el-col :span="22">
              <span class="el-form-item__label">详细描述</span>
              <div class="el-form-item__content">
                <detail-view :detail="detaildata.detail" />
              </div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">库存扣减方式</span>
              <div v-if="detaildata.reduceStrategy === 'place_order_withhold'" class="el-form-item__content">下单减库存</div>
              <div v-else class="el-form-item__content">付款减库存</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">发货期</span>
              <div class="el-form-item__content">{{ detaildata.deliveryTime }} 天</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">包装后重量</span>
              <div class="el-form-item__content">{{ detaildata.grossWeight }} 公斤/件
                <el-checkbox v-if="detaildata.isPackSell" v-model="detaildata.isPackSell" class="ms-3" disabled>自定义计重</el-checkbox>
                <span v-if="detaildata.isPackSell">
                  买家购买 <el-form-item class="d-inline-block baseUnit" label-width="0" prop="baseUnit"><el-input v-model="detaildata.baseUnit" disabled class="w90" /></el-form-item> 件以内，按单件重计运费，
                  在此基础上，买家每多买 <el-form-item class="d-inline-block" label-width="0" prop="addUnit"><el-input v-model="detaildata.addUnit" disabled class="w90" /></el-form-item>
                  件，重量增加 <el-form-item class="d-inline-block" label-width="0" prop="addWeight"><el-input v-model="detaildata.addWeight" disabled class="w90" /></el-form-item> kg
                </span>
              </div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">包装后的尺寸</span>
              <div class="el-form-item__content">
                <span class="me-3">长 {{ detaildata.packageLength }}</span><span class="me-3">宽 {{ detaildata.packageWidth }}</span><span class="me-3">高 {{ detaildata.packageHeight }}</span>
                <span class="me-3">单位：cm，每件 {{ detaildata.packageLength * detaildata.packageWidth * detaildata.packageHeight || 0 }} cm³</span>
              </div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">运费模板</span>
              <div class="el-form-item__content">{{ detaildata.freightTemplateName }}</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">服务模板</span>
              <div class="el-form-item__content">Service Template for New Sellers</div>
            </el-col>
            <el-col :span="22">
              <span class="el-form-item__label">产品信息模板</span>
              <div class="el-form-item__content">{{ detaildata.detailTemplateName }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-button v-if="[1, 4, 5, 7].includes(detaildata.listingStatus)" type="primary" size="mini" class="isFixed" @click="goLink">编辑</el-button>
      <div style="display: none;">
        <moduleContent v-if="productDetailTemplateShow.list"
                       ref="productTemp"
                       :product="productDetailTemplateShow"
        />
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import collapseTitle from './components/collapseTitle.vue'
import AddListing from './addListing.vue'
import moduleContent from './components/detail/moduleContent.vue'
import { getAliexpressListingDetail, getProductUnit } from '@/api/aliExpress/aliexpress.js'
import { getCateogAttr } from '@/api/aliExpress/category.js'
import { getAllPriceAdjustTemplate, getFreightTemp, getProductTempList, productTempDetail } from '@/api/aliExpress/temp.js'
import { getProductGroup } from '@/api/aliExpress/product.js'
import { getSkuDetailByProduct, getSpuDetailByProduct } from '@/api/pms.js'
import * as addListingHandle from './components/aliExpress.handle.js'
import * as detailHandel from './components/detail/detail.js'
import DetailView from './components/detail/detailView.vue'
import showLogisticsList from '@/views/components/logisticsList/showLogisticsList.vue'
import customized from './components/customized.vue'
import { deepClone } from '@/util/util'

export default {
  name: 'LmsAliExpressAliExpressListingDetail',
  components: { collapseTitle, DetailView, moduleContent, customized },
  props: {
    id: String,
    isNewPage: String
  },
  data() {
    return {
      isOverseasWarehouse: addListingHandle.isOverseasWarehouse,
      carAttrTemplate: addListingHandle.carAttrTemplate, // 车型库
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'categoryAttr', 'price', 'othInfo'],
      productLoading: false,
      detaildata: {
        variants: []
      }, // 详情
      productDetailTemplateShow: { layoutColumn: '', layoutRow: '', list: [], type: '' }, // 所选产品模板显示
      isVariation: false,
      unitList: [],
      skuAttrList: [],
      sendPlace: null,
      lstAttrHead: [],
      countryList: addListingHandle.countryList,
      warehouseList: [],
      customized: {}
    }
  },
  created() {
    this.id && this.getAliexpressListingDetail()
  },
  methods: {
    // 查看子SKU物流列表
    showLogisticsList(data) {
      this.$modal({
        title: '子SKU物流列表',
        component: showLogisticsList,
        width: '1000px',
        data: {
          logistics: data.logisticsInfo ? [data.logisticsInfo] : [],
          productSku: data.productSku
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
    // 获取listing详情
    getAliexpressListingDetail() {
      this.productLoading = true
      getAliexpressListingDetail({ id: this.id }).then(res => {
        !res.data && this.errorTips(res.msg)
        const detailInfo = addListingHandle.detailToJson(res.data)
        const data = Object.assign({}, res.data, detailInfo)
        this.getSkuDetailAjax(data.listingType, data.productSpu, data.accountCode).then(rs => {
          data.variants.forEach(item => {
            item.logisticsInfo = item.logisticsInfoJson ? JSON.parse(item.logisticsInfoJson) : ''
          })
          if (data.listingType.toLowerCase() === 'variation') {
            this.isVariation = true
            data.childSkus = data.variants.map(item => item.productSku).join(',')
            data.variants.forEach(item => {
              const i = rs.lstSku.findIndex(s => s.productSku === item.productSku)
              if (i > -1) {
                item.productName = rs.lstSku[i].productName
              }
            })
          } else {
            this.isVariation = false
            data.variants.forEach(item => {
              item.productName = rs.productName
            })
            if (rs.lstSkuCode) {
              data.childSkus = rs.lstSkuCode.map(item => `${item.sku}*${item.count}`).join(',')
            }
          }
          if (this.isVariation && this.hasSku) {
            data.skuList = rs.lstSku.map(item => {
              return item
            })
          }
          this.detaildata = data

          const {
            account, categoryId, accountCode, productUnit, nationQuoteTemplateId, freightTemplateId,
            groupId, groupIds, imageUrls, detailTemplateName, marketImages, property, variants,
            nationQuoteCountry
          } = this.detaildata
          this.getProductUnit(productUnit)
          this.getCateogAttr(categoryId, account, property, variants) // 类目属性
          this.getAllPriceAdjustTemplate(nationQuoteTemplateId, account)
          this.getFreightTemp(account, accountCode, freightTemplateId)
          this.getProductTempList(account, detailTemplateName)
          this.getProductGroup(account, groupId, groupIds)
          // 区域调价
          let country
          if (nationQuoteCountry && nationQuoteCountry.length) {
            country = this.countryList.filter(item => nationQuoteCountry.includes(item.code)).map(val => val.eName).join(',')
          }
          this.detaildata.nationQuoteCountry = country || '-'
          this.detaildata.imageUrlsList = imageUrls.split(';')
          this.detaildata.marketImages = marketImages || []
        })
      }).finally(() => {
        this.productLoading = false
      })
    },
    // 获取SKU详细信息api
    getSkuDetailAjax(listingType, productSku, storeCode) {
      return new Promise((resolve, reject) => {
        const request = listingType.toLowerCase() === 'variation' ? getSpuDetailByProduct : getSkuDetailByProduct
        this.loading = true
        request({ data: { lstProductSku: [productSku], platformCode: 'SM', storeCode } }).then(res => {
          if (res.data && res.data[0]) {
            const data = res.data[0]
            resolve(data)
          } else {
            this.$message.error(res.msg)
          }
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 获取单位列表
    getProductUnit(productUnit) {
      getProductUnit().then(res => {
        this.unitList = res.data
        Object.keys(this.unitList).forEach(item => {
          if (Number(item) === productUnit) {
            this.$set(this.detaildata, 'productUnitName', this.unitList[item])
          }
        })
      })
    },
    // 获取类目属性列表
    getCateogAttr(categoryId, account, property, variants) {
      if (!categoryId || !account) return
      getCateogAttr({ categoryId, account }).then(res => {
        if (res.data) {
          const data = res.data || []
          const { attrList, varAttr } = addListingHandle.setAttrValue(data, property, { baseProductInfo: { ...this.detaildata }, isDetail: true })
          // 类目属性
          const propertyList = attrList.filter(item => Array.isArray(item.value) ? item.value && item.value.length : item.value)
          propertyList.forEach(v => {
            if (v.diy) {
              v.names = v.name
              v.attrValue = v.value
            } else {
              if (Array.isArray(v.value)) {
                v.attrValue = []
                v.value.forEach(arr => {
                  const item = v.valueJson.find(e => e.id === arr)
                  item && v.attrValue.push(item.label)
                })
                v.attrValue = v.attrValue.join(',')
              } else {
                const item = v.valueJson.find(e => e.id === v.value)
                v.attrValue = item ? item.label : v.value
                if (item && addListingHandle.otherK.includes(item.label)) {
                  item.otherValue = v.otherValue
                }
              }
            }
          })
          this.detaildata.property = propertyList
          // 多变体属性
          this.skuAttrList = varAttr
          // 发货地获取仓库列表
          varAttr.find(item => {
            if (item.attributeId === 200007763) {
              const countryCode = item.valueJson.map(v => v.label)
              addListingHandle.getWareHouseList(countryCode).then(res => {
                addListingHandle.warehouse.list = res
                // 价格及库存回显
                const skuProperty = {}
                const variantVOList = variants.map((sku, index) => {
                  const property = deepClone(sku.skuProperty)
                  const primarySkuProperty = deepClone(property) || []
                  const skuPropertyArr = []
                  property.forEach(item => {
                    if (skuProperty[item.skuPropertyId]) {
                      skuProperty[item.skuPropertyId].push(item.propertyValueId)
                    } else {
                      skuProperty[item.skuPropertyId] = [item.propertyValueId]
                    }
                  })
                  this.skuAttrList.forEach(item => {
                    if (skuProperty[item.attributeId]) {
                      item.valueName = []
                      item.value = [...new Set(skuProperty[item.attributeId])]
                      item.value.forEach(e => {
                        const values = item.valueJson.find(val => val.id === e)
                        values && item.valueName.push(values.label)
                      })
                      item.valueName = item.valueName.join(',')
                      if (item.attributeId === 200007763) {
                        this.sendPlace = item
                      } else {
                        // 设置自定义变体属性回显
                        primarySkuProperty.find(y => {
                          if (y.skuPropertyId === item.attributeId) {
                            return item.valueJson.find(u => {
                              if (u.id === y.propertyValueId && (y.propertyValueDefinitionName || y.skuImage)) {
                                this.customized[u.id] = Object.assign({}, this.customized[u.id], {
                                  attributeId: item.attributeId,
                                  customizedName: y.propertyValueDefinitionName,
                                  customizedPic: y.skuImage,
                                  skuProperty: u.label,
                                  skuPropertyId: u.id

                                })
                                return u
                              }
                            })
                          }
                        })

                        skuPropertyArr.push(item)
                      }
                    }
                  })
                  sku.index = index
                  sku.skuProperty = skuPropertyArr
                  sku.sendPlaceName = this.showAttrName2(sku)
                  sku.warehouseList = addListingHandle.warehouse.list[sku.sendPlaceName]
                  // 编辑回显设置变体仓库类型
                  const warehouseDetail = sku.warehouseList?.find(item => item.warehouseId === sku.warehouseId)
                  sku.warehouseName = warehouseDetail && warehouseDetail.warehouseName
                  return sku
                })
                this.lstAttrHead = variantVOList[0].skuProperty
                this.detaildata.variants = variantVOList
              })
            }
          })
        }
      })
    },
    // 非发货地变体属性名显示
    showAttrName(row, i) {
      let currAttrValId = ''
      let currAttrValName = ''
      const skuIdArr = row.skuId.split(';')
      skuIdArr.filter(item => {
        const currAttr = item.split(':')
        if (this.lstAttrHead[i].attributeId === Number(currAttr[0])) {
          currAttrValId = currAttr[1]
        }
      })
      this.lstAttrHead[i].valueJson.findIndex(item => {
        if (item.id === Number(currAttrValId)) {
          currAttrValName = item.label
        }
      })
      return currAttrValName
    },
    // 发货地值显示
    showAttrName2(row) {
      if (!this.sendPlace) return
      let currAttrValId = ''
      let currAttrValName = ''
      const skuIdArr = row.skuId.split(';')
      skuIdArr.filter(item => {
        const currAttr = item.split(':')
        if (this.sendPlace.attributeId === Number(currAttr[0])) {
          currAttrValId = currAttr[1]
        }
      })
      this.sendPlace.valueJson.findIndex(item => {
        if (item.id === Number(currAttrValId)) {
          currAttrValName = item.label
        }
      })
      return currAttrValName
    },
    // 获取区域调价模板列表
    getAllPriceAdjustTemplate(id, account) {
      getAllPriceAdjustTemplate({ account }).then(res => {
        const data = res.data
        const item = data.find(item => item.id === id)
        this.detaildata.nationQuoteTemplateName = (item && item.name) || '-'
      })
    },
    // 获取运费模板
    getFreightTemp(account, accountCode, id) {
      account && getFreightTemp({ size: 99999, account, accountCode }).then(res => {
        const data = res.data.records
        const item = data.find(item => item.templateId === id)
        this.detaildata.freightTemplateName = (item && item.templateName) || '-'
      })
    },
    // 获取产品信息模板
    getProductTempList(account, detailTemplateName) {
      account && getProductTempList({ account }).then(res => {
        const type = {
          1: '-平台',
          2: '-自定义'
        }
        res.data.find(item => {
          if ((item.templateName + type[item.type]) === detailTemplateName) {
            item.type === 1 && this.getProductDetailTemp(item)
            return item
          }
        })
      })
    },
    // 获取平台的产品信息模板详情
    getProductDetailTemp({ id, type, templateId }) {
      productTempDetail({ id }).then(res => {
        this.productDetailTemplateShow = { layoutColumn: 4, layoutRow: 2, type, list: res.data.moduleContents, templateId }
        this.$nextTick(() => {
          this.detaildata.detail.moduleList.filter((item, i) => {
            if (item.type === 'productTempHtml') {
              const descriptionHtml = this.$refs.productTemp.$el.innerHTML
              this.detaildata.detail.moduleList.splice(i, 1, {
                ...detailHandel.productTempHtml(descriptionHtml)
              })
            }
          })
        })
      })
    },
    // 获取产品分组：http://showdoc.zehui.local/web/#/14?page_id=1308
    getProductGroup(account, groupId) {
      account && groupId && getProductGroup({ account }).then(res => {
        const originData = res.data
        const item = originData.find(item => item.groupId === groupId)
        this.detaildata.groupName = (item && item.groupName) || '-'
      })
    },
    goLink() {
      const { id, itemId } = this.detaildata
      this.$newTab({
        path: '/lms/aliexpress/edit/varylisting',
        title: '编辑Listing',
        component: AddListing,
        clearCache: true,
        data: { id, itemId },
        callback: refresh => {
          refresh && this.getAliexpressListingDetail()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.w90{
  width: 90px;
}
.w50{
  width: 50px;
}
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
::v-deep {
  .el-collapse-item__wrap, .el-collapse-item__header {
    border-bottom: 0;
  }
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
  ::v-deep div{
    border-radius: 4px;
  }
}
.el-upload-list__item {
    width: 110px;
    height: 110px;
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
  padding: 10px 0;
}
.noproduct{
  ::v-deep .el-checkbox__label {
    padding-left: 2px;
    line-height: 0;
  }
  .el-checkbox {
    margin-right: 10px;
  }
}
.desc-form{
  width: 85%;
}
.sku-attr{
  width: 50%;
  display: inline-block;
}
.isFixed{
  position: fixed;
  bottom: 10px;
  right: 25px;
  z-index: 101;
}
.text{
  color: #666;
  font-size: 12px;
}
</style>
