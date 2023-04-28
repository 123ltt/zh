<template>
  <el-row>
    <el-col :span="5">
      <basic-container style="min-width: 0">
        <el-input v-model="filterText" size="mini" class="filterText" placeholder="输入关键字进行过滤" />
        <div :style="{'height': 'calc(100vh - 170px)', 'overflow': 'scroll'}">
          <el-tree
            ref="tree-org"
            :data="treeData"
            :props="{ children: 'children', label: 'title' }"
            :current-node-key="form.organizationId"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            check-on-click-node
            node-key="id"
            highlight-current
            @node-click="nodeClick"
          />
        </div>
      </basic-container>
    </el-col>
    <el-col :span="19">
      <basic-container>
        <el-form ref="screenForm" :model="form" size="mini" label-width="60px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="用户名" prop="fuzzyName">
                <el-input v-model="form.fuzzyName" placeholder="姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="工号" prop="fuzzyJobNumber">
                <el-input v-model="form.fuzzyJobNumber" placeholder="工号" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="岗位" prop="postId">
                <el-select v-model="form.postId" filterable clearable placeholder="岗位">
                  <el-option v-for="item in postList" :key="item.id" :label="item.postName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="tc">
              <el-button type="primary" size="mini" @click=" form.current = 1; loadList(); ">搜 索</el-button>
              <el-button size="mini" @click=" $refs['screenForm'].resetFields(); form.current = 1; loadList(); ">清 空</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="el-col-btn">
              <el-button v-if="permission.user_add" type="primary" size="mini" @click="addUser(null)">添加用户</el-button>
              <el-button v-if="permission.resetPassword" size="mini" @click="resetPassword">密码重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          v-loading="loading"
          :data="userList"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :height="'calc(100vh - 270px)'"
          :row-class-name="rowClassName"
          style="width: 100%"
          size="mini"
          row-key="id"
          border
          stripe
          class="g-table"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="工号" fixed prop="jobNumber" width="120" />
          <el-table-column label="登录账户" prop="account" width="120" />
          <!-- <el-table-column label="所属租户" prop="tenantName" width="120" /> -->
          <el-table-column label="公司" prop="company" :show-overflow-tooltip="true" min-width="200">
            <template slot-scope="{ row }">
              <span v-for="(item, index) in row.userDuties" :key="item.id">{{ item.company && item.company.orgName }}<span v-if="(index + 1) < row.userDuties.length">，</span></span>
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="department" :show-overflow-tooltip="true" min-width="120">
            <template slot-scope="{ row }">
              <span
                v-for="(item, index) in row.userDuties"
                :key="item.id"
              >{{ item.department && item.department.orgName }}<span v-if="(index + 1) < row.userDuties.length">，</span></span>
            </template>
          </el-table-column>
          <el-table-column label="用户姓名" prop="name" min-width="120" />
          <el-table-column :show-overflow-tooltip="true" label="岗位" prop="post" min-width="120">
            <template slot-scope="{ row }">
              <span
                v-for="(item, index) in row.userDuties"
                :key="item.id"
              >{{ item.post && item.post.postName }}<span v-if="(index + 1) < row.userDuties.length">，</span></span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="职位" prop="positionName" min-width="120">
            <template slot-scope="{ row }">
              <span v-for="(item, index) in row.userDuties" :key="item.id">{{ item.post && item.post.positionName }}<span v-if="(index + 1) < row.userDuties.length">，</span></span>
            </template>
          </el-table-column>
          <el-table-column label="角色" prop="role" min-width="200">
            <template slot-scope="{ row }">
              <span v-for="(item, index) in row.roles" :key="index">
                <el-tag class="tag">{{ `${item.roleName}（${item.roleAlias}）` }}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="用户状态" prop="status" min-width="100">
            <template slot-scope="{ row }">
              <el-tag :type="row.status == 1 ? 'success' : 'info'">{{ statusKey[row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否锁定" prop="status" min-width="100">
            <template slot-scope="{ row }">
              <el-tag :type="row.locked ? 'success' : 'info'">{{ row.locked ? "是" : "否" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="290">
            <template slot-scope="{ row }">
              <el-button v-if="permission.user_log" type="text" @click="showLog(row)">日志</el-button>
              <el-button v-if="permission.user_view" type="text" @click="seeDetail(row)">查看</el-button>
              <el-button v-if="permission.user_edit" type="text" @click="addUser(row)">编辑</el-button>
              <el-button v-if="permission.user_edit" :disabled="!row.locked" type="text" @click="unlock(row)">解锁</el-button>
              <el-button v-if="permission.user_role_edit" type="text" @click="editRole(row)">修改角色</el-button>
              <el-switch v-if="permission.user_enable" :value="row.status == 1" class="status-btn" @change="changeSatus(row)" />
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
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/util/util'
import addModal from './components/addModal.vue'
import userModalView from './components/userModalView.vue'
import updateRole from './components/updateRole.vue'
import Log from '../components/logUser.vue'
import { getTenantList } from '@/api/tenantManagement.js'
import { getRoleList, getUserList, updateUserStatus, getOrgList, resetPassword, getPostAllList, unlock } from '@/api/userManange.js'
import { getPlatform } from '@/api/sams.js'

export default {
  name: 'PermissUserManageUserManage',
  data() {
    return {
      statusKey: {
        0: '禁用',
        1: '启用',
        2: '离职'
      },
      roleList: [],
      // 过滤KEY
      filterText: '',
      // 左侧组织机构
      orgList: [],
      treeData: [],
      total: 0,
      form: {
        // 用户名
        fuzzyName: '',
        // 工号
        fuzzyJobNumber: '',
        // fuzzyName: '',
        // 岗位
        postId: '',
        // 租户
        tenantId: '',
        // 组织机构
        organizationId: '',
        current: 1,
        size: 10
      },
      // 列表加载状态
      loading: false,
      // 租户搜索列表
      tenantList: [],
      // 岗位搜索列表
      postList: [],
      // 操作当前行数据
      current: null,
      // 用户列表
      userList: [],
      // 多选id 列表
      selection: [],
      // 平台列表
      platList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission']),
    // 是否超级管理员
    isAdmin() {
      // console.log(this.userInfo)
      return this.userInfo.role_name.includes('administrator')
      // return false
    }
  },
  watch: {
    filterText(val) {
      this.$refs['tree-org'].filter(this.filterText)
    }
  },
  created() {
    this.getRoleList()
    this.loadList()
    // this.getTenantList()
    this.getPostAllList()
    this.getOrgList()
    this.getPlatform()
  },
  methods: {
    // 获取平台下拉列表
    getPlatform() {
      getPlatform().then(res => {
        this.platList = res.data
      })
    },
    // 获取用户列表
    loadList() {
      this.loading = true
      getUserList(Object.assign({}, this.form))
        .then((res) => {
          if (res.success) {
            this.userList = res.data.records
            this.total = res.data.total
            if (this.userList.length) {
              this.userList.map(item => {
                if (item.userDuties) item.userDuties = item.userDuties.reverse()
              })
            }
          }
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
    // 列表多选事件
    selectionChange(selection) {
      this.selection = selection.map((item) => item.id)
    },
    // 用户被锁行样式
    rowClassName({ row, rowIndex }) {
      if (row.locked) return 'locked'
    },
    // 搜索过滤左侧机构列表
    filterNode(value, data) {
      if (!value) {
        this.treeData = []
        this.$nextTick(() => {
          this.treeData = deepClone(this.orgList)
        })
        return
      }
      if (value) return data.title.indexOf(value) !== -1
    },
    nodeClick(data, node, self) {
      if (data.id === this.form.organizationId) {
        const treeMap = this.$refs['tree-org'].store.nodesMap
        Object.values(treeMap).find(item => {
          if (item.isCurrent) {
            item.checked = false
            item.isCurrent = false
          }
        })
        this.form.organizationId = ''
        // this.$refs['tree-org'].setChecked(data.key, false)
      } else {
        this.form.organizationId = data.id
      }
      this.loadList()
    },
    // reSetTree()
    // 获取租户搜索列表
    async getTenantList() {
      this.tenantList = await getTenantList({ size: 9999, current: 1 }).then(
        (res) => res.data.records
      )
    },
    // 获取岗位列表
    async getPostAllList() {
      this.postList = await getPostAllList({ size: -1 }).then(res => res.data.records)
    },
    // 获取左侧组织机构列表
    async getOrgList() {
      this.orgList = await getOrgList({ parentId: this.userInfo.tenant_id }).then(
        (res) => res.data
      )
      this.treeData = deepClone(this.orgList)
    },
    // 查看用户详情
    seeDetail(row) {
      this.$modal({
        title: '查看用户',
        component: userModalView,
        padding: '0',
        minHeight: '200px',
        data: {
          row,
          isAdmin: this.isAdmin,
          platList: this.platList
        },
        callback: (refresh) => {
          refresh && this.loadList()
        }
      })
    },
    // 添加用户
    addUser(row) {
      this.current = row
      this.$modal({
        title: this.current ? '编辑用户' : '添加用户',
        component: addModal,
        padding: '0',
        minHeight: '200px',
        width: '800px',
        data: {
          current: this.current,
          orgList: this.orgList,
          postList: this.postList,
          tenantList: this.tenantList,
          isAdmin: this.isAdmin,
          platList: this.platList
        },
        callback: (refresh) => {
          refresh && this.loadList()
        }
      })
    },
    // 用户解锁
    unlock(row) {
      unlock({ userIds: row.id }).then(res => {
        this.$message.success('用户解锁成功')
        this.loadList()
      })
    },
    // 重置密码
    resetPassword() {
      if (this.selection.length === 0) {
        this.$message.error('请选择至少一条数据')
        return false
      }
      resetPassword({ userIds: this.selection.toString() }).then((res) => {
        if (res.success) {
          this.$message.success('重置密码为123456')
          this.loadList()
        }
      })
    },
    // 修改角色
    editRole(row) {
      this.current = row
      this.$modal({
        title: '修改角色',
        component: updateRole,
        padding: '0',
        minHeight: '330px',
        width: '600px',
        data: {
          current: this.current,
          roleList: this.roleList
        },
        callback: (refresh) => {
          refresh && this.loadList()
        }
      })
    },
    // 修改用户状态
    changeSatus(row) {
      updateUserStatus({
        userId: row.id,
        status: row.status === 1 ? 0 : 1
      }).then((res) => {
        if (res.success) {
          this.$message.success('修改成功')
          this.loadList()
        }
      })
    },
    // 获取角色列表
    getRoleList() {
      getRoleList({ size: 9999 }).then((res) => {
        this.roleList = res.data.records
      })
    },
    // 查看日志
    showLog(row) {
      this.$modal({
        title: '日志列表',
        component: Log,
        width: '1000px',
        data: {
          tenantList: this.tenantList,
          tenantId: this.userInfo.tenant_id,
          // optBus: row.account,
          optBusId: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 8px !important;
}
::v-deep .el-tree-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tc {
  text-align: center;
}
.filterText {
  margin-bottom: 8px;
}
.el-col-btn {
  margin-bottom: 15px;
}
.tag {
  margin-bottom: 5px;
  display: inline-block;
}
.status-btn {
  vertical-align: -5px;
  margin-left: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.basic-container{
  min-width: 0 !important;
}
</style>
