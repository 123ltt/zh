<template>
  <basic-container>
    <el-form
      ref="screenForm"
      :model="form"
      size="small"
      label-width="80px"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="租户ID">
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
          <el-form-item
            label="租户名称"
            size="small"
          >
            <el-input
              v-model="form.tenantName"
              placeholder="租户名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            size="small"
            class="m-l-80"
            @click="form.current = 1; loadList()"
          >搜 索</el-button>
          <el-button
            size="small"
            @click="
              form.tenantId = '';
              form.tenantName='';
              form.current = 1;
              loadList()"
          >清 空</el-button>
          <el-button
            v-if="permission.opms_tenant_add"
            type="primary"
            size="small"
            @click="showEdit(null)"
          >添加租户</el-button>
        </el-col>
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
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="租户ID" prop="tenantId" />
      <el-table-column label="租户名称" prop="tenantName" />
      <el-table-column label="租户域名前缀" prop="domainPrefix" />
      <el-table-column label="联系人电话" prop="contactNumber" />
      <el-table-column label="联系人" prop="linkman" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作" width="200">
        <template slot-scope="{ row }">
          <el-button
            v-if="permission.opms_tenant_edit"
            type="text"
            size="small"
            @click="showEdit(row)"
          >编辑</el-button>
          <el-button
            v-if="permission.opms_tenant_delete"
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
import editTenant from './components/editTenant.vue'
import { getTenantPage, tenantRemove, getTenantList } from '@/api/tenantManagement.js'
export default {
  name: 'PermissTenantManageTenanList',
  data() {
    return {
      // 租户列表加载状态
      loading: false,
      form: {
        // pageSize
        size: 10,
        // pageIndex
        current: 1,
        // 租户id
        tenantId: '',
        // 租户名称
        tenantName: ''
      },
      total: 0,
      list: [],
      current: null,
      tenantList: []
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
    getTenantList() {
      getTenantList({ current: 1, size: 9999 }).then((res) => {
        this.tenantList = res.data
      })
    },
    // 获取租户列表
    loadList() {
      this.loading = true
      getTenantPage(this.form)
        .then((res) => {
          const { records, total } = res.data
          this.total = total
          this.list = records
        })
        .finally(() => {
          this.loading = false
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
    // 编辑弹窗
    showEdit(row) {
      this.$modal({
        title: row ? '编辑租户' : '新增租户',
        component: editTenant,
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
      })
        .then(() => {
          this.loading = true
          tenantRemove({
            ids: row.id
          })
            .then((res) => {
              this.loadList()
            })
            .finally(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
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
