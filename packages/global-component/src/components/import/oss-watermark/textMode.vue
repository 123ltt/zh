<template>
  <el-form label-width="80px" size="mini">
    <el-form-item label="文字内容">
      <el-input v-model="form.content" type="text" placeholder="请输入内容" maxlength="16" show-word-limit />
    </el-form-item>
    <el-form-item label="文字字体">
      <div class="d-flex">
        <el-select v-model="form.fontFamily">
          <el-option v-for="font in fonts" :key="font.value" :value="font.value" :label="font.label" />
        </el-select>
        <el-input-number v-model="form.fontSize" :step="5" :min="1" :precision="0" class="ms-2" style="width:100px" />
        <span class="text-muted ms-1">px</span>
      </div>
    </el-form-item>
    <div class="d-flex">
      <el-form-item label="文字颜色" class="w-50">
        <el-color-picker v-model="form.color" />
      </el-form-item>
      <el-form-item label="文字铺满" class="w-50">
        <el-switch v-model="form.fill" />
      </el-form-item>
    </div>
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
import Slider from './slider.vue'
import PositionSelect from './positionSelect.vue'
import SelectImgType from './selectImgType.vue'

const defaultTextMode = {
  content: '',
  fontFamily: '',
  fontSize: '30',
  fill: false,
  color: '',
  opacity: 100,
  position: 'se',
  useMode: 0
}

export default {
  name: 'TextMode',
  components: { Slider, PositionSelect, SelectImgType },
  props: {
    config: Object
  },
  data() {
    return {
      fonts: [
        { label: '默认字体', value: '' },
        { label: '文泉驿正黑', value: 'wqy-zenhei' },
        { label: '文泉微米黑', value: 'wqy-microhei' },
        { label: '方正书宋', value: 'fangzhengshusong' },
        { label: '方正楷体', value: 'fangzhengkaiti' },
        { label: '方正黑体', value: 'fangzhengheiti' },
        { label: '方正仿宋', value: 'fangzhengfangsong' },
        { label: 'DroidSans Fallback', value: 'droidsansfallback' }
      ],
      form: Object.assign({}, defaultTextMode, this.config)
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
      if (form.content) {
        const arr = [
          ['text', encode(form.content)],
          ['type', encode(form.fontFamily), ''],
          ['size', form.fontSize, ['0', '']],
          ['fill', Number(form.fill), 0],
          ['color', form.color.slice(1), ''],
          ['t', form.opacity, 100],
          ['g', form.position, 'se']
        ]
        result.query = arr.map(([key, val, condition]) => {
          if (Array.isArray(condition) && condition.includes(val)) return ''
          return val === condition ? '' : key + '_' + val
        }).filter(Boolean).join(',')
        result.useMode = form.useMode
      }
      return result
    },
    reset() {
      Object.assign(this.form, defaultTextMode, this.config)
    }
  }
}
</script>
