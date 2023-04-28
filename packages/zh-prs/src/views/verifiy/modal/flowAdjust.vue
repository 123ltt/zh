<template>
  <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler-pre="formHandlerPre" :cols="1" message-style>
    <el-form-item slot="Charge"
                  :label="resonType"
                  prop="diffCauseAmount"
                  :rules="{
                    required: true ,message: '请输入' ,trigger: 'blur'
                  } "
    >

      <el-input v-model="formInfo.diffCauseAmount" class="input-small" disabled>
        <span slot="suffix">{{ showCurrency }}</span>
      </el-input>
    </el-form-item>
  </cols-form>
</template>
<script>
import { flowAdjust, getFlowVerifyDiffCause } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import { sub } from '../../../utils/calculate'

export default {
  name: 'FlowAdjust', // 调整流水
  components: { colsForm },
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showCurrency: this.row.flowCurrency,
      resonType: '调整账单放款',
      formItem: [
        {
          type: 'input',
          label: '账单币种',
          prop: 'billCurrency',
          placeholder: '--',
          disabled: true

        },
        {
          type: 'input',
          label: '账单放款',
          prop: 'billAmount',
          placeholder: '--',

          disabled: true

        },

        {
          type: 'input',
          label: '流水币种',
          prop: 'flowCurrency',
          options: [],
          placeholder: '--',

          disabled: true

        },
        {
          type: 'input',
          label: '到账流水',
          prop: 'flowReceived',
          placeholder: '--',

          disabled: true

        },
        {
          type: 'select',
          label: '差异原因',
          prop: 'diffCause',
          required: true,
          options: [],
          events: { change: this.changeResonType }

        },
        { type: 'slot', slotName: 'Charge' },
        {
          type: 'textarea',
          label: '备注',
          prop: 'remark'

        }
      ],
      formInfo: {
        diffCauseAmount: '',
        diffCause: '',
        remark: '',
        flowReceived: '',
        billAmount: ''

      },
      formHandlerPre: [
        {
          label: '保存',
          handler: () => {
            this.saveBill()
          }
        },
        {
          label: '取消',
          handler: () => {
            this.concel()
          }
        }
      ]
    }
  },

  created() {
    this.init()
  },

  methods: {
    changeResonType(val) {
      val || (val = 1)
      this.resonType = this.formItem[4].options.find(item => item.key === val)?.other
      const { flowReceived = 0, billAmount = 0 } = this.formInfo
      if (val === 1) {
        this.showCurrency = this.formInfo.billCurrency
        this.formInfo.diffCauseAmount = flowReceived
      } else {
        this.showCurrency = this.formInfo.flowCurrency
        this.formInfo.diffCauseAmount = sub(billAmount, flowReceived)
      }
    },
    saveBill() {
      this.$refs.formRef.colsForm.validate(val => {
        if (val) {
          flowAdjust(this.formInfo).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
          // 调保存接口
        }
      })
    },
    concel() {
      this.$parent.$emit('close')
    },
    init() {
      getFlowVerifyDiffCause().then(res => {
        this.formItem[4].options = res.data
      })
      if (this.row.remark === '--') {
        this.row.remark = ''
      }
      if (this.row.diffCause === '--') {
        this.row.diffCause = ''
      }
      Object.assign(this.formInfo, this.row)
      this.formInfo.diffCauseCurrency = this.formInfo.flowCurrency
    }
  }
}
</script>
<style lang="scss" scoped>
.input-small{
   width: 245px ;
 }
</style>
