<template>
  <el-upload ref="upload"
             :disabled="isDisabled"
             :file-list="defaultFiles"
             :accept="mime"
             :action="action"
             :http-request="_httpRequest"
             :limit="limit"
             :on-error="onError"
             :on-success="onSuccess"
             :on-change="onChange"
             :before-upload="onBeforeUpload"
             :on-remove="onRemove"
             :on-exceed="onExceed"
             :multiple="multiple"
             :class="{disabled:isDisabled}"
             v-bind="$attrs"
             class="upload-file"
  >
    <template v-if="!isDisabled">
      <el-button :size="buttonSize" plain type="primary">{{ buttonText }}</el-button>
      <slot :info="{size, displaySize}">
        <span v-if="size>0" slot="tip" class="el-upload__tip">上传文件不超过{{ displaySize }}</span>
      </slot>
    </template>
    <div slot="file" slot-scope="{ file }" class="file-item px-1">
      <div class="d-flex justify-content-between align-items-center">
        <div class="file-title el-icon-document">
          {{ file.name }}
        </div>
        <div v-show="file.status==='success'" class="action-btns">
          <i class="el-icon-circle-check mx-2" />
          <a v-if="download" :href="file.url" target="_blank" class="el-icon-download mx-2" />
          <a v-if="!isDisabled" href="javascript:;" class="el-icon-delete mx-2" @click="onRemoveHandler(file)" />
        </div>
      </div>
      <el-progress v-if="file.status==='uploading'" :percentage="file.percentage" :show-text="false" :stroke-width="1" />
    </div>
  </el-upload>
</template>

<script>
import { checkType, exchangeSize } from '../util'
import mixin from '../mixin'

export default {
  name: 'UploadFile',
  mixins: [mixin],
  inject: {
    elForm: {
      default: null
    },
    elFormItem: {
      default: null
    }
  },
  props: {
    files: { validator: checkType('UploadFile', 'files'), default: () => [] },
    action: {
      type: String,
      default: ''
    },
    httpRequest: {
      required: true,
      type: Function
    },
    responseHandler: Function,
    // 是否是只读（只能查看列表，不能上传和删除）
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 允许上传的文件类型
    mimetype: {
      type: String,
      default: undefined
    },
    // 是否是视频，为true时会忽略mimetype的设置
    video: {
      type: Boolean,
      default: false
    },
    // 上传文件数量限制，0不限制
    limit: {
      type: Number,
      default: 0
    },
    // 单个文件字节数限制，0不限制，单位: b
    size: {
      type: Number,
      default: 0
    },
    // 是否支持选择多个文件
    multiple: {
      type: Boolean,
      defualt: false
    },
    // 上传按钮的大小
    buttonSize: {
      type: String,
      default: 'small'
    },
    // 上传按钮的文本
    buttonText: {
      type: String,
      default: '点击上传'
    },
    // 是否显示下载按钮
    download: {
      type: Boolean,
      default: true
    },
    // 是否有正在上传的文件
    uploading: Boolean,
    // 强制使用 http 或 https，默认不处理
    protocol: String,
    // 系统名称，对应上传接口的 `fileType` 字段
    appName: String
  },
  data() {
    return {
      defaultFiles: [...this.files],
      fileList: [],
      uploadedFiles: []
    }
  },
  computed: {
    mime() {
      if (this.video) return '.avi,.mov,.rmvb,.rm,.flv,.mp4,.3gp'
      return this.mimetype
    },
    displaySize() {
      return exchangeSize(this.size)
    },
    isDisabled() {
      return this.readonly || this.disabled || (this.elForm || {}).disabled
    },
    _httpRequest() {
      return options => {
        this.httpRequest(Object.assign(options, { appName: this.appName }))
      }
    }
  },
  watch: {
    files(newVal, oldVal) {
      if (Array.isArray(newVal) && newVal.length === 0 && oldVal.length > 0) {
        this.fileList = []
        this.uploadedFiles = []
        this.defaultFiles = []
        this.$refs.upload.clearFiles()
        this.emitFiles()
      }
    }
  },
  mounted() {
    this.fileList = this.$refs.upload.uploadFiles
    this.uploadedFiles = this.getUploadedFiles(this.fileList)

    if (this.limit === 1) {
      this.$el.querySelector('input[type=file]').addEventListener('input', (e) => {
        if (this.checkMimetype(this.mime, e.target.files[0], false)) {
          this.fileList.length = 0
        }
      })
    }
  },
  methods: {
    emitFiles() {
      this.$emit('update:files', this.uploadedFiles)
    },
    getUploadedFiles(fileList = []) {
      return fileList
        .filter(item => item.status === 'success')
        .map(item => {
          return Object.assign({}, item, {
            url: item.response?.data || item.url
          })
        })
    },
    onSuccess(response, file, fileList) {
      const res = typeof this.responseHandler === 'function' ? this.responseHandler(response) : response
      fileList.forEach(item => {
        if (item.uid === file.uid) {
          item.url = this.forceProtocol(res?.data || '')
        }
      })
      this.fileList = fileList
      this.uploadedFiles = this.getUploadedFiles(fileList)
      this.emitFiles()

      this.emitUploading(fileList)
      this.formEmit()
      this.$emit('on-success', response)
    },
    onRemoveHandler(file) {
      const uid = file.uid
      const index = this.fileList.findIndex(item => item.uid === uid)
      if (index === -1) return console.warn('未找到删除的文件')
      this.fileList.splice(index, 1)
      this.uploadedFiles = this.uploadedFiles.filter(item => item.uid !== uid)
      this.emitFiles()
    },
    onBeforeUpload(file) {
      if (!this.checkSize(file) || !this.checkMimetype(this.mime, file)) {
        return Promise.reject(new Error())
      }
    },
    onExceed() {
      this.$message.error(`最多只能上传${this.limit}个文件`)
    },
    onChange(file, files) {
      if (file.status === 'ready') {
        if (!this.checkMimetype(this.mime, file)) {
          const index = files.findIndex(f => f === file)
          files.splice(index, 1)
        }
        this.$emit('update:selected', this.$refs.upload.uploadFiles)
        if (!this.$attrs['auto-upload']) {
          this.formEmit()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/element-var.scss';

.upload-file.disabled {
  ::v-deep {
    .el-upload {
      display: none;
    }
  }
}

.upload-file ::v-deep {
  .el-upload-list__item {
    margin-top: 0;
  }
}

.el-upload__tip {
  margin-left: 1em;
}
.file-item {
  position: relative;
  .file-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    font-size: 1rem;
    line-height: 1.4;
  }
  .action-btns {
    i {
      color: $--color-success;
    }
    a {
      display: none;
    }
  }
  &:hover {
    .action-btns {
      i {
        display: none;
      }
      a {
        display: inline;
      }
    }
  }
  ::v-deep {
    .el-progress--line {
      top: unset;
      bottom: 0px;
    }
  }
}
</style>
