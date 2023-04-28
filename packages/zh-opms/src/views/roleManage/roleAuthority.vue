<template>
  <basic-container>
    <div class="myTable">
      <el-form
        ref="form"
        size="mini"
        label-width="100px"
      >
        <el-row :gutter="10">
          <el-col :span="6">
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
              label="租户ID"
              size="small"
            >{{ roleInfo.tenantId }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="6">
          <el-col
            :span="24"
            style="text-align: right"
          >
            <el-form-item style="margin-bottom: 0">
              <el-button
                type="primary"
                size="small"
                :loading="load"
                @click="submit"
              >提 交</el-button>
            </el-form-item>
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
                size="small"
                style="width: 100%"
      >
        <el-table-column
          type=""
          width="55"
        >
          <template slot="header">
            <el-checkbox v-model="checkPageAll" @change="checkPageAllEv($event)" />
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.pageCheck"
              :indeterminate="scope.row.isIndeterminate"
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
              v-for="item in scope.row.buttons"
              :key="item.id"
              v-model="item.buttonCheck"
              :label="item.name"
              @change="buttonsChange(scope.row)"
            >{{ item.name }}</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenuList, getRoleMenu, getRoleOrg, roleGrant } from '@/api/role'
import { arrRemoveSame } from '@/util/permiss'
import { deepClone } from '@/util/util'
import { buttonAll, checkAll, getParent } from './role.handle.js'

export default {
  name: 'RoleManageRoleAuthority',
  props: {
    // eslint-disable-next-line vue/require-default-prop
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
      rowData: {},
      paramsArr: [],
      defineData: [],
      row: {},
      roleMenu: [],
      isMultiple: false,
      isIndeterminate: true,
      parentIdArr: [],
      load: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    // 是否超级管理员
    isAdmin() {
      // return this.userInfo.role_name.includes('administrator')
      return true
    }
  },
  watch: {
    $route(to, from) {
      // 从菜单过来
      if (from.name === 'PermissMenuManageMenuManage') {
        this.getMenuList()
      }
    }
  },
  created() {
    if (this.roleInfo.id) this.getMenuList()
  },
  methods: {
    // 遍历json数据，判断是否全部勾选
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
        buttonAll(this.tableData, true)
        // 全部添加到paramsArr
        const selectedArr = []
        const checkButton = (data) => {
          for (const x of data) {
            if (Number(x.category) === 1) {
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
      } else {
        checkAll(this.tableData, false)
        buttonAll(this.tableData, false)
        this.paramsArr = []
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
        this.$set(row, 'pageCheck', false)
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
      if (scope.row.pageCheck) {
        // 勾选当前项同时勾选其父级列表
        getParent(this.tableData, scope.row.id).forEach((item, i) => {
          item.pageCheck = true
          // 添加到数组
          this.defaultOrgData(item)
          // 默认全部勾上操作权限
          if (item.buttons && item.buttons.length) {
            item.buttons.forEach(item => { item.buttonCheck = true })
          }
        })
        // 勾选当前项，同时勾选其子级列表和所有按钮
        const checkChild = (data) => {
          data.forEach(item => {
            item.pageCheck = true
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
          if (item.pageCheck === true && Number(item.category) !== 2) {
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
    buttonsChange(row) {
      this.tableData = deepClone(this.tableData)
      const { buttons } = row
      // 只要有选中按钮，则菜单选中
      if (buttons.some(item => item.buttonCheck)) {
        // 所有父级 也选中
        const handleArr = (arr, id, newArr) => {
          if (!newArr) {
            arr.forEach(item => {
              if (item.id === id) {
                item.pageCheck = true
                this.defaultOrgData(item)
              } else if (item.children) {
                handleArr(arr, id, item.children)
              }
            })
          } else {
            newArr.forEach(item => {
              if (item.id === id) {
                item.pageCheck = true
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
    getRoleMenu() {
      return getRoleMenu({ roleIds: this.roleInfo.id }).then(res => res.data)
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
        this.rowData = {
          category: row.category,
          menuId: row.id,
          menuName: row.name,
          orgIds: []
        }
        if (isDefine) { // 自定义组织数据
          this.dialogFormData = await this.getRoleOrg(row.id)
          this.rowData.orgIds = this.dialogFormData
          this.paramsArr.push(this.rowData)
          if (!isCreated) this.showTree = true
        } else { // 默认
          this.paramsArr.push(this.rowData)
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
    // 修改 orgIds
    getOrgIds(val) {
      if (this.isMultiple) { // 批量
        this.handleResetData(this.defineData, val)
      } else { // 单个操作
        const item = this.paramsArr.find(item => item.menuId === this.row.id)
        if (item) item.orgIds = val
      }
    },
    handleMultiple(val) {
      if (val) this.isMultiple = true
    },
    async handleOriginData(data) {
      this.paramsArr = []
      const tableData = data
      const roleMenu = await this.getRoleMenu()
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
              // if (item.children) { //
              //   item.isIndeterminate = true
              // }
              // 已勾选数据
              this.handleChecked(item, false, true)
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
        // 是否所有子项都已经勾选
        if (this.tableData.length && this.isCheckAllEv(this.tableData) === true) {
          this.checkPageAll = true
        } else {
          this.checkPageAll = false
        }
      })
    },
    // 菜单列表
    getMenuList() {
      this.loading = true
      getMenuList({ tenantId: this.roleInfo.tenantId }).then(res => {
        // 数组对象处理逻辑
        this.handleOriginData(res.data)
        buttonAll(res.data, false) // 初始化所有按钮
      }).finally(() => {
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
    submit(arr) {
      const buttons = this.selectedButton()
      const menus = Array.isArray(arr) ? arr : this.paramsArr
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
      const message = Array.isArray(arr) ? '批量处理成功' : '提交成功'
      const params = {
        grants: grants,
        roleId: this.roleInfo.id,
        roleName: this.roleInfo.roleName
      }
      roleGrant(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: message
          })
        }
        this.getMenuList()
      }).finally(() => {
        this.load = false
      })
    }
  }
}
</script>

<style lang="scss">
@import "../index.scss";
.check-page-all {
  position: relative;
  top: 29px;
  left: 21px;
  z-index: 99;
}
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
