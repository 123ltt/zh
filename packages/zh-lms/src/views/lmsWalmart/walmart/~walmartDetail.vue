<template>
  <basic-container v-loading="loading">
    <el-form
      ref="dialogForm"
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
              <span class="el-form-item__label">SKU</span>
              <div class="el-form-item__content">{{ detaildata.productSpu || '-' }}</div>
            </el-col>
            <el-col v-if="detaildata.childSku" :span="24">
              <span class="el-form-item__label">子SKU</span>
              <div class="el-form-item__content">{{ detaildata.childSku }}</div>
            </el-col>
            <el-col v-if="detaildata.itemId" :span="11">
              <span class="el-form-item__label">ItemID</span>
              <div class="el-form-item__content">{{ detaildata.itemId }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">平台SKU</span>
              <div class="el-form-item__content">{{ detaildata.sellerSku }}</div>
            </el-col>
            <el-col :span="24">
              <span class="el-form-item__label">标题</span>
              <div class="el-form-item__content">{{ detaildata.name || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">平台类目</span>
              <div class="el-form-item__content">{{ detaildata.category || '-' }}</div>
            </el-col>
            <el-col :span="11">
              <span class="el-form-item__label">仓库</span>
              <div class="el-form-item__content">{{ detaildata.warehouseId || '-' }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="categoryAttr">
          <collapse-title slot="title" title="属性" />
          <el-row v-if="detaildata.otherProperty && detaildata.otherProperty.length" class="attr-box">
            <div v-for="(item, index) in detaildata.otherProperty" :key="index">
              <el-col :span="11">
                <span class="el-form-item__label">{{ item.title }}</span>
                <div class="el-form-item__content">{{ item.value }}</div>
              </el-col>
            </div>
          </el-row>
          <el-row>
            <el-col v-for="(item,index) in variantAttributes" :key="index" :span="11">
              <span class="el-form-item__label">{{ item[0] }}</span>
              <div class="el-form-item__content">{{ item[1] || '-' }}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="variantAttr">
          <collapse-title slot="title" title="价格及库存" />
          <el-row>
            <el-col :span="24">
              <el-table :data="detaildata.variants" row-key="tableKey" border stripe highlight-current-row class="form-table g-table g-table-dense">
                <el-table-column label="子SKU" width="100" fixed>
                  <template slot-scope="{ row }">
                    <el-tooltip :disabled="!row.productName" :content="row.productName" placement="top">
                      <span>{{ row.productSku }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="图片" width="90" fixed>
                  <template slot-scope="{ row, index }">
                    <span class="d-flex">
                      <g-thumb :width="40"
                               :height="40"
                               :url="row.mainImage"
                               class="pic"
                      />
                      <el-button type="text" @click="changeImgModal(row, index)">more</el-button>
                    </span>
                  </template>
                </el-table-column>
                <!-- 变体属性 -->
                <el-table-column v-for="(attr, i) in lstAttrHead" :key="i" min-width="100">
                  <template slot="header">
                    <div>{{ attr.title }}</div>
                  </template>
                  <template slot-scope="{ row }">
                    <span v-if="row.muV[i] && row.muV[i].chi">
                      <div v-for="(v,kI,cI) in row.muV[i].chi" :key="cI">{{ v }}: {{ kI }}</div>
                    </span>
                    <span v-else>{{ row.muV[i] && row.muV[i].value }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="IsPrimaryVariant" prop="isPrimaryVariant" />
                <el-table-column label="SwatchImages" width="90">
                  <template slot-scope="{ row, $index}">
                    <div class="d-flex">
                      <g-thumb :url="row.swatchUrl"
                               :width="40"
                               :height="40"
                      />
                      <el-button type="text" @click="changeSwatchModal(row, $index)">more</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="售价" prop="price" />
                <el-table-column label="库存" prop="stock" />
                <el-table-column label="成本" prop="costPrice" />
                <el-table-column label="利润率" prop="profitRate" />
                <el-table-column label="UPC" min-width="110">
                  <template #header>
                    <div class="has-error">UPC</div>
                    <el-checkbox v-model="detaildata.isFromNumPool" disabled>从号码池获取</el-checkbox>
                  </template>
                  <template v-slot="{row}">
                    <span>{{ row.upc }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="运费 | 重量(lbs)" min-width="80">
                  <template slot-scope="{ row }">
                    {{ row.shippingPrice }} | {{ Number(row.shippingWeight).toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column label="物流">
                  <template slot-scope="{ row }">
                    <el-button type="text" size="mini" @click="showLogisticsList(row)">可发物流</el-button>
                  </template>
                </el-table-column>
                <!-- 子属性 -->
                <el-table-column v-for="(aChi, aI) in chiAttr" :key="aChi.title" min-width="100">
                  <template slot="header">
                    <div>{{ aChi.title }}</div>
                  </template>
                  <template slot-scope="{ row }">
                    <span v-if="row.chV[aI] && row.chV[aI].chi">
                      <div v-for="(v,kI,cI) in row.chV[aI].chi" :key="cI">{{ v }}: {{ kI }}</div>
                    </span>
                    <span v-else>{{ row.chV[aI] && row.chV[aI].value }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="description">
          <collapse-title slot="title" title="描述" />
          <template v-if="detaildata.keyFeatures">
            <el-col v-for="(kItem, kIndex) in detaildata.keyFeatures" :key="kIndex" :span="22">
              <span class="el-form-item__label">Key Features</span>
              <div class="el-form-item__content lh24 description">{{ kItem }}</div>
            </el-col>
          </template>
          <el-col :span="22">
            <span class="el-form-item__label">描述</span>
            <!-- eslint-disable-next-line -->
            <div class="el-form-item__content lh24 description" v-html="detaildata.description" />
          </el-col>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </basic-container>
</template>

<script>
import { getCategoryAttribute, getWalmartDetail, getOptimize } from '@/api/walmart/walmart.js'
import { getChildAttrList } from '@/api/walmart/attribute.js'
import { getSkuDetailByProduct, getSpuDetailByProduct } from '@/api/pms.js'
import { deepClone } from '@/util/util.js'
import { getWareHouseList, formatStr, showListingDetailImage, showSwatchImage, setAttrValue, defaultAttrList, attrFilter } from './addListing.handle.js'
import { changeImgModal, changeSwatchModal } from './variant.handle.js'
import { setProductCost } from '@/views/components/utils.js'
import collapseTitle from '@/views/components/collapseTitle.vue'
import showLogisticsList from '@/views/lmsAmazon/amazon/components/showLogisticsList.vue'
export default {
  name: 'CommonLmsWalmartListWalmartDetail',
  components: { collapseTitle },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      // 折叠面板默认展开
      activeNames: ['baseInfo', 'categoryAttr', 'variantAttr', 'description'],
      detaildata: {}, // 详情
      attrList: [],
      variantAttributes: [],
      isVariation: false,
      lstAttrHead: [], // 多属性表头
      chiAttr: [] // 子属性表头
    }
  },
  created() {
    this.id && this.getWalmartDetail()
  },
  methods: {
    // 获取刊登详情
    getWalmartDetail() {
      this.loading = true
      getWalmartDetail({ id: this.id }).then(res => {
        const data = res.data
        data.name = formatStr(data.name)
        if (!data) {
          this.errorTips(res.msg)
          return false
        }
        let childSku = ''
        if (data.listingType === 'Variation') {
          childSku = data.variants.map(item => item.productSku).join(',')
          this.isVariation = true
        }
        // 类目属性
        // this.detaildata = Object.assign(this.detaildata, JSON.parse(data.variants[0].extendVO.productAttributes))
        // const attrs = JSON.parse(data.variants[0].extendVO.variantAttributes)
        // 动态属性渲染
        // for (const key in attrs) {
        //   if (Array.isArray(attrs[key])) {
        //     attrs[key].forEach((item, i) => {
        //       typeof item === 'string' ? this.variantAttributes.push([key, attrs[key][i]])
        //         : this.variantAttributes.push([key, attrs[key][i]])
        //     })
        //   } else {
        //     this.variantAttributes.push([key, attrs[key]])
        //   }
        // }
        // 描述，key Features, itemId,sellerSku
        const description = data.variants[0].extendVO.description || ''
        const keyFeatures = data.variants[0].extendVO.keyFeatures || ''
        data.keyFeatures = keyFeatures ? JSON.parse(keyFeatures) : ''
        const itemId = data.variants[0].itemId
        const sellerSku = data.variants[0].sellerSku || '-'
        // 仓库
        const countryCode = data.site
        this.getWareHouseList(countryCode, data.overseasWarehouses).then(res => {
          this.detaildata = Object.assign({}, this.detaildata)
        })

        // 变体属性,图片 detaildata.isFromNumPool
        const varAttrObj = {}
        data.variants.forEach((item, i) => {
          item.extendVO.variantAttributes = JSON.parse(item.extendVO.variantAttributes)
          item.mainImage = item.imageUrl
          item.extraImagList = JSON.parse(item.extendVO.imageUrls)
          item.imgShowList = showListingDetailImage(item)
          showSwatchImage(item)
          item.multiAttr = attrFilter(item.multiAttr)
        })

        // 产品属性
        const attributes = {
          normal: {},
          variant: {}
        }
        const { productAttributes, variantAttributes } = data.variants[0].extendVO
        productAttributes && (attributes.normal = JSON.parse(productAttributes))
        variantAttributes && (attributes.variant = variantAttributes)
        this.getCateogAttr(data.category, attributes)

        this.detaildata = { ...data, itemId, sellerSku, attributes, varAttr: varAttrObj, description }

        // 获取pms详情信息
        this.getSkuDetailAjax('WM', data.productSpu, data.accountCode).then(rs => {
          // 子sku
          if (rs.lstSkuCode) {
            childSku = rs.lstSkuCode.map(item => `${item.sku}*${item.count}`).join(',')
          }

          const lstSku = rs.lstSku || [rs]
          // online 重量，成本回显
          const variants = deepClone(this.detaildata.variants)
          variants.forEach((item, i) => {
            const index = lstSku.findIndex(ls => ls.productSku === item.productSku)
            if (index !== -1) {
              item.productName = lstSku[index].productName
            }
          })
          this.detaildata = Object.assign({}, this.detaildata, { variants, childSku })
        })
      }).finally(() => {
        this.loading = false
      })
    },
    getWareHouseList(countryCode, overseasWarehouses) {
      return getWareHouseList(countryCode).then(res => {
        const wareItem = res.find(item => item.warehouseId === overseasWarehouses)
        if (wareItem) {
          this.detaildata.warehouseId = wareItem.warehouseName
          this.getOptimize(wareItem)
        }
      })
    },
    // 获取物流信息批量
    getOptimize(wareItem) {
      const { account, site, accountCode, overseasWarehouses, isOverseasWarehouses } = this.detaildata
      const { virtualWarehouse, type } = wareItem
      const wh = overseasWarehouses ? overseasWarehouses.split(',') : ''
      const warehouse = wh ? wh[wh.length - 1] : ''
      if (account && site && this.detaildata.variants.length) {
        const request = []
        this.detaildata.variants.forEach((item, index) => {
          item.logistics = []
          request.push(getOptimize({
            storeName: account,
            storeCode: accountCode,
            platformCode: 'WM',
            countryCode: site,
            skus: [item.productSku],
            virtualWarehouse, // 虚拟仓编码
            warehouse, // 发货仓库编码
            type, // 发货仓库类型
            isOversea: !!Number(isOverseasWarehouses) // 是否海外仓
          }))
        })
        Promise.all(request).then(res => {
          res.map((item, index) => {
            const data = [{ channelCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '55', priceHigh: '100' }, { channelCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '130', priceHigh: '800' }]
            this.detaildata.variants[index].logistics = item.data || data
          })
        })
      } else {
        this.detaildata.variants.map(item => {
          item.logistics = []
        })
      }
    },
    // 获取SKU详细信息api
    getSkuDetailAjax(platformCode, productSku, storeCode) {
      return new Promise((resolve, reject) => {
        const request = this.isVariation ? getSpuDetailByProduct : getSkuDetailByProduct
        this.loading = true
        request({ data: { lstProductSku: [productSku], platformCode, storeCode } }).then(res => {
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
    getCateogAttr(categoryName, attributes) {
      if (!categoryName) {
        return
      }
      getChildAttrList({ current: 1, size: 999 }, { categoryNameList: [categoryName] }).then(res => {
        let childAttrList = []
        if (res.data.records.length) {
          const { attributeName } = res.data.records[0]
          childAttrList = attributeName.split(';')
        }
        getCategoryAttribute({ categoryName, feedType: 'MP_ITEM' }).then(res => {
          const otherData = defaultAttrList()
          const otherProperty = otherData.filter(item => {
            if (attributes.normal[item.property]) {
              item.value = attributes.normal[item.property]
            }
            return item.value
          })
          this.detaildata = Object.assign({}, this.detaildata, { otherProperty })
          if (res.data) {
            const data = res.data || []
            const { attrList, varAttr, varAttrHead, varChild } = setAttrValue(data, this, attributes, childAttrList)
            this.getVarAttr(varAttr, varAttrHead, varChild)
            const attrData = deepClone(attrList)
            attrData.forEach(item => {
              for (const key in attributes.variant) {
                // 父子属性赋值（单个情况）
                if (item.title === key) {
                  item.childs.forEach(its => {
                    its.value = Object.keys(attributes.variant[key][0])[0] === its.attributeName ? attributes.variant[key][0][Object.keys(attributes.variant[key][0])[0]] : attributes.variant[key][0][Object.keys(attributes.variant[key][0])[1]]
                  })
                }
                // 单个动态属性赋值
                if (item.attributeName === key) {
                  item.value = attributes.variant[key]
                }
              }
            })
            this.detaildata.property = attrData
            this.detaildata = Object.assign({}, this.detaildata, { property: attrData })
          }
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      })
    },
    // 变体属性回显
    getVarAttr(varAttr, varAttrHead, varChild) {
      const variants = deepClone(this.detaildata.variants)
      const multAttr = Object.keys(variants[0].multiAttr)
      this.lstAttrHead = varAttr.filter(item => multAttr.includes(item.attributeName))
      variants.forEach(item => {
        // 多属性
        const { multiAttr } = item
        item.muV = []
        this.handleShow(this.lstAttrHead, multiAttr, item.muV)
        // 子属性
        const { variantAttributes } = item.extendVO
        const chiAttr = Object.keys(variantAttributes).filter(item => varChild.map(v => v.attributeName).includes(item))
        this.chiAttr = varAttr.filter(item => chiAttr.includes(item.attributeName))
        item.chV = []
        this.handleShow(this.chiAttr, variantAttributes, item.chV)
      })
      this.detaildata = Object.assign({}, this.detaildata, { variants })
    },
    handleShow(attrList, obj, arr) {
      attrList.forEach(v => {
        if (obj[v.attributeName]) {
          if (v.type === 'object') {
            const chi = {}
            obj[v.attributeName].forEach(e => {
              for (const k in e) {
                chi[k] = e[k]
              }
            })
            arr.push({ chi })
          } else if (v.type === 'array') {
            arr.push({
              title: v.title,
              value: obj[v.attributeName].join(',')
            })
          } else {
            arr.push({
              title: v.title,
              value: obj[v.attributeName]
            })
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
    // 查看子SKU物流列表
    showLogisticsList(data) {
      this.$modal({
        title: '子SKU物流列表',
        component: showLogisticsList,
        width: '1000px',
        data: {
          logistics: data.logistics,
          productSku: data.productSku
        }
      })
    },
    // 选择子SKU图片
    changeImgModal(item, index) {
      changeImgModal(item, index, this, true, 'isDetail')
    },
    changeSwatchModal(item, index) {
      changeSwatchModal(item, index, this, true, 'isDetail')
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
.el-form-item__label {
  width: 180px;
  display: inline-block;
  word-wrap: break-word;
  &.varAttr{ width: 220px; }
}
.el-form-item__content {
  margin-left: 0;
  padding-right: 10px;
  overflow-x: hidden;
  word-wrap: break-word;
  &.varAttr{ margin-left: 0; }
  ::v-deep p{ margin:0 }
  &.description{
    margin-left: 180px;
  }
}
</style>
