<template>
  <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler-pre="formHandlerPre" :cols="1" message-style>

    <el-form-item slot="Charge"
                  label="合计账单放款"
                  prop="totalBillAmount"
    >

      <el-input v-model="formInfo.totalBillAmount" class="input-small">
        <span slot="suffix">{{ formInfo.totalBillCurrency }}</span>
      </el-input>
    </el-form-item>
  </cols-form>
</template>
<script>
import { getCarryOverBills, saveCarryOver } from '@/api/common'
import colsForm from '@/views/components/colsForm'
import { add } from '../../../utils/calculate'

export default {
  name: 'FlowAdjust', // 结转
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
          type: 'select',
          label: '结转账单ID',
          prop: 'billId2',
          optionValue: 'billId',
          optionLabel: 'billId', // 只展示billid
          options: [],
          events: { change: this.changeResonType },
          required: true
        },
        {
          type: 'input',
          label: '结转账单币种',
          prop: 'totalBillCurrency',
          placeholder: '--',
          disabled: true
        },
        {
          type: 'input',
          label: '结转账单放款', // 只是一个计算值,字段无意义
          prop: 'amount',
          placeholder: '--',
          disabled: true
        },
        { type: 'slot', slotName: 'Charge' },
        {
          type: 'textarea',
          label: '备注',
          prop: 'remark'

        }
      ],
      formInfo: {
        billCurrency: '',
        billAmount: '',
        remark: '',
        flowReceived: '',
        billId2: '',
        amount: '',
        totalBillAmount: '', // 合计账单放款
        totalBillCurrency: ''// 合计账单币种

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
      const obj = this.formItem[2].options.find(item => item.billId === val) || {}
      this.formInfo.amount = obj.billAmount
      this.formInfo.totalBillCurrency = obj.billCurrency
      this.formInfo.id2 = obj.id
      this.formInfo.totalBillAmount = val ? add(this.formInfo.billAmount, obj.billAmount) : null
      // this.formInfo.totalBillAmount = val ? (+this.formInfo.billAmount) + (+obj.billAmount) : null
    },
    saveBill() {
      this.$refs.formRef.colsForm.validate(val => {
        if (val) {
          const id1 = this.row.id
          const billId1 = this.row.billId
          saveCarryOver({ ...this.formInfo, id1, billId1 }).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    concel() {
      this.$parent.$emit('close')
    },
    init() {
      const { platformCode } = this.row
      this.formInfo.billCurrency = this.row.billCurrency
      this.formInfo.billAmount = this.row.billAmount
      getCarryOverBills({ platformCode }).then(res => {
        this.formItem[2].options = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.input-small{
   width: 245px ;
 }
</style>
