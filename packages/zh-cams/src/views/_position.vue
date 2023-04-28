<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-size="20">
      <template slot="header">
        <el-form
          ref="form"
          :model="form"
          size="small"
          label-width="80px"
          class="no-message"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item
                label="职位"
                prop="positionName"
              >
                <!-- <el-select
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
                </el-select> -->
                <el-input v-model="form.positionName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <!-- <el-col v-if="isAdmin" :span="6">
            <el-form-item label="租户" prop="tenantId">
              <el-select
                v-model="form.tenantId"
                clearable
                style="width:100%;"
                size="small"
              >
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
                  size="small"
                  @click="onSearch('form')"
                >搜 索</el-button>
                <el-button
                  size="small"
                  @click="resetForm('form')"
                >清 空</el-button>
                <el-button
                  v-if="permission.position_add"
                  type="primary"
                  size="small"
                  @click="dialogVisible = true,dialogTitle = '添 加',dialogForm.tenantId = userInfo.tenant_id"
                >添 加</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="index" label="序号" type="index" width="50" :index="setIndex" />
      <el-table-column slot="handler" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            v-if="permission.position_edit"
            type="text"
            size="small"
            @click="editRow(scope.row)"
          >编 辑</el-button>
          <el-button
            v-if="permission.position_delete"
            type="text"
            size="small"
            @click="deleteRow(scope.row)"
          >删 除</el-button>
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
        size="small"
        label-width="100px"
      >
        <!-- <el-row v-if="isAdmin" :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属租户" prop="tenantId" size="small">
                <el-select
                  v-model="dialogForm.tenantId"
                  :disabled="dialogTitle === '编辑'"
                  clearable
                  style="width:100%;"
                  size="small"
                >
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
              label="职位"
              prop="positionName"
            >
              <el-input
                v-model="dialogForm.positionName"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="23">
            <el-form-item
              label="职位描述"
              prop="positionDescription"
            >
              <el-input
                v-model="dialogForm.positionDescription"
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
          >取消</el-button>
          <el-button
            :disabled="dialogTitle == '编辑' ? submitBtnEnable : false"
            size="small"
            type="primary"
            @click="submitDialog('dialogForm')"
          >保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getPositionData, getPositionList, deletePosition, addPosition, updatePosition } from '@/api/position'
import { deepClone } from '@/util/util'
import { mapGetters } from 'vuex'

export default {
  name: 'PermissPosition',
  data() {
    return {
      headers: [
        { slot: true, slotName: 'index' },
        { label: '职位', prop: 'positionName' },
        { label: '职位描述', prop: 'positionDescription' },
        { slot: true, slotName: 'handler' }
      ],
      dialogVisible: false,
      dialogTitle: '',
      form: {},
      levelsList: [],
      positionsList: [],
      dialogForm: {},
      rules: {
        // tenantId: [{ required: true, message: '请选择租户', trigger: 'change' }],
        positionName: [{ required: true, message: '请选择职位', trigger: 'change' }]
      },
      row: {},
      // 用于提交时判断是否修改
      oldDialogForm: null,
      page: {
        current: 1,
        size: 10
      }
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
      // 从岗位跳转而来，刷新职位列表
      if (from.name === 'PermissPost') {
        this.onSearch()
        this.getPositionData()
      }
    }
  },
  created() {

  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getPositionData()
  },
  methods: {
    setIndex(val) {
      if (this.page.current === 1) return val + 1
      else return this.page.current * this.page.size + val - this.page.size + 1
    },
    fetch({ current, size }, params) {
      return getPositionList({ current, size, ...params }).then(res => {
        this.$set(this.page, 'current', res.data.current)
        this.$set(this.page, 'size', res.data.size)
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    onSearch() {
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.onSearch()
    },
    editRow(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.dialogForm = deepClone(row)
      this.oldDialogForm = deepClone(this.dialogForm)
    },
    deleteAPI(id) {
      const params = id
      deletePosition(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.onSearch()
        this.getPositionData()
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
          const param = {
            id: this.dialogForm.id,
            // tenantId: this.dialogForm.tenantId,
            positionName: this.dialogForm.positionName,
            positionDescription: this.dialogForm.positionDescription
          }
          this.dialogTitle === '编辑' ? this.editApi(param) : this.addApi(param)
        } else {
          return false
        }
      })
    },
    editApi(param) {
      updatePosition(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.dialogVisible = false
          this.onSearch()
          this.getPositionData()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    addApi(param) {
      addPosition(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.dialogVisible = false
          this.onSearch()
          this.getPositionData()
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogForm = {} // 清空模态框数据
      this.$refs.dialogForm.resetFields() // 清空校验
    },
    getPositionData() {
      getPositionData().then(res => {
        const { code, data } = res
        if (code === 200) this.positionsList = data
      })
    }
  }
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
