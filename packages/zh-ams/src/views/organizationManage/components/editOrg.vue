<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    top="70px"
    custom-class="my-dialog"
    @close="handleClose"
  >
    <el-form
      ref="dialogForm"
      :model="dialogForm"
      :rules="rules"
      label-width="110px"
      size="mini"
    >
      <el-row
        v-if="isAdmin"
        :gutter="20"
      >
        <el-col :span="5" />
        <!-- <el-col :span="14">
          <el-form-item label="所属租户" prop="tenantId" size="small">
            <el-select v-model="dialogForm.tenantId" :disabled="isEdit ? true : false" style="width:100%;" @change="selectTenant">
              <el-option
                v-for="item in tenantList"
                :key="item.tenantId"
                :label="item.tenantName"
                :value="item.tenantId"
              />
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" />
        <el-col :span="14">
          <el-form-item
            label="机构名称"
            prop="orgName"
          >
            <el-input
              v-model="dialogForm.orgName"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" />
        <el-col :span="14">
          <el-form-item
            label="上级机构"
            prop="parentId"
          >
            <InputTree v-if="organizationTree.length"
                       v-model="dialogForm.parentId"
                       class="w-100"
                       :collapse-tags="true"
                       node-checked
                       default-expand-all
                       :disabled="dialogForm.addChild || dialogForm.parentId === '0'"
                       :data="organizationTree"
                       :placeholder="dialogForm.parentId == '0' || dialogForm.category === '1' ? '无上级机构' : '请选择上级机构'"
                       @change="selectedOrg"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="dialogForm.prefixNo || !organizationTree.length " :gutter="20">
        <el-col :span="5" />
        <el-col :span="14">
          <el-form-item
            label="工号前缀"
            prop="prefixNo"
          >
            <el-input
              v-model="dialogForm.prefixNo"
              maxlength="6"
              show-word-limit
              :disabled="isEdit ? true : false"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" />
        <el-col :span="19">
          <el-form-item
            label="机构级别"
            prop="category"
          >
            <el-radio-group
              v-model="dialogForm.category"
              :disabled="!isAdd"
            >
              <el-radio
                v-for="(item, index) in categories"
                :key="index"
                :label="item.dictKey"
                @change="handleCategory"
              >
                {{ item.dictValue }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" />
        <el-col :span="14">
          <el-form-item label="排序" prop="sort">
            <el-input v-model="dialogForm.sort" @input="changeSort" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="dialogForm.category != 3"
        :gutter="20"
      >
        <el-col :span="5" />
        <el-col :span="14">
          <el-form-item
            ref="image"
            label="机构LOGO"
            prop="logo"
          >
            <el-upload
              :accept="acceptImgType"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :class="img ? 'avatar-uploader avatar-img' : 'avatar-uploader'"
              :action="actionUrl"
              name="logo"
              list-type="picture-card"
            >
              <img
                v-if="img"
                :src="img"
                class="logo-img"
              >
              <i
                v-else
                class="el-icon-plus"
              />
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :span="5"></el-col>
        <el-col :span="14">
          <el-form-item
            label="负责人"
            prop="managerId"

          >
            <el-select
              v-model="dialogForm.managerId"
              style="width:100%;"
              filterable
              @change="selectManager"
            >
              <el-option
                v-for="item in managerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col :span="5" />
        <el-col :span="14">
          <el-form-item
            label="备注"
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
        <!-- <el-button v-if="!isEdit" size="medium" @click="resetForm('dialogForm')">重 置</el-button> -->
        <el-button
          size="small"
          @click="handleClose"
        >取消</el-button>
        <el-button
          :disabled="dialogTitle == '编辑组织机构' ? submitBtnEnable : false"
          size="small"
          type="primary"
          @click="submitDialog('dialogForm')"
        >保存</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { InputTree } from 'global-components'
import request from '@/router/axios'
import { getTenantList, getOrgTree, submitOrg, getManagerList } from '@/api/organization'
import { getToken } from '@/util/auth'
import { deepClone } from '@/util/util'
import { getChidlren } from '@/util/permiss'
import { mapGetters } from 'vuex'

export default {
  name: 'EditOrg',
  components: { InputTree },
  props: ['isShow', 'dialogForm', 'type', 'allCategories'],
  data() {
    const validateNum = (rule, value, callback) => {
      if (value) {
        if (/^[A-Z]{2,6}$/.test(value)) {
          callback()
        } else {
          callback(new Error('工号前缀为2-6位大写字母'))
        }
      } else {
        callback(new Error('请输入工号前缀'))
      }
    }
    return {
      actionUrl: request.defaults.baseURL + '/ams/orglogo/upload',
      dialogTitle: '',
      dialogVisible: this.isShow,
      category: '',
      rules: {
        tenantId: [{ required: true, message: '请选择租户', trigger: 'change' }],
        orgName: [{ required: true, message: '请输入机构名', trigger: 'blur' }],
        prefixNo: [{ required: true, validator: validateNum }],
        category: [{ required: true, message: '请选择机构级别', trigger: 'blur' }],
        logo: [{ required: true, message: '请上传机构LOGO', trigger: 'change' }]
      },
      tenantList: [],
      organizationTree: [],
      categories: [],
      isAdd: false,
      isEdit: false,
      isChild: false,
      img: '',
      acceptImgType: '.jpg,.jpeg,.png,.bmp',
      headers: {
        [this.website.tokenHeader]: getToken()
      },
      // 负责人列表
      managerList: [],
      // 用于提交时判断是否修改
      oldDialogForm: null,
      props: {
        label: 'title'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    // 是否超级管理员
    isAdmin() {
      return this.userInfo.role_name.includes('administrator')
    },
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldDialogForm) === JSON.stringify(this.dialogForm))
    }
  },
  created() {
    // this.loadList()
    // this.getManagerList()
    if (JSON.stringify(this.dialogForm) === '{}') {
      this.isAdd = true
      this.dialogTitle = '添加组织机构'
      this.dialogForm.sort = 0
      // 添加时，租户管理员获取当前租户下组织机构数据
      // if (!this.isAdmin)
      this.orgTree(this.userInfo.tenant_id)
      this.dialogForm.parentId = -1
    } else if (this.dialogForm.addChild) {
      this.dialogTitle = '添加子项'
      this.isChild = true
      this.selectTenant(this.dialogForm.tenantId)
      this.dialogForm.parentId = this.dialogForm.id
      this.dialogForm.orgName = ''
      this.dialogForm.prefixNo = ''
      this.dialogForm.sort = 0
      this.dialogForm.manager = ''
      this.dialogForm.managerId = ''
      this.dialogForm.remark = ''
    } else {
      this.dialogTitle = '编辑组织机构'
      this.isEdit = true
      this.selectTenant(this.dialogForm.tenantId)
      this.img = this.dialogForm.logoValue
      this.dialogForm.category = this.dialogForm.category.toString()
    }
    this.oldDialogForm = deepClone(this.dialogForm)
  },
  methods: {
    handleClose() {
      this.$emit('closeView', true)
    },
    // 获取租户列表
    loadList() {
      getTenantList().then((res) => {
        const { records } = res.data
        this.tenantList = records
      })
    },
    // 获取负责人列表
    getManagerList() {
      getManagerList({ size: -1, tenantId: this.userInfo.tenant_id }).then(res => {
        this.managerList = res.data.records
      })
    },
    // 选择租户
    selectTenant(val) {
      this.orgTree(this.dialogForm.tenantId)
      if (!this.isEdit) this.dialogForm.parentId = ''
    },
    // 选择负责人
    selectManager(val) {
      this.managerList.find(item => {
        if (item.id === val) {
          this.dialogForm.manager = item.name
        }
      })
    },
    // 展示组织机构树
    orgTree(id) {
      getOrgTree({ tenantId: id }).then(res => {
        this.organizationTree = res.data
        if (this.organizationTree.length) {
          if (this.isEdit) { // 编辑
            this.categories = this.allCategories
            return
          }
          // 添加组织机构逻辑
          if (this.organizationTree.some(item => item.category === '1')) { // 有集团
            if (this.organizationTree.some(item => item.hasChildren)) { // 集团下有公司，可以添加公司或部门
              this.categories = this.allCategories.slice(1)
            } else { // 集团下无公司，只能添加公司
              this.categories = this.allCategories.slice(1, 2)
            }
          } else if (this.organizationTree.some(item => item.category === '2')) { // 只有公司，无集团，只能添加部门
            this.categories = this.allCategories.slice(2)
          }
        } else { // 首次添加，只能选集团或公司
          this.categories = this.allCategories.slice(0, 2)
        }
        // 添加子级时，获取机构级别
        if (this.isChild) this.selectedOrg(this.dialogForm.parentId)
      })
    },
    // 机构级别改变
    handleCategory(val) {
      if (val === '1') { // 集团无上级机构
        this.$set(this.dialogForm, 'parentId', '')
        this.organizationTree = []
      } else {
        this.isAdmin ? this.orgTree(this.dialogForm.tenantId) : this.orgTree(this.userInfo.tenant_id)
      }
    },
    // 选择机构级别（添加/添加子项）
    selectedOrg(val) {
      if (this.organizationTree.length) {
        const item = getChidlren(this.organizationTree, val?.value || val)
        if (item) {
          // 部门下只能建部门
          Number(item.category) < 3 ? this.$set(this.dialogForm, 'category', (Number(item.category) + 1).toString()) : this.$set(this.dialogForm, 'category', '3')
          this.$set(this.dialogForm, 'parentName', item.title)
        } else {
          this.$set(this.dialogForm, 'category', '1')
        }
      }
    },
    // 上传logo
    handleAvatarSuccess(res, file) {
      // 上传logo后，清除校验
      this.rules.logo = []
      this.$refs.image.clearValidate()
      if (res.success) {
        this.dialogForm.logo = res.data
        this.img = file.url
      } else {
        this.$message({
          type: 'error',
          message: '图片上传失败!'
        })
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传Logo图片大小不能超过1MB!')
      }
      return isLt2M
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogForm.addChild) { // 添加子级
            delete this.dialogForm.id
          }
          const params = Object.assign({}, this.dialogForm)
          params.parentId = this.dialogForm.parentId.value
          this.addApi(params)
        } else {
          return false
        }
      })
    },
    addApi(param) {
      submitOrg(param).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$emit('refresh', true)
          this.handleClose()
        }
      })
    },
    // 关闭modal
    close() {
      // this.dialogForm = {}; // 清空模态框数据
      this.$refs.dialogForm.resetFields() // 清空校验
      this.$emit('close', true)
    },
    // 排序
    changeSort(value) {
      this.dialogForm.sort = Number(value.replace(/[^0-9]/g, ''))
    }
  }
}
</script>

<style lang="scss">
@import "../../index.scss";
</style>
