<template>
  <el-form>
    <el-row
      :gutter="20"
      class="m-t-20"
    >
      <el-col :span="12">
        <span class="el-form-item__label">菜单名称</span>
        <div class="el-form-item__content">{{ current.name || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">菜单类型</span>
        <div class="el-form-item__content">{{ current.category == 1 ? '菜单' : '按钮' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">上级菜单</span>
        <div class="el-form-item__content">{{ current.parentName || '-' }}</div>
      </el-col>
      <el-col
        v-if="current.category == 1"
        :span="12"
      >
        <span class="el-form-item__label">菜单图标</span>
        <div
          v-if="current.icon"
          class="el-form-item__content"
        >
          <i
            :class="current.icon"
            class="fl"
          />
        </div>
        <div
          v-else
          class="el-form-item__content"
        > - </div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">前端路由地址</span>
        <div class="el-form-item__content">{{ current.path || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">菜单排序</span>
        <div class="el-form-item__content">{{ current.sort }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">菜单标签</span>
        <div class="el-form-item__content">{{ current.label || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">菜单别名</span>
        <div class="el-form-item__content">{{ current.alias || '-' }}</div>
      </el-col>
      <!-- <el-col :span="12">
        <span class="el-form-item__label">系统管理菜单: </span>
        <div class="el-form-item__content">{{ current.isSuperShowOnly == 1 ? '是' : '否' }}</div>
      </el-col> -->
      <el-col :span="12">
        <span class="el-form-item__label">所属应用</span>
        <div class="el-form-item__content">{{ current.appName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">关联资源</span>
        <div class="el-form-item__content">
          <span
            v-for="(item, index) in current.resList"
            :key="item.id"
          >
            {{ item.appName }}/{{ item.resName }}
            <span v-if="(index + 1) < current.resList.length">,</span>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="20">
        <span class="el-form-item__label">描述</span>
        <div class="el-form-item__content">{{ current.remark || '-' }}</div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'MenuModalView',
  props: ['current']
}
</script>

<style lang="scss" scoped>
.m-t-20 {
  margin-top: 20px;
}
.close-icon {
  z-index: 2;
}
.el-form-item__label {
  width: 120px;
  display: inline-block;
}
.el-form-item__content {
  margin-left: 120px;
}
.el-form {
  padding-right: 20px;
}
</style>
