<template>
  <el-form label-width="80px" size="mini">
    <el-form-item label="水印图">
      <UploadImage :images.sync="form.logo"
                   avatar
                   :http-request="httpRequest"
                   :action="action"
                   :is-preview="false"
                   :primary="false"
      />
    </el-form-item>
    <el-form-item label="占比">
      <Slider v-model="form.percent" />
    </el-form-item>
    <el-form-item label="水印透明度">
      <Slider v-model="form.opacity" />
    </el-form-item>
    <div class="d-flex">
      <el-form-item label="水印位置" class="w-50">
        <PositionSelect v-model="form.position" />
      </el-form-item>
      <el-form-item label="水印应用于" class="w-50">
        <SelectImgType v-model="form.useMode" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { encode } from 'js-base64'
import UploadImage from '../upload/image/index.vue'
import PositionSelect from './positionSelect.vue'
import Slider from './slider.vue'
import SelectImgType from './selectImgType.vue'

const defaultLogoMode = {
  logo: [],
  percent: 20,
  opacity: 80,
  position: 'se',
  useMode: 0
}

export default {
  name: 'LogoMode',
  components: { UploadImage, PositionSelect, Slider, SelectImgType },
  props: {
    httpRequest: {
      type: Function,
      default: () => {}
    },
    action: String,
    config: Object
  },
  data() {
    return {
      form: Object.assign({}, defaultLogoMode, this.config)
    }
  },
  watch: {
    form: {
      handler() {
        this.$emit('change', this.getResult())
      },
      deep: true
    }
  },
  methods: {
    getResult() {
      const form = this.form
      const result = {}
      if (form.logo.length > 0) {
        const imagePath = form.logo[0].url.replace(/^https?:\/\/((([a-z\d-]+\.)+[a-z]+)|((\d+\.){3}\d+))(:\d+)?\//i, '')
        const arr = [
          ['image', encode(`${imagePath}?x-oss-process=image/resize,P_${form.percent}`)],
          ['t', form.opacity, 100],
          ['g', form.position, 'se']
        ]
        result.query = arr.map(([key, value, condition]) => value === condition ? '' : key + '_' + value).filter(Boolean).join(',')
        result.useMode = form.useMode
      }
      return result
    },
    reset() {
      Object.assign(this.form, defaultLogoMode, this.config)
    }
  }
}
</script>
