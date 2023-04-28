// 物流信息
<template>
  <el-form ref="formRef"
           :model="form"
           :rules="rules"
           :disabled="disabled"
           size="mini"
           label-width="140px"
           :class="{'form-readonly':disabled}"
           @submit.native.prevent
  >
    <div class="info-div">
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品重量（g）" prop="netWeight">
            <el-input v-model="form.netWeight" v-input.numeric.positive.!0 placeholder="产品重量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="d-flex">
            <el-form-item label="尺寸(CM)" />
            <el-form-item label="长" label-width="40px" prop="sizeLong">
              <el-input v-model="form.sizeLong" v-input.number.positive.!0 size="mini" type="text" placeholder="长" />
            </el-form-item>
            <el-form-item label="宽" label-width="40px" prop="sizeWidth">
              <el-input v-model="form.sizeWidth" v-input.number.positive.!0 size="mini" type="text" placeholder="宽" />
            </el-form-item>
            <el-form-item label="高" label-width="40px" prop="sizeHeight">
              <el-input v-model="form.sizeHeight" v-input.number.positive.!0 size="mini" type="text" placeholder="高" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="打包重量（g）" prop="packWeight">
            <el-input v-model="form.packWeight" v-input.numeric.positive.!0 type="text" placeholder="打包重量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="d-flex">
            <el-form-item label="包装尺寸(CM)" />
            <el-form-item label="长" label-width="40px" prop="sizeLongPack">
              <el-input v-model="form.sizeLongPack" v-input.number.positive.!0 size="mini" type="text" placeholder="长" />
            </el-form-item>
            <el-form-item label="宽" label-width="40px" prop="sizeWidthPack">
              <el-input v-model="form.sizeWidthPack" v-input.number.positive.!0 size="mini" type="text" placeholder="宽" />
            </el-form-item>
            <el-form-item label="高" label-width="40px" prop="sizeHeightPack">
              <el-input v-model="form.sizeHeightPack" v-input.number.positive.!0 size="mini" type="text" placeholder="高" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申报重量（g）" prop="customsWeight">
            <el-input v-model="form.customsWeight" v-input.numeric.positive.!0 type="text" placeholder="申报重量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="海关编码">
            <el-input v-model="form.customsCode" type="text" placeholder="海关编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申报价格（USD）" prop="customsPrice">
            <el-input v-model="form.customsPrice" v-input.number.positive type="text" placeholder="申报价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包材类型" prop="packagingType">
            <el-select v-model="form.packagingType" class="w-100">
              <el-option v-for="item in packingMaterialList" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="申报中文名称" prop="customsNameCn">
            <el-input v-model="form.customsNameCn" type="text" placeholder="申报中文名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="申报英文名称" prop="customsNameEn">
            <el-input v-model="form.customsNameEn" type="text" placeholder="申报英文名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物流分类" prop="logisticsAttrIds">
            <g-cascader v-model="form.logisticsAttrIds"
                        :options="logisticsCateList"
                        :props="cascaderProps"
                        collapse-tags
                        is-leaf
                        class="w-100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体积重（g）" prop="volumeWeight">
            <el-input v-model="form.volumeWeight" v-input.numeric.positive.!0 type="text" placeholder="体积重" />
          </el-form-item>
        </el-col>
      </el-row>
      <display-field-group v-model="chekcedAttrList" :items="form.lstAttr" uid-field="fieldId" @change="fieldChange" />
    </div>
    <el-row v-if="!disabled">
      <el-col :span="24" class="text-center">
        <el-button :loading="submitting" type="primary" size="small" @click="save">保存</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { required } from '@/util/formRules'
import { updateLogisticsInfo, getPackingMaterialTypeList, getLogisticsList } from '@/api/info'
import { logisticsInfoFields } from './fields'
import infoMixin from './mixin'
import DisplayFieldGroup from '@/components/display-field-group/index.vue'

export default {
  name: 'SpuLogistics',
  components: { DisplayFieldGroup },
  mixins: [infoMixin],
  props: {
    formData: Object,
    isEdit: Boolean,
    readonly: Boolean,
    isAudit: Boolean
  },
  data() {
    const requiredRule = required()
    const sizeRuels = ['Width', 'Height', 'Long'].reduce((prevVal, item) => {
      prevVal[`size${item}`] = requiredRule
      prevVal[`size${item}Pack`] = requiredRule
      return prevVal
    }, {})
    return {
      form: logisticsInfoFields(this.formData),
      submitting: false,
      rules: {
        netWeight: requiredRule,
        packWeight: requiredRule,
        customsWeight: requiredRule,
        customsPrice: requiredRule,
        customsNameCn: requiredRule,
        customsNameEn: requiredRule,
        volumeWeight: requiredRule,
        logisticsAttrIds: requiredRule,
        ...sizeRuels
      },
      chekcedAttrList: [],
      packingMaterialList: [],
      logisticsAttrList: [],
      logisticsCateList: [] // 所有物流属性
    }
  },
  computed: {
    disabled() {
      return this.readonly || this.formData.ifCanUpdate === false
    },
    cascaderProps() {
      return {
        multiple: true,
        label: 'name',
        value: 'id',
        leaf: 'isLeaf',
        emitPath: false
      }
    }
  },
  created() {
    getPackingMaterialTypeList().then(res => {
      this.packingMaterialList = res.data
    })
    getLogisticsList().then(res => {
      this.logisticsCateList = res.data
    })
  },
  methods: {
    async save() {
      if (await this.validate()) {
        const params = this.filterFieldHandler(this.form)
        params.lstAttr = this.chekcedAttrList
        this.submit(updateLogisticsInfo, params)
      }
    },
    fieldChange(mapping) {
      this.form = Object.assign({}, this.form, mapping)
    },
    test(val) {
      return val.replace(/[^a-z]/g, '')
    }
  }
}
</script>
