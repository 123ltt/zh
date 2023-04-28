<template>
  <div>
    <draggable v-model="imgDragList"
               :disabled="isReadOnly"
               animation="300"
               element="ul"
               class="el-upload-list el-upload-list--picture-card"
               @change="draggableChange"
    >
      <transition-group>
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
      default: 20
    }
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
    // 添加图片事件
    addImageHandle() {
      this.$modal({
        title: '添加图片',
        component: addImage,
        padding: '0',
        minHeight: '200px',
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
    ::v-deep.el-checkbox__label{
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
</style>
