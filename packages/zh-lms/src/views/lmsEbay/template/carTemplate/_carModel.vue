<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value" />
      <component :is="componentName" @close="close" />
    </el-tabs>
  </basic-container>
</template>

<script>
import tempModel from './tempModel/tempModel.vue'
import skuModel from './skuModel/skuModel.vue'

export default {
  name: 'LmsLmsEbayTemplateCarTemplateCarModel',
  components: {
    tempModel,
    skuModel
  },
  data() {
    return {
      activeName: 'backsync',
      tabList: [{
        label: '车型库模板列表', value: 'backsync', temp: tempModel
      }, {
        label: 'SKU车型库', value: 'custom', temp: skuModel
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
    }
  }
}
</script>
