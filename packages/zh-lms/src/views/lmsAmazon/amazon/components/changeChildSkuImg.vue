<template>
  <div class="modal-box">
    <el-row class="mb-3">
      <el-col :span="2">
        <span class="label">子SKU</span>
      </el-col>
      <el-col :span="22">
        <div class="mb-3">{{ data.productSku }}</div>
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
import { deepClone } from '@/util/util'
import imgShowList from '@/views/components/picture/imgShowList.vue'
export default {
  name: 'ChangeChildSkuImg',
  components: { imgShowList },
  props: {
    data: Object,
    isReadOnly: Boolean
  },
  data() {
    return {
      // 副图最多可选张数
      extraImgNum: 8,
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
