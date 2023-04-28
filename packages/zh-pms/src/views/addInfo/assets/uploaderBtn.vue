<template>
  <div class="el-upload el-upload--text" @click="onClick">
    <el-button size="small" icon="el-icon-upload">上传文件</el-button>
    <input ref="input" type="file" name="file" multiple="multiple" class="d-none" @change="onSelect">
  </div>
</template>

<script>
import { LIMIT_FILE_SIZE } from '@/config/form'

export default {
  name: 'UploaderBtn',
  methods: {
    onClick() {
      this.$refs.input.click()
    },
    onSelect(evt) {
      const files = []
      const errors = []
      evt.target.files.forEach(file => {
        const [status, maxSize, filetype] = this.checkSize(file)
        if (status) {
          files.push({
            _uid: this.getUid(),
            status: 'ready', // 等待上传 ready, 上传中 uploading, 上传成功 success, 上传失败 fail, 取消上传 cancel
            percent: 0,
            filename: file.name,
            filetype, // image, video, attachment
            link: '', // 图片的网络链接，默认空
            file
          })
        } else {
          errors.push(`${file.name} 不能超过${this.getSize(maxSize)}`)
        }
      })
      if (errors.length > 0) {
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: `<div class="lh-base">${errors.join('<br/>')}</div>`
        })
      }
      evt.target.value = ''
      if (files.length > 0) this.$emit('select', files)
    },
    checkSize(file) {
      if (/^image\/(jpeg|gif|png|bmp|webp)$/i.test(file.type)) {
        return [file.size <= LIMIT_FILE_SIZE.image, LIMIT_FILE_SIZE.image, 'image']
      } else if (/^video\//i.test(file.type)) {
        return [file.size <= LIMIT_FILE_SIZE.video, LIMIT_FILE_SIZE.video, 'video']
      }
      return [file.size <= LIMIT_FILE_SIZE.attachment, LIMIT_FILE_SIZE.attachment, 'attachment']
    },
    getSize(bytes) {
      return (bytes / 1024 / 1024).toFixed(1) - 0 + 'MB'
    },
    getUid() {
      return String(Math.random()).slice(-6) + new Date().getMilliseconds()
    }
  }
}
</script>
