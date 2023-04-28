<template>
  <div ref="textRef" class="text-ellipsis-tip">
    <template v-if="!isOverflow">
      <span v-if="!$slots.default">{{ content }}</span>
      <slot />
    </template>
    <el-tooltip v-else ref="tooltipRef" :content="content" :placement="placement" v-bind="$attrs">
      <span v-if="!$slots.default">{{ content }}</span>
      <div v-else><slot /></div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TextEllipsisTipIndex',
  props: {
    content: {
      type: String,
      required: true
    },
    line: {
      type: Number,
      validator(val) {
        if (val < 0 || val % 1 !== 0) throw new Error(`line：${val} 必须为正整数`)
        return true
      },
      default: 1
    },
    tooltipMaxWidth: {
      type: String,
      default: '30em'
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return {
      isOverflow: false
    }
  },
  mounted() {
    this.$nextTick(this.compare)
  },
  methods: {
    compare() {
      const ref = this.$refs.textRef
      const refStyles = window.getComputedStyle(ref, null)
      if (parseInt(refStyles.lineHeight) * this.line < parseInt(refStyles.height)) {
        this.$nextTick(() => {
          this.isOverflow = true
          ref.style['-webkit-line-clamp'] = this.line

          this.$nextTick(() => {
            if (this.$refs.tooltipRef) {
              this.$refs.tooltipRef.$refs.popper.style['max-width'] = this.tooltipMaxWidth
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-ellipsis-tip{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
