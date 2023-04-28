<template>
  <el-form ref="formRef"
           :model="form"
           :rules="rules"
           size="mini"
           :disabled="disabled"
           label-width="120px"
           :class="{'form-readonly':disabled}"
  >
    <el-row>
      <el-col :span="24">
        <el-form-item label="禁止上架">
          <forbidden-putaway :forbidden-list="formData.forbiddenPlatformCountryList" @select="onSelectForbidden" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="是否侵权" prop="isInfringe" :rules="[{ required: true,message:'是否侵权不能为空',trigger: 'blur'}]">
          <el-select v-model="form.isInfringe" placeholder="请选择" @change="isInfringeChange">
            <el-option v-for="item in isInfringeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="疑似侵权类型" :rules="[{ required: isInfringeType,message:'疑似侵权类型不能为空'}]" prop="infringementSuspectedType">
          <el-select v-model="form.infringementSuspectedType" :disabled="!isInfringeType">
            <el-option v-for="item in infringementSuspectedTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="侵权类型" prop="infringementType" :rules="[{ required: isInfringeType,message:'侵权类型不能为空'}]">
          <g-select v-model="form.infringementType"
                    :items="infringementList"
                    key-field="value"
                    label-field="label"
                    value-field="value"
                    :disabled="!isInfringeType"
                    :readonly="disabled"
                    multiple
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="侵权级别" prop="infringementLevel" :rules="[{ required: isInfringeType,message:'侵权级别不能为空'}]">
          <el-select v-model="form.infringementLevel" :disabled="!isInfringeType">
            <el-option v-for="item in infringementLevelList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="侵权对象" :rules="[{ required: isInfringeType,message:'侵权对象不能为空'}]" prop="infringeContent">
          <el-input v-model="form.infringeContent" :disabled="!isInfringeType" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="侵权原因" :rules="[{ required: isInfringeType,message:'侵权原因不能为空'}]" prop="infringementReason">
          <el-input v-model="form.infringementReason" :disabled="!isInfringeType" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    <display-field-group v-model="chekcedAttrList" :items="form.lstAttr" uid-field="fieldId" @change="fieldChange" />
    <el-row v-if="!disabled">
      <el-col :span="24" class="text-center">
        <el-button :loading="submitting" type="primary" size="small" @click="save">保存</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { safetyAuditInfoFields } from './fields'
import DisplayFieldGroup from '@/components/display-field-group/index.vue'
import { updateSafetyAudioInfo } from '@/api/info'
import infoMixin from './mixin'
import { getDicts } from '@/api/common/dict'
import ForbiddenPutaway from '../components/forbiddenPutaway.vue'

export default {
  components: { DisplayFieldGroup, ForbiddenPutaway },
  mixins: [infoMixin],
  props: {
    id: String,
    formData: Object,
    apiFn: Function,
    readonly: Boolean,
    isAudit: Boolean
  },
  data() {
    return {
      form: safetyAuditInfoFields(this.formData),
      chekcedAttrList: [],
      infringementList: [],
      infringementLevelList: [],
      isInfringeList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      infringementSuspectedTypeList: [],
      rules: { }
    }
  },
  computed: {
    disabled() {
      return this.readonly || this.formData.ifCanUpdate === false
    },
    isInfringeType() {
      return !!this.form.isInfringe
    }
  },
  created() {
    this.getdctData()
  },
  methods: {
    fieldChange(mapping) {
      this.form = Object.assign({}, this.form, mapping)
    },
    getdctData() {
      getDicts(['safe_infringement', 'safe_infringementlevel', 'safe_infringementsuspectedtype'], 'pms').then(res => {
        this.infringementList = res.safe_infringement
        this.infringementLevelList = res.safe_infringementlevel
        this.infringementSuspectedTypeList = res.safe_infringementsuspectedtype
      })
    },
    onSelectForbidden(data) {
      this.form.forbiddenPlatformCountryList = data
    },
    save() {
      this.$refs.formRef.validate().then(valid => {
        if (valid) {
          const params = this.pickFieldHandler(this.form, ['isInfringe', 'infringementLevel', 'infringementType', 'infringementReason', 'infringeContent', 'infringementSuspectedType', 'forbiddenPlatformCountryList'])
          params.infringementType = params.infringementType.join(',')
          params.lstAttr = this.chekcedAttrList
          params.id = this.formData.id
          if (this.apiFn) {
            if (this.submitting) return
            this.submitting = true
            this.apiFn(this.id, params).then(res => {
              this.$message.success(res.msg)
            }).finally(() => {
              this.submitting = false
            })
            return
          }
          this.submit(updateSafetyAudioInfo, params)
        }
      })
    },
    isInfringeChange() {
      this.$nextTick(() => {
        this.form.infringementSuspectedType = ''
        this.form.infringementType = []
        this.form.infringementLevel = ''
        this.form.infringeContent = ''
        this.form.infringementReason = ''
      })
      this.$refs.formRef.clearValidate()
    }
  }
}
</script>
