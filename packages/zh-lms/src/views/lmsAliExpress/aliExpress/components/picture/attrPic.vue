<template>
  <div class="modal-box">
    <imgShowList
      :img-show-list.sync="imgShowList"
      :changed-list.sync="changed"
      :type="type"
    />
    <div style="padding-bottom: 20px;text-align: right;margin-top: 20px;margin-right: 30px">
      <span class="el-button el-button--default el-button--medium" @click="$parent.$emit('close')">
        <span>取消</span>
      </span>
      <el-button size="small" type="primary" @click="onOk">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/util/util'
import ImgShowList from './imgShowList.vue'
export default {
  name: 'AttrPic',
  components: { ImgShowList },
  props: {
    imgShowListByPms: Array,
    isReadOnly: Boolean,
    type: {
      type: String,
      default: 'attrPic'
    }
  },
  data() {
    return {
      imgShowList: [],
      changed: []
    }
  },
  created() {
    this.imgShowList = deepClone(this.imgShowListByPms)
  },
  methods: {
    onOk() {
      this.$parent.$emit('close', this.changed)
    }
  }
}
</script>
