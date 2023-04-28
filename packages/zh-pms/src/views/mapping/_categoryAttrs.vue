<template>
  <basic-container class="d-flex">
    <div class="flex-grow-1 me-2 h-100" :style="{width:`calc(100% - ${rightWidth})`}">
      <el-tabs v-model="activeTab" type="card" @tab-click="onTabClick">
        <el-tab-pane v-for="tab in tabs"
                     :key="tab.name"
                     :label="tab.label"
                     :name="tab.name"
                     lazy
        />
      </el-tabs>
      <div ref="main" class="overflow-auto position-relative cate-attr-container" style="height:calc(100% - 52px)">
        <BySpuPage v-if="activeTab==='a'" :plateform-site-list="list" @resetTree="onResetTree" />
        <ByCategoryPage v-if="activeTab==='b'" ref="attrConf" :data="list" @remove="onRemoveItem" />
        <ByAttrPage v-else-if="activeTab==='c'" ref="attrConf" :data="list" />
      </div>
    </div>
    <div :style="{width:rightWidth}">
      <PlatformTree :key="activeTab"
                    ref="platformTree"
                    class="h-100 border-start px-2 flex-shrink-0"
                    :multiple="['b'].includes(activeTab)"
                    @check="onCheck"
                    @nodeClick="onNodeClick"
      />
    </div>
  </basic-container>
</template>

<script>
import PlatformTree from './components/platformTree.vue'

export default {
  name: 'PmsMappingCategoryAttrs',
  components: {
    PlatformTree,
    BySpuPage: () => import('./components/bySpuPage.vue'),
    ByAttrPage: () => import('./components/byAttrPage.vue'),
    ByCategoryPage: () => import('./components/byCategoryPage.vue')
  },
  data() {
    return {
      activeTab: 'a',
      list: [],
      rightWidth: '200px'
    }
  },
  computed: {
    tabs() {
      return [
        { label: '按SPU配置', name: 'a' },
        { label: '按类目配置', name: 'b' },
        { label: '按属性配置', name: 'c' }
      ]
    }
  },
  methods: {
    onTabClick() {
      this.list = []
    },
    onCheck(codePath) {
      this.list = codePath.map(item => {
        const codes = [item.platformCode, item.siteCode].filter(Boolean)
        const titles = [item.platformName, item.siteName].filter(Boolean)
        return {
          id: codes.join(','),
          platformCode: item.platformCode,
          siteCode: item.siteCode,
          title: titles.join(' - ')
        }
      })
    },
    onNodeClick(data) {
      // 点击节点时自动定位到对应的属性配置
      const codes = [data.platformCode, data.siteCode].filter(Boolean)
      const index = this.list.findIndex(item => item.id === codes.join(','))
      if (index > -1) {
        const val = this.$refs.attrConf.getScrollTop(index)
        val >= 0 && this.$refs.main.scrollTo({
          top: val,
          left: 0,
          behavior: 'smooth'
        })
      }
    },
    onRemoveItem(params) {
      const { platformCode, siteCode } = params
      this.list = this.list.filter(item => {
        return !(item.platformCode === platformCode && item.siteCode === siteCode)
      })

      const key = [platformCode, siteCode].filter(Boolean).join('-')
      this.$refs.platformTree.removeChecked([key])
    },
    onResetTree() {
      this.list = []
      this.$refs.platformTree.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.cate-attr-container ::v-deep {
  .card-mapping {
    .el-card__body {
      padding: 0.5rem;
    }
  }
}
</style>
