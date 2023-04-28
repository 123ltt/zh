<template>
  <div class="avue-group__header mb-0">
    <h1 class="avue-group__title">{{ title }}</h1>
  </div>
</template>
<script>
export default {
  name: 'CollapseTitle',
  props: {
    title: String
  }
}
</script>
<style lang="scss"  scoped>
.avue-group__header{
  height: 30px;
  line-height: 30px;
  .avue-group__title {
    font-size: 14px;
  }
}
</style>
