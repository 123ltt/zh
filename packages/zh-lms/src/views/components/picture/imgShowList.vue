<template>
  <div>
    <draggable v-model="imgShowList"
               :disabled="isReadOnly"
               animation="300"
               element="ul"
               class="el-upload-list el-upload-list--picture-card"
               @change="draggableChange"
    >
      <transition-group>
        <div v-for="(item, index) in imgShowList" :key="index" class="d-inline-block">
          <li class="el-upload-list__item">
            <div class="close-box">
              <i class="el-icon-circle-close close fs-2" @click="remove(index)" />
              <g-thumb :width="110" :height="110" :url="item.imageUrl" :class="!isReadOnly && 'cursor-move'" />
            </div>
            <div class="el-upload-list__item-btn">
              <el-checkbox
                v-model="item.isPrime"
                label="主图"
                class="me-3"
                :disabled="isReadOnly"
                @change="(value) => changeMain(value, item.imageUrl)"
              />
              <el-checkbox
                v-model="item.isExtra"
                label="副图"
                :disabled="isReadOnly"
                @change="(value) => changeExtra(value, item.imageUrl, index)"
              />
            </div>
          </li>
        </div>
      </transition-group>
    </draggable>
    <div v-if="!isReadOnly" tabindex="0" class="el-upload el-upload--picture-card" @click="addImageHandle">
      <i class="el-icon-plus" />
    </div>
  </div>

</template>

<script>
import draggable from 'vuedraggable'
import addImage from './addImage.vue'
import { encode } from 'js-base64'
export default {
  name: 'ImgShowList',
  components: { draggable },
  props: {
    imgShowList: Array,
    mainImage: String,
    extraImagList: Array,
    isReadOnly: Boolean,
    extraImgNum: { // 副图最多可选张数
      type: Number,
      default: 8
    },
    useMode: Number,
    query: String,
    isoss: { // 水印
      type: Boolean,
      default: false
    },
    storeName: String// 水印文字
  },
  data() {
    return {
    }
  },
  methods: {
    // 添加图片事件
    addImageHandle() {
      this.$modal({
        title: '添加图片',
        component: addImage,
        padding: '0',
        minHeight: '200px',
        callback: (imageUrls) => {
          if (imageUrls) {
            const images = [...this.imgShowList, ...imageUrls]
            if (this.isoss) {
              images.forEach((item, index) => {
                const text = `?x-oss-process=image/watermark,text_${encode(this.storeName || '我的店铺')},type_ZmFuZ3poZW5nZmFuZ3Nvbmc,size_30`
                if (this.useMode === -1 && (!item.imageUrl.includes('?'))) {
                  item.imageUrl = item.imageUrl + text
                }
                if (this.useMode === 0) {
                  if (index === 0) {
                    item.imageUrl = item.imageUrl.split('?')[0] + this.query
                  } else {
                    item.imageUrl = item.imageUrl.split('?')[0]
                  }
                }
                if (this.useMode === 1) {
                  item.imageUrl = item.imageUrl.split('?')[0] + this.query
                }
              })
            }
            this.$emit('update:imgShowList', images)
          }
        }
      })
    },
    // 选择主图事件
    changeMain(value, imgUrl) {
      if (value) {
        const extraImagList = [...this.extraImagList]
        this.imgShowList.forEach((item, index) => {
          if (item.imageUrl !== imgUrl) {
            item.isPrime = false
          } else {
            item.isPrime = true
            item.isExtra = false
            const idx = this.extraImagList.findIndex(ex => ex === imgUrl)
            if (idx > -1) {
              extraImagList.splice(idx, 1)
            }
          }
        })
        this.$emit('update:imgShowList', this.imgShowList)
        this.$emit('update:mainImage', imgUrl)
        this.$emit('update:extraImagList', extraImagList)
      } else {
        this.$emit('update:mainImage', '')
      }
    },
    // 选择副图事件
    changeExtra(value, imgUrl, index) {
      let extraImagList = []
      if (value) {
        extraImagList = [...this.extraImagList, imgUrl]
        this.imgShowList[index].isExtra = true
        if (this.mainImage === imgUrl) {
          this.$emit('update:mainImage', '')
          this.imgShowList[index].isPrime = false
        }
      } else {
        extraImagList = this.extraImagList.filter(item => item !== imgUrl && item)
      }
      this.$emit('update:extraImagList', extraImagList)
      this.$emit('update:imgShowList', this.imgShowList)
    },
    remove(index) {
      this.imgShowList.splice(index, 1)
      this.$emit('update:imgShowList', this.imgShowList)
    },
    draggableChange(value) {
      const extraImagList = []
      this.imgShowList.filter(item => {
        item.isExtra && extraImagList.push(item.imageUrl)
      })
      this.$emit('update:imgShowList', this.imgShowList)
      this.$emit('update:extraImagList', extraImagList)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload-list__item, .el-upload--picture-card{
  width: 112px;
  height: 112px;
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
    ::v-deep .el-checkbox__label{
      padding-left: 4px;
    }
}
.m-t-30{
  margin-bottom: 30px;
}
.modal-box{
  padding: 20px;
}
.cursor-move{
  cursor: move;
}
.close-box{
  position: relative;
}
.close{
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 2;
}
</style>
