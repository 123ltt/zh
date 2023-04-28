<template>
  <div class="modal-box">
    <el-row class="m-t-30">
      <el-col :span="2">
        <span class="label">子SKU</span>
      </el-col>
      <el-col :span="22">
        <div class="m-t-30">{{ data.productSku }}<span class="ms-5">只能选一张图片</span></div>
        <imgShowList
          :img-show-list.sync="swatchImgList"
          :changed-list.sync="changedList"
          :is-swatch="true"
          :is-read-only="isReadOnly"
          :type="type"
          :is-detail="isDetail"
        />
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;text-align: right;margin-top: 20px;margin-right: 30px">
      <span class="el-button el-button--default el-button--medium" @click="$parent.$emit('close')">
        <span>取消</span>
      </span>
      <el-button size="small" type="primary" @click="$parent.$emit('close', { swatchImgList })">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/util/util'
import imgShowList from './imgShowList.vue'
export default {
  name: 'ChangeChildSkuImg',
  components: { imgShowList },
  props: {
    data: Object,
    isReadOnly: Boolean,
    type: String,
    isDetail: String
  },
  data() {
    return {
      // 图片列表
      swatchImgList: [],
      changedList: []
    }
  },
  created() {
    const { swatchImgList, swatchUrl } = deepClone(this.data)
    this.changedList = swatchUrl ? [swatchUrl] : []
    this.swatchImgList = swatchImgList
  }
}
</script>

<style lang="scss" scoped>
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
