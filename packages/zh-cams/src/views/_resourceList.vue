<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-size="20">
      <template slot="header">
        <!-- <div class="myTable"> -->
        <el-form
          ref="form"
          :model="form"
          size="small"
          label-width="100px"
          class="no-message"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item
                label="权限资源名称"
                prop="resName"
              >
                <el-input
                  v-model="form.resName"
                  placeholder="权限资源名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="应用名称"
                prop="appId"
              >
                <el-select
                  v-model="form.appId"
                  clearable
                  style="width:100%;"
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
            </el-col>
            <el-col :span="6">
              <el-form-item label="URL" prop="url">
                <el-input v-model="form.url" placeholder="URL" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col
              :span="6"
              prop="enable"
            >
              <el-form-item label="状态">
                <el-radio-group v-model="form.enable">
                  <el-radio label="1">开启</el-radio>
                  <el-radio label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button
                  type="primary"

                  @click="onSearch('form')"
                >搜 索</el-button>
                <el-button @click="resetForm('form')">清 空</el-button>
                <el-button
                  v-if="permission.resource_add"
                  type="primary"

                  @click="dialogVisible = true,dialogTitle = '添 加'"
                >添 加
                </el-button>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              style="text-align: right"
            >
              <el-form-item>
                <el-button
                  v-if="permission.resource_log"
                  type="primary"

                  @click="showLog"
                >查看日志</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="index" label="序号" type="index" width="50" :index="setIndex" />
      <el-table-column slot="status" label="状态" width="120">
        <template v-slot="{row}">
          <div v-if="row.enable">启用</div>
          <div v-else>禁用</div>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="240">
        <template slot-scope="scope">
          <el-switch
            v-if="permission.resource_enable"
            v-model="scope.row.enable"
            :active-value="1"
            :inactive-value="0"
            style="margin-right: 10px"
            @change="onChangeStaus(scope.row)"
          />
          <el-button
            v-if="permission.resource_edit"
            type="text"

            @click="editRow(scope.row)"
          >编 辑</el-button>
          <el-button
            v-if="permission.resource_delete"
            type="text"

            @click="deleteRow(scope.row)"
          >删 除</el-button>
        </template>
      </el-table-column>
      <!-- <el-table
          v-loading="loading"
          :data="tableData"
          :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
          border
          height="calc(100vh - 315px)"

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
          />
          <el-table-column
            prop="resName"
            label="权限资源名称"
            width="180"
          />
          <el-table-column
            prop="remark"
            label="描述"
          />
          <el-table-column
            prop="url"
            label="URL"
          />
          <el-table-column
            prop="enable"
            label="状态"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.enable">启用</div>
              <div v-else>禁用</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="240"
          >
            <template slot-scope="scope">
              <el-switch
                v-if="permission.resource_enable"
                v-model="scope.row.enable"
                :active-value="1"
                :inactive-value="0"
                style="margin-right: 10px"
                @change="onChangeStaus(scope.row)"
              />
              <el-button
                v-if="permission.resource_edit"
                type="text"

                @click="editRow(scope.row)"
              >编 辑</el-button>
              <el-button
                v-if="permission.resource_delete"
                type="text"

                @click="deleteRow(scope.row)"
              >删 除</el-button>
            </template>
          </el-table-column>
        </el-table> -->
      <!-- <el-pagination
          :current-page="form.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.size"
          :total="total"
          style="text-align: right; padding-top: 18px"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
      <!-- </div> -->
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
        label-width="110px"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="权限资源名称"
              prop="resName"
            >
              <el-input
                v-model="dialogForm.resName"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="URL"
              prop="url"
            >
              <el-input
                v-model="dialogForm.url"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="所属应用"
              prop="appId"
            >
              <el-select
                v-model="dialogForm.appId"
                style="width:100%;"
                popper-class="select-style-modal"
              >
                <el-option
                  v-for="item in appList"
                  :key="item.id"
                  :label="item.appName"
                  :value="String(item.id)"
                  :title="item.appName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="状态"
              prop="enable"
            >
              <el-radio-group v-model="dialogForm.enable">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="描述"
              prop="remark"
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
            :disabled="dialogTitle == '编 辑' ? submitBtnEnable : false"
            size="medium"
            type="primary"
            @click="submitDialog('dialogForm')"
          >保 存
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getResourceList, addResource, deleteResource, editResource } from '@/api/resource'
import { debounce, deepClone } from '@/util/util'
import Log from './components/logResource.vue'
import { getAppList } from '@/api/application'
import { mapGetters } from 'vuex'

export default {
  name: 'PermissResourceManageResourceList',
  data() {
    const validateURL = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)) {
          callback(new Error('url不可以输入中文'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入url'))
      }
    }
    return {
      form: {
        // current: 1,
        // size: 10
      },
      dialogForm: {
        // 状态初始化
        enable: '1'
      },
      total: 0,
      tableData: [],
      appList: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '',
      rules: {
        resName: [{ required: true, message: '请输入权限资源名称', trigger: 'blur' }],
        url: [{ required: true, validator: validateURL }],
        appId: [{ required: true, message: '请选择所属应用', trigger: 'change' }],
        enable: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      // 用于提交时判断是否修改
      oldDialogForm: null,
      headers: [
        { slot: true, slotName: 'index' },
        { label: '应用名称', prop: 'appName' },
        { label: '权限资源名称', prop: 'resName' },
        { label: '描述', prop: 'remark' },
        { label: 'URL', prop: 'url' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'handler' }
      ],
      page: {
        current: 1,
        size: 10
      }
    }
  },
  computed: {
    ...mapGetters(['permission']),
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldDialogForm) === JSON.stringify(this.dialogForm))
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getAppData()
    })
  },
  mounted() {
    this.getPageData()
  },
  methods: {
    // 序号
    setIndex(val) {
      if (this.page.current === 1) return val + 1
      else return this.page.current * this.page.size + val - this.page.size + 1
    },
    getAppData() {
      getAppList({ current: 1, size: 9999 }).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.appList = data
        }
      })
    },
    // 分页刷新
    getPageData() {
      this.$refs.table.load(1, this.form)
    },
    fetch({ current, size }, params) {
      return getResourceList({ current, size, ...params }).then(res => {
        this.$set(this.page, 'current', res.data.current)
        this.$set(this.page, 'size', res.data.size)
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    // 分页相关
    // handleSizeChange(val) {
    //   this.form.size = val
    //   this.getPageData()
    // },
    // handleCurrentChange(val) {
    //   this.form.current = val
    //   this.getPageData()
    // },
    onSearch() {
      // this.form.current = 1
      this.getPageData()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      // this.form.current = 1
      this.getPageData()
    },
    // getPageData() {
    //   this.loading = true
    //   getResourceList(this.form).then(res => {
    //     const { records, total } = res.data
    //     this.tableData = records
    //     this.total = total
    //     this.tableData.forEach(item => {
    //       item.enable = Math.abs(item.enable)
    //     })
    //   }).finally(() => {
    //     this.loading = false
    //   })
    // },
    onChangeStaus: debounce(function(row) {
      editResource(row).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.dialogVisible = false
        this.getPageData()
      }, error => {
        console.log(error)
      })
    }, 500),
    editRow(row) {
      this.dialogVisible = true
      this.dialogTitle = '编 辑'
      this.dialogForm = deepClone(row)
      this.dialogForm.enable = `${this.dialogForm.enable}`
      this.oldDialogForm = deepClone(this.dialogForm)
    },
    deleteAPI(id) {
      const params = id
      deleteResource(params).then(res => {
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
    handleClose() {
      this.dialogVisible = false
      // this.dialogForm = {} // 清空模态框数据
      this.$refs.dialogForm.resetFields() // 清空校验
      // 状态初始化
      this.dialogForm = {
        enable: '1'
      }
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添 加') this.addApi(this.dialogForm)
          else this.onChangeStaus(this.dialogForm)
        } else {
          return false
        }
      })
    },
    addApi(param) {
      addResource(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: `${this.dialogTitle.replace(' ', '')}成功!`
          })
          this.dialogVisible = false
          this.getPageData()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 查看日志
    showLog() {
      this.$modal({
        title: '日志列表',
        component: Log,
        width: '1000px',
        data: {
          //
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
