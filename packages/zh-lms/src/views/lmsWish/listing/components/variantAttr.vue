<template>
  <el-form ref="form" :model="form" size="mini" :label-width="labelWidth" class="w-90 form-col" :rules="rules">
    <el-row>
      <el-col :span="24">
        <el-form-item label="颜色">
          <el-checkbox-group v-model="form.color" @change="changeColor">
            <el-checkbox v-for="item in colorItem" :key="item.label" :label="item.label">
              <div v-if="item.color" :style="{background:item.color,border:item.label==='White'?'1px solid #ccc':''}" class="color" />{{ item.label }}</el-checkbox>
          </el-checkbox-group>
          <span>添加其他颜色</span>
          <el-input v-model="colorVal" placeholder="请输入颜色值" style="width:200px;" class="mx-2" />
          <el-button @click="addColorVal">添加</el-button>
          <span class="mx-2" style="color:red">说明：请首先按要求添加！双色支持格式：黑白；单色请参考：<g-link>
            <span class="herfColor" @click="handleColorCell">wish官方颜色列表>></span>
          </g-link>
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="尺码" prop="size">
          <ul class="sizeList">
            <li v-for="(item,index) in sizeOption" :key="`${item.label}+${item.index}`" :class="tableTemp === index+1?'active':''">
              <span @click="changeSize(item)">{{ item.label }}</span>
            </li>
          </ul>
          <div id="item_category" :style="showSize?'border: 1px solid #c5d0dc':''" class="me-5">
            <template v-if="[1,2,25].includes(tableTemp)">
              <el-table :data="menApparelTable" class="g-table">
                <el-table-column>
                  <template slot-scope="{row}">
                    <el-checkbox v-model="row.checked" @change="changeMenApparelSize(row)" />
                    {{ row.size }}
                  </template>
                </el-table-column>
                <el-table-column label="Chest">
                  <el-table-column prop="ChestCm" label="厘米" />
                  <el-table-column prop="ChestInch" label="英寸" width="90" />
                </el-table-column>
                <el-table-column :label="tableTemp=== 25?'高度':'Waist'">
                  <el-table-column prop="WaistCm" label="厘米" />
                  <el-table-column prop="WaistInch" label="英寸" width="90" />
                </el-table-column>
                <template v-if="tableTemp === 1">
                  <el-table-column label="Neck">
                    <el-table-column prop="NeckCm" label="厘米" />
                    <el-table-column prop="NeckInch" label="英寸" width="80" />
                  </el-table-column>
                  <el-table-column label="Sleeve">
                    <el-table-column prop="SleeveCm" label="厘米" />
                    <el-table-column prop="SleeveInch" label="英寸" width="80" />
                  </el-table-column>
                </template>
                <el-table-column v-if="tableTemp ===2" label="Hip">
                  <el-table-column prop="hipCm" label="厘米" />
                  <el-table-column prop="hipInch" label="英寸" width="90" />
                </el-table-column>
              </el-table>
            </template>
            <template v-if="showSize">
              <p v-if="[17,18,19,20,21,22].includes(tableTemp)">Example: {{ filterDesc }}</p>
              <p v-if="[26].includes(tableTemp)">Example: Hardcover, Cookies & Cream, 12-Pack (max 50 characters)</p>
              <el-checkbox-group v-model="childShoesList" @change="changeMenApparelSize(childShoesList)">
                <el-checkbox v-for="(v,key) in menApparelTable" :key="key" :label="v">{{ v }}</el-checkbox>
              </el-checkbox-group>
              <template v-if="[17,18,19,20,21,22,26].includes(tableTemp)">
                <div class="d-flex">
                  <el-input v-model="areaSize" class="w-20 me-2" />
                  <el-button @click="addArea(areaSize)">添加</el-button>
                </div>
              </template>
            </template>
            <template v-if="[8,9].includes(tableTemp)">
              <el-table :data="menApparelTable" class="g-table">
                <el-table-column>
                  <el-table-column label="美国标准尺码" width="120">
                    <template slot-scope="{row}">
                      <el-checkbox v-model="row.checked" @change="changeMenApparelSize(row)" />
                      {{ row.size }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="european" label="European" />
                </el-table-column>
                <el-table-column label="脚长">
                  <el-table-column prop="ch" label="英寸" />
                  <el-table-column prop="cm" label="厘米" />
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-form-item>
      </el-col>
      <!-- v-show="sizeList.length" -->
      <el-col :span="24">
        <div class="recursion-table">
          <el-table :data="form.variantList" border class="g-table" :row-key="getRowKeys">
            <el-table-column label="颜色" prop="color">
              <template v-slot="{row,$index}">
                <el-form-item :prop="'variantList.' + $index + '.color'" class="color_size">
                  <el-input v-model="row.color" size="mini" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="尺码" prop="size">
              <template v-slot="{row,$index}">
                <el-form-item :prop="'variantList.' + $index + '.size'" class="color_size">
                  <el-input v-model="row.size" size="mini" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="售价">
              <template slot="header">
                <span class="has-error">售价</span>
                <el-button type="text" @click="batchUpdate('售价',1)">批量修改</el-button>
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item :prop="'variantList.' + $index + '.localizedPrice'"
                              :rules="[{ required: true, message: '售价不能为空', trigger: 'blur' }]"
                              class="el-form-item_no-lable mb-0"
                >
                  <el-input v-model="row.localizedPrice" placeholder="请输入" @blur="handleLocalizedPrice(row,$index)" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="成本" prop="costPrice" width="80px" />
            <el-table-column label="利润率" width="140px">
              <template slot="header">
                <span class="has-error">利润率</span>
                <el-button type="text" @click="batchUpdate('利润率',2)">批量修改</el-button>
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item :prop="'variantList.' + $index + '.profitRate'"
                              :rules="[{ required: true, pattern: /0\.\d+/g, message: '请输入0.01-0.99之间', trigger: 'blur' }]"
                              class="el-form-item_no-lable mb-0"
                >
                  <el-input v-if="row.flag" v-model="row.profitRate" maxlength="4" size="mini" class="aaa" placeholder="请输入" @input="turnTofalse(row)" />
                  <el-input v-else v-model="row.profitRate" maxlength="4" size="mini" placeholder="请输入" @blur="changeProfitRate(row,$index)" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="库存" width="140px">
              <template slot="header">
                <span class="has-error">库存</span>
                <el-button type="text" @click="batchUpdate('库存',3)">批量修改</el-button>
              </template>
              <template slot-scope="{row,$index}">
                <el-form-item :prop="'variantList.' + $index + '.inventory'"
                              :rules="[{ required: true, message: '库存不能为空', trigger: 'blur' }]"
                              class="el-form-item_no-lable mb-0"
                >
                  <el-input v-model="row.inventory" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="商品编码" width="160px">
              <template slot="header"><span class="has-error">商品编码</span></template>
              <template slot-scope="{row,$index}">
                <el-form-item :prop="'variantList.' + $index + '.productSku'"
                              :rules="[{ required: true, message: '商品编码不能为空', trigger: 'blur' }]"
                              class="el-form-item_no-lable mb-0"
                >
                  <div v-popover="'popover'+$index">
                    <el-select v-model="row.productSku" :disabled="row.init" clearable filterable size="mini" placeholder="请选择" @change="(value) => changeProductSku(value,row,$index)">
                      <el-option v-for="item in baseProductInfo.totalSku" :key="item.productSku" :label="item.productSkuShow" :value="item.productSku" :disabled="item.disabled" :title="item.productName" />
                    </el-select>
                    <el-popover :ref="'popover'+$index" width="200" placement="top" :disabled="!row.productSku" trigger="hover" :content="getTitle(row)" />
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column v-if="itemId" label="是否上架" width="80px">
              <template slot-scope="{row}">
                <el-switch v-model="row.isEnabled" class="ms-2" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row,$index}">
                <el-button icon="el-icon-plus" circle @click="handlerAdd(row,$index)" />
                <template v-if="!row.init">
                  <el-button icon="el-icon-minus" circle @click="handlerDel(row,$index)" />
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { toFixed2 } from './wish.handle.js'
import * as addListingHandle from './addListing.handle.js'
import { calculatePrice, calculateProfitRate } from '@/api/wish/wish.js'
import batchUpdateStock from './batchUpdateStock.vue'
// import {
//   getSpuDetailByProduct
// } from '@/api/amazon/amazon.js'
const descTitle = ['1.4m x 1.4m, 10.5" * 10.5", 10cm by 10cm by 10cm',
  '6\' 5", 10m, 5", 11.5cm, 6ft 5in',
  '100mL, 200L, 40 fl. oz., 10.5pt',
  ' 100V, 50v',
  '10W, 30W, 100W',
  '100kg, 11.5lb, 3.14g']
const variantList = () => [{
  productSku: '', // 子sku
  color: '', // 颜色
  size: '', // 尺码
  msrp: '', // 参考价格
  price: null, // 价格 后端会给
  localizedPrice: null, // 本地价格
  localizedShipping: null, // 本地运费
  costPrice: null, // 成本
  shipping: null, // 运费
  inventory: null, // 库存
  shippingTime: null, // 运费时长
  profitRate: null, // 利润率
  isEnabled: true
}] // 笛卡尔积
export default {
  name: 'VariantAttr',
  props: {
    labelWidth: String,
    isEdit: Boolean,
    productLoading: Number,
    isVariation: Boolean,
    baseProductInfo: Object,
    itemId: String,
    auditTabActiveName: String
  },
  data() {
    return {
      getRowKeys(row) {
        return row.id
      },
      colorVal: '',
      tableTemp: 0,
      menApparelTable: [], // 男装尺码
      sizeOption: addListingHandle.sizeOption, // 尺码分类列表
      colorItem: deepClone(addListingHandle.colorItem),
      colorList: [], // 勾选的颜色列表
      colorListTemp: [], // 勾选的颜色列表备份
      sizeList: [], // 勾选的尺码列表
      sizeListTemp: [], // 勾选的尺码列表备份
      areaSize: '', // 自定义尺码
      temp: '', // 中转值
      skuList: '',
      form: {
        color: [],
        variantList: variantList() // 笛卡尔积
      },
      childShoesList: [], // 童鞋尺码
      rules: {}
    }
  },
  computed: {
    showSize() {
      return [3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27].includes(this.tableTemp)
    },
    filterDesc() {
      return descTitle[this.tableTemp - 17]
    }
  },
  watch: {
    baseProductInfo() {
      this.initializationData()
    },
    'baseProductInfo.localizedShipping'() {
      const baseProductInfo = this.baseProductInfo
      if (baseProductInfo.oldLocalizedShipping) {
        const newVal = Number(baseProductInfo.localizedShipping) - Number(baseProductInfo.oldLocalizedShipping)
        this.form.variantList.forEach(item => {
          item.localizedPrice = parseFloat(item.localizedPrice - newVal).toFixed(2)
        })
      }
    }
  },
  mounted() {
    this.initializationData()
    // 获取所有商品编码
    // this.isEdit && this.getSkuDetailAjax(this.baseProductInfo.productSpu)
  },
  methods: {
    getTitle(row) {
      return this.baseProductInfo?.totalSku?.find(item => item.productSku === row.productSku)?.productName
    },
    // 批量修改售价，利润率 库存
    batchUpdate(type, typeNum) {
      this.$modal({
        title: `批量修改库存${type}`,
        component: batchUpdateStock,
        width: '450px',
        data: {
          typeTitle: type,
          typeNum: typeNum
        },
        callback: (data) => {
          const typeObj = {
            1: 'localizedPrice',
            2: 'profitRate',
            3: 'inventory'
          }
          const typeFun = {
            1: this.handleBatchLocalizedPrice, // 批量计算利润率
            2: this.getBatchCalculatePrice, // 批量计算售价
            3: ''
          }
          if (data) {
            if (this.form.variantList.length > 1) {
              const priceDTOList = []
              this.form.variantList.forEach((item, index) => {
                item[typeObj[typeNum]] = data
                if (typeNum === 1) {
                  priceDTOList.push({ price: Number(item.localizedPrice) + Number(this.baseProductInfo.localizedShipping), productSku: item.productSku, productCost: item.costPrice })
                }
                if (typeNum === 2) {
                  priceDTOList.push({ saleProfitRate: item.profitRate, productSku: item.productSku, productCost: item.costPrice })
                }
              })
              typeFun[typeNum] && typeFun[typeNum](priceDTOList)
            } else {
              this.form.variantList.splice(0, 1, Object.assign(this.form.variantList[0], { [typeObj[typeNum]]: data }))
            }
          }
        }
      })
    },
    // 批量 计算利润率
    handleBatchLocalizedPrice(priceRateDTOList) {
      const { accountCode, warehouseId } = this.baseProductInfo
      const params = {
        storeCode: accountCode, // 店铺编码
        warehouseId: warehouseId, // 仓库编码
        platformCode: 'WH', // 平台编码
        priceRateDTOList: priceRateDTOList
      }
      calculateProfitRate(params).then(res => {
        const data = res.data
        this.form.variantList.forEach(item => {
          item.flag = false
          item.profitRate = parseFloat(data[item.productSku].profitRate).toFixed(2)
        })
      }).catch(err => {
        const msg = err.data.msg
        if (msg.split('=')[1]) {
          this.form.variantList.forEach(item => {
            item.flag = true
            item.profitRate = parseFloat(msg.split('=')[1]).toFixed(2)
          })
        }
      })
    },
    // 批量 计算售价
    getBatchCalculatePrice(priceDTOList) {
      const { accountCode, warehouseId } = this.baseProductInfo
      const params = {
        storeCode: accountCode, // 店铺编码
        warehouseId: warehouseId, // 本地仓库编码
        platformCode: 'WH', // 平台编码
        priceDTOList: priceDTOList // 多变体列表
      }
      calculatePrice(params).then(res => {
        const data = res.data
        this.form.variantList.forEach(item => {
          item.localizedPrice = parseFloat(data[item.productSku].salePrice - this.baseProductInfo.localizedShipping).toFixed(2)
        })
      })
    },
    // change店铺（创建）列表时清空数据(颜色&尺码&表格)
    changeStore() {
      this.menApparelTable = []
      this.tableTemp = 0
      this.colorItem = deepClone(addListingHandle.colorItem)
      this.form.color.splice(0, this.form.color.length)
      this.$set(this.form, 'variantList', variantList())
    },
    // getSkuDetailAjax(productSku) {
    //   getSpuDetailByProduct({ data: { lstProductSku: [productSku], platformCode: 'WH', storeCode: this.baseProductInfo.accountCode } }).then(res => {
    //     if (res.data && res.data[0]) {
    //       const data = res.data[0]
    //       this.form.lstSku = data.lstSku
    //       this.form.variantList.forEach(item => {
    //         data.lstSku.filter(list => {
    //           item.productSkuShow = `${item.nwSku} - ${item.productSku}`
    //           if (item.productSku === list.productSku) {
    //             item.productName = list.productName || ''
    //           }
    //         })
    //       })
    //       this.$set(this.baseProductInfo, 'totalSku', data.lstSku)
    //     }
    //   })
    // },
    // 重置sku下拉列表
    resetSkuList() {
      const selectedSku = this.form.variantList.map(item => item.productSku)
      this.baseProductInfo.totalSku.forEach(item => {
        item.disabled = false
        if (selectedSku.includes(item.productSku)) {
          item.disabled = true
        }
      })
    },
    // 初始变体值
    // initVariantList() {
    //   const skuList = this.isEdit ? this.baseProductInfo.wishListingVariantVOList : this.baseProductInfo.skuList
    //   skuList.forEach(item => { // 初始选中颜色
    //     this.form.color.push(item.color)
    //   })
    // },
    // 初始化数据 watch 第一次不会执行，需要初始化数据
    initializationData() {
      let { skuList, variantList, wishListingVariantVOList } = this.baseProductInfo
      let childProductSkuList = []
      if (this.isEdit) {
        childProductSkuList = wishListingVariantVOList.map(item => item.productSku)
      } else {
        childProductSkuList = skuList.map(item => item.productSku)
      }
      variantList.forEach(item => { item.profitRate = parseFloat(item.profitRate).toFixed(2) })
      // variantList处于在线状态时 初始数据禁用删除操作 & 商品编码设为disabled
      if (['Online', 'Update Failed', 'Disabled'].includes(this.auditTabActiveName)) {
        variantList = variantList.map(item => {
          item.init = true
          return item
        })
      }
      this.form = Object.assign({}, this.form, { skuList, variantList, childProductSkuList })
    },
    // 尺码 笛卡尔积
    changeMenApparelSize(val, type) {
      this.temp = val
      // if (!val) return false
      // 子sku列表 销售利润率  运输时间
      const skuList = this.isEdit ? this.baseProductInfo.wishListingVariantVOList : variantList()
      const { profitRate, shippingTime, localizedShipping, msrp } = this.baseProductInfo
      if ([1, 2, 8, 9, 25].includes(this.tableTemp)) {
        this.sizeList = this.menApparelTable.filter(item => item.checked).map(acc => acc.size)
      }
      if (![1, 2, 8, 9, 25].includes(this.tableTemp)) {
        this.sizeList = val
      }
      // if (Array.isArray(val)) return
      let arr = [] // 属性值 二维数组
      this.sizeListTemp = this.sizeList ? this.sizeList : []
      this.colorListTemp = this.colorList ? this.colorList : []
      arr = [this.sizeListTemp, this.colorListTemp]
      const combs = [] // 组合属性id:值;
      const recursion = (arr, index = 0, c = []) => {
        if (arr.length - 1 < index) return combs.push(c)
        arr[index].length ? arr[index].forEach(item => {
          recursion(arr, index + 1, c.concat(item))
        }) : recursion(arr, index + 1, c.concat()) // 如果 arr[index].length的值为空 递归也往下走，combs则不会为空，遍历可增加一条sku数据
      }
      recursion(arr)
      const deepList = deepClone(skuList)
      const beforeVariantList = deepClone(this.form.variantList)
      this.form.variantList = deepList
      // 如果 bool为false 则证明 combs没有选中颜色 也没有选中尺码，则不往下走
      const bool = combs.map(item => {
        if (item.length === 0) {
          item = false
        }
        return item
      })
      for (let i = 0; i < bool.length; i++) {
        if (bool[i] === false && this.isEdit) return false // 在此return出去 2.且是在编辑状态时
        else if (bool[i] === false && !this.isEdit && this.form.variantList.length === 1) { // 在非编辑状态时将最后遗留的一条数据删掉
          if (!this.form.variantList[0].size && !this.form.variantList[0].color) {
            this.form.variantList.splice(0, 1)
            const variantFirst = variantList()
            variantFirst[0].profitRate = this.baseProductInfo.profitRate
            // 新增 多变体默认出现一条空数据
            if (type) this.$set(this.form, 'variantList', variantFirst)
            return false
          }
        }
      }
      combs.forEach((citem, index) => {
        let sku = {}
        deepList && deepList.map(item => {
          // if(!item.productSku.lstAttrSpecification.length){}
          sku = {
            // id: `wish_variant${index}`,
            size: this.colorItem.find(item => item.label === citem[0]) ? citem[1] : citem[0], // 取对应的尺码|颜色
            // id: citem[0],
            color: this.colorItem.find(item => item.label === citem[0]) ? citem[0] : citem[1], // 取对应的尺码|颜色
            // productSku: item.productSku, // 子sku
            costPrice: item.costPrice, // 成本
            // costPrice: parseFloat(item.productCost * item.discountRatio).toFixed(2), //  成本 = 采购成本 *折扣
            msrp: msrp, // 参考价
            inventory: '',
            productName: item.productName, // title
            localizedShipping: localizedShipping, // 本地运费
            shipping: item.localizedShipping, // 运费
            localizedPrice: item.localizedPrice, // 售价
            profitRate: profitRate, // 利润率
            shippingTime: shippingTime, // 运输时间
            isEnabled: true // 是否上架默认设置true
          }
        })
        // console.log(sku, 'sku值')
        this.form.variantList.push(sku)
      })
      // 删除第一条初始化数据
      if (!this.isEdit) this.form.variantList.splice(this.form.variantList.findIndex(item => !item.size && !item.color), 1)
      const arr1 = []
      this.form.variantList.forEach((item, i) => {
        arr1.push(Object.assign({}, item, beforeVariantList[i], {
          size: item.size,
          color: item.color
        }))
      })
      this.form.variantList = arr1
      // if (!val.checked) this.form.variantList.splice(this.form.variantList.findIndex(item => item.size === val.size), 1)
      // if (type === 'changeSize') this.form.variantList = skuList
      this.$set(this.form.variantList)
      this.colorListTemp = []
      this.sizeListTemp = []
    },
    // 颜色链接
    handleColorCell() {
      const url = 'https://merchant.wish.com/documentation/colors'
      window.open(url, '_blank')
    },
    // 添加 面积或体积 长度 体积 尺码
    addArea(area) {
      this.menApparelTable.push(area)
      this.areaSize = ''
    },

    // 切换商品编码
    changeProductSku(val, row, index) {
      if (!val) { // 清空
        this.form.variantList.splice(index, Object.assign(this.form.variantList[index], {
          costPrice: '',
          inventory: '',
          localizedPrice: '',
          productSku: ''
        }))
      }
      this.resetSkuList()
      // 子sku去重
      const variantAttr = deepClone(this.form.variantList)
      variantAttr.splice(index, 1)
      for (let i = 0; i < variantAttr.length; i++) {
        if (variantAttr[i].productSku === row.productSku) {
          row.productSku = ''
          return this.$message.error('子sku不能重复')
        }
      }

      if (!row.costPrice) {
        const costList = this.isEdit ? this.baseProductInfo.wishListingVariantVOList : this.baseProductInfo.skuList
        costList.forEach(item => {
          if (item.productSku === val) {
            row.costPrice = item.costPrice
            row.productName = item.productName
          }
        })
      }
      // 成本显示
      if (row.profitRate || row.localizedPrice) {
        if (row.profitRate) { // 有利润率就调用计算售价的接口
          this.changeProfitRate(row, index)
        }
        if (row.localizedPrice) { // 有售价就调用 计算利润率的接口
          this.handleLocalizedPrice(row, index)
        }
      } else {
        return this.$message.error('售价和利润率都不能为空')
      }
    },
    // 计算利润率
    handleLocalizedPrice(row, index) {
      if (!row.productSku) return this.$message.error('请选择商品编码')
      const { accountCode, warehouseId } = this.baseProductInfo
      const priceRateDTOList = []
      priceRateDTOList.push({ price: Number(row.localizedPrice) + Number(this.baseProductInfo.localizedShipping), productSku: row.productSku, productCost: row.costPrice })
      const params = {
        storeCode: accountCode, // 店铺编码
        warehouseId: warehouseId, // 仓库编码
        platformCode: 'WH', // 平台编码
        priceRateDTOList: priceRateDTOList,
        productCost: row.productCost // 采购成本
      }
      calculateProfitRate(params).then(res => {
        row.flag = false
        const data = res.data
        this.$set(this.form.variantList[index], 'profitRate', toFixed2(data[row.productSku].profitRate))
      }).catch(err => {
        const msg = err.data.msg
        if (msg.split('=')[1]) {
          row.flag = true
          this.$set(this.form.variantList[index], 'profitRate', toFixed2(parseFloat(msg.split('=')[1])))
        }
      })
    },
    validateCostPrice(sku, index) {
      return (rule, value, callback) => {
        if (sku.costPrice && sku.costPrice > 0) {
          callback()
        } else {
          callback(new Error('成本不能小于0'))
        }
      }
    },
    // 更新售价
    changeProfitRate(row, index) {
      if (!row.productSku) return this.$message.error('请选择商品编码')
      this.getCalculatePrice(row.productSku, row.profitRate, row.costPrice, index)
    },
    // 计算售价
    getCalculatePrice(productSku, profitRate, costPrice, index) {
      const { accountCode, warehouseId } = this.baseProductInfo
      const priceDTOList = [{ productSku: productSku, saleProfitRate: profitRate, productCost: costPrice }]
      const params = {
        storeCode: accountCode, // 店铺编码
        warehouseId: warehouseId, // 本地仓库编码
        platformCode: 'WH', // 平台编码
        priceDTOList: priceDTOList, // 多变体列表
        saleProfitRate: profitRate, // 销售利润率
        productSku: productSku // 子sku
      }
      calculatePrice(params).then(res => {
        const data = res.data
        const salePrice = Number(data[productSku].salePrice) - Number(this.baseProductInfo.localizedShipping)
        this.$set(this.form.variantList[index], 'localizedPrice', salePrice.toFixed(2))
      })
    },
    turnTofalse(row) {
      row.flag = false
    },
    changeColor(val) {
      this.colorList = val
      this.changeMenApparelSize(this.temp)
    },
    // 切换尺码类型
    changeSize(val) {
      if (this.tableTemp === val.value) return
      this.tableTemp = val.value
      this.childShoesList = []
      const num = addListingHandle.MenApparel()[val.value - 1]
      // const cartesianList = this.form.variantList.filter(item => { item.size = '' })
      // 切换尺寸时不再清空本次操作时留存的数据
      // this.form.variantList = this.isEdit ? this.baseProductInfo.wishListingVariantVOList : []
      this.menApparelTable = num
      // this.changeMenApparelSize(this.temp, 'changeSize')
    },
    // 添加颜色
    addColorVal() {
      if (this.colorVal) {
        this.colorItem.push({ color: '', label: this.colorVal })
        this.colorVal = ''
      }
    },
    // 添加多变体
    handlerAdd(row, index) {
      const variantLists = []
      variantLists.push(variantList()[0])
      variantLists[0].profitRate = this.baseProductInfo.profitRate
      this.form.variantList.push(...variantLists) // 添加初始值【将第0项的对象push进去】
    },
    // 删除多变体
    handlerDel(row, index) {
      this.form.variantList.splice(index, 1)
      this.resetSkuList()
      const variantListColor = []
      const variantListSize = []
      this.form.variantList.filter(item => {
        variantListColor.push(item.color)
        variantListSize.push(item.size)
      })
      // color
      this.form.color.forEach((item, index) => {
        if (!variantListColor.includes(item)) {
          this.form.color.splice(index, 1)
        }
      })
      // size
      this.menApparelTable.forEach(item => {
        if (!variantListSize.includes(item.size)) {
          item.checked = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table--enable-row-transition .el-table__body td{
  padding:2px 0 !important;
}
.w-90{
  width: 90%;
}
.w-20{
  width: 20%;
}
.color{
  width: 22px;
  height: 14px;
  margin-right: 10px;
  display:inline-flex;
  background-size: 20px 12px !important;
  vertical-align: middle;
}
.herfColor{
  color:#409EFF
}
.sizeList{
  list-style: none;
  display: flex;
  flex-wrap:wrap;
  margin: 0 0 0 -40px;
  flex-direction:row;
  li{
    margin-right:10px;
    cursor: pointer;
    font-size: 14px;
    padding:0 2px;
    span{
      font-size: inherit;
    }

  }
}
.active{
  color: #409EFF;
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
// .el-form-item_no-lable ::v-deep .el-form-item__content{
//   margin-left: 0 !important;
// }
::v-deep .recursion-table .el-form-item__content{
  margin-left: 0 !important;
}
.color_size{
  position: relative;
  top: 10px;
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
