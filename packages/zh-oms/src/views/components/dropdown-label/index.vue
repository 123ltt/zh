<template>
  <div class="d-flex">
    <el-dropdown :class="labelClass" :style="{width}" :trigger="trigger">
      <span style="cursor: default;">{{ filterNmae }}<i class="el-icon-arrow-down el-icon--right" /></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in list"
                          :key="item.value"
                          @click.native="$emit('input', item.value)"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'DropDownLabel',
  props: {
    value: [String, Number],
    width: {
      type: String,
      default: '100%'
    },
    labelClass: String,
    trigger: {
      type: String,
      default: 'click'
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filterNmae({ list, value }) {
      const res = list.find(item => item.value === value) || {}
      return res.label || ''
    }
  }
}
</script>
