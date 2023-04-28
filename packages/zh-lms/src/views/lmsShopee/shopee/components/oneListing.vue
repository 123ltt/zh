<template>
  <el-form ref="form" v-loading="loading" :model="form" size="mini" :label-width="labelWidth" class="w-90 form-col" :rules="rules">
    <el-row>
      <el-col :span="12">
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="" class="g-w100" @input="(val)=>getResult('price',val)" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" class="g-w100" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="利润率" prop="profitRate">
          <el-input v-model="form.profitRate" class="g-w100" @input="(val)=>getResult('profitRate',val)" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="成本" prop="costPrice">
          <el-input v-model="form.costPrice" class="g-w100" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="利润额" prop="profitPrice">
          <el-input v-model="form.profitPrice" class="g-w100" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品重量（KG）" prop="netWeight">
          <el-input v-model="form.netWeight" class="g-w100" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="运费" prop="shippingPrice">
          <el-input v-model="form.shippingPrice" class="g-w100" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="form.description" type="textarea" show-word-limit :autosize="{ minRows: 6, maxRows: 10}" class="g-w100" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { calculatePrice } from '@/api/shopee/shopee.js'
import { debounce } from '@/util/util'
export default {
  props: {
    baseProductInfo: Object,
    labelWidth: String
  },
  data() {
    return {
      form: {
        profitRate: '',
        costPrice: 0, // 成本
        description: '', // 商品描述
        price: '',
        profitPrice: '',
        shippingPrice: '',
        netWeight: '',
        stock: ''
      },
      rules: {
        price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '产品描述不能为空', trigger: 'blur' }]
      },
      loading: false
    }
  },
  watch: {
    'baseProductInfo.productSpu'() {
      this.init()
      this.form = this.baseProductInfo.oneListing || this.form
    }
  },
  methods: {
    init() {
      ['productCost', 'netWeight', 'descriptionPlain'].forEach(item => {
        this.form[item] = this.baseProductInfo[item]
      })
      this.form.stock = 100
    },
    setForm(key, val) {
      if (Array.isArray(key)) {
        key.forEach((item, index) => {
          this.form[item] = val[index]
        })
        return
      }
      this.form[key] = val
    },
    formatData(key) {
      this.loading = true
      const params = {
        platformCode: 'SP',
        siteCode: this.baseProductInfo.account.split('.')[1].toUpperCase(),
        storeCode: this.baseProductInfo.accountCode
      }
      const commonParams = {
        productSku: this.baseProductInfo.productSpu,
        productCost: Number(this.form.productCost) + Number(this.form.discountRatio)
      }
      if (key === 'profitRate') {
        params.priceDTOList = [
          {
            ...commonParams,
            saleProfitRate: this.form.profitRate
          }
        ]
      } else {
        params.priceRateDTOList = [
          {
            ...commonParams,
            price: this.form.price
          }
        ]
      }
      calculatePrice(params, key).then(res => {
        Object.entries(res.data).forEach(([key, val]) => {
          Object.entries(val).forEach(([nKey, nVal]) => {
            if (nKey === 'NoError') {
              ['price', 'profitPrice', 'profitRate', 'shippingPrice'].forEach(item => {
                this.form[item] = nVal[item]
              })
              this.baseProductInfo.checkMsg = false
            } else {
              this.$message.warning(nVal)
              this.baseProductInfo.checkMsg = nVal
            }
          })
        })
      }).finally(_ => {
        this.loading = false
      })
    },
    getResult: debounce(function(key, val) {
      if (!val.length) {
        return
      }
      this.formatData(key)
    }, 500)
  }
}
</script>

<style>

</style>
