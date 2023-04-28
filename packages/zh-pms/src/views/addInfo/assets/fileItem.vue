// 视频/附件
<template>
  <div class="d-flex align-items-center">
    <span class="flex-grow-1">{{ title }}</span>
    <div>
      <el-link type="primary" :href="url" target="_blank" icon="el-icon-download" class="mx-2" />
      <el-button size="mini" type="text" icon="el-icon-delete" class="mx-2 text-muted" @click="$emit('remove')" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileItem',
  props: {
    title: String,
    url: String
  }
}
</script>
