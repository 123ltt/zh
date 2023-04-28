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
              label="应用名称"
              prop="appName"
              size="small"
            >
              <el-input
                v-model="form.appName"
                clearable
                placeholder="请输入要查询的应用名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="onSearch('form')"
              >搜 索</el-button>
              <el-button
                size="small"
                @click="$refs.form.resetFields();form={};onSearch()"
              >清 空</el-button>
              <el-button
                v-if="permission.opms_app_add"
                type="primary"
                size="small"
                @click="dialogVisible = true,dialogTitle = '添 加'"
              >添 加</el-button>
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
          prop="appName"
          label="应用名称"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="row.appName && row.appName.length > 10"
              :content="row.appName"
              popper-class="tip-text"
              placement="top"
            >
              <div class="txt-over-ell-one">{{ row.appName }}</div>
            </el-tooltip>
            <span v-else>{{ row.appName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="应用标识"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="row.code && row.code.length > 10"
              :content="row.code"
              popper-class="tip-text"
              placement="top"
            >
              <div class="txt-over-ell-one">{{ row.code }}</div>
            </el-tooltip>
            <span v-else>{{ row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="应用描述"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="row.description && row.description.length > 10"
              :content="row.description"
              popper-class="tip-text"
              placement="top"
            >
              <div class="txt-over-ell-one">{{ row.description }}</div>
            </el-tooltip>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="row.remark && row.remark.length > 10"
              :content="row.remark"
              popper-class="tip-text"
              placement="top"
            >
              <div class="txt-over-ell-one">{{ row.remark }}</div>
            </el-tooltip>
            <span v-else>{{ row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
        />
        <el-table-column
          label="操作"
          width="240"
        >
          <template slot-scope="scope">
            <el-button
              v-if="permission.opms_app_edit"
              type="text"
              size="small"
              @click="editRow(scope.row)"
            >编 辑</el-button>
            <el-button
              v-if="permission.opms_app_delete"
              type="text"
              size="small"
              @click="deleteRow(scope.row)"
            >删 除</el-button>
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
          label-width="100px"
        >
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form-item
                label="应用名称"
                prop="appName"
                size="small"
              >
                <el-input
                  v-model="dialogForm.appName"
                  :disabled="Boolean(dialogTitle === '编辑')"
                  maxlength="30"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form-item
                label="应用标识"
                prop="code"
                size="small"
              >
                <el-input
                  v-model="dialogForm.code"
                  :disabled="Boolean(dialogTitle === '编辑')"
                  maxlength="30"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form-item
                label="应用描述"
                prop="description"
                size="small"
              >
                <el-input
                  v-model="dialogForm.description"
                  :rows="3"
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  style="width:100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form-item
                label="备注"
                prop="remark"
                size="small"
              >
                <el-input
                  v-model="dialogForm.remark"
                  :rows="3"
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                  style="width:100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="padding-bottom: 20px;text-align: right">
            <el-button
              size="medium"
              @click="dialogVisible = false"
            >取 消</el-button>
            <el-button
              :disabled="dialogTitle == '编辑' ? submitBtnEnable : false"
              size="medium"
              type="primary"
              @click="submitDialog('dialogForm')"
            >保 存</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAppList, updateApp, addApp, removeApp } from '@/api/application'
import { deepClone } from '@/util/util'
export default {
  name: 'PermissApplication',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      hirerList: [],
      total: 0,
      tableData: [],
      form: {
        current: 1,
        size: 10
      },
      levelsList: [],
      positionsList: [],
      dialogForm: {},
      rules: {
        appName: [{ required: true, message: '应用名不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '应用标识不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '应用描述不能为空', trigger: 'blur' }]
      },
      row: {},
      // 用于提交时判断是否修改
      oldDialogForm: null
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldDialogForm) === JSON.stringify(this.dialogForm))
    },
    ...mapGetters(['permission'])
  },
  created() {
    this.getPageData()
  },
  methods: {
    onSearch() {
      this.form.current = 1
      this.getPageData()
    },
    editRow(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.dialogForm = deepClone(row)
      this.oldDialogForm = deepClone(this.dialogForm)
    },
    deleteAPI(id) {
      removeApp(id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getPageData()
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
    // 分页相关
    handleSizeChange(val) {
      this.form.size = val
      this.getPageData()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.getPageData()
    },
    // modal
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogTitle === '编辑' ? this.editApi(this.dialogForm) : this.verifyApp(this.dialogForm.appName, this.dialogForm.code)
        }
      })
    },
    verifyApp(name, code) {
      this.addApi(this.dialogForm)
      // const param = {
      //   appName: name,
      //   code: code
      // }
      // verifyApp(param).then(res => {
      //   if (res.code === 200) {
      //     this.addApi(this.dialogForm)
      //   }
      // })
    },
    editApi(param) {
      const params = {
        id: param.id,
        appName: param.appName,
        code: param.code,
        description: param.description,
        remark: param.remark
      }
      updateApp(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.dialogVisible = false
          this.getPageData()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    addApi(param) {
      addApp(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.dialogVisible = false
          this.getPageData()
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogForm = {} // 清空模态框数据
      this.$refs.dialogForm.resetFields() // 清空校验
    },
    getPageData() {
      this.loading = true
      getAppList(this.form).then(res => {
        const { records, total } = res.data
        this.tableData = records
        this.total = total
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
.tip-text {
  max-width: 200px;
  line-height: 20px;
}
</style>
