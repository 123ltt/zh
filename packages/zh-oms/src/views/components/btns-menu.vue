<template>
  <el-dropdown :trigger="trigger" @command="handleCommand">
    <el-button :type="type" :disabled="disabled">
      {{ name }}<i class="el-icon-arrow-down el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <template v-for="item in filterMenus">
        <el-dropdown-item :key="item.name" :command="[item.event, item.params]">{{ item.name }}</el-dropdown-item>
      </template>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default ({
  name: 'BtnsMenu',
  props: {
    disabled: Boolean,
    name: String,
    type: {
      type: String,
      default: 'text'
    },
    trigger: {
      type: String,
      default: 'click'
    },
    menus: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filterMenus() {
      return this.menus.filter(item => item.show)
    }
  },
  methods: {
    handleCommand([event, params]) {
      event(params)
    }
  }
})
</script>
