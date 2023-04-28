<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <span class="flex-shrink-0">当前PMS类目</span>
      <PmsCategoryTree v-model="pmsCategoryId" />
    </div>
    <div v-if="data.length===0||!pmsCategoryId" class="text-center text-muted my-3">🙂提示：请选择 <b class="text-warning">PMS类目</b> 和 <b class="text-warning">平台/站点</b> </div>
    <AttrPage v-if="show"
              ref="attrPage"
              :data="data"
              :category-id="pmsCategoryId"
              use-remove
              show-category-name
              @remove="onRemove"
    />
  </div>
</template>

<script>
export default {
  name: 'ByCategoryPage',
  components: {
    PmsCategoryTree: () => import('./pmsCategoryTree.vue'),
    AttrPage: () => import('./byAttrPage.vue')
  },
  props: {
    data: Array
  },
  data() {
    return {
      pmsCategoryId: ''
    }
  },
  computed: {
    show() {
      return this.pmsCategoryId && Array.isArray(this.data) && this.data.length > 0
    }
  },
  methods: {
    // 移除一项
    onRemove(...agrs) {
      this.$emit('remove', ...agrs)
    },
    getScrollTop(index) {
      return this.$refs.attrPage.getScrollTop(index)
    }
  }
}
</script>

<style src="../common.scss" lang="scss"></style>
