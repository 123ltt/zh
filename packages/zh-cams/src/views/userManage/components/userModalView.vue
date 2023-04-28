<template>
  <el-form
    v-loading="loading"
    :gutter="5"
  >
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="avue-group__header">
            <!-- <i class="el-icon-user-solid avue-group__icon" /> -->
            <h1 class="avue-group__title">基础信息</h1>
          </div>
        </template>
        <el-row>
          <el-col :span="11">
            <span class="el-form-item__label">登录账号</span>
            <div class="el-form-item__content">{{ current.account || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">用户姓名</span>
            <div class="el-form-item__content">{{ current.name || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">用户生日</span>
            <div class="el-form-item__content">{{ current.birthday || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">工号</span>
            <div class="el-form-item__content">{{ current.jobNumber || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">用户性别</span>
            <div class="el-form-item__content">{{ sex[current.sex] || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">手机号码</span>
            <div class="el-form-item__content">{{ current.phone || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">电子邮箱 </span>
            <div class="el-form-item__content">{{ current.email || '-' }}</div>
          </el-col>
          <el-col :span="11">
            <span class="el-form-item__label">用户状态 </span>
            <div class="el-form-item__content">{{ current.status == 1 ? '启用' : '禁用' || '-' }}</div>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="avue-group__header">
            <!-- <i class="el-icon-s-order avue-group__icon" /> -->
            <h1 class="avue-group__title">职责信息</h1>
          </div>
        </template>
        <el-row class="m-b-20">
          <el-col :span="22">
            <el-row v-for="(item, index) in current.userDuties" :key="index" class="m-b-20">
              <el-col :span="12">
                <span class="el-form-item__label">{{ item.type == 1 ? '所属公司' : '关联公司' }}</span>
                <div class="el-form-item__content">{{ item.company.orgName || '-' }}</div>
              </el-col>
              <el-col :span="12">
                <span class="el-form-item__label">{{ item.type == 1 ? '所属部门' : '关联部门' }}</span>
                <div class="el-form-item__content">{{ item.department.orgName || '-' }}</div>
              </el-col>
              <el-col :span="12">
                <span class="el-form-item__label">{{ item.type == 1 ? '所属岗位' : '关联岗位' }}</span>
                <div class="el-form-item__content">{{ item.post.postName || '-' }}</div>
              </el-col>
              <el-col :span="12">
                <span class="el-form-item__label">{{ item.type == 1 ? '所属职位' : '关联职位' }}</span>
                <div class="el-form-item__content">{{ item.post.positionName || '-' }}</div>
              </el-col>
            </el-row>
            <el-col :span="22">
              <span class="el-form-item__label">角色</span>
              <div v-if="current.roles && current.roles.length" class="el-form-item__content">
                <span v-for="(item, index) in current.roles" :key="item.id">
                  {{ item.roleName }}
                  <i v-if="(index + 1) < current.roles.length">/</i>
                </span>
              </div>
              <div v-else class="el-form-item__content">-</div>
            </el-col>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script>
import { getUserDetail } from '@/api/userManange.js'
export default {
  name: 'AddUserModal',
  props: {
    row: Object
  },
  data() {
    return {
      loading: false,
      // 折叠面板默认展开
      activeNames: ['1', '2', '3'],
      current: {},
      sex: {
        1: '男',
        2: '女'
      }
    }
  },
  created() {
    this.loading = true
    getUserDetail({ id: this.row.id }).then(res => {
      this.current = res.data
    }).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
.el-collapse {
  border-top: 0;
}
::v-deep .el-collapse-item__wrap {
  border-bottom: 0;
}
.avue-group__header {
  margin-bottom: 0;
}
::v-deep .el-collapse-item__content {
  padding-bottom: 0;
  padding-top: 20px;
}
.el-form {
  margin: 20px 10px 0 10px;
}
.w100 {
  width: 100%;
}
.push-btn {
  margin-right: 80px;
  text-align: right;
}
.m-b-20 {
  margin-bottom: 20px;
}
.el-form-item__label {
  width: 120px;
  display: inline-block;
}
.el-form-item__content {
  margin-left: 120px;
  color: #999;
}
</style>
