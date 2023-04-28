<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="sp-form form-col">
    <el-form-item label="图片" prop="mainImage" class="image">
      <imgShowList
        :img-show-list.sync="imgShowList"
        :main-image.sync="mainImage"
        :extra-imag-list.sync="extraImagList"
      />
    </el-form-item>
    <el-form-item label="描述类型" prop="productType">
      <el-row>
        <el-col :span="3">
          <el-radio v-model="descType" label="1" @change="descTypeChange(descType, true)">HTML</el-radio>
        </el-col>
        <el-col :span="20">
          <el-row :gutter="4">
            <el-col :span="3">
              <el-radio v-model="descType" label="2" @change="descTypeChange(descType, true)">描述模板</el-radio>
            </el-col>
            <el-col v-if="descType === '2'" :span="11">
              <el-select
                v-model="form.descTemplateId"
                filterable
                placeholder="请选择描述模板"
                class="g-w100"
                @change="getTemplate"
              >
                <el-option v-for="item in templateChangeList"
                           :key="item.id"
                           :label="item.templateName"
                           :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-row class="d-flex align-items-end">
        <el-col :span="22">
          <div class="desc-box">
            <editor ref="ueditor"
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
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="resetDesc">还原描述</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { Editor } from 'global-components'
import upload from '@/api/common/upload'
import imgShowList from './imgShowList.vue'
import { getTemplatePage, getTemplateContent } from '@/api/ebay/template.js'
export default {
  name: 'Description',
  components: { Editor, imgShowList },
  props: {
    labelWidth: {
      type: String,
      default: '120px'
    },
    productLoading: Number,
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    },
    isEdit: Boolean
  },
  data() {
    // 选择图片验证
    const validateImgs = (rule, value, callback) => {
      // 副图不是必选
      if (this.mainImage && this.extraImagList.length <= this.extraImgNum) {
        callback()
      } else {
        callback(new Error(`主图单选，副图最多选${this.extraImgNum}张`))
      }
    }
    const validDesc = (rule, value, callback) => {
      // 判断富文本的纯文本是否有值
      if (this.form.description && this.form.description.length > this.descTotal) {
        callback(new Error(`富文本描述不能超过${this.descTotal}字符`))
      } else if (!this.form.description) {
        callback(new Error('描述不能为空'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      extraImgNum: 11, // 副图最多可选张数
      imgShowList: [], // 图片列表
      mainImage: '',
      extraImagList: [],
      descType: '1', // 描述类型
      templateChangeList: [],
      httpRequest: upload,
      form: {
        variationPictures: [],
        description: '',
        descTemplateId: ''
      },
      descText: '',
      descNum: 0,
      descTotal: 50000,
      rules: {
        mainImage: [{ required: true, validator: validateImgs }],
        description: [{ required: true, validator: validDesc }]
      },
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
      }
    }
  },
  watch: {
    'baseProductInfo.productSku'() {
      this.init()
    },
    'descType'() {
      this.descTypeChange(this.descType)
    }
  },
  methods: {
    init() {
      const { imgShowList, mainImage, extraImagList } = deepClone(this.baseProductInfo)
      this.imgShowList = imgShowList || []
      this.mainImage = mainImage || ''
      this.extraImagList = extraImagList || []
      this.resetDesc()
    },
    resetDesc() {
      const { description, descTemplateId } = deepClone(this.baseProductInfo)
      this.form.descTemplateId = descTemplateId
      this.descType = descTemplateId ? '2' : '1'
      // 描述不能上传图片，且sku/spu接口带过来的描述图片需要去掉
      // this.form.description = description ? description.replace(/<img.*?(?:>|\/>)/gi, '') : ''
      this.form.description = description || ''
      this.descNum = this.getDescNum()
      // 编辑描述回填edit后再作对比
      this.isEdit && setTimeout(() => {
        this.$emit('editDesc', this.form.description)
      }, 200)
    },
    descTypeChange(value, flag) {
      if (value === '1') {
        this.form.descTemplateId = ''
        this.form.description = deepClone(this.baseProductInfo.description) || ''
        this.inputDesc()
      } else {
        if (flag) this.form.descTemplateId = ''
        this.descSelectTempl()
      }
    },
    // 选择模板
    descSelectTempl() {
      this.templateChangeList.findIndex(item => {
        if (item.isDefault) {
          this.form.descTemplateId = item.id
          this.getTemplate(item.id)
          this.form.description = deepClone(this.baseProductInfo.description) || ''
          this.inputDesc()
        }
      })
    },
    inputDesc() {
      this.descNum = this.getDescNum()
      this.$refs.form.validateField('description')
    },
    // 获取描述模板列表 isChanged 刊登站点，店铺切换
    getTemplateList(publishSiteCode, storeCode, isChanged = false) {
      if (!publishSiteCode || !storeCode) return
      this.$emit('productLoadingStart')
      getTemplatePage({ size: -1, publishSiteCode, storeCode }).then(res => {
        if (res.data) {
          this.templateChangeList = res.data.records
          this.descType === '2' && this.descSelectTempl('2')
        }
      }).finally(() => {
        this.$emit('productLoadingEnd')
      })
    },
    // 选择描述模板 获取预览信息
    getTemplate(value) {
      const { publishSiteCode, storeCode } = this.baseProductInfo
      if (storeCode && publishSiteCode) {
        const description = this.isEdit ? this.baseProductInfo.pmsDesc : this.baseProductInfo.description
        this.loading = false
        this.$emit('productLoadingStart')
        getTemplateContent({ descTemplateId: value, storeCode, publishSiteCode: publishSiteCode, description }).then(res => {
          this.form.description = res.data
        }).finally(() => {
          this.loading = false
          this.$emit('productLoadingEnd')
        })
      }
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
.sp-form{
  max-width: 90%;
}
.image{
  ::v-deep .el-form-item__error{
    margin-top: -15px;
  }
}
.desc-box{
  position: relative;
  margin-right: 10px;
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
}
</style>
