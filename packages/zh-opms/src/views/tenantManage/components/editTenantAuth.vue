<template>
  <el-form ref="dialogForm"
           :model="form"
           :rules="rules"
           label-width="100px"
  >
    <div class="el-form-box">
      <el-form-item label="租户ID" prop="tenantId" size="small">
        <el-select v-model="form.tenantId"
                   :disabled="Boolean(current)"
                   filterable
                   class="w300"
                   placeholder="请选择所属租户"
                   popper-class="select-style-modal"
        >
          <el-option v-for="item in tenantList"
                     :key="item.id"
                     :label="item.tenantId"
                     :value="item.tenantId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称"
                    prop="appId"
                    size="small"
                    placeholder="请选择应用名称"
      >
        <el-select v-model="form.appId"
                   :disabled="Boolean(current)"
                   filterable
                   class="w300"
        >
          <el-option v-for="item in appList"
                     :key="item.id"
                     :label="item.appName"
                     :value="String(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="current ? '延长有效期' : '有效期'"
                    prop="validityType"
                    size="small"
                    placeholder="请选择有效期"
      >
        <el-select v-model="form.validityType"
                   filterable
                   class="w300"
                   @change="changeExpireTime"
        >
          <el-option v-for="item in validityType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.expireTime" label="过期时间" size="small">
        <el-input v-model="form.expireTime" readonly class="w300" />
      </el-form-item>
      <el-form-item label="备注" size="small">
        <el-input v-model="form.remark"
                  type="textarea"
                  class="w300"
                  placeholder="请输入备注"
        />
      </el-form-item>
    </div>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
      <el-button :disabled="current ? submitBtnEnable : false"
                 size="medium"
                 type="primary"
                 @click="submitDialog('dialogForm')"
      >保 存</el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { dateFormat } from '@/util/date'
import {
  addTenantApp,
  updateTenantApp,
  getTenantList,
  getAppList
} from '@/api/tenantManagement.js'
export default {
  name: 'EditTenantAuth',
  props: {
    current: Object
  },
  data() {
    return {
      // 有效期类型
      validityType: [
        { value: 1, label: '一个月' },
        { value: 2, label: '三个月' },
        { value: 3, label: '半年' },
        { value: 4, label: '一年' },
        { value: 5, label: '三年' }
      ],
      // 租户列表
      tenantList: [],
      // 应用列表
      appList: [],
      form: {
        // 租户
        tenantId: '',
        // 应用
        // appId: '1308289683142860801',
        appId: '',
        // 有效期
        validityType: '',
        // 备注
        remark: '',
        // 过期时间
        expireTime: ''
      },
      rules: {
        tenantId: [
          { required: true, message: '所属租户不能为空', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '应用名称不能为空', trigger: 'blur' }
        ],
        validityType: [
          { required: true, message: '有效期不能为空', trigger: 'blur' }
        ]
      },
      // 用于提交时判断是否修改
      oldForm: null
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.form))
    }
  },
  created() {
    this.getTenantList()
    this.getAppList()
    // 编辑
    if (this.current) {
      const { tenantId, appId, validityType, remark, id, expireTime } = deepClone(this.current)
      const date = dateFormat(new Date(expireTime))
      this.form = Object.assign(this.form, {
        tenantId,
        appId,
        validityType,
        remark,
        id,
        expireTime: date
      })
      this.oldForm = deepClone(this.form)
    }
  },
  methods: {
    // 获取租户列表
    getTenantList() {
      getTenantList({ current: 1, size: 9999 }).then((res) => {
        this.tenantList = res.data
      })
    },
    // 获取应用列表
    getAppList() {
      getAppList({ current: 1, size: 9999 }).then((res) => {
        this.appList = res.data
      })
    },
    // 选择有效期事件
    changeExpireTime(value) {
      const start = this.current ? new Date(this.current.expireTime) : new Date()
      const end = new Date(start)
      switch (value) {
        // 一个月
        case 1:
          end.setMonth(start.getMonth() + 1)
          this.form.expireTime = dateFormat(end)
          break
        // 三个月
        case 2:
          end.setMonth(start.getMonth() + 3)
          this.form.expireTime = dateFormat(end)
          break
        // 半年
        case 3:
          end.setMonth(start.getMonth() + 6)
          this.form.expireTime = dateFormat(end)
          break
        // 一年
        case 4:
          end.setFullYear(start.getFullYear() + 1)
          this.form.expireTime = dateFormat(end)
          break
        // 三年
        case 5:
          end.setFullYear(start.getFullYear() + 3)
          this.form.expireTime = dateFormat(end)
          break
      }
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.current) {
            updateTenantApp(this.form).then((res) => {
              this.$message.success('操作成功')
              this.$parent.$emit('close', true)
            })
          } else {
            addTenantApp(this.form).then((res) => {
              this.$message.success('操作成功')
              this.$parent.$emit('close', true)
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-box {
  padding: 20px;
}
.w300 {
  width: 300px;
}
</style>

<style lang="scss">
@import "../../index.scss";
</style>
