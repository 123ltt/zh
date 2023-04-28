<template>
  <OssWatermark
    ref="OssWatermark"
    :images="images"
    :http-request="httpRequest"
    :text-config="textConfig"
    @ok="ok"
  />
</template>

<script>

import { OssWatermark } from 'global-components'
import upload from '@/api/common/upload'
export default {
  components: { OssWatermark },
  data() {
    return {
      httpRequest: upload,
      images: [
        'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/00ea0cfda2659fdb947b4b93d5bc640e.png',
        'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/048e205f616df65cf3dc1d85618f5d14.png'
      ],
      textConfig: {
        content: '我的店铺名称'
      }
    }
  },
  mounted() {
    // 重写清除水印方法关闭modal
    const onReset = this.$refs.OssWatermark.onReset
    this.$refs.OssWatermark.onReset = () => {
      onReset()
      this.$parent.$emit('close')
    }
  },
  methods: {
    ok(val) {
      this.$parent.$emit('close', val)
    }
  }
}
</script>

<style>

</style>
