<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="w-90 form-col">
    <el-row>
      <el-col :span="6">
        <el-form-item label="最小计量单位" prop="productUnit">
          <el-select v-model="form.productUnit" filterable placeholder="请选择" @change="$refs.form.validateField('lotNum'); form.packageType = 'false'">
            <el-option v-for="(k, v) in unitList" :key="v" :label="k" :value="v" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="销售方式" prop="packageType">
          <el-row>
            <el-col :span="5" class="mb-0">
              <el-radio v-model="form.packageType" label="false" @change="()=> {$refs.form.validateField('packageType'); $refs.form.validateField('lotNum')}">{{ unitList[form.productUnit] }}</el-radio>
            </el-col>
            <el-col :span="19" class="mb-0">
              <el-radio v-model="form.packageType" label="true" @change="() => {$refs.form.validateField('packageType'); $refs.form.validateField('lotNum')}">打包出售</el-radio>
              <span v-if="form.packageType == 'true'">
                每包 <el-form-item class="d-inline-block" label-width="0" prop="lotNum">
                  <el-input v-model="form.lotNum" v-input.positive.numeric class="w90" @input="(value) => form.lotNum = value.replace(/^0/, '')" />
                </el-form-item> {{ unitList[form.productUnit] }}
              </span>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <div>多变体属性</div> -->
    <template v-for="(item, i) in skuAttrList">
      <!-- 发货地 200007763 -->
      <el-form-item :key="item.id"
                    :label="item.names"
                    :class="i+1 == skuAttrList.length ? 'mb-0' : ''"
                    prop="skuAttrList"
                    :rules="item.attributeId === 200007763 ? [{ required: true, validator: validSkuAttr(item), trigger: ['change', 'blur'] }] : []"
      >
        <el-select v-model="item.value"
                   class="w-100"
                   size="mini"
                   filterable
                   multiple
                   placeholder="请选择"
                   clearable
                   @change="(value) => skuAttrChange(value, item)"
        >
          <el-option v-for="obj in item.valueJson" :key="obj.id" :label="obj.label" :value="obj.id" />
        </el-select>
        <div class="d-inline-block yy">
          <customized v-if="(item.customizedName || item.customizedPic) && item.value.length >0"
                      :ref="'customized'+item.attributeId"
                      :data="item"
                      :base-product-info="baseProductInfo"
                      :customized.sync="customized"
                      @updateCustomized="updateCustomized"
          />
        </div>
      </el-form-item>
    </template>
    <div class="text-end mb-2"><tips /></div>
    <el-table :data="form.variants"
              :row-class-name="tableRowClassName"
              row-key="rowKey"
              border
              stripe
              highlight-current-row
              class="form-table g-table g-table-dense mb-4"
    >
      <el-table-column label="发货地" prop="skuPropertyName" width="58">
        <template slot-scope="{ row }">{{ row.sendPlaceName }}</template>
      </el-table-column>
      <el-table-column label="仓库" min-width="80">
        <template slot="header">
          <span class="has-error">仓库 </span>
          <el-tooltip placement="top">
            <div slot="content" class="lh-base">
              (SKU包含内容)发货仓库(规则名称)
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'variants.' + $index + '.warehouseId'"
            :rules="row.noPermission ? [] : [{ required: true, message: '仓库不能为空', trigger: ['change', 'blur'] }]"
            class="el-form-item_no-lable mb-0"
          >
            <el-select v-model="row.warehouseId" :disabled="Boolean(row.noPermission)" filterable placeholder="请选择" @change="(value) => changeWareHouse(value, row, $index, 'update')">
              <el-option v-for="(item, i) in row.warehouseList"
                         :key="i + $index"
                         :label="item.warehouseName"
                         :value="item.warehouseId"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column v-if="isVariation" label="商品编码" prop="productSku" width="136">
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'variants.' + $index + '.productSku'"
            :rules="[{ required: true, validator: validSku(row, $index), trigger: 'change' }]"
            class="el-form-item_no-lable"
          >
            <div v-popover="'popover'+$index">
              <el-select v-model="row.productSku"
                         filterable
                         clearable
                         placeholder="请选择"
                         class="w-100"
                         :disabled="Boolean(row.noPermission)"
                         @change="(val) => selectSku(val, $index)"
                         @visible-change="(val) => visibleChange(val, row)"
              >
                <el-option v-for="item in baseProductInfo.skuList"
                           :key="item.productSku"
                           :label="isVariation ? row.productSkuShow || row.productSku : row.productSku"
                           :disabled="item.disabled"
                           :value="item.productSku"
                           :title="item.productName"
                />
              </el-select>
              <el-popover :ref="'popover'+$index" trigger="hover" :disabled="!(row.noPermission || row.productName)" :content="row.noPermission ? 'SKU不可用' : row.productName" placement="top" />
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column v-else label="商品编码" prop="productSku" min-width="60">
        <template slot-scope="{ row }">
          <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
            <!-- <div>{{ row.productSkuShow || row.productSku }}</div> -->
            <div>{{ isVariation ? row.productSkuShow || row.productSku : row.productSku }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <template v-for="(attr, i) in lstAttrHead" text="变体属性">
        <el-table-column v-if="attr.attributeId !== 200007763" :key="i" :label="attr.names" prop="skuPropertyName" min-width="58">
          <template slot-scope="{ row }">{{ showAttrName(row, i) }}</template>
        </el-table-column>
      </template>
      <el-table-column label="库存" min-width="60">
        <template slot="header">
          <span class="has-error">库存</span>
          <el-button type="text" @click="batchUpdate">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'variants.' + $index + '.ipmSkuStock'"
            :rules="row.noPermission ? [] : [{ required: true, message: '库存不能为空', trigger: 'blur' }]"
            class="el-form-item_no-lable mb-0"
          >
            <el-input v-model="row.ipmSkuStock" v-input.positive.numeric :disabled="Boolean(row.noPermission)" maxlength="4" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="零售价" min-width="80">
        <template slot="header">
          <span class="has-error">零售价(USD)</span>
          <el-button type="text" @click="batchUpdateSkuPrice(1)">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'variants.' + $index + '.skuPrice'"
            :rules="[{ required: true, validator: updateCurrentPrice(row, $index, 'skuPriceError'), trigger: ['change', 'blur'] }]"
            class="el-form-item_no-lable mb-0"
          >
            <el-input v-model="row.skuPrice"
                      v-input.positive
                      size="mini"
                      :disabled="Boolean(row.noPermission)"
                      @input="() => {row.skuPrice = toFixed2(row.skuPrice)}"
                      @blur="sellingPriceOnblur(row, $index)"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="利润率" min-width="60">
        <template slot="header">
          <span class="has-error">利润率</span>
          <el-button type="text" @click="batchUpdateSkuPrice(2)">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'variants.' + $index + '.profitRate'"
            :rules="row.noPermission ? [] : [{ required: true, validator: validRate(row, $index, 'profitRateError'), trigger: ['change', 'blur'] }]"
            class="el-form-item_no-lable mb-0"
          >
            <el-input v-model="row.profitRate" v-input.positive :disabled="Boolean(row.noPermission)" maxlength="4" size="mini" @blur="profitRateOnblur(row, $index)" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="利润" min-width="60">
        <template slot="header">
          <span class="has-error">利润(USD)</span>
          <el-button type="text" @click="batchUpdateSkuPrice(3)">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'variants.' + $index + '.profitAmount'"
            :rules="row.noPermission ? [] : [{ required: true, validator: validRateAmount(row, $index, 'profitAmountError'), trigger: ['change', 'blur'] }]"
            class="el-form-item_no-lable mb-0"
          >
            <el-input v-model="row.profitAmount" v-input.positive :disabled="Boolean(row.noPermission)" maxlength="4" size="mini" @blur="profitAmountOnblur(row, $index)" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="运费(CNY)" min-width="40">
        <template slot-scope="{ row }">
          {{ row.logisticsInfo && row.logisticsInfo.cost * 1 || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="物流" min-width="50">
        <template slot-scope="{ row }">
          <el-button type="text" @click="showLogisticsList(row)">可发物流</el-button>
        </template>
      </el-table-column>
      <el-table-column label="价格/库存参考信息" min-width="78">
        <template slot-scope="{ row }">
          采购成本: {{ row.costPrice }}<br>
          重量: {{ row.packWeight }}<br>
          <span v-if="isOverseasWarehouse(row)">
            海运: {{ row.logisticsInfo && row.logisticsInfo.oceanPriceRange }}<br>
            空运: {{ row.logisticsInfo && row.logisticsInfo.airPriceRange }}
          </span>
          <span v-else>本地: {{ row.logisticsInfo && row.logisticsInfo.priceRange }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item label-width="0" prop="variants" class="m-top-10" />
    <div class="d-block">
      <el-form-item class="d-inline-block" label="批发价" prop="bulkOrder">
        <el-input v-model="form.bulkOrder" v-input.positive.numeric class="w90" @blur="(value) => bulkOrderChange(value)" />
      </el-form-item>
      件及以上时，每件价格在零售价的基础上减免 <el-form-item label-width="0" class="d-inline-block" prop="bulkDiscount">
        <el-input v-model="form.bulkDiscount" v-input.positive.numeric class="w50" maxlength="2" @input="bulkDiscountChange" /> %
      </el-form-item>
    </div>
    <el-row>
      <el-col :span="8" class="mb-0">
        <el-form-item label="区域调价" prop="nationQuoteCountry">
          <el-select v-model="form.nationQuoteCountry"
                     multiple
                     placeholder="请选择"
                     class="w-100"
                     @change="(value) => nationQuoteTemplateIdChange(value)"
          >
            <el-option v-for="item in countryList" :key="item.code" :label="item.eName" :value="item.code" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="mb-0">
        <el-form-item label="区域调价模板" prop="nationQuoteTemplateId" label-width="100px">
          <el-select v-model="form.nationQuoteTemplateId" placeholder="请选择">
            <el-option v-for="item in priceAdjustTemplate" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5"><el-link :underline="false" type="primary" @click="goLink">查看所有区域调价模板</el-link></el-col>
    </el-row>
  </el-form>
</template>

<script>
import area from './../../aliExpressTemp/area/_area.vue'
import tips from './tips.vue'
import { toFixed2 } from '@/views/components/utils.js'
import batchUpdateStock from '@/views/lmsLazada/lazada/components/batchUpdateStock.vue'
import batchUpdateRate from '@/views/components/batchUpdateRate.vue'
import showLogisticsList from '@/views/components/logisticsList/showLogisticsList.vue'
import * as Api from '@/api/aliExpress/aliexpress.js'
import { getAllPriceAdjustTemplate } from '@/api/aliExpress/temp.js'
import * as addListingHandle from './aliExpress.handle.js'
import customized from './customized.vue'
import { deepClone } from '@/util/util'
export default {
  name: 'VariantAttr',
  components: { tips, customized },
  props: {
    labelWidth: String,
    baseProductInfo: Object,
    isEdit: Boolean,
    isVariation: Boolean
  },
  data() {
    const validlLotNum = (rule, value, callback) => {
      if (this.form.packageType === 'true' && !this.form.lotNum) {
        callback(new Error(`每包${this.unitList[this.form.productUnit]}数不能为空`))
      } else { callback() }
    }
    const validlPackageType = (rule, value, callback) => {
      if (!this.form.packageType) {
        callback(new Error('销售方式不能为空'))
      } else { callback() }
    }
    const validlBulkOrder = (rule, value, callback) => {
      if (!this.form.bulkOrder && this.form.bulkDiscount) {
        callback(new Error('请输入'))
      } else if (!this.form.bulkDiscount) {
        this.$refs.form.validateField('bulkDiscount')
        callback()
      } else { callback() }
    }
    const validlBulkDiscount = (rule, value, callback) => {
      if (this.form.bulkOrder && !this.form.bulkDiscount) {
        callback(new Error('请输入'))
      } else if (this.form.bulkDiscount) {
        this.$refs.form.validateField('bulkOrder')
        callback()
      } else { callback() }
    }
    const validVariants = (rule, value, callback) => {
      if (!this.form.variants?.length) {
        callback(new Error('变体列表不能为空'))
      } else { callback() }
    }
    const validlNatTemplateId = (rule, value, callback) => {
      if (this.form.nationQuoteCountry && this.form.nationQuoteCountry.length && !value) {
        callback(new Error('区域调价模板不能为空'))
      } else { callback() }
    }
    return {
      toFixed2,
      isOverseasWarehouse: addListingHandle.isOverseasWarehouse,
      skuAttrList: [], // 多变体属性列表
      lstAttrHead: [], // 属性head
      form: {
        productUnit: '',
        packageType: '',
        lotNum: '', // 每包件数
        bulkOrder: '', // 批发最小数量
        bulkDiscount: '', // 减免
        variants: [],
        nationQuoteCountry: [], // 区域调价
        nationQuoteTemplateId: '' // 区域调价模板id
      },
      rules: {
        nationQuoteTemplateId: [{ validator: validlNatTemplateId }],
        productUnit: [{ required: true, message: '最小计量单位不能为空', trigger: 'change' }],
        lotNum: [{ required: true, validator: validlLotNum }],
        packageType: [{ required: true, validator: validlPackageType }],
        bulkOrder: [{ required: false, validator: validlBulkOrder, trigger: 'blur' }],
        bulkDiscount: [{ required: false, validator: validlBulkDiscount, trigger: 'blur' }],
        variants: [{ required: false, validator: validVariants }]
      },
      customized: {}, // 变体自定义属性设置
      unitList: {},
      sendPlace: null,
      skuDeductRate: {}, // sku对应的抵扣项
      priceAdjustTemplate: [], // 区域调价模板
      countryList: addListingHandle.countryList
    }
  },
  watch: {
    'baseProductInfo.productSpu'(old, yy) {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key]
      })
      this.customized = {}
      if (this.isEdit) {
        this.setVarList()
      } else {
        this.skuAttrList.forEach(item => {
          item.value = []
        })
      }
      // 默认获取所有sku的抵扣项
      const priceParams = []
      if (!this.isVariation) {
        priceParams.push({ productSku: data.productSpu, costPrice: data.costPrice })
      } else {
        const list = data.variants ? [...data.skuList, ...data.variants] : data.skuList
        list.forEach(item => {
          item.costPrice && priceParams.push({ productSku: item.productSku, costPrice: item.costPrice })
        })
      }
      this.getPrice(priceParams).then(res => {
        this.skuDeductRate = { ...this.skuDeductRate, ...res.data }
        // 编辑获取抵扣项和物流
        this.isEdit && this.getOptimizeByPrice(this.form.variants)
      })
      // 无权刊登
      this.isEdit && this.isVariation && this.form.variants.forEach(item => {
        const i = data.skuList.findIndex(s => s.productSku === item.productSku)
        if (i === -1) {
          item.noPermission = true
        }
      })
    }
  },
  created() {
    this.getProductUnit()
  },
  methods: {
    // 无权刊登style
    tableRowClassName({ row, rowIndex }) {
      return row.noPermission ? 'info-row' : ''
    },
    // 批量获取物流
    getOptimizeByPrice(skuList) {
      this.form.variants.forEach((item, index) => {
        this.getOptimize(this.form.variants[index]).then(oRes => {
          this.form.variants.splice(index, 1, {
            ...this.form.variants[index],
            deductRate: this.skuDeductRate[item.productSku].deductRate,
            logistics: oRes.data
          })
        })
      })
    },
    // 获取物流 by 发货地
    getOptimizeByCountry(row, index) {
      this.getOptimize(row).then(oRes => {
        this.form.variants.splice(index, 1, {
          ...this.form.variants[index],
          deductRate: this.skuDeductRate[row.productSku].deductRate,
          logistics: oRes.data
        })
        this.calculatePrice([this.form.variants[index]], index, 2)
      })
    },
    // 选择商品编码事件
    selectSku(val, index) {
      const { skuList, categoryGrossProfit, accountGrossProfit } = this.baseProductInfo
      const find = skuList.findIndex(item => {
        if (item.productSku === val) {
          // debugger 这里应该获取一下当前所选sku 的 打包重量和成本
          this.form.variants[index] = Object.assign({}, this.form.variants[index], {
            costPrice: item.costPrice,
            packWeight: item.packWeight,
            productName: item.productName
          })
          this.getOptimize(this.form.variants[index]).then(optRes => {
            const current = Object.assign({}, this.form.variants[index], item, {
              deductRate: this.skuDeductRate[val].deductRate,
              logistics: optRes.data,
              profitRate: categoryGrossProfit || accountGrossProfit || ''
            })
            this.$set(this.form.variants, index, current)
            this.calculatePrice([this.form.variants[index]], index, 2)
          })
          return item
        }
      })
      if (find === -1) {
        this.form.variants[index] = Object.assign({}, this.form.variants[index], addListingHandle.variantEmpty())
      }
      this.setGrossWeight()
    },
    // 多变体取打包重量最大的子sku的打包重量
    setGrossWeight() {
      let obj = {}
      if (this.form.variants.length) {
        const list = deepClone(this.form.variants)
        list.sort((a, b) => {
          return a.packWeight - b.packWeight
        })
        const { productSku } = list[list.length - 1]

        if (this.isVariation) {
          this.baseProductInfo.skuList.find(item => {
            if (item.productSku === productSku) {
              obj = item
            }
          })
        } else {
          obj = this.baseProductInfo
        }
      }
      const { packWeight, sizeLongPack, sizeWidthPack, sizeHeightPack } = obj
      this.$emit('upateGrossWeight', {
        grossWeight: packWeight,
        packageLength: sizeLongPack,
        packageWidth: sizeWidthPack,
        packageHeight: sizeHeightPack
      })
    },
    // 处理变体属性显示
    setVarList() {
      const { variants } = this.baseProductInfo
      const skuProperty = {}
      const variantVOList = variants.map((sku, index) => {
        const property = deepClone(sku.skuProperty) || []
        const skuPropertyArr = []
        const primarySkuProperty = deepClone(sku.skuProperty) || []
        property.forEach(item => {
          if (skuProperty[item.skuPropertyId]) {
            skuProperty[item.skuPropertyId].push(item.propertyValueId)
          } else {
            skuProperty[item.skuPropertyId] = [item.propertyValueId]
          }
        })
        this.skuAttrList.forEach(item => {
          if (skuProperty[item.attributeId]) {
            item.value = [...new Set(skuProperty[item.attributeId])]
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
        this.changeWareHouse(sku.warehouseId, sku, index)
        return sku
      })
      this.lstAttrHead = variantVOList[0].skuProperty
      this.form.variants = variantVOList
    },
    // sku校验
    validSku(row, index) {
      return (rule, value, callback) => {
        // sku不可重复
        const sku = this.form.variants.filter(item => item.productSku === row.productSku && item.sendPlaceName === row.sendPlaceName)
        if (!row.productSku) {
          callback(new Error('sku不能为空'))
        } else if (sku.length > 1) {
          callback(new Error('同一发货地,sku不可重复'))
        } else {
          callback()
        }
      }
    },
    // 修改价格
    updateCurrentPrice(sku, index, errMsg) {
      return (rule, value, callback) => {
        const msg = this.form.variants[index][errMsg]
        if (msg) {
          callback(new Error(msg))
        } else if (sku.skuPrice && +sku.skuPrice > 0) {
          callback()
        } else {
          callback(new Error('价格不能小于0'))
        }
      }
    },
    // 利润率验证
    validRate(sku, index, errMsg) {
      return (rule, value, callback) => {
        const msg = this.form.variants[index][errMsg]
        if (msg) {
          callback(new Error(msg))
        } else if (Number(sku.profitRate) <= 0 || Number(sku.profitRate) >= 1) {
          callback(new Error('利润率为0~1之间的小数'))
        } else {
          callback()
        }
      }
    },
    // 利润额验证
    validRateAmount(sku, index, errMsg) {
      return (rule, value, callback) => {
        const msg = this.form.variants[index][errMsg]
        if (msg) {
          callback(new Error(msg))
        } else if (Number(sku.profitAmount) <= 0) {
          callback(new Error('利润率额应大于0'))
        } else {
          callback()
        }
      }
    },
    // 获取单位列表
    getProductUnit() {
      Api.getProductUnit().then(res => {
        this.unitList = res.data
      })
    },
    // 获取区域调价模板列表
    getAllPriceAdjustTemplate(account, init) {
      getAllPriceAdjustTemplate({ account }).then(res => {
        this.priceAdjustTemplate = res.data
        // 编辑进入页面 区域调价模板id不存在 区域调价模板列表时， 清空区域调价模板和区域调价
        const find = this.priceAdjustTemplate.find(item => item.id === this.form.nationQuoteTemplateId)
        if (!find) {
          this.form.nationQuoteTemplateId = ''
          this.form.nationQuoteCountry = []
        }
      })
    },
    // 获取sku属性
    updateVarAttr(list) {
      this.skuAttrList = deepClone(list)
      this.customized = {}
      this.form.variants = []
    },
    // 选择变体属性
    skuAttrChange(value, attrItem) {
      // 除了发货地的非变体的勾选操作为单选
      if (!this.isVariation && value.length && attrItem.attributeId !== 200007763) {
        attrItem.value = [value[value.length - 1]]
      }
      const { sendPlace, skuProperty, skuId } = addListingHandle.combinSkuId(this.skuAttrList)
      this.sendPlace = sendPlace
      this.lstAttrHead = skuProperty
      const { costPrice, packWeight, productSpu, productName, accountGrossProfit, categoryGrossProfit } = this.baseProductInfo
      let beforeVariants = []
      const temp = { costPrice, packWeight }
      if (this.form.variants && this.form.variants.length) {
        beforeVariants = deepClone(this.form.variants)
      }
      this.form.variants = []
      const variants = []
      skuId.map((item, index) => {
        if (item) {
          const sku = addListingHandle.sku({
            skuId: item,
            sendPlace,
            productSku: productSpu
          })
          const sendPlaceName = this.showAttrName2(sku)
          // 判断原列表的发货地 是否与item相同，相同copy信息不变，否则判断当前listing是否非变体
          let beforeSku = ''
          if (!this.isVariation) {
            beforeSku = beforeVariants.find(before => {
              if (before.sendPlaceName === sendPlaceName) {
                return before
              }
            })
          } else {
            beforeSku = beforeVariants.find(before => before.skuId === item)
          }
          const temp2 = {
            rowKey: index + sku.skuId,
            sendPlaceName,
            skuProperty,
            productName,
            warehouseList: addListingHandle.warehouse.list[sendPlaceName],
            profitRate: categoryGrossProfit || accountGrossProfit
          }
          if (beforeSku) {
            variants.push(Object.assign({}, sku, beforeSku, temp2, { skuId: sku.skuId }))
          } else if (!this.isVariation) {
            const o = this.isEdit ? this.baseProductInfo.variants ? this.baseProductInfo.variants[0] : {} : this.baseProductInfo
            const { productSkuShow, productName } = o
            variants.push(Object.assign({}, sku, temp, temp2, beforeSku, { productSkuShow, productName }))
          } else {
            variants.push(Object.assign({}, sku, temp2, { productSku: '' }))
          }
        }
      })
      this.form.variants = deepClone(variants)
      this.form.variants.length > 0 && this.$refs.form.validateField('variants')
      this.setGrossWeight()
    },
    // 调价区域
    nationQuoteTemplateIdChange(value) {
      this.form.nationQuoteCountry = value
      this.$refs.form.validateField('nationQuoteTemplateId')
    },
    // 发货地验证
    validSkuAttr(item) {
      return (rule, value, callback) => {
        if (!this.sendPlace) {
          callback(new Error('发货地不能为空'))
        } else {
          callback()
        }
      }
    },
    visibleChange(value, row) {
      if (value) {
        this.resetSkuList(row)
      }
    },
    // 重置sku下拉列表
    resetSkuList(row) {
      if (!this.isVariation) return
      // sku不可重复
      const sku = this.form.variants.filter(item => {
        if (item.sendPlaceName === row.sendPlaceName && item.productSku) {
          return item
        }
      })
      this.baseProductInfo.skuList.forEach(item => { item.disabled = false })
      if (sku.length) {
        const selectedSku = sku.map(item => item.productSku)
        this.baseProductInfo.skuList.forEach(item => {
          if (selectedSku.includes(item.productSku)) {
            item.disabled = true
          }
        })
      }
      this.baseProductInfo.skuList = deepClone(this.baseProductInfo.skuList)
    },
    updateCustomized(k, value) {
      this.customized[k] = value
    },
    // 修改零售价
    sellingPriceOnblur(row, index) {
      this.calculatePrice([row], index, 1)
    },
    // 修改利润率
    profitRateOnblur(row, index) {
      this.calculatePrice([row], index, 2)
    },
    // 修改利润额
    profitAmountOnblur(row, index) {
      this.calculatePrice([row], index, 3)
    },
    // 计算接口
    calculatePrice(skuList, index, calculateType) {
      // calculateType 计算类型（1：价格 2:利润率 3:利润额）
      const aliexpressPriceDTOS = []
      const noLogisticsIndex = [] // 没有物流的变体索引
      const inputKey = ['skuPrice', 'profitRate', 'profitAmount']
      const calculateKey = inputKey[calculateType - 1]
      const errMsg = calculateKey + 'Error'
      skuList.forEach((row, idx) => {
        const { productSku, costPrice, logistics } = row
        const inputParam = row[calculateKey]
        if (productSku && calculateType && inputParam) {
          if (!logistics || !logistics.length) {
            index ? noLogisticsIndex.push(index) : noLogisticsIndex.push(idx)
          } else {
            if ((calculateType === 1 || calculateType === 3) && inputParam <= 0) return false
            if (calculateType === 2 && (inputParam <= 0 || inputParam >= 1)) return false
            /**
            * @description 是否海外仓库判断情况
            * 第三方仓：本地都是海外仓 type: THIRD
            * 平台仓库：本地仓
            * 自建仓： 深圳仓-本地仓，泽汇-海外仓
            * 海外仓：都是海外仓
            * 是否海外仓：不是虚拟仓 &&（第三方仓 || 海外仓 || 自建泽汇仓）
            **/
            aliexpressPriceDTOS.push({
              calculateType,
              productSku,
              inputParam,
              skuCost: costPrice,
              skuWeight: row.packWeight, // 重量
              isOverseasWarehouse: this.isOverseasWarehouse(row), // 是否海外仓
              deductRate: row.deductRate || '', // 抵扣项
              lmsChannelOptimizeDtos: logistics
            })
          }
        }
      })
      // 没有物流直接提示
      if (noLogisticsIndex.length) {
        noLogisticsIndex.forEach(i => {
          const item = this.form.variants[i]
          this.setCalculatePrice(item, { [calculateKey]: item[calculateKey] }, i, calculateType, errMsg, calculateKey)
        })
      }
      if (aliexpressPriceDTOS.length === 0) return // 没有物流的不发起计算
      this.$emit('productLoadingStart')
      Api.calculatePrice({ aliexpressPriceDTOS }).then(res => {
        if (res.data && res.data[0]) {
          if (index !== null) {
            const data = res.data[0]
            const item = this.form.variants[index]
            this.setCalculatePrice(item, data, index, calculateType, errMsg, calculateKey)
          } else {
            const data = res.data
            this.form.variants.forEach((item, i) => {
              data.findIndex(o => {
                if (o.productSku === item.productSku) {
                  this.setCalculatePrice(item, o, i, calculateType, errMsg, calculateKey)
                }
              })
            })
          }
        } else {
          aliexpressPriceDTOS.forEach(dtos => {
            this.form.variants.findIndex((item, index) => {
              if (item.productSku === dtos.productSku) {
                this.setCalculatePrice(item, { [calculateKey]: item[calculateKey] }, index, calculateType, errMsg, calculateKey, res.msg)
              }
            })
          })
        }
      }).catch(() => {
        aliexpressPriceDTOS.forEach(dtos => {
          this.form.variants.findIndex((item, index) => {
            if (item.productSku === dtos.productSku) {
              this.setCalculatePrice(item, { [calculateKey]: item[calculateKey] }, index, calculateType, errMsg, calculateKey, '计算出错')
            }
          })
        })
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 设置计算后的显示
    setCalculatePrice(item, data, index, calculateType, errMsg, calculateKey, msg) {
      const { lmsChannelOptimizeDTO, oceanPriceRange, airPriceRange, priceRange } = data
      this.form.variants.splice(index, 1, {
        ...this.form.variants[index],
        skuPrice: calculateType === 1 ? item.skuPrice : data.price,
        profitRate: calculateType === 2 ? item.profitRate : data.profitRate,
        profitAmount: calculateType === 3 ? item.profitAmount : data.profitAmount,
        [errMsg]: lmsChannelOptimizeDTO ? '' : msg || '没有合适的物流',
        logisticsInfo: {
          ...lmsChannelOptimizeDTO,
          oceanPriceRange,
          airPriceRange,
          priceRange,
          costPrice: item.costPrice,
          wareType: item.wareType,
          isVirtual: item.isVirtual,
          packWeight: item.packWeight
        } || ''
      })
      this.$refs.form.validateField(`variants.${index}.${calculateKey}`)
    },
    // 查看子SKU物流列表
    showLogisticsList(data) {
      this.$modal({
        title: '子SKU物流列表',
        component: showLogisticsList,
        width: '1000px',
        data: {
          logistics: data.logistics || [],
          productSku: data.productSku
        }
      })
    },
    // 设置变体仓库类型
    changeWareHouse(value, row, index, update) {
      row.warehouseList && row.warehouseList.findIndex(item => {
        if (item.warehouseId === value) {
          row.wareType = item.type
          row.isVirtual = item.isVirtual
        }
      })
      // 设置仓库更新物流
      update && this.getOptimizeByCountry(row, index, update)
    },
    // 查询成本价
    getPrice(skuList) {
      return new Promise((resolve, reject) => {
        const skuMap = {}
        skuList.forEach(item => (skuMap[item.productSku] = item.costPrice))
        const { accountCode, storeLevelId } = this.baseProductInfo
        this.$emit('productLoadingStart')
        Api.getPrice({
          platformCode: 'SM',
          skuMap,
          storeCode: accountCode,
          storeSite: undefined,
          storeLevel: storeLevelId
        }).then(res => {
          resolve(res)
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      })
    },
    // 获取物流信息批量
    getOptimize(sku) {
      return new Promise((resolve, reject) => {
        const { account, accountCode } = this.baseProductInfo
        if (account && sku.warehouseId && sku.sendPlaceName && sku.productSku) {
          const countryCode = sku.sendPlaceName === 'UK' ? 'GB' : sku.sendPlaceName
          const warehouse = sku.warehouseId.split(',')
          this.$emit('productLoadingStart')
          Api.getOptimize({
            storeName: account,
            storeCode: accountCode,
            platformCode: 'SM',
            countryCode: countryCode === 'CN' || countryCode === '中国' ? 'RU' : countryCode,
            skus: [sku.productSku],
            warehouse: warehouse[warehouse.length - 1],
            type: sku.wareType
          }).then(res => {
            // const data = [{ channelCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '55', priceHigh: '100' }, { channelCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '130', priceHigh: '800' }]
            const data = res.data ? res.data.map(item => {
              item.cost = item.cost ? Number(item.cost).toFixed(2) : item.cost
              return item
            }) : []
            resolve({ data })
          }).finally(() => {
            this.$emit('productLoadingEnd')
          })
        }
      })
    },
    batchUpdate() {
      this.$modal({
        title: '批量修改库存',
        component: batchUpdateStock,
        width: '400px',
        callback: (data) => {
          if (data) {
            this.form.variants.forEach(item => {
              !item.noPermission && (item.ipmSkuStock = data)
            })
          }
        }
      })
    },
    batchUpdateSkuPrice(calculateType) {
      const inputKey = {
        1: { value: 'skuPrice', label: '零售价' },
        2: { value: 'profitRate', label: '利润率' },
        3: { value: 'profitAmount', label: '利润额' }
      }
      this.$modal({
        title: `批量修改${inputKey[calculateType].label}`,
        component: batchUpdateRate,
        width: '400px',
        data: {
          title: inputKey[calculateType].label
        },
        callback: (data) => {
          if (data) {
            this.form.variants.forEach(item => {
              !item.noPermission && (item[inputKey[calculateType].value] = data)
            })
            this.calculatePrice(this.form.variants, null, calculateType)
          }
        }
      })
    },
    // 非发货地变体属性名显示
    showAttrName(row, i) {
      let currAttrValId = ''
      let currAttrValName = ''
      const skuIdArr = row.skuId.split(';')
      skuIdArr.find(item => {
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
    bulkDiscountChange(value) {
      if (value > 20) {
        this.form.bulkDiscount = 20
      }
      this.$refs.form.validateField('bulkOrder')
    },
    bulkOrderChange(event) {
      // 批量价满2-100000时
      const value = event.target.value
      this.form.bulkOrder = value.replace(/^0/, '')
      if (value) {
        if (+value < 2) { this.form.bulkOrder = 2 }
        if (+value > 100000) { this.form.bulkOrder = 100000 }
      }
    },
    goLink() {
      this.$newTab({
        path: '/lms/lmsAliExpress/aliExpressTemp/area/area',
        title: '区域调价模板',
        component: area,
        clearCache: true
      })
    },
    // 获取SKU列表值
    getSkuValue() {
      return addListingHandle.getSkuValues(this.form.variants, this.sendPlace, this.customized)
    }
  }
}
</script>

<style lang="scss" scoped>
.w90{ width: 90px; }
.w50{ width: 50px; }
.m-top-10{ margin-top: -10px; }
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
::v-deep .info-row td{
  background: #f5f5f5 !important;
  cursor: no-drop;
}
.el-form-item_no-lable ::v-deep .el-form-item__content{
  margin-left: 0 !important;
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
</style>
