<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="85px" class="form-col">
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input v-model="form.ruleName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="匹配优先级" prop="matchPriority">
            <el-input v-model="form.matchPriority" v-input.numeric v-input="[1,99]" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售平台" prop="platformCode">
            <el-select v-model="form.platformCode" clearable filterable class="width-100" @change="()=>$refs.conditions&&$refs.conditions.updateValuesSelect()">
              <el-option v-for="(item,index) in platformList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.ruleStatus">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <conditions ref="conditions"
                  v-model="form.conditionJson"
                  :conditions-request="conditionsRequest"
                  :values-request="valuesRequest"
                  :extends-field="extendsField"
                  operator-key="op"
                  :currency-request="currencyRequest"
      />
      <el-divider content-position="left">执行动作</el-divider>
      <el-form-item label="流程规则：发货优先级（1最大）" label-width="210px" prop="deliverPriority">
        <el-input v-model="form.deliverPriority" v-input.numeric v-input="[1,99]" />
      </el-form-item>
      <div v-if="id" class="mt-2">
        <el-divider content-position="left">操作日志</el-divider>
        <g-table ref="table" :headers="headers" :fixed-height="false" max-height="300px" :fetch="fetch" dense>
          <el-table-column slot="updateContentSlot" label="修改内容">
            <template slot-scope="{row}">
              <g-text-ellipsis lines="2">{{ row.msgBrief }}</g-text-ellipsis>
            </template>
          </el-table-column>
        </g-table>
      </div>
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="submit">确定</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getRule, update, getDeliveryLogs } from '@/api/ruleConfig'
import { getPlatformList } from '@/api/common.js'
import { Conditions } from 'global-components'
import { getConditions, getConditionValues, getCurrency } from '@/api/conditions'

export default {
  name: 'DeliveryModal',
  components: {
    Conditions
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      conditionsRequest: () => getConditions([1]),
      currencyRequest: getCurrency,
      valuesRequest: this.getConditionValuesFn,
      optionalList: [
        {
          selectName: '', optional: '', result: ''
        }
      ],
      extendsField: { 5: { platformCode: '' } },
      form: {
        deliverPriority: '',
        matchPriority: '',
        platformCode: '',
        ruleName: '',
        ruleStatus: 1,
        conditionJson: {}
      },
      platformList: [],
      rules: {
        ruleName: [
          { required: true, message: '规则名称不能为空' }
        ],
        platformCode: [
          { required: true, message: '请选择销售平台' }
        ],
        matchPriority: [
          { required: true, message: '匹配优先级不能小于1或超过99' }
        ],
        deliverPriority: [
          {
            required: true, message: '发货优先级不能小于1或超过99'
          }
        ]
      },
      headers: [
        { label: '修改时间', prop: 'updateTime' },
        { label: '修改人', prop: 'updateUserName' },
        { slot: true, slotName: 'updateContentSlot' }
      ]
    }
  },
  watch: {
    'form.platformCode'(val) {
      this.extendsField['5'].platformCode = val
      this.$refs.conditions && this.$refs.conditions.updateValuesSelect()
    }
  },
  beforeMount() {
    if (this.id) {
      this.getData()
    }
    this.getPlatformList()
  },
  mounted() {
    if (this.id) this.$refs.table.load(1)
  },
  methods: {
    fetch({ current, size }) {
      const { id } = this
      return getDeliveryLogs({ current, size, id }).then(({ data: { records, size, total } }) => {
        return { records, size, total }
      })
    },
    del(index) {
      this.$delete(this.optionalList, index)
    },
    getData() {
      getRule({ id: this.id }).then(res => {
        this.form = res.data
        this.form.conditionJson = JSON.parse(this.form.conditionJson)
      })
    },
    getPlatformList() {
      getPlatformList().then(res => {
        this.platformList = res.data.map(item => {
          return {
            label: item.platformName,
            value: item.platformCode
          }
        })
      })
    },
    submit() {
      let type = 'add'
      const params = Object.assign({}, this.form)
      let msg = '新增成功'
      if (this.id) {
        type = 'edit'
        params.id = this.id
        msg = '修改成功'
      }
      params.conditionJson = JSON.stringify(params.conditionJson)
      this.$refs.form.validate((valid) => {
        if (valid && this.$refs.conditions.validate()) {
          update(params, type).then(res => {
            this.$message.success(msg)
            this.close()
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.close(false)
    },
    close(type = true) {
      this.$parent.$emit('close', type)
    },
    getConditionValuesFn(val) {
      const platformCodeObj = {
        storeCode: 'storeCode',
        platOrderStatus: 'platOrderStatus'
      }
      const key = platformCodeObj[val] ? this.form.platformCode : ''
      return getConditionValues(val, key)
    }
  }
}
</script>

<style lang="scss" scoped>
.width-100{
    width: 100%;
}
</style>
