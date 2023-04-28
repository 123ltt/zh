<template>
  <div>
    <draggable v-model="imgDragList"
               :disabled="isReadOnly"
               animation="300"
               element="ul"
               class="el-upload-list el-upload-list--picture-card"
               @change="draggableChange"
    >
      <div v-for="(item, index) in imgDragList" :key="index" class="d-inline-block">
        <li class="el-upload-list__item">
          <g-thumb :width="110"
                   :height="110"
                   :url="item.imageUrl"
                   :class="!isReadOnly && 'cursor-move'"
          />
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
              :disabled="isReadOnly || disabledExtra(item)"
              @change="(value) => changeExtra(value, item.imageUrl, index)"
            />
            <i v-if="isDetail!=='isDetail'" class="el-icon-circle-close" :class="'iconClose'" @click="deletePicture(item,index)" />
          </div>
        </li>
      </div>
    </draggable>
    <div v-if="!isReadOnly" tabindex="0" class="el-upload el-upload--picture-card" @click="addImageHandle">
      <i class="el-icon-plus" />
    </div>
  </div>

</template>

<script>
import { deepClone } from '@/util/util'
import draggable from 'vuedraggable'
import addImage from './addImage.vue'
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
      default: 11
    },
    isDetail: String
  },
  data() {
    return {
      imgDragList: []
    }
  },
  watch: {
    imgShowList: {
      handler() {
        this.imgDragList = deepClone(this.imgShowList)
      },
      immediate: true
    }
  },
  methods: {
    // 副图超过限制不能打勾
    disabledExtra(item) {
      let disabled = false
      const isExtraList = this.imgDragList.filter(img => img.isExtra)
      if (!item.isExtra && isExtraList.length >= this.extraImgNum) {
        disabled = true
      }
      return disabled
    },
    // 添加图片事件
    addImageHandle() {
      this.$modal({
        title: '添加图片',
        component: addImage,
        padding: '0',
        minHeight: '200px',
        data: {
          extraImgNum: this.extraImgNum,
          imgDragList: this.imgDragList
        },
        callback: (imageUrls) => {
          if (imageUrls) {
            this.$emit('update:imgShowList', [...this.imgDragList, ...imageUrls])
          }
        }
      })
    },
    // 选择主图事件
    changeMain(value, imgUrl) {
      if (value) {
        const extraImagList = [...this.extraImagList]
        const imgDragList = deepClone(this.imgDragList)
        imgDragList.forEach((item, index) => {
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
        this.$emit('update:imgShowList', imgDragList)
        this.$emit('update:mainImage', imgUrl)
        this.$emit('update:extraImagList', extraImagList)
      } else {
        this.$emit('update:mainImage', '')
      }
    },
    // 选择副图事件
    changeExtra(value, imgUrl, index) {
      const imgDragList = deepClone(this.imgDragList)
      let extraImagList = []
      if (value) {
        extraImagList = [...this.extraImagList, imgUrl]
        imgDragList[index].isExtra = true
        if (this.mainImage === imgUrl) {
          this.$emit('update:mainImage', '')
          imgDragList[index].isPrime = false
        }
      } else {
        extraImagList = this.extraImagList.filter(item => item !== imgUrl && item)
      }
      this.$emit('update:extraImagList', extraImagList)
      this.$emit('update:imgShowList', imgDragList)
    },
    draggableChange(value) {
      const extraImagList = []
      this.imgDragList.filter(item => {
        item.isExtra && extraImagList.push(item.imageUrl)
      })
      this.$emit('update:imgShowList', this.imgDragList)
      this.$emit('update:extraImagList', extraImagList)
    },
    // 删除图片
    deletePicture(item, index) {
      if (item.isPrime) this.$emit('update:mainImage', '')
      this.imgDragList.splice(index, 1)
      this.$emit('update:extraImagList', this.extraImagList.filter(its => item.imageUrl !== its))
      this.$emit('update:imgShowList', this.imgDragList)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload-list__item, .el-upload--picture-card{
  width: 112px !important;
  height: 112px !important;
}
.el-upload--picture-card {
  line-height: 112px;
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
.iconClose{
  position: relative;
  top:-100px;
  left: 35px;
  font-size: 20px;
  color:#ccc;
  cursor: pointer;
  &:hover{
    color: $--color-primary;
  }
}
</style>
