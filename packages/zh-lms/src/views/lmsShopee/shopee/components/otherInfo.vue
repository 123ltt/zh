<template>
  <el-form ref="form" :model="form" size="mini" :rules="rules" :label-width="labelWidth" class="shopee-other-info form-col">
    <el-form-item label="pre-order" prop="isPreOrder">
      <el-radio-group v-model="form.isPreOrder" @change="(val) => { if(!val) form.daysToShip = 2 }">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
      <span class="ms-5">当前店铺已刊登的预购产品个数为：{{ form.count }}</span>
    </el-form-item>
    <el-form-item label="发货期" prop="daysToShip">
      <el-input v-model="form.daysToShip" class="w90" :disabled="!form.isPreOrder" /> 天
    </el-form-item>
    <el-form-item label="包装后重量" prop="weight">
      <el-input v-model="form.weight" class="w90" /> 公斤/件
    </el-form-item>
    <div class="d-block">
      <el-form-item label="包装后的尺寸" class="d-inline-block" prop="packageLength">长 <el-input v-model="form.packageLength" v-input.positive.numeric class="w90 me-3" /></el-form-item>
      <el-form-item label-width="0" class="d-inline-block" prop="packageWidth">宽 <el-input v-model="form.packageWidth" v-input.positive.numeric class="w90 me-3" /></el-form-item>
      <el-form-item label-width="0" class="d-inline-block" prop="packageHeight">高 <el-input v-model="form.packageHeight" v-input.positive.numeric class="w90 me-3" /></el-form-item>
      单位：cm
    </div>
    <el-form-item label="运输方式" prop="logistics">
      <el-row>
        <el-col :span="6">
          <el-checkbox-group v-model="form.logistics">
            <el-checkbox v-for="item in shippingType" :key="item.logistic_id" :label="item.logistic_id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="8"><el-button size="mini" type="primary" class="ms-3" @click="logistic">同步后台物流</el-button></el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { shopeelogistic } from '@/api/shopee/shopee.js'
export default {
  name: 'OtherInfo',
  props: {
    baseProductInfo: Object,
    labelWidth: String
  },
  data() {
    const validateDays = (rule, value, callback) => {
      const reg = /^([5-9]|10)$/
      if (this.form.daysToShip && this.form.isPreOrder && !reg.test(this.form.daysToShip)) {
        callback(new Error('只能输入5-10之间的整数'))
      } else {
        callback()
      }
    }
    return {
      form: {
        isPreOrder: true,
        daysToShip: 5, // 发货期
        logistics: [],
        weight: '',
        packageLength: '',
        packageWidth: '',
        packageHeight: '',
        count: ''
      },
      rules: {
        weight: [{ required: true, message: '请输入包装后重量', trigger: 'blur' }],
        logistics: [{ required: true, message: '请选择运输方式', trigger: 'change' }],
        daysToShip: [{ required: false, validator: validateDays }]
      },
      shippingType: []
    }
  },
  watch: {
    'baseProductInfo.productSku'() {
      this.init()
    },
    'baseProductInfo.account': {
      handler() {
        if (!this.baseProductInfo.account) {
          return
        }
        shopeelogistic({ account: this.baseProductInfo.account }).then(res => {
          this.shippingType = res.data.map(item => {
            return {
              logistic_id: item.logisticId,
              name: item.logisticName
            }
          })
        })
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const { packWeight, weight, packageLength, packageHeight, packageWidth, sizeLongPack, sizeWidthPack, sizeHeightPack, logistics, isPreOrder } = deepClone(this.baseProductInfo)
      this.form.isPreOrder = isPreOrder
      this.form.packageLength = Number(sizeLongPack || packageLength || '')
      this.form.packageWidth = Number(sizeWidthPack || packageWidth || '')
      this.form.packageHeight = Number(sizeHeightPack || packageHeight || '')
      JSON.parse(logistics).forEach(item => {
        if (item?.logistic_id) this.form.logistics.push(item.logistic_id)
      })
      this.form.weight = packWeight || weight || ''
    },
    logistic() {
      shopeelogistic({ account: this.baseProductInfo.account }).then(res => {
        this.shippingType = res.data.map((item) => {
          return {
            name: item.logisticName,
            logistic_id: item.logisticId
          }
        })
        this.$message.success('已完成更新')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.shopee-other-info {
  width: 90%;
}
::v-deep .el-checkbox-group {
    border: 1px solid#dcdfe6;
    border-radius: 4px;
    padding-left: 8px;
    min-height: 35px;
  }
.w90 {
  width: 90px;
}
</style>
