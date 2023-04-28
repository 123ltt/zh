<template>
  <div :style="itemStyle">
    <div class="d-flex" :class="innerClass">
      <label :style="labelStyle" :class="labelClass" class="flex-shrink-0">{{ label }}</label>
      <div>{{ sepStr }}</div>
      <div class="flex-grow-1 overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GListGroupItem',
  inject: {
    listGroup: { default: null },
    gTable: { default: null }
  },
  props: {
    // 标题
    label: String,
    // 标题宽度
    labelWidth: String,
    // 标题对齐方式（GListGroup的`labelAlign`优先级高）
    labelAlign: {
      type: String,
      default: 'right'
    },
    // 标题与内容的分隔符（高于GListGroup的`sep`优先级）
    sep: String
  },
  computed: {
    sepStr() {
      return this.sep || this.listGroup?.sep || '：'
    },
    itemStyle() {
      if (!this.listGroup) return {}

      const style = {}
      const { cols, itemStyle = {} } = this.listGroup
      if (cols > 1) {
        style.width = (100 / cols) + '%'
      }
      return Object.assign(style, itemStyle)
    },
    innerClass() {
      if (!this.listGroup) return {}

      const { itemClass } = this.listGroup
      const classes = ['mx-1']
      if (itemClass) {
        classes.push(itemClass)
      }
      if (!itemClass && this.gTable === null) {
        classes.push('py-2')
      }
      return classes
    },
    labelClass() {
      const align = { left: 'text-start', right: 'text-end', center: 'label-center' }[this.labelAlign || this.listGroup?.labelAlign]
      const classes = []

      if (align) classes.push(align)
      if (this.sepStr.trim() === '') classes.push('me-1')
      return classes
    },
    labelStyle() {
      const { labelWidth } = this.listGroup || {}
      let width
      if (this.labelWidth) {
        width = this.labelWidth
      } else if (labelWidth === 'auto') {
        width = this.listGroup.maxLabelWidth + 'px'
      } else if (labelWidth !== 'none') {
        width = labelWidth
      }

      return { width }
    }
  },
  mounted() {
    if (this.listGroup && this.listGroup.labelWidth === 'auto') {
      this.listGroup.updateMaxLabelWidth(this.$el.firstElementChild.firstElementChild.offsetWidth)
    }
  }
}
</script>

<style lang="scss" scoped>
.label-center {
  text-align-last: justify;
}
</style>
