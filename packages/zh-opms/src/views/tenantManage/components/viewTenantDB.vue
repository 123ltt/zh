<template>
  <el-form v-loading="loading">
    <div class="el-form-box">
      <div class="el-form-item">
        <span class="el-form-item__label">租户ID </span>
        <div class="el-form-item__content">{{ current.tenantId || '-' }}</div>
      </div>
      <div class="el-form-item">
        <span class="el-form-item__label">数据库集群地址 </span>
        <div class="el-form-item__content">{{ current.dbDomain || '-' }}</div>
      </div>
      <div class="el-form-item">
        <span class="el-form-item__label">数据库名称 </span>
        <div class="el-form-item__content">{{ current.dbSchema || '-' }}</div>
      </div>
      <div class="el-form-item">
        <span class="el-form-item__label">数据库用户名 </span>
        <div class="el-form-item__content">{{ current.username || '-' }}</div>
      </div>
      <div class="el-form-item">
        <span class="el-form-item__label">应用名称 </span>
        <div class="el-form-item__content">{{ current.appName || '-' }}</div>
      </div>
      <div class="el-form-item">
        <span class="el-form-item__label">初始化状态 </span>
        <div class="el-form-item__content">{{ current.dbStatus || '-' }}</div>
      </div>
      <div class="el-form-item">
        <span class="el-form-item__label">数据同步状态 </span>
        <div class="el-form-item__content">{{ current.syncStatus || '-' }}</div>
      </div>
      <div class="el-form-item">
        <span class="el-form-item__label">备注 </span>
        <div class="el-form-item__content">{{ current.remark || '-' }}</div>
      </div>
    </div>
  </el-form>
</template>

<script>
import { detailTenantDB } from '@/api/tenantManagement.js'
export default {
  name: 'EditTenant',
  props: {
    current: {
      type: Object,
      default: null
    },
    tenantList: {
      type: Array,
      default: () => ([])
    },
    appList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      loading: false,
      // 租户DB配置信息
      form: {}
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 获取租户DB配置详情
    getDetail() {
      this.loading = true
      detailTenantDB({
        id: this.current.id
      }).then(res => {
        this.form = res.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-box {
  padding: 10px 20px;
}
.el-form-item{
  margin-bottom: 10px;
}
.el-form-item__label{
  width: 160px;
}
.el-form-item__content{
  color: #999;
}
</style>
