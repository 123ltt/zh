<template>
  <cols-form message-style :form-item="formItem" :cols="1" :form-handler-pre="formHandlerPre" :form-info="formInfo" />
</template>

<script>
import { batchBillColse, batchVerifyOrder } from '@/api/common'

import colsForm from '@/views/components/colsForm'
export default {
  name: 'BatchOperation',
  components: { colsForm },
  props: {
    batchColse: {
      type: Boolean,
      default: true
    },
    ids: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      formInfo: {},
      formItem: [{ type: 'textarea', label: '备注', width: '300px', prop: 'remark', attrs: { rows: 7 } }
      ],
      formHandlerPre: [{
        label: '确定',
        handler: () => {
          this.defind()
        }
      }, {
        label: '取消',
        handler: () => {
          this.cancel()
        }
      }]
    }
  },
  methods: {
    defind() {
      (this.batchColse ? batchBillColse : batchVerifyOrder)({ ids: this.ids, remark: this.formInfo.remark }).then(res => {
        this.$message.success(res.msg)
        this.$parent.$emit('close', true)
      })
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }

}
</script>

<style>

</style>
