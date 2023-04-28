<template>
  <div class="productInfo">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      size="mini"
      label-width="125px"
      class="form-col"
      :class="{'form-readonly':!isAllDisabled}"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" :disabled="!isAllDisabled" type="textarea" placeholder="请输入产品名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="平台参考链接" prop="platformLink">
            <el-input v-model="form.platformLink" :disabled="!isAllDisabled" type="text" placeholder="请输入平台参考链接" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="产品来源" prop="sourceType">
            <el-select v-model="form.sourceType" :disabled="!isAllDisabled" filterable clearable placeholder="请选择产品来源" style="width:100%;">
              <el-option v-for="item in sampleSpuCodeOptions" :key="item.value" :value="+item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="idCategory" label="类目">
            <CategoryCascader v-model="form.idCategory" :disabled="!isAllDisabled" :multiple="false" check-strictly width="100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="vendorCode" label="供应商编码">
            <el-input v-model="form.vendorCode" :disabled="!isUpdateVendorCode" placeholder="请输入供应商编码" style="width:100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="priceSupply" label="供货价格（RMB）">
            <el-input v-model="form.priceSupply" v-input.number.positive :disabled="!isAllDisabled" type="text" placeholder="请输入供货价格" style="width:100%;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="供应商链接" prop="vendorLink">
            <el-input v-model="form.vendorLink" :disabled="!isAllDisabled" type="text" placeholder="请输入供应商链接" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="产品重量（g）" prop="productWeight">
            <el-input v-model="form.productWeight" v-input.positive.numeric :disabled="!isAllDisabled" type="text" placeholder="请输入产品重量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="d-flex">
            <el-form-item label="尺寸（CM）" />
            <el-form-item label-width="40px" label="长" prop="sizeLong">
              <el-input v-model="form.sizeLong" v-input.number.positive :disabled="!isAllDisabled" type="text" placeholder="长" />
            </el-form-item>
            <el-form-item label-width="40px" label="宽" prop="sizeWidth">
              <el-input v-model="form.sizeWidth" v-input.number.positive :disabled="!isAllDisabled" type="text" placeholder="宽" />
            </el-form-item>
            <el-form-item label-width="40px" label="高" prop="sizeHeight">
              <el-input v-model="form.sizeHeight" v-input.number.positive :disabled="!isAllDisabled" type="text" placeholder="高" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="供应商产品编码" prop="vendorProductCode">
            <el-input v-model="form.vendorProductCode" :disabled="!isAllDisabled" type="text" placeholder="请输入供应商产品编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样品SPU编码" prop="sampleSpuCode">
            <el-input v-model="form.sampleSpuCode" :disabled="true" type="text" placeholder="需要采样时，系统自动生成" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="最小起订量" prop="minimumOrder">
            <el-input v-model="form.minimumOrder" v-input.positive.numeric :disabled="!isAllDisabled" type="text" placeholder="请输入最小起订量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交期（天）" prop="deliveryDay">
            <el-input v-model="form.deliveryDay" v-input.positive.numeric :disabled="!isAllDisabled" type="text" placeholder="请输入交期的天数" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开发模式" prop="devType">
            <el-radio v-model="form.devType" :disabled="!isAllDisabled" :label="1">精品</el-radio>
            <el-radio v-model="form.devType" :disabled="!isAllDisabled" :label="0">精铺</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否采样" prop="isSampling">
            <el-select v-model="form.isSampling" :disabled="!isAllDisabled" clearable placeholder="请选择是否采样" style="width:100%;">
              <el-option v-for="item in isSamplingOptions" :key="item.value" :value="+item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="描述信息" prop="comment">
            <el-input v-model="form.comment" :disabled="!isAllDisabled" :rows="3" :maxlength="LIMIT.content" type="textarea" resize="none" placeholder="描述信息" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isShowBtn">
        <el-col :span="24" class="text-end">
          <el-button type="primary" size="mini" @click="updateAudit">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { LIMIT } from '@/config/form'
import CategoryCascader from '@/components/category-cascader'
import { updateAudit } from '@/api/myAudit'
import { getDicts } from '@/api/common/dict'

export default {
  name: 'ProductInfo',
  components: { CategoryCascader },
  props: {
    id: String,
    isAudit: {
      type: Boolean,
      default: true
    },
    formData: Object
  },
  data() {
    return {
      LIMIT,
      sampleSpuCodeOptions: [],
      isSamplingOptions: [],
      supplierOptions: [],
      ifCanUpdate: false,
      ifPurchaseCanUpdateVendorCode: false,
      form: {
        productName: '', // 产品名称
        platformLink: '', // 平台参考链接
        sourceType: '', // 产品来源
        idCategory: [], // 类目
        vendorCode: '', // 供应商编码
        priceSupply: '', // 供货价格
        vendorLink: '', // 供应商链接
        productWeight: '', // 产品重量
        sizeLong: '', // 尺寸-长
        sizeWidth: '', // 尺寸-宽
        sizeHeight: '', // 尺寸-高
        vendorProductCode: '', // 供应商产品编码
        minimumOrder: '', // 最小起定量
        deliveryDay: '', // 交期
        devType: 0, // 开发模式
        isSampling: 0, // 是否采样
        comment: '', // 描述信息
        sampleSpuCode: ''// 样品SPU编码
      },
      rules: {
        productName: [{ required: true, message: '请输入产品名称', trigger: ['change', 'blur'] }],
        vendorName: [{ required: true, message: '请选择供应商名称', trigger: ['change', 'blur'] }],
        idCategory: [{ required: true, message: '请选择类目', trigger: ['change'] }],
        devType: [{ required: true, message: '请选择开发模式', trigger: ['change', 'blur'] }],
        isSampling: [{ required: true, message: '请选择是否采样', trigger: ['change', 'blur'] }]
      }
    }
  },
  computed: {
    isAllDisabled() {
      const { isAudit, ifCanUpdate } = this
      if (!isAudit) return false
      return ifCanUpdate
    },
    isUpdateVendorCode() {
      const { isAudit, ifPurchaseCanUpdateVendorCode } = this
      if (!isAudit) return false
      return ifPurchaseCanUpdateVendorCode
    },
    isShowBtn() {
      const { isAudit, ifCanUpdate, ifPurchaseCanUpdateVendorCode } = this
      if (!isAudit) return false
      return ifCanUpdate || ifPurchaseCanUpdateVendorCode
    }
  },
  watch: {
    'form.devType'(val) {
      if (val === 1) {
        this.$set(this.rules, 'minimumOrder', [{ required: true, message: '请输入最小起定量', trigger: ['change', 'blur'] }])
        this.$set(this.rules, 'deliveryDay', [{ required: true, message: '请输入交期天数', trigger: ['change', 'blur'] }])
      } else {
        this.$nextTick(() => { this.$refs.formRef.clearValidate(['minimumOrder', 'deliveryDay']) })
        this.$set(this.rules, 'minimumOrder', undefined)
        this.$set(this.rules, 'deliveryDay', undefined)
      }
    }
  },
  created() {
    // 产品来源, 是否采样
    getDicts(['sample_spu_code', 'is_sampling'], 'pms').then(mapping => {
      this.sampleSpuCodeOptions = mapping.sample_spu_code
      this.isSamplingOptions = mapping.is_sampling
    })

    const baseInfo = this.formData
    this.ifCanUpdate = baseInfo.ifCanUpdate
    this.ifPurchaseCanUpdateVendorCode = baseInfo.ifPurchaseCanUpdateVendorCode
    Object.keys(this.form).forEach(item => {
      if (baseInfo[item] !== undefined && baseInfo[item] !== null) {
        if (item !== 'idCategory') {
          this.form[item] = baseInfo[item]
        } else {
          this.form[item] = baseInfo.categoryPathIdList
        }
      }
    })
  },
  methods: {
    updateAudit() {
      this.$refs.formRef.validate((bool, obj) => {
        if (!bool) return
        const idCategory = this.form.idCategory.toString()
        updateAudit({ id: this.id, ...this.form, idCategory }).then(res => {
          const { code } = res
          code === 200 && this.$message.success('保存产品信息成功')
          this.$listeners.update(true)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
 .el-col {
    margin-bottom: 0;
  }
</style>
