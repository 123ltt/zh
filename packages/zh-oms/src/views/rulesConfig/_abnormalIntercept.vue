<template>
  <basic-container>
    <g-table ref="table" v-loading="loading" :headers="headers" :fetch="fetch">
      <el-form slot="header"
               ref="form"
               label-width="80px"
               size="mini"
               class="no-message form-col"
               :model="form"
               @submit.native.prevent="search"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="销售平台" prop="platformCode">
              <el-select v-model="form.platformCode" filterable clearable class="w-100">
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则对象" prop="ruleScope">
              <el-select v-model="form.ruleScope" class="w-100" clearable @change="changeRuleScope">
                <el-option
                  v-for="item in ruleScopeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则类型" prop="ruleType">
              <el-select v-model="form.ruleType" :disabled="form.ruleScope===''" clearable placeholder="请先选择规则对象" class="w-100">
                <el-option
                  v-for="item in ruleTypeList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="状态" prop="ruleStatus">
              <el-select v-model="form.ruleStatus" clearable class="w-100">
                <el-option
                  v-for="item in ruleStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="form.ruleName" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" native-type="submit">搜索</el-button>
              <el-button @click="reset">重置</el-button>
              <g-auth code="oms_rule_config_intercept_add">
                <el-button type="primary" class="mb-2" @click="updateRules()">新增</el-button>
              </g-auth>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table-column slot="createUserNameSlot" label="创建人">
        <template slot-scope="{row}">
          <g-text-ellipsis>{{ row.createUserName }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <el-table-column slot="ruleStatusSlot" label="状态" width="70px">
        <template slot-scope="{row}">
          <el-switch v-model="row.ruleStatus" :disabled="!$auth('oms_rule_config_intercept_enable')" :inactive-value="2" :active-value="1" @change="updateStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column v-if="$auth('oms_rule_config_intercept_detail', 'oms_rule_config_intercept_edit')" slot="handler" label="操作" width="120px">
        <template slot-scope="{row}">
          <g-auth code="oms_rule_config_intercept_detail">
            <el-button type="text" @click="updateRules(row.id, true)">详情</el-button>
          </g-auth>
          <g-auth code="oms_rule_config_intercept_edit">
            <el-button type="text" @click="updateRules(row.id)">修改</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getDicts } from '@/api/common/dict'
import { getPlatformList } from '@/api/common.js'
import { getPageList, getRuleTypesList, updateStatus } from '@/api/abnormalIntercept'

import AbnormalInterceptModal from './modal/abnormalInterceptModal.vue'

export default {
  name: 'OmsRulesConfigAbnormalIntercept',
  components: { },
  data() {
    return {
      form: {
        platformCode: '',
        ruleType: '',
        ruleScope: '',
        ruleStatus: '',
        ruleName: ''
      },
      headers: [
        { label: '销售平台', prop: 'platformName' },
        { label: '规则类型', prop: 'ruleTypeLabel' },
        { label: '规则名称', prop: 'ruleName' },
        { label: '规则对象', prop: 'ruleScopeLabel' },
        { slot: true, slotName: 'createUserNameSlot' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'ruleStatusSlot' },
        { slot: true, slotName: 'handler' }
      ],
      platformList: [],
      ruleScopeList: [],
      ruleStatusList: [],
      ruleTypeList: [],
      loading: false
    }
  },
  created() {
    this.getOptions()
  },
  mounted() {
    this.search()
  },
  methods: {
    updateStatus({ id, ruleStatus }) {
      if (this.loading) return
      this.loading = true
      updateStatus(id, ruleStatus).then(res => {
        this.$message.success(res.msg)
      }).finally(() => { this.loading = false })
    },
    changeRuleScope(val) {
      this.form.ruleType = ''
      if (val !== '') this.getRuleTypesList(val)
    },
    getRuleTypesList(scope) {
      getRuleTypesList(scope).then(res => {
        this.ruleTypeList = res.data
      })
    },
    getOptions() {
      getPlatformList().then(res => {
        this.platformList = res.data.map(item => {
          return {
            label: item.platformName,
            value: item.platformCode
          }
        })
      })
      getDicts(['config_intercept_rule_scope', 'config_intercept_rule_status'], 'oms').then(res => {
        this.ruleScopeList = res.config_intercept_rule_scope
        this.ruleStatusList = res.config_intercept_rule_status
      })
    },
    search(page = 1) {
      this.$refs.table.load(page, this.form)
    },
    fetch({ current, size }) {
      return getPageList({ current, size, ...this.form }).then(({ data: { records, total, size } }) => {
        return { records, total, size }
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    updateRules(id, isDetail) {
      const { platformList, ruleScopeList } = this
      let title = `${id ? '修改' : '新增'}规则`
      if (isDetail) title = '查看规则'
      this.$modal({
        title,
        component: AbnormalInterceptModal,
        data: { platformList, ruleScopeList, id, isDetail },
        callback: bool => {
          if (bool) this.search(-1)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
