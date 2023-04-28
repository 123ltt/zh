<template>
  <el-row>
    <div>{{ message }}</div>
    <div style="padding-bottom: 20px;margin-top: 20px;text-align: right">
      <span class="el-button el-button--default el-button--medium" @click="$parent.$emit('close')"><span>取消</span></span>
      <el-button type="primary" @click="$parent.$emit('close', true)">继续提交</el-button>
    </div>
  </el-row>
</template>

<script>

/**
 * @description 二次确认弹窗
 * **/

export default {
  name: 'ErrorTips',
  props: {
    message: String
  }
}
</script>
