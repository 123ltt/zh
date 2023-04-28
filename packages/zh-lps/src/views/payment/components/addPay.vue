<template>
  <div>
    <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :message-style="false" :input-width="'260px'" :label-width="'110px'" :inline-message="true">
      <el-form-item
        slot="others"
        class="double-input"
        label-width="110px"
        label="预付款核销"
      >
        <el-select v-model="formInfo.hex" style="width: 164px">
          <el-option label="111" value="111" />
        </el-select>
        <el-input v-model="formInfo.ccc" style="width: 96px" />
      </el-form-item>
    </cols-form>
    <div class="btn">
      <el-button size="mini" type="primary" @click="submit">提交</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
export default {
  components: {
    colsForm
  },
  data() {
    return {
      formInfo: {},
      settmentId: '',
      formItem: [
        {
          label: '物流商',
          type: 'gselect',
          prop: 'wls',
          required: true,
          options: []
        },
        {
          label: '收款单位',
          type: 'select',
          prop: '11',
          required: true,
          options: [{ dictKey: '11', dictValue: 22 }, { dictKey: '33', dictValue: 44 }]
        },
        { label: '收款类型', type: 'select', prop: '22' },
        { label: '收款账号', type: 'input', prop: '33', options: [] },
        { label: '开户行', type: 'input', prop: '66' },
        {
          label: '付款主体',
          type: 'select',
          prop: '77',
          required: true
        },
        {
          label: '结算币种',
          type: 'select',
          prop: '107',
          required: true
        },
        { label: '汇率', type: 'input', prop: '44' },
        {
          label: '本期应付金额',
          type: 'input',
          prop: '101',
          required: true
        },
        { slot: true },
        { label: '账期', type: 'datePicker', prop: '105' },
        { label: '实付总金额', type: 'input', prop: '109' },
        {
          label: '上传付款依据',
          type: 'uploadFile',
          prop: '110',
          required: true
        },
        { label: '备注', type: 'textarea', prop: '106', contentWidth: '650px' }
      ]
    }
  },
  methods: {
    submit() {
      this.$refs.formRef.validate(this.cancel)
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form--inline .el-form-item{
    margin-right: 0
  }
  .btn{
    text-align: right;
    padding: 5px 40px 0 0;
  }
</style>
