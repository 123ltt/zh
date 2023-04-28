<template>
  <el-form ref="form"
           :model="form"
           :rules="rules"
           size="mini"
           :label-width="labelWidth"
           class="sp-form form-col"
  >
    <el-form-item label="详细描述" prop="detail">
      <!-- <el-input v-model="form.detail" disabled /> -->
      <detail ref="detail"
              :detail="form.detail"
              :base-product-info="baseProductInfo"
              :show-position-val="form.showPositionVal"
              :product-detail-template-show="productDetailTemplateShow"
              :detail-template-name.sync="form.detailTemplateName"
      />
    </el-form-item>
    <el-form-item label="库存扣减方式" prop="reduceStrategy">
      <el-radio-group v-model="form.reduceStrategy">
        <el-radio v-for="(k, v,index) in reduceStrategyList" :key="index" :label="v">{{ k }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="发货期" prop="deliveryTime">
      <el-input v-model="form.deliveryTime" v-input.positive.numeric class="w90" /> 天
    </el-form-item>
    <template>
      <el-form-item label="包装后重量" class="d-inline-block" prop="grossWeight">
        <el-input v-model="form.grossWeight" v-input.positive class="w90" /> 公斤/件
        <el-checkbox v-model="form.isPackSell" class="ms-3">自定义计重</el-checkbox>
      </el-form-item>
      <span v-if="form.isPackSell">
        买家购买 <el-form-item class="d-inline-block baseUnit" label-width="0" prop="baseUnit"><el-input v-model="form.baseUnit" v-input.positive.numeric class="w90" /></el-form-item> 件以内，按单件重计运费，
        在此基础上，买家每多买 <el-form-item class="d-inline-block" label-width="0" prop="addUnit"><el-input v-model="form.addUnit" v-input.positive.numeric class="w90" /></el-form-item>
        件，重量增加 <el-form-item class="d-inline-block" label-width="0" prop="addWeight"><el-input v-model="form.addWeight" v-input.positive class="w90" /></el-form-item> kg
      </span>
    </template>
    <div class="d-block">
      <el-form-item label="包装后的尺寸" class="d-inline-block" prop="packageLength">长 <el-input v-model="form.packageLength" v-input.positive class="w90 me-3" /></el-form-item>
      <el-form-item label-width="0" class="d-inline-block" prop="packageWidth">宽 <el-input v-model="form.packageWidth" v-input.positive class="w90 me-3" /></el-form-item>
      <el-form-item label-width="0" class="d-inline-block" prop="packageHeight">高 <el-input v-model="form.packageHeight" v-input.positive class="w90 me-3" /></el-form-item>
      单位：cm，每件{{ ((form.packageLength || 0) * (form.packageWidth || 0) * (form.packageHeight || 0)).toFixed(4) * 1 }}cm³
    </div>
    <el-form-item label="运费模板" prop="freightTemplateId">
      <el-select v-model="form.freightTemplateId" placeholder="请选择">
        <el-option v-for="item in freightTemplateList"
                   :key="item.id"
                   :label="item.templateName"
                   :value="item.templateId"
        />
      </el-select>
      <el-button type="primary" :disabled="Boolean(!baseProductInfo.account)" class="ms-3" @click="updateFreightTemp">更新运费模板</el-button>
    </el-form-item>
    <el-form-item label="服务模板" prop="promiseTemplateId">Service Template for New Sellers</el-form-item>
    <el-form-item label="产品信息模板" prop="productDetailTemplateId">
      <el-select v-model="form.detailTemplateName"
                 clearable
                 placeholder="请选择"
                 @change="productDetailTemplateChange"
                 @clear="(value) => {productDetailTemplateChange(value);form.showPositionVal = ''}"
      >
        <el-option v-for="item in productDetailTemplateList"
                   :key="item.value"
                   :label="item.value"
                   :value="item.value"
        />
      </el-select>
      <el-radio-group v-model="form.showPositionVal" class="ms-3">
        <el-radio v-for="(k, v,index) in showPosition" :key="index" :label="v">{{ k }}</el-radio>
      </el-radio-group>
      <el-link :underline="false" type="primary" class="ms-3" @click="goLink">查看所有产品信息模板</el-link>
    </el-form-item>
  </el-form>
</template>

<script>
import { getFreightTemp, updateFreightTemp, getProductTempList, productTempDetail, productDetailCustomTemplate } from '@/api/aliExpress/temp.js'
import productInfo from './../../aliExpressTemp/productInfo/_productInfo.vue'
import detail from './../components/detail/detail.vue'
import { deepClone } from '@/util/util'
export default {
  name: 'OtherInfo',
  components: { detail },
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
    isEdit: Boolean
  },
  data() {
    // 描述校验
    const detailValid = (rule, value, callback) => {
      this.getDetailContent()
      let detailHasVal = false
      if (this.form.detail.moduleList.length) {
        this.form.detail.moduleList.forEach(item => {
          if (item.type === 'text') {
            item.texts.filter(t => {
              if (t.content) {
                detailHasVal = true
              }
            })
          }
          if (item.type === 'html' && item.html.content) {
            detailHasVal = true
          }
          if (item.type === 'image') {
            item.images.filter(t => {
              if (t.url) {
                detailHasVal = true
              }
            })
          }
          if (item.type === 'text-image') {
            if (!item.texts.find(t => !t.content)) {
              detailHasVal = true
            }
          }
          if (item.type === 'productTempHtml' && item.html.content) {
            detailHasVal = true
          }
        })
      }
      if (detailHasVal) {
        callback()
      } else {
        callback(new Error('描述不能为空'))
      }
    }
    return {
      form: {
        detail: {
          version: '2.0.0',
          moduleList: []
        },
        reduceStrategy: 'place_order_withhold',
        deliveryTime: 4, // 发货期 发货期默认带出4天
        grossWeight: '', // 包装后重量
        baseUnit: '',
        addUnit: '',
        addWeight: '',
        packageLength: '',
        packageWidth: '',
        packageHeight: '',
        isPackSell: false,
        freightTemplateId: '', // 运费模板
        promiseTemplateId: 0, // 服务模板
        detailTemplateName: '', // 产品信息模板
        showPositionVal: ''
      },
      productDetailTemplateShow: { layoutColumn: '', layoutRow: '', list: [], type: '' }, // 所选产品模板显示
      rules: {
        detail: [{ required: true, validator: detailValid, trigger: 'change' }],
        reduceStrategy: [{ required: true, message: '库存扣减方式不能为空', trigger: 'change' }],
        promiseTemplateId: [{ required: true, message: '服务模板不能为空', trigger: 'blur' }],
        freightTemplateId: [{ required: true, message: '运费模板不能为空', trigger: 'change' }],
        grossWeight: [{ required: true, message: '包装后重量不能为空', trigger: 'blur' }],
        deliveryTime: [{ required: true, message: '发货期不能为空', trigger: 'blur' }],
        packageLength: [{ required: true, message: '长度不能为空', trigger: ['blur'] }],
        packageWidth: [{ required: true, message: '宽度不能为空', trigger: ['blur'] }],
        packageHeight: [{ required: true, message: '高度不能为空', trigger: ['blur'] }],
        addUnit: [{ required: true, message: '计重时每增加件数不能为空', trigger: 'blur' }],
        baseUnit: [{ required: true, message: '不增加运费件数不能为空', trigger: 'blur' }],
        addWeight: [{ required: true, message: '计重时对应增加的重量不能为空', trigger: 'blur' }]
      },
      reduceStrategyList: {
        place_order_withhold: '下单减库存',
        payment_success_deduct: '付款减库存'
      },
      freightTemplateList: [], // 运费模板
      productDetailTemplateList: [], // 产品信息模板
      showPosition: { // 产品信息模板显示位置
        showAbove: '显示上方',
        showBelow: '显示下方'
      }
    }
  },
  watch: {
    'baseProductInfo.productSpu'(old, yy) {
      const data = deepClone(this.baseProductInfo)
      Object.keys(this.form).forEach((key) => {
        if (key === 'detail' && !data[key]) {
          this.form[key] = { version: '2.0.0', moduleList: [] }
        } else if (key !== 'promiseTemplateId') {
          this.form[key] = data[key]
        }
        if (key === 'detailTemplateName' && data[key]) {
          this.form.showPositionVal = this.form.detail.moduleList[0].type === 'productTempHtml' ? 'showAbove' : 'showBelow'
          const s = Boolean(this.form.detail.moduleList.length === 1 && this.form.detail.moduleList[0].type === 'html')
          !s && this.productDetailTemplateChange(data[key], 'init')
        }
      })
    },
    'baseProductInfo.grossWeight'(val) {
      const { packageLength, packageWidth, packageHeight } = this.baseProductInfo
      this.form.grossWeight = val ? val * 1 : ''
      this.form.packageLength = packageLength ? packageLength * 1 : ''
      this.form.packageWidth = packageWidth ? packageWidth * 1 : ''
      this.form.packageHeight = packageHeight ? packageHeight * 1 : ''
    }
  },
  methods: {
    // 获取运费模板
    getFreightTemp(account, accountCode) {
      account && getFreightTemp({ size: 99999, account, accountCode }).then(res => {
        this.freightTemplateList = res.data.records
      })
    },
    updateFreightTemp() {
      const { account } = this.baseProductInfo
      account && updateFreightTemp({ account }).then(res => {
        this.$message.success('更新运费模板成功')
      })
    },
    // 获取产品信息模板
    getProductTempList(account) {
      account && getProductTempList({ account }).then(res => {
        const type = {
          1: '-平台',
          2: '-自定义'
        }
        this.productDetailTemplateList = res.data.map(item => {
          item.value = item.templateName + type[item.type]
          return item
        })
      })
    },
    // 获取描述组件内容
    getDetailContent() {
      this.form.detail.moduleList = this.$refs.detail.moduleList
    },
    // 选择产品模板逻辑处理
    productDetailTemplateChange(value, init) {
      if (!value) {
        this.productDetailTemplateShow = { layoutColumn: 4, layoutRow: 2, type: '', list: [], templateId: '' }
        return
      }
      if (!this.form.showPositionVal) { // 默认显示下方
        this.form.showPositionVal = 'showBelow'
      }
      this.productDetailTemplateList.find(item => {
        if (value === item.value) {
          item.type === 1 && this.getProductDetailTemp(item)
          item.type === 2 && this.getProductDetailCustomTemplate(item)
        }
      })
    },
    // 获取平台的产品信息模板详情
    getProductDetailTemp({ id, type, templateId }) {
      productTempDetail({ id }).then(res => {
        this.productDetailTemplateShow = { layoutColumn: 4, layoutRow: 2, type, list: res.data.moduleContents, templateId }
      })
    },
    // 获取自定义的产品信息模板详情
    getProductDetailCustomTemplate({ templateName, id, type, layoutColumn, layoutRow }) {
      productDetailCustomTemplate({ templateName, account: this.baseProductInfo.account }).then(res => {
        this.productDetailTemplateShow = { layoutColumn, layoutRow, type, list: res.data }
      })
    },
    goLink() {
      this.$newTab({
        path: '/lms/lmsAliExpress/aliExpressTemp/productInfo/productInfo',
        title: '产品信息模板',
        component: productInfo,
        clearCache: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.w90{
  width: 90px;
}
.baseUnit ::v-deep .el-form-item__error{
  width: 150px !important;
}
</style>
