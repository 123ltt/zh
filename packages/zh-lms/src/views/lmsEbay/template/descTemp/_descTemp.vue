<template>
  <basic-container>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name" />
      <component :is="componentName" @close="close" />
    </el-tabs>
  </basic-container>
</template>

<script>
import tagList from './tag/tagList.vue'
import tagContList from './tagCont/tagContList.vue'
import tempList from './template/templateList.vue'
import tempShopList from './tempShop/tempShopsList.vue'
export default {
  name: 'LmsLmsEbayTemplateDescTempDescTemp',
  components: {
    tagList,
    tagContList,
    tempList,
    tempShopList
  },
  data() {
    return {
      activeName: 'tag',
      tabList: [{
        label: '标签列表', name: 'tag', temp: 'tagList'
      }, {
        label: '标签内容列表', name: 'tagCont', temp: 'tagContList'
      }, {
        label: '模板列表', name: 'temp', temp: 'tempList'
      }, {
        label: '模板分配列表', name: 'tempShop', temp: 'tempShopList'
      }]
    }
  },
  computed: {
    componentName() {
      return this.tabList.find(item => item.name === this.activeName).temp
    }
  },
  methods: {
    close() {
      this.$emit('close', true)
    }
  }
}
</script>
