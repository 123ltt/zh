<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="sp-form  form-col">
    <el-row class="w-90">
      <el-col :span="12">
        <el-form-item label="变体主题" prop="variationThemes">
          <el-select v-model="form.variationThemes" filterable placeholder="请选择" class="g-w100" @change="changeVarTheme">
            <el-option v-for="(item, index) in varThemeList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="促销开始时间" prop="saleStartDate">
          <el-date-picker
            v-model="form.saleStartDate"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="促销开始时间"
            class="g-w100"
            @change="() => saleDateHandle(form.saleStartDate, 'saleStartDate', form)"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="销售利润率" prop="grossProfit">
          <el-input v-model="form.grossProfit" v-input.positive @input="() => {form.grossProfit = toFixed2(form.grossProfit)}" @blur="upateGrossModifyPrice()" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="促销结束时间" prop="saleEndDate">
          <el-date-picker
            v-model="form.saleEndDate"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="促销结束时间"
            class="g-w100"
            @change="() => saleDateHandle(form.saleEndDate, 'saleEndDate', form)"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-table :data="form.skuList" :row-class-name="tableRowClassName" row-key="productSku" border stripe highlight-current-row class="form-table g-table g-table-dense">
      <el-table-column label="子SKU" min-width="100">
        <template slot-scope="{ row, $index }">
          <el-form-item
            v-if="row.variantDraftStatus === 'add' "
            :prop="'skuList.' + $index + '.productSku'"
            :rules="[{ required: true, message: 'SKU不能为空', trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
              <el-select v-model="row.productSku" filterable clearable size="mini" placeholder="请选择" @visible-change="visibleChange" @change="(value) => changeSku(value, $index)">
                <el-option v-for="(item, index) in removeSkuListShow"
                           :key="index"
                           :label="item.productSkuShow"
                           :value="item.productSku"
                           :disabled="item.disabled"
                />
              </el-select>
            </el-tooltip>
          </el-form-item>
          <template v-else>
            <template v-if="row.noPermission">
              <el-tooltip
                class="item"
                effect="dark"
                content="SKU不可用，保存时不会提交此SKU信息"
                placement="top-start"
              >
                <span>{{ row.productSku }}</span>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
                <div>{{ row.productSku }}</div>
              </el-tooltip>
            </template>
          </template>
          <span v-if="row.lstAttrSpecificationText!==','">{{ row.lstAttrSpecificationText }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="70">
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
              <g-thumb v-if="row.imgShowList && row.imgShowList.length" :url="row.mainImage || row.extraImagList[0]" :width="40" :height="40" />
              <el-button :disabled="Boolean(row.noPermission)" type="text" @click="changeImgModal(row, $index)">more</el-button>
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品通用编码" min-width="107">
        <template #header>
          <el-select v-model="form.standardProdcutIdType" :disabled="isEdit" size="mini" placeholder="请选择" :class="!isEdit && 'has-error has-error-y'">
            <el-option v-for="item in standardProdcutIdTypeList" :key="item" :label="item" :value="item" />
          </el-select>
          <el-checkbox v-if="!isEdit" v-model="form.isAutoProdcutId" @change="isAutoProdcutIdChange">从号码池自动获取</el-checkbox>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.standardProdcutIdValue'"
            :rules="[{ required: true, validator: validStandardValue(row, $index), trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.standardProdcutIdValue" :disabled="(isEdit && row.variantDraftStatus !== 'add') || form.isAutoProdcutId" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Condition" min-width="80">
        <template slot-scope="{ row }">
          <el-select v-model="row.condition" :disabled="isEdit && row.variantDraftStatus !== 'add'" placeholder="请选择" size="mini">
            <el-option v-for="cond in row.conditionList" :key="cond" :label="cond" :value="cond" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="变体属性" min-width="120">
        <template slot="header">
          <span class="has-error">变体属性</span>
        </template>
        <template slot-scope="{ row, $index }">
          <el-row :gutter="5">
            <el-col
              v-for="(attr, idx) in row.skuAttrs"
              :key="$index+idx"
              :span="((attr.unitList && attr.unitList.length) || row.skuAttrs.length === 1) ? 24 : 12"
              :class="idx + 1 < row.skuAttrs.length && 'mb-1'"
            >
              <el-form-item
                :prop="'skuList.' + $index + '.skuAttrs.' + idx + '.value'"
                :rules="[{ required: true, message: '变体属性不能为空', trigger: 'blur' }]"
                class="el-form-item_no-lable"
              >
                <div class="d-flex">
                  <el-input v-if="attr.type == 'number'" v-model="attr.value" v-input.number :disabled="Boolean(row.noPermission)" size="mini" :placeholder="attr.relationAttrName" />
                  <el-input v-if="attr.type == 'text'" v-model="attr.value" :disabled="Boolean(row.noPermission)" size="mini" :placeholder="attr.relationAttrName" />
                  <el-select
                    v-if="attr.type == 'select'"
                    v-model="attr.value"
                    :disabled="Boolean(row.noPermission)"
                    :placeholder="attr.relationAttrName"
                    size="mini"
                    filterable
                  >
                    <el-option v-for="opt in attr.optionValueList" :key="opt" :label="opt" :value="opt" />
                  </el-select>
                  <div v-if="attr.unitList && attr.unitList.length" class="w-50 ms-1">
                    <!-- 单位选择器 -->
                    <el-select v-model="attr.unit" :disabled="Boolean(row.noPermission)" size="mini" placeholder="单位" class="unit-yy" filterable @change="(value) => changeUnit(value, attr.relationAttrName)">
                      <el-option v-for="unit in attr.unitList" :key="unit" :label="unit" :value="unit" />
                    </el-select>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="售价" min-width="80">
        <template slot="header">
          <span class="has-error">售价</span>
          <el-button type="text" @click="batchUpdateSkuPrice">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.standardPrice'"
            :rules="row.noPermission ? [] : [{ required: true, validator: updateCurrentPrice(row, $index), trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.standardPrice" v-input.positive :disabled="Boolean(row.noPermission)" size="mini" @input="() => {row.standardPrice = toFixed2(row.standardPrice)}" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="促销价" min-width="80" prop="salePrice">
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.salePrice'"
            :rules="[{ required: true, validator: validSalePrice(row, $index), trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.salePrice" v-input.positive :disabled="Boolean(row.noPermission)" size="mini" @input="() => {row.salePrice = toFixed2(row.salePrice)}" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="成本|利润率" min-width="80">
        <template slot-scope="{ row }">
          {{ row.costPrice }} | {{ row.profitMargin }}
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="60">
        <template slot="header">
          <span class="has-error">库存</span>
          <el-button type="text" @click="batchUpdate">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.quantity'"
            :rules="[{ required: true, message: '库存不能为空', trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.quantity" v-input.positive.numeric :disabled="Boolean(row.noPermission)" maxlength="4" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="物流" min-width="70">
        <template slot-scope="{ row }">
          <el-button v-if="row.logisticsObj" type="text" @click="showLogisticsList(row)">{{ row.logisticsObj.channelCode }} ({{ row.logisticsObj.cost || '-' }})</el-button>
          <el-button v-else type="text" @click="showLogisticsList(row)">可发物流</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="!baseProductInfo.listingStatus || baseProductInfo.listingStatus === 1 || baseProductInfo.listingStatus === 4" label="操作" min-width="80">
        <template slot-scope="{ row, $index }">
          <el-button v-if="form.skuList.length > 1" circle icon="el-icon-minus" size="mini" class="m-l-10" title="点击删除" @click="removeChildSku(row, $index)" />
          <el-button circle icon="el-icon-plus" size="mini" class="m-l-10" title="点击添加" @click="addChildSku(row, $index)" />
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import { toFixed2, saleDateHandle, variantObj } from './addListing.handle.js'
import { deepClone } from '@/util/util'
import changeChildSkuImg from './changeChildSkuImg.vue'
import showLogisticsList from './showLogisticsList.vue'
import { getOptimize, getPrice } from '@/api/amazon/amazon.js'
import { getVariationTheme, getVariationAttr } from '@/api/amazon/templateList.js'
import batchUpdateStock from '@/views/lmsLazada/lazada/components/batchUpdateStock.vue'
import batchUpdateRate from '@/views/components/batchUpdateRate.vue'
export default {
  name: 'VariantAttr',
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    baseProductInfo: { // 产品详细信息
      type: Object,
      default: () => {}
    },
    standardProdcutIdTypeList: Array, // 产品通用编码
    conditionList: Array,
    isEdit: Boolean,
    lstSku: Array
  },
  data() {
    const validStartDate = (rule, value, callback) => {
      if (value && this.form.saleEndDate) {
        const start = new Date(value)
        const end = new Date(this.form.saleEndDate)
        if (end.getTime() < start.getTime()) {
          callback(new Error('促销开始时间不能大于促销结束时间'))
        } else if (end.getTime() === start.getTime()) {
          callback(new Error('促销开始时间不能等于促销结束时间'))
        } else {
          callback()
          this.$refs.form.clearValidate('saleEndDate')
        }
      } else {
        const i = this.form.skuList.findIndex(item => item.salePrice)
        if (this.form.saleEndDate || i > -1) {
          callback(new Error('促销开始时间不能为空'))
        } else {
          callback()
        }
      }
    }
    const validEndDate = (rule, value, callback) => {
      if (value && this.form.saleStartDate) {
        const end = new Date(value)
        const start = new Date(this.form.saleStartDate)
        if (end.getTime() < start.getTime()) {
          callback(new Error('促销结束时间不能小于促销开始时间'))
        } else if (end.getTime() === start.getTime()) {
          callback(new Error('促销结束时间不能等于促销开始时间'))
        } else {
          callback()
          this.$refs.form.clearValidate('saleStartDate')
        }
      } else {
        const i = this.form.skuList.findIndex(item => item.salePrice)
        if (this.form.saleStartDate || i > -1) {
          callback(new Error('促销结束时间不能为空'))
        } else {
          callback()
        }
      }
    }
    return {
      toFixed2,
      saleDateHandle,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      oldGrossProfit: '',
      form: {
        isAutoProdcutId: false,
        // 产品通用编码
        standardProdcutIdType: 'UPC', // 对应标准产品id类型
        variationThemes: '', // 变体主题
        grossProfit: '', // 销售利润率
        profitMargin: '', // 实际刊登利润率
        saleStartDate: '', // 促销开始时间
        saleEndDate: '', // 促销结束时间
        skuList: []
      },
      rules: {
        variationThemes: [{ required: true, message: '变体主题不能为空', trigger: 'change' }],
        saleStartDate: [{ validator: validStartDate, trigger: 'change' }],
        saleEndDate: [{ validator: validEndDate, trigger: 'change' }]
      },
      // 变体主题列表
      varThemeList: [],
      // 变体属性
      skuAttrs: [],
      // 模板
      productType: '',
      // 删除的sku列表
      removeSkuList: [],
      removeSkuListShow: []

    }
  },
  watch: {
    'baseProductInfo'() {
      this.watchInfo()
    }
  },
  methods: {
    // 监听数据
    watchInfo(hasSkuAttrs) {
      if (this.baseProductInfo.skuList) {
        const { skuList, grossProfit, profitMargin, variationThemes, lstSku = [] } = deepClone(this.baseProductInfo)
        this.removeSkuList = lstSku
        this.form.grossProfit = grossProfit
        this.oldGrossProfit = grossProfit
        this.form.variationThemes = variationThemes
        this.form.skuList = skuList.map(item => {
          item.conditionList = this.conditionList
          if (!this.isEdit) {
            item.condition = this.conditionList[0]
            // 实际刊登毛利率
            item.profitMargin = profitMargin
            // 物流信息
            item.logisticsObj = null
          } else {
            this.form.saleStartDate = item.saleStartDate
            this.form.saleEndDate = item.saleEndDate
            item.productSkuShow = `${item.nwSku} - ${item.productSku}`
          }
          return item
        })
        this.form.skuList.forEach(item => { // 拿到productName用于展示tooltip
          this.lstSku.forEach(ls => {
            if (item.productSku === ls.productSku) {
              item.productName = ls.productName
            }
          })
        })
        this.resetSkuList()
      }
    },
    // 图片校验
    validImage(sku, index) {
      return (rule, value, callback) => {
        if (sku.mainImage && sku.extraImagList.length && sku.extraImagList.length <= 8) {
          callback()
        } else {
          callback(new Error('主图单选，副图最多选8张'))
        }
      }
    },
    validStandardValue(sku, index) {
      return (rule, value, callback) => {
        if ((sku.standardProdcutIdValue || this.form.isAutoProdcutId) && this.form.standardProdcutIdType) {
          callback()
        } else {
          callback(new Error('产品通用编码不能为空'))
        }
      }
    },
    // 重置sku下拉列表
    resetSkuList() {
      const selectedSku = this.form.skuList.map(item => item.productSku)
      this.removeSkuListShow.forEach(item => {
        item.disabled = false
        if (selectedSku.includes(item.productSku)) {
          item.disabled = true
        }
      })
    },
    // 修改价格算实际刊登利润率
    updateCurrentPrice(sku, index) {
      // const index = rule.field.match(/\d/)[0]
      // const sku = this.form.skuList[index]
      return (rule, value, callback) => {
        if (sku.standardPrice) {
          let isSection = ''
          let profitMargin = ''
          const isHas = sku.logistics && sku.logistics.find(item => {
            // 是否当前项物流的金额区间
            isSection = +sku.standardPrice >= +item.priceLow && +sku.standardPrice <= +item.priceHigh
            // 总成本 = 运费 + 成本
            const totalCost = +item.cost + +sku.costPrice
            // 实际毛利率 = 1 - 抵扣率 - 总成本 / 售价
            profitMargin = (1 - +sku.deductPrice - totalCost / +sku.standardPrice).toFixed(2) * 1
            // 判断当前售价在哪个物流的金额区间内就取哪个运费得出的毛利率要大于0
            if (isSection && +profitMargin > 0) {
              // 重量回显，后端要求重量放在物流字段里
              this.form.skuList[index].logisticsObj = item
              this.form.skuList[index].profitMargin = profitMargin
              return item
            }
          })
          if (!isHas) {
            this.form.skuList[index].logisticsObj = null
            this.form.skuList[index].profitMargin = ''
            if ((+profitMargin + +sku.deductPrice) >= 1) {
              callback(new Error(`利润率+抵扣率(${sku.deductPrice})不能大于1`))
            } else if (!isSection) {
              callback(new Error('价格没有适合的物流金额区间'))
            } else if (profitMargin < 0) {
              callback(new Error(`润率不能亏本(${profitMargin})`))
            } else {
              callback()
            }
          } else {
            callback()
          }
        } else {
          if (this.oldGrossProfit !== this.form.grossProfit) {
            callback(new Error('价格没有适合的物流金额区间'))
          } else {
            callback(new Error('价格不能小于0'))
          }
        }
      }
    },
    // 修改利润算售价
    upateGrossModifyPrice(grossProfit) {
      if (grossProfit) {
        this.form.grossProfit = grossProfit
        this.oldGrossProfit = grossProfit
      }
      if (!this.form.skuList.length) return
      if (Number(this.form.grossProfit) === 0) {
        this.$message.error('销售利润率不能小于0')
        return false
      }
      this.form.skuList.forEach((sku, index) => {
        if (!sku.logistics || !sku.logistics.length) {
          return false
        }
        let standardPrice = ''
        let cost = null
        const isHas = sku.logistics.find(item => {
          // 总成本 = 运费 + 成本
          const totalCost = +item.cost + +sku.costPrice
          // 售价 = (总成本 +运费) / (1-抵扣率 - 利润率)
          standardPrice = (totalCost / (1 - +sku.deductPrice - +this.form.grossProfit)).toFixed(2) * 1
          cost = item
          // 是否当前项物流的金额区间
          if (+standardPrice >= +item.priceLow && +standardPrice <= +item.priceHigh) {
            return item
          }
        })
        if (isHas) {
          this.$set(this.form.skuList[index], 'standardPrice', standardPrice)
          sku.profitMargin = this.form.grossProfit
          sku.logisticsObj = cost
        } else {
          this.$set(this.form.skuList[index], 'standardPrice', '')
          sku.profitMargin = ''
          sku.logisticsObj = null
          // this.$refs.form.validateField('skuList.' + index + '.standardPrice')
        }
        this.oldGrossProfit = ''
        this.$refs.form.validateField('skuList.' + index + '.standardPrice')
        this.oldGrossProfit = this.form.grossProfit
      })
    },
    // 修改促销价
    validSalePrice(sku, index) {
      return (rule, value, callback) => {
        if (value && Number(value) === 0) {
          callback(new Error('促销价不能小于0'))
        } else if (sku.logistics.length && sku.costPrice && sku.deductPrice && value) {
          let isSection = ''
          let profitMargin = ''
          const isHas = sku.logistics.find(item => {
            // 是否当前项物流的金额区间
            isSection = +value >= +item.priceLow && +value <= +item.priceHigh
            // 总成本 = 运费 + 成本
            const totalCost = +item.cost + +sku.costPrice
            // 实际毛利率 = 1 - 抵扣率 - 总成本 / 售价
            profitMargin = (1 - +sku.deductPrice - totalCost / +value).toFixed(2) * 1
            // 判断当前售价在哪个物流的金额区间内就取哪个运费得出的毛利率要大于0
            if (isSection && +profitMargin > 0) {
              return item
            }
          })
          if (!isHas) {
            if (profitMargin < 0) {
              callback(new Error(`促销利润率(${profitMargin})不能亏本`))
            }
            if (!isSection) {
              callback(new Error('促销价没有适合的物流金额区间'))
            }
            if ((+profitMargin + +sku.deductPrice) >= 1) {
              callback(new Error(`促销利润率(${profitMargin})+抵扣率(${sku.deductPrice})不能大于1`))
            }
          } else {
            callback()
          }
        } else {
          if (this.form.saleStartDate || this.form.saleEndDate) {
            callback(new Error('促销价不能为空'))
          } else {
            const i = this.form.skuList.findIndex(item => item.salePrice)
            if (i === -1) {
              this.$refs.form.validateField('saleStartDate')
              this.$refs.form.validateField('saleEndDate')
            }
            callback()
          }
        }
      }
    },
    // 获取物流信息 单个
    getOptimizeAndPrice(productSku, productCost) {
      return new Promise((resolve, reject) => {
        const { account, amazonSite, platformCode, accountCode, storeLevelId, siteId } = this.baseProductInfo
        if (account && amazonSite && platformCode && productSku) {
          this.logisticsLoading = true
          this.$emit('productLoadingStart')
          const request = []
          request.push(getPrice({ platformCode, skuMap: { [productSku]: productCost }, storeCode: accountCode, storeSite: siteId, storeLevel: storeLevelId }))
          request.push(getOptimize({
            storeName: account,
            storeCode: accountCode,
            countryCode: amazonSite === 'UK' ? 'GB' : amazonSite,
            platformCode,
            skus: [productSku],
            warehouse: 'Z20',
            type: 'SELF_BUILT'
          }))
          Promise.all(request).then(res => {
            const data0 = res[0].data[productSku]
            resolve({
              deductPrice: data0.deductRate,
              // logistics: res[1].data || []
              logistics: [{ channelCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '33', priceHigh: '99999' }, { channelCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '0.333', priceHigh: '5.38' }]
            })
          }).finally(() => {
            this.logisticsLoading = false
            this.$emit('productLoadingEnd')
          })
        }
      })
    },
    // 获取物流信息批量
    getOptimize(isEdit) {
      return new Promise((resolve, reject) => {
        const { account, amazonSite, platformCode, accountCode } = this.baseProductInfo
        if (account && amazonSite && platformCode && this.form.skuList.length) {
          const countryCode = amazonSite === 'UK' ? 'GB' : amazonSite
          const request = []
          this.form.skuList.forEach((item, index) => {
            item.logistics = []
            request.push(getOptimize({
              storeName: account,
              storeCode: accountCode,
              platformCode,
              countryCode,
              skus: [item.productSku],
              warehouse: 'Z20',
              type: 'SELF_BUILT'
            }))
          })
          this.$emit('productLoadingStart')
          Promise.all(request).then(res => {
            res.map((item, index) => {
              // this.$nextTick(() => {
              const data = [{ channelCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '55', priceHigh: '100' }, { channelCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '130', priceHigh: '800' }]
              //   this.$set(this.form.skuList[index], 'logistics', data)
              this.form.skuList[index].logistics = data
              //   // this.$set(this.form.skuList[index], 'logistics', item.data || [])
              // })
            })
            // setTimeout(() => {
            !this.isEdit && this.upateGrossModifyPrice()
            // }, 600)
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
    // 查询成本价
    getPrice() {
      return new Promise((resolve, reject) => {
        const skuMap = {}
        this.baseProductInfo.skuList.map(item => {
          skuMap[item.productSku] = item.productCost
        })
        const { accountCode, storeLevelId, siteId } = this.baseProductInfo
        this.$emit('productLoadingStart')
        getPrice({
          platformCode: 'AM',
          skuMap,
          storeCode: accountCode,
          storeSite: siteId,
          storeLevel: storeLevelId
        }).then(res => {
          const data = res.data
          this.form.skuList.forEach(item => {
            data[item.productSku] && this.$nextTick(() => {
              this.$set(item, 'deductPrice', data[item.productSku].deductRate) // 抵扣率
            })
          })
          resolve(true)
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      })
    },
    getOtherInfo(isEdit) {
      if (this.form.skuList.length) {
        this.getPrice().then(res => {
          this.getOptimize(isEdit).then(res => {
            // 编辑初始化由售价推算出运费和实际刊登率
            // if (isEdit) {
            //   this.$refs.form.validateField('standardPrice')
            // }
          })
        })
      }
    },
    // 选择子SKU图片
    changeImgModal(item, index) {
      this.$modal({
        title: '请选择子SKU图片',
        component: changeChildSkuImg,
        width: '1000px',
        padding: '20px',
        data: {
          data: item
        },
        callback: (data) => {
          if (data) {
            this.form.skuList[index].imgShowList = data.imgShowList
            this.form.skuList[index].mainImage = data.mainImage
            this.form.skuList[index].extraImagList = data.extraImagList
            this.$refs.form.validateField('skuList.' + index + '.imgShowList')
          }
        }
      })
    },
    // 获取变体主题列表
    getVarList(productType, attrName) {
      // attrType 属性类型：1代表普通；2代表变体主题；获取变体主题需要传2
      this.productType = productType
      getVariationTheme({
        templateName: productType,
        attrType: 2
      }).then(res => {
        if (res.data.length) {
          this.varThemeList = res.data
          if (attrName) {
            this.changeVarTheme(attrName, true)
          }
        }
      })
    },
    // 获取变体属性
    changeVarTheme(value, initial) {
      this.$emit('productLoadingStart')
      getVariationAttr({ attrName: value, templateName: this.productType }).then(res => {
        this.skuAttrs = res.data.map(item => {
          item.value = ''
          return item
        })
        this.setVarAttrDetail(this.form.skuList, initial)
        this.setVarAttrDetail(this.removeSkuList, initial)
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
      this.resetSkuList()
    },
    // 设置变体属性默认值
    setVarAttrDetail(skuList, initial) {
      if (skuList.length) {
        skuList.forEach((item, inde) => {
          const skuAttrs = deepClone(this.skuAttrs)
          if (initial) {
            skuAttrs.forEach(a => {
              const index = item.skuAttrs?.findIndex(t => t.name === a.relationAttrName)
              if (index > -1) {
                a.value = item.skuAttrs[index].value
                a.unit = item.skuAttrs[index].unit
              }
            })
          }
          this.$nextTick(() => {
            this.$set(skuList[inde], 'skuAttrs', skuAttrs)
          })
        })
        this.resetSkuList()
      }
    },
    // 从号码池自动获取
    isAutoProdcutIdChange(value) {
      if (value) {
        this.form.skuList.forEach(item => {
          this.$nextTick(() => {
            this.$set(item, 'standardProdcutIdValue', '')
          })
        })
      }
    },
    // 获取子SKU列表值
    getSkuValue() {
      const addSkuList = this.removeSkuList.filter(item => {
        const i = this.form.skuList.findIndex(sku => sku.productSku === item.productSku)
        if ((item.id || item.standardPric) && i === -1) {
          return item
        }
      })
      const list = [...addSkuList, ...this.form.skuList]
      return list.map(item => {
        const {
          condition, costPrice, profitMargin, grossProfit, mainImage, productSku, quantity,
          salePrice, skuAttrs, standardPrice, standardProdcutIdValue, extraImagList, id, variantDraftStatus
        } = item
        const varValueList = []
        skuAttrs.map(item => {
          varValueList.push({
            name: item.relationAttrName,
            value: item.value,
            unit: item.unit
          })
        })
        return {
          id,
          variantDraftStatus,
          condition,
          costPrice,
          extraImages: extraImagList.join(';'),
          grossProfit: this.baseProductInfo.grossProfitCate || this.baseProductInfo.accountGrossProfit || grossProfit, // 销售利润率
          profitMargin,
          logistics: item.logisticsObj ? JSON.stringify(item.logisticsObj) : item.logisticsObj,
          mainImage,
          productSku,
          quantity,
          saleEndDate: this.form.saleEndDate,
          salePrice,
          saleStartDate: this.form.saleStartDate,
          skuAttrs: varValueList ? JSON.stringify(varValueList) : varValueList,
          standardPrice,
          standardProdcutIdType: this.form.standardProdcutIdType, // 标准产品id类型
          standardProdcutIdValue
        }
      })
    },
    // 无权刊登style
    tableRowClassName({ row, rowIndex }) {
      if (row.noPermission) {
        return 'info-row'
      }
      return ''
    },
    visibleChange(value) {
      if (value) {
        this.removeSkuListShow = this.removeSkuList
        // .filter(item => {
        //   const sku = this.form.skuList.findIndex(sku => sku.productSku === item.productSku)
        //   if (sku === -1) {
        //     return item
        //   }
        // })
      }
    },
    // 选择SKU事件
    changeSku(value, index) {
      this.resetSkuList()
      const removeIndex = this.removeSkuList.findIndex(item => item.productSku === value)
      this.form.skuList[index] = Object.assign(this.form.skuList[index], deepClone(this.removeSkuList[removeIndex]))
      // this.removeSkuList.splice(removeIndex, 1)
      const drafIndex = this.baseProductInfo.amazonDraftSkuVOList.findIndex(item => item.productSku === this.form.skuList[index].productSku)
      this.form.skuList[index].variantDraftStatus = drafIndex > -1 && this.form.skuList[index].id ? 'edit' : 'add'
      this.getOptimizeAndPrice(value, this.form.skuList[index].productCost).then(res => {
        this.form.skuList[index].deductPrice = res.deductPrice
        this.form.skuList[index].logistics = res.logistics
      })
    },
    addChildSku(row, index) {
      const obj = deepClone(variantObj)
      obj.conditionList = this.conditionList
      obj.skuAttrs = deepClone(this.form.skuList[0].skuAttrs)
      for (const p in obj.skuAttrs) {
        obj.skuAttrs[p].value = ''
      }
      this.form.skuList.push(obj)
    },
    // 删除子sku事件
    removeChildSku(row, index) {
      if (this.isEdit) {
        row.variantDraftStatus = 'delete'
      }
      !row.noPermission && row.productSku && this.removeSkuList.findIndex(item => item.productSku === row.productSku) === -1 && this.removeSkuList.push(row)
      this.form.skuList.splice(index, 1)
      this.resetSkuList()
    },
    // 清除变体主题级变体属性
    clearVarThemeList() {
      this.varThemeList = []
      this.form.variationThemes = ''
      this.form.skuList.forEach(item => {
        this.$set(item, 'skuAttrs', [])
      })
    },
    // 单位联动
    changeUnit(value, relationAttrName) {
      this.form.skuList.forEach(item => {
        item.skuAttrs.forEach(skuAttr => {
          if (skuAttr.relationAttrName === relationAttrName) {
            skuAttr.unit = value
          }
        })
      })
    },
    batchUpdate() {
      this.$modal({
        title: '批量修改库存',
        component: batchUpdateStock,
        width: '400px',
        callback: (data) => {
          if (data) {
            this.form.skuList.forEach(item => {
              item.quantity = data
            })
          }
        }
      })
    },
    batchUpdateSkuPrice(calculateType) {
      this.$modal({
        title: '批量修改售价',
        component: batchUpdateRate,
        width: '400px',
        data: {
          title: '售价'
        },
        callback: (data) => {
          if (data) {
            this.form.skuList.forEach((item, i) => {
              item.standardPrice = data
              this.$refs.form.validateField('skuList.' + i + '.standardPrice')
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.unit-yy{
  ::v-deep .el-input__inner{
    padding-right: 18px;
    padding-left: 5px;
  }
  ::v-deep .el-input__icon{
    width: 12px;
  }
}
.g-thumb{
  vertical-align: middle;
  padding-right: 5px;
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
.has-error-y{
  &::before{ top: 5px; }
}
.form-table{
  .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
  ::v-deep .el-form-item__error{
    position: initial;
  }
}
</style>
