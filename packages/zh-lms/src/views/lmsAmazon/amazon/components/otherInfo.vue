<template>
  <el-form ref="form"
           :model="form"
           :rules="rules"
           size="small"
           :label-width="labelWidth"
           class="sp-form  form-col"
  >
    <el-form-item label="物流" prop="logistics">
      <logisticsList v-loading="logisticsLoading" :logistics="logistics" />
    </el-form-item>
    <el-row class="w-90">
      <el-col :span="12">
        <el-form-item label="售价" prop="standardPrice">
          <el-input v-model="form.standardPrice" v-input.positive placeholder="售价" @input="() => {form.standardPrice = toFixed2(form.standardPrice)}" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="促销价" prop="salePrice">
          <el-input v-model="form.salePrice" v-input.positive placeholder="促销价" @input="() => {form.salePrice = toFixed2(form.salePrice)}" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="促销开始时间" prop="saleStartDate">
          <el-date-picker
            v-model="form.saleStartDate"
            type="datetime"
            placeholder="促销开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="g-w100"
            :picker-options="pickerOptions"
            @change="() => saleDateHandle(form.saleStartDate, 'saleStartDate', form)"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="促销结束时间" prop="saleEndDate">
          <el-date-picker
            v-model="form.saleEndDate"
            type="datetime"
            placeholder="促销结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="g-w100"
            :picker-options="pickerOptions"
            @change="() => saleDateHandle(form.saleEndDate, 'saleEndDate', form)"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="运费" prop="freight">
          <el-input v-model="form.freight" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="重量(g)" prop="weight">
          <el-input v-model="form.weight" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="成本" prop="costPrice">
          <el-input v-model="form.costPrice" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="刊登实际毛利率" prop="profitMargin">
          <el-input v-model="form.profitMargin" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="销售利润率" prop="grossProfit">
          <el-input v-model="form.grossProfit" v-input.positive @input="() => {form.grossProfit = toFixed2(form.grossProfit)}" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="图片" prop="mainImage">
      <imgShowList
        :img-show-list.sync="form.imgShowList"
        :main-image.sync="form.mainImage"
        :extra-imag-list.sync="form.extraImagList"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import logisticsList from './logisticsList.vue'
import { LIMIT } from '@/config/form'
import { toFixed2, saleDateHandle } from './addListing.handle.js'
import { getOptimize, getPrice, getGrossprofit } from '@/api/amazon/amazon.js'
import imgShowList from '@/views/components/picture/imgShowList.vue'
export default {
  name: 'OtherInfo',
  components: { imgShowList, logisticsList },
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
    // 是否禁用
    isEdit: Boolean
  },
  data() {
    // 选择图片验证
    const validateImgs = (rule, value, callback) => {
      if (this.form.mainImage && this.form.extraImagList.length && this.form.extraImagList.length <= this.extraImgNum) {
        callback()
      } else {
        callback(new Error('主图单选，副图最多选8张'))
      }
    }
    // 售价
    const valiStandardPrice = (rule, value, callback) => {
      if (!this.form.standardPrice || Number(this.form.standardPrice) === 0) {
        callback(new Error('售价不能小于0'))
      } else if (!this.logistics.length) {
        callback(new Error('没有物流信息'))
      } else if (this.form.costPrice && this.deductPrice && this.form.standardPrice) {
        let isSection = ''
        let profitMargin = ''
        const isHas = this.logistics.find(item => {
          // 是否当前项物流的金额区间
          isSection = +this.form.standardPrice >= +item.priceLow && +this.form.standardPrice <= +item.priceHigh
          // 总成本 = 运费 + 成本
          const totalCost = +item.cost + +this.form.costPrice
          // 实际毛利率 = 1 - 抵扣率 - 总成本 / 售价
          profitMargin = (1 - +this.deductPrice - totalCost / +this.form.standardPrice).toFixed(2) * 1
          // 判断当前售价在哪个物流的金额区间内就取哪个运费得出的毛利率要大于0
          if (isSection && +profitMargin > 0) {
            this.form.logisticsObj = item
            // 重量回显，后端要求重量放在物流字段里
            this.form.logisticsObj.weight = this.baseProductInfo.weight
            this.form.freight = item.cost
            this.form.profitMargin = profitMargin
            this.form.grossProfit = ''
            this.$refs.form.clearValidate('grossProfit')
            return item
          }
        })
        if (!isHas) {
          this.form.freight = ''
          this.form.profitMargin = ''
          if (profitMargin < 0) {
            callback(new Error(`实际刊登利润率(${profitMargin})不能亏本`))
          }
          if (!isSection) {
            callback(new Error('售价没有适合的物流金额区间'))
          }
          if ((+profitMargin + +this.deductPrice) >= 1) {
            callback(new Error(`实际刊登利润率+抵扣率(${this.deductPrice})不能大于1`))
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 销售利润率
    const valiGrossProfit = (rule, value, callback) => {
      if (this.form.grossProfit === '') {
        callback()
      } else if (+this.form.grossProfit === 0) {
        callback(new Error('销售利润率不能小于0'))
      } else if ((+this.form.grossProfit + +this.deductPrice) >= 1) {
        callback(new Error(`销售利润率+抵扣率(${this.deductPrice})不能大于1`))
      } else {
        if (this.upateGrossModifyPrice()) {
          this.form.profitMargin = this.form.grossProfit
          callback()
        } else {
          callback(new Error('利润率的售价没有适合的物流金额区间'))
        }
      }
    }
    // 促销价不能小于成本
    const validSalePrice = (rule, value, callback) => {
      if (value && Number(value) === 0) {
        callback(new Error('促销价不能小于0'))
      } else if (this.logistics.length && this.form.costPrice && this.deductPrice && value) {
        let isSection = ''
        let profitMargin = ''
        const isHas = this.logistics.find(item => {
          // 是否当前项物流的金额区间
          isSection = +value >= +item.priceLow && +value <= +item.priceHigh
          // 总成本 = 运费 + 成本
          const totalCost = +item.cost + +this.form.costPrice
          // 实际毛利率 = 1 - 抵扣率 - 总成本 / 售价
          profitMargin = (1 - +this.deductPrice - totalCost / +value).toFixed(2) * 1
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
          if ((+profitMargin + +this.deductPrice) >= 1) {
            callback(new Error(`促销利润率(${profitMargin})+抵扣率(${this.deductPrice})不能大于1`))
          }
        } else {
          callback()
        }
      } else {
        if (this.form.saleStartDate || this.form.saleEndDate) {
          callback(new Error('促销价不能为空'))
        } else {
          callback()
        }
      }
    }
    const validStartDate = (rule, value, callback) => {
      if (value && this.form.saleEndDate) {
        var start = new Date(value)
        var end = new Date(this.form.saleEndDate)
        if (end.getTime() < start.getTime()) {
          callback(new Error('促销开始时间不能大于促销结束时间'))
        } else if (end.getTime() === start.getTime()) {
          callback(new Error('促销开始时间不能等于促销结束时间'))
        } else {
          callback()
          this.$refs.form.clearValidate('saleEndDate')
        }
      } else {
        if (this.form.saleEndDate || this.form.salePrice) {
          callback(new Error('促销开始时间不能为空'))
        } else {
          callback()
        }
      }
    }
    const validEndDate = (rule, value, callback) => {
      if (value && this.form.saleStartDate) {
        var end = new Date(value)
        var start = new Date(this.form.saleStartDate)
        if (end.getTime() < start.getTime()) {
          callback(new Error('促销结束时间不能小于促销开始时间'))
        } else if (end.getTime() === start.getTime()) {
          callback(new Error('促销结束时间不能等于促销开始时间'))
        } else {
          callback()
          this.$refs.form.clearValidate('saleStartDate')
        }
      } else {
        if (this.form.saleStartDate || this.form.salePrice) {
          callback(new Error('促销结束时间不能为空'))
        } else {
          callback()
        }
      }
    }
    return {
      LIMIT,
      toFixed2,
      saleDateHandle,
      files: [],
      handlerLoading: false,
      showCheckIcon: false,
      isAutoCheck: false,
      showImgAddIcon: true,
      isRequiredImg: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
      // 副图最多可选张数
      extraImgNum: 8,
      form: {
        // 售价
        standardPrice: '',
        // 促销价
        salePrice: '',
        // 促销开始时间
        saleStartDate: '',
        // 促销结束时间
        saleEndDate: '',
        // 运费
        freight: '',
        // 重量(g)
        weight: '',
        // 成本
        costPrice: '',
        // 刊登实际毛利率
        profitMargin: '',
        // 销售利润率
        grossProfit: '',
        // 图片列表
        imgShowList: [],
        mainImage: '',
        extraImagList: [],
        // 计算符合的物流信息
        logisticsObj: null
      },
      // 抵扣项
      deductPrice: '',
      // 物流列表
      logistics: [],
      rules: {
        grossProfit: [{ validator: valiGrossProfit, trigger: 'blur' }],
        standardPrice: [{ required: true, validator: valiStandardPrice, trigger: 'blur' }],
        salePrice: [{ validator: validSalePrice, trigger: 'blur' }],
        saleStartDate: [{ validator: validStartDate, trigger: 'change' }],
        saleEndDate: [{ validator: validEndDate, trigger: 'change' }],
        mainImage: [{ required: true, validator: validateImgs }]
      },
      logisticsLoading: false
    }
  },
  watch: {
    'baseProductInfo'() {
      const { grossProfit, profitMargin, weight, productSku, standardPrice, costPrice, saleEndDate, saleStartDate, salePrice, mainImage, extraImagList, imgShowList, freight } = deepClone(this.baseProductInfo)
      this.form = Object.assign(this.form, {
        freight,
        grossProfit: grossProfit,
        profitMargin: profitMargin,
        weight, // 重量
        productSku,
        standardPrice,
        costPrice,
        saleEndDate,
        saleStartDate,
        salePrice,
        mainImage,
        extraImagList,
        imgShowList
      })
    }
  },
  methods: {
    // 修改利润算售价
    upateGrossModifyPrice(grossProfit) {
      if (grossProfit) {
        this.form.grossProfit = grossProfit
        this.form.profitMargin = grossProfit
      }
      if (!this.logistics.length) {
        return false
      }
      let standardPrice = ''
      let logisticsObj = ''
      const isHas = this.logistics.find(item => {
        // 总成本 = 运费 + 成本
        const totalCost = +item.cost + +this.form.costPrice
        // 售价 = (成本 +运费) / (1-抵扣率 - 利润率)
        standardPrice = (totalCost / (1 - +this.deductPrice - +this.form.grossProfit)).toFixed(2) * 1
        logisticsObj = item
        // 是否当前项物流的金额区间
        if (+standardPrice >= +item.priceLow && +standardPrice <= +item.priceHigh) {
          return item
        }
      })
      if (isHas) {
        this.form.logisticsObj = logisticsObj
        // 重量回显，后端要求重量放在物流字段里
        this.form.logisticsObj.weight = this.baseProductInfo.weight
        this.form.freight = logisticsObj.cost
        this.form.standardPrice = +standardPrice
        this.$refs.form.clearValidate('grossProfit')
      } else {
        this.form.freight = ''
        this.form.standardPrice = ''
      }
      return Boolean(isHas)
    },
    getOtherInfo(isEdit) {
      if (this.baseProductInfo.productSku) {
        this.getPrice().then(res => {
          this.getOptimize().then(res => {
            // 编辑初始化由售价推算出运费和实际刊登率
            if (isEdit) {
              this.$refs.form.validateField('standardPrice')
            }
          })
        })
      }
    },
    // 获取物流信息
    getOptimize() {
      return new Promise((resolve, reject) => {
        const { account, amazonSite, platformCode, productSku, accountCode } = this.baseProductInfo
        if (account && amazonSite && platformCode && productSku) {
          this.logisticsLoading = true
          this.$emit('productLoadingStart')
          getOptimize({
            storeName: account,
            storeCode: accountCode,
            countryCode: amazonSite === 'UK' ? 'GB' : amazonSite,
            platformCode,
            skus: [productSku],
            warehouse: 'Z20',
            type: 'SELF_BUILT'
          }).then(res => {
            // this.logistics = res.data || []
            this.logistics = [{ channelCode: 'F06-01', cost: '1', timeliness: '5', lightgoods: -1.0, priceLow: '55', priceHigh: '100' }, { channelCode: 'F06-03', cost: '32.5', timeliness: '3-18', lightgoods: 1.5, priceLow: '130', priceHigh: '800' }]
            // 更新物流运费取第一个物流
            if ((!this.isEdit) && !this.upateGrossModifyPrice()) {
              this.$refs.form.validateField('grossProfit')
            }
            resolve(res)
          }).finally(() => {
            this.logisticsLoading = false
            this.$emit('productLoadingEnd')
          })
        } else {
          this.logistics = []
        }
      })
    },
    // 查询成本价 返回sku的成本，抵扣率
    getPrice() {
      return new Promise((resolve, reject) => {
        const { productCost, productSku, accountCode, storeLevelId, siteId } = this.baseProductInfo
        if (!productCost || !productSku) return false
        this.$emit('productLoadingStart')
        getPrice({
          platformCode: 'AM',
          skuMap: { [productSku]: productCost },
          storeCode: accountCode,
          storeSite: siteId,
          storeLevel: storeLevelId
        }).then(res => {
          const data = res.data
          this.deductPrice = data[productSku].deductRate
          resolve(res)
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      })
    },
    // 在售编辑获取销售利润率
    getGrossprofit(data) {
      return new Promise((resolve, reject) => {
        this.$emit('productLoadingStart')
        getGrossprofit(data).then(res => {
          if (res.data) {
            const { grossProfit } = res.data
            this.form.grossProfit = grossProfit
            resolve(grossProfit)
          }
        }).finally(() => {
          this.$emit('productLoadingEnd')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.w-90{
  width: 90%;
}
.m-l-5{
  margin-left: 5px;
  margin-right: 20px;;
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
