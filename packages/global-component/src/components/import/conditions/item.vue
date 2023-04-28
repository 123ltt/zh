<template>
  <div class="d-flex">
    <el-select v-model="field"
               class="me-1"
               :size="size"
               :disabled="isDisabled"
               @change="onConditionChange"
    >
      <el-option v-for="item in conditions"
                 :key="item.value"
                 :label="item.label"
                 :value="item"
      />
    </el-select>
    <el-select v-model="operator"
               class="mx-1"
               :size="size"
               :disabled="isDisabled||!field"
               style="width:100px"
               @change="onOperatorChange"
    >
      <el-option v-for="item in operators"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
      />
    </el-select>

    <div v-if="operator" class="mx-1">
      <el-input v-if="type===1"
                v-model="val"
                :size="size"
                :disabled="isDisabled||disabledValue"
                @input="emitValue"
      />
      <el-date-picker v-else-if="type===2"
                      v-model="val"
                      type="date"
                      placeholder="选择日期"
                      :size="size"
                      :disabled="isDisabled||disabledValue"
                      value-format="timestamp"
                      @change="emitValue"
      />
      <template v-else-if="type===3">
        <g-select v-model="val"
                  key-field="value"
                  :items="values"
                  :multiple="isMultiple"
                  :readonly="isDisabled||disabledValue"
                  dropdown-width="auto"
                  @change="emitValue"
        />
      </template>
      <template v-else-if="type===4&&Array.isArray(values)">
        <g-cascader :key="isMultiple?'a':'b'"
                    v-model="val"
                    clearable
                    :options="values"
                    collapse-tags
                    style="min-width:200px"
                    size="mini"
                    :props="{label:'label',value:'value',multiple:isMultiple}"
                    @change="emitValue"
        />
      </template>
      <Type5 v-else-if="type===5"
             v-model="val"
             :disabled="isDisabled||disabledValue"
             :currency-request="currencyRequest"
             :size="size"
             @input="emitValue"
      />
    </div>
  </div>
</template>

<script>
import Type5 from './type5.vue'

export default {
  name: 'ConditionItem',
  components: { Type5 },
  inject: {
    elForm: {
      default: null
    }
  },
  props: {
    /** @type {ZHKJ.VueProps<{field:string; operator:string; val:string|string[]}>} */
    value: {
      type: Object,
      default: () => ({})
    },
    /** @type {ZHKJ.VueProps<CONDITION.ConditionItem[]>} */
    conditions: {
      type: Array,
      default: () => ([])
    },
    /** @type {ZHKJ.VueProps<() => Promise<CONDITION.BaseItem>>} 获取下拉列表的请求(请求最好用缓存) */
    request: Function,
    /** @type {ZHKJ.VueProps<Promise<CONDITION.BaseItem[]>>} 获取币种下拉列表的请求 */
    currencyRequest: Function,
    size: {
      type: String,
      default: 'mini'
    },
    // 自定义操作符字段名
    operatorKey: {
      type: String,
      default: 'operator'
    },
    // 自定义条件取值的字段名
    fieldKey: {
      type: String,
      default: 'field'
    },
    // 自定义单个条件所属的字段名
    ruleKey: {
      type: String,
      default: 'rule'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multipleOpt: ['in', 'notin'],
      field: null,
      operator: '',
      val: '',
      operators: [],
      values: '',
      // 1.文本输入框 2.日期选择框 3.下拉列 4.级联, 5.文本输入框+币种下拉列表
      type: 0,
      isMultiple: false
    }
  },
  computed: {
    /** @returns {boolean} */
    disabledValue() {
      return this.operator === ''
    },
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getField()
          this.operator = newVal[this.operatorKey]
          const one = this.conditions.find(item => item.value === this.value.field)
          if (one && Number(one.type) === 4) {
            // 单选
            if (!this.multipleOpt.includes(newVal.op)) {
              if (Array.isArray(newVal.value)) {
                this.val = newVal.value[0].split(',') // 兼容旧数据
              } else {
                this.val = newVal.value.split(',') // 张龙辉要求这样改
              }
            } else {
              this.val = newVal.value.map(el => el.split(','))
            }
          } else {
            this.val = newVal.value
          }
        }
      },
      immediate: true
    },
    conditions() {
      this.getField()
    },
    operator: {
      handler(val) {
        this.$nextTick(() => {
          this.isMultiple = this.multipleOpt.includes(val)
        })
      },
      immediate: true
    }
  },
  methods: {
    getField() {
      this.field = this.conditions.find(item => item.value === this.value[this.fieldKey])
      if (this.field) this.onConditionChange(this.field, false)
    },
    onConditionChange(d, isEvent = true) {
      if (isEvent) {
        this.operator = ''
        this.val = ''
      }
      if (d) {
        if (/^[34]$/.test(d.type)) {
          this.request(d.value, d.type).then(res => {
            this.operators = d.operatorList
            this.values = res
            this.type = d.type
            this.$nextTick(this.emitValue)
          })
        } else {
          this.operators = d.operatorList
          this.type = d.type
          this.$nextTick(this.emitValue)
        }
      }
    },
    onOperatorChange() {
      this.val = ''
      this.emitValue()
    },
    emitValue() {
      this.$nextTick(() => {
        let value = this.val
        // 没有勾选级联内容时，this.val为空字符串，所以此处必须判断 this.val 是否是数组（容错处理）
        if (this.type === 4 && Array.isArray(this.val)) {
          // 后端需要将全路径数组转成字符串
          if (this.multipleOpt.includes(this.operator)) {
            value = this.val.map(el => el.join(','))
          } else {
            value = this.val.join(',')
          }
        }
        Object.assign(this.value, { [this.fieldKey]: this.field.value, [this.operatorKey]: this.operator, value })
        this.$emit('input', this.value)
        this.$emit('change', this.value)
        this.$emit('clear-error')
      })
    },
    // 更新type为3 取值列表（外部调用）
    updateValues() {
      if (this.type - 3 === 0) {
        this.request(this.field.value).then(res => {
          this.values = res
        }).finally(() => this.$nextTick(() => {
          if (Array.isArray(this.val)) {
            this.val = this.val.filter(item => {
              return this.values.some(el => el.value === item)
            })
          } else if (!this.values.some(el => el.value === this.val)) {
            this.val = ''
          }
          this.emitValue()
        }))
      }
    }
  }
}
</script>
