<template>
  <div>
    <el-select v-if="[1,2].includes(useType)"
               :key="useType"
               v-model="modelValue"
               :multiple="useType===1"
               collapse-tags
               size="mini"
               @change="onChange()"
    >
      <el-option v-for="option in items"
                 :key="option[optionValue]"
                 :value="option[optionValue]"
                 :label="option[optionLabel]"
      />
    </el-select>

    <el-input v-else-if="useType===3"
              v-model.trim="modelValue"
              size="mini"
              @change="onChange()"
    />

    <div v-else-if="useType===4" class="d-flex align-items-center">
      <el-input v-model.trim="modelValue" v-input.number size="mini" @change="onChange(1)" />
      <span class="mx-1">-</span>
      <el-input v-model.trim="modelValue2" v-input.number size="mini" @change="onChange(2)" />
    </div>

    <span v-else class="text-muted">不支持{{ type }}取值类型</span>
  </div>
</template>

<script>
export default {
  props: {
    value: [Array, String],
    /** @type {ZHKJ.VueProps<'check_box' | 'list_box' | 'input' | 'intevel'>} 目前后端只给了这么多取值类型 */
    type: String,
    items: Array,
    optionValue: {
      type: String,
      default: 'code'
    },
    optionLabel: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      useType: 0,
      modelValue: '',
      modelValue2: ''
    }
  },
  created() {
    this.init()

    // if (this.value) {
    //   this.onChange()
    // }

    const unwatch = this.$watch(() => [this.value, this.type, this.items], () => {
      this.init()
    })
    this.$once('hook:beforeDestroy', unwatch)
  },
  methods: {
    init() {
      const useType = this.getType()
      const arr = this.getValue(this.value, useType)
      this.useType = useType
      this.modelValue = arr[0]
      this.modelValue2 = arr[1]
    },
    getType() {
      return {
        check_box: 1, // 下拉多选(原复选框)，接收的value为数组
        list_box: 2, // 下拉单选
        input: 3, // 输入框
        intevel: 4 // 区间取值，接收的value为数组
      }[this.type.toLowerCase()] || 0
    },
    getValue(value, useType) {
      switch (useType) {
        case 1:
          if (Array.isArray(value)) {
            return [value, '']
          }
          if (value) return [[value], '']
          return [[], '']
        case 2:
        case 3:
          return [value, '']
        case 4:
          if (Array.isArray(value)) {
            return [value[0] || '', value[1] || '']
          }
          return [value, '']
      }
      return ['', '']
    },
    onChange(type) {
      let result
      const v1 = this.modelValue
      const v2 = this.modelValue2

      // 处理前面的值 不能 大于 后面的值
      if (this.useType === 4) {
        if (v1 && v2) {
          if (Number(v1) > Number(v2)) {
            if (type === 1) {
              this.modelValue = ''
            } else {
              this.modelValue2 = ''
            }
            return this.$emit('remove') // 数据不合格则通知外部删除，避免外部使用了旧值
          }
          result = [v1, v2]
        } else {
          return this.$emit('remove') // 空值则通知外部删除
        }
      } else {
        if (v1 === '' || (Array.isArray(v1) && v1.length === 0)) {
          return this.$emit('remove') // 空值则通知外部删除
        }
        result = v1
      }
      this.$emit('change', result, this.useType)
    }
  }
}
</script>
