<template>
  <el-row>
    <div>
      <span><b>sku：</b>{{ data.sku }}</span>
      <span>， <b>违禁词：</b>{{ data.fbWords.join(',') }}</span>
    </div>
    <div style="padding-bottom: 20px;margin-top: 20px;text-align: right">
      <span class="el-button el-button--default el-button--medium" @click="$parent.$emit('close')"><span>取消</span></span>
      <el-button type="primary" @click="$parent.$emit('close', true)">继续提交</el-button>
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'ErrorTips',
  props: {
    data: Object
  }
}
</script>

<style>

</style>
