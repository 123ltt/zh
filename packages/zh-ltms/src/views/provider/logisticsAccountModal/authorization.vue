<!-- 线上发货配置 新增/编辑-->
<template>
  <div>
    <el-form ref="Authorization_id" size="mini" label-width="150px">
      <el-row :gutter="10">
        <span style="margin-left:20px">code:</span>
        <input v-model="AuthorizationData.code" type="text" style="width:80%;margin-left:20px; " maxlength="50">
        <div style="margin-left:80px;margin-top:10px;color:red">提示:wish平台授权时需要填写code值</div>
      </el-row>
      <el-row>
        <div class="float-end me-1">
          <el-button size="mini" type="primary" @click="close(false)">取消</el-button>
          <el-button size="mini" type="primary" @click="define()">确认</el-button>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getToken } from '@/api/logisticsAccount'// 获取token的授权接口
export default {
  name: 'Authorization',
  props: {
    id2: String
  },

  data() {
    return {
      AuthorizationData: {
        id: '',
        code: ''
      }
    }
  },
  created() {
  },

  methods: {
    close(val) {
      this.$parent.$emit('close', val)
    },
    // 授权弹框确定按钮
    define() {
      // 其他接口传参方式
      this.AuthorizationData.id = this.id2
      getToken(this.AuthorizationData).then(res => {
        this.$message.success(res.msg)
        this.$parent.$emit('close', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
