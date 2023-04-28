<template>
  <el-select v-model="val" @change="onChange">
    <el-option v-for="el in list" :key="el.value" :value="el.value" :label="el.label" />
  </el-select>
</template>

<script>
export default {
  name: 'SelectImgType',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      val: this.value
    }
  },
  computed: {
    list() {
      return [
        { label: '首图', value: 0 },
        { label: '全部图片', value: 1 }
      ]
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.val)
    }
  }
}
</script>
