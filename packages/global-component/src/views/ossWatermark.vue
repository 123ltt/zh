<template>
  <div>
    <ossWatermark :images="images" @ok="onChange" />
    <el-button @click="addImages">添加图片</el-button>
  </div>
</template>

<script>
import ossWatermark from '@/components/import/oss-watermark/index.vue'
export default {
  components: { ossWatermark },
  data() {
    return {
      images: []
    }
  },
  methods: {
    onChange(val) {
      console.log(val)
    },
    addImages() {
      this.images = [
        'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/00ea0cfda2659fdb947b4b93d5bc640e.png',
        'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/048e205f616df65cf3dc1d85618f5d14.png'
      ]
    }
  }
}
</script>
