<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="w-90 form-col">
    <el-row>
      <el-col :span="24">
        <el-form-item label="长描述" prop="description">
          <div class="desc-box">
            <editor
              v-model="form.description"
              :text-content.sync="descText"
              :custom-config="config"
              :paste-ignore-img="false"
              :http-request="httpRequest"
              image-protocol="https"
            />
          </div>
        </el-form-item>
        <el-form-item label="短描述" prop="shortDescription">
          <div class="desc-box">
            <editor
              v-model="form.shortDescription"
              :text-content.sync="descShortText"
              :custom-config="config"
              :paste-ignore-img="false"
              :http-request="httpRequest"
              image-protocol="https"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { Editor } from 'global-components'
import upload from '@/api/common/upload'
export default {
  name: 'Description',
  components: { Editor },
  props: {
    labelWidth: String,
    productLoading: Number,
    baseProductInfo: Object,
    isEdit: Boolean
  },
  data() {
    return {
      form: {
        description: '',
        shortDescription: ''
      },
      rules: {
        description: [{ required: true, message: '请输入长描述', trigger: 'change' }],
        shortDescription: [{ required: true, message: '请输入短描述', trigger: 'change' }]
      },
      descText: '',
      descShortText: '',
      config: {
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
          'emoticon', // 表情
          'image', // 插入图片
          'undo', // 撤销
          'code', // 源码
          'redo' // 重复
        ]
      },
      httpRequest: upload
    }
  },
  watch: {
    'baseProductInfo.productSku'(val) {
      this.form.shortDescription = ''
      if (!val) { // sku清空
        this.form.description = ''
      } else {
        this.resetDesc()
      }
    }
  },
  methods: {
    resetDesc() {
      const { description, shortDescription } = deepClone(this.baseProductInfo)
      this.form.description = description || ''
      if (this.isEdit) this.form.shortDescription = shortDescription
    }
  }
}
</script>

<style lang="scss" scoped>
.w-90 {
  width: 90%;
}
</style>
