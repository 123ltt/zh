<template>
  <div class="p-3 form-group" :style="{borderLeftColor:borderColor}">
    <div class="d-flex justify-content-between border-bottom pb-2">
      <div>
        <template v-if="data[childrenKey].length>1">
          <span class="text-secondary">条件{{ group?'或组':'' }}之间的关系</span>
          <el-select v-model="data[operatorKey]" size="mini" class="operators mx-1" @change="onOuterOperatorChange">
            <el-option v-for="item in groupOperators" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </div>
      <div v-if="!isDisabled">
        <el-button size="mini" class="mx-1" @click="onAddCondition()">添加条件</el-button>
        <el-button v-if="group" size="mini" class="mx-1" @click="onAddGroup">添加分组</el-button>
        <el-button v-if="group&&!isRoot" size="mini" class="mx-1" @click="$emit('remove',data)">删除当前组</el-button>
      </div>
    </div>

    <div>
      <div v-if="data[childrenKey].length===0" class="text-center text-muted py-2">请添加条件或分组</div>
      <div v-for="(item,index) in data[childrenKey]" :key="item.uid" class="my-2">
        <div v-if="item[nodeTypeKey]==='item'" class="d-flex">
          <v-form-item :key="item.uid"
                       v-model="item.rule"
                       :conditions="conditionOptions"
                       :request="valuesRequest"
                       v-bind="$props"
                       @change="emitValue"
                       @clear-error="$emit('clear-error')"
          />
          <div v-if="!isDisabled" class="d-flex conditions-btns flex-shrink-0">
            <el-button icon="el-icon-plus"
                       :size="size"
                       class="mx-1"
                       @click="onAddCondition(index)"
            />
            <el-button v-if="allowEmpty||data[childrenKey].length>1"
                       icon="el-icon-minus"
                       :size="size"
                       class="mx-1"
                       @click="onRemoveCondition(index)"
            />
          </div>
        </div>
        <ConditionsGroup v-else-if="group&&item[nodeTypeKey]==='group'"
                         :data="item"
                         :count="1+count"
                         :is-root="false"
                         v-bind="$props"
                         @clear-error="$emit('clear-error')"
                         @change="emitValue"
                         @remove="onRemoveGroup"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VFormItem from './item.vue'
import { getUid } from './util'

export default {
  name: 'ConditionsGroup',
  components: { VFormItem },
  inject: {
    elForm: {
      default: null
    }
  },
  props: {
    /** @type {ZHKJ.VueProps<{rules:CONDITION.ConditionItem[],type:string;operator:string}>} */
    data: {
      type: Object,
      default: () => ({
        type: 'group',
        rules: [],
        operator: ''
      })
    },
    // 是否是节点
    isRoot: {
      type: Boolean,
      default: false
    },
    // 内部使用，外部不需要传入
    count: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: 'mini'
    },
    /** @type {ZHKJ.VueProps<CONDITION.ConditionItem[]>} */
    conditionOptions: Array,
    /** @type {ZHKJ.VueProps<Promise<CONDITION.BaseItem[]>>} 请求可选值列表接口 */
    valuesRequest: Function,
    /** @type {ZHKJ.VueProps<Promise<CONDITION.BaseItem[]>>} 获取币种下拉列表的请求 */
    currencyRequest: Function,
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
    }
  },
  data() {
    return {
      groupOperators: [
        { label: '并且', value: 'and' },
        { label: '或者', value: 'or' }
      ],
      borderColor: this.getBorderColor()
    }
  },
  computed: {
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },
  created() {
    if (this.data[this.childrenKey].length === 0) {
      this.data[this.childrenKey].push(this.getItemData())
    }
  },
  methods: {
    emitValue() {
      this.$emit('change', this.data)
    },
    onOuterOperatorChange() {
      this.$nextTick(() => {
        this.$emit('clear-error')
        this.emitValue()
      })
    },
    getBorderColor() {
      const arr = ['#eeb8a5', '#aaa', '#e6a5c3', '#b7c598', '#b09fca', '#a2c4ec']
      return arr[this.count % arr.length]
    },
    getItemData() {
      return {
        [this.nodeTypeKey]: 'item',
        uid: getUid(),
        [this.ruleKey]: { [this.fieldKey]: '', [this.operatorKey]: '', value: '' }
      }
    },
    getGroupData() {
      return {
        [this.nodeTypeKey]: 'group',
        [this.operatorKey]: '',
        [this.childrenKey]: [
          this.getItemData()
        ]
      }
    },
    onAddCondition(index) {
      if (typeof index === 'number') {
        this.data[this.childrenKey].splice(index + 1, 0, this.getItemData())
      } else {
        this.data[this.childrenKey].push(this.getItemData())
      }
      this.emitValue()
    },
    onRemoveCondition(index) {
      this.data[this.childrenKey].splice(index, 1)
      const len = this.data[this.childrenKey].length
      if (len === 1) {
        this.data[this.operatorKey] = ''
      } else if (len === 0) {
        this.$emit('remove', this.data)
      }
      this.emitValue()
    },
    onAddGroup() {
      this.data[this.childrenKey].push(this.getGroupData())
      this.emitValue()
    },
    onRemoveGroup(data) {
      const index = this.data[this.childrenKey].findIndex(item => item === data)
      if (index > -1) {
        this.onRemoveCondition(index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.operators {
  width: 85px;
}
.conditions-btns {
  width: 90px;
}
.form-group {
  border: 1px solid #eee;
  border-radius: 0.5rem;
  border-left: 2px #999 solid;
}
</style>
