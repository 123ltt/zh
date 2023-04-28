<template>
  <div class="el-upload-list el-upload-list--picture-card">
    <div v-for="(item, index) in marketImages" :key="index" class="d-inline-block me-2">
      <div v-if="!item.url"
           tabindex="0"
           class="el-upload el-upload--picture-card"
           @click="addImageHandle('add', item.imageType)"
      >
        <div>
          <i class="el-icon-plus" />
          <div class="line-height-0">{{ item.imageType === 1 ? '场景图' : '白底图' }}</div>
        </div>
      </div>
      <li v-if="item.url" class="el-upload-list__item">
        <g-thumb :width="110"
                 :height="110"
                 :url="item.url"
                 class="cursor-pointer"
                 @click.native="addImageHandle('edit', item.imageType)"
        />
        <div class="el-upload-list__item-btn">
          <!-- Tips：白底图(方图) type: 2，场景图(长图) type: 1 -->
          <el-checkbox
            v-model="item.isCheck"
            :label="item.imageType === 1 ? '场景图' : '白底图'"
            :disabled="isReadOnly"
          />
        </div>
      </li>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/util/util'
// import addImage from './addImage.vue'
import attrPic from './attrPic.vue'
export default {
  props: {
    marketImages: Array,
    isReadOnly: Boolean,
    marketImagesSelect: Array
  },
  methods: {
    // 添加图片事件
    addImageHandle(changeType, imageType) {
      // 添加场景图需要裁剪成750*1000
      const ossPrams = imageType === 1 ? '?x-oss-process=image/resize,w_750,h_1000,limit_0,m_pad/crop' : ''
      const imgShowListByPms = this.marketImagesSelect.map(item => {
        return {
          imageUrl: item.imageUrl + ossPrams,
          isCheck: false
        }
      })
      const type = ['', 'marketImages1', 'marketImages2']
      this.$modal({
        title: '图片库',
        component: attrPic,
        padding: '20px 0 20px 20px',
        minHeight: '300px',
        width: '754px',
        data: {
          imgShowListByPms,
          type: type[imageType]
        },
        callback: (imageUrls) => {
          if (imageUrls && imageUrls.length) {
            const list = deepClone(this.marketImages)
            list[imageType - 1].url = imageUrls[0]
            list[imageType - 1].isCheck = true
            this.$emit('update:marketImages', list)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload--picture-card, .el-upload-list__item{
  width: 112px;
  height: 112px;
  vertical-align: top;
}
.el-upload--picture-card{line-height: 90px !important}
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
.cursor-pointer{
  cursor: pointer;
}
.cursor-move{
  cursor: move;
}
.line-height-0{
  line-height: 0;
  margin-top: -24px;
  color: #888;
}
</style>
