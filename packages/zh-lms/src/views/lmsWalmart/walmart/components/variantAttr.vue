<template>
  <el-form ref="form" v-loading="loading" :model="form" size="mini" :label-width="labelWidth" class="form-col" :rules="rules">
    <el-row class="mb-3">
      <el-button type="primary" size="mini" @click="selectChildAttr">选择子属性</el-button>
      <el-button type="primary" size="mini" :disabled="showAddChild" @click="addChildSku">添加SKU</el-button>
    </el-row>
    <el-table :data="form.skuList" :row-class-name="tableRowClassName" row-key="tableKey" border stripe highlight-current-row class="form-table g-table g-table-dense">
      <el-table-column v-if="showHandle" label="" width="50" fixed>
        <template slot-scope="{row, $index}">
          <i class="el-icon-delete del-btn" @click="removeChildSku(row, $index)" />
        </template>
      </el-table-column>
      <el-table-column label="子SKU" :width="isVariation?150:110" fixed>
        <template slot="header">
          <span class="has-error">子SKU</span>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            v-if="isVariation"
            :prop="'skuList.' + $index + '.productSku'"
            :rules="[{ required: true, validator: validSku(row, $index), trigger: 'change' }]"
            class="el-form-item_no-lable"
          >
            <el-popover :disabled="!row.productName" :content="row.productName" placement="top" trigger="hover">
              <el-select slot="reference" v-model="row.productSku" :disabled="Boolean(baseProductInfo.itemId)" size="mini" filterable clearable placeholder="请选择" @change="(value) => changeSku(value, $index)">
                <el-option v-for="(item, index) in removeSkuList" :key="index" :label="item.productSkuShow" :disabled="item.disabled" :value="item.productSku" :title="item.productName" />
              </el-select>
            </el-popover>
          </el-form-item>
          <template v-else>
            <el-popover :disabled="!row.productName" :content="row.productName" placement="top" trigger="hover">
              <div slot="reference">{{ row.productSku }}</div>
            </el-popover>
          </template>
          <span v-if="row.lstAttrSpecificationText">({{ row.lstAttrSpecificationText }})</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="90" fixed>
        <template slot="header">
          <span class="has-error">图片</span>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.imgShowList'"
            :rules="[{ required: true, validator: validImage(row, $index), trigger: 'change' }]"
            class="el-form-item_no-lable"
          >
            <div class="d-flex">
              <g-thumb v-if="row.imgShowList && row.imgShowList.length"
                       :url="row.mainImage || row.extraImagList[0]"
                       :width="40"
                       :height="40"
              />
              <el-button :disabled="Boolean(row.noPermission)" type="text" @click="changeImgModal(row, $index)">more</el-button>
            </div>
            <el-tooltip v-if="$index > 0 " class="item" effect="dark" content="点击此按钮，则本sku图片由程序直接选中上个sku所选择图片" placement="top">
              <el-link :underline="false" class="copy-img" @click="copyImg($index)">应用上个SKU图片</el-link>
            </el-tooltip>
          </el-form-item>
        </template>
      </el-table-column>
      <!-- 变体属性 -->
      <el-table-column v-for="(attr, i) in form.lstAttrHead" :key="i" min-width="120">
        <template #header>
          <el-form-item
            :prop="'lstAttrHead.' +i+'.multiAttrKey'"
            :rules="attr.multiAttrKey?[{required: true, validator: validAttrHead(attr.multiAttrKey, i), trigger: 'change'}]:[{required: false}]"
            class="el-form-item_no-lable"
          >
            <div>{{ '变体属性' + ['一','二','三'][i] }}</div>
            <el-select v-model="attr.multiAttrKey" size="mini" filterable clearable @change="mulAttrChange(attr.multiAttrKey, i)">
              <el-option v-for="(opt, oIndex) in attr.options" :key="oIndex" :label="opt.title" :value="opt.attributeName" />
            </el-select>
          </el-form-item>
        </template>
        <template slot-scope="{ row, $index }">
          <dynamicForm :row="row" :index="$index" :i="i" :attr="attr" :sku-list.sync="form.skuList" @dynamicChange="(val, index, i) => clearValid(val,'multiAttrValue',index, i)" />
        </template>
      </el-table-column>
      <el-table-column label="Is Primary Variant" min-width="90">
        <template slot="header">
          <span :class="{'has-error': isVariation}">Is Primary Variant</span>
        </template>
        <template v-if="row.isPrimaryVar" slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.isPrimaryVar'"
            :rules="isVariation?{ required: true, validator: validPrimary(row, $index), trigger: 'change' }:{required: false}"
            class="el-form-item_no-lable"
          >
            <el-select v-model="row.isPrimaryVar.value" size="mini" @change="priVarChange(row.isPrimaryVar.value, $index)">
              <el-option v-for="(v, j) in row.isPrimaryVar.enums && JSON.parse(row.isPrimaryVar.enums)" :key="j" :label="v" :value="v" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Swatch Images" min-width="90">
        <template slot-scope="{ row, $index}">
          <el-form-item
            :prop="'skuList.' + $index + '.swatchImgList'"
            :rules="[{ required: true, validator: validSwatch(row, $index), trigger: 'change' }]"
            class="el-form-item_no-lable"
          >
            <div class="d-flex">
              <g-thumb v-if="row.swatchImgList && row.swatchImgList.length"
                       :url="row.swatchUrl"
                       :width="40"
                       :height="40"
              />
              <el-button :disabled="Boolean(row.noPermission)" type="text" @click="changeSwatchModal(row, $index)">more</el-button>
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="售价" min-width="80">
        <template slot="header">
          <div class="has-error">售价</div>
          <el-button type="text" @click="batchOperation(0)">批量改价</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.price'"
            :rules="{ required: true,validator: validPrice(row, $index), trigger: 'blur'}"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.price"
                      v-input.positive
                      :disabled="Boolean(row.noPermission)"
                      size="mini"
                      @input="() => {row.price = toFixed2(row.price)}"
                      @change="updatePrice(row, $index)"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="80">
        <template slot="header">
          <div class="has-error">库存</div>
          <el-button type="text" @click="batchOperation(1)">批量改库存</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.stock'"
            :rules="[{ required: true, message: '库存不能为空', trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.stock" v-input.positive.numeric :disabled="Boolean(row.noPermission)" maxlength="4" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="成本" min-width="70">
        <template slot-scope="{ row }">
          {{ row.costPrice }}
        </template>
      </el-table-column>
      <el-table-column label="利润率" min-width="80">
        <template slot="header">
          <div class="has-error">利润率</div>
          <el-button type="text" @click="batchOperation(2)">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.profitRate'"
            :rules="{ required: true, validator: validRate(row, $index), trigger: 'change' }"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.profitRate"
                      v-input.positive
                      size="mini"
                      @input="() => {row.profitRate = toFixed2(row.profitRate)}"
                      @change="validProfitRate(row, $index)"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="UPC" min-width="110">
        <template #header>
          <div class="has-error">UPC</div>
          <el-checkbox v-model="form.isFromNumPool" @change="isFromNumPoolChange">从号码池获取</el-checkbox>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.upc'"
            :rules="form.isFromNumPool?[{required: false}]:[{ required: true, message: 'UPC不能为空', trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.upc" :disabled="Boolean(form.isFromNumPool)" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <!-- :rules="[{ required: true, message: '运费不能为空', trigger: 'blur' }]" -->
      <el-table-column label="运费 | 重量(lbs)" min-width="80">
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.shippingPrice'"
            class="el-form-item_no-lable"
          />
          {{ row.shippingPrice }} | {{ row.shippingWeight }}
        </template>
      </el-table-column>
      <el-table-column label="物流" min-width="80">
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" @click="showLogisticsList(row)">可发物流</el-button>
        </template>
      </el-table-column>
      <template v-if="form.childAttr && form.childAttr.length">
        <el-table-column v-for="(cItem, cIndex) in form.childAttr" :key="cItem.id" min-width="120">
          <template slot="header">
            {{ cItem.title }}
          </template>
          <template v-if="row.childValue && row.childValue[cIndex]" slot-scope="{ row, $index}">
            <child-form :row="row" :index="$index" :c-index="cIndex" :c-item="cItem" :sku-list.sync="form.skuList" @childFormChange="(val) => clearValid(val, 'childValue')" />
          </template>
        </el-table-column>
      </template>
    </el-table>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { variantObj, toFixed2, getSkuValues, initMultiAttr } from '../addListing.handle.js'
import { batchOperation, selectChildAttr, changeImgModal, changeSwatchModal, validSku, validImage, validPrimary, validSwatch, validPrice, validRate, showChild } from '../variant.handle.js'
import dynamicForm from './variantAttr/dynamicForm.vue'
import childForm from './variantAttr/childForm.vue'
import showLogisticsList from '@/views/lmsAmazon/amazon/components/showLogisticsList.vue'
import { getOptimize, calculatePrice, calculateProfitRate } from '@/api/walmart/walmart.js'
export default {
  name: 'VariantAttr',
  components: { dynamicForm, childForm },
  props: {
    labelWidth: String,
    isEdit: Boolean,
    productLoading: Number,
    isVariation: Boolean,
    baseProductInfo: Object
  },
  data() {
    return {
      toFixed2,
      form: {
        saleProfitRate: '', // 销售利润率
        skuList: [],
        lstAttrHead: [], // 多属性列表
        childAttr: [] // 子属性
      },
      varAttr: [], // 变体属性
      rules: {
      },
      removeSkuList: [], // 可选子sku列表
      extraImgNum: 8, // 副图最多可选张数,
      childAttr: [],
      selectedChild: [], // 选中的子属性
      loading: false,
      validSku,
      validImage,
      validPrimary,
      validSwatch,
      validPrice,
      validRate
    }
  },
  computed: {
    showAddChild() {
      const { listingStatus } = this.baseProductInfo
      return !this.isVariation || listingStatus !== 1
    },
    onlineDisabled() {
      const { itemId, listingStatus } = this.baseProductInfo
      return itemId && (listingStatus === 5 || listingStatus === 7)
    },
    showHandle() {
      const { itemId, listingStatus } = this.baseProductInfo
      return itemId ? listingStatus === 5 || listingStatus === 7 : this.isVariation
    }
  },
  watch: {
    'baseProductInfo.productSku'(val) {
      if (!val) { // 店铺改变，sku清空
        this.form.skuList = []
      } else { // sku改变
        this.form.lstAttrHead = [] // 清空table中变体属性列
        this.init()
      }
    },
    // 切换仓库
    'baseProductInfo.warehouse'() {
      this.getOptimize()
      // 编辑初始化回显，不计算售价
      !this.baseProductInfo.isEditInit && this.form.skuList.forEach((item, index) => {
        this.validProfitRate(item, index)
      })
    },
    // 利润率改变
    'baseProductInfo.saleProfitRate'(val) {
      if (!this.baseProductInfo.isEditInit) {
        const skuList = deepClone(this.form.skuList)
        skuList.forEach((item, index) => {
          item.profitRate = val
          this.validProfitRate(item, index)
        })
        this.form.skuList = skuList
      }
    }
  },
  methods: {
    batchOperation(number) {
      batchOperation(number, this)
    },
    // 多属性/子属性有值取消校验
    clearValid(value, attr, index, i) {
      if (value) {
        const skuList = deepClone(this.form.skuList)
        this.$refs.form.clearValidate('skuList.' + index + '.' + attr + '.' + i + '.value')
        this.form.skuList = skuList
      }
    },
    priVarChange(value, index) {
      const item = this.form.skuList[index]
      this.form.skuList.splice(index, 1, Object.assign(item, { value }))
    },
    selectChildAttr() {
      selectChildAttr(this)
    },
    changeImgModal(item, index) {
      changeImgModal(item, index, this)
    },
    changeSwatchModal(item, index) {
      changeSwatchModal(item, index, this)
    },
    init() {
      // 有 skuList 为 variant
      if (this.baseProductInfo.skuList && this.baseProductInfo.skuList.length) {
        const { skuList, lstSku } = deepClone(this.baseProductInfo)
        console.log('skuList: ', skuList)
        // spu信息，默认显示第一条子sku
        this.form.skuList = this.isEdit ? skuList : [skuList[0]]
        this.setRemoveSkuList()
        // 无权刊登
        this.isEdit && this.isVariation && this.form.skuList.forEach(item => {
          const i = lstSku.findIndex(s => s.productSku === item.productSku)
          if (i === -1) {
            item.noPermission = true
          }
        })
      } else { // sku
        this.form.skuList.splice(0, this.form.skuList.length, deepClone(this.baseProductInfo))
      }
      !this.isEdit && this.handleSkuList(this.form.skuList[0], 0)
    },
    // 设置可选子SKU下拉列表
    setRemoveSkuList() {
      if (this.isVariation) {
        const { lstSku } = deepClone(this.baseProductInfo)
        this.removeSkuList = lstSku
        this.resetSkuList()
      }
    },
    // 重置sku下拉列表
    resetSkuList() {
      const selectedSku = this.form.skuList.map(item => item.productSku)
      this.removeSkuList.forEach(item => {
        item.disabled = false
        if (selectedSku.includes(item.productSku)) {
          item.disabled = true
        }
      })
    },
    handleSkuList(data, index) {
      const { saleProfitRate, accountGrossProfit } = this.baseProductInfo
      data.profitRate = saleProfitRate || accountGrossProfit // 先取类目利润率，没有的话取店铺的
      data.stock = 500
      this.validProfitRate(this.form.skuList[index], index) // 利润率算售价,运费
    },
    // 获取sku属性（多变体：类目属性获取）
    getVarAttr(varAttr, varAttrHead, varChild, isEditInit) {
      console.log('var: ', isEditInit)
      this.childAttr = deepClone(varChild) // 子属性
      this.form.childAttr = []
      this.varAttr = deepClone(varAttr)
      const arr = []
      this.form.lstAttrHead = []
      this.form.skuList.forEach(item => {
        item.isPrimaryVar = this.varAttr.find(item => item.attributeName === 'isPrimaryVariant')
        item.swatchImg = this.varAttr.find(item => item.attributeName === 'swatchImages')
        // 编辑回显
        if (isEditInit) {
          const { variantAttributes } = item.extendVO
          item.isPrimaryVar = { ...item.isPrimaryVar, value: variantAttributes.isPrimaryVariant }
          item.swatchUrl = variantAttributes.swatchImages[0]
          this.selectedChild = Object.keys(variantAttributes).filter(item => this.childAttr.map(v => v.attributeName).includes(item))
        }
        initMultiAttr(item)
      })
      for (let i = 0; i < 3; i++) {
        arr.push({
          options: this.varAttr.filter(item => varAttrHead.includes(item.attributeName)),
          multiAttrKey: ''
        })
      }
      this.$nextTick(() => {
        this.form.lstAttrHead = arr
      })
      // 多属性表头选中值回显
      if (isEditInit && this.form.skuList[0] && this.form.skuList[0].multiAttr) {
        Object.keys(this.form.skuList[0].multiAttr).forEach((item, index) => {
          arr[index].multiAttrKey = item
          this.mulAttrChange(item, index, true)
        })
      }
    },
    // 选择多属性
    mulAttrChange(attrName, index, isEditInit) {
      if (!attrName) { // 删除变体属性，清空当前列
        const skuList = deepClone(this.form.skuList)
        skuList.forEach((item, j) => {
          item.multiAttrValue[index] = {}
          this.$refs.form.clearValidate('skuList.' + j + '.multiAttrValue.' + index + '.value')
        })
        this.form.skuList = skuList
        return
      }
      const item = deepClone(this.varAttr.find(item => item.attributeName === attrName))
      const skuList = deepClone(this.form.skuList)
      skuList.forEach((val) => {
        item.value = ''
        if (item.type === 'object') {
          if (!item.isLeaf && !item.parentAttributeName) { // 查找子属性
            const arr = this.varAttr.filter(val => val.parentAttributeName === item.attributeName)
            item.children = arr
          }
        }
        if (item.type === 'array') { // 多选/多输
          item.value = item.enums ? [] : ['']
        }
        val.multiAttrValue[index] = deepClone(item)
        // val.multiAttrValue.splice(index, 1, deepClone(item))
      })
      this.form.skuList = skuList
      if (isEditInit) {
        this.showMultiVal(index, attrName)
        showChild(this, this.selectedChild, isEditInit)
      }
    },
    // 多属性值回显
    showMultiVal(index, attrName) {
      const skuList = deepClone(this.form.skuList)
      skuList.forEach(val => {
        const attr = val.multiAttrValue[index]
        if (attr.type === 'object') {
          attr.children.forEach(e => {
            e.value = val.multiAttr[attrName].find(a => a[e.attributeName])?.[e.attributeName]
          })
        } else {
          attr.value = val.multiAttr[attrName]
        }
      })
      this.form.skuList = skuList
    },
    // 校验3个多属性不可重复
    validAttrHead(attrName, index) {
      return (rule, value, callback) => {
        const multiAttrKey = this.form.lstAttrHead.map(item => item.multiAttrKey).filter((val, i) => i !== index)
        multiAttrKey.includes(attrName) ? callback(new Error('变体属性不可重复')) : callback()
      }
    },
    addAttr(index, i) {
      this.form.skuList[index].multiAttrValue[i].value.push('')
    },
    removeAttr(index, i, tIndex) {
      this.form.skuList[index].multiAttrValue[i].value.splice(tIndex, 1)
    },
    // 修改售价算利润率
    updatePrice(item, index, isBatch) {
      if (!item.price) return
      const { platformCode, accountCode, site, warehouse, warehouseType, isOverseasWarehouses } = this.baseProductInfo
      const { productSku, costPrice } = item
      const priceRateDTOList = []
      priceRateDTOList.push({
        productSku,
        price: item.price,
        productCost: costPrice
      })
      this.loading = true
      calculateProfitRate({
        platformCode,
        storeCode: accountCode,
        siteCode: site,
        warehouse: warehouse || 'Z20',
        type: warehouseType || 'SELF_BUILT',
        isOversea: isOverseasWarehouses || false,
        priceRateDTOList
      }).then(res => {
        if (res.code === 200) {
          const data = res.data
          if (isBatch) { // 批量
            this.form.skuList.forEach(item => {
              item.profitRate = data[productSku].profitRate
            })
          } else {
            this.form.skuList.splice(0, 1, Object.assign(this.form.skuList[index], {
              profitRate: data[productSku].profitRate
            }))
          }
        } else {
          this.$message.error(res.msg || res.message || '未知错误')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 修改利润率算售价
    validProfitRate(item, index, isBatch) {
      if (!item.profitRate) return
      const { platformCode, accountCode, site, warehouse, warehouseType, isOverseasWarehouses } = this.baseProductInfo
      const { productSku, costPrice } = item
      if (!warehouse) return
      const priceDTOList = []
      priceDTOList.push({
        productSku,
        saleProfitRate: item.profitRate,
        productCost: costPrice // 产品成本
      })
      this.loading = true
      calculatePrice({
        platformCode,
        storeCode: accountCode,
        siteCode: site,
        warehouse: warehouse || 'Z20',
        type: warehouseType || 'SELF_BUILT',
        isOversea: isOverseasWarehouses || false,
        priceDTOList
      }).then(res => {
        if (res.code === 200) {
          const data = res.data
          if (isBatch) { // 批量
            this.form.skuList.forEach(item => {
              item.price = data[productSku].salePrice
              item.shippingPrice = data[productSku].shippingPrice
            })
          } else {
            this.form.skuList.splice(index, 1, Object.assign(deepClone(this.form.skuList[index]), {
              price: data[productSku].salePrice,
              shippingPrice: data[productSku].shippingPrice
            }))
          }
        } else {
          this.$message.error(res.msg || res.message || '未知错误')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 无权刊登style
    tableRowClassName({ row, rowIndex }) {
      return row.noPermission ? 'info-row' : ''
    },
    removeChildSku(row, index) {
      !row.noPermission && row.productSku && this.removeSkuList.findIndex(item => item.productSku === row.productSku) === -1 && this.removeSkuList.push(row)
      this.form.skuList.splice(index, 1)
      this.resetSkuList()
    },
    addChildSku() {
      this.form.skuList.push(deepClone(variantObj(this.form.skuList[0])))
    },
    // 从号码池获取
    isFromNumPoolChange(value) {
      if (value) {
        this.form.skuList.forEach((item, index) => {
          item.upc = ''
          this.$refs.form.clearValidate('skuList.' + index + '.upc')
        })
      }
    },
    // 选择SKU事件
    changeSku(value, index) {
      if (!value) { // 清空
        this.form.skuList.splice(index, 1, Object.assign(this.form.skuList[index], {
          productSku: '',
          productName: '',
          imgShowList: [],
          mainImage: '',
          extraImagList: [],
          price: '',
          upc: '',
          costPrice: '', // 成本
          stock: 500,
          shippingPrice: '', // 运费
          productWeight: '' // 重量
        }))
        this.resetSkuList()
        return
      }
      const removeItem = this.removeSkuList.find(item => item.productSku === value)
      const { multiAttrValue } = this.form.skuList[index]
      this.form.skuList.splice(index, 1, Object.assign(this.form.skuList[index], removeItem, { multiAttrValue }))
      this.handleSkuList(this.form.skuList[index], index)
      this.resetSkuList()
    },
    // 应用上个SKU图片事件
    copyImg(index) {
      const { mainImage, masterImage, extraImagList, imgShowList } = this.form.skuList[index - 1]
      this.form.skuList[index] = Object.assign(this.form.skuList[index], {
        mainImage, masterImage, extraImagList, imgShowList
      })
    },
    // 获取sku列表值
    getSkuValue() {
      return getSkuValues(this.form.skuList)
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
    // 获取物流信息批量
    getOptimize() {
      return new Promise((resolve, reject) => {
        const { account, site, platformCode, accountCode, virtualWarehouse, warehouse, warehouseType, isOverseasWarehouses } = this.baseProductInfo
        if (account && site && platformCode && this.form.skuList.length) {
          const countryCode = site
          const request = []
          this.form.skuList.forEach((item, index) => {
            item.logistics = []
            request.push(getOptimize({
              storeName: account,
              storeCode: accountCode,
              platformCode,
              countryCode,
              skus: [item.productSku],
              virtualWarehouse, // 虚拟仓编码
              warehouse: warehouse || 'Z20', // 发货仓库编码
              type: warehouseType || 'SELF_BUILT', // 发货仓库类型
              isOversea: isOverseasWarehouses || false
            }))
          })
          this.$emit('productLoadingStart')
          Promise.all(request).then(res => {
            res.map((item, index) => {
              const data = [{ channelCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '55', priceHigh: '100' }, { channelCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '130', priceHigh: '800' }]
              this.form.skuList[index].logistics = item.data || data
            })
            // !this.isEdit && this.upateGrossModifyPrice()
            resolve(true)
          }).finally(() => {
            this.$emit('productLoadingEnd')
          })
        } else {
          this.form.skuList.map(item => {
            item.logistics = []
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-img{
      transform: scale(.85,.85);
    display: block;
    width: 95px;
    margin-left: -10px;
}
.w-90{
  width: 90%;
}
.w-80 {
  width: 80%;
}
.form-table{
  .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
  ::v-deep .el-form-item__error{
    position: initial;
    font-weight: 400;
  }
}
.el-form-item_no-lable ::v-deep .el-form-item__content{
  margin-left: 0 !important;
}
.has-error{
  padding-left: 10px;
  position: relative;
  &::before{
    content: "*";
    display: inline-block;
    color: #F56C6C;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.del-btn{
  font-size: 16px;
  float: right;
  padding: 5px 10px;
  cursor: pointer;
  transition: 0.35s color;
  &:hover{
    color: $--color-primary;
  }
}
.plus-minus {
  margin-left: 4px;
  .el-button--mini {
    padding: 7px 6px 6px;
  }
}
</style>
