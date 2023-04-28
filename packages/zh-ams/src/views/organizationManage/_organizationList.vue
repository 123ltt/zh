<template>
  <basic-container>
    <div class="myTable">
      <el-form
        ref="form"
        :model="form"
        size="mini"
        label-width="80px"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item
              label="机构名称"
              prop="orgName"
            >
              <el-input
                v-model="form.orgName"
                placeholder="机构名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="isAdmin" :span="6">
            <el-form-item label="所属租户" size="small" prop="tenantId">
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
          <el-col :span="12">
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
                v-if="permission.organization_add"
                type="primary"
                size="mini"
                @click="addOrg = true, dialogFormData = {}, row = {}"
              >添 加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="id"
        border
        height="calc(100vh - 200px)"
        class="g-table"
        size="mini"
        lazy
        stripe
      >
        <el-table-column
          prop="orgName"
          label="机构名称"
          min-width="100"
          class-name="column-align-left"
        />
        <!-- <el-table-column v-if="isAdmin" prop="tenantName" label="所属租户" /> -->
        <el-table-column
          prop="categoryName"
          label="机构级别"
        />
        <el-table-column
          prop="sort"
          label="排序"
        />
        <el-table-column
          prop="manager"
          label="机构负责人"
        />
        <el-table-column label="机构LOGO">
          <template slot-scope="scope">
            <img
              :src="scope.row.logoValue"
              alt=""
              width="auto"
              height="30"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="prefixNo"
          label="工号前缀"
        />
        <el-table-column
          label="操作"
          width="280"
        >
          <template slot-scope="scope">
            <el-button
              v-if="permission.organization_view"
              type="text"
              size="small"
              @click="viewRow(scope.row)"
            >查 看</el-button>
            <el-button
              v-if="permission.organization_edit"
              type="text"
              size="small"
              @click="editRow(scope.row)"
            >编 辑</el-button>
            <el-button
              v-if="permission.organization_delete"
              type="text"
              size="small"
              @click="deleteRow(scope.row)"
            >删 除</el-button>
            <el-button
              v-if="permission.organization_add"
              type="text"
              size="small"
              @click="addChild(scope.row)"
            >添加子项</el-button>
          </template>
        </el-table-column>
      </el-table>
      <edit-org
        v-if="addOrg"
        :is-show="addOrg"
        :all-categories="allCategories"
        :dialog-form="dialogFormData"
        @closeView="addOrg = false"
        @refresh="refresh"
      />
      <view-org
        v-if="viewOrg"
        :is-show="viewOrg"
        :dialog-form="dialogFormData"
        @closeView="viewOrg = false"
      />
    </div>
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import { getTenantList, getOrgList, deleteOrg } from '@/api/organization'
import { getDictParentList, getDictChildList } from '@/api/dict'
import editOrg from './components/editOrg.vue'
import viewOrg from './components/viewOrg.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PermissOrganizationManageOrganizationList',
  components: { editOrg, viewOrg },
  data() {
    return {
      form: {
        parentId: 0
      },
      dialogFormData: {},
      tableData: [],
      loading: false,
      tenantList: [],
      maps: new Map(),
      dialogVisible: false,
      viewOrg: false,
      addOrg: false,
      row: {},
      allCategories: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission']),
    // 是否超级管理员
    isAdmin() {
      return this.userInfo.role_name.includes('administrator')
    }
  },
  created() {
    this.getPageData()
    this.getDictParentList()
  },
  methods: {
    // 机构级别
    getDictParentList() {
      getDictParentList({ code: 'org_category', appCode: 'ams' }).then(res => {
        const data = res.data.records
        const { id } = data[0]
        this.getDictChildList(id)
      })
    },
    getDictChildList(id) {
      getDictChildList({ parentId: id }).then(res => {
        this.allCategories = res.data
      })
    },
    // 获取租户列表
    loadList() {
      return getTenantList().then(res => res.data.records)
    },
    load(tree, treeNode, resolve) {
      this.maps.set(tree.id, { tree, treeNode, resolve })
      getOrgList({ parentId: tree.id }).then(res => {
        const nodes = res.data.map(v => {
          return { ...v }
        })
        resolve(nodes)
      })
    },
    onSearch() {
      delete this.form.parentId
      this.getPageData()
    },
    close(val) {
      if (val) this.dialogVisible = false
    },
    refresh(val) {
      if (val) {
        if (JSON.stringify(this.row) !== '{}') { // 编辑/添加子级
        /*
          添加子级时，有下一级，即有展开图标，可触发load方法，parentId才为当前行id
        */
          const parentId = (this.row.addChild && this.row.hasChildren) ? this.row.id : this.row.parentId
          // console.log('是否触发过load方法', this.maps.get(parentId))
          if (this.maps.get(parentId)) { // 已展开过子级
            const { tree, treeNode, resolve } = this.maps.get(parentId)
            this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parentId, [])
            this.load(tree, treeNode, resolve)
          } else {
            this.getPageData()
          }
        } else { // 添加
          this.tableData = []
          this.getPageData()
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {
        parentId: 0
      }
      this.getPageData()
    },
    getPageData() {
      this.loading = true
      // this.tenantList = await this.loadList()
      getOrgList(this.form).then(res => {
        const { data } = res
        this.tableData = data
        // this.tableData.forEach(item => {
        //   const row = this.tenantList.find(e => e.tenantId === item.tenantId)
        //   if (row) item.tenantName = row.tenantName
        // })
      }).finally(() => {
        this.loading = false
      })
    },
    viewRow(row, index) {
      this.viewOrg = true
      this.dialogFormData = row
      this.dialogFormData.category = this.dialogFormData.category.toString()
    },
    editRow(row) {
      this.addOrg = true
      row.addChild = false
      this.row = row
      this.dialogFormData = deepClone(row)
    },
    addChild(row) {
      this.addOrg = true
      row.addChild = true
      this.row = row
      this.dialogFormData = deepClone(row)
    },
    deleteAPI(row) {
      deleteOrg(row.id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getPageData()
        const { parentId } = row
        const { tree, treeNode, resolve } = this.maps.get(parentId)
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, parentId, [])
        this.load(tree, treeNode, resolve)
      })
    },
    deleteRow(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAPI(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import "../index.scss";
</style>
