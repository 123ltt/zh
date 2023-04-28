<template>
  <div class="condition-wrap">
    <v-group v-if="conditionOptions.length>0"
             :data="conditionData"
             :condition-options="conditionOptions"
             :values-request="valuesRequest"
             :currency-request="currencyRequest"
             :size="size"
             :group="group"
             :node-type-key="nodeTypeKey"
             :children-key="childrenKey"
             :operator-key="operatorKey"
             :field-key="fieldKey"
             :rule-key="ruleKey"
             :is-root="true"
             :allow-empty="allowEmpty"
             :disabled="disabled"
             class="mx-1"
             @change="onChange"
             @clear-error="validate"
    />
  </div>
</template>

<script>
import VGroup from './group.vue'
import { getTypeof, getUid, recursion } from './util'

export default {
  name: 'Conditions',
  components: { VGroup },
  provide() {
    return {
      extendsField: this.extendsField
    }
  },
  props: {
    value: Object,
    /** @type {ZHKJ.VueProps<() => Promise<CONDITION.ConditionItem[]>} */
    conditionsRequest: Function,
    /** @type {ZHKJ.VueProps<() => Promise<CONDITION.BaseItem>>} 获取下拉列表的请求(请求最好用缓存) */
    valuesRequest: Function,
    /** @type {ZHKJ.VueProps<() => Promise<CONDITION.BaseItem>>} 获取币种下拉列表的请求(请求最好用缓存) */
    currencyRequest: Function,
    size: {
      type: String,
      default: 'mini'
    },
    // 是否支持添加组
    group: {
      type: Boolean,
      default: true
    },
    // 自定义节点类型字段名
    nodeTypeKey: {
      type: String,
      default: 'nodeType'
    },
    // 自定义子节点类型字段名
    childrenKey: {
      type: String,
      default: 'children'
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
    // 是否允许删除所有条件
    allowEmpty: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    extendsField: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      conditionOptions: [],
      conditionData: this.initData(),
      cachePreVal: null
    }
  },
  watch: {
    value(val) {
      if (val !== this.cachePreVal) {
        Object.assign(this.conditionData, this.initData())
      }
    }
  },
  created() {
    this.conditionsRequest().then(res => {
      this.conditionOptions = res
    })
  },
  methods: {
    initData() {
      const d = this.value
      if (getTypeof(d) === 'object' && d[this.nodeTypeKey] === 'group' && Array.isArray(d[this.childrenKey])) {
        const baseData = recursion(d, (data, property) => {
          if (property[property.length - 1] === this.childrenKey && Array.isArray(data)) {
            return data.map(item => {
              return Object.assign({ uid: getUid() }, item)
            })
          }
          return data
        })
        return baseData
      }
      return {
        [this.nodeTypeKey]: 'group',
        [this.childrenKey]: [],
        [this.operatorKey]: ''
      }
    },
    onChange(data) {
      this.$nextTick(() => {
        const d = recursion(data, (d, property) => {
          if (property.slice(-2).join('') === this.childrenKey + '[]' && d.uid) {
            return Object.assign({}, d, { uid: undefined })
          }
          return d
        })
        this.cachePreVal = d
        this.$emit('input', d)
      })
    },
    _validate(cb) {
      const components = ['ElCascader', 'ElSelect', 'GSelect', 'ElDatePicker', 'ElInput']
      const errorTip = 'error-tip'
      const recursion = (ref) => {
        if (components.includes(ref.$options.name)) {
          if (cb && cb(ref, errorTip)) return
          ref.$el.classList.remove(errorTip)
          return
        }
        if (Array.isArray(ref.$children)) {
          ref.$children.forEach(item => {
            recursion(item)
          })
        }
      }
      recursion(this)
    },
    // 校验数据，为空则添加红色边框提示
    validate() {
      let count = 0
      this._validate((ref, errorTip) => {
        if (ref.disabled !== true) {
          if ((Array.isArray(ref.value) && ref.value.length === 0) || !ref.value) {
            ref.$el.classList.add(errorTip)
            count++
            return true
          }
        }
        return false
      })
      return count === 0
    },
    // 清空校验
    clearValidate() {
      this._validate()
    },
    // 更新取值列表（type为3的取值列表）（供外部调用）
    updateValuesSelect() {
      const recursion = (ref) => {
        if (ref.$options.name === 'ConditionItem') {
          return ref.updateValues()
        }
        if (Array.isArray(ref.$children)) {
          ref.$children.forEach(recursion)
        }
      }
      recursion(this)
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-wrap ::v-deep {
  .error-tip .el-input__inner:not([disabled="disabled"]) {
    border-color: $--color-danger;
  }
}
</style>
