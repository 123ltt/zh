<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px" class="sp-form form-col">
    <el-form-item
      v-for="(k, v, index) in form.bulletPoint"
      :ref="index+'bulletPoint'"
      :key="v"
      :label="'卖点'+ (index+1)"
      :prop="'bulletPoint.' + v"
      :rules="[{ required: true, message: '请输入'+'卖点'+ (index+1), trigger: 'blur' }]"
    >
      <el-input
        v-model="form.bulletPoint[v]"
        :placeholder="'卖点'+ (index+1)"
        maxlength="500"
        show-word-limit
        @change="() => form.bulletPoint[v] = form.bulletPoint[v].replace(/;/g, '')"
      />
    </el-form-item>
    <el-form-item label="关键词" prop="searchTerms">
      <el-input v-model="form.searchTerms" placeholder="可添加多个关键词" maxlength="250" show-word-limit />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <div class="desc-box">
        <!-- <editor ref="ueditor"
                v-model="form.description"
                :text-content.sync="descText"
                :custom-config="config"
                @input="inputDesc"
        /> -->
        <el-input v-model="form.description"
                  :autosize="{ minRows: 4, maxRows: 10}"
                  type="textarea"
                  show-word-limit
                  placeholder="描述"
                  @input="inputDesc"
        />
        <span class="word-limit">{{ descNum }}/{{ descTotal }}</span>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
/**
 * 卖点1...5
 * 关键词
 * 描述
 **/
import { deepClone } from '@/util/util'
// import { Editor } from 'global-components'
import { dealDescNbsp } from './addListing.handle.js'
const bulletPointBaseData = () => {
  return { 0: '', 1: '', 2: '', 3: '', 4: '' }
}
export default {
  name: 'SellingPoint',
  // components: { Editor },
  props: {
    // 产品详细信息
    baseProductInfo: Object,
    isEdit: Boolean,
    productAttrShowList: Array
  },
  data() {
    const validDesc = (rule, value, callback) => {
      // 判断富文本的纯文本是否有值
      if (this.form.description && this.form.description.length > this.descTotal) {
        callback(new Error(`描述不能超过${this.descTotal}字符`))
      // } else if (!this.descText) {
      //   callback(new Error('描述不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        // 卖点
        bulletPoint: bulletPointBaseData(),
        // 搜索词
        searchTerms: '',
        // 描述
        description: ''
      },
      // 描述纯文本
      descText: '',
      descNum: 0,
      descTotal: 2000,
      rules: {
        searchTerms: [{ required: true, message: '请填写关键词', trigger: 'blur' }],
        description: [{ required: true, validator: validDesc }]
        // description: [{ required: true, message: '请填写描述', trigger: 'blur' }]
      },
      config: {
        menus: [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          'quote' // 引用
        ]
      }
    }
  },
  watch: {
    'baseProductInfo.productSku'() {
      const { description, searchTerms, bulletPoint } = deepClone(this.baseProductInfo)
      this.form.searchTerms = searchTerms
      this.form.description = description || ''
      // 描述不能上传图片，且sku/spu接口带过来的描述图片需要去掉
      // this.form.description = description ? description.replace(/<img.*?(?:>|\/>)/gi, '') : ''
      this.form.description = dealDescNbsp(this.form.description)
      this.descNum = this.getDescNum()
      if (bulletPoint) {
        bulletPoint.split(';').some((item, index) => {
          this.form.bulletPoint[index] = item
          return index === 4
        })
      } else {
        this.form.bulletPoint = bulletPointBaseData()
      }
      // 编辑描述回填edit后再作对比
      this.isEdit && setTimeout(() => {
        this.$emit('editDesc', this.form.description)
      }, 200)
    },
    productAttrShowList(value) {
      if (!this.isEdit) {
        !value.length && (this.form.bulletPoint = bulletPointBaseData())
        value.find(item => {
          if (item.fieldNameEn === 'product sell point') {
            const sellPointDefaultVal = item.fieldValue.split('\n')
            sellPointDefaultVal.some((str, i) => {
              this.form.bulletPoint[i] = str
              return i === 4
            })
          }
        })
      }
    }
  },
  methods: {
    inputDesc() {
      this.descNum = this.getDescNum()
      this.$refs.form.validateField('description')
    },
    // 描述总字数统计
    getDescNum() {
      const desc = this.form.description
      const lineN = desc.match(/\n/ig) || []
      const lineR = desc.match(/\r/ig) || []
      const lineT = desc.match(/\t/ig) || []
      const lineY = desc.match(/\\/ig) || []
      // eslint-disable-next-line no-useless-escape
      const lineG = desc.match(/\"/ig) || []
      // eslint-disable-next-line no-useless-escape
      const lineD = desc.match(/\'/ig) || []
      const newline = [...lineN, ...lineR, ...lineT, ...lineY, ...lineG, ...lineD]
      return desc ? desc.length + newline.length : 0
    }
  }
}
</script>

<style lang="scss" scoped>
.desc-box{
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
}
</style>
