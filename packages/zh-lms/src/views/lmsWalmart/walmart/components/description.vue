<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="w-90 form-col">
    <el-row>
      <el-col :span="24">
        <el-form-item v-for="(item, index) in 5"
                      :key="index"
                      label="Key Features"
                      :prop="'keyFeatures.' + index"
                      :rules="{required: true, validator: validKey(item, index), trigger: ['blur', 'change']}"
        >
          <el-input v-model="form.keyFeatures[index]" maxlength="4000" show-word-limit class="w-100" @change="keyChange" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述" prop="description">
          <div class="desc-box">
            <editor
              v-model="form.description"
              :text-content.sync="descText"
              :custom-config="config"
              :paste-ignore-img="false"
              :http-request="httpRequest"
              image-protocol="https"
              @input="inputDesc"
            />
            <span class="word-limit">{{ descNum }}/{{ descTotal }}</span>
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
        keyFeatures: [],
        description: ''
      },
      rules: {
        description: [{ required: true, message: '请输入描述', trigger: ['blur', 'change'] }]
      },
      descText: '',
      descNum: 0,
      descTotal: 4000,
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
      if (!val) { // sku清空
        this.form = {
          keyFeatures: [],
          description: ''
        }
      } else {
        this.resetDesc()
      }
    }
  },
  methods: {
    validKey(item, index) {
      return (rule, value, callback) => {
        if (!this.form.keyFeatures.some(v => v)) {
          callback(new Error('请输入Key Features'))
        } else {
          callback()
        }
      }
    },
    keyChange() {
      if (this.form.keyFeatures.some(v => v)) {
        this.form.keyFeatures.forEach((item, index) => {
          this.$refs.form.clearValidate('keyFeatures.' + index)
        })
      }
    },
    resetDesc() {
      const { description, keyFeatures } = deepClone(this.baseProductInfo)
      this.form.description = description || ''
      if (this.isEdit) this.form.keyFeatures = keyFeatures
    },
    inputDesc() {
      this.descNum = this.getDescNum()
      this.$refs.form.validateField('description')
    },
    // 描述总字数统计
    getDescNum() {
      const newline = this.form.description.match(/\n/ig) || []
      return this.form.description ? this.form.description.length + newline.length : 0
    }
  }
}
</script>

<style lang="scss" scoped>
.w-90 {
  width: 90%;
}
.desc-box {
  position: relative;
  .word-limit {
    position: absolute;
    right: 8px;
    bottom: 1px;
    background: #fff;
    line-height: initial;
    padding: 0 5px 6px 5px;
    color: #909399;
    font-size: 12px;
    display: inline-block;
    z-index: 109;
    user-select: none;
  }
}
</style>
