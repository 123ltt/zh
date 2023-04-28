<template>
  <div class="affix isFixed">
    <div class="bottom-btn">
      <el-button size="mini" @click="close">取消</el-button>
      <el-button size="mini" :loading="loading" type="primary" @click="save">保存</el-button>
      <el-select v-model="countryCode" size="mini" filterable placeholder="请选择翻译语种">
        <el-option v-for="item in languages" :key="item.value" :label="item.name" :value="item.value" :title="item.name" />
      </el-select>
      <el-button size="mini" type="primary" @click="getTranslate">一键翻译</el-button>
    </div>
  </div>
</template>

<script>
import { getTranslateHandle } from './utils'
export default {
  props: {
    translate: Object,
    translateData: Array,
    translateNext: Function,
    submit: Function,
    cancel: Function,
    languages: {
      type: Array,
      default: () => {
        return [
          { value: 'en', name: '英语' },
          { value: 'fr', name: '法语' },
          { value: 'es', name: '西班牙语' },
          { value: 'it', name: '意大利语' },
          { value: 'de', name: '德语' },
          { value: 'ja', name: '日语' },
          { value: 'nl', name: '荷兰' },
          { value: 'pt', name: '葡萄牙语' }
        ]
      }
    },
    that: Object
  },
  data() {
    return {
      countryCode: '',
      loading: false
    }
  },
  methods: {
    getTranslate() {
      if (!this.countryCode.length) {
        this.$message.warning('请选择翻译语言')
        return
      }
      getTranslateHandle(this.translateData, this.that, this.countryCode)
      if (this.translateNext) this.translateNext()
    },
    save() {
      this.loading = true
      this.submit().then(_ => {
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    },
    close() {
      if (this.cancel) this.cancel()
      this.$parent.$parent.$emit('close', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.isFixed{
  position: fixed;
  bottom: 10px;
  z-index: 101;
  margin-left: 20%;
  .el-select{
    margin: 0 10px;
  }
}
</style>
