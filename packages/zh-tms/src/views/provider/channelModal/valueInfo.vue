<template>
  <el-form ref="formRef" :rules="rules" size="mini" :model="valueInfo" label-width="100px" class="pe-4">
    <el-row>
      <el-col :span="4">
        <el-form-item>
          <el-checkbox v-model="valueInfo.insuranceService"
                       :true-label="1"
                       :false-label="2"
                       :disabled="isDetail"
          >保险</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col v-if="valueInfo.insuranceService===1" :span="8">
        <el-form-item prop="insurancePrice" label="最高赔付金额: ">
          <el-input v-model="valueInfo.insurancePrice"
                    v-input.number.positive
                    maxlength="13"
                    :disabled="isDetail"
                    @input="limitDecimal('insurancePrice')"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="valueInfo.insuranceService===1" :span="8">
        <el-form-item prop="insuranceCurrency">
          <el-select v-model="valueInfo.insuranceCurrency"
                     :disabled="isDetail"
                     clearable
                     placeholder="请选择"
                     filterable
          >
            <el-option v-for="item in insurCurrList"
                       :key="item.currCode"
                       :label="`${item.currCode} ( ${item.currName} )`"
                       :value="item.currCode"
            />
          </el-select>
        </el-form-item>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-form-item>
          <el-checkbox v-model="valueInfo.insuranceType"
                       :true-label="1"
                       :false-label="2"
                       :disabled="isDetail"
          >报价</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col v-if="valueInfo.insuranceType===1" :span="8">
        <el-form-item prop="insuranceRate" label="赔付比率: ">
          <el-input v-model="valueInfo.insuranceRate"
                    v-input.number.positive
                    clearable
                    :disabled="isDetail"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="!isDetail" :span="8">
        <el-form-item>
          <el-button size="mini" type="primary" @click="define()">确认</el-button>
        </el-form-item>
      </el-col>

    </el-row>

  </el-form>
</template>
<script>
import { getCurrencyList, logisticsChannel } from '@/api/common'
import { codSave, codDetail } from '@/api/channelInformation'
export default {
  props: {
    detailInfo: Object
  },
  inject: ['isDetail'],
  data() {
    return {
      rules: {
        insurancePrice: [{ required: true, message: '请输入最高赔付金额', trigger: 'change' }],
        insuranceCurrency: [{ required: true, message: '请选择保险币种', trigger: 'change' }],
        insuranceRate: [{ required: true, message: '请输入赔付比率', trigger: 'blur' }]
      },
      valueInfo: {
        insuranceService: 2,
        insurancePrice: '',
        insuranceCurrency: '',
        insuranceType: 2,
        insuranceRate: ''
      },
      insurCurrList: [],
      channelList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const channelCode = this.detailInfo.channelCode

      Promise.all([
        getCurrencyList(),
        logisticsChannel(),
        codDetail({ channelCode })
      ]).then(res => {
        this.insurCurrList = res[0].data
        this.channelList = res[1].data

        Object.assign(this.valueInfo, res[2].data)
        const { insurancePrice, insuranceRate } = this.valueInfo
        this.valueInfo.insurancePrice = insurancePrice !== null ? Number(Number(insurancePrice).toFixed(2)) : ''
        this.valueInfo.insuranceRate = insuranceRate !== null ? Number(Number(insuranceRate).toFixed(2)) : ''
      })
    },

    limitDecimal(prop) {
      const val = this.valueInfo[prop].replace(/[^(0-9|.)]+/, '')
      const newVal = val.match(/^\d+(\.?\d{0,3})/g)
      this.valueInfo[prop] = newVal ? newVal[0] : val
    },

    define() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.loading = true
          const channelCode = this.detailInfo.channelCode
          const params = JSON.parse(
            JSON.stringify(this.valueInfo,
              ['id',
                'insuranceService',
                'insurancePrice',
                'insuranceCurrency',
                'insuranceType',
                'insuranceRate'
              ])
          )
          if (params.insuranceService === 2) {
            params.insurancePrice = params.insuranceCurrency = ''
          }
          if (params.insuranceType === 2) {
            params.insuranceRate = ''
          }
          codSave(Object.assign(
            { channelCode }, params)
          ).finally(() => {
            this.loading = false
          }).then(res => {
            this.$message.success('操作成功！')
            codDetail({ channelCode }).then(res => {
              this.$nextTick(() => {
                Object.assign(this.valueInfo, res.data)
                const { insurancePrice, insuranceRate } = this.valueInfo
                this.valueInfo.insurancePrice = insurancePrice !== null ? Number(Number(insurancePrice).toFixed(2)) : ''
                this.valueInfo.insuranceRate = insuranceRate !== null ? Number(Number(insuranceRate).toFixed(2)) : ''
              })
            })
          })
        }
      })
    }
  }
}
</script>
