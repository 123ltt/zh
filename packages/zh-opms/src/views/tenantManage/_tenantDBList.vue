<template>
  <basic-container>
    <el-form
      ref="screenForm"
      :model="form"
      size="small"
      label-width="110px"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="租户ID" prop="tenantId">
            <!-- <el-input v-model="form.tenantId" placeholder="租户ID" clearable /> -->
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
        <el-col :span="6">
          <el-form-item label="数据库集群地址" prop="dbDomain" size="small">
            <el-input v-model="form.dbDomain" placeholder="数据库集群地址" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="应用名称" prop="appId">
            <el-select
              v-model="form.appId"
              filterable
              clearable
              placeholder="应用名称"
            >
              <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.appName"
                :value="item.id"
                :title="item.appName"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="DB状态" prop="dbStatus" size="small">
            <!-- <el-input v-model="form.dbStatus" placeholder="DB状态" clearable /> -->
            <el-select
              v-model="form.dbStatus"
              clearable
              placeholder="DB状态"
              @clear="loadList"
            >
              <el-option
                v-for="(k, v) in constants"
                :key="v"
                :label="k"
                :value="v"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="同步状态" prop="syncStatus" size="small">
            <!-- <el-input v-model="form.dbStatus" placeholder="DB状态" clearable /> -->
            <el-select
              v-model="form.syncStatus"
              clearable
              placeholder="同步状态"
              @clear="loadList"
            >
              <el-option
                v-for="(k, v) in tenantDbSyncStatus"
                :key="v"
                :label="k"
                :value="v"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" size="small" class="m-l-80" @click="form.current = 1; loadList()">搜 索</el-button>
          <el-button size="small" @click=" $refs['screenForm'].resetFields();form = { current: 1 };loadList()">清 空</el-button>
          <!-- <el-button
            v-if="permission.opms_tenant_db_add"
            type="primary"
            size="small"
            @click="showEdit(null)"
          >新增DB配置</el-button> -->
        </el-col>
        <div class="text-end mb-3">
          <el-button v-if="permission.opms_tenant_db_init_batch" :disabled="ids.length === 0" type="primary" size="small" @click="batchInit">批量初始化</el-button>
          <el-button v-if="permission.opms_tenant_db_sync_batch" :disabled="ids.length === 0" type="primary" size="small" @click="batchSync">批量同步</el-button>
          <el-button v-if="permission.db_schema_update" type="primary" size="small" @click="DBDynamic">租户DB动态</el-button>
        </div>
      </el-row>

    </el-form>
    <el-table
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      border
      stripe
      height="calc(100vh - 274px)"
      size="small"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="租户ID" prop="tenantId" />
      <el-table-column label="数据库集群地址" prop="dbDomain" width="110" />
      <el-table-column :show-overflow-tooltip="true" label="数据库名称" prop="dbSchema" width="110" />
      <el-table-column label="数据库用户名" prop="username" width="110" />
      <el-table-column label="应用名称" prop="appName" width="110" />
      <el-table-column label="DB状态" prop="dbStatus" width="110">
        <template slot-scope="{ row }">
          <el-tag v-if="row.dbStatus === '初始化完成'" type="success">初始化完成</el-tag>
          <el-tag v-else-if="row.dbStatus === '初始化中'">初始化中</el-tag>
          <el-tag v-else type="info">待初始化</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数据同步状态" prop="syncStatus" width="110">
        <template slot-scope="{ row }">
          <el-tag v-if="row.syncStatus === '同步完成'" type="success">同步完成</el-tag>
          <el-tag v-else-if="row.syncStatus === '同步中'">同步中</el-tag>
          <el-tag v-else type="info">等待同步</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="变更状态" prop="changeStatus" width="110">
        <template v-slot="{row}">
          <span v-if="row.changeStatus === '变更成功'" style="color:#13CE66">变更成功</span>
          <span v-else-if="row.changeStatus === '变更中'" style="color:#1890FF">变更中</span>
          <span v-else-if="row.changeStatus === '变更失败'" style="color:#FF4848">变更失败</span>
          <span v-else style="color:#FAAD14">未变更</span>
          <!-- <el-tag v-if="row.changeStatus === '变更成功'" type="success">变更成功</el-tag>
          <el-tag v-else-if="row.changeStatus === '变更中'">变更中</el-tag>
          <el-tag v-else-if="row.changeStatus === '变更失败'" type="info">变更失败</el-tag>
          <el-tag v-else type="info">未变更</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="备注" prop="remark" />
      <el-table-column label="操作" width="270">
        <template slot-scope="{ row }">
          <el-button v-if="permission.opms_tenant_db_view" type="text" size="small" @click="seeDetail(row)">查看</el-button>
          <el-button v-if="permission.opms_tenant_db_edit" :disabled="row.dbStatus !== '待初始化'" type="text" size="small" @click="showEdit(row)">编辑</el-button>
          <el-button v-if="permission.opms_tenant_db_init" type="text" size="small" @click="initRow(row)">初始化</el-button>
          <el-button v-if="permission.opms_tenant_db_sync" :disabled="row.dbStatus !== '初始化完成'" type="text" size="small" @click="syncRow(row)">同步</el-button>
          <el-button v-if="permission.tenant_db_ops_update" :disabled="row.dbStatus !== '待初始化'" type="text" size="small" @click="opsUpdateRow(row)">运维配置</el-button>
          <el-button v-if="permission.opms_tenant_db_log" type="text" size="small" @click="showLog(row)">日志</el-button>
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
import editTenantDB from './components/editTenantDB.vue'
import editTenantDBops from './components/editTenantDBops.vue'
import viewTenantDB from './components/viewTenantDB.vue'
import Log from '../components/logTenantDB.vue'
import dynamicDB from './components/dynamicDB.vue'
import { getTenantDBList, getTenantList, getAppList, initTenantDB, syncTenantDB, initBatch, syncBatch } from '@/api/tenantManagement.js'
import { getConstants } from '@/api/constants.js'
export default {
  name: 'PermissTenantManageTenantDBList',
  data() {
    return {
      // 列表加载状态
      loading: false,
      form: {
        // pageSize
        size: 10,
        // pageIndex
        current: 1,
        // 租户id
        tenantId: '',
        // 数据库集群地址
        dbDomain: '',
        // DB状态
        dbStatus: ''
      },
      ids: [],
      total: 0,
      list: [],
      current: null,
      tenantList: [],
      appList: [],
      // 筛选db状态
      constants: {},
      // 筛选同步状态
      tenantDbSyncStatus: {}
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.loadList()
    this.getAppList()
    this.getTenantList()
    this.getConstants()
  },
  methods: {
    // 多选操作
    selectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    batchInit() {
      this.confirm('批量初始化', initBatch, this.ids)
    },
    batchSync() {
      this.confirm('批量同步', syncBatch, this.ids)
    },
    // 获取常量列表
    getConstants() {
      getConstants().then(res => {
        const { constants } = res.data
        this.constants = constants.tenantDbStatus
        this.tenantDbSyncStatus = constants.tenantDbSyncStatus
      })
    },
    // 获取租户列表
    loadList() {
      this.loading = true
      getTenantDBList(this.form)
        .then((res) => {
          const { records, total } = res.data
          this.total = total
          this.list = records
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取租户搜索列表
    async getTenantList() {
      this.tenantList = await getTenantList({ size: 9999, current: 1 }).then(res => res.data)
    },
    // 获取应用列表
    async getAppList() {
      this.appList = await getAppList({ current: 1, size: 9999 }).then(res => res.data)
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
    // 查看详情
    seeDetail(row) {
      this.$modal({
        title: '查看DB配置',
        component: viewTenantDB,
        width: '500px',
        data: {
          current: row
        }
      })
    },
    // 编辑弹窗
    showEdit(row) {
      this.$modal({
        title: row ? '编辑租户DB配置' : '新增租户DB配置',
        component: editTenantDB,
        width: '500px',
        data: {
          current: row,
          tenantList: this.tenantList,
          appList: this.appList
        },
        callback: (refresh) => {
          refresh && this.loadList()
        }
      })
    },
    // 初始化
    initRow(row) {
      this.confirm('初始化', initTenantDB, { id: row.id })
    },
    // 同步事件
    syncRow(row) {
      this.confirm('同步', syncTenantDB, { id: row.id })
    },
    confirm(text, api, params) {
      this.$confirm(`确认${text}?`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        api(params).then((res) => {
          this.$message.success('操作成功')
          this.loadList()
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 运维配置
    opsUpdateRow(row) {
      this.$modal({
        title: '运维配置',
        component: editTenantDBops,
        width: '500px',
        data: {
          current: row
        },
        callback: (refresh) => {
          refresh && this.loadList()
        }
      })
    },
    // 查看日志
    showLog(row) {
      this.$modal({
        title: '日志列表',
        component: Log,
        width: '1000px',
        data: {
          optBusId: row.id
        }
      })
    },
    DBDynamic() {
      this.$modal({
        title: '租户DB动态变更',
        component: dynamicDB,
        width: '500px',
        data: {
          tenantList: this.tenantList,
          appList: this.appList
        },
        callback: flag => {
          flag && this.loadList()
        }
      })
    }
  }
}
</script>

<style scoped>
.logo {
  max-width: 120px;
  max-height: 50px;
}
.m-l-80 {
  margin-left: 50px;
}
</style>
