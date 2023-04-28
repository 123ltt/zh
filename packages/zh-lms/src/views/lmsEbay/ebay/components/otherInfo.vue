<template>
  <el-form ref="form"
           v-loading="countLoading"
           :model="form"
           :rules="rules"
           size="small"
           :label-width="labelWidth"
           class="sp-form form-col"
  >
    <el-form-item label="物流" prop="logical">
      <logicalsList v-loading="logisticsLoading" :logicals-list="logicalsList" />
    </el-form-item>
    <el-row class="w-90">
      <el-col :span="12">
        <el-form-item label="运费" prop="freight">
          <el-input v-if="form.logical" v-model="form.logical.cost" disabled />
          <el-input v-else :value="cost" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="重量(g)" prop="weight">
          <el-input v-model="baseProductInfo.weight" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="成本" prop="costPrice">
          <el-input v-model="costPrice" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="刊登实际毛利率" prop="actualProfitRate">
          <el-input v-model="form.actualProfitRate" disabled />
        </el-form-item>
      </el-col>
      <el-col v-if="saleType === '2'" :span="12">
        <el-form-item label="起拍价" prop="startPrice">
          <el-input v-model="form.startPrice" v-input.positive placeholder="起拍价" @input="() => {form.startPrice = toFixed2(form.startPrice)}" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item v-if="saleType === '1'" label="售价" prop="startPrice">
          <el-input v-model="form.startPrice" v-input.positive placeholder="售价" @input="() => {form.startPrice = toFixed2(form.startPrice)}" @blur="changePrice(form.startPrice)" />
        </el-form-item>
        <el-form-item v-if="saleType === '2'" label="一口价" prop="buyItNowPrice">
          <el-input v-model="form.buyItNowPrice" v-input.positive placeholder="一口价" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="销售利润率" prop="saleProfitRate">
          <el-input v-model="form.saleProfitRate" v-input.positive @input="() => {form.saleProfitRate = toFixed2(form.saleProfitRate)}" @blur="changeRate(form.saleProfitRate)" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import logicalsList from './logicalsList.vue'
import { LIMIT } from '@/config/form'
import { toFixed2 } from '@/views/lmsAmazon/amazon/components/addListing.handle.js'
import { getCalculateProfitRate, getCalculatePrice, getOptimize } from '@/api/ebay/ebayAdd.js'
export default {
  name: 'OtherInfo',
  components: { logicalsList },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    },
    productLoading: Number,
    // 是否禁用
    isEdit: Boolean,
    // 是否显示支付模板
    isShowPay: Boolean
  },
  data() {
    const that = this
    // 修改售价/起拍价算利润
    const valiPrice = (rule, value, callback) => {
      this.valiPrice(rule, value, callback)
    }
    // 修改利润算售价
    const valiGrossProfit = (rule, value, callback) => {
      that.valiGrossProfit(rule, value, callback)
    }
    // 一口价验证
    const valiBuyItNowPrice = (rule, value, callback) => {
      if (this.form.buyItNowPrice && +this.form.buyItNowPrice < +this.form.startPrice) {
        callback(new Error('一口价不能小于起拍价'))
      } else {
        callback()
      }
    }
    return {
      countLoading: false,
      LIMIT,
      toFixed2,
      cost: '',
      form: {
        logical: {}, // 计算符合的物流信息
        saleProfitRate: '', // 销售利润率
        startPrice: '', // 售价 &起拍价
        buyItNowPrice: '', // 一口价
        costPrice: '', // 成本
        actualProfitRate: '' // 刊登实际毛利率
      },
      deductRate: '', // 抵扣项
      logicalsList: [], // 物流列表
      rules: {
        saleProfitRate: [{ validator: valiGrossProfit, trigger: 'blur' }],
        startPrice: [{ required: true, validator: valiPrice, trigger: 'blur' }],
        buyItNowPrice: [{ validator: valiBuyItNowPrice, trigger: 'blur' }]
      },
      logisticsLoading: false,
      saleType: '1',
      controlFlag: false, // 控制接口(售价、利润率)调用
      cache: {
        saleProfitRate: '',
        startPrice: ''
      }
    }
  },
  computed: {
    costPrice: function() {
      return this.form.costPrice ? this.form.costPrice.toFixed(2) : ''
    }
  },
  watch: {
    'baseProductInfo'() {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key]
      })
      const { saleProfitRate, startPrice } = this.form
      this.cache = { saleProfitRate, startPrice }
      data.saleType && (this.saleType = data.saleType)
    }
  },
  methods: {
    changeRate(val) {
      if (!val || this.cache.saleProfitRate === val) return
      this.controlFlag = true
      this.$nextTick(() => {
        this.$refs.form.validateField('saleProfitRate')
        this.cache.saleProfitRate = val
      })
    },
    changePrice(val) {
      if (!val || this.cache.startPrice === val) return
      this.controlFlag = true
      this.$nextTick(() => {
        this.$refs.form.validateField('startPrice')
        this.cache.startPrice = val
      })
    },
    valiGrossProfit(rule, value, callback) {
      const { paypalAccount } = this.baseProductInfo
      if (!paypalAccount && this.isShowPay) {
        callback(new Error('支付模板不能为空'))
      } else if (this.form.saleProfitRate === null || this.form.saleProfitRate === '' || this.form.saleProfitRate === undefined) {
        callback()
      } else if (Number(this.form.saleProfitRate) <= 0) {
        callback(new Error('销售利润率不能小于0'))
      } else if (Number(this.form.saleProfitRate) >= 1) {
        callback(new Error('销售利润率不能大于1'))
      } else if (!this.logicalsList.length) {
        callback(new Error('没有物流信息'))
      } else {
        if (!this.controlFlag) {
          callback()
          return
        }
        // 防止有为null的字符串
        if (this.form.saleProfitRate === 'null') {
          callback()
          return
        }
        const { productSku, publishSiteCode, storeCode, warehouse, isOversea } = this.baseProductInfo
        const priceDTOList = [{ saleProfitRate: this.form.saleProfitRate, productSku, lmsChannelOptimizeDTOList: this.logicalsList }]
        this.countLoading = true
        this.$emit('productLoadingStart')
        getCalculatePrice({
          platformCode: 'EB',
          priceDTOList,
          siteCode: publishSiteCode,
          storeCode,
          warehouse,
          isOversea,
          paypalAccount
        }).then(res => {
          if (res.data) {
            const data = res.data[productSku]
            if (data.price && data.matchedChannel) {
              this.form.logical = data.matchedChannel
              this.form.logical.weight = this.baseProductInfo.weight
              this.form.startPrice = data.price
              this.form.actualProfitRate = this.form.saleProfitRate
              this.controlFlag = false
              this.$emit('changeSellingPrice', this.form.startPrice)
              // 将售价data传递出去
              this.$emit('getStartPrice', this.form.startPrice)
              callback()
            } else {
              callback(new Error('没有合适的物流'))
            }
          } else callback(new Error(`${res.msg || '没有合适的物流'}`))
        }).catch(() => {
          callback(new Error('没有合适的物流'))
        }).finally(() => {
          this.countLoading = false
          this.$emit('productLoadingEnd')
        })
      }
    },
    valiPrice(rule, value, callback) {
      const { paypalAccount } = this.baseProductInfo
      if (!paypalAccount && this.isShowPay) {
        callback(new Error('支付模板不能为空'))
      } else if (!value || Number(value) === 0) {
        callback(new Error(`${this.saleType === '1' ? '售价' : this.saleType === '2' ? '起拍价' : ''}不能小于0`))
      } else if (!this.logicalsList.length) {
        callback(new Error('没有物流信息'))
      } else {
        if (!this.controlFlag) {
          callback()
          return
        }
        const { productSku, publishSiteCode, storeCode, warehouse, isOversea } = this.baseProductInfo
        const priceRateDTOList = [{ price: value, productSku, lmsChannelOptimizeDTOList: this.logicalsList }]
        this.countLoading = true
        this.$emit('productLoadingStart')
        getCalculateProfitRate({
          platformCode: 'EB',
          priceRateDTOList,
          siteCode: publishSiteCode,
          storeCode,
          warehouse,
          isOversea
        }).then(res => {
          if (res.data) {
            const data = res.data[productSku]
            if (data.profitRate && data.matchedChannel) {
              this.form.logical = data.matchedChannel
              this.form.logical.weight = this.baseProductInfo.weight
              this.form.actualProfitRate = data.profitRate
              this.saleType === '2' && this.$refs.form.validateField('buyItNowPrice')
              this.controlFlag = false
              this.$emit('changeSellingPrice', this.form.startPrice)
              // 将售价data传递出去
              this.$emit('getStartPrice', this.form.startPrice)
              callback()
            } else {
              callback(
                new Error('没有合适的物流'))
            }
            // this.form.saleProfitRate = ''
            // this.$refs.form.validateField('saleProfitRate')
          } else callback(new Error(`${res.msg || '没有合适的物流'}`))
        }).catch(() => {
          callback(new Error('没有合适的物流'))
        }).finally(() => {
          this.countLoading = false
          this.$emit('productLoadingEnd')
        })
      }
    },
    getOtherInfo(isEdit) {
      return new Promise((resolve, reject) => {
        if (this.baseProductInfo.productSku) {
          this.getOptimize(isEdit).then(res => {
            resolve(res)
            // 编辑初始化由售价推算出运费和实际刊登率
            // if (isEdit) {
            //   this.$refs.form.validateField('startPrice')
            // }
          })
        }
      })
    },
    // 获取物流信息
    getOptimize(isEdit) {
      return new Promise((resolve, reject) => {
        const { storeName, publishSiteCode, platformCode, productSku, storeCode, virtualWarehouse, warehouse, isOversea, warehouseType, lstSkuCode } = this.baseProductInfo
        if (storeName && publishSiteCode && platformCode && productSku && warehouse) {
          let countryCode = publishSiteCode
          if (publishSiteCode === 'UK') {
            countryCode = 'GB'
          } else if (publishSiteCode === 'eBayMotors') {
            countryCode = 'US'
          }
          const skus = lstSkuCode && lstSkuCode.length ? lstSkuCode.map(item => item.sku) : [productSku]
          this.$emit('productLoadingStart')
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
            // this.logicalsList = [{ deliveryGroupName: 'EMS', agentCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '33', priceHigh: '99999' }, { deliveryGroupName: '大陆DHL', agentCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '0.333', priceHigh: '5.38' }]
            this.logicalsList = deepClone(res.data) || []
            !isEdit && this.$refs.form.validateField('saleProfitRate')
            resolve(res)
          }).finally(() => {
            this.$emit('productLoadingEnd')
          })
        } else {
          this.logicalsList = []
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
    padding: 10px 0px;
}
.cursor-move{
  cursor: move;
}
</style>
