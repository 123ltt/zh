<template>
  <el-form ref="formRef" :rules="rules" :inline="inline" :label-width="labelWidth" :model="formInfo" :size="size" class="form-col" :inline-message="inlineMessagage" :class="{'no-message': messageStyle}">
    <el-form-item
      v-for="item in formItem"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :style="{width:item.width}"
    >
      <!-- label为下拉框时显示 -->
      <el-select v-if="item.labelSlot" slot="label" v-model="formInfo[item.labelProp]" :style="{'width': labelWidth}" :placeholder="item.labelPlaceholder" clearable style="width: 120px">
        <el-option v-for="selectItem in item.labelOptions" :key="selectItem.key" :value="selectItem.value" />
      </el-select>

      <slot v-if="item.slot" name="others" />
      <el-input v-if="item.type==='input'" v-model="formInfo[item.prop]" :disabled="item.disabled" :placeholder="item.placeholder||`请输入${item.label}`" :style="{width:inputWidth}" clearable />
      <el-input
        v-if="item.type === 'textarea'"
        v-model.trim="formInfo[item.prop]"
        type="textarea"
        :style="{width:item.contentWidth||inputWidth}"
        :disabled="item.disabled"
        v-bind="item.attrs"
        :autosize="{ minRows: 2, maxRows: 2}"
        :placeholder="item.placeholder||`请输入${item.label}`"
        v-on="item.events"
      />
      <el-select
        v-if="item.type==='select'"
        v-model="formInfo[item.prop]"
        :style="{width:inputWidth}"
        :disabled="item.disabled"
        clearable
        :placeholder="item.placeholder||`请选择${item.label}`"
      >
        <el-option v-for="selectItem in item.options" :key="selectItem.dictKey||selectItem" :label="selectItem.dictValue||selectItem" :value="selectItem.dictKey||selectItem" />
      </el-select>
      <g-select
        v-if="item.type==='gselect'"
        v-model="formInfo[item.prop]"
        clearable
        :disabled="item.disabled"
        :style="{width:inputWidth}"
        :items="item.options"
        :key-field="item.optionValue||'key'"
        :value-field="item.optionValue||'key'"
        :label-field="item.optionLabel||'value'"
        :placeholder="item.placeholder||`请选择${item.label}`"
      />
      <el-date-picker
        v-if="item.type==='datePicker'"
        v-model="formInfo[item.prop]"
        :disabled="item.disabled"
        :type="item.dateType||'daterange'"
        :style="{width: inputWidth}"
        :value-format="item.valueFormat||'yyyy-MM-dd HH:mm:ss'"
        range-separator="至"
        :start-placeholder="'开始日期'"
        :end-placeholder="'结束日期'"
        v-bind="item.attrs"
        v-on="item.events"
      />
      <upload-file
        v-if="item.type==='uploadFile'"
        :style="{width: inputWidth} "
        button-text="选择文件"
        :files.sync="formInfo[item.prop]"
        mimetype=".png,.jpg,.csv,.zip,.doc,.docx,.pdf,.txt,.xls,.xlsx,"
        :limit="1"
        :uploading.sync="uploading"
        :http-request="httpRequest"
      />
    </el-form-item>
    <slot name="handleBtn" />
  </el-form>
</template>

<script>
import { UploadFile } from 'global-components'
import upload from '@/api/common/upload'
export default {
  name: 'ColsForm',
  provide: {
    colsForm: this
  },
  components: {
    UploadFile
  },
  props: {
    inline: {
      type: Boolean,
      default: true
    },
    inlineMessagage: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'mini'
    },
    inputWidth: {
      type: String,
      default: '200px'
    },
    messageStyle: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    formItem: {
      type: Array,
      default: () => []
    },
    formInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      files: [],
      httpRequest: upload,
      // rules: [],
      uploading: false
    }
  },
  computed: {
    rules: function() {
      const ruleObj = {}
      this.formItem.filter(item => {
        return item.required
      }).forEach((ele) => {
        const ruleTemplate = { required: true, message: '请输入', trigger: 'blur' }
        ruleObj[ele.prop] = []
        if (ele.type === 'input' || ele.type === 'textarea') {
          ruleTemplate.message = `请输入${ele.label}`
          ruleTemplate.trigger = 'blur'
        } else if (ele.type === 'select' || ele.type === 'gselect') {
          ruleTemplate.message = `请选择${ele.label}`
          ruleTemplate.trigger = 'change'
        } else if (ele.type === 'uploadFile') {
          ruleTemplate.message = `请上传${ele.label}`
          ruleTemplate.trigger = 'change'
        }
        ruleObj[ele.prop][0] = ruleTemplate
      })
      return ruleObj
    }
  },
  methods: {
    validate(fn) {
      this.$refs.formRef.validate(val => {
        if (val) {
          fn && fn(this.formInfo).then(res => {
            this.$message.success(res.msg)
            this.$parent.$parent.$emit('close', true)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form--inline .el-form-item{
    margin-right: 18px;
  }
  .el-form-item__label{
    padding: 0 6px 0 0;
  }
  // ::v-deep .el-form-item__content .el-input--mini .el-input__inner{
  //   width: 245px;
  // }
  ::v-deep .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  ::v-deep.el-textarea__inner {
    padding: 0 15px;
  }
  ::v-deep .el-form-item__content{
    .el-form-item--mini.el-form-item{
        margin-bottom: 0px;
      }
  }
  ::v-deep .el-upload .el-button{
    height: 28px
  }

</style>
