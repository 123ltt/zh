<template>
  <div class="custom-editor">
    <div style="height:2px">
      <el-progress v-show="uploading" :percentage="percentage" :stroke-width="2" :show-text="false" />
    </div>
    <iframe ref="iframe"
            src="/editor/index.html"
            width="100%"
            :height="height+'px'"
            class="border-0"
            style="z-index:99"
            @load="loaded"
    />
  </div>
</template>

<script>
export default {
  name: 'Editor',
  inject: {
    elForm: {
      default: null
    },
    elFormItem: {
      default: null
    }
  },
  props: {
    // 默认html内容
    value: String,
    // 文本内容，对应 el.textContent.trim()，可以通过该属性判断编辑器是否为空
    textContent: String,
    // 上传图片的方法
    httpRequest: Function,
    // 该参数最终会传递给httpRequest方法(option.action)
    uploadUrl: String,
    // 设置编辑区域的高度
    height: {
      type: Number,
      default: 300
    },
    // 是否禁用编辑器（只读）
    disabled: {
      type: Boolean,
      default: false
    },
    // 忽略粘贴内容中的图片
    pasteIgnoreImg: {
      type: Boolean,
      default: true
    },
    // 自定义配置，参考 http://www.wangeditor.com/doc/pages/01-%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8/
    customConfig: {
      type: Object,
      default: () => ({})
    },
    // 强制使用 `http` 或 `https` 或 `//` ，默认不处理。（注：`//` 表示跟随当前页面的协议）
    imageProtocol: String
  },
  data() {
    return {
      uploading: false,
      percentage: 0,
      editor: null,
      content: ''
    }
  },
  computed: {
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },
  watch: {
    value(val) {
      if (val !== this.content) {
        this.editor && this.editor.txt.html(this.replaceAllImgProtocol(val))
      }
    }
  },
  methods: {
    loaded() {
      this.editor = this.$refs.iframe.contentWindow.initEditor(this)
    },
    onchange(newHtml) {
      this.content = newHtml
      this.$emit('input', newHtml)
      this.$emit('update:textContent', this.editor.txt.text().trim())
      if (this.elFormItem) {
        this.elFormItem.$emit('el.form.change')
      }
    },
    onblur() {
      this.$emit('blur')
      if (this.elFormItem) {
        this.elFormItem.$emit('el.form.blur')
      }
    },
    customUploadImg(resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      if (this.uploading) {
        return this.$message.error('正在上传中，请稍后')
      }

      const reset = () => {
        this.percentage = 0
        this.uploading = false
      }

      resultFiles.forEach(file => {
        this.uploading = true
        this.httpRequest({
          filename: 'file',
          file,
          action: this.uploadUrl,
          onProgress: (e) => {
            this.percentage = e.percent
          },
          onSuccess: (res) => {
            insertImgFn(this.forceProtocol(res.data))
            setTimeout(reset, 1000)
          },
          onError: reset
        })
      })
    },
    forceProtocol(url) {
      if (/^https?$/i.test(this.imageProtocol)) {
        return url.replace(/^https?:\/\//i, this.imageProtocol + '://')
      } else if (this.imageProtocol === '//') {
        return url.replace(/^https?:\/\//i, '//')
      }
      return url
    },
    replaceAllImgProtocol(content = '') {
      if (!this.imageProtocol) return content
      return content.replace(/(<img[^>]+src=['"])([^'"]+)/gi, ($0, $1, $2) => {
        return $1 + this.forceProtocol($2)
      })
    },
    fullscreenHandler(isFullScreen) {
      const fullClass = ['position-fixed', 'top-0', 'start-0', 'w-100', 'h-100', 'custom-editor-full']
      if (isFullScreen) {
        this.$el.classList.add(...fullClass)
      } else {
        this.$el.classList.remove(...fullClass)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-editor {
  &.custom-editor-full {
    z-index: 9999;
    iframe {
      height: 100%;
    }
  }

 ::v-deep {
  .el-progress-bar__outer {
    background-color: transparent;
  }
 }
}
</style>
