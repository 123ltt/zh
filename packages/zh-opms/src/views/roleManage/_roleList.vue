<template>
  <basic-container>
    <div class="myTable">
      <el-form
        ref="form"
        :model="form"
        size="mini"
        label-width="70px"
      >
        <el-row :gutter="10">
          <el-col v-if="isAdmin" :span="5">
            <el-form-item label="租户ID" size="small" prop="tenantId">
              <el-select v-model="form.tenantId" filterable clearable style="width:100%;" popper-class="select-style">
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
              label="状态"
              prop="status"
            >
              <el-select
                v-model="form.status"
                clearable
                style="width:100%;"
                size="small"
              >
                <el-option
                  label="启用"
                  value="1"
                />
                <el-option
                  label="禁用"
                  value="0"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="onSearch('form')"
              >搜 索</el-button>
              <el-button
                size="small"
                @click="resetForm('form')"
              >清 空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
        border
        stripe
        height="calc(100vh - 265px)"
        size="small"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          v-if="isAdmin"
          prop="tenantId"
          width="150px"
          label="租户ID"
        />
        <el-table-column
          prop="roleName"
          label="角色名称"
        />
        <el-table-column
          prop="roleAlias"
          label="角色别名"
        />
        <el-table-column
          prop="status"
          label="角色状态"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status">启用</div>
            <div v-else>禁用</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="menuCount"
          label="权限项数量"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="showAuthDetails(row)"
            >{{ row.menuCount }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="340"
        >
          <template slot-scope="scope">
            <el-button
              v-if="permission.opms_admin_role_log"
              type="text"
              size="small"
              @click="showLog(scope.row)"
            >日 志</el-button>
            <el-button
              v-if="permission.opms_admin_role_grant"
              type="text"
              size="small"
              style="margin-right: 20px"
              @click="roleAuth(scope.row)"
            >角色授权</el-button>
            <el-switch
              v-if="permission.opms_admin_role_enable"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              style="margin-right: 10px"
              @change="onChangeStaus(scope.row)"
            />
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
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleList, updateRole } from '@/api/role'
import { debounce } from '@/util/util'
import Log from '../components/logRole.vue'
import { getTenantList } from '@/api/tenantManagement.js'
import authDetails from './components/authDetails'
import roleAuthority from './roleAuthority'

export default {
  name: 'PlatformRoleManageRoleList',
  data() {
    const validateName = (rule, value, callback) => {
      if (value) {
        if (/^[a-z]([-_a-z0-9]{0,})$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入角色名称为小写字母'))
        }
      } else {
        callback(new Error('请输入角色名称'))
      }
    }
    return {
      form: {
        current: 1,
        size: 10
      },
      dialogForm: {
        status: '1'
      },
      total: 0,
      tableData: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      rules: {
        tenantId: [{ required: true, message: '请选择所属租户', trigger: 'change' }],
        roleName: [{ required: true, validator: validateName }],
        roleAlias: [{ required: true, message: '请输入角色别名', trigger: 'blur' }],
        status: [{ required: true, message: '请选择角色状态', trigger: 'change' }]
      },
      tenantList: [],
      // 用于提交时判断是否修改
      oldDialogForm: null
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission']),
    // 是否超级管理员
    isAdmin() {
      // return this.userInfo.role_name.includes('administrator')
      return true
    },
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldDialogForm) === JSON.stringify(this.dialogForm))
    }
  },
  created() {
    this.getPageData()
  },
  methods: {
    // 获取租户列表
    loadList() {
      getTenantList({ current: 1, size: 9999 }).then((res) => {
        const records = res.data
        this.tenantList = records
      })
    },
    // 分页相关
    handleSizeChange(val) {
      this.form.size = val
      this.getPageData()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.getPageData()
    },
    onSearch() {
      this.form.current = 1
      this.getPageData()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.form.current = 1
      this.getPageData()
    },
    getPageData() {
      this.loading = true
      getRoleList(this.form).then(res => {
        const { records, total } = res.data
        this.tableData = records
        this.total = total
      }).finally(() => {
        this.loading = false
      })
    },
    onChangeStaus: debounce(function(row) {
      updateRole(row).then((res) => {
        this.$message.success('修改成功')
      }).finally(() => {
        this.getPageData()
      })
    }, 500),
    // 查看日志
    showLog(row) {
      this.$modal({
        title: '日志列表',
        component: Log,
        width: '1000px',
        data: {
          tenantList: this.tenantList,
          tenantId: this.userInfo.tenant_id,
          optBus: row.roleName,
          optBusId: row.id
        }
      })
    },
    roleAuth(row) {
      this.$newTab({
        path: '/roleManage/roleAuthority',
        title: '角色授权',
        component: roleAuthority,
        data: {
          roleInfo: row,
          menuId: this.$route.meta.id
        },
        callback: refresh => {
          console.log(refresh)
        },
        clearCache: true
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogForm = {
        status: '1'
      } // 清空模态框数据
      this.$refs.dialogForm.resetFields() // 清空校验
    },
    showAuthDetails(row) {
      this.$modal({
        title: '权限明细',
        component: authDetails,
        width: '800px',
        data: {
          current: row
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.loadList()
    })
  }
}
</script>

<style lang="scss">
@import "../index.scss";
</style>
