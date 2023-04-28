<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="'150px'" class="shopee-attr-form form-col">
    <el-form-item label="图片" prop="mainImage">
      <draggable v-model="form.imgShowList"
                 animation="300"
                 element="ul"
                 class="el-upload-list el-upload-list--picture-card"
                 @change="draggableChange"
      >
        <transition-group>
          <div v-for="(item, index) in form.imgShowList" :key="index" class="d-inline-block">
            <li class="el-upload-list__item">
              <g-thumb :width="146"
                       :height="146"
                       :url="item.imageUrl"
                       class="cursor-move"
              />
              <div class="el-upload-list__item-btn">
                <el-checkbox
                  v-model="item.isPrime"
                  label="主图"
                  class="m-l-5"
                  @change="(value) => changeMain(value, item.imageUrl)"
                />
                <el-checkbox
                  v-model="item.isExtra"
                  label="副图"
                  @change="(value) => changeExtra(value, item.imageUrl, index)"
                />
              </div>
            </li>
          </div>
        </transition-group>
      </draggable>
      <!-- <div tabindex="0" class="el-upload el-upload--picture-card" @click="addImageHandle">
        <i class="el-icon-plus" />
      </div> -->
    </el-form-item>
  </el-form>
</template>

<script>
import draggable from 'vuedraggable'
import addImage from './addImage.vue'
export default {
  name: 'Picture',
  components: { draggable },
  props: {
    baseProductInfo: Object,
    productLoading: Number,
    labelWidth: {
      type: String,
      default: '120px'
    }
  },
  data() {
    // 选择图片验证
    const validateImgs = (rule, value, callback) => {
      if (this.form.mainImage && this.form.extraImagList && this.form.extraImagList.length <= this.extraImgNum) {
        callback()
      } else {
        callback(new Error('主图单选，副图最多选20张'))
      }
    }
    return {
      extraImgNum: 20, // 副图最多可选张数
      imgShowList: [], // 图片列表
      extraImagList: [],
      imgShowMarketList: '',
      form: {
        imgShowList: [], // 图片列表
        mainImage: '', // 主图
        extraImagList: [] // 副图
      },
      rules: {
        mainImage: [{ required: true, validator: validateImgs }]
      }
    }
  },
  watch: {
    baseProductInfo() {
      const { imgShowList, mainImage, extraImagList } = this.baseProductInfo
      this.form = Object.assign({}, this.form, { imgShowList, mainImage, extraImagList: extraImagList || [] })
    }
  },
  methods: {
    // 更改店铺清空数据
    storeChange() {
      // this.form = {
      //   imgShowList: [], // 图片列表
      //   mainImage: '', // 主图
      //   extraImagList: [] // 副图
      // }
      this.form.imgShowList && this.form.imgShowList.splice(0, this.form.imgShowList.length)
      this.imgShowList = []
      this.extraImagList = []
    },
    draggableChange(value) {
      this.form.extraImagList = []
      this.form.imgShowList.filter(item => {
        item.isExtra && this.form.extraImagList.push(item.imageUrl)
      })
    },
    // 选择主图事件
    changeMain(value, imgUrl) {
      if (value) {
        this.form.imgShowList.forEach((item, index) => {
          if (item.imageUrl !== imgUrl) {
            this.$set(this.form.imgShowList[index], 'isPrime', false)
          } else {
            this.$set(this.form.imgShowList[index], 'isPrime', true)
            this.$set(this.form.imgShowList[index], 'isExtra', false)
            const idx = this.form.extraImagList.findIndex(ex => ex === imgUrl)
            if (idx > -1) {
              this.form.extraImagList.splice(idx, 1)
            }
          }
        })
        this.form.mainImage = imgUrl
      } else {
        this.form.mainImage = ''
      }
    },
    // 选择副图事件
    changeExtra(value, imgUrl, index) {
      if (value) {
        this.form.extraImagList.push(imgUrl)
        if (this.form.mainImage === imgUrl) {
          this.form.mainImage = ''
          this.$set(this.form.imgShowList[index], 'isPrime', false)
        }
      } else {
        this.form.extraImagList = this.form.extraImagList.filter(item => item !== imgUrl && item)
      }
    },
    // 添加图片事件
    addImageHandle() {
      this.$modal({
        title: '添加图片',
        component: addImage,
        padding: '0',
        minHeight: '200px',
        callback: (imageUrl) => {
          if (imageUrl) {
            this.form.imgShowList = [...this.form.imgShowList, ...imageUrl]
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
.el-upload-list__item-btn{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    text-align: center;
    color: #fff;
    font-size: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    line-height: 0;
    padding: 10px 0px;
}
.cursor-move{
  cursor: move;
}
</style>
