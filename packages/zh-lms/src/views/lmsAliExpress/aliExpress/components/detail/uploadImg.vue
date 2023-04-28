<template>
  <div>
    <div class="tips lh-sm">图片宽度与高度不能小于260px，支持jpg,png格式，单张图片不超过2MB，最多上传10张图片</div>
    <upload-image :images.sync="imgShowList"
                  :http-request="httpRequest"
                  :limit="limit"
                  :size="maxImageSize"
                  :uploading.sync="imageUploading"
                  :is-primary="false"
                  :primary="false"
                  class="upload-img"
    />
  </div>
</template>

<script>
import { LIMIT, LIMIT_FILE_SIZE } from '@/config/form'
import { UploadImage } from 'global-components'
import httpRequest from '@/api/common/upload'
import { imageUrlObj } from './detail.js'
export default {
  name: 'UploadImg',
  components: { UploadImage },
  props: {
    images: Array
  },
  data() {
    return {
      imgShowList: [],
      httpRequest,
      limit: LIMIT.maxUploadImages,
      maxImageSize: LIMIT_FILE_SIZE.image,
      maxFileSize: LIMIT_FILE_SIZE.attachment,
      imageUploading: false
    }
  },
  watch: {
    images(list) {
      if (list.length !== this.imgShowList.length) {
        this.imgShowList = this.images
      }
    },
    imgShowList(list) {
      const images = []
      list.forEach(item => {
        images.push(Object.assign(imageUrlObj(), { url: item.url }))
      })
      this.$emit('update:images', images)
    }
  },
  created() {
    this.imgShowList = this.images
  }
}
</script>

<style lang="scss" scoped>
.tips{
  color: $--color-info
}
.upload-img{
  ::v-deep .upload-button i{
    width: 80px !important;
    height: 80px !important;
  }
  ::v-deep .el-image{
    width: 80px !important;
    height: 80px !important;
  }
}
</style>
