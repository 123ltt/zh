<template>
  <div class="content">
    <g-list-group item-class="py-1">
      <g-list-group-item label="姓名">
        <g-content v-model="content" :tooltip="false" :rows="[1,3]" type="textarea" :editable="editable" />
      </g-list-group-item>
      <g-list-group-item label="姓名">
        <g-content v-model="name" :tooltip="false" :editable="editable" />
      </g-list-group-item>
      <g-list-group-item label="出生日期">
        <g-content v-model="content" :tooltip="false" type="input" :editable="editable" />
      </g-list-group-item>
    </g-list-group>
    <el-button size="mini" @click="editable=!editable">编辑</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editable: false,
      name: '',
      content: 'GTK (GIMP Toolkit) 是一套跨多种平台的图形工具包，最初为 GIMP 而写，GIMP 是指 GNU 图像处理程序 (GNU Image Manipulation Program)，GIMP 拥有几乎所有图象处理所需的功能，号称 Linux 下的 Photoshop。GTK 后来发展成为 Linux 下开发图形界面应用的主流开发工具。'
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 300px;
  font-size:12px;
  ::v-deep {
    input, textarea {
      font-size: 12px;
    }
  }
}
</style>
