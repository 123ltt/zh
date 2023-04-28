<template>
  <cols-form ref="formRef" :form-item="formItem" :form-info="formInfo" :form-handler-pre="formHandlerPre" :cols="1" message-style>
    <el-form-item slot="Charge"
                  :label="resonType"
                  prop="adjustAmount"
                  :rules="[{ validator: validateUnpay, trigger: ['change','blur'] },{ required: true, message: '请输入选择差异原因', trigger: ['change','blur'] }]"
    >
      <el-input v-model="formInfo.adjustAmount" disabled class="input-small">
        <span slot="suffix">{{ showCurrency }}</span>
      </el-input>
    </el-form-item>
  </cols-form>
</template>
<script>
import { getBillDiffCause, manualAdjust } from '@/api/common'
import { sub, add } from '../../../utils/calculate'
import colsForm from '@/views/components/colsForm'
export default {
  name: 'BillAdjust',
  components: { colsForm }, // 调整账单
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {

      showCurrency: this.row.omsCurrency,
      resonType: '调整OMS退款',
      formItem: [
        {
          type: 'input',
          label: '账单币种',
          prop: 'billCurrency',
          disabled: true

        },
        {
          type: 'input',
          label: '平台订单额',
          prop: 'platformOrderAmount',
          disabled: true

        },
        {
          type: 'input',
          label: '平台退款',
          prop: 'platformRefund',

          disabled: true

        },
        {
          type: 'input',
          label: 'OMS币种',
          prop: 'omsCurrency',

          disabled: true

        },

        {
          type: 'input',
          label: 'OMS订单额',
          prop: 'omsOrderAmount',
          disabled: true

        },
        {
          type: 'input',
          label: '退款币种',
          prop: 'omsRefundCurrency',
          disabled: true

        },
        {
          type: 'input',
          label: 'OMS退款',
          prop: 'omsRefund',
          disabled: true

        },
        {
          type: 'select',
          label: '差异原因',
          prop: 'diffCause',
          options: [],
          events: { change: this.changeResonType },
          required: true,
          filterable: false
        },
        {
          type: 'slot',
          slotName: 'Charge'

        },
        {
          type: 'textarea',
          label: '备注',
          prop: 'remark'

        }
      ],
      formInfo: {
        diffCause: '',
        adjustAmount: '',
        platformOrderAmount: '',
        platformRefund: '',
        remark: ''
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
    this.getData()
    this.init()
  },
  methods: {
    validateUnpay(rule, value, callback) {
      if (value !== 0 && this.formInfo.diffCause === 5) {
        callback(new Error('平台订单额+平台退款≠0,请选择其他差异原因'))
      } else {
        callback()
      }
    },
    getData() {
      getBillDiffCause().then(res => {
        this.formItem[7].options = res.data
      })
    },
    changeResonType(val) {
      val || (val = 3)
      this.$refs.formRef.colsForm.clearValidate('adjustAmount')
      this.resonType = this.formItem[7].options.find(item => item.key === val)?.other
      const { platformOrderAmount = 0, platformRefund = 0, omsOrderAmount = 0 } = this.formInfo
      this.showCurrency = this.formInfo.omsCurrency
      switch (val) {
        case 3:
          this.formInfo.adjustAmount = sub(add(platformOrderAmount, platformRefund), omsOrderAmount)
          break
        case 5:
          this.formInfo.adjustAmount = add(platformOrderAmount, platformRefund)
          break
        case 6:
          this.formInfo.adjustAmount = add(platformOrderAmount, platformRefund)
          this.showCurrency = this.formInfo.billCurrency
          break
        default:
          this.formInfo.adjustAmount = add(platformOrderAmount, platformRefund)
      }
    },
    saveBill() {
      this.$refs.formRef.colsForm.validate(val => {
        if (val) {
          manualAdjust(this.formInfo).then(res => {
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
      for (const i in this.row) {
        if (this.row[i] === '--') {
          this.row[i] = 0
        }
      }
      Object.assign(this.formInfo, this.row)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-small{
   width: 245px ;
 }
</style>
