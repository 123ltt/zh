<template>
  <div>
    <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :label-width="'86px'" :message-style="false" />
    <div class="btn">
      <el-button size="mini" type="primary" @click="submit">提交</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import { adjustBill } from '@/api/settlement'
export default {
  components: {
    colsForm
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formInfo: {},
      formItem: [
        { label: '物流商重量', type: 'input', prop: 'logisticWeight', required: true },
        { label: '我方重量', type: 'input', prop: 'ownWeight', required: true },
        { label: '物流商金额', type: 'input', prop: 'logisticAmount', required: true },
        { label: '我方金额', type: 'input', prop: 'ownAmount', required: true },
        { label: '重量差异', type: 'input', prop: 'weightDiff', required: true, disabled: true },
        { label: '金额差异', type: 'input', prop: 'amountDiff', required: true, disabled: true },
        { label: '备注', type: 'textarea', prop: 'remark' }
      ]
    }
  },
  computed: {
    weightDiff: function() {
      return (Number(this.formInfo.logisticWeight) - Number(this.formInfo.ownWeight)).toFixed(4)
    },
    amountDiff: function() {
      return (Number(this.formInfo.logisticAmount) - Number(this.formInfo.ownAmount)).toFixed(4)
    }
  },
  watch: {
    weightDiff(val) {
      this.formInfo.weightDiff = val
    },
    amountDiff(val) {
      this.formInfo.amountDiff = val
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    submit() {
      this.$refs.formRef.validate(adjustBill)
    },
    init() {
      for (var key in this.rowData) {
        if (!this.rowData[key]) {
          this.rowData[key] = 0
        }
      }
      this.formInfo = { ...this.rowData }
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }

}
</script>

<style lang="scss" scoped>
  .btn {
    text-align: center;
  }
</style>
