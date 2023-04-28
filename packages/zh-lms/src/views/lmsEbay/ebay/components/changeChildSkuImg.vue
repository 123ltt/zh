<template>
  <div class="modal-box">
    <el-row class="m-t-30">
      <el-col :span="2">
        <span class="label">子SKU</span>
      </el-col>
      <el-col :span="22">
        <div class="m-t-30">{{ data.productSku }}</div>
        <imgShowList
          :img-show-list.sync="imgShowList"
          :main-image.sync="mainImage"
          :extra-imag-list.sync="extraImagList"
          :is-read-only="isReadOnly"
        />
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;text-align: right;margin-top: 20px;margin-right: 30px">
      <span class="el-button el-button--default el-button--medium" @click="$parent.$emit('close')">
        <span>取消</span>
      </span>
      <el-button size="small" type="primary" @click="$parent.$emit('close', { mainImage, extraImagList, imgShowList })">确 定</el-button>
    </div>
  </div>
</template>

<script>
// import draggable from 'vuedraggable'
import { deepClone } from '@/util/util'
import imgShowList from './imgShowList.vue'
export default {
  name: 'ChangeChildSkuImg',
  components: { imgShowList },
  props: {
    data: Object,
    isReadOnly: Boolean,
    extraImgNum: { // 副图最多可选张数
      type: Number,
      default: 11
    }
  },
  data() {
    return {
      // 图片列表
      imgShowList: [],
      // 主图
      mainImage: '',
      // 副图
      extraImagList: []
    }
  },
  created() {
    const { mainImage, extraImagList, imgShowList } = deepClone(this.data)
    this.mainImage = mainImage
    this.extraImagList = extraImagList
    this.imgShowList = imgShowList
  }
}
</script>

<style lang="scss" scoped>
// .el-upload-list--picture-card .el-upload-list__item, .el-upload--picture-card{
//   width: 100px;
//   height: 100px;
// }
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
