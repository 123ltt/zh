<template>
  <el-row v-loading="loading">
    <el-form ref="form" :model="form" :disabled="isDetail" size="mini" label-width="80px" class="form-col m-3 mb-3" :rules="rules">
      <el-col :span="19" class="me-3">
        <el-row :gutter="10">
          <el-col :span="3">站点</el-col>
          <el-col :span="7">售价</el-col>
          <el-col :span="7">促销价</el-col>
          <el-col :span="7">
            <div>利润率</div>
            <el-button size="mini" type="text" @click="batchUpdateRate">批量修改</el-button>
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in form.allPriceList" :key="index" :gutter="10">
          <el-col :span="3">{{ item.site }}</el-col>
          <el-col :span="7">
            <el-form-item :prop="'allPriceList.' + index + '.price'"
                          label-width="0"
                          :rules="{ required: true, validator: updateRetailPrice(item, index), trigger: ['blur','change'] }"
            >
              <el-input v-model="item.price"
                        v-input.positive
                        size="mini"
                        type="text"
                        @input="() => {item.price = toFixed2(item.price)}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              :prop="'allPriceList.' + index + '.specialPrice'"
              :rules="{ required: true, validator: updateSalePrice(item, index), trigger: ['blur','change'] }"
              label-width="0"
            >
              <el-input v-model="item.specialPrice"
                        v-input.positive
                        size="mini"
                        @input="() => {item.specialPrice = toFixed2(item.specialPrice)}"
                        @change="validCurrentPrice(item, index)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              :prop="'allPriceList.' + index + '.profitRate'"
              :rules="{ required: true, validator: validRate(item, index), trigger: 'change' }"
              label-width="0"
            >
              <el-input v-model="item.profitRate"
                        v-input.positive
                        size="mini"
                        type="text"
                        class="w-100"
                        @input="() => {item.profitRate = toFixed2(item.profitRate)}"
                        @change="validProfitRate(item, index)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="!isDetail" class="text-end">
          <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
          <el-button type="primary" size="mini" @click="submit('form')">确 定</el-button>
        </div>
      </el-col>
    </el-form>
    <el-col :span="4">
      <!-- <el-button size="mini" type="primary">计算</el-button> -->
      <div class="mt-3">
        <el-tooltip placement="left"
                    width="200"
                    trigger="click"
        >
          <div slot="content" class="tips">
            促销价 =（产品成本价*折扣比例+包装费耗材费(0.8RMB)+国际运费（只取头程费用））/ (1-平台佣金百分比-利润率-平台退款率-管理费率-付款手续费)/汇率<br>
            利润率 = 1-平台佣金百分比-平台退款率-管理费率-付款手续费-（产品采购成本*折扣比例+包装费耗材费(0.8RMB)+国际运费（只取头程费用））/ 促销价/汇率<br>
            售价 = 促销价 * 1.6倍
            <!-- 售价 = 促销价*1到2直接的随机数，倍数具体到1位小数比如：1.2、1.5 -->
          </div>
          <el-button type="primary" size="mini">查看价格公式</el-button>
        </el-tooltip>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { calculatePrice, calculateProfitRate } from '@/api/lazada/lazada'
import { toFixed2 } from './addListing.handle.js'
import batchUpdateRate from './batchUpdateRate'
import { deepClone } from '@/util/util'
export default {
  name: 'AllSitePrice',
  props: {
    isEdit: Boolean,
    isDetail: Boolean,
    siteArr: Array,
    baseProductInfo: Object,
    row: Object
  },
  data() {
    return {
      form: {
        allPriceList: []
      },
      rules: {},
      loading: false,
      toFixed2
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { sitePriceData } = this.row
      // 重新按选择排列的顺序获取value， 因为算价格的时候是站点列表已选第一个站点去当sku的price
      const siteData = []
      sitePriceData && this.siteArr.map(site => {
        sitePriceData.findIndex(item => item.site === site && siteData.push(item))
      })
      // const diffCompareSite = this.siteArr.map(item => item).sort().join() === siteData.map(item => item.site).sort().join()
      // if (diffCompareSite) { // 编辑回显各站点价格
      //   this.form.allPriceList = deepClone(siteData)
      // } else {
      const { price, specialPrice, profitRate } = deepClone(this.row)
      this.siteArr.forEach(site => {
        let obj = {}
        if (this.isEdit) {
          obj = {
            site,
            price: this.row[`${site.toLocaleLowerCase()}RetailPrice`], // 售价
            specialPrice: this.row[`${site.toLocaleLowerCase()}SalesPrice`], // 促销价
            profitRate: this.row[`${site.toLocaleLowerCase()}ProfitRate`] || profitRate
          }
        } else {
          obj = {
            site,
            price: this.row[`${site.toLocaleLowerCase()}RetailPrice`] || price, // 售价
            specialPrice: this.row[`${site.toLocaleLowerCase()}SalesPrice`] || specialPrice, // 促销价
            profitRate: this.row[`${site.toLocaleLowerCase()}ProfitRate`] || profitRate
          }
        }
        this.form.allPriceList.push(obj)
      })
      // 批量获取售价
      !this.isDetail && !price && !specialPrice && this.form.allPriceList.forEach((item, index) => {
        this.validProfitRate(item, index)
      })
      // }
    },
    // 批量修改利润率
    batchUpdateRate() {
      this.$modal({
        title: '批量修改利润率',
        component: batchUpdateRate,
        width: '400px',
        callback: (data) => {
          if (data) {
            this.form.allPriceList.forEach((item, index) => {
              item.profitRate = data
              this.validProfitRate(item, index)
            })
          }
        }
      })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$parent.$emit('close', this.form.allPriceList)
        } else {
          return false
        }
      })
    },
    // 修改售价
    updateRetailPrice(sku) {
      return (rule, value, callback) => {
        const item = deepClone(sku)
        const num = item.price / item.specialPrice
        item.flag = false
        if (item.site === 'TH' && (+item.price < 0 || +item.price > 40000)) {
          item.flag = true
        } else if (item.site === 'ID' && (+item.price < 14418 || +item.price > 19500000)) {
          item.flag = true
        } else if (item.site === 'MY' && (+item.price < 0 || +item.price > 6750)) {
          item.flag = true
        } else if (item.site === 'SG' && (+item.price < 1.33 || +item.price > 2040)) {
          item.flag = true
        } else if (item.site === 'PH' && (+item.price < 48 || +item.price > 69000)) {
          item.flag = true
        } else if (item.site === 'VN' && (+item.price < 23126 || +item.price > 1000000)) {
          item.flag = true
        }
        if (item.flag && value) {
          switch (item.site) {
            case 'TH':
              callback(new Error('TH区间为0-40000'))
              break
            case 'ID':
              callback(new Error('ID-( 14418-19500000 )'))
              break
            case 'MY':
              callback(new Error('MY区间为0-6750'))
              break
            case 'SG':
              callback(new Error('SG区间为1.33-2040'))
              break
            case 'PH':
              callback(new Error('PH区间为48-69000'))
              break
            case 'VN':
              callback(new Error('VN-( 23126-1000000 )'))
              break
          }
        } else if (!value || +value === 0) {
          callback(new Error('售价不能为空或0'))
        } else if (item.specialPrice && (num <= 1 || num >= 2)) { // 已填促销价
          callback(new Error('售价为促销价的1~2倍'))
        } else {
          callback()
        }
      }
    },
    // 修改促销价基本校验
    updateSalePrice(sku, index, flag) {
      return (rule, value, callback) => {
        const item = deepClone(sku)
        item.falg = false
        if (item.site === 'TH' && (+item.specialPrice < 0 || +item.specialPrice > 40000)) {
          item.flag = true
        } else if (item.site === 'ID' && (+item.specialPrice < 14418 || +item.specialPrice > 19500000)) {
          item.flag = true
        } else if (item.site === 'MY' && (+item.specialPrice < 0 || +item.specialPrice > 6750)) {
          item.flag = true
        } else if (item.site === 'SG' && (+item.specialPrice < 1.33 || +item.specialPrice > 2040)) {
          item.flag = true
        } else if (item.site === 'PH' && (+item.specialPrice < 48 || +item.specialPrice > 69000)) {
          item.flag = true
        } else if (item.site === 'VN' && (+item.specialPrice < 23126 || +item.specialPrice > 1000000)) {
          item.flag = true
        }
        if (item.flag && value) {
          switch (item.site) {
            case 'TH':
              callback(new Error('TH区间为0-40000'))
              break
            case 'ID':
              callback(new Error('ID-( 14418-19500000 )'))
              break
            case 'MY':
              callback(new Error('MY区间为0-6750'))
              break
            case 'SG':
              callback(new Error('SG区间为1.33-2040'))
              break
            case 'PH':
              callback(new Error('PH区间为48-69000'))
              break
            case 'VN':
              callback(new Error('VN-( 23126-1000000 )'))
              break
          }
          // callback(new Error('价格不在限价区间'))
        } else if (!value || +value === 0) {
          callback(new Error('促销价不能为空或0'))
        } else {
          callback()
        }
      }
    },
    rulesFun(item, index) {
      if (item.site === 'TH' && (+item.specialPrice < 0 || +item.specialPrice > 40000)) {
        return true
      } else if (item.site === 'ID' && (+item.specialPrice < 14418 || +item.specialPrice > 19500000)) {
        return true
      } else if (item.site === 'MY' && (+item.specialPrice < 0 || +item.specialPrice > 6750)) {
        return true
      } else if (item.site === 'SG' && (+item.specialPrice < 1.33 || +item.specialPrice > 2040)) {
        return true
      } else if (item.site === 'PH' && (+item.specialPrice < 48 || +item.specialPrice > 69000)) {
        return true
      } else if (item.site === 'VN' && (+item.specialPrice < 23126 || +item.specialPrice > 1000000)) {
        return true
      } else {
        return false
      }
    },
    // 修改促销价算利润率
    validCurrentPrice(item, index) {
      // 促销价如果不在限价内则不调用接口
      const res = this.rulesFun(item)
      if (res) return
      if (!item.specialPrice) return
      const { platformCode, storeCode } = this.baseProductInfo
      this.loading = true
      calculateProfitRate({
        platformCode,
        siteCode: item.site,
        storeCode,
        warehouseId: 'Z20',
        priceRateDTOList: [
          {
            productSku: this.row.productSku,
            price: item.specialPrice
          }
        ]
      }).then(res => {
        if (res.code === 200) {
          const data = res.data
          const profitRate = data[this.row.productSku].profitRate
          const shippingPrice = data[this.row.productSku].shippingPrice
          // 售价 = 促销价 * （1至2之间的随机数）
          // const price = Math.round(item.specialPrice * this.getRound() * 10) / 10
          // 售价 = 促销价 * 1.6倍
          const price = (item.specialPrice * 1.6).toFixed(2)
          this.updateRetailPrice(item) // 校验促销价*1.6倍后的乘积是否会超限
          this.form.allPriceList.splice(index, 1, Object.assign(this.form.allPriceList[index], { profitRate, price, shippingPrice }))
        } else {
          this.$message.error(res.msg || res.message || '未知错误')
          this.form.allPriceList.splice(index, 1, Object.assign(this.form.allPriceList[index], {
            price: '',
            specialPrice: '',
            shippingPrice: ''
          }))
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // >1 && <2 的随机数
    getRound() {
      let num = Math.round((Math.random() * (2 - 1) + 1) * 10) / 10
      if (num === 1) { num = 1.1 }
      if (num === 2) { num = 1.9 }
      return num
    },
    // 修改利润率算促销价，售价和运费
    validProfitRate(item, index) {
      if (!item.profitRate) return
      const { platformCode, storeCode } = this.baseProductInfo
      const { productSku, productCost } = this.row
      const priceDTOList = []
      // combineSku?.length ? combineSku.forEach(item => {
      //   priceDTOList.push({
      //     productSku: item.sku,
      //     saleProfitRate: item.profitRate,
      //     productCost // 产品成本
      //   })
      // })
      priceDTOList.push({
        productSku,
        saleProfitRate: item.profitRate,
        productCost // 产品成本
      })
      this.loading = true
      calculatePrice({
        platformCode,
        siteCodes: [item.site],
        storeCode: storeCode,
        warehouseId: 'Z20',
        priceDTOList
      }).then(res => {
        if (res.code === 200) {
          const data = res.data
          const { price, specialPrice, shippingPrice } = data[productSku][item.site]
          this.form.allPriceList.splice(index, 1, Object.assign(this.form.allPriceList[index], {
            price,
            specialPrice,
            shippingPrice
          }))
        } else {
          this.$message.error(res.msg || res.message || '未知错误')
          this.form.allPriceList.splice(index, 1, Object.assign(this.form.allPriceList[index], {
            price: '',
            specialPrice: '',
            shippingPrice: ''
          }))
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 利润率验证
    validRate(sku, index) {
      return (rule, value, callback) => {
        if (Number(sku.profitRate) <= 0 || Number(sku.profitRate) > 1) {
          callback(new Error('请输入0~1之间的数字'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tips{
  width: 400px;
  line-height: 20px;
}
</style>
