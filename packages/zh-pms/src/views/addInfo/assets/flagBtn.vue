<template>
  <el-button size="mini" type="text" class="fs-5 mx-0" :class="klass" @click="toggle" />
</template>

<script>
export default {
  name: 'FlagBtn',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    icon: String
  },
  data() {
    return {
      model: this.value
    }
  },
  computed: {
    klass() {
      return ['el-icon-' + this.icon, this.model ? 'text-primary fw-bold' : 'text-muted']
    }
  },
  watch: {
    value(val) {
      this.model = val
    }
  },
  methods: {
    toggle() {
      this.model = !this.model
      this.$emit('input', this.model)
      this.$emit('click', this.model)
    }
  }
}
</script>
