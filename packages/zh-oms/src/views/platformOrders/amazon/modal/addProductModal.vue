<template>
  <div>
    <el-form ref="form" label-width="85px" :model="formData" :rules="rules" size="mini">
      <el-form-item label="SKU编码" prop="sellerSku">
        <el-row>
          <el-col :span="16">
            <el-input v-model="formData.sellerSku" />
          </el-col>
          <el-col :span="7" class="ml-10">
            <el-button type="primary" size="mini" @click="serach">查询</el-button></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="PMSSKU编码" prop="pmsSku">
        <el-row>
          <el-col :span="16">
            <el-input v-model="formData.pmsSku" :disabled="true" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="牛蛙SKU编码" prop="nwSku">
        <el-row>
          <el-col :span="16">
            <el-input v-model="formData.nwSku" :disabled="true" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="SKU名称" prop="productName">
        <el-row>
          <el-col :span="16">
            <el-input v-model="formData.productName" :disabled="true" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="SKU前后缀" prop="skuAffix">
        <el-row>
          <el-col :span="16">
            <el-input v-model="formData.skuAffix" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="17">
          <el-form-item label="销售单价" prop="productSalePrice">
            <el-input v-model="formData.productSalePrice" oninput="value=value.replace(/[^0-9.]/g,'')" />
          </el-form-item>
        </el-col>
        <el-col :span="6" class="ml-10">
          <el-form-item label-width="0">
            <el-select v-model="formData.productSaleCurrency" placeholder="请选择售价单位" filterable clearable :disabled="disabled">
              <el-option v-for="(item,i) in currencyList" :key="i" :label="item.currency" :value="item.currency" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="销售数量" prop="productQuantity">
        <el-row>
          <el-col :span="16">
            <el-input v-model="formData.productQuantity" v-input.positive.!0 />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="end">
      <el-button size="mini" @click="cancle">取消</el-button>
      <el-button type="primary" size="mini" @click.stop="save">确认</el-button>
    </el-row>
  </div>
</template>

<script>
import { getSkuDetailByCode } from '@/api/platformOrder'
export default {
  props: {
    currencyList: Array,
    type: String,
    row: Object,
    index: Number,
    productSaleCurrency: String,
    len: Number
  },
  data() {
    const validateMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error('销售单价不能为空'))
      } else if (value.indexOf('.') !== -1 && value.split('.').length > 2) {
        callback(new Error('请输入正确格式的金额')) // 防止输入多个小数点
      } else if (value.indexOf('.') !== -1 && value.split('.')[1].length > 2) {
        callback(new Error('仅限保留两位小数'))
      } else {
        callback()
      }
    }
    return {
      value: '',
      formData: { sellerSku: '', skuAffix: '', productQuantity: '', productSalePrice: '', productSaleCurrency: '', productName: '', productSaleMoney: '' },
      rules: {
        productSalePrice: [{ required: true, validator: validateMoney, trigger: ['change', 'blur'] }],
        productQuantity: [{ required: true, message: '销售数量不能为空' }],
        productName: [{ required: true, message: 'SKU名称不能为空' }]
      },
      disabled: false
    }
  },
  computed: {
    productSaleMoney() {
      return this.Mul(this.formData.productQuantity, this.formData.productSalePrice)
    }
  },
  mounted() {
    if (this.productSaleCurrency) {
      this.formData.productSaleCurrency = this.productSaleCurrency
      if (!(this.len === 1 || 0)) {
        this.disabled = true
      }
    }
    this.row && (this.formData = Object.assign({}, this.row))
    this.formData.skuCost = this.formData.skuCost && Number(this.formData.skuCost).toFixed(2)
  },
  methods: {
    serach() {
      if (!this.formData.sellerSku) {
        this.$message.warning('请输入SKU编码')
        return false
      }
      getSkuDetailByCode({ skuCode: this.formData.sellerSku }).then(res => {
        this.formData = Object.assign(this.formData, res.data)
        this.formData.productImgUrl = res.data.productPicUrl
        this.formData.productName = res.data.productsName
      })
    },
    cancle() {
      this.colse()
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.formData.productSaleCurrency) {
            this.$message.warning('请选择售价单位')
            return false
          }
          this.formData.productSaleMoney = this.productSaleMoney
          if (this.type === 'edit') this.colse(this.formData, this.index)
          this.colse(this.formData)
        } else {
          return false
        }
      })
    },
    colse(data, index) {
      this.$parent.$emit('close', true, data, index)
    },
    // 乘法兼容
    Mul(arg1, arg2) {
      const r1 = arg1.toString()
      const r2 = arg2.toString()
      const d = arguments[2]
      const m = (r1.split('.')[1] ? r1.split('.')[1].length : 0) + (r2.split('.')[1] ? r2.split('.')[1].length : 0)
      const resultVal = Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, m)
      return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
    }
  }
}
</script>

<style lang="scss" scoped>
.ml-10{
  margin-left: 10px;
}
</style>
