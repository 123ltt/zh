<template>
  <basic-container>
    <el-form ref="dialogForm" :model="form" size="mini" label-width="110px" :rules="rules">
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="form.templateName" placeholder="请输入" maxlength="50" show-word-limit style="width: 25%" @keyup.native="changeToLowercase" />
      </el-form-item>
      <el-form-item label="刊登站点" prop="templateSite">
        <el-select v-model="form.templateSite" filterable placeholder="请选择站点" class="me-2" style="width: 25%" @change="changeSite">
          <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="店铺名" prop="templateShopNames">
        <el-input v-model="form.templateShopNames" placeholder="请选择" suffix-icon="el-icon-arrow-down" style="width: 25%" :disabled="storeDisabled" @focus="selectShop" />
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status" :disabled="false">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="系统标签" prop="systemLabel">
        <el-row>
          <el-col :span="10">
            <el-card class="template-tag-list" shadow="never">
              <div v-for="(item, index) in systemLabelList" :key="index" @dblclick="getValue(item.typeName)">
                {{ item.typeName }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <div class="template-remark">双击选择框里的标签选项，即可插入到模板内容</div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="自定义标签" prop="systemLabel">
        <el-row>
          <el-col :span="10">
            <el-card class="template-tag-list" shadow="never">
              <div v-for="(item, index) in defineLabelList" :key="index" @dblclick="getValue(item.typeName)">
                {{ item.typeName }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <div class="template-remark">双击选择框里的标签选项，即可插入到模板内容</div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="16">
          <el-form-item label="模板内容" prop="templateContext">
            <div class="template-content-box">
              <editor
                ref="editor"
                v-model="form.templateContext"
                :custom-config="config"
                :paste-ignore-img="true"
                :http-request="httpRequest"
                :image-protocol="'https'"
                @input="inputDesc"
                @keyup.native="changeTemplate"
              />
              <span class="word-limit">{{ descNum }}/{{ descTotal }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="">
        <div class="text-start">
          <el-button size="mini" :disabled="!form.templateContext" @click="review">预览</el-button>
          <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { Editor } from 'global-components'
import { deepClone } from '@/util/util'
import upload from '@/api/common/upload'
import { addTemplate, updateTemplate, getTagType } from '@/api/ebay/tag.js'
import shopModal from './components/shopModal.vue'

export default {
  name: 'SaveTemplate',
  components: { Editor },
  props: {
    row: {
      type: Object
    },
    siteList: {
      type: Array
    }
  },
  data() {
    const validateTypeName = (rule, value, callback) => {
      if (value && /^[a-z][a-z0-9_-]{1,}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入字母开头，字母、数字、中划线或下划线'))
      }
    }
    return {
      descNum: 0,
      descTotal: 2000,
      httpRequest: upload,
      storeDisabled: true, // 店铺默认置灰
      config: {
        focus: false,
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
          'redo' // 重复
        ]
      },
      rules: {
        templateName: [{ required: true, validator: validateTypeName, trigger: 'blur' }],
        templateSite: [{ required: true, message: '请选择站点', trigger: 'change' }],
        // templateShopNames: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      defaultContext: '{{{description}}}',
      originStr: '',
      form: {
        templateShopCodes: '', // 店铺code集合（传值）
        // templateShopNames: '', // 店铺名字集合（显示）
        templateContext: ''
      },
      oldForm: null,
      systemLabelList: [],
      defineLabelList: [],
      storeList: []
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    // 编辑
    if (this.row) {
      const { templateShopCode, templateSite, status, typeLevel } = this.row
      this.form = Object.assign(deepClone(this.row), {
        status: String(status),
        typeLevel: String(typeLevel),
        // templateShopNames: templateShop,
        templateShopCodes: templateShopCode
      })
      this.changeSite(templateSite, true)
      this.oldForm = deepClone(this.form)
      this.originStr = this.form.templateContext
    } else { // 添加时，默认模板内容
      // this.form.templateContext = this.defaultContext
      this.form.status = '1'
    }
    this.getTagList(0)
    this.getTagList(1)
  },
  methods: {
    changeToLowercase() {
      if (/[A-Z]/.test(this.form.templateName)) {
        this.form.templateName = this.form.templateName.toLowerCase()
      }
    },
    getTagList(type) {
      getTagType({ typeLevel: type, status: 1 }).then(res => {
        const data = res.data
        type ? this.defineLabelList = data : this.systemLabelList = data
      })
    },
    inputDesc() {
      this.descNum = this.form.templateContext.length
      this.$refs.dialogForm.validateField('templateContext')
    },
    // 默认系统标签不可删除
    changeTemplate() {
      // if (this.form.templateContext.indexOf(this.defaultContext) < 0) {
      //   const data = this.form.templateContext.replace(/<\/?p[^>]*>/g, '')
      //   if (data.length < this.defaultContext.length) {
      //     this.form.templateContext = this.defaultContext
      //   } else {
      //     this.form.templateContext = this.originStr
      //   }
      // } else {
      //   this.originStr = this.form.templateContext
      // }
    },
    getValue(value) {
      if (!this.form.templateContext) { // 第一次双击
        this.$set(this.form, 'templateContext', `{{{${value}}}}`)
      } else {
        if (this.form.templateContext.indexOf(`{{{${value}}}}`) === -1) { // 不可重复
          // const beforeStr = this.form.templateContext.replaceAll('<p>', '').replaceAll('</p>', '')
          // const str = `${beforeStr}{{{${value}}}}`
          this.insertHTML(value)
        } else {
          this.$message({
            showClose: true,
            message: `{{{${value}}}}已经添加到模板内容`,
            type: 'warning'
          })
        }
      }
    },
    insertHTML(value) {
      this.$refs.editor.editor.cmd.do('insertHTML', '<span>' + `{{{${value}}}}` + '</span>')
      // this.$set(this.form, 'templateContext', value)
      this.originStr = this.form.templateContext
    },
    changeSite(value, isEdit) {
      this.storeDisabled = true
      this.storeList = []
      if (!isEdit) {
        this.$set(this.form, 'templateShopNames', '')
        this.form.templateShopCodes = ''
      }
    },
    selectShop() {
      this.$modal({
        title: '选择店铺',
        component: shopModal,
        width: '500px',
        data: {
          row: this.form,
          storeList: this.storeList
        },
        callback: (refresh) => {
          if (refresh) {
            const templateShopNames = refresh.map(e => this.storeList.find(item => item.candidateDisplayName === e).displayName)
            this.$set(this.form, 'templateShopNames', templateShopNames.join(','))
            this.form.templateShopCodes = refresh.join(',')
          }
        }
      })
    },
    review() {
      this.$modal({
        title: '模板预览',
        component: this.form.templateContext,
        minHeight: '200px'
      })
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateTemplate(this.form).then((res) => {
              this.$message.success('编辑模板成功')
              this.$emit('close', true)
            })
          } else {
            addTemplate(this.form).then((res) => {
              this.$message.success('添加模板成功')
              this.$emit('close', true)
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.template-tag-list {
  font-size: 12px;
  width: 95%;
  height: 100px;
  overflow: auto;
  ::v-deep .el-card__body {
    padding: 0;
    div {
      padding: 0 16px
    }
  }
  ::v-deep .el-card__body div:hover {
    background: #f8f9fa;
    cursor: pointer;
  }
}
.template-remark {
  color: #f00;
  margin-top: 79px;
}
.template-content-box {
  position: relative;
  .word-limit{
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
  ::v-deep.w-e-text-container {
    height: 242px!important;
  }
}
</style>
