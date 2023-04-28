<template>
  <div class="upload-image-wrap">
    <component :is="(!isDisabled&&dragable)?'draggable':'div'"
               v-model="fileList"
               class="d-flex flex-wrap"
               draggable=".ui-thumb-wrap"
               @change="onMove"
    >
      <el-upload v-show="!isDisabled"
                 ref="upload"
                 slot="header"
                 :action="action"
                 :http-request="_httpRequest"
                 :accept="acceptMimetype"
                 :auto-upload="true"
                 :file-list="defaultImages"
                 :on-error="onError"
                 :on-success="onSuccess"
                 :on-change="onChange"
                 :before-upload="onBeforeUpload"
                 :on-remove="onRemove"
                 :on-exceed="onExceed"
                 :limit="limit"
                 :multiple="multiple"
                 :disabled="isDisabled"
                 :show-file-list="false"
                 class="upload-button m-1 rounded-3"
      >
        <template v-if="avatar">
          <i v-if="fileList.length===0" class="el-icon-plus" />
          <div v-else class="ui-thumb-wrap">
            <v-item :file="Object.assign({},fileList[0])" v-bind="$props" @remove="onRemoveHandler" />
          </div>
        </template>
        <i v-else class="el-icon-plus" />
      </el-upload>
      <template v-if="!avatar">
        <div v-for="file in fileList"
             :key="file.uid"
             class="ui-thumb-wrap position-relative m-1 border rounded-3 overflow-hidden"
        >
          <v-item :file="Object.assign({},file)"
                  :disabled="isDisabled"
                  v-bind="$props"
                  @setPrimary="setPrimary"
                  @remove="onRemoveHandler"
          />

        </div>
      </template>
    </component>
  </div>
</template>

<script>
import { getImageDimension, checkType } from '../util'
import draggable from 'vuedraggable'
import mixin from '../mixin'
import VItem from './item.vue'

export default {
  name: 'UploadImage',
  components: { draggable, VItem },
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
    images: { validator: checkType('UploadImage', 'images') },
    // 上传图片地址
    action: {
      type: String,
      default: ''
    },
    // 自定义上传请求方法
    httpRequest: {
      required: true,
      type: Function
    },
    responseHandler: Function,
    // 图片的大小。默认为`0`不限制
    size: {
      type: Number,
      default: 0
    },
    // 图片的尺寸 [宽, 高]
    dimension: {
      validator(v) {
        if (!Array.isArray(v)) return false
        return v.length === 2 && v.every(item => typeof item === 'number')
      }
    },
    // 队列上传状态
    uploading: {
      type: Boolean,
      default: false
    },
    // 最大允许上传个数
    limit: Number,
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否禁用（即是否只读）
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否需要主图功能
    primary: {
      type: Boolean,
      default: true
    },
    // 是否启用拖拽排序
    dragable: {
      type: Boolean,
      default: false
    },
    // 是否显示删除按钮
    isRemove: {
      type: Boolean,
      default: true
    },
    // 是否显示设置主图按钮
    isPrimary: {
      type: Boolean,
      default: true
    },
    // 是否显示查看原图按钮
    isRaw: {
      type: Boolean,
      default: true
    },
    // 是否显示图片名
    isFilename: {
      type: Boolean,
      default: true
    },
    // 是否启用预览图
    isPreview: {
      type: Boolean,
      default: true
    },
    // 上传头像模式（即只能上传一张图片）
    avatar: {
      type: Boolean,
      default: false
    },
    // 是否可以自动设置主图（非手动点击设置主图按钮），返回true表示可以
    canPrimary: {
      type: Function,
      default: () => true
    },
    // 强制使用 http 或 https，默认不处理
    protocol: String,
    // 系统名称，对应上传接口的 `fileType` 字段
    appName: String
  },
  data() {
    return {
      acceptMimetype: '.jpg,.jpeg,.png,.bmp,.webp,.gif',
      defaultImages: [...this.images],
      fileList: [],
      uploadedFiles: [],
      cacheImages: null,
      cacheDimension: {} // 缓存图片的尺寸
    }
  },
  computed: {
    /** @type {boolean} */
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    _httpRequest() {
      return options => {
        this.httpRequest(Object.assign(options, { appName: this.appName }))
      }
    }
  },
  watch: {
    images(newVal, oldVal) {
      if (newVal !== this.cacheImages && Array.isArray(newVal) && newVal.length === 0 && oldVal.length > 0) {
        this.fileList = []
        this.uploadedFiles = []
        this.defaultImages = []
        this.$refs.upload.clearFiles()
        this.emitImages()
      }
    }
  },
  mounted() {
    this.fileList = this.$refs.upload.uploadFiles
    this.uploadedFiles = this.getUploadedFiles(this.fileList)
  },
  methods: {
    emitImages() {
      this.$emit('update:images', this.uploadedFiles)
    },
    getUploadedFiles(fileList = []) {
      return fileList
        .filter(item => item.status === 'success')
        .map(item => {
          return Object.assign({}, item, {
            url: item.response?.data || item.url,
            primary: item.primary || false
          })
        })
    },
    onSuccess(response, file, fileList) {
      const res = typeof this.responseHandler === 'function' ? this.responseHandler(response) : response
      fileList.forEach(item => {
        if (item.uid === file.uid) {
          item.name = item.name.replace(/(\.[a-z\d]+)$/, `_${this.cacheDimension[file.uid]}$1`)
          delete this.cacheDimension[file.uid]
          item.url = this.forceProtocol(res?.data || '')
        }
      })
      this.fileList = fileList
      this.uploadedFiles = this.getUploadedFiles(fileList)
      this.setPrimary()

      this.emitUploading(fileList)
      this.formEmit()
      this.$emit('on-success', response)
    },
    setPrimary(uid) {
      if (this.primary) {
        // 设置主图
        if (uid) {
          let index
          this.uploadedFiles.forEach(item => {
            item.primary = item.uid === uid
          })
          this.fileList.forEach((item, i) => {
            if (item.uid === uid) {
              index = i
            }
            item.primary = item.uid === uid
          })
          this.fileList.splice(index, 1, this.fileList[index]) // 触发vue响应式更新ui
          this.$emit('primary', this)
        } else if (this.uploadedFiles.length > 0 && this.canPrimary()) {
        // 初始化主图 或 主图被删除
        // 如果主图存在则不作任何处理，主图不存在则将第一张已上传的设置为主图
          const existPrimary = this.uploadedFiles.some(item => item.primary)
          if (!existPrimary) {
            const primaryItem = this.uploadedFiles[0]
            primaryItem.primary = true
            this.fileList.find(item => {
              if (item.uid === primaryItem.uid) {
                item.primary = true
                return true
              }
              return false
            })
          }
        }
      }
      this.emitImages()
    },
    onRemoveHandler(uid) {
      const index = this.fileList.findIndex(item => item.uid === uid)
      if (index === -1) return console.warn('未找到删除的图片')
      const removedIsPrimary = this.fileList[index].primary
      const removed = this.fileList.splice(index, 1)
      this.uploadedFiles = this.uploadedFiles.filter(item => item.uid !== uid)

      // 如果删除的图片是主图，则重新设置主图
      if (removedIsPrimary) {
        this.setPrimary()
      } else {
        this.emitImages()
      }
      this.$emit('remove', removed, this.uploadedFiles)
    },
    onBeforeUpload(file) {
      // 如果是头像模式且队列中有文件则清空上一次的数据
      if (this.avatar && this.uploadedFiles.length !== 0) {
        this.fileList.splice(0, this.fileList.length - 1)
        this.uploadedFiles = []
        this.cacheImages = this.uploadedFiles
        this.emitImages()
      }
      if (!this.checkSize(file) || !this.checkMimetype(this.acceptMimetype, file)) {
        return Promise.reject(new Error())
      }
      // 不管需不需要检验图片尺寸 都获取图片的尺寸（用于名称添加 宽×高）
      return this.checkDimension(file)
    },
    onExceed() {
      this.$message.error(`最多只能上传${this.limit}张图片`)
    },
    onMove() {
      if (!this.isDisabled && this.dragable) {
        this.uploadedFiles = this.getUploadedFiles(this.fileList)
        this.emitImages()
      }
    },
    // 检查图片尺寸
    checkDimension(file) {
      return new Promise((resolve, reject) => {
        getImageDimension(file)
          .then(({ width, height }) => {
            this.cacheDimension[file.uid] = `${width}×${height}`
            if (!this.dimension) return resolve(true)
            const [w, h] = this.dimension
            if (width === w && height === h) {
              resolve(true)
            } else {
              const errMsg = `图片尺寸必须是${w}×${h}，当前为${width}×${height}`
              this.$message.error(errMsg)
              reject(errMsg)
            }
          })
          .catch(err => {
            this.$message.error(err.message)
            reject(err)
          })
      })
    },
    // 清空主图（供外部调用）
    clearPrimary() {
      const index = this.fileList.findIndex(item => {
        if (item.primary) {
          item.primary = false
          return true
        }
      })
      if (index > -1) {
        this.uploadedFiles.forEach(item => {
          item.primary = false
        })
        const updated = this.fileList[index]
        this.fileList.splice(index, 1, updated)
        this.emitImages()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 120px;
.u-rounded {
  border-radius: 0.5rem;
}
.upload-button{
  border: 1px dashed #d9d9d9;
  background: #fff;
  ::v-deep {
    .el-upload {
      display: block;
    }
  }
  i {
    height: $size - 2px;
    width: $size - 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: $--color-text-secondary;
    &:hover {
      color: var(--color-primary);
    }
  }
}
.upload-image-wrap ::v-deep {
  .ui-thumb-wrap {
    &:hover {
      .ui-toolbar {
        display: block;
      }
    }
  }
}
</style>
