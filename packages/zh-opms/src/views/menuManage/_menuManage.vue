<template>
  <basic-container>
    <el-form
      ref="screenForm"
      :model="form"
      :inline="true"
      size="small"
      label-width="80px"
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
          >
            <el-input
              v-model="form.name"
              placeholder="菜单名称"
              clearable
              class="w250"
            />
          </el-form-item>
          <el-form-item
            label="菜单类型"
            prop="category"
          >
            <el-select
              v-model="form.category"
              clearable
              placeholder="菜单类型"
            >
              <el-option label="菜单" value="1" />
              <el-option label="按钮" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item class="m-l-20">
            <el-button
              type="primary"
              size="small"
              @click="form.current = 1; loadList()"
            >搜 索</el-button>
            <el-button
              size="small"
              @click="$refs['screenForm'].resetFields(); form.current = 1; loadList()"
            >清 空</el-button>
            <el-button
              v-if="permission.opms_menu_add"
              type="primary"
              size="small"
              @click="addMenu(null)"
            >添加菜单</el-button>
            <el-button
              v-if="permission.opms_menu_delete"
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
      ref="table"
      v-loading="loading"
      :data="menuList"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :load="(tree, treeNode, resolve)=>load(tree, treeNode, resolve)"
      lazy
      row-key="id"
      border
      height="calc(100vh - 224px)"
      size="small"
      style="width: 100%"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="菜单名称" prop="name" class-name="column-align-left" />
      <!-- <el-table-column label="拥有人数统计" prop="count">
        <template slot-scope="{ row }">
          <el-button type="text" @click="showCountDetails(row)">{{ row.count }}</el-button>
        </template>
      </el-table-column> -->
      <el-table-column label="菜单所属应用" prop="appName" />
      <el-table-column label="前端路由地址" prop="path" />
      <!-- <el-table-column label="资源" prop="resList">
        <template slot-scope="{ row }">
          <span v-for="item in row.resList" :key="item.id" class="res-item">{{ item.url }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="菜单排序" width="100" prop="sort" />
      <el-table-column label="菜单类型" prop="category">
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
      <el-table-column label="操作" min-width="120">
        <template slot-scope="{ row }">
          <el-button
            v-if="permission.opms_menu_view"
            type="text"
            size="small"
            @click="seeDetail(row)"
          >查看</el-button>
          <el-button
            v-if="permission.opms_menu_edit"
            type="text"
            size="small"
            @click="addMenu(row)"
          >编辑</el-button>
          <el-button
            v-if="permission.opms_menu_delete"
            type="text"
            size="small"
            @click="removeHandle(row)"
          >删除</el-button>
          <el-button
            v-if="permission.opms_menu_add"
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
      showMenu: true,
      loadParams: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission'])
  },
  created() {
    this.loadList()
    this.getAppList()
    this.loadChangeList()
  },
  methods: {
    // 懒加载子级
    load(tree, treeNode, resolve) {
      getMenuList({ parentId: tree.id }).then(res => {
        resolve(res.data)
        // 由于传入空数组 elementui 不会重新设置数据，所以在此处额外设置 elementui/packages/table/src/store/tree.js#L=200
        if (Array.isArray(res.data) && res.data.length === 0) {
          this.$set(this.$refs.table.store.states.lazyTreeNodeMap, tree.id, [])
        }
        this.loadParams[tree.id] = { tree, treeNode, resolve }
      })
    },
    // 获取菜单列表
    loadList() {
      const { appId, category, name } = this.form
      if (!appId && !category && !name) {
        this.form.parentId = 0
      } else {
        delete this.form.parentId
      }
      this.loading = true
      this.showMenu = false
      getMenuList(this.form).then(res => {
        this.menuList = res.data
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
    // 获取应用列表
    getAppList() {
      getAppList({ current: 1, size: 9999 }).then((res) => {
        const records = res.data
        this.appList = records
      })
    },
    // 多选操作
    selectionChange(selection) {
      this.ids = selection.map(item => item.id)
      // console.log(this.ids)
    },
    // 查看详情
    seeDetail(row) {
      this.$modal({
        title: '查看菜单',
        component: menuModalView,
        data: {
          row: row
        }
      })
    },
    // 添加菜单
    addMenu(current, row) {
      this.current = current
      this.$modal({
        title: this.current ? '编辑菜单' : '添加菜单',
        component: menuModal,
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
              this.loadListISChild(row)
            }
            this.loadChangeList()
          }
        }
      })
    },
    loadListISChild(row) {
      if (row && (this.loadParams[row.id] || this.loadParams[row.parentId])) {
        const { tree, treeNode, resolve } = (this.loadParams[row.id] || this.loadParams[row.parentId])
        this.load(tree, treeNode, resolve, row.id)
      } else {
        this.loadList()
      }
    },
    // 删除菜单
    removeHandle_() {
      if (this.ids.length === 0) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      this.removeHandle()
    },
    removeHandle(row) {
      const ids = row ? [row.id] : this.ids
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
          this.loadListISChild({ id: row?.parentId })
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
</style>

<style lang="scss">
@import "../index.scss";
</style>
