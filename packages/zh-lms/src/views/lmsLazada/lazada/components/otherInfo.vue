<template>
  <el-form ref="form" :model="form" size="mini" :rules="rules" :label-width="labelWidth" class="shopee-other-info form-col">
    <el-form-item label="What's in the box" prop="packageContent">
      <el-input v-model="form.packageContent" class="w-25" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="包装重量" prop="packageWeight">
      <el-input v-model="form.packageWeight" class="w90" @input="() => {form.packageWeight = toFixed2(form.packageWeight)}" /> 公斤/件
    </el-form-item>
    <div class="d-block">
      <el-form-item label="包装尺寸" class="d-inline-block" prop="packageLength">
        长 <el-input v-model="form.packageLength" class="w90 me-3" @input="() => {form.packageLength = toFixed2(form.packageLength)}" />
      </el-form-item>
      <el-form-item label-width="0" class="d-inline-block" prop="packageWidth">
        宽 <el-input v-model="form.packageWidth" class="w90 me-3" @input="() => {form.packageWidth = toFixed2(form.packageWidth)}" />
      </el-form-item>
      <el-form-item label-width="0" class="d-inline-block" prop="packageHeight">
        高 <el-input v-model="form.packageHeight" class="w90 me-3" @input="() => {form.packageHeight = toFixed2(form.packageHeight)}" />
      </el-form-item>
      单位：cm
    </div>
    <el-form-item label="发布到" prop="siteArr">
      <el-checkbox-group v-model="form.siteArr" :disabled="Boolean(baseProductInfo.itemId)">
        <el-checkbox v-for="(v, k) in siteList" :key="k" :label="k" @change="(value) => changeSite(k, value)">{{ v.siteName }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { toFixed2, siteList, fixed2 } from './addListing.handle.js'
export default {
  name: 'OtherInfo',
  props: {
    isEdit: Boolean,
    baseProductInfo: Object,
    productLoading: Number,
    labelWidth: String,
    isVariation: Boolean // 是否SPU
  },
  data() {
    const validateProfit = (rule, value, callback) => {
      if (value && value > 0) {
        callback()
      } else {
        callback(new Error('输入值需大于0'))
      }
    }
    const validateWeight = (rule, value, callback) => {
      if (value >= 0.02) {
        callback()
      } else {
        callback(new Error('包装重量不能小于0.02'))
      }
    }
    return {
      toFixed2,
      form: {
        packageContent: '', // 包装内容
        packageLength: '',
        packageWidth: '',
        packageHeight: '',
        packageWeight: '',
        siteArr: Object.keys(siteList)
      },
      rules: {
        packageWeight: [{ required: true, validator: validateWeight, trigger: 'blur' }],
        siteArr: [{ required: true, message: '请选择发布站点', trigger: 'change' }],
        packageLength: [{ required: true, validator: validateProfit, trigger: ['blur'] }],
        packageWidth: [{ required: true, validator: validateProfit, trigger: ['blur'] }],
        packageHeight: [{ required: true, validator: validateProfit, trigger: ['blur'] }]
      },
      siteList
    }
  },
  watch: {
    'baseProductInfo.productSku'(val) {
      this.$set(this.form, 'packageContent', '')
      if (this.isEdit) {
        const data = deepClone(this.baseProductInfo)
        Object.keys(this.form).forEach((key) => {
          this.form[key] = data[key]
        })
        const { packageWeight } = this.form
        this.unitWeight(packageWeight)
      } else if (!val) { // sku清空，重置其他信息
        this.form = {
          siteArr: Object.keys(siteList),
          packageContent: ''
        }
      } else {
        this.init()
      }
    }
  },
  methods: {
    init() {
      let obj = {}
      const { lstSku } = deepClone(this.baseProductInfo)
      if (this.isVariation && lstSku) {
        lstSku.sort((a, b) => {
          return a.packWeight - b.packWeight
        })
        obj = lstSku[lstSku.length - 1]
      } else {
        obj = deepClone(this.baseProductInfo)
      }
      const { packWeight, sizeLongPack, sizeWidthPack, sizeHeightPack } = obj
      this.unitWeight(packWeight)
      this.$set(this.form, 'packageLength', toFixed2(sizeLongPack))
      this.$set(this.form, 'packageWidth', toFixed2(sizeWidthPack))
      this.$set(this.form, 'packageHeight', toFixed2(sizeHeightPack))
    },
    changeSite(site, val) {
      // 重新按选择排列的顺序获取value， 因为算价格的时候是站点列表已选第一个站点去当sku的price
      const sites = []
      for (const p in this.siteList) {
        this.form.siteArr.includes(p) && sites.push(p)
      }
      this.form.siteArr = sites
      this.$emit('updateSite', sites, site, val)
    },
    unitWeight(packWeight) {
      const formatWeig = this.isEdit ? Number(packWeight).toFixed(2) : fixed2(packWeight)
      const weight = formatWeig < 0.02 ? 0.02 : formatWeig
      this.$set(this.form, 'packageWeight', weight)
    }
  }
}
</script>

<style lang="scss" scoped>
.shopee-other-info {
  width: 90%;
}
.w90 {
  width: 90px;
}
</style>
