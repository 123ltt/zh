<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="100px" class="form-col">
    <el-row>
      <el-col :span="12">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="销售平台" prop="platformCode">
          <el-select v-model="form.platformCode" clearable filterable class="width-100">
            <el-option v-for="(item,index) in platformList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="优先级" prop="markPriority">
          <el-input v-model="form.markPriority" v-input.numeric v-input="[1,99]" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态">
          <el-switch v-model="form.ruleStatus" />
        </el-form-item>
      </el-col>
      <template v-if="type==='auto'">
        <el-col :span="12">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="startTime"
              class="width-100"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="endTime"
              class="width-100"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
              default-time="23:59:59"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <conditions
      ref="conditions"
      v-model="form.conditionJson"
      :conditions-request="conditionsRequest"
      :values-request="valuesRequest"
      :currency-request="currencyRequest"
      :extends-field="extendsField"
      operator-key="op"
    />
    <template v-if="type==='tag'">
      <el-divider content-position="left">执行动作（默认满足条件则进行标记）</el-divider>
      <el-form-item label="标记内容" prop="markContentRule">
        <el-select v-model="form.markContentRule">
          <el-option v-for="(item,index) in markList" :key="index" :label="item.label" :value="+item.value" />
        </el-select>
      </el-form-item>
    </template>
    <template v-else>
      <el-divider content-position="left">执行动作</el-divider>
      <span>自动撤单</span>
    </template>
    <div v-if="id&&type==='auto'" class="mt-2">
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
      <el-button type="primary" size="mini" @click="save">确定</el-button>
    </el-row>
  </el-form>
</template>

<script>
import { Conditions } from 'global-components'
import { getConditions, getConditionValues, getCurrency } from '@/api/conditions'
import { save, detail, getAutoLogList } from '@/api/ruleConfig'
export default {
  components: {
    Conditions
  },
  props: {
    platformList: {
      type: Array
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'tag'
    }
  },
  data() {
    return {
      typeNum: this.type === 'tag' ? 2 : 3,
      conditionsRequest: () => getConditions([this.typeNum]),
      currencyRequest: getCurrency,
      valuesRequest: this.valuesRequestFn,
      form: {
        ruleName: '',
        platformCode: '',
        ruleStatus: true,
        markPriority: '',
        conditionJson: {}
      },
      rules: {
        ruleName: [
          { required: true, message: '规则名称不能为空' }
        ],
        platformCode: [
          { required: true, message: '请选择销售平台' }
        ],
        markPriority: [
          { required: true, message: '优先级不能小于1或超过99' }
        ],
        markContentRule: [
          { required: true, message: '标记内容不能为空' }
        ]
      },
      extendsField: { 5: { platformCode: '' } },
      endTime: '',
      startTime: '',
      markList: [
        { label: '只标记跟踪号一', value: '1' },
        { label: '只标记跟踪号二', value: '2' },
        { label: '先标一再改二', value: '3' },
        { label: '先标二再改一', value: '4' }
      ],
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
  mounted() {
    if (this.id) {
      this.getData()
    }
    if (this.id && this.type === 'auto') this.$refs.table.load(1)
  },
  methods: {
    getData() {
      let params = { id: this.id }
      if (this.type === 'auto') {
        params = { data: this.id }
      }
      detail(params, this.type).then(res => {
        this.form = res.data
        this.form.ruleStatus = !!res.data.ruleStatus
        this.form.conditionJson = JSON.parse(this.form.conditionJson)
        if (this.type === 'auto') {
          this.$set(this.form, 'markPriority', res.data.matchPriority)
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
        }
      })
    },
    save() {
      let params = {}
      if (this.type === 'tag') {
        params = Object.assign({}, this.form)
        params.ruleStatus = params.ruleStatus ? '1' : '0'
        params.conditionJson = JSON.stringify(params.conditionJson)
      } else {
        params.data = Object.assign({}, this.form, { startTime: this.startTime, endTime: this.endTime })
        params.data.ruleStatus = params.data.ruleStatus ? 1 : 0
        params.data.conditionJson = JSON.stringify(params.data.conditionJson)
        params.data.matchPriority = params.data.markPriority
        delete params.data.markPriority
      }
      let editType = 'add'
      let msg = '新增成功'
      if (this.id) {
        editType = 'edit'
        msg = '编辑成功'
      }
      this.$refs.form.validate((valid) => {
        if (valid && this.$refs.conditions.validate()) {
          save(params, editType, this.type).then(res => {
            this.$message.success(msg) && this.close()
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
    valuesRequestFn(val) {
      const code = ['guestChooseFreight', 'platOrderStatus', 'storeCode', 'itemStatus', 'storeLevelCode'].includes(val) ? this.form.platformCode : ''
      return getConditionValues(val, code)
    },
    fetch({ current, size }) {
      const { id: ruleId } = this
      return getAutoLogList({ current, size, ruleId }).then(({ data: { records, size, total } }) => {
        return { records, size, total }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.width-100{
  width: 100%;
}
</style>
