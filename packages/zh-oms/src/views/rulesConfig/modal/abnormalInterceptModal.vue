<template>
  <!-- oms 详情 - 提交审核 -->
  <div v-loading="loading">
    <el-form ref="formRef" :model="form" :rules="rules" :disabled="isDetail" size="mini" label-width="80px" class="form-col" :class="{'form-readonly':isDetail}">
      <el-row>
        <el-col :span="9">
          <el-form-item label="销售平台" prop="platformCode">
            <el-select v-model="form.platformCode" filterable default-first-option class="w-100">
              <el-option
                v-for="item in platformList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="9">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="form.ruleName" class="w-100" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="规则状态" prop="ruleStatus">
            <el-switch v-model="form.ruleStatus" :active-value="1" :inactive-value="2" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-divider content-position="left">选择规则</el-divider>
        <el-col :span="12">
          <el-form-item label="规则对象" prop="ruleScope">
            <el-select v-model="form.ruleScope" class="w-100" @change="changeRuleScope">
              <el-option
                v-for="item in ruleScopeList"
                :key="+item.value"
                :label="item.label"
                :value="+item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则类型" prop="ruleType">
            <el-select v-model="form.ruleType" :disabled="form.ruleScope===''" placeholder="请先选择规则对象" filterable default-first-option class="w-100" @change="form.executeJson=''">
              <el-option
                v-for="item in ruleTypeList"
                :key="+item.id"
                :label="item.value"
                :value="+item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-divider content-position="left">规则条件</el-divider>
        <conditions ref="conditionsRef"
                    :key="form.ruleScope"
                    v-model="form.ruleConditions"
                    :disabled="form.ruleScope===''"
                    operator-key="op"
                    :extends-field="extendsField"
                    :conditions-request="conditionsRequest"
                    :currency-request="currencyRequest"
                    :values-request="valuesRequest"
        />

      </el-row>

      <el-row v-if="[1, 3, 4, 8, 14, 18, 20].includes(form.ruleType)">
        <el-divider content-position="left">规则内容</el-divider>

        <div v-if="[1,3,4].includes(form.ruleType)">{{ ruleContent[form.ruleType] }}</div>

        <!-- 超额订单拦截 -->
        <el-form-item v-else-if="[8, 18, 20].includes(form.ruleType)" prop="executeJson" label="阈值" label-width="50px">
          <el-input key="!ruleType_23" v-model="form.executeJson" v-input.positive class="w-100" />
        </el-form-item>

        <!-- 收件人信息异常拦截规则配置 -->
        <div v-else-if="form.ruleType===14" class="error-wrap">
          <el-row v-for="(fields, i) in fieldRules" :key="i">
            <el-col :span="10">
              <el-form-item label="匹配字段" prop="field" class="mb-2">
                <el-select v-model="fields.type" clearable class="w-100" :class="fields.type===''?' error-item':''">
                  <el-option
                    v-for="item in validationRulesList"
                    :key="item.value"
                    :label="item.label"
                    :value="+item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="验证规则" prop="rule" class="mb-2">
                <el-select v-model="fields.rule" clearable class="w-100" :class="fields.rule===''?' error-item':''">
                  <el-option
                    v-for="item in matchFieldList"
                    :key="item.value"
                    :label="item.label"
                    :value="+item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button icon="el-icon-plus"
                         size="mini"
                         class="ms-3"
                         @click="addField(i)"
              />
              <el-button v-if="fieldRules.length>1"
                         icon="el-icon-minus"
                         size="mini"
                         @click="deleteField(i)"
              />
            </el-col>
          </el-row>
        </div>
      </el-row>
    </el-form>
    <div v-if="id" class="mt-2">
      <el-divider content-position="left">操作日志</el-divider>
      <g-table ref="table" :headers="headers" :fixed-height="false" max-height="300px" :fetch="fetch" dense>
        <el-table-column slot="updateContentSlot" label="修改内容">
          <template slot-scope="{row}">
            <g-text-ellipsis lines="2">{{ row.logDetail }}</g-text-ellipsis>
          </template>
        </el-table-column>
      </g-table>
    </div>
    <div class="text-end mt-2">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button v-if="!isDetail" type="primary" size="mini" @click="submit">确认</el-button>
    </div>
  </div>

</template>
<script>
import { getDicts } from '@/api/common/dict'
import { getRuleLogs, addOrUpdate, getRuleTypesList, getRuleDetail } from '@/api/abnormalIntercept'
import { Conditions } from 'global-components'
import { getConditions, getConditionValues, getCurrency } from '@/api/conditions'

export default {
  name: 'AbnormalInterceptModal',
  components: { Conditions },
  props: {
    platformList: {
      type: Array,
      default: () => []
    },
    ruleScopeList: {
      type: Array,
      default: () => []
    },
    ruleStatusList: {
      type: Array,
      default: () => []
    },
    id: String,
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleContent: Object.freeze({
        1: '所有有效收款账号都维护在店铺管理系统，请到店铺管理系统添加',
        3: '订单总金额为零，系统自动拦截为零单价订单',
        4: '手工导入订单拦截需要配置：选择订单类型为手工导入订单，选择规则类型为手工导入订单拦截'
      }),
      rules: {
        platformCode: [{ required: true, message: '请选择销售平台' }],
        ruleName: [{ required: true, message: '请输入规则名称' }],
        ruleScope: [{ required: true, message: '请选择规则对象' }],
        ruleType: [{ required: true, message: '请选择规则类型' }],
        executeJson: [{ required: true, message: '请输入' }]
      },
      form: {
        platformCode: '',
        ruleStatus: 1,
        ruleName: '',
        ruleScope: '',
        ruleType: '',
        executeJson: '',
        ruleConditions: {}
      },
      conditionsRequest: this.conditionsRequestFn,
      currencyRequest: getCurrency,
      valuesRequest: this.valuesRequestFn,
      extendsField: { 5: { platformCode: '' } },
      headers: [
        { label: '修改时间', prop: 'updateTime' },
        { label: '修改人', prop: 'updateUserName' },
        { slot: true, slotName: 'updateContentSlot' }
      ],
      loading: false,
      fieldRules: [
        { type: '', rule: '' }
      ],
      ruleTypeList: [],
      validationRulesList: [],
      matchFieldList: []
    }
  },
  watch: {
    'form.platformCode'(val) {
      this.extendsField['5'].platformCode = val
      this.$refs.conditionsRef && this.$refs.conditionsRef.updateValuesSelect()
    }
  },
  created() {
    this.getOptions()
    const { id } = this
    if (id) {
      getRuleDetail(id).then(({ data }) => {
        Object.keys(this.form).forEach(key => (this.form[key] = data[key]))

        this.form.ruleConditions = JSON.parse(data.matchJson)
        this.$nextTick(() => {
          const list = data.receiverInfoInterceptRules ?? []
          this.fieldRules.splice(0, list.length > 0 ? 1 : 0, ...list)
        })
        this.getRuleTypesList(data.ruleScope)
      })
    }
  },
  mounted() {
    if (this.id) this.$refs.table.load(1)
  },
  methods: {
    conditionsRequestFn() {
      let arr = []
      const { ruleScope } = this.form
      if (ruleScope === 1) {
        arr = [4, 5]
      } else { // ruleScope === 2、3
        arr = [ruleScope + 2]
      }
      return getConditions(arr)
    },
    valuesRequestFn(val) {
      const code = ['guestChooseFreight', 'platOrderStatus', 'storeCode', 'itemStatus'].includes(val) ? this.form.platformCode : ''
      return getConditionValues(val, code)
    },
    getOptions() {
      getDicts(['receiver_intercept_type', 'receiver_intercept_rule'], 'oms', false).then(res => {
        this.validationRulesList = res.receiver_intercept_type // 匹配字段类型
        this.matchFieldList = res.receiver_intercept_rule // 验证规则
      })
    },
    isNullFieldRules() {
      return this.fieldRules.some(item => item.type === '' || item.rule === '')
    },
    changeRuleScope(val) {
      this.form.ruleType = ''
      this.getRuleTypesList(val)
    },
    getRuleTypesList(scope) {
      getRuleTypesList(scope).then(res => {
        this.ruleTypeList = res.data
      })
    },
    addField(index) {
      if (this.isNullFieldRules()) {
        return
      }
      this.fieldRules.splice(index + 1, 0, { type: '', rule: '' })
    },
    deleteField(index) {
      if (this.fieldRules.length === 1) return
      this.fieldRules.splice(index, 1)
    },
    submit() {
      this.$refs.formRef.validate(bool => {
        if (!bool || !this.$refs.conditionsRef.validate() || this.loading) return
        if (this.form.ruleType === 14 && this.isNullFieldRules()) {
          return this.$message.error('存在空的匹配字段或验证规则')
        }
        this.loading = true

        const { form: { ruleConditions, ...other }, fieldRules: receiverInfoInterceptRules, id } = this
        const matchJson = JSON.stringify(ruleConditions)
        const data = { ...other, matchJson, receiverInfoInterceptRules }
        if (this.isNullFieldRules()) {
          delete data.receiverInfoInterceptRules
        }
        if (id) {
          data.id = id
        }
        addOrUpdate(data).then(res => {
          this.$message.success(res.msg)
          this.close(true)
        }).finally(() => { this.loading = false })
      })
    },
    fetch({ current, size }) {
      const { id: ruleId } = this
      return getRuleLogs({ current, size, ruleId }).then(({ data: { records, size, total } }) => {
        return { records, size, total }
      })
    },
    close(bool) {
      this.$parent.$emit('close', bool)
    }
  }
}
</script>
<style scoped lang='scss'>
.error-wrap .error-item ::v-deep .el-input__inner{
  border-color: $--color-danger;
}
</style>
