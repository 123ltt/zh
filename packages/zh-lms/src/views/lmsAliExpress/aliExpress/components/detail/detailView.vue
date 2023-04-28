<template>
  <el-card class="box-card">
    <div v-if="detail">
      <div v-for="(item, index) in detail.moduleList" :key="index">
        <template v-if="item.type === 'text-image'">
          <h1>图文</h1>
          <el-image v-for="(img, i) in item.images" :key="i+'1'" :src="img.url" />
          <div v-for="(text, ind) in item.texts" :key="ind">
            <div class="fs-3">{{ text.title }}</div>
            <p>{{ text.content }}</p>
          </div>
        </template>
        <template v-if="item.type === 'text'">
          <h1>文字</h1>
          <div v-for="(text, ind) in item.texts" :key="ind">
            <div class="fs-3">{{ text.title }}</div>
            <p>{{ text.content }}</p>
          </div>
        </template>
        <template v-if="item.type === 'html'">
          <h1>富文本</h1>
          <div v-html="item.html.content" />
        </template>
        <template v-if="item.type === 'productTempHtml'">
          <h1>产品信息模板</h1>
          <div v-if="item.html" v-html="item.html.content" />
        </template>
        <template v-if="item.type === 'image'">
          <h1>图片</h1>
          <ul class="el-upload-list el-upload-list--picture-card">
            <li v-for="(img, imgIndex) in item.images" :key="imgIndex" class="el-upload-list__item">
              <g-thumb :width="110"
                       :height="110"
                       :url="img.url"
              />
            </li>
          </ul>
        </template>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'DetailView',
  props: {
    detail: {
      type: Object,
      default: () => ({
        version: '2.0.0',
        moduleList: []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card{
  box-shadow: 0 2px 12px 0 #eee !important;
  ::v-deep .el-upload-list__item {
    width: 110px;
    height: 110px;
  }
}
</style>
