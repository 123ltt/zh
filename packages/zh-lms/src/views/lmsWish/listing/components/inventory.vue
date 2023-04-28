<template>
  <el-form ref="form" :model="form" size="mini" class="w-90 form-col" :rules="rules">
    <el-button type="primary" size="mini" :disabled="!form.localizedShipping" @click="handleNationalShipping">设置国家运费</el-button>
    <el-row>
      <template v-if="!isVariation">
        <el-col :span="12">
          <el-form-item v-loading="productLoading > 0" label="本地价格（CNY）" prop="localizedPrice" :label-width="labelWidth">
            <el-input v-model="form.localizedPrice" v-input.positive placeholder="" class="g-w100" @input="() => {form.localizedPrice = toFixed2(form.localizedPrice)}" @change="changeLocalizedPrice" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格（USD）" prop="price" :label-width="labelWidth">
            <el-input v-model="form.price" class="g-w100" disabled />
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="12">
        <el-form-item label="本地运费（CNY）" prop="localizedShipping" :label-width="labelWidth">
          <el-input v-model="form.localizedShipping" class="g-w100" @input="() => {form.localizedShipping = toFixed2(form.localizedShipping)}" @change="changeLocalizedShipping" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="运费（USD）" prop="shipping" :label-width="labelWidth">
          <el-input v-model="form.shipping" class="g-w100" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="MSRP" prop="msrp" :label-width="labelWidth">
          <el-input v-model="form.msrp" class="g-w100" />
        </el-form-item>
      </el-col>
      <template v-if="!isVariation">
        <el-col :span="12">
          <el-form-item v-loading="productLoading > 0" label="销售利润率" prop="profitRate" :label-width="labelWidth" :rules="[{ required: true, pattern: /0\.\d+/g, message: '请输入0.01-0.99之间', trigger: 'blur' }]">
            <!-- 切换销售利润率 本地价格要跟着改变 -->
            <el-input v-if="flag" v-model="form.profitRate" v-input.number class="g-w100" maxlength="4" @input="xixi" />
            <el-input v-else v-model="form.profitRate" v-input.number class="g-w100" maxlength="4" @change="changeProfitRate" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存" prop="inventory" :label-width="labelWidth">
            <el-input v-model="form.inventory" class="g-w100" />
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="12">
        <div class="d-inline-flex justify-content-between middle">
          <el-form-item label="最大购买数" prop="maxQuantity" :label-width="labelWidth">
            <el-input v-model="form.maxQuantity" class="w-50 me-2" />
          </el-form-item>
          <el-form-item prop="packageWeight" style="margin-left:-40px !important">
            <span>2KG ÷</span><el-input v-model="form.packageWeight" v-input.number class="w-25 me-2" @change="changePackWeight(form.packageWeight)" /> KG ≈  {{ form.packWeightNum && form.packWeightNum.toFixed(3) }}
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="24">
        <el-form-item label="运输时间" :label-width="labelWidth">
          <el-radio-group v-model="form.shippingTime">
            <el-radio v-for="(item,index) in shippingTimeOption" :key="index" :label="item" @click.native.prevent="getChangeData(item)">{{ item }}</el-radio>
            <el-radio label="1" @click.native.prevent="getChangeData('1')">其他</el-radio>
          </el-radio-group>
          <el-form-item>
            <div class="d-inline-flex">
              <el-input v-model="form.shippingTimeStart" style="width:100px;" class="me-4" /> -
              <el-input v-model="form.shippingTimeEnd" style="width:100px;" class="ms-4" @change="getEnd" />
            </div>
          </el-form-item>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { toFixed2 } from './wish.handle.js'
import shippableCountriesPage from './shippableCountriesPage.vue'
import { calculateProfitRate, calculatePrice } from '@/api/wish/wish.js'
import { deepClone } from '@/util/util'
export default {
  name: 'Inventory',
  props: {
    labelWidth: String,
    isEdit: Boolean,
    // 请求详细信息加载状态
    productLoading: Number,
    isVariation: Boolean,
    baseProductInfo: Object,
    shippingTimeOption: Array
  },
  data() {
    const validatePrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('本地价格不能为空'))
      } else if (value && +value > 0) {
        callback()
      } else {
        callback(new Error('本地价格不能小于0'))
      }
    }
    // const validatePackageWeight = (rule, value, callback) => {
    //   if (value && value > 0 && value <= 2) {
    //     callback()
    //   } else {
    //     callback(new Error('请输入大于0，小于等于2的数字'))
    //   }
    // }
    const validateProfit = (rule, value, callback) => {
      if (this.flag) return
      if (value && value > 0 && value < 1) {
        callback()
      } else {
        callback(new Error('销售利润率为大于0，小于1的数字'))
      }
    }
    return {
      toFixed2,
      form: {
        profitRate: '', // 销售利润率
        msrp: '',
        price: '',
        shipping: '',
        inventory: '',
        shippingTime: '',
        shippingTimeEnd: '',
        localizedShipping: 13,
        localizedPrice: '',
        countryShippingList: [],
        shippingTimeStart: '',
        listingType: '',
        salePrice: '', // （总的）本地价格
        maxQuantity: null, // 最大购买数
        packageWeight: null, // 包裹重量
        packWeightNum: null // 包裹重量kg
      },
      rules: {
        localizedPrice: [{ required: true, validator: validatePrice, trigger: 'blur' }],
        localizedShipping: [{ required: true, message: '本地运费不能为空', trigger: 'blur' }],
        inventory: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
        profitRate: [{ validator: validateProfit, trigger: 'blur' }]
        // packageWeight: [{ required: true, validator: validatePackageWeight, trigger: 'blur' }]
      },
      flag: false
    }
  },
  watch: {
    'baseProductInfo.productSku'(val) {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key]
      })
      this.form.profitRate = parseFloat(this.form.profitRate).toFixed(2)
    }
    // baseProductInfo() {
    // const data = deepClone(this.baseProductInfo)
    // Object.keys(this.form).forEach((key) => {
    //   this.form[key] = data[key]
    // })
    // handler(oldVal, newVal) {
    // this.initializationData()
    // }
    //   // deep: true
    // }
  },
  methods: {
    // 更改店铺清空数据
    storeChange() {
      this.form = {
        profitRate: '', // 销售利润率
        msrp: '',
        price: '',
        shipping: '',
        inventory: '',
        shippingTime: '',
        shippingTimeEnd: '',
        localizedShipping: 13,
        localizedPrice: '',
        countryShippingList: [],
        shippingTimeStart: '',
        listingType: '',
        salePrice: '', // （总的）本地价格
        maxQuantity: null, // 最大购买数
        packageWeight: null, // 包裹重量
        packWeightNum: null // 包裹重量kg
      }
    },
    getEnd(val) {
      if (!this.form.shippingTimeStart && !this.form.shippingTimeEnd) return this.$message.error('请补全时间区间')
      this.$set(this.form, 'shippingTime', this.form.shippingTimeStart + '-' + val)
    },
    getChangeData(val) {
      val === this.form.shippingTime ? this.form.shippingTime = '' : this.form.shippingTime = val
      this.form.shippingTimeStart = ''
      this.form.shippingTimeEnd = ''
    },
    // 修改运费
    changeLocalizedShipping(val) { // 运费修改， 价格进行相应修改，总和不变不触发利润率的修改
      const oldLocalizedShipping = this.baseProductInfo.localizedShipping // 老运费
      this.baseProductInfo.localizedShipping = val // 新的运费
      this.baseProductInfo.shippingValStatus = true // 本地运费被修改
      this.baseProductInfo.oldLocalizedShipping = oldLocalizedShipping // 老运费
      this.form.localizedShipping = val
      const changeLocalizedShipping = val - oldLocalizedShipping // 新 - 老
      if (!this.isVariation) {
        this.baseProductInfo.localizedPrice = (this.baseProductInfo.localizedPrice - changeLocalizedShipping).toFixed(2) // 本地运费= 本地价格-运费
        this.form.localizedPrice = (this.form.localizedPrice - changeLocalizedShipping).toFixed(2) // 本地运费= 本地价格-运费
      }
    },
    // 计算利润率
    // 本地价格改变 本地运费 销售利润率跟着改
    changeLocalizedPrice(val) {
      // this.productLoading++
      this.baseProductInfo.localizedPrice = val
      const {
        accountCode, warehouseId, productSku, productCost, discountRatio, localizedShipping, wishListingVariantVOList
      } = this.baseProductInfo
      const priceRateDTOList = []
      if (!this.isEdit) { // 新增
        if (!discountRatio) {
          this.$message.error('此SKU折扣率为零，请检查SKU信息')
          // this.productLoading--
          return
        }
      }
      // 新增
      //  成本 = 采购成本 *折扣
      let costPrice = ''
      let somePirce = '' // 本地价格+本地运费 = 成本价
      if (!this.isEdit && productCost && discountRatio) {
        costPrice = parseFloat(productCost * discountRatio).toFixed(2)
      } else {
        // 编辑 本地价格+本地运费 = 成本价
        if (!this.isVariation) {
          costPrice = wishListingVariantVOList[0].costPrice
        }
      }
      somePirce = Number(this.baseProductInfo.localizedPrice) + Number(localizedShipping)
      this.baseProductInfo.costPrice = costPrice
      if (Number(costPrice)) {
        priceRateDTOList.push({ price: somePirce, productSku: productSku, productCost: Number(costPrice) })
      } else {
        priceRateDTOList.push({ price: somePirce, productSku: productSku })
      }
      const params = {
        storeCode: accountCode, // 店铺编码
        warehouseId: warehouseId, // 仓库编码
        platformCode: 'WH', // 平台简码
        price: somePirce, // 本地售价
        productSku: productSku, // sku
        priceRateDTOList: priceRateDTOList,
        productCost: costPrice // 采购成本
      }
      calculateProfitRate(params).then(res => {
        this.flag = false
        const data = res.data
        const calProductSku = Object.keys(data)
        this.baseProductInfo.profitRate = parseFloat(data[calProductSku].profitRate).toFixed(2)
        this.form.profitRate = parseFloat(data[calProductSku].profitRate).toFixed(2)
      }).catch(err => {
        const msg = err.data.msg
        if (msg.split('=')[1]) {
          this.flag = true
          this.form.profitRate = parseFloat(msg.split('=')[1]).toFixed(2)
        }
      }).finally(() => {
        // this.productLoading--
      })
    },
    xixi() {
      this.flag = false
    },
    // 计算售价
    getCalculatePrice() {
      // this.productLoading++
      const priceDTOList = []
      const { skuList, accountCode, warehouseId, productSku, productCost, discountRatio, localizedShipping, listingType } = this.baseProductInfo
      const profitRate = listingType === 'Variation' ? this.baseProductInfo.profitRate : this.form.profitRate // 销售利润率
      if (this.isVariation) {
        // 子productSku 列表
        skuList.map(item => {
          //  成本 = 采购成本 *折扣
          const costPrice = parseFloat(item.productCost * item.discountRatio).toFixed(2)
          if (Number(costPrice)) {
            priceDTOList.push({ productSku: item.productSku, saleProfitRate: profitRate, productCost: Number(costPrice) })
          } else {
            priceDTOList.push({ productSku: item.productSku, saleProfitRate: profitRate })
          }
        })
      } else {
        const paramsObj = { saleProfitRate: profitRate }
        if (productCost && discountRatio) {
          //  成本 = 采购成本 *折扣
          const costPrice = parseFloat(productCost * discountRatio).toFixed(2)
          this.baseProductInfo.costPrice = Number(costPrice)
          paramsObj.productCost = costPrice
        }
        priceDTOList.push({ ...paramsObj, productSku: productSku })
      }
      const params = {
        storeCode: accountCode, // 店铺编码
        warehouseId: warehouseId, // 仓库编码
        platformCode: 'WH', // 平台站点WH
        priceDTOList: priceDTOList,
        saleProfitRate: profitRate // 销售利润率
      }
      if (!this.isVariation) {
        params.productSku = productSku
      }
      calculatePrice(params).then(res => {
        const data = res.data
        const dataDroductSku = Object.keys(data)
        let params = {}
        if (this.isVariation) {
          // sku 变体取最低的价格
          const localizedPriceList = [] // 本地价格列表
          Object.keys(data).forEach(item => {
            localizedPriceList.push(data[item].salePrice)
          })
          // 最低的本地价格
          const minSalePrice = Math.min(...localizedPriceList)
          params = {
            ...data[dataDroductSku[0]],
            localizedPrice: (minSalePrice - localizedShipping).toFixed(2) // 本地价格= 价格 - 运费
          }
          skuList.map((item, index) => {
            if (dataDroductSku[index] === item.productSku) {
              item.localizedPrice = data[dataDroductSku[index]].salePrice
              item.localizedShipping = localizedShipping
            }
          })
          params.localizedShipping = parseFloat(localizedShipping).toFixed(2)
          this.baseProductInfo.skuList = skuList
        } else {
          // sku 组合sku 返回的是对象
          const localPrice = Number(data[dataDroductSku].salePrice - localizedShipping).toFixed(2)
          params = {
            salePrice: data[dataDroductSku].salePrice,
            localizedPrice: localPrice
          }
          this.form.salePrice = params.salePrice
          this.form.localizedPrice = localPrice
        }
      }).finally(() => {
        // this.productLoading--
      })
    },
    // 初始化数据
    initializationData() {
      const { packageWeight, packWeightNum, profitRate, msrp, shipping, price, maxQuantity, inventory, shippingTime, localizedPrice, localizedShipping, tableDataTemp, countryShippingList, listingType } = this.baseProductInfo
      this.form = Object.assign({}, this.form, { packageWeight, packWeightNum, profitRate, msrp, shipping, price, maxQuantity, inventory, shippingTime, localizedPrice, localizedShipping, countryShippingList, tableDataTemp, listingType })
      if (packWeightNum) {
        this.form.maxQuantity = packWeightNum === Infinity || packWeightNum === 0 ? '' : Math.floor(packWeightNum)
      }
      if (!this.shippingTimeOption.includes(shippingTime) && shippingTime) {
        this.$set(this.form, 'shippingTimeStart', shippingTime.split('-')[0])
        this.$set(this.form, 'shippingTimeEnd', shippingTime.split('-')[1])
      }
    },
    // 修改销售利润率
    changeProfitRate(val) {
      if (val && val > 0 && val < 1) {
        this.baseProductInfo.profitRate = val
        this.form.profitRate = val
        this.getCalculatePrice()
      }
    },
    // 最大购买数
    changePackWeight(val) {
      const num = 2 / val
      this.form.packWeightNum = num
      this.form.maxQuantity = Math.floor(num)
    },
    // 设置国家运费
    handleNationalShipping() {
      const { tableDataTemp, countryShippingList } = this.baseProductInfo
      this.$modal({
        title: '设置国家运费',
        component: shippableCountriesPage,
        width: '800px',
        data: {
          localizedShipping: this.form.localizedShipping,
          tableDataTemp: tableDataTemp,
          shippingValStatus: this.baseProductInfo.shippingValStatus,
          isEdit: this.isEdit,
          countryShippingList: countryShippingList // 国家运费列表数据
        },
        callback: refresh => {
          if (refresh) {
            this.form.countryShippingList = refresh
            this.baseProductInfo.shippingValStatus = false
            this.$emit('changeBaseProductInfo', this.form)
          }
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.w-90{
  width: 90%;
}
.middle{
  vertical-align: middle;
}
</style>
