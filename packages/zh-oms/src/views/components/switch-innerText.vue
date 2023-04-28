<template>
  <div class="inner-text">
    <el-switch v-model="switchValue"
               v-bind="$attrs"
               :inactive-value="inactiveValue"
               :active-value="activeValue"
               :inactive-text="inactiveText"
               :active-text="activeText"
               :active-color="activeColor"
               :inactive-color="inactiveColor"
               class="inner-text-switch"
               @change="change"
    />
  </div>
</template>

<script>
export default {
  name: 'SwitchInnerText',
  props: {
    value: [String, Number, Boolean],
    inactiveValue: {
      type: [String, Number, Boolean],
      default: 0
    },
    activeValue: {
      type: [String, Number, Boolean],
      default: 1
    },
    activeColor: String,
    inactiveColor: String,
    inactiveText: {
      type: String,
      default: '否'
    },
    activeText: {
      type: String,
      default: '是'
    }
  },
  data() {
    return {
      switchValue: 1
    }
  },
  watch: {
    value(val) {
      this.switchValue = val
    }
  },
  created() {
    this.switchValue = this.value
  },
  methods: {
    change(type) {
      this.$emit('input', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-text{
   // elementui开关按钮-文字在里面显示
  ::v-deep .inner-text-switch {
    .el-switch__label *{
      font-size: 12px;
    }
    .el-switch__label--left {
      position: relative;
      left: 45px;
      color: #fff;
      z-index: -1111;
    }
    .el-switch__core {
      width: 50px !important;
    }
    .el-switch__label--right {
      position: relative;
      right: 46px;
      color: #fff;
      z-index: -1111;
    }
    .el-switch__label--right.is-active {
      z-index: 1111;
      color: #fff !important;
    }
    .el-switch__label--left.is-active {
      z-index: 1111;
      color: #9c9c9c !important;
    }
  }
}

</style>
