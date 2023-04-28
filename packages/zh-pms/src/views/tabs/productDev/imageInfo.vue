<template>
  <div class="imageInfo">
    <el-card>
      <div slot="header" class="fw-bold">图片列表</div>
      <upload-image :images.sync="images"
                    :http-request="httpRequest"
                    :limit="limit"
                    :size="maxImageSize"
                    :uploading.sync="imageUploading"
                    :disabled="!isShowBtn"
      />
      <div v-if="images.length===0" class="text-center text-muted">暂无数据</div>
    </el-card>
    <el-card>
      <div slot="header" class="fw-bold">附件列表</div>
      <upload-file :files.sync="attachments"
                   :http-request="httpRequest"
                   :size="maxFileSize"
                   :uploading.sync="attachmentUploading"
                   :disabled="!isShowBtn"
      />
      <div v-if="attachments.length===0" class="text-center text-muted">暂无数据</div>
    </el-card>
    <el-row v-if="isShowBtn">
      <el-col :span="24" class="text-end">
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { LIMIT, LIMIT_FILE_SIZE } from '@/config/form'
import { updateImages } from '@/api/myAudit'
import httpRequest from '@/api/common/upload'
import { UploadImage, UploadFile } from 'global-components'

export default {
  name: 'ImageInfo',
  components: { UploadImage, UploadFile },
  props: {
    id: String,
    isAudit: {
      type: Boolean,
      default: true
    },
    formData: Object
  },
  data() {
    return {
      httpRequest,
      limit: LIMIT.maxUploadImages,
      maxImageSize: LIMIT_FILE_SIZE.image,
      maxFileSize: LIMIT_FILE_SIZE.attachment,
      imageUploading: false,
      images: [],
      attachments: [],
      attachmentUploading: false,
      ifCanUpdate: false
    }
  },
  computed: {
    isShowBtn() {
      const { isAudit, ifCanUpdate } = this
      if (!isAudit) return false
      return ifCanUpdate
    }
  },
  created() {
    const { images, attachments, ifCanUpdate } = this.formData
    this.ifCanUpdate = ifCanUpdate
    this.images = (images || []).map(img => {
      return { name: img.imageName, primary: img.isPrime, url: img.imageUrl }
    })
    this.attachments = attachments || []
  },
  methods: {
    save() {
      if (this.imageUploading || this.attachmentUploading) return this.$message.error('文件正在上传中，请稍后')
      if (!this.images.length) return

      const images = this.images.map(file => {
        return {
          isPrime: Number(file.primary),
          imageUrl: file.url,
          imageName: file.name
        }
      })

      const attachments = this.attachments.map(({ name, url }) => ({ name, url }))

      updateImages(this.id, { images, attachments }).then(res => {
        this.$message.success(res.msg)
        this.$listeners.update(true)
        // this.$emit('close', false)
      })
    }
  }
}
</script>
