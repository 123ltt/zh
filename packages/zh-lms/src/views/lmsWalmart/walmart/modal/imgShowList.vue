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
          <div v-if="type=='swatchImg'" class="el-upload-list__item-btn">
            <el-checkbox
              v-model="item.isCheck"
              label="选择"
              :disabled="isReadOnly"
              @change="(value) => changed(value, item.imageUrl)"
            />
          </div>
          <div v-else class="el-upload-list__item-btn">
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
          <i v-if="isDetail !== 'isDetail'" class="el-icon-circle-close iconClose" @click="deletePicture(item, index)" />
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
    type: {
      type: String,
      default: 'productImg'
    },
    imgShowList: {
      type: Array,
      default: () => []
    },
    changedList: {
      type: Array,
      default: () => []
    },
    mainImage: {
      type: String,
      default: ''
    },
    extraImagList: Array,
    isReadOnly: Boolean,
    extraImgNum: { // 副图最多可选张数
      type: Number,
      default: 8
    },
    isSwatch: { // 是否为swatch图
      type: Boolean,
      dafault: false
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
    // 添加图片事件
    addImageHandle() {
      this.$modal({
        title: '添加图片',
        component: addImage,
        padding: '0',
        minHeight: '200px',
        data: {
          isSwatch: this.isSwatch,
          imgDragList: this.imgDragList
        },
        callback: (imageUrls) => {
          if (imageUrls) {
            this.$emit('update:imgShowList', [...this.imgDragList, ...imageUrls])
          }
        }
      })
    },
    // 选择勾选事件
    changed(value, imgUrl) {
      const imgDragList = deepClone(this.imgDragList)
      if (value) { // 勾选
        imgDragList.forEach((item, index) => {
          if (item.imageUrl !== imgUrl) {
            item.isCheck = false
          } else {
            item.isCheck = true
          }
        })
        this.$emit('update:changedList', [imgUrl])
      } else { // 取消
        const changedList = this.changedList.filter(item => item !== imgUrl && item)
        this.$emit('update:changedList', changedList)
      }
      this.$emit('update:imgShowList', imgDragList)
    },
    // 选择主图事件
    changeMain(value, imgUrl) {
      const imgDragList = deepClone(this.imgDragList)
      if (value) {
        const extraImagList = [...this.extraImagList]
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
        imgDragList.find(item => item.imageUrl === imgUrl).isPrime = false
        this.$emit('update:imgShowList', imgDragList)
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
      this.imgDragList.splice(index, 1)
      if (!this.isSwatch) {
        if (item.isPrime) this.$emit('update:mainImage', '')
        if (item.isExtra) this.$emit('update:extraImagList', this.extraImagList.filter(its => item.imageUrl !== its))
      }
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
    padding: 6px 0px;
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
  position: absolute;
  left: 85px;
  top: 5px;
  font-size: 20px;
  color:#ccc;
}

</style>
