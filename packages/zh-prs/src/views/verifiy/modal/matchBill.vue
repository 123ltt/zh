<template>
  <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler-pre="formHandlerPre" :cols="1" message-style />
</template>
<script>
import colsForm from '@/views/components/colsForm'
import { flowConditionNames, getpayeeTypes, getMatchFlow, matchFlow } from '@/api/common'
export default {
  name: 'MatchBill', // 匹配流水
  components: { colsForm },
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
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
          type: 'gselect',
          label: '匹配收款方式',
          prop: 'payeeType',
          options: [],
          required: true
        },
        {
          type: 'gselect',
          label: '匹配收款账号',
          prop: 'payeeAccount',
          options: [],
          optionValue: 'value',
          required: true
        },

        {
          type: 'gselect',
          label: '交易流水号',
          prop: 'flowNumber',
          optionValue: 'value',
          options: [],
          required: true
        },
        {
          type: 'input',
          label: '流水币种',
          prop: 'flowCurrency',
          placeholder: '--',
          disabled: true
        },
        {
          type: 'input',
          label: '到账流水',
          prop: 'flowReceived',
          placeholder: '--',
          disabled: true

        }
      ],
      formInfo: {
        billCurrency: '',
        billAmount: '',
        payeeAccount: '',
        payeeType: '',
        flowReceived: '',
        flowCurrency: '',
        flowNumber: ''
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

  watch: {
    'formInfo.payeeType'(val) {
      this.reset()
      this.formInfo.payeeAccount = ''
      if (!val) {
        this.formItem[3].options = []
        return
      }
      flowConditionNames({ platformCode: this.formInfo.platformCode, payeeType: val }).then(res => {
        this.formItem[3].options = res.data.list[0].payeeAccounts
      })
    },
    'formInfo.payeeAccount'(val) {
      this.formInfo.flowNumber = ''
      this.reset()
      const { options = [] } = this.formItem[3]
      this.formItem[4].options = options.find(item => item.value === val)?.flowNumbers
    },
    'formInfo.flowNumber'(val) {
      this.reset()
      if (this.formInfo.payeeType && this.formInfo.payeeAccount && val) {
        getMatchFlow(Object.assign(this.formInfo)).then(res => {
          this.formInfo.flowCurrency = res.data[0].flowCurrency
          this.formInfo.flowReceived = res.data[0].flowReceived
        }

        )
      }
    }
  },
  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    reset() {
      this.formInfo.flowCurrency = ''
      this.formInfo.flowReceived = ''
    },
    saveBill() {
      this.$refs.formRef.colsForm.validate(val => {
        if (val) {
          matchFlow(this.formInfo).then(res => {
            this.$message.success(res.msg || '')
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    getData() {
      getpayeeTypes().then(res => {
        this.formItem[2].options = res.data
      })
    },
    concel() {
      this.$parent.$emit('close')
    },
    init() {
      this.formInfo.billCurrency = this.row.billCurrency
      this.formInfo.billAmount = this.row.billAmount
      this.formInfo.id = this.row.id
      this.formInfo.platformCode = this.row.platformCode
    }
  }
}
</script>

<style>

</style>
