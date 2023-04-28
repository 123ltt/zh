<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    top="70px"
    custom-class="my-dialog"
    width="520px"
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
        <el-col :span="3" />
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
        <el-col :span="3" />
        <el-col :span="14">
          <el-form-item
            label="上级机构"
            prop="parentId"
          >
            <!-- <avue-input-tree
              ref="tree"
              v-model="dialogForm.parentId"
              :dic="organizationTree"
              :disabled="dialogForm.addChild || dialogForm.parentId == '0'"
              :placeholder="dialogForm.parentId == '0' || dialogForm.category === '1' ? '无上级机构' : '请选择上级机构'"
              style="width: 100%"
              default-expand-all
              type="tree"
              @change="selectedOrg"
            /> -->
            <InputTree v-if="organizationTree.length"
                       v-model="dialogForm.parentId"
                       class="w-100 lh32"
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
        <el-col :span="3" />
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
        <el-col :span="3" />
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
        <el-col :span="3" />
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
        <el-col :span="3" />
        <el-col :span="14">
          <el-form-item
            ref="image"
            label="机构LOGO"
            prop="logo"
          >
            <el-upload
              ref="upload"
              :accept="acceptImgType"
              :auto-upload="false"
              :headers="headers"
              :show-file-list="false"
              :on-change="handleChange"
              :before-upload="beforeAvatarUpload"
              :class="img ? 'avatar-uploader avatar-img' : 'avatar-uploader'"
              name="logo"
              action="#"
              list-type="picture-card"
            >
              <img v-if="img" :src="img" class="logo-img">
              <i v-else class="el-icon-plus" />
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
        <el-col :span="3" />
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
import { getOrgTree, submitOrg, getManagerList } from '@/api/organization'
import { getToken } from '@/util/auth'
import { deepClone } from '@/util/util'
import { getChidlren } from '@/util/permiss'
import { mapGetters } from 'vuex'

export default {
  name: 'EditOrg',
  // eslint-disable-next-line
  components: { InputTree },
  props: ['isShow', 'row', 'type', 'allCategories'],
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
      dialogTitle: '',
      dialogVisible: this.isShow,
      dialogForm: {
        sort: 1
      },
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
      oldDialogForm: null
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
    // this.getManagerList()
    const { addChild, id, category, logo } = this.row
    if (JSON.stringify(this.row) === '{}') {
      this.isAdd = true
      this.dialogTitle = '添加组织机构'
      this.orgTree()
      this.dialogForm.parentId = -1
    } else if (addChild) {
      this.dialogTitle = '添加子项'
      this.isChild = true
      this.selectTenant()
      this.dialogForm = Object.assign(this.row, {
        parentId: id,
        orgName: '',
        prefixNo: '',
        sort: 1,
        manager: '',
        managerId: '',
        remark: ''
      })
    } else {
      this.dialogTitle = '编辑组织机构'
      this.isEdit = true
      this.selectTenant()
      this.img = logo
      this.dialogForm = Object.assign(this.row, {
        category: category.toString()
      })
    }
    this.oldDialogForm = deepClone(this.dialogForm)
  },
  methods: {
    handleClose() {
      this.$emit('closeView', true)
    },

    /**
    * @description: base64位图片转码文件流
    * @param {type}
    */
    base64toFile(dataurl, filename = 'logo') {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
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
      this.managerList.forEach(item => {
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
          this.$set(this.dialogForm, 'parentName', item.label)
        } else {
          this.$set(this.dialogForm, 'category', '1')
        }
      }
    },
    handleChange(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      const imgType = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp']
      if (!imgType.includes(file.raw.type)) {
        return this.$message.error('请上传 JPG/JPEG/PNG/BMP 格式Logo图片!')
      }
      if (!isLt2M) {
        return this.$message.error('上传Logo图片大小不能超过1MB!')
      }
      this.img = URL.createObjectURL(file.raw) // 图片回显
      this.dialogForm.logo = file.raw
      // 上传logo后，清除校验
      this.rules.logo = []
      this.$refs.image.clearValidate()
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
          const { logo, category } = this.dialogForm
          if (typeof logo === 'string') { // 如果是base64格式图片，转为文件类型
            this.dialogForm.logo = this.base64toFile(logo)
          }
          if (this.dialogForm.addChild) { // 添加子级
            delete this.dialogForm.id
          }
          if (Number(category) === 3) { // 添加部门，去掉logo参数
            delete this.dialogForm.logo
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
      this.dialogForm.sort = Number(value.replace(/[^1-9]/g, ''))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../index.scss";
::v-deep .el-input__inner{
  height:32px;
  line-height:32px;
}
.lh32{
  height:32px !important;
  line-height:32px !important;
}
::v-deep .zh-input .input-box[data-v-c826da9a]{
  height:30px !important;
  line-height:32px !important;
}
</style>
