<template>
  <basic-container>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value" />
      <component :is="componentName" @close="close" />
    </el-tabs>
  </basic-container>
</template>

<script>
import backsyncTemp from './backsyncTemp/backsyncTemp.vue'
import customTemp from './customTemp/customTemp.vue'

export default {
  name: 'LmsLmsAliExpressAliExpresTempProductInfo',
  components: {
    backsyncTemp,
    customTemp
  },
  data() {
    return {
      activeName: 'backsync',
      tabList: [{
        label: '后台同步模板', value: 'backsync', temp: backsyncTemp
      }, {
        label: '自定义规则模板', value: 'custom', temp: customTemp
      }]
    }
  },
  computed: {
    componentName() {
      return this.tabList.find(item => item.value === this.activeName).temp
    }
  },
  methods: {
    close() {
      this.$emit('close', true)
    },
    handleClick(item) {

    }
  }
}
</script>
