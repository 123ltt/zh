<template>
  <basic-container>
    <el-form
      ref="screenForm"
      :model="form"
      size="small"
      label-width="80px"
    >
      <el-row :gutter="10">
        <el-col :span="5">
          <el-form-item
            label="租户ID"
            size="small"
            prop="tenantId"
          >
            <!-- <el-input v-model="form.tenantName" placeholder="租户名称" clearable /> -->
            <el-select
              v-model="form.tenantId"
              filterable
              clearable
              class="w300"
              placeholder="租户ID"
              popper-class="select-style"
              @clear="loadList"
            >
              <el-option
                v-for="item in tenantList"
                :key="item.tenantId"
                :label="item.tenantId"
                :value="item.tenantId"
                :title="item.tenantId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="应用名称"
            size="small"
            prop="appName"
          >
            <el-input
              v-model="form.appName"
              placeholder="应用名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="form.current = 1; loadList()"
            >搜 索</el-button>
            <el-button
              size="small"
              @click="
                $refs['screenForm'].resetFields();
                form.current = 1;
                loadList()"
            >清 空</el-button>
            <el-button
              v-if="permission.opms_tenant_app_add"
              type="primary"
              size="small"
              @click="showAuth(null)"
            >租户授权</el-button>
          </el-form-item>
        </el-col>
        <el-col
          v-if="permission.tenant_app_log"
          :span="2"
        >
          <el-button
            type="primary"
            size="small"
            @click="showLog"
          >日志</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      height="calc(100vh - 274px)"
      border
      stripe
      size="small"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        label="租户ID"
        prop="tenantId"
      />
      <el-table-column
        label="应用名称"
        prop="appName"
      />
      <el-table-column
        label="失效时间"
        prop="expireTime"
      />
      <el-table-column
        label="添加时间"
        prop="createTime"
      />
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="permission.opms_tenant_app_edit"
            type="text"
            size="small"
            @click="showAuth(row)"
          >编辑</el-button>
          <el-button
            v-if="permission.opms_tenant_app_delete"
            type="text"
            size="small"
            @click="deleteRow(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="form.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="form.size"
      :total="total"
      style="text-align: right; padding-top: 18px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import editTenantAuth from './components/editTenantAuth.vue'
import logTenantAuthorize from '../components/logTenantAuthorize.vue'
import { getTenantAppList, removeTenantApp, getTenantList } from '@/api/tenantManagement.js'
export default {
  name: 'PermissTenantManageTenantAuthorize',
  data() {
    return {
      // 租户列表
      tenantList: [],
      form: {
        // 租户名称
        tenantName: '',
        // 应用名称
        appName: '',
        // 当前页
        current: 1,
        // pageSize
        size: 10
      },
      loading: false,
      total: 0,
      list: [],
      current: null
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.loadList()
    this.getTenantList()
  },
  methods: {
    // 获取租户授权管理列表
    loadList() {
      this.loading = true
      getTenantAppList(this.form)
        .then((res) => {
          const { records, total } = res.data
          this.total = total
          this.list = records
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取租户列表
    getTenantList() {
      getTenantList({ current: 1, size: 9999 }).then((res) => {
        this.tenantList = res.data
      })
    },
    // 分页相关
    handleSizeChange(val) {
      this.form.size = val
      this.loadList()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.loadList()
    },
    // 编辑
    showAuth(row) {
      this.$modal({
        title: row ? '编辑授权' : '新增授权',
        component: editTenantAuth,
        width: '500px',
        data: {
          current: row
        },
        callback: (refresh) => {
          refresh && this.loadList()
        }
      })
    },
    // 删除
    deleteRow(row) {
      // console.log('删除', row)
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        removeTenantApp({ ids: row.id }).then((res) => {
          this.loadList()
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 查看日志
    showLog() {
      this.$modal({
        title: '日志列表',
        component: logTenantAuthorize,
        width: '1000px',
        data: {
          tenantList: this.tenantList
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "../index.scss";
</style>
