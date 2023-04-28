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
              v-model="item.isCheck"
              label="选择"
              :disabled="isReadOnly || disabledExtra(item)"
              @change="(value) => changed(value, item.imageUrl, index)"
            />
          </div>
          <i v-if="!isReadOnly && imgDragList.length >1 " class="el-icon-circle-close iconClose" @click="deletePicture(item,index)" />
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
    type: String,
    imgShowList: {
      type: Array,
      default: () => []
    },
    changedList: {
      type: Array,
      default: () => []
    },
    img1: String,
    img2: String,
    isReadOnly: Boolean,
    extraImgNum: { // 副图最多可选张数
      type: Number,
      default: 1
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
    // 删除图片
    deletePicture(item, index) {
      this.imgDragList.splice(index, 1)
      this.draggableChange()
    },
    // 超过限制不能打勾
    disabledExtra(item) {
      let disabled = false
      if (this.extraImgNum > 1) {
        const isExtraList = this.imgDragList.filter(img => img.isCheck)
        if (!item.isCheck && isExtraList.length >= this.extraImgNum) {
          disabled = true
        }
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
          type: this.type
        },
        callback: (imageUrls) => {
          if (imageUrls) {
            // 新添加的图片默认勾选副图，不超过限制的前提下
            const changeExtraNum = this.imgDragList.filter(item => item.isCheck)
            const setExtraNum = this.extraImgNum - changeExtraNum.length
            const newImgList = []
            imageUrls.forEach((item, i) => {
              if (i < setExtraNum) {
                item.isCheck = true
                newImgList.push(item.imageUrl)
              }
            })
            this.$emit('update:changedList', [...this.changedList, ...newImgList])
            this.$emit('update:imgShowList', [...this.imgDragList, ...imageUrls])
          }
        }
      })
    },
    // 选择勾选事件
    changed(value, imgUrl, index) {
      if (value) {
        const changedList = this.extraImgNum === 1 ? [imgUrl] : [...this.changedList, imgUrl]
        if (this.extraImgNum === 1) {
          this.imgDragList.forEach(item => {
            item.isCheck = item.imageUrl === imgUrl
          })
        }
        this.$emit('update:changedList', changedList)
      } else {
        const changedList = this.changedList.filter(item => item !== imgUrl && item)
        this.$emit('update:changedList', changedList)
      }
    },
    draggableChange(value) {
      const changedList = []
      this.imgDragList.filter(item => {
        item.isCheck && changedList.push(item.imageUrl)
      })
      this.$emit('update:imgShowList', this.imgDragList)
      this.$emit('update:changedList', changedList)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload-list__item, .el-upload--picture-card{
  width: 112px;
  height: 112px;
}
.el-upload--picture-card{line-height: 90px}
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
    padding: 2px 0px;
}
.cursor-move{
  cursor: move;
}
.iconClose{
  position: relative;
  top: -112px;
  right: -84px;
  font-size: 20px;
  color: #ccc;
  cursor: pointer;
  &:hover{
    color: $--color-primary;
  }
}
</style>
