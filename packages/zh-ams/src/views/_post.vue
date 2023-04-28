<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-size="20">
      <template slot="header">
        <el-form
          ref="form"
          :model="form"
          size="mini"
          label-width="70px"
          class="no-message"
        >
          <el-row :gutter="10">
            <el-col :span="4">
              <el-form-item
                label="岗位名称"
                prop="fuzzyPostName"
              >
                <el-input
                  v-model="form.fuzzyPostName"
                  placeholder="岗位名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="岗位类型"
                prop="postCategory"
              >
                <el-select
                  v-model="form.postCategory"
                  filterable
                  clearable
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in postType"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="职位"
                prop="positionId"
              >
                <el-select
                  v-model="form.positionId"
                  filterable
                  clearable
                  placeholder="请选择"
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in positionsList"
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="职级"
                prop="postGrade"
              >
                <el-select
                  v-model="form.postGrade"
                  clearable
                  filterable
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in levelsList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
                  v-if="permission.post_add"
                  type="primary"
                  size="mini"
                  @click="addRow"
                >添 加</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            v-if="permission.post_view"
            type="text"
            size="small"
            @click="lookRow(scope.row, scope.$index)"
          >查 看</el-button>
          <el-button
            v-if="permission.post_edit"
            type="text"
            size="small"
            @click="editRow(scope.row)"
          >编 辑</el-button>
          <el-button
            v-if="permission.post_delete"
            type="text"
            size="small"
            @click="deleteRow(scope.row)"
          >删 除</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="postCategoryName" label="岗位类型">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.postCategoryName }}</el-tag>
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
      custom-class="my-dialog"
      @close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="rules"
        size="mini"
        label-width="90px"
      >
        <el-row :gutter="20">
          <!-- <el-col v-if="isAdmin" :span="12">
              <el-form-item label="所属租户" prop="tenantId" size="small">
                <el-select v-model="dialogForm.tenantId" :disabled="dialogTitle === '编辑'" clearable style="width:100%;" size="small" @change="getTenantId">
                  <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col> -->
          <el-col :span="12">
            <el-form-item
              label="职级"
              prop="postGradeName"
            >
              <el-select
                v-model="dialogForm.postGradeName"
                filterable
                clearable
                style="width:100%;"
              >
                <el-option
                  v-for="item in levelsList"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="岗位类型"
              prop="postCategoryName"
            >
              <el-select
                v-model="dialogForm.postCategoryName"
                filterable
                clearable
                style="width:100%;"
              >
                <el-option
                  v-for="item in postType"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="岗位名称"
              prop="postName"
            >
              <el-input
                v-model="dialogForm.postName"
                clearable
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="职位"
              prop="positionName"
            >
              <el-select
                v-model="dialogForm.positionName"
                filterable
                clearable
                style="width:100%;"
              >
                <el-option
                  v-for="item in positionsByTenant"
                  :key="item.id"
                  :label="item.positionName"
                  :value="item.positionName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="岗位描述"
              prop="postDescription"
            >
              <el-input
                v-model="dialogForm.postDescription"
                :rows="3"
                type="textarea"
                style="width:100%;"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="padding-bottom: 20px;text-align: right">
          <el-button
            size="small"
            @click="dialogVisible = false"
          >取 消</el-button>
          <el-button
            :disabled="dialogTitle == '编辑' ? submitBtnEnable : false"
            size="small"
            type="primary"
            @click="submitDialog('dialogForm')"
          >保 存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--模态框（查看）-->
    <el-dialog
      :visible.sync="dialogLook"
      :append-to-body="true"
      title="查看"
      top="100px"
      custom-class="my-dialog"
    >
      <el-form label-width="100px">
        <el-row :gutter="20">
          <!-- <el-col v-if="isAdmin" :span="12">
              <el-form-item label="所属租户：" size="small">
                <span class="value-color">{{ row.tenantName }</span>
              </el-form-item>
            </el-col> -->
          <el-col :span="12">
            <el-form-item
              label="职级"
              size="small"
              required
            >
              <span class="value-color">{{ row.postGradeName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="岗位类型"
              size="small"
              required
            >
              <span class="value-color">{{ row.postCategoryName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="岗位名称"
              size="small"
              required
            >
              <span class="value-color">{{ row.postName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="职位名称"
              size="small"
              required
            >
              <span class="value-color">{{ row.positionName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="岗位描述"
              size="small"
            >
              <span class="value-color">{{ row.postDescription }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </basic-container>
</template>

<script>
import { getPostData, deletePost, addPost, updatePost } from '@/api/post'
import { getPositionData } from '@/api/position'
import { getDictParentList, getDictChildList } from '@/api/dict'
import { deepClone } from '@/util/util'
import { getTenantList } from '@/api/organization'
import { mapGetters } from 'vuex'

export default {
  name: 'PermissPost',
  data() {
    return {
      headers: [
        { slot: true, slotName: 'index' },
        { label: '岗位名称', prop: 'postName' },
        { slot: true, slotName: 'postCategoryName' },
        { label: '职位', prop: 'positionName' },
        { label: '职级', prop: 'postGradeName' },
        { slot: true, slotName: 'handler' }
      ],
      dialogVisible: false,
      dialogLook: false,
      dialogTitle: '',
      postType: [],
      tenantList: [],
      total: 0,
      form: {},
      levelsList: [],
      positionsList: [],
      positionsByTenant: [],
      postCategory: [],
      postGrade: [],
      dialogForm: {},
      rules: {
        tenantId: [{ required: true, message: '请选择租户', trigger: 'change' }],
        postGradeName: [{ required: true, message: '请选择职级', trigger: 'change' }],
        postCategoryName: [{ required: true, message: '请选择岗位类型', trigger: 'change' }],
        postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
        positionName: [{ required: true, message: '请选择职位', trigger: 'change' }]
      },
      row: {},
      // 用于提交时判断是否修改
      oldDialogForm: null
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
  watch: {
    $route(to, from) {
      // 从职位跳转而来，刷新职位列表
      if (from.name === 'PermissPosition') {
        this.getPositionData()
      }
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  created() {
    this.getPositionData() // 职位列表
    this.getPostType('post_category', true)
    this.getPostType('post_grade')
  },
  methods: {
    fetch({ current, size }, params) {
      return getPostData({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    // 获取租户列表
    loadList() {
      return getTenantList().then(res => res.data.records)
    },
    onSearch() {
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.onSearch()
    },
    addRow() {
      this.dialogVisible = true
      this.dialogTitle = '添 加'
      this.dialogForm.tenantId = this.userInfo.tenant_id
      this.getPositionData(this.dialogForm.tenantId)
    },
    lookRow(row, index) {
      this.dialogLook = true
      this.row = row
    },
    editRow(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.dialogForm = deepClone(row)
      this.getPositionData(this.dialogForm.tenantId)
      this.oldDialogForm = deepClone(this.dialogForm)
    },
    deleteAPI(id) {
      const params = id
      deletePost(params).then(res => {
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
    // modal
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const postGrade = this.levelsList.length ? this.levelsList.find(item => item.dictValue === this.dialogForm.postGradeName).dictKey : ''
          const postCategory = this.postType.length ? this.postType.find(item => item.dictValue === this.dialogForm.postCategoryName).dictKey : ''
          const positionId = this.positionsByTenant.length ? this.positionsByTenant.find(item => item.positionName === this.dialogForm.positionName).id : ''
          const param = {
            id: this.dialogForm.id,
            postName: this.dialogForm.postName,
            postCategory: postCategory,
            postGrade: postGrade,
            postGradeName: this.dialogForm.postGradeName,
            positionId: positionId,
            positionName: this.dialogForm.positionName,
            postDescription: this.dialogForm.postDescription,
            postCategoryName: this.dialogForm.postCategoryName
          }
          this.dialogTitle === '编辑' ? this.editApi(param) : this.addApi(param)
        } else {
          return false
        }
      })
    },
    editApi(param) {
      updatePost(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.dialogVisible = false
          this.onSearch()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    addApi(param) {
      addPost(param).then(res => {
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
    handleClose() {
      this.dialogVisible = false
      this.dialogForm = {} // 清空模态框数据
      this.$refs.dialogForm.resetFields() // 清空校验
    },
    getPostType(code, flag) {
      const params = {
        code: code,
        appCode: 'ams',
        tenantId: this.userInfo.tenant_id
      }
      getDictParentList(params).then(res => {
        const data = res.data.records
        if (data.length) {
          const { id } = data[0]
          this.getDictChildList(id, flag)
        }
      })
    },
    getDictChildList(id, flag) {
      getDictChildList({ parentId: id }).then(res => {
        if (flag) {
          this.postType = res.data
        } else {
          this.levelsList = res.data
        }
      })
    },
    getPositionData(tenantId) {
      const params = {
        tenantId: tenantId
      }
      getPositionData(params).then(res => {
        const { code, data } = res
        if (code === 200) {
          tenantId ? this.positionsByTenant = data : this.positionsList = data
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
