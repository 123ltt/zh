<template>
  <el-slider v-model="current" show-input input-size="mini" class="custom-slider" @input="onChange" />
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      current: this.value
    }
  },
  watch: {
    value(v) {
      this.current = v
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.current)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-slider {
  margin-top: -5px;
  ::v-deep {
    .el-slider__input {
      width: 100px;
    }
    .el-slider__runway.show-input {
      margin-right: 120px;
    }
    .el-slider__input.el-input-number--mini {
      margin-top: 0;
    }
  }
}
</style>
