<template>
  <div :class="{'d-flex flex-wrap':cols>1}">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'GListGroup',
  provide() {
    return {
      listGroup: this
    }
  },
  props: {
    // 显示的列数
    cols: {
      type: Number,
      default: 1
    },
    // 设置所有item标题宽度（需包含单位），支持单位尺寸、auto、none
    labelWidth: {
      type: String,
      default: 'auto'
    },
    // 标题的对齐方式，支持：靠左、居中、靠右
    labelAlign: {
      type: String,
      default: 'right'
    },
    // 标题与内容的分隔符，默认`：`
    sep: {
      type: String,
      default: '：'
    },
    // 给所有item添加class
    itemClass: String,
    // 给所有item添加style
    itemStyle: Object
  },
  data() {
    return {
      maxLabelWidth: ''
    }
  },
  methods: {
    // item组件中调用该方法
    updateMaxLabelWidth(val) {
      if (this.maxLabelWidth < val) {
        this.maxLabelWidth = val
      }
    }
  }
}
</script>
