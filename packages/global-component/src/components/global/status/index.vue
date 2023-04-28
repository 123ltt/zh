<template>
  <div class="status-wrap">
    <span class="status" :style="{backgroundColor: bgc}" />
    <slot v-if="$slots.default" />
    <span v-else>{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'GStatus',
  props: {
    // 状态的文本
    name: String,
    // 自定义状态的颜色
    color: String,
    // 状态颜色名称
    status: {
      type: String,
      validator(val) {
        return ['gray', 'green', 'red', 'blue', 'yellow'].includes(val)
      }
    }
  },
  computed: {
    bgc() {
      if (this.color) return this.color
      // 色值含义：无效、有效、审核失败、审核中、无效待审核
      const colorMap = { gray: '#606266', green: '#13CE66', red: '#FF4848', blue: '#1890FF', yellow: '#FAAD14' }
      return colorMap[this.status] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.status-wrap {
  .status {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-right: 2px;
    transform: translateY(-50%);
  }
}
</style>
