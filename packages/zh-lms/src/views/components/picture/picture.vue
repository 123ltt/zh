<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="'150px'" class="shopee-attr-form form-col">
    <el-form-item label="产品图片" prop="mainImage" class="image">
      <imgShowList
        :store-name="storeName"
        :isoss="isoss"
        :use-mode="useMode"
        :query="query"
        :img-show-list.sync="imgShowList"
        :main-image.sync="mainImage"
        :extra-imag-list.sync="extraImagList"
      />
    </el-form-item>
    <el-form-item v-if="ossWaterShow" label="水印图设置" class="image">
      <el-button v-if="!show" type="primary" @click="openOss">上传图片生成水印图</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import imgShowList from './imgShowList.vue'
import addImage from './addImage.vue'
import OssWatermarkModal from './OssWatermarkModal.vue'
import { encode } from 'js-base64'
const urls = [
  'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/00ea0cfda2659fdb947b4b93d5bc640e.png',
  'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/048e205f616df65cf3dc1d85618f5d14.png'
]
export default {
  name: 'Picture',
  components: { imgShowList },
  props: {
    ossWaterShow: {
      type: Boolean,
      default: false
    },
    storeName: String,
    baseProductInfo: Object,
    productLoading: Number,
    labelWidth: {
      type: String,
      default: '120px'
    },
    isoss: Boolean,
    extraImgNum: {
      type: Number,
      default: 8
    } // 副图最多可选张数
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
    return {
      show: false,
      imgShowList: [],
      mainImage: '',
      extraImagList: [],
      form: {},
      rules: {
        mainImage: [{ required: true, validator: validateImgs }]
      },
      images: [],
      useMode: -1,
      query: ''
    }
  },
  watch: {
    'baseProductInfo.images'() {
      this.imgShowList = this.baseProductInfo.images
      const imageUrl = this.imgShowList.filter(item => item.isPrime === true)?.[0]?.imageUrl || ''
      this.mainImage = imageUrl
    }
  },
  methods: {
    setList(val, code, type) {
      let images = Object.assign([], this.imgShowList)
      type && images.push(...val)
      !type && (images = val)
      this.isoss && images.forEach(item => {
        const check = item.imageUrl.includes('?')
        const text = `?x-oss-process=image/watermark,text_${encode(code)},type_ZmFuZ3poZW5nZmFuZ3Nvbmc,size_30`
        !check && (item.imageUrl = item.imageUrl + text)
      })
      this.imgShowList = this.dupFn(images, 'imageUrl')
    },
    dupFn(objectArray, property) {
      const result = []
      const obj = {}
      objectArray.forEach(function(item) {
        if (!obj[item[property]]) {
          obj[item[property]] = 1
          result.push(item)
        }
      })
      return result
    },
    openOss() {
      this.$modal({
        title: '水印图设置',
        component: OssWatermarkModal,
        width: '70%',
        callback: (val) => {
          if (val) {
            const { query, useMode } = val
            this.useMode = useMode
            if (this.imgShowList?.length && query) {
              this.imgShowList.forEach((item, index) => {
                if (useMode === 1) {
                  this.query = query
                  item.imageUrl = item.imageUrl.split('?')[0] + query
                } else if (useMode === 0) {
                  if (index === 0) {
                    this.query = query
                    this.imgShowList[0].imageUrl = this.imgShowList[0].imageUrl.split('?')[0] + query
                  } else {
                    item.imageUrl = item.imageUrl.split('?')[0]
                  }
                }
              })
            }
          }
        }
      })
    },
    // 选择图片库事件
    addImageHandle() {
      this.$modal({
        title: '图片库',
        component: addImage,
        padding: '0',
        minHeight: '300px',
        data: {
          productPicture: this.productPicture
        },
        callback: (imageUrls) => {
          if (imageUrls) {
            this.productPicture = imageUrls
            this.form.imageUrls = imageUrls.map(item => item.imageUrl)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.shopee-attr-form {
  ::v-deep .el-upload--picture-card {
    line-height: 116px;
  }
}
.image{
  ::v-deep .el-form-item__error{
    margin-top: -15px;
  }
}
</style>
