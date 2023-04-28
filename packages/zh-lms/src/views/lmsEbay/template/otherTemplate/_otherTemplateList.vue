<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name">
        <div v-if="item.show">
          <component :is="componentName" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import payTemplateList from './payTemplate/payTemplateList.vue'
import shoppingTemplateList from './shoppingTemplate/shoppingTemplateList.vue'
import refundTemplateList from './refundTemplate/refundTemplateList.vue'
import buyerRequireList from './buyerRequire/buyerRequireList.vue'
import { getConstants } from '@/api/ebay/log'

export default {
  name: 'LmsLmsEbayTemplateOtherTemplateOtherTemplateList',
  components: { payTemplateList, shoppingTemplateList, refundTemplateList, buyerRequireList },
  data() {
    return {
      activeName: 'first',
      tabList: [
        { label: '支付模板', name: 'first', temp: 'payTemplateList', show: true },
        { label: '运输模板', name: 'second', temp: 'shoppingTemplateList', show: false },
        { label: '退货模板', name: 'third', temp: 'refundTemplateList', show: false },
        { label: '买家要求', name: 'fourth', temp: 'buyerRequireList', show: false }
      ]
    }
  },
  computed: {
    componentName() {
      return this.tabList.find(item => item.name === this.activeName).temp
    }
  },
  methods: {
    getConstants() {
      getConstants().then(res => {
        this.getConstants = res.data.constants
      })
    },
    handleClick(tab) {
      this.tabList.forEach(item => {
        item.show = false
        if (item.name === tab.name) {
          item.show = true
        }
      })
    }
  }
}
</script>
