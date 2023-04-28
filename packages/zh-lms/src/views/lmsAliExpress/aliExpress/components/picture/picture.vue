<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="'180px'" class="attr-form form-col">
    <el-form-item label="产品图片" prop="imageUrls" class="image">
      <imgShowList
        :img-show-list.sync="imgShowProductList"
        :changed-list.sync="form.imageUrls"
        :extra-img-num="extraImgNum"
        :type="'productImg'"
      />
    </el-form-item>
    <el-form-item label="营销图片" prop="marketImages" class="image">
      <marketImages :market-images.sync="form.marketImages" :market-images-select="marketImagesSelect" />
    </el-form-item>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import imgShowList from './imgShowList.vue'
import marketImages from './marketImages.vue'
import addImage from './addImage.vue'
// import * as addListingHandle from './../aliExpress.handle.js'
export default {
  name: 'Picture',
  components: { imgShowList, marketImages },
  props: {
    baseProductInfo: Object
  },
  data() {
    // 选择图片验证
    const validateImgs = (rule, value, callback) => {
      if (this.form.imageUrls.length && this.form.imageUrls.length <= this.extraImgNum) {
        callback()
      } else {
        callback(new Error('产品图片最多选6张'))
      }
    }
    return {
      extraImgNum: 6,
      imgShowProductList: [],
      marketImagesSelect: [], // 营销图片可选列表
      img1: '', // 场景图 （长图）
      img2: '', // 白底图（方图）
      form: {
        imageUrls: [],
        marketImages: [] // 营销图
      },
      rules: {
        imageUrls: [{ required: true, validator: validateImgs }]
        // marketImages: [{ required: true, validator: validateMarketImages }]
      }
    }
  },
  watch: {
    'baseProductInfo.productSpu'() {
      const { imgShowList, imgShowMarketList } = this.baseProductInfo
      this.imgShowProductList = deepClone(imgShowList)
      this.marketImagesSelect = deepClone(imgShowList)
      this.form.marketImages = deepClone(imgShowMarketList)
      this.form.imageUrls = []
      imgShowList.filter(item => {
        if (item.isCheck) {
          this.form.imageUrls.push(item.imageUrl)
        }
      })
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
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
.image{
  ::v-deep .el-form-item__error{
    margin-top: -15px;
  }
}
</style>
