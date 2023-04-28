<template>
  <el-card class="box-card" size="mini">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <i class="el-icon-close" style="float: right; padding: 3px 0" />
    </div>

    <div v-if="data.type === 'text'" class="text item">
      <template v-for="(item, index) in data.texts">
        <el-input :key="index"
                  v-model="item.content"
                  :rows="5"
                  type="textarea"
                  placeholder="请输入内容"
                  clearable
        />
      </template>
    </div>

    <div v-if="data.type === 'image'" class="image item">
      <uploadImg key="image" :images.sync="data.images" />
    </div>

    <div v-if="data.type === 'text-image'" class="text-image item">
      <template v-for="(item, index) in data.texts">
        <div v-if="item.class === 'title'" :key="index" class="mb-2">
          <div>标题</div>
          <el-input v-model="item.content" placeholder="请输入标题" clearable />
        </div>
        <div v-if="item.class === 'body'" :key="index" class="mb-2">
          <div>正文</div>
          <el-input v-model="item.content"
                    :rows="5"
                    type="textarea"
                    placeholder="请输入正文"
                    clearable
          />
        </div>
      </template>
      <div>上传图片</div>
      <uploadImg key="text-image" :images.sync="data.images" />
    </div>

    <div v-if="data.type === 'html'" class="html item">
      <editor ref="ueditor"
              v-model="data.html.content"
              :custom-config="htmlConfig"
              :paste-ignore-img="false"
              :http-request="httpRequest"
              @input="inputDesc"
      />
    </div>

    <div v-if="data.type === 'productTempHtml'" v-html="data.html.content" />
  </el-card>
</template>

<script>
import { Editor } from 'global-components'
import uploadImg from './uploadImg.vue'
import upload from '@/api/common/upload'
export default {
  name: 'DetailEditModule',
  components: { uploadImg, Editor },
  props: {
    title: String,
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      httpRequest: upload,
      htmlConfig: {
        focus: true,
        menus: [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'undeline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          // 'emoticon', // 表情
          'image' // 插入图片
          // 'undo', // 撤销
          // 'redo' // 灰复
          // 'code', // 源码
        ]
      }
    }
  },
  methods: {
    inputDesc() {
      // this.descNum = this.form.description.length
      // this.$refs.form.validateField('description')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
