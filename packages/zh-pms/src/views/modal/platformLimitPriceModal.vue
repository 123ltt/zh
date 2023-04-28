<template>
  <el-form ref="formRef"
           v-loading="loading"
           :model="form"
           :rules="rules"
           size="mini"
           label-width="100px"
           @submit.native.prevent="onSubmit"
  >
    <el-form-item label="SKU" prop="productSkus">
      <el-input v-if="isEdit" :value="form.productSkus" type="text" disabled />
      <g-multiple-input v-else v-model="form.productSkus" placeholder="请输入SKU，多个使用空格或换行隔开" />
    </el-form-item>
    <el-form-item label="平台" prop="platformCodes">
      <el-select v-model="form.platformCodes"
                 clearable
                 filterable
                 :multiple="!isEdit"
                 :disabled="isEdit"
                 placeholder="请选择平台"
                 class="w-100"
      >
        <el-option v-for="item in platformList" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
    </el-form-item>
    <el-form-item label="最低销售价" prop="lowestSellingPrice">
      <el-input v-model="form.lowestSellingPrice" v-input.number placeholder="请输入最低销售价">
        <span slot="suffix" style="color:#000;">USD</span>
      </el-input>
    </el-form-item>
    <el-row class="text-end">
      <el-button type="primary" native-type="submit" size="mini">确认</el-button>
      <el-button size="mini" @click="close(false)">取消</el-button>
    </el-row>
  </el-form>
</template>

<script>
import { add, update } from '@/api/platformLimitPrice.js'
import { required } from '@/util/formRules'

export default {
  name: 'PlatformLimitPriceModal',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: Object,
    platformList: Array
  },
  data() {
    const { productSku = '', lowestSellingPrice = '', platformCode = [] } = this.formData
    return {
      form: {
        productSkus: productSku,
        platformCodes: platformCode,
        lowestSellingPrice
      },
      rules: {
        productSkus: required(),
        platformCodes: required(),
        lowestSellingPrice: required()
      },
      loading: false
    }
  },
  methods: {
    onSubmit() {
      if (this.loading) return
      this.$refs.formRef.validate(bool => {
        if (!bool) return
        this.loading = true
        const apiFn = this.isEdit ? update : add
        const { productSkus, platformCodes, lowestSellingPrice } = this.form
        const form = {
          productSkus: this.isEdit ? [productSkus] : productSkus,
          platformCodes: this.isEdit ? [platformCodes] : platformCodes,
          lowestSellingPrice
        }
        apiFn(form).then(res => {
          this.$message.success(res.msg)
          this.close(true)
        }).finally(() => (this.loading = false))
      })
    },
    close(bool = false) {
      this.$parent.$emit('close', bool)
    }
  }
}
</script>
