<template>
  <el-form ref="form" v-loading="productLoading > 0" :model="form" size="mini" :label-width="labelWidth" class="form-col" :rules="rules">
    <!-- 变体属性列表 -->
    <el-row class="w-90">
      <el-col v-for="(item, index) in skuAttrList" :key="index" :span="12">
        <el-form-item :label="item.label" :prop="item.name">
          <el-row v-if="item.inputType === 'text' || item.inputType === 'numeric'" :gutter="10" class="ms-0 me-0">
            <span v-for="(attr, i) in item.textNum" :key="i">
              <el-col v-if="isVariation" :span="17">
                <el-input
                  v-if="item.inputType === 'numeric'"
                  v-model="item.value[i]"
                  v-input.positive
                  :disabled="Boolean(baseProductInfo.itemId)"
                  size="mini"
                  clearable
                  class="g-w75 mb-3"
                  @change="skuAttrChange(item)"
                />
                <el-input
                  v-if="item.inputType === 'text'"
                  v-model="item.value[i]"
                  :disabled="Boolean(baseProductInfo.itemId)"
                  size="mini"
                  class="g-w100 mb-3"
                  clearable
                  @change="skuAttrChange(item)"
                />
              </el-col>
              <el-col v-else :span="17">
                <el-input
                  v-if="item.inputType === 'numeric'"
                  v-model="item.value"
                  v-input.positive
                  :disabled="Boolean(baseProductInfo.itemId)"
                  size="mini"
                  clearable
                  class="g-w75 mb-3"
                  @change="skuAttrChange(item)"
                />
                <el-input
                  v-if="item.inputType === 'text'"
                  v-model="item.value"
                  :disabled="Boolean(baseProductInfo.itemId)"
                  size="mini"
                  class="g-w100 mb-3"
                  clearable
                  @change="skuAttrChange(item)"
                />
              </el-col>
              <el-col v-if="isVariation && !baseProductInfo.itemId" :span="7">
                <el-button size="mini" icon="el-icon-plus" class="icon-btn" style="height:30px;" @click="addAttr(index, i)" />
                <el-button v-if="item.textNum > 1" size="mini" icon="el-icon-minus" class="icon-btn" style="height:30px;" @click="removeAttr(index, i)" />
              </el-col>
            </span>
          </el-row>
          <!-- <el-select v-if="item.inputType === 'singleSelect' || item.inputType === 'enumInput'"
                     v-model="item.value"
                     :disabled="Boolean(baseProductInfo.itemId)"
                     filterable
                     clearable
                     size="mini"
                     placeholder="请选择"
                     class="w-80"
                     @change="skuAttrChange"
          >
            <el-option v-for="(strItem,strIndex) in item.options" :key="strIndex" :label="strItem" :value="strItem" />
          </el-select> -->
          <el-select v-else
                     v-model="item.value"
                     filterable
                     :allow-create="['multiEnumInput','enumInput'].includes(item.inputType)"
                     default-first-option
                     :multiple="isVariation"
                     :disabled="Boolean(baseProductInfo.itemId)"
                     clearable
                     size="mini"
                     placeholder="请选择"
                     class="w-80"
                     @change="skuAttrChange"
          >
            <el-option v-for="(strItem,strIndex) in item.options" :key="strIndex" :label="strItem" :value="strItem" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row class="w-90">
      <el-col :span="12">
        <el-form-item label="促销开始时间" prop="specialFromDate">
          <el-date-picker
            v-model="form.specialFromDate"
            type="datetime"
            placeholder="促销开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="g-w100"
            :picker-options="pickerOptions"
            @change="() => saleDateHandle(form.specialFromDate, 'specialFromDate', form)"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="促销结束时间" prop="specialToDate">
          <el-date-picker
            v-model="form.specialToDate"
            type="datetime"
            placeholder="促销结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="g-w100"
            :picker-options="pickerOptions"
            @change="() => saleDateHandle(form.specialToDate, 'specialToDate', form)"
          />
        </el-form-item>
      </el-col>
    </el-row> -->
    <el-table :data="form.skuList" :row-class-name="tableRowClassName" row-key="tableKey" border stripe highlight-current-row class="form-table g-table g-table-dense">
      <el-table-column label="子SKU" width="150">
        <template slot="header">
          <span class="has-error">子SKU</span>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            v-if="isVariation"
            :prop="'skuList.' + $index + '.productSku'"
            :rules="Boolean(baseProductInfo.itemId)&&!row.availablity ? [{required:false}] : [{ required: true, validator: validSku(row, $index), trigger: 'change' }]"
            class="el-form-item_no-lable"
          >
            <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
              <el-select v-model="row.productSku" :disabled="Boolean(baseProductInfo.itemId)" size="mini" filterable clearable placeholder="请选择" @change="(value) => changeSku(value, $index)">
                <el-option v-for="(item, index) in removeSkuList" :key="index" :disabled="item.disabled" :label="item.productSkuShow" :value="item.productSku" :title="item.productName" />
              </el-select>
            </el-tooltip>
          </el-form-item>
          <template v-else>
            <el-tooltip :disabled="!row.productName" class="item" effect="dark" :content="row.productName" placement="top">
              <div>{{ row.productSku }}</div>
            </el-tooltip>
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
            :rules="Boolean(baseProductInfo.itemId)&&!row.availablity ? [{required:false}] : [{ required: true, validator: validImage(row, $index), trigger: 'change' }]"
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
      <template v-if="lstAttrHead && lstAttrHead.length">
        <el-table-column v-for="(attr, i) in lstAttrHead" :key="i" :label="attr.label" :property="attr.label" min-width="80" size="mini">
          <template slot-scope="{ row, column }">
            <!-- <span>{{ row[column.label] }}</span> -->
            <!-- 将row值改成可选择和输入 -->
            <el-select v-model="row[column.label]" filterable default-first-option allow-create size="mini">
              <el-option v-for="item in attr.options" :key="item" :value="item" :label="item" />
            </el-select>
          </template>
        </el-table-column>
      </template>
      <el-table-column :label="'售价' + onlineSite" min-width="80">
        <template slot="header">
          <span class="has-error">{{ '售价' + onlineSite }}</span>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.price'"
            :rules="Boolean(baseProductInfo.itemId)&&!row.availablity ? [{required:false}] : [{ required: true, message: '售价不能小于0'}]"
            class="el-form-item_no-lable"
          >
            <div @click="showSitePrice(row, $index)">
              <el-input v-model="row.price"
                        v-input.positive
                        :disabled="Boolean(row.noPermission)"
                        size="mini"
              />
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="'促销价' + onlineSite" min-width="80">
        <template slot="header">
          <span class="has-error">{{ '促销价' + onlineSite }}</span>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.specialPrice'"
            :rules="Boolean(baseProductInfo.itemId)&&!row.availablity ? [{required:false}] : [{ required: true, message: '促销价不能小于0'}]"
            class="el-form-item_no-lable"
          >
            <div @click="showSitePrice(row, $index)">
              <el-input v-model="row.specialPrice"
                        v-input.positive
                        size="mini"
              />
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="成本 | 利润率" min-width="80">
        <template slot="header">
          <div class="has-error">成本 | 利润率</div>
          <el-button type="text" @click="batchUpdateRate">批量修改利润</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.profitRate'"
            class="el-form-item_no-lable"
          >
            {{ row.productCost }} | {{ row.profitRate }}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="60">
        <template slot="header">
          <div class="has-error">库存</div>
          <el-button type="text" @click="batchUpdate">批量修改</el-button>
        </template>
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.quantity'"
            :rules="Boolean(baseProductInfo.itemId)&&!row.availablity ? [{required:false}] : [{ required: true, message: '库存不能为空', trigger: 'blur' }]"
            class="el-form-item_no-lable"
          >
            <el-input v-model="row.quantity" v-input.positive.numeric :disabled="Boolean(row.noPermission)" maxlength="4" size="mini" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Taxes" min-width="80">
        <template slot-scope="{ row }">
          <el-form-item class="el-form-item_no-lable">
            <el-select v-model="row.taxClass" size="mini">
              <el-option label="default" value="default" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="运费 | 重量" min-width="80">
        <template slot-scope="{ row, $index }">
          <el-form-item
            :prop="'skuList.' + $index + '.shippingFee'"
            :rules="Boolean(baseProductInfo.itemId)&&!row.availablity ? [{required:false}] : [{ required: true, message: '运费不能为空', trigger: 'blur' }]"
            class="el-form-item_no-lable"
          />
          {{ row.shippingFee }} | {{ row.productWeight }}
        </template>
      </el-table-column>
      <el-table-column label="Availability" width="85">
        <template slot-scope="{ row, $index }">
          <el-switch v-model="row.availablity" :active-value="true" :inactive-value="false" class="ms-3" @change="updateAva($index)" />
        </template>
      </el-table-column>
      <el-table-column v-if="showHandle" label="操作" width="49">
        <template slot-scope="{ row, $index }">
          <el-button v-if="form.skuList.length > 1" circle icon="el-icon-minus" size="mini" class="m-l-10" title="点击删除" @click="removeChildSku(row, $index)" />
          <!-- <el-button circle icon="el-icon-plus" size="mini" class="m-l-10" title="点击添加" @click="addChildSku(row, $index)" /> -->
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { variantObj, saleDateHandle, toFixed2, siteList, combinSkuId, Divider, getSkuValues, showSkuValues, getVariantValues, colorFirst } from './addListing.handle.js'
import { calculatePrice } from '@/api/lazada/lazada.js'
import changeChildSkuImg from './changeChildSkuImg.vue'
import batchUpdateStock from './batchUpdateStock.vue'
import batchUpdateAllSiteRate from './batchUpdateAllSiteRate.vue'
import allSitePrice from './allSitePrice.vue'
export default {
  name: 'VariantAttr',
  props: {
    labelWidth: String,
    isEdit: Boolean,
    productLoading: Number,
    isVariation: Boolean,
    baseProductInfo: Object
  },
  data() {
    const validStartDate = (rule, value, callback) => {
      if (value && this.form.specialToDate) {
        var start = new Date(value)
        var end = new Date(this.form.specialToDate)
        if (end.getTime() < start.getTime()) {
          callback(new Error('促销开始时间不能大于促销结束时间'))
        } else if (end.getTime() === start.getTime()) {
          callback(new Error('促销开始时间不能等于促销结束时间'))
        } else {
          callback()
          this.$refs.form.clearValidate('specialToDate')
        }
      } else {
        if (this.form.specialToDate || this.form.salePrice) {
          callback(new Error('促销开始时间不能为空'))
        } else {
          callback()
        }
      }
    }
    const validEndDate = (rule, value, callback) => {
      if (value && this.form.specialFromDate) {
        var end = new Date(value)
        var start = new Date(this.form.specialFromDate)
        if (end.getTime() < start.getTime()) {
          callback(new Error('促销结束时间不能小于促销开始时间'))
        } else if (end.getTime() === start.getTime()) {
          callback(new Error('促销结束时间不能等于促销开始时间'))
        } else {
          callback()
          this.$refs.form.clearValidate('specialFromDate')
        }
      } else {
        if (this.form.specialFromDate || this.form.salePrice) {
          callback(new Error('促销结束时间不能为空'))
        } else {
          callback()
        }
      }
    }
    return {
      toFixed2,
      batchRate: [], // 批量修改的利润率
      form: {
        saleProfitRate: '', // 销售利润率
        skuList: []
      },
      lstAttrHead: [], // 变体属性列表数据
      skuAttrList: [],
      rules: {
        specialFromDate: [{ validator: validStartDate, trigger: 'change' }],
        specialToDate: [{ validator: validEndDate, trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      saleDateHandle,
      removeSkuList: [], // 可选子sku列表
      siteArr: [], // 默认刊登站点
      extraImgNum: 7, // 副图最多可选张数,
      tempList: [],
      replaceSku: [] // spu下重复的子sku
    }
  },
  computed: {
    onlineDisabled() {
      const { itemId, productStatus } = this.baseProductInfo
      return itemId && (productStatus === 5 || productStatus === 7)
    },
    showHandle() {
      const { itemId, productStatus } = this.baseProductInfo
      if (!this.isVariation) {
        return false
      } else {
        return itemId ? productStatus === 5 || productStatus === 7 : !productStatus || productStatus === 1 || productStatus === 4
      }
    },
    onlineSite() {
      return this.baseProductInfo.itemId ? '(' + siteList[this.baseProductInfo.site].currency + ')' : ''
    }
  },
  watch: {
    'baseProductInfo.productSku'(val) {
      this.siteArr = this.baseProductInfo.siteArr || Object.keys(siteList)
      if (!val) { // 店铺改变，sku清空
        this.skuAttrList = []
        this.form.skuList = []
      } else { // sku改变
        this.skuAttrList = [] // 清空变体属性列表
        this.lstAttrHead = [] // 清空table中变体属性列
        this.init()
      }
    },
    // sku是否重复
    'baseProductInfo.lstSku': {
      handler(val) {
        if (this.isVariation) {
          this.removeSkuList = val
          this.replaceSku = this.removeSkuList.filter(item => item.disabled).map(v => v.productSku)
          // if (!this.isEdit) this.removeSkuList[0].disabled = true
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      // 有 skuList 为 variant
      if (this.baseProductInfo.skuList && this.baseProductInfo.skuList.length) {
        const { skuList, lstSku } = deepClone(this.baseProductInfo)
        // console.log('spu信息: ', this.form.skuList)
        // 默认显示第一条子sku
        this.form.skuList = [Object.assign(skuList[0], {
          productSku: '',
          productName: '',
          imgShowList: [],
          extraImagList: [],
          mainImage: '',
          shippingFee: '',
          masterImage: '',
          productCost: '',
          productWeight: '',
          netWeight: ''
        })]
        this.setRemoveSkuList()
        // 无权刊登
        this.isEdit && this.isVariation && this.form.skuList.forEach(item => {
          const i = lstSku.findIndex(s => s.productSku === item.productSku)
          if (i === -1) {
            item.noPermission = true
          }
        })
      } else { // sku
        this.form.skuList.splice(0, this.form.skuList.length, { ...deepClone(this.baseProductInfo), id: undefined })
        // console.log('sku信息: ', this.form.skuList)
      }
      !this.isEdit && this.handleSkuList(this.form.skuList[0])
      !this.isEdit && this.validProfitRate(this.form.skuList)
    },
    // 设置可选子SKU下拉列表
    setRemoveSkuList() {
      if (this.isVariation) {
        // pms 所有子sku
        const { lstSku } = deepClone(this.baseProductInfo)
        this.removeSkuList = lstSku
        // this.removeSkuList[0].disabled = true
      }
    },
    handleSkuList(data) {
      const { saleProfitRate, accountGrossProfit } = this.baseProductInfo
      let batchRateFirst = ''
      this.batchRate.find(item => {
        if (this.siteArr[0] === item.site) {
          batchRateFirst = item.profitRate
        }
      })
      data.quantity = 6000
      data.taxClass = 'default'
      data.availablity = true
      data.profitRate = batchRateFirst || saleProfitRate || accountGrossProfit // 先取类目利润率，没有的话取店铺的
      this.tempList = deepClone(this.form.skuList)
    },
    // 获取sku属性（多变体：类目属性获取）
    getVarAttr(list) {
      let values = []
      if (this.isEdit) {
        this.lstAttrHead = colorFirst(list)
        this.form.skuList = showSkuValues(this.baseProductInfo.skuList, list, this.siteArr) // 编辑回显
        // 已经选过的子sku，置灰
        this.resetSkuList()
        const varAttrList = this.form.skuList.map((item, index) => {
          this.$refs.form.clearValidate('skuList.' + index + '.specialPrice')
          return item.varAttrList
        })
        values = getVariantValues(varAttrList)
      }

      const skuAttrList = deepClone(list)
      skuAttrList.forEach(item => {
        item.value = this.isVariation ? [] : ''
        if (item.inputType === 'numeric' || item.inputType === 'text') {
          item.textNum = 1
        }
        if (this.isEdit) {
          for (const key in values) {
            if (item.name === key) {
              if (this.isVariation) {
                item.value = [...new Set(values[key])]
              } else {
                item.value = values[key][0]
              }
              // item.value = this.isVariation ? [...new Set(values[key])] : ['numeric', 'text'].includes(item.inputType) ? values[key] : values[key] && values[key][0]
              if (this.isVariation && (item.inputType === 'numeric' || item.inputType === 'text')) {
                item.textNum = item.value && item.value.length
              }
            }
          }
        }
      })
      this.skuAttrList = colorFirst(skuAttrList)
    },
    // 变体属性逻辑处理
    skuAttrChange(value) {
      const { skuProperty, skuId } = combinSkuId(this.skuAttrList)
      this.lstAttrHead = skuProperty // 变体属性表头
      const variantAttr = []
      skuId.forEach(item => {
        const obj = {}
        const arr = item.includes(';') ? item.split(';') : [item]
        arr.map(e => {
          obj[e.split(Divider)[0]] = e.split(Divider)[1]
        })
        variantAttr.push(obj)
      })

      // 变体属性列表添加（sku基本信息）
      // const currentLine = this.form.skuList
      // variantAttr = variantAttr.map(item => {
      //   return { ...currentLine[0], ...item }
      // })
      // this.form.skuList = variantAttr

      this.form.skuList = this.combineAttr(variantAttr, this.form.skuList)
      this.resetSkuList()
    },
    combineAttr(variantAttr, skuList) {
      const varKey = Object.keys(variantAttr[0]) // 变体属性
      skuList.map(item => { // 表格显示
        this.tempList.forEach(tem => {
          if (item.productSku === tem.productSku) {
            var itemKeys = Object.keys(item) // 表格所有属性
            const i = itemKeys.findIndex(key => varKey.includes(key))
            if (i === -1) {
              const yy = itemKeys[i] // 表格非变体属性
              tem[yy] = item[yy]
            }
          }
        })
      })
      const arr = []
      variantAttr.forEach((item1, index) => {
        let obj = skuList[index] || Object.assign({
          imgShowList: [],
          extraImagList: [],
          mainImage: '',
          shippingFee: '',
          quantity: 6000,
          taxClass: 'default',
          masterImage: '',
          productSku: '',
          price: '', // 售价
          specialPrice: '', // 促销价
          productCost: '', // 成本
          profitRate: '',
          productWeight: '' // 重量
        })
        obj = Object.assign({}, obj, { ...item1 }, {})
        arr.push(obj)
      })
      return arr
    },
    addAttr(index) {
      this.skuAttrList[index].textNum++
    },
    // 删除子sku
    removeAttr(index, i) {
      this.skuAttrList[index].textNum--
      this.skuAttrList[index].value.splice(i, 1)
      this.skuAttrChange(this.skuAttrList[index])
    },
    // sku校验
    validSku(row, index) {
      return (rule, value, callback) => {
        if (!row.productSku) {
          callback(new Error('sku不可为空'))
        }
        // sku不可重复
        const sku = this.form.skuList.filter(item => row.productSku && item.productSku === row.productSku)
        if (sku.length > 1) {
          callback(new Error('sku不可以重复'))
        } else {
          callback()
        }
      }
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
    showSitePrice(row, index) {
      this.$modal({
        title: '各站点价格',
        component: allSitePrice,
        width: '600px',
        data: {
          isEdit: this.isEdit,
          siteArr: this.siteArr,
          baseProductInfo: this.baseProductInfo,
          row: row
        },
        callback: (data) => {
          if (data) {
            // 默认显示第一个刊登站点的售价，促销价，利润率，运费
            const { price, specialPrice, profitRate, shippingPrice } = data.find(item => item.site === this.siteArr[0])
            const sitePriceInfo = {}
            data.forEach(item => {
              sitePriceInfo[`${item.site.toLocaleLowerCase()}ProfitRate`] = item.profitRate
              sitePriceInfo[`${item.site.toLocaleLowerCase()}RetailPrice`] = item.price
              sitePriceInfo[`${item.site.toLocaleLowerCase()}SalesPrice`] = item.specialPrice
            })
            this.form.skuList.splice(index, 1, Object.assign(this.form.skuList[index], {
              price, // 售价
              specialPrice, // 促销价
              profitRate,
              shippingFee: shippingPrice || this.form.skuList[index].shippingFee,
              ...sitePriceInfo,
              sitePriceData: data // 所有站点数据
            }))
            this.$refs.form.validateField(`skuList.${index}.price`)
            this.$refs.form.validateField(`skuList.${index}.specialPrice`)
          }
        }
      })
    },
    setProfitRate(profitRate) {
      const _siteList = Object.keys(siteList)
      this.form.skuList.forEach((item, index) => {
        // 同步站点所属利润
        const sitePriceInfo = {}
        _siteList.forEach(site => {
          sitePriceInfo[`${site.toLocaleLowerCase()}ProfitRate`] = profitRate
        })
        this.form.skuList.splice(index, 1, {
          ...item,
          ...sitePriceInfo,
          price: '',
          specialPrice: '',
          profitRate
        })
      })
    },
    setPrice(profitRate, updateType, currSite, isChecked) {
      // profitRate 0.23
      if (updateType === 'updateCategoryId') {
        const _siteList = Object.keys(siteList)
        this.form.skuList.forEach((item, index) => {
        // 同步站点所属利润
          const sitePriceInfo = {}
          _siteList.forEach(site => {
            sitePriceInfo[`${site.toLocaleLowerCase()}ProfitRate`] = profitRate
          })
          this.form.skuList.splice(index, 1, {
            ...item,
            ...sitePriceInfo,
            price: '',
            specialPrice: '',
            profitRate
          })
        })
      }
      if ((updateType === 'updateSite' && isChecked)) {
        let rate = profitRate
        this.batchRate.find(item => {
          if (currSite === item.site) {
            rate = item.profitRate
          }
        })
        this.validProfitRate(this.form.skuList, rate, currSite)
      }
      if (updateType === 'updateCategoryId') {
        this.validProfitRate(this.form.skuList)
      }
      // 取消勾选站点不计算，直接取第一个已选站点价格
      if (updateType === 'updateSite' && !isChecked) {
        const firstSite = this.siteArr[0] || ''
        this.form.skuList.forEach((item, index) => {
          // 同步站点所属利润
          this.form.skuList.splice(index, 1, {
            ...item,
            price: item[`${firstSite.toLocaleLowerCase()}RetailPrice`],
            specialPrice: item[`${firstSite.toLocaleLowerCase()}SalesPrice`],
            profitRate: item[`${firstSite.toLocaleLowerCase()}ProfitRate`]
          })
        })
      }
    },
    // 无权刊登style
    tableRowClassName({ row, rowIndex }) {
      return row.noPermission ? 'info-row' : ''
    },
    updateAva(index) {
      const { availablity } = this.form.skuList[index]
      this.form.skuList.splice(index, 1, Object.assign(this.form.skuList[index], { availablity }))
    },
    removeChildSku(row, index) {
      !row.noPermission && row.productSku && this.removeSkuList.findIndex(item => item.productSku === row.productSku) === -1 && this.removeSkuList.push(row)
      this.form.skuList.splice(index, 1)
      this.resetSkuList()
      // this.spliceAttrValue(row)
    },
    // 删除变体属性值
    spliceAttrValue(row) {
      // 整理删除事件当前变体属性
      const varAttrList = {}
      this.lstAttrHead.forEach(item => {
        for (const p in row) {
          if (p === item.label) {
            varAttrList[p] = row[item.label]
          }
        }
      })
      // 整理变体列表变体属性
      const skuAttrList = []
      this.form.skuList.forEach(skuRow => {
        const varAttrListrow = {}
        this.lstAttrHead.forEach(item => {
          for (const p in skuRow) {
            if (p === item.label) {
              varAttrListrow[p] = skuRow[item.label]
            }
          }
        })
        skuAttrList.push({ productSku: skuRow.productSku, varAttrList: varAttrListrow })
      })

      const rowAttr = Object.entries(varAttrList) // 删除事件的当前行变体属性
      // 需要删除的变体属性值
      const lastAttrVal = rowAttr.filter((item, i) => {
        var index = skuAttrList.findIndex(sku => {
          const skuAttr = Object.entries(sku.varAttrList)
          if (item[1] === skuAttr[i][1]) return sku
        })
        if (index === -1) return item
      })
      // 删除变体的属性值不与其他变体属性值相同，同时删除变体属性选项的这个值
      lastAttrVal.forEach(item => {
        this.skuAttrList.find(attr => {
          const i = attr.value ? attr.value.findIndex(a => a === item[1]) : -1
          if (attr.label === item[0] && i > -1) {
            attr.value.splice(i, 1)
          }
        })
      })
    },
    addChildSku() {
      this.form.skuList.push(deepClone(variantObj(this.form.skuList)))
    },
    batchUpdate() {
      this.$modal({
        title: '批量修改库存',
        component: batchUpdateStock,
        width: '400px',
        callback: (data) => {
          if (data) {
            if (this.form.skuList.length > 1) {
              this.form.skuList.forEach(item => {
                item.quantity = data
              })
            } else {
              this.form.skuList.splice(0, 1, Object.assign(this.form.skuList[0], {
                quantity: data
              }))
            }
          }
        }
      })
    },
    // 批量修改利润率
    batchUpdateRate() {
      this.$modal({
        title: '批量修改利润率',
        component: batchUpdateAllSiteRate,
        width: '350px',
        data: {
          siteArr: this.siteArr,
          baseProductInfo: this.baseProductInfo,
          batchRate: this.batchRate
        },
        callback: (data, updateSite) => {
          if (data && data.length) {
            this.batchRate = data
            data.forEach(item => {
              if (updateSite.includes(item.site)) {
                this.validProfitRate(this.form.skuList, item.profitRate, item.site)
              }
            })
          }
        }
      })
    },
    // 重置sku下拉列表
    resetSkuList() {
      const selectedSku = this.form.skuList.map(item => item.productSku)
      this.removeSkuList.forEach(item => {
        item.disabled = false
        if (selectedSku.includes(item.productSku) || this.replaceSku.includes(item.productSku)) {
          item.disabled = true
        }
      })
    },
    // 选择SKU事件
    changeSku(value, index) {
      if (!value) { // 清空
        this.form.skuList.splice(index, 1, Object.assign(this.form.skuList[index], {
          productName: '',
          imgShowList: [],
          extraImagList: [],
          mainImage: '',
          shippingFee: '',
          masterImage: '',
          productCost: '', // 成本
          productWeight: '', // 重量
          netWeight: ''
        }))
      }
      const removeIndex = this.removeSkuList.findIndex(item => item.productSku === value)
      this.form.skuList.splice(index, 1, Object.assign(this.form.skuList[index], this.removeSkuList[removeIndex], {
        price: '',
        specialPrice: ''
      }))
      // 设置默认值（库存、售价、促销价，重量等）
      this.handleSkuList(this.form.skuList[index])
      this.resetSkuList()
      const skus = this.form.skuList.filter(item => item.productSku === value)
      if (skus.length === 1) {
        if (this.batchRate.length) {
          this.batchRate.forEach(item => {
            this.validProfitRate(skus, item.profitRate, item.site)
          })
        } else {
          this.validProfitRate(skus)
        }
      }
    },
    // 修改利润率算促销价，售价和运费
    validProfitRate(skuList, profitRate, currSite) {
      if (!skuList || !skuList.length) return
      const { platformCode, storeCode } = this.baseProductInfo
      // const { productSku, productCost } = this.row
      const priceDTOList = []
      skuList.filter(item => {
        const saleProfitRate = profitRate || item.profitRate
        if (item.productSku && saleProfitRate) {
          priceDTOList.push({ productSku: item.productSku, saleProfitRate, productCost: item.productCost })
        }
      })
      if (priceDTOList.length === 0) return
      this.$emit('productLoadingStart')
      const siteCodes = currSite ? [currSite] : this.siteArr
      calculatePrice({
        platformCode,
        siteCodes,
        storeCode: storeCode,
        warehouseId: 'Z20',
        priceDTOList
      }).then(res => {
        if (res.code === 200) {
          const data = res.data
          // const { price, specialPrice, shippingPrice } = data[productSku][item.site]
          for (const sku in data) {
            this.form.skuList.find((item, index) => {
              if (item.productSku === sku) {
                const firstSite = {}
                const sitePriceData = {}
                siteCodes.forEach((site, i) => {
                  const price = data[sku][site].price
                  const specialPrice = data[sku][site].specialPrice
                  sitePriceData[`${site.toLocaleLowerCase()}RetailPrice`] = price // 售价
                  sitePriceData[`${site.toLocaleLowerCase()}SalesPrice`] = specialPrice // 促销价
                  sitePriceData[`${site.toLocaleLowerCase()}ProfitRate`] = profitRate || item.profitRate
                  if (currSite ? (site === currSite && currSite === this.siteArr[0]) : i === 0) {
                    firstSite.price = price
                    firstSite.specialPrice = specialPrice
                    firstSite.profitRate = profitRate || item.profitRate
                    firstSite.shippingPrice = data[sku][site].shippingPrice
                    firstSite.shippingFee = data[sku][site].shippingPrice
                  }
                })
                this.form.skuList.splice(index, 1, {
                  ...deepClone(item),
                  ...sitePriceData,
                  ...firstSite
                })
                if (this.isVariation) {
                  this.baseProductInfo.skuList.find((s, ix) => {
                    if (s.productSku === sku) {
                      this.baseProductInfo.skuList.splice(index, 1, {
                        ...deepClone(s),
                        ...sitePriceData,
                        ...firstSite
                      })
                    }
                  })
                }
              }
            })
          }
        } else {
          priceDTOList.forEach(toItem => {
            this.form.skuList.find((item, index) => {
              if (item.productSku === toItem.productSku) {
                const firstSite = {}
                siteCodes.forEach((site, i) => {
                  item[`${site.toLocaleLowerCase()}RetailPrice`] = '' // 售价
                  item[`${site.toLocaleLowerCase()}SalesPrice`] = '' // 促销价
                  item[`${site.toLocaleLowerCase()}ProfitRate`] = ''
                  if (currSite ? (site === currSite && currSite === this.siteArr[0]) : i === 0) {
                    firstSite.price = ''
                    firstSite.specialPrice = ''
                    firstSite.profitRate = ''
                    firstSite.shippingPrice = ''
                    firstSite.shippingFee = ''
                  }
                })
                this.form.skuList.splice(index, 1, {
                  ...deepClone(item),
                  ...firstSite
                })
              }
            })
          })
          this.$message.error(res.msg || res.message || '未知错误')
        }
      }).finally(() => {
        this.$emit('productLoadingEnd')
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
            this.form.skuList[index].mainImage = data.imgShowList.find(item => item.isPrime).imageUrl
            this.form.skuList[index].extraImagList = data.imgShowList.filter(item => item.isExtra).map(item => item.imageUrl)
            this.form.skuList[index].allImages = [this.form.skuList[index].mainImage, ...this.form.skuList[index].extraImagList]
            this.$refs.form.validateField('skuList.' + index + '.imgShowList')
            // this.form.skuList[index].mainImage = data.mainImage
            // this.form.skuList[index].extraImagList = data.extraImagList
          }
        }
      })
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
      return getSkuValues(this.form.skuList, this.lstAttrHead, this.siteArr)
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
</style>
