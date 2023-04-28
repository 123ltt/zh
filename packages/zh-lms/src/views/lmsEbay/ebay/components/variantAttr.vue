<template>
  <el-form ref="form" v-loading="countLoading" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="sp-form  form-col">
    <el-form-item label="物流">
      <logicalsList v-loading="logisticsLoading" :logicals-list="logicalsList" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item v-if="!isEdit && baseProductInfo.spuSpecificationAttrs && baseProductInfo.spuSpecificationAttrs.length" label="产品规格属性" prop="spuSpecificationAttrs">
          <div class="el-form-item__content">{{ baseProductInfo.spuSpecificationAttrs && baseProductInfo.spuSpecificationAttrs.join(',') }}</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="销售利润率" prop="saleProfitRate">
          <el-input v-model="form.saleProfitRate"
                    v-input.positive
                    @input="() => {form.saleProfitRate = toFixed2(form.saleProfitRate)}"
                    @blur="getBlurProfitRate"
                    @focus="getFocusProfitRate"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-table :data="form.skuList" :row-class-name="tableRowClassName" row-key="productSku" border stripe highlight-current-row class="form-table g-table g-table-dense">
      <el-table-column label="子SKU" min-width="80">
        <template slot-scope="{ row, $index }">
          <el-form-item
            v-if="isVariation"
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
                content="SKU不可用"
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
          <span v-if="row.lstAttrSpecificationText">({{ row.lstAttrSpecificationText }})</span>
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
          <el-select v-model="form.productIdType" :disabled="isEdit" size="mini" placeholder="请选择" :class="!isEdit && 'has-error has-error-y'">
            <el-option v-for="item in standardProdcutIdTypeList" :key="item" :label="item" :value="item" />
          </el-select>
          <el-checkbox v-if="!isEdit" v-model="form.isFromNumPool" @change="isAutoProdcutIdChange">从号码池自动获取</el-checkbox>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.productIdTypeValue'"
            :rules="[{ required: true, validator: validStandardValue(row, $index), trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.productIdTypeValue" :disabled="isEdit ? row.optType !== 3 : form.isFromNumPool" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="EPID" min-width="80">
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.epid'"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.epid" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <template>
        <template v-for="(attr, i) in form.lstAttrHead">
          <el-table-column :key="i" label="变体属性" min-width="80">
            <template #header>
              <el-form-item
                :prop="'lstAttrHead.' +i+'.name'"
                :rules="[{ required: true, message: '属性不能为空', trigger: 'blur' }]"
                class="el-form-item_no-lable"
              >
                <div class="d-flex has-error has-error-y">
                  <el-input v-model="attr.name" placeholder="Varition attributes" class="var-name" size="mini" />
                  <el-button v-if="removeAttrShow(i) && !onlineDisabled(attr)" size="mini" icon="el-icon-minus" class="icon-btn" @click="removeAttr(i)" />
                  <el-button v-if="(i === form.lstAttrHead.length - 1)" size="mini" icon="el-icon-plus" class="icon-btn" @click="addAttr" />
                </div>
              </el-form-item>
            </template>
            <template slot-scope="{ row, $index }">
              <el-form-item
                v-if="row.listingSpecs[i]"
                :prop="'skuList.' + $index + '.listingSpecs.'+i+'.value'"
                :rules="[{ required: true, message: '属性不能为空', trigger: 'blur,change' }]"
                class="el-form-item_no-lable"
              >
                <!-- <el-input v-model="row.listingSpecs[i].value" :disabled="Boolean(row.noPermission)" placeholder="value" size="mini" /> -->
                <inputAutocomplete
                  v-if="attr.optionValueList && attr.optionValueList.length"
                  :val.sync="row.listingSpecs[i].value"
                  :disabled="Boolean(row.noPermission) || onlineDisabled(attr)"
                  :list="attr.optionValueList"
                  placeholder="value"
                />
                <!-- <el-input v-else v-model="valueObj.value" :placeholder="item.name" class="g-w100" /> -->
                <el-input v-else v-model="row.listingSpecs[i].value" :disabled="Boolean(row.noPermission) || onlineDisabled(row, i)" placeholder="value" size="mini" />
              </el-form-item>
            </template>
          </el-table-column>
        </template>
      </template>
      <el-table-column label="售价" min-width="80">
        <template slot="header">
          <div class="has-error">售价</div>
          <el-button type="text" @click="batchUpdatePrice">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.startPrice'"
            :rules="row.noPermission ? [] : [{ required: true, validator: updateCurrentPrice(row, $index), trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.startPrice"
                      v-input.positive.number
                      :disabled="Boolean(row.noPermission)"
                      size="mini"
                      @input="() => {row.startPrice = toFixed2(row.startPrice)}"
                      @blur="validCurrentPrice($event, true)"
                      @focus="getFocusPrice"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="成本|利润率" min-width="80">
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.actualProfitRate'"
            :rules="row.noPermission ? [] : [{ required: true, validator: validRate(row, $index), trigger: 'change' }]"
            class="el-form-item_no-lable"
          >
            {{ row.costPrice?parseFloat(row.costPrice).toFixed(2):'' }} | {{ row.actualProfitRate }}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="60">
        <template slot="header">
          <span class="has-error">库存</span>
          <el-button type="text" @click="batchUpdateStock">批量修改</el-button>
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
      <el-table-column label="运费|重量" min-width="80">
        <template slot-scope="{ row }">
          {{ form.logical && !isNaN(form.logical.cost)? Number(form.logical.cost):'-' }} | {{ row.weight }}
        </template>
      </el-table-column>
      <el-table-column v-if="showHandle" label="操作" min-width="70">
        <template slot-scope="{ row, $index }">
          <div class="d-flex" style="margin-left:-4px">
            <el-button v-if="form.skuList.length > 1" circle icon="el-icon-minus" size="mini" title="点击删除" @click="removeChildSku(row, $index)" />
            <el-button circle icon="el-icon-plus" size="mini" class="ms-2" title="点击添加" @click="addChildSku(row, $index)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import { toFixed2 } from '@/views/lmsAmazon/amazon/components/addListing.handle.js'
import { getSkuValues, variantObj } from './addEbayListing.handle.js'
// import { getSkuValues, variantObj, dealImage } from './addEbayListing.handle.js'
import { deepClone } from '@/util/util'
import changeChildSkuImg from './changeChildSkuImg.vue'
import logicalsList from './logicalsList.vue'
import batchUpdateStock from './batchUpdateStock.vue'
import batchUpdatePrice from './batchUpdatePrice.vue'
import inputAutocomplete from './inputAutocomplete.vue'
import { getCalculateProfitRate, getCalculatePrice, getOptimize } from '@/api/ebay/ebayAdd.js'
export default {
  name: 'VariantAttr',
  components: { logicalsList, inputAutocomplete },
  props: {
    lstAttrHead: Array,
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    },
    // 产品通用编码
    standardProdcutIdTypeList: Array,
    productLoading: Number,
    isEdit: Boolean,
    isShowPay: Boolean,
    isVariation: Boolean
  },
  data() {
    // 修改利润算售价
    const valiGrossProfit = (rule, value, callback) => {
      this.valiGrossProfit(rule, value, callback)
    }
    return {
      toFixed2,
      focusPrice: '',
      blurPrice: '',
      oldGrossProfit: '',
      logicalsList: [],
      logisticsLoading: false,
      blurProfitRate: '',
      focusProfitRate: '',
      form: {
        logical: {},
        lstAttrHead: [],
        isFromNumPool: false,
        // 产品通用编码
        productIdType: 'UPC', // 对应标准产品id类型
        saleProfitRate: '', // 销售利润率
        skuList: [
        ],
        stock: '', // 库存
        startPrice: ''// 售价
      },
      rules: {
        saleProfitRate: [{ validator: valiGrossProfit, trigger: 'blur' }]
      },
      // 变体属性
      skuAttrs: [],
      countLoading: false,
      // 模板
      productType: '',
      extraImgNum: 11, // 副图最多可选张数
      removeSkuList: [],
      removeSkuListShow: [],
      controlFlag: false // 控制接口(售价、利润率)调用
    }
  },
  computed: {
    showHandle() {
      const { itemId, productStatus } = this.baseProductInfo
      return itemId ? productStatus === 5 || productStatus === 7 : !productStatus || productStatus === 1 || productStatus === 4
    }
  },
  watch: {
    'baseProductInfo'() {
      this.watchInfo()
    }
  },
  methods: {
    // 批量修改库存
    batchUpdateStock() {
      this.$modal({
        title: '批量修改库存',
        component: batchUpdateStock,
        width: '400px',
        callback: (data) => {
          if (data) {
            const list = deepClone(this.form.skuList)
            list.forEach(item => {
              item.stock = data
            })
            this.form.skuList = list
          }
        }
      })
    },
    batchUpdatePrice() {
      this.$modal({
        title: '批量修改售价',
        component: batchUpdatePrice,
        width: '400px',
        callback: (data) => {
          if (data) {
            const list = deepClone(this.form.skuList)
            list.forEach(item => {
              item.startPrice = data
            })
            this.form.skuList = list
            this.validCurrentPrice('', true, true) // 修改售价算利润
          }
        }
      })
    },
    getBlurProfitRate(event) {
      this.blurProfitRate = event.target.value
      this.controlFlag = (this.blurProfitRate !== this.focusProfitRate)
    },
    getFocusProfitRate(event) {
      this.focusProfitRate = event.target.value
      this.controlFlag = (this.blurProfitRate !== this.focusProfitRate)
    },
    onlineDisabled(attr, i) {
      const { itemId, productStatus } = this.baseProductInfo
      let status = itemId && productStatus === 7
      if (attr) {
        if (attr.listingSpecs) {
          status = !attr.listingSpecs[i]?.isAdd && status
        } else {
          status = !attr.isAdd && status
        }
      }
      return status
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
    // 删除多变体按钮是否显示
    removeAttrShow(i) {
      const varAttr = this.baseProductInfo.varAttr || []
      const index = varAttr.findIndex(item => item.name === this.form.lstAttrHead[i].name)
      // 类目带出来的多变体不可删除
      return index === -1 && this.form.lstAttrHead.length > 1
    },
    // 监听数据
    watchInfo() {
      if (this.baseProductInfo.skuList && this.baseProductInfo.skuList.length) {
        const { skuList, saleProfitRate, lstAttrHead, lstSku = [], logical } = deepClone(this.baseProductInfo)
        const originSkuList = deepClone(this.form.skuList)
        if (this.isEdit) { // 编辑页回显变体属性
          this.$nextTick(() => {
            this.form.lstAttrHead = lstAttrHead
          })
          this.$set(this.form, 'lstAttrHead', [...lstAttrHead])
        } else {
          this.$nextTick(() => {
            this.form.lstAttrHead = this.lstAttrHead
          })
          this.$set(this.form, 'lstAttrHead', [...this.lstAttrHead])
        }
        this.form.saleProfitRate = saleProfitRate
        this.oldGrossProfit = saleProfitRate
        skuList.forEach(item => {
          lstSku.forEach(list => {
            if (item.productSku === list.productSku) {
              item.productName = list.productName
            }
          })
        })
        if (this.isEdit) { // 编辑状态需要回显库存售价
          this.form.skuList = skuList.map(item => {
            this.form.stock = item.stock
            this.form.startPrice = item.startPrice
            item.productSkuShow = `${item.nwSku} - ${item.productSku}`
            return item
          })
        } else {
          this.form.skuList = skuList.map(item => {
            const e = originSkuList.find(v => item.productSku === v.productSku)
            if (e) {
              item.listingSpecs = e.listingSpecs || []
            }
            return item
          })
        }
        this.resetSkuList()
        this.form.logical = logical
        this.removeSkuList = lstSku
        // []
        // lstSku.forEach(item => {
        //   item.costPrice = item.productCost
        //   if (skuList.findIndex(sku => sku.productSku === item.productSku) === -1) {
        //     dealImage(item)
        //     this.removeSkuList.push(item)
        //   }
        // })
      }
    },
    // 添加变体
    addAttr() {
      this.form.lstAttrHead.push({ name: '', isAdd: true })
      this.form.skuList.forEach(item => {
        item.listingSpecs.push({ value: '', isAdd: true })
      })
    },
    // 删除变体
    removeAttr(i) {
      this.form.lstAttrHead.splice(i, 1)
      this.form.skuList.forEach((item, ind) => {
        item.listingSpecs.forEach((spe, index) => {
          this.$refs.form.clearValidate('skuList.' + ind + '.listingSpecs.' + index + '.value')
        })
        item.listingSpecs.splice(i, 1)
      })
      this.resetSkuList()
    },
    // 图片校验
    validImage(sku, index) {
      return (rule, value, callback) => {
        // 副图不是必选
        if (sku.mainImage && sku.extraImagList.length <= this.extraImgNum) {
          callback()
        } else {
          callback(new Error(`主图单选，副图最多选${this.extraImgNum}张`))
        }
      }
    },
    // 负利润验证
    validRate(sku, index) {
      return (rule, value, callback) => {
        if (Number(sku.actualProfitRate) <= 0) {
          callback(new Error('利润不能小于0'))
        } else {
          callback()
        }
      }
    },
    validStandardValue(sku, index) {
      return (rule, value, callback) => {
        if ((sku.productIdTypeValue || this.form.isFromNumPool) && this.form.productIdType) {
          callback()
        } else {
          callback(new Error('产品通用编码不能为空'))
        }
      }
    },
    // 修改售价基本校验
    updateCurrentPrice(sku, index) {
      return (rule, value, callback) => {
        const { paypalAccount } = this.baseProductInfo
        if (!paypalAccount && this.isShowPay) {
          callback(new Error('支付模板不能为空'))
        } else if (!value || +value === 0) {
          callback(new Error('售价不能小于0'))
        } else if (sku.errMess) {
          callback(new Error(sku.errMess))
        } else {
          callback()
        }
      }
    },
    // 修改利润算售价
    valiGrossProfit(rule, value, callback) {
      const { paypalAccount } = this.baseProductInfo
      if (!paypalAccount && this.isShowPay) {
        callback(new Error('支付模板不能为空'))
      } else if (!this.form.skuList.length) {
        callback(new Error('没有变体信息'))
      } else if (!this.form.saleProfitRate) {
        callback()
      } else if (Number(this.form.saleProfitRate) <= 0) {
        callback(new Error('销售利润率不能小于0'))
      } else if (Number(this.form.saleProfitRate) >= 1) {
        callback(new Error('销售利润率不能大于1'))
      } else if (!this.logicalsList.length) {
        callback(new Error('没有物流信息'))
      } else {
        const priceDTOList = []
        this.form.skuList.map(sku => {
          !sku.noPermission && priceDTOList.push({
            saleProfitRate: this.form.saleProfitRate,
            productSku: sku.productSku,
            // productName: sku.productName,
            lmsChannelOptimizeDTOList: this.logicalsList
          })
        })
        if (!this.controlFlag) {
          callback()
          return
        }
        this.countLoading = true
        this.$emit('productLoadingStart')
        const { publishSiteCode, storeCode, warehouse, isOversea } = this.baseProductInfo
        getCalculatePrice({
          platformCode: 'EB',
          priceDTOList,
          siteCode: publishSiteCode,
          storeCode,
          warehouse,
          paypalAccount,
          isOversea
        }).then(res => {
          if (res.data) {
            const skukeys = Object.keys(res.data)
            const skuValues = Object.values(res.data)
            this.controlFlag = false
            if (skukeys.length) {
              const noChannelSku = []
              skuValues.filter((item, i) => {
                if (!item.matchedChannel) {
                  noChannelSku.push(skukeys[i])
                  return item
                }
              })
              // 所有sku都有物流信息才通过
              if (noChannelSku.length) {
                callback(new Error('没有合适的物流'))
              } else {
                this.form.logical = skuValues[0].matchedChannel // 后端会处理所有sku满足同一个物流
                this.form.logical.weight = this.baseProductInfo.weight
                this.form.skuList.forEach((item, index) => {
                  const i = skukeys.indexOf(item.productSku)
                  if (i > -1) {
                    this.$set(this.form.skuList[index], 'startPrice', skuValues[i].price)
                    this.$set(this.form.skuList[index], 'actualProfitRate', this.form.saleProfitRate)
                  }
                })
                const priceList = this.form.skuList.map(item => item.startPrice)
                this.$emit('changeSellingPrice', priceList)
                callback()
                this.form.skuList.filter((item, i) => {
                  this.$refs.form.validateField(`skuList.${i}.startPrice`)
                  this.$refs.form.validateField(`skuList.${i}.actualProfitRate`)
                })
              }
            } else {
              callback(new Error('没有合适的物流'))
            }
          } else {
            callback(new Error(`${res.msg || '没有合适的物流'}`))
          }
        }).catch(() => {
          callback(new Error('没有合适的物流'))
        }).finally(() => {
          this.countLoading = false
          this.$emit('productLoadingEnd')
        })
      }
    },
    // 修改售价算利润
    validCurrentPrice(event, flag, isBatch) {
      if (flag) this.controlFlag = true
      this.blurPrice = event?.target?.value
      // 所有变体价格都填了统一去获取利润
      if (this.form.skuList.findIndex(item => !item.startPrice && !item.noPermission) > -1) {
        return false
      } else {
        const priceRateDTOList = []
        const priceSku = [] // 计算价格的sku
        this.form.skuList.map((sku, index) => {
          // 不计算不可用sku
          if (!sku.noPermission) {
            priceSku.push(sku.productSku)
            priceRateDTOList.push({
              price: sku.startPrice,
              productSku: sku.productSku,
              lmsChannelOptimizeDTOList: this.logicalsList
            })
          }
        })
        if (this.blurPrice === this.focusPrice || !this.controlFlag) return
        this.countLoading = true
        this.$emit('productLoadingStart')
        const { publishSiteCode, storeCode, warehouse, isOversea, paypalAccount } = this.baseProductInfo
        getCalculateProfitRate({
          platformCode: 'EB',
          priceRateDTOList,
          siteCode: publishSiteCode,
          storeCode,
          isOversea,
          paypalAccount,
          warehouse
        }).then(res => {
          const data = res.data
          if (data) {
            const skukeys = []
            const skuValues = []
            const noChannelSku = [] // 计算后没有物流信息的sku
            for (const k in data) {
              skukeys.push(k)
              skuValues.push(data[k])
              if (!data[k].matchedChannel) {
                noChannelSku.push(k)
              }
            }
            // 所有sku都有物流信息才通过
            if (noChannelSku.length) {
              this.setErrMess(noChannelSku, '没有适合的物流')
            } else if (!skukeys.length) {
              this.setErrMess(priceSku, '没有适合的物流')
            } else {
              this.form.logical = skuValues[0].matchedChannel // 后端会处理所有sku满足同一个物流
              this.form.logical.weight = this.baseProductInfo.weight
              // this.form.saleProfitRate = ''
              // this.$refs.form.validateField('saleProfitRate')
              this.setErrMess(priceSku, '', data)
              // 售价改变，更新paypal账号
              const priceList = priceRateDTOList.map(item => item.price)
              this.$emit('changeSellingPrice', priceList)
              // 批量修改价格后，重置销售利润率
              if (isBatch) this.form.saleProfitRate = data[priceRateDTOList[0].productSku].profitRate
            }
            this.controlFlag = false
          } else {
            this.setErrMess(priceSku, '没有适合的物流')
          }
        }).catch(() => {
          this.setErrMess(priceSku, '没有适合的物流')
        }).finally(() => {
          this.countLoading = false
          this.$emit('productLoadingEnd')
        })
      }
    },
    getFocusPrice(event) {
      this.focusPrice = event.target.value
    },
    // 设置error信息
    setErrMess(skus, errMess, data) {
      skus.forEach(s => {
        const index = this.form.skuList.findIndex(k => k.productSku === s)
        if (index > -1) {
          this.form.skuList[index].errMess = errMess
        }
      })
      this.form.skuList.forEach((item, index) => {
        const i = skus.indexOf(item.productSku)
        if (i > -1) {
          if (!errMess) {
            this.$set(this.form.skuList[index], 'actualProfitRate', data[skus[i]].profitRate)
            this.$refs.form.validateField(`skuList.${index}.actualProfitRate`)
          }
          this.$refs.form.validateField(`skuList.${index}.startPrice`)
        }
      })
    },
    // 获取物流信息
    getOptimize(isEdit) {
      return new Promise((resolve, reject) => {
        const { storeName, publishSiteCode, platformCode, skuList, storeCode, virtualWarehouse, warehouse, warehouseType, isOversea } = this.baseProductInfo
        if (storeName && publishSiteCode && platformCode && skuList.length && warehouse) {
          let countryCode = publishSiteCode
          if (publishSiteCode === 'UK') {
            countryCode = 'GB'
          } else if (publishSiteCode === 'eBayMotors') {
            countryCode = 'US'
          }
          const skus = skuList.map(item => item.productSku)

          this.$emit('productLoadingStart')
          this.logisticsLoading = true
          getOptimize({
            storeName,
            storeCode,
            countryCode,
            platformCode,
            skus,
            virtualWarehouse,
            warehouse,
            isOversea,
            type: warehouseType
          }).then(res => {
            this.logicalsList = res.data || []
            // this.logicalsList = [{ deliveryGroupName: 'EMS', agentCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '33', priceHigh: '99999' }, { deliveryGroupName: '大陆DHL', agentCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '0.333', priceHigh: '5.38' }]
            !isEdit && this.$refs.form.validateField('saleProfitRate')
            this.validCurrentPrice()
            resolve(res)
          }).finally(() => {
            this.$emit('productLoadingEnd')
            this.logisticsLoading = false
          })
        } else {
          this.logicalsList = []
        }
      })
    },
    // 无权刊登style
    tableRowClassName({ row, rowIndex }) {
      return row.noPermission ? 'info-row' : ''
    },
    removeChildSku(row, index) {
      if (this.isEdit) {
        row.optType = 2
      }
      // !row.noPermission && row.productSku && this.removeSkuList.findIndex(item => item.productSku === row.productSku) === -1 && this.removeSkuList.push(row)
      this.form.skuList.splice(index, 1)
      this.resetSkuList()
    },
    addChildSku() {
      this.form.skuList.push(deepClone(variantObj(this.form.skuList)))
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
      const removeIndex = this.removeSkuList.findIndex(item => item.productSku === value)
      // this.form.skuList[index] = Object.assign(this.form.skuList[index], deepClone(this.removeSkuList[removeIndex]))
      this.form.skuList.splice(index, 1, Object.assign(this.form.skuList[index], this.removeSkuList[removeIndex]))
      this.getOtherInfo()
      this.resetSkuList()
    },
    getOtherInfo(isEdit) {
      return new Promise((resolve, reject) => {
        if (this.form.skuList.length) {
          this.getOptimize(isEdit).then(res => {
            resolve(res)
            // 编辑初始化由售价推算出运费和实际刊登率
            // if (isEdit) {
            //   this.$refs.form.validateField('sellingPrice')
            // }
          })
        }
      })
    },
    // 选择子SKU图片
    changeImgModal(item, index) {
      this.$modal({
        title: '请选择子SKU图片',
        component: changeChildSkuImg,
        width: '1000px',
        data: {
          data: item,
          extraImgNum: this.extraImgNum
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
    // 从号码池自动获取
    isAutoProdcutIdChange(value) {
      if (value) {
        this.form.skuList.forEach(item => {
          this.$nextTick(() => {
            this.$set(item, 'productIdTypeValue', '')
          })
        })
      }
    },
    // 获取子SKU列表值
    getSkuValue() {
      return getSkuValues(this.form.skuList, this.form.lstAttrHead)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  &::before{
    top: 5px;
  }
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
.icon-btn{
  padding: 0 2px;
  margin-left: 3px;
}
.var-name ::v-deep input{
  padding: 0 5px;
}
</style>
