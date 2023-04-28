<template>
  <el-form
    ref="dialogForm"
    v-loading="loading"
    :model="form"
    :rules="rules"
    size="small"
    label-width="110px"
  >
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="avue-group__header">
            <!-- <i class="el-icon-user-solid avue-group__icon" /> -->
            <h1 class="avue-group__title">基础信息</h1>
          </div>
        </template>
        <el-row>
          <el-col :span="11">
            <el-form-item label="登录账号" prop="account">
              <el-input
                v-model="form.account"
                placeholder="请输入登录账号"
                maxlength="20"
                show-word-limit
                :disabled="current ? true : false"
                @input="form.account=form.account.replace(/[\u4E00-\u9FA5]/g,'')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户姓名" maxlength="10" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户生日" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期时间"
                class="w-100"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="current" :span="11">
            <el-form-item label="工号" prop="jobNumber" :rules="currentIsAdmin ? []: [{ required: true, message: '工号不能为空', trigger: 'blur' }]">
              <el-input
                v-model="form.jobNumber"
                placeholder="请输入工号"
                maxlength="10"
                show-word-limit
                @input="form.jobNumber=form.jobNumber.replace(/[\u4E00-\u9FA5]/g,'')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="!current" :span="11">
            <el-form-item label="登录密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                auto-complete="new-password"
                show-password
                placeholder="请输入登录密码"
                maxlength="20"
                show-word-limit
                @input="form.password=form.password.replace(/[\u4E00-\u9FA5]/g,'')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户状态" prop="status" class="h51">
              <el-radio v-model="form.status" label="1">启用</el-radio>
              <el-radio v-model="form.status" label="0">禁用</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户性别" prop="sex" class="h51">
              <el-radio v-model="form.sex" label="1">男</el-radio>
              <el-radio v-model="form.sex" label="2">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11" />
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="avue-group__header">
            <!-- <i class="el-icon-s-order avue-group__icon" /> -->
            <h1 class="avue-group__title">职责信息</h1>
          </div>
        </template>
        <el-row v-for="(item, index) in form.userDuties" :key="index" class="m-b-20">
          <el-col :span="19">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :ref="index+'organizationId'"
                  :label="item.type == 1 ? '所属公司' : '关联公司'"
                  :prop="'userDuties.' + index +'.organizationId'"
                  :rules="item.type == 1 ? [{ required: true, message: '请选择所属公司', trigger: 'blur' }] : [{ required: true, message: '请选择关联公司', trigger: 'blur' }]"
                >
                  <el-select
                    v-model="item.organizationId"
                    :placeholder="item.type == 1 ? '所属公司' : '关联公司'"
                    filterable
                    @input="changeOrg_($event, index, item)"
                  >
                    <el-option
                      v-for="(org, idx) in orgSelectList"
                      :key="idx"
                      :label="org.title"
                      :value="org.id"
                      :disabled="Boolean(org.disabled)"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="item.type == 1 ? '所属部门' : '关联部门'"
                  :prop="'userDuties.' + index +'.departmentName'"
                  :rules="item.type == 1 ? [{ required: true, message: '请选择所属部门', trigger: 'blur' }] : [{ required: true, message: '请选择关联部门', trigger: 'blur' }]"
                >
                  <el-popover
                    placement="bottom"
                    width="250"
                    trigger="click"
                  >
                    <div slot="reference">
                      <el-input
                        v-model="item.departmentName"
                        :placeholder="item.type == 1 ? '所属部门' : '关联部门'"
                        clearable
                        readonly
                        @input="(val) => (!val && (item.departmentId = ''))"
                      />
                    </div>
                    <div style="max-height:200px;overflow: scroll">
                      <el-tree
                        ref="tree"
                        :data="item.children"
                        :props="{ children: 'children', label: 'title' }"
                        :check-on-click-node="true"
                        :expand-on-click-node="false"
                        node-key="id"
                        highlight-current
                        class="filter-tree"
                        @current-change="(node, obj) => parentChange(node, item, index)"
                      />
                    </div>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="item.type == 1 ? '所属岗位' : '关联岗位'"
                  :prop="'userDuties.' + index +'.postId'"
                  :rules="item.type == 1 ? [{ required: true, message: '请选择所属岗位', trigger: 'blur' }] : [{ required: true, message: '请选择关联岗位', trigger: 'blur' }]"
                >
                  <el-select
                    v-model="item.postId"
                    :placeholder="item.type == 1 ? '所属岗位' : '关联岗位'"
                    filterable
                    @change="changePost($event, index)"
                  >
                    <el-option
                      v-for="post in postList"
                      :key="post.id"
                      :label="post.postName"
                      :value="post.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="item.type == 1 ? '所属职位' : '关联职位'"
                  :prop="'userDuties.' + index +'.positionName'"
                  :rules="item.type == 1 ? [{ required: true, message: '请选择所属职位', trigger: 'blur' }] : [{ required: true, message: '请选择关联职位', trigger: 'blur' }]"
                >
                  <el-input v-model="item.positionName" :placeholder="item.type == 1 ? '所属职位' : '关联职位'" readonly />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <!-- 职责信息右侧按钮 -->
          <el-col :span="5">
            <el-row>
              <el-col class="p-l-20">
                <el-checkbox v-model="form.userDuties[index].isDepPrincipal" @change="(value) => chageIsDepPrincipal(value, index)"><span style="font-size: 12px">设置为机构负责人</span></el-checkbox>
              </el-col>
              <el-col v-if="index !== 0 && index < form.userDuties.length" class="p-l-20">
                <el-button circle icon="el-icon-delete" title="点击删除" @click="removeDuties(item, index)" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div v-if="orgList.length && orgList[0].category === '1'" class="push-btn m-b-20">
          <el-button size="small" type="primary" @click="addUserDuties">继续添加</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div style="padding-bottom: 20px;text-align: right;margin-top: 20px">
      <span class="el-button el-button--default el-button--small" @click="$parent.$emit('close')">
        <span>取消</span>
      </span>
      <el-button :disabled="current ? submitBtnEnable : false" size="small" type="primary" @click="submitDialog('dialogForm')">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { isvalidatemobile, validateEmail } from '@/util/validate'
import { createUser, updateUser, getUserDetail } from '@/api/userManange.js'
import { deepClone } from '@/util/util'
export default {
  name: 'AddUserModal',
  // eslint-disable-next-line
  props: ['current', 'isAdmin','asyncLoading'],
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]))
      } else {
        callback()
      }
    }
    const validateEmail_ = (rule, value, callback) => {
      if (value) {
        if (validateEmail(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱'))
        }
      } else {
        callback()
      }
    }
    return {
      loading: !this.asyncLoading.flag,
      // 公司列表
      orgChangeList: [],
      orgSelectList: [],
      // 部门列表
      departmentList: [],
      // 岗位列表
      // postList: [],
      // 职位列表
      positionList: [],
      // 折叠面板默认展开
      activeNames: ['1', '2', '3'],
      gutter: 5,
      form: {
        // 账号
        account: '',
        // 登录密码
        password: '',
        // 用户姓名
        name: '',
        // 手机号码
        phone: '',
        // 用户生日
        birthday: '',
        // 电子邮箱
        email: '',
        // 工号
        jobNumber: '',
        // 租户
        tenantId: '',
        // 用户性别
        sex: '',
        // 用户状态
        status: '1',
        userDuties: [
          {
            organizationId: '', // 公司ID
            departmentId: '', // 部门ID
            departmentName: '', // 部门ID
            postId: '', // 岗位ID
            positionId: '', // 职位ID
            positionName: '',
            type: 1, // (1所属组织 2关联组织)
            children: [], // 所属部门列表
            isDepPrincipal: false
          }
        ]
      },
      rules: {
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '登录密码不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone }],
        tenantId: [{ required: true, message: '租户不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '用户状态不能为空', trigger: 'blur' }],
        email: [{ required: false, validator: validateEmail_ }]
      },
      // 租户列表
      // tenantList: []
      // 用于提交时判断是否修改
      oldForm: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      orgList: [],
      postList: [],
      tenantList: []
    }
  },
  computed: {
    // 当前操作用户是否为admin
    currentIsAdmin() {
      return this.current.roles.some(item => item.roleName === 'admin')
    },
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  watch: {
    'asyncLoading.flag': {
      handler(val) {
        this.loading = !val
        this.orgList = this.asyncLoading.orgList
        this.postList = this.asyncLoading.postList
        this.dealOrgList()
      },
      immediate: true
    }
  },
  created() {
    this.dealOrgList()
    // 编辑回显数据处理
    if (this.current) {
      // this.loading = true
      // 获取详情信息
      getUserDetail({ id: this.current.id }).then(res => {
        const { account, name, phone, birthday, email, jobNumber, tenantId, sex, status, id, userDuties } = res.data
        this.form = Object.assign(this.form, {
          account, name, phone, birthday, email, jobNumber, tenantId, sex: sex ? sex.toString() : '', status: status.toString(), id
        })
        this.form.userDuties = userDuties.map((item, index) => {
          const temp = {
            organizationId: item.company?.id, // 公司ID
            departmentId: item.department?.id, // 部门ID
            departmentName: item.department?.orgName, // 部门ID
            postId: item.post.id, // 岗位ID
            positionId: item.post.id, // 职位ID
            positionName: item.post.positionName,
            type: item.type, // (1所属组织 2关联组织)
            children: this.changeOrg(item.company.id),
            isDepPrincipal: item.isDepPrincipal || false
          }
          return temp
        })

        this.setCompanyEnable()
        // 没有职责信息初始化文本框
        if (this.form.userDuties.length === 0) {
          this.form.userDuties.push({
            organizationId: '',
            departmentId: '',
            departmentName: '',
            postId: '',
            positionId: '',
            positionName: '',
            type: 1,
            isDepPrincipal: false
          })
        }
        this.oldForm = deepClone(this.form)
      }).finally(() => {
        // this.loading = false
      })
    }
  },
  methods: {
    // 处理所属公司选择列表
    dealOrgList() {
      /**
     * 处理公司列表
     * 1.第一项所属公司选择集团的话，提示只有集团负责人可以挂在集团下面，并且设置为机构负责人自动勾选上
     * 2.第一项所属公司和第二项所属部门都选择一样的话，并且都选择的公司级机构，提示只有公司负责人可以挂在公司下面，并且勾选上设置为机构负责人
     * 3.所属部门的机构选择数小于等于所属公司的机构数
     * category: 1集团 2公司 3部门
    **/
      let orgChangeList = []
      let orgSelectList = []
      const orgList = deepClone(this.orgList)
      orgList.forEach(item => {
        if (Number(item.category) === 1 || Number(item.category) === 2) {
          const companyList = deepClone(item.children) || []
          const { category, id, key, parentId, title, value, children } = item
          item.children = [{ category, id, key, parentId, title, value, children }]
          companyList.forEach(company => {
            // 公司下可选公司及任意下级
            if (Number(company.category) === 2) {
              const { category, id, key, parentId, title, value, children } = company
              company.children = [{ category, id, key, parentId, title, value, children }]
            }
          })
          // 集团下只能选择集团或公司
          if (Number(item.category) === 1 && item.children && item.children.length) {
            item.children = item.children.map(org => {
              org.children.map(company => {
                delete company.children
                company.hasChildren = false
                return company
              })
              return org
            })
            const itemObj = deepClone(item)
            orgSelectList = [...orgSelectList, itemObj, ...companyList]
          }
          if (Number(item.category) === 2 && item.children && item.children.length) {
            const itemObj = deepClone(item)
            delete itemObj.children
            itemObj.hasChildren = false
            orgSelectList = [...orgSelectList, itemObj]
          }
          orgChangeList = [...orgChangeList, item, ...companyList]
        }
      })
      this.orgSelectList = orgSelectList
      this.orgChangeList = orgChangeList
    },
    // 选择所属部门列表事件
    parentChange(node, item, index) {
      item.departmentId = node.id
      item.departmentName = node.title
      this.$refs.dialogForm.validateField('userDuties.' + index + '.departmentName')

      if (item.organizationId === node.id) {
        this.form.userDuties[index].isDepPrincipal = true
        let msg = ''
        if (this.orgChangeList.findIndex(org => org.id === node.id && Number(org.category) === 1) > -1) {
          msg = '只有集团负责人可以挂在集团下面哦~'
          this.$message({
            type: 'warning',
            showClose: true,
            message: msg
          })
        }
        if (this.orgChangeList.findIndex(org => org.id === node.id && Number(org.category) === 2) > -1) {
          msg = '只有公司负责人可以挂在公司下面哦~'
          this.$message({
            type: 'warning',
            showClose: true,
            message: msg
          })
        }
      } else {
        this.form.userDuties[index].isDepPrincipal = false
      }
    },
    // 选择负责人事件
    chageIsDepPrincipal(value, index) {
      this.form.userDuties[index].isDepPrincipal = value
    },
    submitDialog() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const submitHandle = this.current ? updateUser : createUser
          if (!this.form.birthday) {
            this.form.birthday = ''
          }
          submitHandle(this.form).then((res) => {
            if (res.success) {
              this.$message.success('操作成功')
              this.$parent.$emit('close', true)
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除职责信息
    removeDuties(item, index) {
      this.form.userDuties.splice(index, 1)
      this.setCompanyEnable()
    },
    // 继续添加
    addUserDuties() {
      this.form.userDuties.push({
        organizationId: '',
        departmentId: '',
        departmentName: '',
        postId: '',
        positionId: '',
        positionName: '',
        type: 2,
        isDepPrincipal: false
      })
    },
    // 设置公司可选择状态
    setCompanyEnable() {
      const selectedCompany = this.form.userDuties.map(item => item.organizationId)
      this.orgSelectList.forEach(item => {
        item.disabled = Boolean(selectedCompany.indexOf(item.id) > -1)
      })
    },
    // 获取部门列表
    changeOrg(value) {
      let departmentList = []
      this.orgChangeList.forEach(item => {
        if (item.id === value) {
          departmentList = item.children || []
        }
      })
      this.setCompanyEnable()
      return departmentList
    },
    // 重置部门
    changeOrg_(value, index, item) {
      this.form.userDuties[index].children = this.changeOrg(value)
      this.form.userDuties[index].departmentId = ''
      this.form.userDuties[index].departmentName = ''
      this.form.userDuties[index].isDepPrincipal = false
      // 禁掉已经选择过的公司
      this.orgSelectList.forEach(item => {
        if (item.id === value) {
          item.disabled = true
        }
      })
    },
    // 获取职位列表
    changePost(value, index) {
      this.postList.forEach(item => {
        if (value === item.id) {
          this.form.userDuties[index].positionId = item.positionId
          this.form.userDuties[index].positionName = item.positionName
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-collapse {
  border-top: 0;
}
::v-deep .el-collapse-item__wrap {
  border-bottom: 0;
}
.avue-group__header {
  margin-bottom: 0;
}
::v-deep .el-collapse-item__content {
  padding-bottom: 0;
  padding-top: 20px;
}
.el-form {
  margin: 20px 10px 0 10px;
}
.push-btn {
  margin-right: 80px;
  text-align: right;
}
.m-b-20 {
  margin-bottom: 20px;
}
.p-l-20{
  padding-left: 20px;
}
.h51{
  height: 51px;
}
</style>
