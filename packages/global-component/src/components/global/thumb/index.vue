<template>
  <div class="g-thumb"
       :style="thumbStyles"
       @mouseenter.capture="onMouseenter"
       @mouseout="onMouseout"
       @mouseup="onMouseup"
       @mousedown="onMousedown"
  >
    <div v-if="loading||loadedStatus===0" class="d-flex justify-content-center align-items-center h-100 w-100">
      <i v-if="loading" class="el-icon-loading" />
      <i v-if="loadedStatus===0" class="el-icon-picture-outline fs-3" />
    </div>
    <img v-if="thumbUrl&&loadedStatus!==0"
         v-show="!loading"
         :src="thumbUrl"
         :style="{'object-fit':fit}"
         class="h-100 w-100"
         @load="onComplete(true)"
         @error="onComplete(false)"
    >
    <slot />
  </div>
</template>

<script>
import checkIsOssLink from '../../utils/checkIsOssLink'
import { ossLink, platformLink } from '../../utils/resolveImgLink'

export default {
  name: 'GThumb',
  props: {
    // 图片地址
    url: String,
    // 图片宽度
    width: {
      type: Number,
      default: 50
    },
    // 图片高度
    height: {
      type: Number,
      default: 50
    },
    // 是否预览
    isPreview: {
      type: Boolean,
      default: true
    },
    // 预览宽度
    previewWidth: {
      type: Number,
      default: 400
    },
    // 预览高度
    previewHeight: {
      type: Number,
      default: 400
    },
    // 预览图延迟显示。单位：毫秒。默认`300`
    delay: {
      type: Number,
      default: 300
    },
    // 缩略图适应容器的方式。可选值有：cover, contain, fill。默认`cover`
    fit: {
      type: String,
      default: 'cover'
    }
  },
  data() {
    return {
      loading: true,
      loadedStatus: 2, // 缩略图加载状态： 0 加载失败，1 加载成功，2 等待加载
      popoverDom: null,
      doms: {
        wrap: null,
        triangle: null
      },
      f1: null,
      f2: null,
      delayInterval: null,
      thumbUrl: '',
      previewUrl: ''
    }
  },
  computed: {
    thumbStyles() {
      return { width: this.width + 'px', height: this.height + 'px' }
    }
  },
  watch: {
    url: {
      handler(v) {
        this.onMouseout()
        const val = v || '' // 为null则不抛错
        if (typeof val === 'string') {
          if (val.trim() === '') {
            this.loading = false
            this.loadedStatus = 0
          } else {
            this.loading = true
            this.loadedStatus = 2
          }
        } else {
          throw new Error('传入的url不是字符串')
        }
      },
      immediate: true
    }
  },
  created() {
    // 由于判断域名使用的是异步，所以不能使用computed
    const thumbWatcher = this.$watch(
      () => ({ url: this.url, width: this.width, height: this.height }),
      (d) => {
        checkIsOssLink.isOss(d.url).then(status => {
          this.thumbUrl = (status ? ossLink : platformLink)(d.url, d.width, d.height, 50)
        })
      },
      { immediate: true }
    )
    const previewWatcher = this.$watch(
      () => ({ url: this.url, width: this.previewWidth, height: this.previewHeight }),
      d => {
        checkIsOssLink.isOss(d.url).then(status => {
          this.previewUrl = (status ? ossLink : platformLink)(d.url, d.width, d.height, 80)
        })
      },
      { immediate: true }
    )
    this.$once('hook:beforeDestroy', () => {
      thumbWatcher()
      previewWatcher()
      this.removeDom()
    })
  },
  methods: {
    onComplete(status) {
      this.loading = false
      this.loadedStatus = Number(status)
    },
    // 计算位置
    calcPosition(event) {
      const div = this.doms.wrap
      const i = this.doms.triangle
      // 获取 $el 的大小及其相对于视口的位置
      const { top, right, bottom, left, height, width } = this.$el.getBoundingClientRect()

      // 预览图显示在右边
      if (left < window.innerWidth - right) {
        div.style.right = 'auto'
        div.style.left = left + width + 10 + 'px'
        i.className = 'triangle-left'
      } else {
        // 预览图显示在左边
        div.style.left = 'auto'
        div.style.right = window.innerWidth - left + 10 + 'px'
        i.className = 'triangle-right'
      }

      let divTop = 0
      let iTop = 0
      // 判断是否超过底部可视区域
      if (window.innerHeight < top + height / 2 + this.previewHeight / 2 + 10) {
        divTop = window.innerHeight - this.previewHeight - 10
        iTop = divTop
      } else {
        divTop = top + height / 2 - this.previewHeight / 2
        // 判断是否超过顶部可视区域（含10px内）
        if (divTop < 10) divTop = 10
        iTop = divTop
      }

      div.style.top = divTop + 'px'

      // 设置三角形Y轴坐标，偏差在2px内 都增加 5px（使三角形更靠近缩略图）
      let offset = 0
      if (event.pageY - 2 <= top) {
        offset = 5
      } else if (event.pageY + 2 >= bottom) {
        offset = -5
      }
      i.style.top = (event.pageY - iTop - 6) + offset + 'px' // 6 为三角形的高度
    },
    createDom(event) {
      const div = document.createElement('div')
      const img = document.createElement('img')
      const i = document.createElement('i')
      const loadingEl = document.createElement('i')

      div.classList.add('g-thumb-popover', 'd-flex', 'align-items-center', 'justify-content-center')
      img.classList.add('d-none', 'w-100', 'h-100')
      loadingEl.classList.add('el-icon-loading')

      div.style.width = this.previewWidth + 'px'
      div.style.height = this.previewHeight + 'px'

      // loading
      div.appendChild(loadingEl)

      img.onload = () => {
        div.removeChild(loadingEl)
        img.classList.remove('d-none')
        img.classList.add('d-block')
      }
      img.onerror = () => {
        const errEl = document.createElement('span')
        errEl.classList.add('text-muted')
        errEl.textContent = '图片加载失败'
        div.removeChild(loadingEl)
        div.appendChild(errEl)
      }
      img.src = this.previewUrl

      this.doms.wrap = div
      this.doms.triangle = i

      this.calcPosition(event)

      div.appendChild(img)
      div.appendChild(i)
    },
    removeDom() {
      this.doms.wrap && document.body.removeChild(this.doms.wrap)
      this.doms.wrap = null
      this.doms.triangle = null
    },
    onMouseenter(event) {
      // 鼠标有按住任何按键进入都不给显示大图
      if (event.buttons !== 0) return

      if (this.loadedStatus !== 1) return
      if (!this.isPreview) return
      if (!this.url) return

      clearTimeout(this.delayInterval)

      if (this.doms.wrap) {
        clearTimeout(this.f1)
      }

      this.delayInterval = setTimeout(() => {
        if (this.doms.wrap) {
          this.show(true)
        } else {
          this.createDom(event)
          document.body.appendChild(this.doms.wrap)
        }
      }, this.delay)
    },
    onMouseout() {
      clearTimeout(this.delayInterval)
      if (!this.isPreview) return
      if (this.doms.wrap) {
        this.show(false)
        this.f1 = setTimeout(() => {
          this.removeDom()
        }, 300)
      }
    },
    onMousedown() {
      clearTimeout(this.delayInterval)
      if (!this.isPreview) return
      if (this.doms.wrap) {
        clearTimeout(this.f2)
        this.show(false)
      }
    },
    onMouseup(event) {
      if (!this.isPreview) return
      if (this.doms.wrap) {
        this.f2 = setTimeout(() => {
          if (this.doms.wrap) {
            this.calcPosition(event)
            this.show(true)
          }
        }, 300)
      }
    },
    show(status) {
      this.doms.wrap.style.display = status ? 'initial' : 'none'
    }
  }
}
</script>

<style lang="scss">
.g-thumb {
  display: inline-flex;
  position: relative;
  .el-icon-picture-outline {
    color: #ccc;
  }
}
.g-thumb-popover {
  $g-thumb-popover-radius: 3px;
  $g-thumb-popover-triangle-size: 6px;
  $g-thumb-border-color: #ccc;

  position: absolute;
  z-index: 999999;
  padding: 1px;
  border-radius: $g-thumb-popover-radius;
  background: #fff;
  border: 1px $g-thumb-border-color solid;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  img {
    object-fit: contain;
  }
  @mixin triangle($color, $fillDir, $clearDir) {
    display: block;
    position: absolute;
    height: 0;
    width: 0;
    border: $g-thumb-popover-triangle-size solid rgba(0, 0, 0, 0);
    border-#{$fillDir}-color: $color;
    border-#{$clearDir}: 0 solid rgba(0, 0, 0, 0);
  }
  i.triangle-left {
    left: -$g-thumb-popover-triangle-size;
    @include triangle($g-thumb-border-color, right, left);
    &::after {
      content: " ";
      left: 1px;
      top: -$g-thumb-popover-triangle-size;
      @include triangle(#fff, right, left);
    }
  }
  i.triangle-right {
    right: -$g-thumb-popover-triangle-size;
    @include triangle($g-thumb-border-color, left, right);
    &::after {
      content: " ";
      right: 1px;
      top: -$g-thumb-popover-triangle-size;
      @include triangle(#fff, left, right);
    }
  }
}
</style>
