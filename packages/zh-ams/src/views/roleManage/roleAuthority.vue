<template>
  <basic-container>
    <div class="myTable">
      <el-form
        ref="form"
        size="mini"
        label-width="100px"
      >
        <el-row :gutter="10">
          <el-col v-if="roleInfo.id" :span="6">
            <el-form-item
              label="角色名称"
              size="small"
            >{{ roleInfo.roleName }}</el-form-item>
          </el-col>
          <el-col
            v-if="isAdmin"
            :span="6"
          >
            <el-form-item
              label="所属租户"
              size="small"
            >{{ roleInfo.tenantId }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="6" class="mb-3">
          <el-col
            :span="12"
            class="text-start"
          >
            <el-button v-if="permission.role_refer && roleInfo.id" size="mini" type="primary" @click="referRole">引用角色</el-button>
            <el-button v-if="permission.role_import && roleInfo.id" size="mini" type="primary" @click="importRole">导入更新本角色权限</el-button>
            <el-button v-if="!roleInfo.id" size="mini" :disabled="isSubmit" type="primary" @click="batchRolePermission">批量修改角色权限</el-button>
          </el-col>
          <el-col
            v-if="roleInfo.id"
            :span="12"
            class="text-end"
          >
            <el-button
              :disabled="isSubmit"
              type="primary"
              size="small"
              :loading="load"
              @click="submit"
            >提 交</el-button>
            <el-button
              size="small"
              @click="batchReset"
            >批量重置为默认数据范围</el-button>
            <el-button
              size="small"
              @click="batchDefine"
            >批量自定义数据范围</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table ref="table"
                v-loading="loading"
                :data="tableData"
                :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
                :tree-props="{children: 'children', hasChildren: 'children.length > 0'}"
                :default-expand-all="false"
                row-key="id"
                border
                stripe
                height="calc(100vh - 271px)"
                size="mini"
                style="width: 100%"
      >
        <el-table-column width="55" type="">
          <template slot="header">
            <el-checkbox v-model="checkPageAll" @change="checkPageAllEv($event)" />
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.pageCheck"
              @change="pageCheckEv(scope)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          width="200"
          label="功能模块"
          class-name="column-align-left"
        />
        <el-table-column
          label="操作权限"
          class-name="column-align-left operation-auth"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-for="(item, index) in scope.row.buttons"
              :key="item.id"
              v-model="item.buttonCheck"
              :label="item.name"
              @change="buttonsChange(scope.row, index)"
            >{{ item.name }}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="数据范围" width="380">
          <template slot-scope="scope">
            <el-radio-group
              v-if="scope.row.category == 1"
              v-model="scope.row.radio"
              :disabled="scope.row.pageCheck ? false : true"
              @change="handleRadio(scope.row)"
            >
              <el-radio
                label="0"
                value="0"
              >个人及其所管辖组织数据</el-radio>
              <el-radio
                label="1"
                value="1"
              ><span @click="getOrgData(scope.row)">自定义组织数据</span></el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <tree
        v-if="showTree"
        :is-show="showTree"
        :dialog-form="dialogFormData"
        :is-multiple="isMultiple"
        :tenant-id="roleInfo.tenantId"
        :data="organizationTree"
        @orgIds="getOrgIds"
        @multipleHandle="handleMultiple"
        @closeView="showTree = false"
      />
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenuList, getRoleMenu, getRoleOrg, roleGrant } from '@/api/role'
import { getOrgTree } from '@/api/organization'
import { arrRemoveSame } from '@/util/permiss'
import tree from './components/tree'
import importRole from './components/importRole.vue'
import referRole from './components/referRole.vue'
import batchUpdatePermission from './components/batchUpdatePermission.vue'
import { deepClone } from '@/util/util'
import { buttonAll, checkAll, radioAll, getParent } from './role.handle.js'
import { getRoleList } from '@/api/userManange.js'

export default {
  name: 'RoleManageRoleAuthority',
  components: { tree },
  props: {
    roleInfo: Object
  },
  data() {
    return {
      tableData: [],
      data: [],
      loading: false,
      operationAuth: [],
      operationMethods: ['添加', '删除', '修改', '搜索'],
      checkPageAll: false,
      showTree: false,
      paramsArr: [],
      defineData: [],
      row: {},
      roleMenu: [],
      isMultiple: false,
      parentIdArr: [],
      load: false,
      oldData: [],
      isClickDefine: false,
      organizationTree: [],
      menuList: [],
      roleList: [] // 批量操作角色权限
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission']),
    // 是否超级管理员
    isAdmin() {
      return this.userInfo.role_name.includes('administrator')
    },
    isSubmit() {
      if (this.isClickDefine) {
        return false
      } else {
        return JSON.stringify(this.tableData) === JSON.stringify(this.oldData)
      }
    }
  },
  watch: {
    $route(to, from) {
      // 从菜单过来
      if (from.name === 'PermissMenuManageMenuManage') {
        this.getMenuList()
      }
      if (from.name === 'PermissOrganizationManageOrganizationList') {
        this.getOrgTree()
      }
    }
  },
  created() {
    // if (this.roleInfo.id)
    this.getMenuList()
    this.getOrgTree()
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    // 批量操作接口
    getRoleList() {
      getRoleList({ size: 9999 }).then((res) => {
        this.roleList = res.data.records.concat({ id: 'ALL', roleName: '全部', roleAlias: '所有角色' })
      })
    },
    // 引用角色
    referRole() {
      this.$modal({
        title: '引用角色',
        component: referRole,
        width: '600px',
        minHeight: '200px',
        callback: (refresh) => {
          refresh && this.handleOriginData(this.menuList, refresh)
        }
      })
    },
    // 导入角色
    importRole() {
      this.$modal({
        title: '导入更新本角色权限',
        component: importRole,
        data: {
          permission: this.permission
        },
        width: '600px',
        minHeight: '100px',
        callback: (refresh) => {
          refresh && this.handleOriginData(this.menuList, null, true)
        }
      })
    },
    // 批量修改角色权限
    batchRolePermission() {
      const buttons = this.selectedButton()
      let grants = [...this.paramsArr, ...buttons]
      grants = arrRemoveSame(grants, 'menuId') // 去重
      const menuArr = grants.map(item => item.menuId)
      this.$modal({
        title: '批量修改角色权限',
        component: batchUpdatePermission,
        data: {
          tableData: this.tableData,
          roleList: this.roleList,
          menuArr
        },
        width: '600px',
        minHeight: '100px',
        callback: (refresh) => {
          // refresh && this.handleOriginData(this.menuList, null, true)
          if (refresh) {
            // this.getMenuList()
            // this.getOrgTree()
            this.$emit('close', true)
          }
        }
      })
    },
    // 组织机构树
    getOrgTree() {
      const params = {
        tenantId: this.tenantId
      }
      getOrgTree(params).then(res => {
        this.organizationTree = res.data
      })
    },
    handleRadio(val) {
      if (val.pageCheck) {
        if (val.radio === '1') {
          this.getOrgData(val)
        } else {
          this.defaultOrgData(val)
        }
      }
    },
    // 遍历json数据
    isCheckAllEv(data) {
      let isCheckAll = true
      const fn = data => {
        for (const x of data) {
          if (x.pageCheck === false) {
            isCheckAll = false
            return isCheckAll
          }
          if (x.children) {
            fn(x.children)
          }
        }
      }
      fn(data)
      return isCheckAll
    },
    // 总选框事件
    checkPageAllEv(item) {
      if (item === true) {
        checkAll(this.tableData, true)
        radioAll(this.tableData, '0')
        // 全部添加到paramsArr
        const selectedArr = []
        const checkButton = (data) => {
          for (const x of data) {
            if (x.category === 1) {
              const obj = {
                category: x.category,
                menuId: x.id,
                menuName: x.name,
                orgIds: []
              }
              selectedArr.push(obj)
            }
            if (x.children) {
              checkButton(x.children)
            }
          }
        }
        checkButton(this.tableData)
        this.paramsArr = []
        this.paramsArr = selectedArr
        buttonAll(this.tableData, true)
      } else {
        checkAll(this.tableData, false)
        radioAll(this.tableData, '')
        this.paramsArr = []
        buttonAll(this.tableData, false)
      }
    },
    /* 操作权限按钮修改 */
    buttonsChange(row, index) {
      const { buttons } = row
      if (buttons[index].buttonCheck) {
        buttons.splice(index, 1, Object.assign(buttons[index], {
          buttonCheck: true
        }))
      } else {
        buttons.splice(index, 1, Object.assign(buttons[index], {
          buttonCheck: false
        }))
      }
      // 只要有选中按钮，则菜单选中
      if (buttons.some(item => item.buttonCheck)) {
        // 所有父级 也选中
        const handleArr = (arr, id, newArr) => {
          if (!newArr) {
            arr.forEach(item => {
              if (item.id === id) {
                item.pageCheck = true
                item.radio = '0'
                this.defaultOrgData(item)
              } else if (item.children) {
                handleArr(arr, id, item.children)
              }
            })
          } else {
            newArr.forEach(item => {
              if (item.id === id) {
                item.pageCheck = true
                item.radio = '0'
                this.defaultOrgData(item)
                handleArr(arr, item.parentId)
              } else if (item.children) {
                handleArr(arr, id, item.children)
              }
            })
          }
        }
        handleArr(this.tableData, row.id)
      }
    },
    // 取消勾选逻辑处理
    cancelSelect(row) {
      // 取消菜单，取消所有选中按钮
      const { buttons } = row
      if (buttons && buttons.length) {
        buttons.forEach(item => {
          item.buttonCheck = false
        })
      }
      const index = this.paramsArr.findIndex(item => item.menuId === row.id)
      if (index > -1) {
        this.paramsArr.splice(index, 1)
        row.radio = ''
        this.$set(row, 'radio', '')
        row.pageCheck = false
      }
      // 取消勾选同时取消勾选子级列表
      if (!row.children) {
        return
      }
      for (let i = 0; i < row.children.length; i++) {
        this.cancelSelect(row.children[i])
      }
    },
    // 子选框事件
    pageCheckEv(scope) {
      // this.saveInitData()
      if (scope.row.pageCheck) {
        // 勾选当前项同时勾选其父级列表
        getParent(this.tableData, scope.row.id).forEach((item, i) => {
          item.pageCheck = true
          // 添加到数组
          this.defaultOrgData(item)
          this.$set(item, 'radio', '0')
          this.$nextTick(() => {
            item.radio = '0'
          })
        })
        // 勾选菜单时，按钮都没有选中，则默认选中所有按钮
        const { buttons } = scope.row
        if (buttons && buttons.length && !buttons.some(item => item.buttonCheck)) {
          buttons.forEach(item => {
            item.buttonCheck = true
          })
        }
        // 勾选当前项，同时勾选其子级列表和所有按钮
        const checkChild = (data) => {
          data.forEach(item => {
            item.pageCheck = true
            item.radio = '0'
            this.defaultOrgData(item)
            if (item.buttons && item.buttons.length) {
              item.buttons.forEach(val => {
                val.buttonCheck = true
              })
            }
            if (item.children && item.children.length) {
              checkChild(item.children)
            }
          })
        }
        if (scope.row.children && scope.row.children.length) checkChild(scope.row.children)
      } else {
        // 取消勾选，删除数组中元素
        this.cancelSelect(scope.row)
      }
      // 是否所有子项都已经勾选
      if (this.isCheckAllEv(this.tableData) === true) {
        this.checkPageAll = true
      } else {
        this.checkPageAll = false
      }
    },
    handleCheckAll(row, checked) {
      row.pageCheck = checked
      if (row.children) {
        const that = this
        row.children.forEach((element, i) => {
          that.handleCheckAll(row.children[i], checked)
        })
      }
    },
    handleTableData() {
      const selectedData = []
      const handleSelected = (data) => {
        for (const item of data) {
          if (item.pageCheck === true && item.category !== 2) {
            selectedData.push(item)
            this.parentIdArr.push(item.parentId)
          }
          if (item.children) {
            handleSelected(item.children)
          }
        }
      }
      handleSelected(this.tableData)
      return selectedData
    },
    // 批量重置
    batchReset() {
      const selected = this.handleTableData()
      if (!selected.length) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据'
        })
      } else {
        selected.forEach(item => { item.radio = '0' })
        this.handleResetData(selected)
      }
    },
    // 批量自定义
    batchDefine() {
      this.isMultiple = false // 非批量处理
      const selected = this.handleTableData()
      if (!selected.length) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据'
        })
      } else {
        this.showTree = true
        selected.forEach(item => { item.radio = '1' })
        this.defineData = selected
        this.dialogFormData = []
        this.isMultiple = true
      }
    },
    handleResetData(data, ids) {
      const orgIds = Array.isArray(ids) ? ids : []
      const paramsMultiple = []
      data.map(item => {
        const obj = {}
        obj.category = item.category
        obj.menuId = item.id
        obj.menuName = item.name
        obj.orgIds = orgIds
        paramsMultiple.push(obj)
      })
      this.submit(paramsMultiple)
    },
    // 获取角色下的菜单
    getRoleMenu() {
      return this.roleInfo.id ? getRoleMenu({ roleIds: this.roleInfo.id }).then(res => res.data) : []
    },
    getRoleOrg(menuId) {
      const params = {
        menuId: menuId,
        roleId: this.roleInfo.id
      }
      return getRoleOrg(params).then(res => res.data)
    },
    async handleChecked(row, isDefine, isCreated) {
      this.parentIdArr.push(row.parentId)
      const item = this.paramsArr.find(item => item.menuId === row.id)
      if (!item) { // 第一次点击
        if (isDefine) { // 自定义组织数据
          if (!this.isMultiple) this.dialogFormData = await this.getRoleOrg(row.id) // 非批量
          this.paramsArr.push({
            category: row.category,
            menuId: row.id,
            menuName: row.name,
            orgIds: this.dialogFormData
          })
          if (!isCreated) this.showTree = true
        } else { // 默认
          this.paramsArr.push({
            category: row.category,
            menuId: row.id,
            menuName: row.name,
            orgIds: []
          })
        }
      } else {
        if (isDefine) {
          this.dialogFormData = item.orgIds
          this.showTree = true
        } else {
          item.orgIds = []
        }
      }
    },
    // 默认组织数据
    defaultOrgData(row) {
      if (row.pageCheck) {
        this.handleChecked(row)
      }
    },
    // 自定义组织数据
    getOrgData(row) {
      this.isClickDefine = true // 被点击
      this.isMultiple = false
      if (row.pageCheck) {
        this.row = row
        this.handleChecked(row, true)
      }
    },
    // 修改 orgIds
    getOrgIds(val) {
      if (this.isMultiple) { // 批量自定义
        this.handleResetData(this.defineData, val)
      } else { // 单个操作
        const item = this.paramsArr.find(item => item.menuId === this.row.id)
        if (item) item.orgIds = val
      }
    },
    handleMultiple(val) {
      if (val) this.isMultiple = true
    },
    async handleOriginData(data, authMenu, importAuth) {
      this.paramsArr = []
      this.isClickDefine = false // 初始化渲染，重置按钮
      const tableData = data
      if (this.isMultiple) { // 批量自定义数据范围
        this.dialogFormData = await this.getRoleOrg(this.defineData[0].id)
      }

      // 获取已授权角色的菜单
      let roleMenu
      if (authMenu) { // 引用角色
        roleMenu = authMenu
      } else {
        const menu = await this.getRoleMenu()
        roleMenu = arrRemoveSame(menu, 'menuId') // 处理后台返回数据重复的问题
      }
      // eslint-disable-next-line no-unused-vars
      let isPushObj = false // 是否在数组中添加对象
      const fn = data => {
        data.forEach((item, index) => {
          item.pageCheck = false
          roleMenu.map(e => {
            // 已授权菜单
            if (e.menuId === item.id) {
              isPushObj = true
              item.pageCheck = true
              // 已勾选数据
              if (e.isDataScope) { // 自定义
                item.radio = '1'
                this.handleChecked(item, true, true)
              } else { // 默认
                item.radio = '0'
                this.handleChecked(item, false, true)
              }
            }
            // 已授权按钮
            if (item.buttons && item.buttons.length) {
              item.buttons.forEach(i => {
                if (i.id === e.menuId) {
                  i.buttonCheck = true
                }
              })
            }
          })
          if (item.children) {
            fn(item.children)
          }
        })
      }
      fn(tableData)
      this.$nextTick(() => {
        this.tableData = tableData
        this.oldData = deepClone(tableData)
        this.closeLoading()
        // 是否所有子项都已经勾选
        if (this.tableData.length && this.isCheckAllEv(this.tableData) === true) {
          this.checkPageAll = true
        } else {
          this.checkPageAll = false
        }
        if (authMenu || importAuth) this.submit('', true)
      })
    },
    // 菜单列表
    getMenuList() {
      this.loading = true
      getMenuList({ tenantId: this.roleInfo.tenantId }).then(res => {
        // 数组对象处理逻辑
        this.handleOriginData(res.data)
        buttonAll(res.data, false) // 初始化所有按钮
        this.menuList = deepClone(res.data)
      }).catch(() => {
        this.loading = false
      })
    },
    selectedButton() {
      const selectedArr = []
      const checkButton = (data) => {
        for (const x of data) {
          if (x.pageCheck && x.buttons && x.buttons.length) {
            x.buttons.forEach(item => {
              if (item.buttonCheck) {
                const obj = {
                  category: item.category,
                  menuId: item.id,
                  menuName: item.name,
                  orgIds: []
                }
                selectedArr.push(obj)
              }
            })
          }
          if (x.children) {
            checkButton(x.children)
          }
        }
      }
      checkButton(this.tableData)
      return selectedArr
    },
    submit(arr, noGetMenu) {
      const buttons = this.selectedButton()
      const menus = Array.isArray(arr) && arr?.length ? arr : this.paramsArr
      let grants = [...menus, ...buttons]
      grants = arrRemoveSame(grants, 'menuId') // 去重
      if (!grants.length) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条数据'
        })
        return
      }
      this.load = true
      this.loading = true
      const message = Array.isArray(arr) ? '批量处理成功' : '提交成功'
      const params = {
        grants: grants,
        roleId: this.roleInfo.id,
        roleName: this.roleInfo.roleName
      }
      roleGrant(params).then(res => {
        if (res.code === 200) {
          if (!noGetMenu) { // 引用角色
            // this.closeLoading()
            // return
            this.$message({
              type: 'success',
              message: message
            })
          }
          this.getMenuList()
        } else {
          this.closeLoading()
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    closeLoading() {
      this.loading = false // 表格loading
      this.load = false // 提交按钮loading
    }
  }
}
</script>

<style lang="scss">
@import "../index.scss";
.operation-auth {
  .el-checkbox {
    margin-right: 0;
    width: 8vw;
  }
  .el-checkbox__label,
  .el-checkbox__input.is-disabled+span.el-checkbox__label,
  .el-checkbox__input.is-checked+.el-checkbox__label {
      width: 6vw;
      overflow-x: hidden;
      // text-overflow: ellipsis;
      white-space: normal;
      vertical-align: text-top;
  }
}
</style>

<style lang="scss" scoped>
.myTable {
  ::v-deep .el-radio__label {
    font-size: 12px;
  }
  ::v-deep .el-checkbox__label {
    font-size: 12px;
  }
}
</style>
