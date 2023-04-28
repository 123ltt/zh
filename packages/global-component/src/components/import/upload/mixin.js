import { exchangeSize, getBlobUrl } from './util'

export default {
  methods: {
    formEmit() {
      if (this.elFormItem) {
        this.$parent.$emit('el.form.blur')
      }
    },
    // 检查文件大小
    checkSize(file) {
      if (this.size === 0) return true
      if (file.size <= this.size) {
        return true
      } else {
        this.$message.error(`${file.name} 文件大小不能超过 ${exchangeSize(this.size)}`)
        return false
      }
    },
    // beforeUpload 未通过时 移除文件
    onRemove(file, fileList) {
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      if (index > -1) {
        this.fileList.splice(index, 1)
      }
      this.emitUploading(fileList)
    },
    // 只要文件状态发生变化，则去更新uploading
    onChange(file, fileList) {
      if (file.status === 'ready') {
        if (!this.checkMimetype(this.mime, file)) {
          const index = fileList.findIndex(f => f === file)
          fileList.splice(index, 1)
        }
        this.$emit('update:selected', this.$refs.upload.uploadFiles)
        if (!this.$attrs['auto-upload']) {
          this.formEmit()
        }
      }

      fileList.forEach(item => {
        if (item.status === 'ready') {
          item.blobUrl = getBlobUrl(item.raw)
        }
      })
      this.fileList = fileList
      // 文件的可用状态： ready, uploading, success, fail
      this.emitUploading(fileList)
    },
    onError(err, file) {
      this.$message.error(`${file.name} ${err}`)
      this.$emit('on-error')
    },
    // 文件的可用状态： ready, uploading, success, fail
    emitUploading(fileList) {
      const status = fileList.some(item => ['ready', 'uploading'].includes(item.status))
      this.$emit('update:uploading', status)
    },
    // 根据文件名检测类型是否合法
    checkMimetype(mime, file, showMessage = true) {
      if (!mime) return true

      const ext = file.name.match(/\.\w+$/)
      const status = ext && mime.split(',').includes(ext[0].toLowerCase())
      if (!status && showMessage) {
        this.$message.error('不支持该文件类型')
      }
      return status
    },
    // 强制修改协议类型
    forceProtocol(url) {
      if (/^https?$/i.test(this.protocol)) {
        return url.replace(/^https?:\/\//i, this.protocol + '://')
      }
      return url
    }
  }
}
