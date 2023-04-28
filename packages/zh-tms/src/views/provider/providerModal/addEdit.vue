<template>
  <basic-container v-loading="loading" class="addEditLogistic">
    <el-form ref="rulesForm" :rules="rules" size="mini" :model="logisticInfo" label-width="120px" :class="direction?'verify':''">
      <!--审核页面 -->
      <template v-if="direction">
        <g-list-group v-for="(items,i) in detailRow1" :key="i" :cols="items.length" label-width="110px" label-align="center">
          <g-list-group-item v-for="(item,j) in items" :key="j" :label="item.label" :class="item.class?item.class:''">

            <g-text-ellipsis v-if="item.list">{{ mappingDictionary[item.prop] }}</g-text-ellipsis>
            <g-text-ellipsis v-else> {{ logisticInfo[item.prop] }}</g-text-ellipsis>

          </g-list-group-item>
        </g-list-group>
      </template>
      <!-- 新增编辑页面  -->
      <el-row v-for="(items,i) in detailRow1.slice(0,detailRow1.length-1)" v-else :key="i" :gutter="10">
        <el-col v-for="(item,j) in items" :key="j" :span="item.span?16:8">
          <!-- 有下拉列表 -->
          <el-form-item v-if="item.list" :prop="item.prop" :label="item.label" label-width="125px">

            <el-select v-model="logisticInfo[item.prop]" clearable placeholder="请选择" filterable>
              <el-option v-for="item1 in mappingDictionary[item.list]" :key="item1.dictKey" :label="item1.dictValue" :value="item1.dictKey" />
            </el-select>
          </el-form-item>

          <!-- 输入框 -->
          <el-form-item v-else :prop="item.prop" label-width="125px">
            <span slot="label"><span v-if="item.selectIcon === logisticInfo.bankType" class="text-danger">* </span>{{ item.label }} </span>
            <el-input v-model="logisticInfo[item.prop]" clearable maxlength="50" :class="item.span?'big':''" />
          </el-form-item>

        </el-col>
      </el-row>

      <el-row>
        <el-form-item v-if="!direction" label="备注: " prop="remarks">
          <el-input
            v-model="logisticInfo.remarks"
            :rows="2"
            type="textarea"
            clearable
            style="width:97%"
            maxlength="200"
            show-word-limit
            @input="limitSpaceOrGtLt"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="direction === 1" label="通过理由: " prop="approvalOpinion">
          <el-input
            v-model="logisticInfo.approvalOpinion"
            :rows="2"
            type="textarea"
            clearable
            style="width:97%"
            maxlength="200"
            show-word-limit
            @input="removeTrim"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="direction === 2 || logisticInfo.auditStatus === 2" label="驳回理由: " prop="rejectOpinion">
          <el-input
            v-model="logisticInfo.rejectOpinion"
            :rows="2"
            type="textarea"
            clearable
            style="width:97%"
            maxlength="200"
            show-word-limit
            :disabled="logisticInfo.auditStatus === 2"
            @input="removeTrim"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <div class="float-end me-3">
          <el-button size="mini" type="primary" @click="close()">取消</el-button>
          <el-button v-if="!direction" size="mini" class="ms-3" type="primary" @click="save()">保存</el-button>
          <el-button v-if="!direction" size="mini" class="ms-3" type="primary" @click="submit()">提交审核</el-button>
          <el-button v-if="direction === 1" size="mini" class="ms-3" type="primary" @click="auditBtn()">确认审核通过</el-button>
          <el-button v-if="direction === 2" size="mini" class="ms-3" type="primary" @click="rejectBtn()">确认驳回</el-button>
        </div>
      </el-row>
    </el-form>

  </basic-container>
</template>
<script>
import { dictionary } from '@/api/common'
import { save, update, submit, reject, audit } from '@/api/logisticsManagement'

export default {
  name: 'PlatformAddLimit',
  props: {
    isAdd: Boolean,
    detailInfo: [Object, String],
    direction: Number
  },
  data() {
    return {
      loading: false,
      logisticInfo: {
        lpAbbreviation: '', // 物流商简称
        lpFullname: '', // 物流商全称
        businessLicenseNo: '', // 营业执照编号
        paymentType: '', // 付款类型
        settlementPeriod: '', // 结算周期
        bankType: '', // 默认收银银行类型
        payeeCommon: '', // 收款单位（对公账号）
        accountNumberCommon: '', // 收款账号（对公账号）
        bankNameCommon: '', // 开户行（对公账号）
        payeePrivate: '', // 收款单位（对私账号）
        accountNumberPrivate: '', // 收款账号（对私账号）
        bankNamePrivate: '', // 开户行（对私账号）
        payeeCurrency: '', // 收款单位（外币账号）
        accountNumberCurrency: '', // 收款账号（外币账号）
        bankNameCurrency: '', // 开户行（外币账号）
        contactPerson: '', // 联系人
        contactPhone: '', // 联系方式
        remarks: '', // 备注
        isDeleted: 0,
        status: 1,
        approvalOpinion: '', // 通过理由
        rejectOpinion: '' // 反驳理由
      },
      // 映射字典、下拉数据，仅限展示
      mappingDictionary: {
        paymentType: '',
        settlementPeriod: '',
        bankType: '',
        paymentTypelist: '',
        periodlist: '',
        bankTypelist: ''
      },

      detailRow1: Object.freeze(
        [
          [
            { label: '物流商简称', prop: 'lpAbbreviation' },
            { label: '物流商全称', prop: 'lpFullname' },
            { label: '营业执照编号', prop: 'businessLicenseNo' }
          ],
          [
            { label: '付款类型', prop: 'paymentType', list: 'paymentTypelist' },
            { label: '结算周期', prop: 'settlementPeriod', list: 'periodlist' },
            { label: '默认收银银行类型', prop: 'bankType', list: 'bankTypelist' }
          ],
          [
            { label: '收款单位(对公账号)', prop: 'payeeCommon', selectIcon: '1' },
            { label: '收款账号(对公账号)', prop: 'accountNumberCommon', selectIcon: '1' },
            { label: '开户行(对公账号)', prop: 'bankNameCommon', selectIcon: '1' }
          ],
          [
            { label: '收款单位(对私账号)', prop: 'payeePrivate', selectIcon: '2' },
            { label: '收款账号(对私账号)', prop: 'accountNumberPrivate', selectIcon: '2' },
            { label: '开户行(对私账号)', prop: 'bankNamePrivate', selectIcon: '2' }
          ],
          [
            { label: '收款单位(外币账号)', prop: 'payeeCurrency', selectIcon: '3' },
            { label: '收款账号(外币账号)', prop: 'accountNumberCurrency', selectIcon: '3' },
            { label: '开户行(外币账号)', prop: 'bankNameCurrency', selectIcon: '3' }
          ],
          [
            { label: '联系人', prop: 'contactPerson', class: 'w-33' },
            { label: '联系方式', prop: 'contactPhone', span: 16 }
          ],
          [
            { label: '备注', prop: 'remarks' }
          ]
        ]
      ),

      rules: {
        lpAbbreviation: [{ required: !this.direction, message: '请输入物流商简称', trigger: 'blur' }],
        lpFullname: [{ required: !this.direction, message: '请输入物流商全称', trigger: 'blur' }],
        businessLicenseNo: [{ required: !this.direction, message: '请输入营业执照编号', trigger: 'blur' }],
        paymentType: [{ required: !this.direction, message: '请选择付款类型', trigger: 'change' }],
        settlementPeriod: [{ required: !this.direction, message: '请选择结算周期', trigger: 'change' }],
        bankType: [{ required: !this.direction, message: '请选择默认收银银行类型', trigger: 'change' }],
        rejectOpinion: [{ required: this.direction === 2, message: '请输入反驳意见', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getData()
  },

  methods: {
    // 获取数据
    getData() {
      // 付款类型字典
      Promise.all([
        dictionary('common_payment_type'),
        dictionary('common_settlement_period'),
        dictionary('common_bank_type')
      ]).then(res => {
        this.mappingDictionary.paymentTypelist = res[0].data
        this.mappingDictionary.periodlist = res[1].data
        this.mappingDictionary.bankTypelist = res[2].data

        this.init(res[0].data, res[1].data, res[2].data)
      })
    },

    init(...arr) {
      if (!this.isAdd) {
        ['paymentType',
          'bankType',
          'settlementPeriod'
        ].forEach(item => { this.detailInfo[item] += '' })
        Object.assign(this.logisticInfo, this.detailInfo)
      }
      if (this.direction && arr.length) {
        const detailRow = this.detailRow1[1]
        detailRow.forEach((item, index) => {
          arr[index].forEach(element => {
            if (element.dictKey === this.logisticInfo[item.prop]) {
              this.mappingDictionary[item.prop] = element.dictValue
            }
          })
        })
      }
    },

    close(val) {
      this.$parent.$emit('close', val)
    },

    save: function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid && !this.approved()) {
          if (this.logisticInfo.auditStatus === 2) this.logisticInfo.rejectOpinion = ''
          this.logisticInfo.auditStatus = 3

          this.loading = true
          const ct = this.isAdd ? save(this.logisticInfo) : update(this.logisticInfo)
          this.handlerResult(ct)
        }
      })
    },

    submit: function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid && !this.approved()) {
          if (this.logisticInfo.auditStatus === 2) this.logisticInfo.rejectOpinion = ''
          this.logisticInfo.auditStatus = 0
          this.loading = true
          this.handlerResult(submit(this.logisticInfo))
        }
      })
    },

    rejectBtn: function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.handlerResult(reject(this.logisticInfo))
        }
      })
    },

    auditBtn: function() {
      this.loading = true
      this.handlerResult(audit(this.logisticInfo))
    },
    // 限制输入空格以及<>
    limitSpaceOrGtLt(val) {
      const trimResult = val.trim()
      const result = trimResult.match(/[<>]/g)
      this.logisticInfo.remarks = result ? val.substring(0, val.length - 1) : trimResult
    },

    removeTrim(val) {
      return val.trim()
    },
    // 校验是否可提交
    approved() {
      const { bankType } = this.logisticInfo
      if (bankType === '1') {
        // 对公账号
        const { payeeCommon, accountNumberCommon, bankNameCommon } = this.logisticInfo
        if (!payeeCommon || !accountNumberCommon || !bankNameCommon) {
          return this.$message.error({ message: '请输入完整对公账号的内容!' })
        }
      }
      if (bankType === '2') {
        // 对私账号
        const { payeePrivate, accountNumberPrivate, bankNamePrivate } = this.logisticInfo
        if (!payeePrivate || !accountNumberPrivate || !bankNamePrivate) {
          return this.$message.error({ message: '请输入完整对私账号的内容!' })
        }
      }
      if (bankType === '3') {
        // 外币账号
        const { payeeCurrency, accountNumberCurrency, bankNameCurrency } = this.logisticInfo
        if (!payeeCurrency || !accountNumberCurrency || !bankNameCurrency) {
          return this.$message.error({ message: '请输入完整外币账号的内容!' })
        }
      }
    },
    handlerResult(ct) {
      ct.finally(() => {
        this.loading = false
      }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.close(1)
      })
    }

  }
}

</script>
<style lang="scss" scoped>
*{
  font-size: 12px;
}

.addEditLogistic{
  &.basic-container{
    min-width:900px!important;
      .el-input{
      width:87%!important;
      &.small{
        width:30%!important;
      }
      &.big{
        width:95%!important;
      }
    }
    .el-select{
        width: 87%!important;
    }
    .w-33{
      width:33.33%!important
    }
  }
}

</style>
