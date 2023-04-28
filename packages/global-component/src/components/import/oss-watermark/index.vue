<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="14">
        <el-tabs v-model="currentTab" type="border-card" class="shadow-none" @tab-click="onTabClick">
          <el-tab-pane label="文字水印" name="text">
            <TextMode ref="text" :config="textConfig" @change="onChange" />
          </el-tab-pane>
          <el-tab-pane label="Logo水印" name="logo">
            <LogoMode ref="logo" :config="logoConfig" :action="logoAction" @change="onChange" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="10">
        <div v-if="images.length===0" class="d-flex align-items-center justify-content-center text-muted" style="height:20rem">暂无图片可预览</div>
        <div v-else>
          <div class="m-2 text-center">预览效果（预览图有压缩）</div>
          <el-carousel indicator-position="outside" :autoplay="false" height="350px">
            <el-carousel-item v-for="item in images" :key="item" class="text-center">
              <img height="100%" :src="generateUrl(item,50)" title="点击查看原图" style="cursor:pointer" @click="preview(item)">
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
    </el-row>
    <div class="text-center m-2">
      <el-button type="primary" size="mini" @click="onConfirm">确定</el-button>
      <el-button size="mini" @click="onReset">清除水印</el-button>
      <slot name="button" />
    </div>
  </div>
</template>

<script>
import LogoMode from './logoMode.vue'
import TextMode from './textMode.vue'
import { debounce } from '@/util/util'

export default {
  components: { LogoMode, TextMode },
  props: {
    images: {
      type: Array,
      default: () => []
    },
    httpRequest: {
      type: Function,
      required: true
    },
    logoAction: String,
    textConfig: Object,
    logoConfig: Object
  },
  data() {
    return {
      currentTab: 'text',
      ossProcess: '',
      useMode: ''
    }
  },
  methods: {
    getWatermarkStr(str) {
      return str ? '/watermark,' + str : ''
    },
    onChange: debounce(function(result) {
      this.ossProcess = this.getWatermarkStr(result.query)
      this.useMode = result.useMode
    }, 300),
    onTabClick() {
      const result = this.$refs[this.currentTab].getResult()
      this.ossProcess = this.getWatermarkStr(result.query)
      this.useMode = result.useMode
    },
    generateUrl(url, q = 100) {
      const arr = [url, '?x-oss-process=image']

      if (q < 100) {
        arr.push(`/quality,q_${q}`, '/format,jpg') // 需要将图片格式设置为jpg才能进行压缩
      }

      if (this.ossProcess) {
        arr.push(this.ossProcess)
      }
      return arr.join('')
    },
    preview(url) {
      window.open(this.generateUrl(url))
    },
    onConfirm() {
      this.$emit('ok', {
        query: this.generateUrl(''),
        useMode: this.useMode
      })
    },
    onReset() {
      this.$refs.text.reset()
      this.$refs.logo.reset()
    }
  }
}
</script>
