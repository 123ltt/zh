<template>
  <el-card class="px-0 py-0" shadow="hover" style="height:100%;">
    <div slot="header" class="clearfix" style="height:25px;line-height:25px;display:flex;">

      <div v-for="item in menu"
           :key="item.id"
           :class="[activeIndex=== item.id ?'activeClass':'','hoverClass']"
           @click="changeIndex(item.id)"
      ><span style="padding:5px 10px;display:dislink-block">{{ item.label }}</span></div>
    </div>
    <!-- 包裹限制 -->
    <div v-if="activeIndex === 1" class="packageLimit">
      <packageLimit v-bind="$attrs" />
    </div>
    <!-- 属性限制 -->
    <div v-if="activeIndex === 2">
      <productLimit v-bind="$attrs" />
    </div>
    <!-- 邮编限制 -->
    <div v-if="activeIndex === 3">
      <postcodeLimit v-bind="$attrs" />
    </div>
  </el-card>

</template>
<script>
import postcodeLimit from './postcodeLimit'
import packageLimit from './packageLimit'
import productLimit from './productLimit'
export default {
  name: 'LimitInfo',
  components: {
    postcodeLimit,
    packageLimit,
    productLimit
  },
  data() {
    return {
      activeIndex: 1,
      menu: [
        { id: 1, label: '包裹限制' },
        { id: 2, label: '商品限制' },
        { id: 3, label: '邮编限制' }
      ]
    }
  },

  methods: {
    changeIndex(id) {
      this.activeIndex = id
    }

  }

}
</script>
<style lang="scss" scoped>
.activeClass{
  color:  $--color-primary;
  border-radius: 6px;
  background:rgba( $--color-primary,0.2)
}
::v-deep .el-card__header{
  background:rgb(243,245,246)
}
::v-deep .el-cascader__search-input {
  margin:0px 6px !important
}
.hoverClass:hover{
  cursor:pointer;
  color:$--color-primary;
}
::v-deep .el-card__body{
  height: calc(100% - 61px);
  overflow: auto;
}
</style>
