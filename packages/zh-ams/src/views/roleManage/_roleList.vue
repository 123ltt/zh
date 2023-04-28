<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-size="20" @select-all="checkedAllClick" @select="checkedAllClick">
      <template slot="header">
        <el-form
          ref="form"
          :model="form"
          size="mini"
          label-width="70px"
          class="no-message"
        >
          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item
                label="角色名称"
                prop="roleName"
              >
                <el-input
                  v-model="form.roleName"
                  placeholder="角色名称"
                  clearable
                />
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
                  size="mini"
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
            <!-- <el-col v-if="isAdmin" :span="5">
            <el-form-item label="租户" size="small" prop="tenantId">
              <el-select v-model="form.tenantId" clearable style="width:100%;">
                <el-option
                  v-for="item in tenantList"
                  :key="item.tenantId"
                  :label="item.tenantName"
                  :value="item.tenantId"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
            <el-col :span="9">
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="onSearch('form')"
                >搜 索</el-button>
                <el-button
                  size="mini"
                  @click="resetForm('form')"
                >清 空</el-button>
                <el-button
                  v-if="permission.role_add"
                  type="primary"
                  size="mini"
                  @click="dialogVisible = true,dialogTitle = '添 加'"
                >添 加
                </el-button>
                <el-dropdown v-if="permission.role_export" split-button size="mini" class="ebay-car-dropdown">导出
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleExport(true, 'ROLE')">导出全部角色信息</el-dropdown-item>
                    <el-dropdown-item :disabled="!checked.length" @click.native="handleExport(false, 'ROLE')">导出所选角色信息</el-dropdown-item>
                    <el-dropdown-item @click.native="handleExport(true, 'ROLE_GRANT')">导出全部角色权限</el-dropdown-item>
                    <el-dropdown-item :disabled="!checked.length" @click.native="handleExport(false, 'ROLE_GRANT')">导出所选角色权限</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" size="mini" @click="roleAuth({})">批量授权</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="userGroup" label="角色分组">
        <template slot-scope="scope">
          {{ userLabel(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column slot="autoSelect" label="自动分配条件" width="180">
        <template slot-scope="scope">
          <g-text-ellipsis>
            {{ autoLabel(scope.row) }}
          </g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="remark" label="角色职责">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column slot="index" type="selection" width="50px" />
      <el-table-column slot="userCount" label="成员数量">
        <template slot-scope="{ row }">
          <el-button type="text" @click="showMemberDetails(row)">{{ row.userCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="menuCount" label="权限项数量">
        <template slot-scope="{ row }">
          <el-button type="text" @click="showAuthDetails(row)">{{ row.menuCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="status" label="角色状态">
        <template slot-scope="{ row }">
          <div v-if="row.status">启用</div>
          <div v-else>禁用</div>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="300">
        <template v-slot="{row}">
          <el-switch
            v-if="permission.role_enable"
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            style="margin-right: 10px"
            @change="onChangeStaus(row)"
          />
          <el-button
            v-if="permission.role_log"
            type="text"
            size="small"
            @click="showLog(row)"
          >日 志</el-button>
          <el-button
            v-if="permission.role_edit"
            type="text"
            size="small"
            @click="editRow(row)"
          >编 辑</el-button>
          <el-button
            v-if="permission.role_delete"
            type="text"
            size="small"
            @click="deleteRow(row)"
          >删 除</el-button>
          <el-button
            v-if="permission.role_authorize"
            type="text"
            size="small"
            @click="roleAuth(row)"
          >角色授权</el-button>
        </template>
      </el-table-column>
    </g-table>
    <!--模态框(新增/编辑)-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      top="100px"
      custom-class="my-dialog my-dialog-small"
      @close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="rules"
        label-width="110px"
        size="mini"
      >
        <!-- <el-row v-if="isAdmin" :gutter="20">
            <el-col :span="23">
              <el-form-item label="所属租户" size="small" prop="tenantId">
                <el-select v-model="dialogForm.tenantId" :disabled="dialogTitle === '编 辑'" clearable style="width:100%;">
                  <el-option
                    v-for="item in tenantList"
                    :key="item.tenantId"
                    :label="item.tenantName"
                    :value="item.tenantId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item
              label="角色名称"
              prop="roleName"
            >
              <el-input
                v-model="dialogForm.roleName"
                maxlength="50"
                show-word-limit
                placeholder="如：admin"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item
              label="角色别名"
              prop="roleAlias"
            >
              <el-input
                v-model="dialogForm.roleAlias"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item
              label="角色状态"
              prop="status"
            >
              <el-radio-group v-model="dialogForm.status">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form-item
                label="角色分组"
                prop="rolePostCategory"
              >
                <el-select v-model="dialogForm.rolePostCategory" filterable class="w-100">
                  <el-option v-for="list in roleGroupList" :key="list.dictKey" :value="list.dictKey" :label="list.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="自动分配">
                <el-col :span="24">
                  <el-select ref="select" v-model="dialogForm.postIdList" collapse-tags multiple class="w-100" clearable filterable placeholder="请选择岗位" @change="change(dialogForm.postIdList,'postList','postIdList')">
                    <el-option :key="0" value="0" label="全部" />
                    <el-option v-for="list in postList" :key="list.id" :disabled="list.disabled" :value="''+list.id" :label="list.postName" />
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <el-select v-model="dialogForm.platformIdList" collapse-tags clearable filterable multiple class="w-100" placeholder="请选择平台">
                    <el-option v-for="list in platList" :key="list.hiddenValue" :value="''+list.hiddenValue" :label="list.displayName" />
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <el-select v-model="dialogForm.positionIdList" collapse-tags clearable filterable multiple class="w-100" placeholder="请选择职位" @change="change(dialogForm.positionIdList,'positionList','positionIdList')">
                    <el-option :key="0" value="0" label="全部" />
                    <el-option v-for="list in positionList" :key="list.id" :disabled="list.disabled" :value="''+list.id" :label="list.positionName" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form-item
                label="角色职责"
              >
                <el-input v-model="dialogForm.remark" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="padding-bottom: 20px;text-align: right">
            <el-button
              size="small"
              @click="dialogVisible = false"
            >取消</el-button>
            <el-button
              :disabled="dialogTitle == '编 辑' ? submitBtnEnable : false"
              size="small"
              type="primary"
              @click="submitDialog('dialogForm')"
            >保存
            </el-button>
          </div>
        </el-row></el-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleList, addRole, updateRole, deleteRole, postGetAll, positionGetAll, platformOption, roleExport } from '@/api/role'
import { getDictParentList, getDictChildList } from '@/api/dict'
import { debounce, deepClone, dowloadExc } from '@/util/util'
import Log from '../components/logRole.vue'
import memberDetails from './components/memberDetails'
import authDetails from './components/authDetails'
import roleAuthority from './roleAuthority'

export default {
  name: 'PermissRoleManageRoleList',
  // eslint-disable-next-line vue/no-unused-components
  components: { memberDetails, authDetails, roleAuthority },
  data() {
    const validateName = (rule, value, callback) => {
      if (value) {
        if (/^[a-z]([-_a-z0-9]{0,})$/.test(value)) {
          callback()
        } else {
          callback(new Error('角色名称为以小写字母开头，字母、数字或下划线组成'))
        }
      } else {
        callback(new Error('请输入角色名称'))
      }
    }
    return {
      headers: [
        { slot: true, slotName: 'index' },
        { label: '角色名称', prop: 'roleName' },
        { label: '角色别名', prop: 'roleAlias' },
        { slot: true, slotName: 'userGroup' },
        { slot: true, slotName: 'autoSelect' },
        { slot: true, slotName: 'remark' },
        { slot: true, slotName: 'userCount' },
        { slot: true, slotName: 'menuCount' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'handler' }
      ],
      form: {},
      dialogForm: {
        status: '1',
        rolePostCategory: '',
        positionIdList: [],
        platformIdList: [],
        postIdList: [],
        remark: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      rules: {
        tenantId: [{ required: true, message: '请选择所属租户', trigger: 'change' }],
        roleName: [{ required: true, validator: validateName }],
        roleAlias: [{ required: true, message: '请输入角色别名', trigger: 'blur' }],
        status: [{ required: true, message: '请选择角色状态', trigger: 'change' }],
        rolePostCategory: [{ required: true, message: '请选择角色分组', trigger: 'change' }]
      },
      roleGroupList: [],
      // 用于提交时判断是否修改
      oldDialogForm: null,
      postList: [],
      positionList: [],
      platList: [],
      disabled: false,
      tableData: [],
      exampleList: [],
      checked: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission']),
    // 是否超级管理员
    isAdmin() {
      return this.userInfo.role_name.includes('administrator')
    },
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldDialogForm) === JSON.stringify(this.dialogForm))
    }
  },
  created() {
    this.getDictParentList()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getPostAll()
  },
  methods: {
    getDictParentList() {
      getDictParentList({ code: 'post_category', tenantId: this.userInfo.tenant_id, appCode: 'ams' }).then(res => {
        const data = res.data.records
        const { id } = data[0]
        this.getDictChildList(id)
      })
    },
    getDictChildList(id) {
      getDictChildList({ parentId: id }).then(res => {
        this.roleGroupList = res.data
      })
    },
    checkedAllClick(checkedList) {
      this.checked = checkedList.map(item => item.id)
    },
    change(val, list, data) {
      if (val.includes(0) || val.includes('0')) {
        this.dialogForm[data] = ['0']
        this[list].forEach(item => {
          this.$set(item, 'disabled', true)
        })
        return false
      }
      this[list].forEach(item => {
        this.$set(item, 'disabled', false)
      })
    },
    autoLabel(row) {
      const postType = (row.postIdList?.length && row.postIdList) || []// 岗位
      const platformType = (row.platformIdList?.length && row.platformIdList) || [] // 平台
      const positionType = (row.positionIdList?.length && row.positionIdList) || []// 职位
      let template = ''
      const postName = '岗位 : '
      const platformName = '平台 : '
      const positionName = '职位 : '
      const arr = [
        {
          type: postType, list: this.postList, key: 'postName', name: postName// 岗位
        },
        {
          type: platformType, list: this.platList, key: 'displayName', name: platformName// 平台
        },
        {
          type: positionType, list: this.positionList, key: 'positionName', name: positionName// 职位
        }
      ]
      arr.forEach(item => {
        if (item.type.length && item.type[0] !== 0) {
          let text = ''
          item.type.forEach(res => {
            item.list.forEach(p => {
              if (item.key === 'displayName') {
                if (+p.hiddenValue === +res) {
                  text += p[item.key] + ' '
                }
              } else {
                if (+p.id === +res) {
                  text += p[item.key] + ' '
                }
              }
            })
          })
          template += item.name + text
        } else {
          template += item.type[0] === 0 ? item.name + '全部 ' : ''
        }
      })
      return template
    },
    userLabel(row) {
      if (row.rolePostCategory) {
        let label = ''
        this.roleGroupList.forEach(item => {
          if (item.dictKey === String(row.rolePostCategory)) {
            label = item.dictValue
          }
        })
        return label
      }
    },
    getPostAll() {
      Promise.all([postGetAll(), platformOption(), positionGetAll()]).then(res => {
        this.postList = res[0].data.map(item => {
          item.disabled = false
          return item
        })
        this.platList = res[1].data
        this.positionList = res[2].data.map(item => {
          item.disabled = false
          return item
        })
      })
    },
    fetch({ current, size }, params) {
      return getRoleList({ current, size, ...params }).then(res => {
        this.tableData = res.data.records
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    // 获取租户列表
    // loadList() {
    //   getTenantList().then((res) => {
    //     const { records } = res.data
    //     this.tenantList = records
    //   })
    // },
    onSearch() {
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.onSearch()
    },
    onChangeStaus: debounce(function(row) {
      updateRole(row).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
      }).finally(() => {
        this.onSearch()
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
    editRow(row) {
      this.dialogTitle = '编 辑'
      this.dialogVisible = true
      this.dialogForm = deepClone(row)
      this.dialogForm.platformIdList = this.dialogForm.platformIdList.length ? String(this.dialogForm.platformIdList).split(',') : []
      this.dialogForm.positionIdList = this.dialogForm.positionIdList.length ? String(this.dialogForm.positionIdList).split(',') : []
      this.dialogForm.postIdList = this.dialogForm.postIdList.length ? String(this.dialogForm.postIdList).split(',') : []
      this.dialogForm.rolePostCategory = this.dialogForm.rolePostCategory === -1 ? '' : String(this.dialogForm.rolePostCategory)
      const { positionIdList, postIdList } = this.dialogForm
      // 如果选的全部那么要禁用列表
      const arr = [
        { list: positionIdList, forList: this.positionList },
        { list: postIdList, forList: this.postList }
      ]
      arr.forEach(item => {
        // 初始化
        item.forList.forEach(item => {
          item.disabled = false
        })
        if (String(item.list[0]) === '0') {
          item.forList.forEach(item => {
            item.disabled = true
          })
        }
      })
      this.dialogForm.status = `${this.dialogForm.status}`
      this.oldDialogForm = deepClone(this.dialogForm)
    },
    deleteAPI(id) {
      deleteRole(id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.onSearch()
      })
    },
    deleteRow(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAPI(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
          refresh && this.$refs.table.load(1, this.form)
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
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogTitle === '添 加' ? this.addApi(this.dialogForm) : this.updateApi(this.dialogForm)
        } else {
          return false
        }
      })
    },
    addApi(param) {
      addRole(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.dialogVisible = false
          this.onSearch()
        }
      })
    },
    updateApi(param) {
      updateRole(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.dialogVisible = false
          this.onSearch()
        }
      })
    },
    showMemberDetails(row) {
      this.$modal({
        title: '拥有人数明细',
        component: memberDetails,
        width: '800px',
        data: {
          current: row
        }
      })
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
    },
    handleExport(isAll, exportType) {
      const name = exportType === 'ROLE' ? '角色信息.xlsx' : '角色授权信息.xlsx'
      const roleIds = isAll ? '' : this.checked.join()
      roleExport({ roleIds, exportType }).then(res => {
        dowloadExc(res, name)
      })
    }
  }
}
</script>

<style lang="scss">
@import "../index.scss";
.ebay-car-dropdown {
   margin: 0 10px;
  .el-dropdown__caret-button{
    height: 28px;
  }
}
</style>
