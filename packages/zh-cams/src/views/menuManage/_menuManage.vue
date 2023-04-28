<template>
  <basic-container>
    <el-form
      ref="screenForm"
      :model="form"
      :inline="true"
      size="small"
      label-width="80px"
      class="no-message"
    >
      <el-row>
        <el-col>
          <el-form-item
            label="应用名称"
            prop="appId"
          >
            <el-select
              v-model="form.appId"
              filterable
              clearable
              placeholder="应用名称"
              popper-class="select-style"
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
          <el-form-item
            label="菜单名称"
            prop="name"
            class="lh32"
          >
            <el-input
              v-model="form.name"
              placeholder="菜单名称"
              clearable
              class="w250"
            />
          </el-form-item>
          <el-form-item
            class="lh32"
            label="菜单类型"
            prop="category"
          >
            <el-radio
              v-model="form.category"
              class="lh32"

              label="1"
            >菜单</el-radio>
            <el-radio
              v-model="form.category"
              class="lh32"

              label="2"
            >按钮</el-radio>
            <!-- <el-select
              v-model="form.category"
              clearable
              placeholder="菜单类型"
            >
              <el-option label="菜单" value="1" />
              <el-option label="按钮" value="2" />
            </el-select> -->
          </el-form-item>
          <el-form-item class="m-l-20">
            <el-button
              class="h32"
              icon="el-icon-search"
              type="primary"
              size="small"
              @click="form.current = 1; delete form.parentId; loadList()"
            >查 询</el-button>
            <el-button
              class="h32"
              icon="el-icon-refresh"
              size="small"
              @click="$refs['screenForm'].resetFields(); form.current = 1; form.parentId = 0; loadList()"
            >重 置</el-button>
            <el-button
              v-if="permission.menu_add"
              class="h32"
              icon="el-icon-plus"
              type="primary"
              size="small"
              @click="addMenu(null)"
            >新增菜单</el-button>
            <el-button
              v-if="permission.menu_delete"
              class="h32"
              icon="el-icon-delete"
              type="danger"
              size="small"
              plain
              @click="removeHandle_"
            >删 除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-if="showMenu"
      v-loading="loading"
      class="g-table menuTable"
      :data="menuList"
      :header-cell-style="{ background:'#F7F7F7', color:'rgba(0,0,0,.85)' }"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      border
      height="calc(100vh - 224px)"
      size="small"
      style="width: 100%"
      lazy
      stripe
      @selection-change="selectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="菜单名称"
        prop="name"
        class-name="column-align-left"
      />
      <el-table-column
        label="菜单所属应用"
        prop="appName"
      />
      <el-table-column
        label="拥有人数统计"
        prop="count"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="showCountDetails(row)"
          >{{ row.count }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="前端路由地址"
        width="230"
        prop="path"
      />
      <!-- <el-table-column label="资源" prop="resList">
        <template slot-scope="{ row }">
          <span v-for="item in row.resList" :key="item.id" class="res-item">{{ item.url }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="菜单排序"
        width="100"
        prop="sort"
      />
      <el-table-column
        label="菜单类型"
        prop="category"
      >
        <template slot-scope="{ row }">
          <el-tag v-if="row.category == 1">菜单</el-tag>
          <el-tag v-else type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="系统管理菜单"
        prop="isSuperShowOnly"
      >
        <template slot-scope="{ row }">
          {{ row.isSuperShowOnly == 1 ? '是' : '否' }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        min-width="130"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="permission.menu_view"
            type="text"
            size="small"
            @click="seeDetail(row)"
          >查看</el-button>
          <el-button
            v-if="permission.menu_edit"
            type="text"
            size="small"
            @click="addMenu(row)"
          >编辑</el-button>
          <el-button
            v-if="permission.menu_delete"
            type="text"
            size="small"
            @click="removeHandle([row.id])"
          >删除</el-button>
          <el-button
            v-if="permission.menu_add"
            type="text"
            size="small"
            @click="addMenu(null, row)"
          >添加子项</el-button>
        </template>
      </el-table-column>
    </el-table>
  </basic-container>
</template>

<script>
import { getMenuList, removeMenu } from '@/api/menuManage.js'
import { mapGetters } from 'vuex'
import { getAppList } from '@/api/tenantManagement.js'
import countDetails from './components/countDetails.vue'
import menuModal from './components/menuModal.vue'
import menuModalView from './components/menuModalView.vue'

export default {
  name: 'PermissMenuManageMenuManage',
  inject: ['index'],
  data() {
    return {
      // 操作当前行数据
      current: null,
      form: {
        // 应用id
        appId: '',
        // 类别 1菜单 2按钮
        category: '',
        // 菜单名称
        name: '',
        // 父级id(需要懒加载时传入该id)
        parentId: 0
      },
      loading: false,
      menuList: [],
      appList: [],
      ids: [],
      // 选择上级菜单列表
      menuChangeList: [],
      menuChangeLoading: false,
      showMenu: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getAppList()
    })
  },
  created() {
    this.loadList()
    this.getAppList()
    this.loadChangeList()
  },
  methods: {
    // 获取菜单列表
    loadList() {
      this.loading = true
      this.showMenu = false
      if (Number(this.form.category) === 2) this.form.parentId = ''
      getMenuList(this.form).then(res => {
        if (res.success) {
          this.menuList = res.data
        }
      }).finally(() => {
        this.loading = false
        this.showMenu = true
      })
    },
    // 获取选择上级菜单列表
    async loadChangeList() {
      this.menuChangeLoading = true
      this.menuChangeList = await getMenuList({ parentId: '' }).then(res => res.data)
      this.menuChangeLoading = false
    },
    // 懒加载子级
    load(tree, treeNode, resolve) {
      getMenuList({ parentId: tree.id }).then(res => {
        resolve(res.data)
      })
    },
    // 获取应用列表
    getAppList() {
      getAppList({ current: 1, size: 9999 }).then((res) => { this.appList = res.data })
    },
    // 多选操作
    selectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    // 查看详情
    seeDetail(row) {
      this.$modal({
        title: '查看菜单',
        component: menuModalView,
        data: {
          currents: row
        }
      })
    },
    // 添加菜单
    addMenu(current, row) {
      this.current = current
      this.$modal({
        title: this.current ? '编辑菜单' : '添加菜单',
        component: menuModal,
        width: '770px',
        height: '470px',
        data: {
          row,
          currentObj: this.current,
          appList: this.appList,
          menuList: this.menuChangeList,
          index: this.index,
          menuChangeLoading: this.menuChangeLoading
        },
        callback: (refresh, isEdit, updatedData) => {
          if (refresh) {
            if (isEdit) {
              Object.assign(current, updatedData)
            } else {
              this.loadList()
            }
            this.loadChangeList()
          }
        }
      })
    },
    // 删除菜单
    removeHandle_() {
      if (this.ids.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      this.removeHandle(this.ids)
    },
    removeHandle(ids) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        removeMenu({
          ids: ids.join(',')
        }).then((res) => {
          this.$message.success('操作成功')
          this.loadList()
          this.index.openMenu(this.menuId)
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 查看拥有人数明细弹窗
    showCountDetails(row) {
      this.$modal({
        title: '拥有人数明细',
        component: countDetails,
        width: '800px',
        top: '100px',
        data: {
          current: row
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../index.scss";
.w250 {
  width: 150px;
}
.m-l-20 {
  margin-left: 20px;
}
.res-item {
  margin-right: 10px;
  display: inline-block;
}
.menuTable {
  ::v-deep td {
   padding: 7px 0 0 0;
  }
}
::v-deep .el-input__inner{
  height:32px;
  line-height:32px;
}
::v-deep .h32.el-button.el-button--small{
  height:32px;
  line-height:32px;
  padding-top:0;
}
.lh32{
  height:32px;
  line-height:32px;
}
</style>
