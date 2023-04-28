<template>
  <div class="w-50">
    <g-multiple-input v-model="content" />
    <el-button size="mini" @click="content=[1,2,3]">重新赋值 数组</el-button>
    <el-button size="mini" @click="content='a b c'">重新赋值 字符串</el-button>
    <pre>{{ content }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '7 8'
    }
  }
}
</script>
