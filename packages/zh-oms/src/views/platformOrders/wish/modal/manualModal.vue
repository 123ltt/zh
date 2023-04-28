<template>
  <div>
    {{ msg }}
    <el-row type="flex" class="row-bg mt-2" justify="end">
      <el-button size="mini" @click="close()">取消</el-button>
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { manualPush } from '@/api/platformOrder'
export default {
  props: {
    manualList: {
      type: Array,
      default: () => []
    },
    showIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      msg: '',
      ids: []
    }
  },
  mounted() {
    this.showMsg()
  },
  methods: {
    showMsg() {
      this.msg = `已勾选平台单号${this.showIds.join(',')}进行合并订单，请确定是否合单？`
    },
    submit() {
      this.manualList.forEach(item => {
        this.ids.push(item)
      })
      manualPush(this.ids).then(res => {
        this.close(true)
        this.$message.success(res.msg)
      })
    },
    close(bool = false) {
      this.$parent.$emit('close', bool)
    }
  }
}
</script>

<style>

</style>
