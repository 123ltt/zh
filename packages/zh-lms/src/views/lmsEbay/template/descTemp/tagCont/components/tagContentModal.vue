<template>
  <basic-container style="min-width: 0">
    <el-form ref="dialogForm" :model="form" size="mini" label-width="100px" :rules="rules">
      <!-- 添加 -->
      <el-form-item v-if="!row" label="店铺" prop="platShopId">
        <!-- <el-select v-model="form.platSiteId" filterable placeholder="请选择站点" class="me-2" style="width: 20%" @change="changeSite">
          <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.hiddenValue" />
        </el-select> -->
        <el-select v-model="form.platShopId" filterable placeholder="请选择店铺" style="width: 61%">
          <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.hiddenValue" />
        </el-select>
      </el-form-item>
      <!-- 编辑 -->
      <template v-else>
        <el-form-item label="店铺" required>
          {{ form.platShop }}
        </el-form-item>
      </template>
      <el-form-item label="标签内容名称" prop="tagName">
        <el-input v-model="form.tagName" placeholder="请输入" maxlength="50" show-word-limit style="width: 61%" @keyup.native="changeToLowercase" />
      </el-form-item>
      <el-form-item label="自定义标签" prop="typeId">
        <!-- <el-select v-model="form.typeLevel" filterable placeholder="请选择" class="me-2" style="width: 20%" @change="changeTagType">
          <el-option label="自定义" value="1" />
          <el-option label="系统" value="0" />
        </el-select> -->
        <el-select v-model="form.typeId" filterable placeholder="请选择标签" style="width: 61%">
          <el-option v-for="item in tagList" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="tagContent">
        <div class="tag-content-box">
          <editor v-model="form.tagContent"
                  :custom-config="config"
                  :http-request="httpRequest"
                  :paste-ignore-img="false"
                  :image-protocol="'https'"
                  @input="inputDesc"
          />
          <span class="word-limit">{{ descNum }}/{{ descTotal }}</span>
        </div>
      </el-form-item>
      <!-- <el-form-item label="内容说明" prop="tagRemark">
        <el-input v-model="form.tagRemark" type="textarea" placeholder="这里是对标签内容的功能说明，是描述怎么取数" maxlength="100" show-word-limit resize="none" :rows="5" />
      </el-form-item> -->
      <div class="text-end">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" :disabled="row ? submitBtnEnable : false" @click="submitDialog('dialogForm')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { Editor } from 'global-components'
import { deepClone } from '@/util/util'
import upload from '@/api/common/upload'
import { getTagType, saveTagContent, updateTagContent } from '@/api/ebay/tag.js'
import { storeOptionsWithPlatformCode } from '@/api/sams'

export default {
  name: 'EditTagContent',
  components: { Editor },
  props: {
    row: {
      type: Object
    },
    siteList: {
      type: Array
    },
    storeList: {
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
      tagList: [],
      descNum: 0,
      descTotal: 50000,
      httpRequest: upload,
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
        platShopId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        tagName: [{ required: true, validator: validateTypeName, trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择自定义标签', trigger: 'change' }]
      },
      form: {},
      oldForm: null
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  async created() {
    this.getTagType(1)
    // 编辑
    if (this.row) {
      // 查找标签类型
      // this.tagList = await getTagType().then(res => res.data)
      // let type
      // if (this.tagList.find(item => item.id === typeId)) {
      //   type = this.tagList.find(item => item.id === typeId).typeLevel
      // }
      this.form = deepClone(this.row)
      this.oldForm = deepClone(this.form)
    }
  },
  methods: {
    // 大写字母转小写
    changeToLowercase() {
      if (/[A-Z]/.test(this.form.tagName)) {
        this.form.tagName = this.form.tagName.toLowerCase()
      }
    },
    // 选择站点对应店铺列表(站点名)
    changeSite(value) {
      this.storeList = []
      this.$set(this.form, 'platShopId', '')
      storeOptionsWithPlatformCode({
        platformCode: 'EB',
        siteId: value
      }).then(res => {
        this.storeList = res.data
      })
    },
    // changeTagType(value) {
    //   this.tagList = []
    //   this.$set(this.form, 'typeId', '')
    //   this.getTagType(value)
    // },
    getTagType(type) {
      getTagType({ typeLevel: type, status: 1 }).then(res => {
        this.tagList = res.data
      })
    },
    inputDesc() {
      this.descNum = this.form.tagContent.length
      this.$refs.dialogForm.validateField('tagContent')
    },
    cancel() {
      this.$parent.$emit('close')
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            const form = deepClone(this.form)
            const { id, status, tagContent, tagName, typeId } = form
            updateTagContent({ id, status, tagContent, tagName, typeId }).then((res) => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          } else {
            const { platShopId } = this.form
            // const platSite = this.siteList.find(item => item.hiddenValue === platSiteId).displayName
            const platShopCode = this.storeList.find(item => item.hiddenValue === platShopId).candidateDisplayName
            this.form = Object.assign(this.form, {
              // platSite: platSite,
              platShopCode: platShopCode
            })
            saveTagContent(this.form).then((res) => {
              this.$message.success('添加成功')
              this.$parent.$emit('close', true)
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
.tag-content-box{
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
  ::v-deep .w-e-text-container {
    height: 242px!important;
  }
}
</style>
