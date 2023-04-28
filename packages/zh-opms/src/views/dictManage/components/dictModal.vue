<template>
  <el-form
    ref="dialogForm"
    :model="dialogForm"
    :rules="rules"
    label-width="80px"
  >
    <el-row :gutter="5" style="margin-top: 20px">
      <el-col :span="12">
        <el-form-item
          label="字典编码"
          prop="code"
          size="small"
        >
          <el-input
            v-model="dialogForm.code"
            maxlength="30"
            :disabled="(dialogForm.parentId && dialogForm.parentId !== '0') || dialogForm.appChild"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="字典键"
          prop="dictKey"
          size="small"
        >
          <el-input
            v-model="dialogForm.dictKey"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item
          label="字典值"
          prop="dictValue"
          size="small"
        >
          <el-input
            v-model="dialogForm.dictValue"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="上级字典"
          prop="parentId"
          size="small"
        >
          <el-select
            v-model="dialogForm.parentId"
            style="width:100%;"
            :placeholder="addParent ? '顶级' : ''"
            popper-class="dict-option-style-large"
            :disabled="(dialogForm.parentId && dialogForm.parentId !== '0') || addParent || dialogForm.appChild "
          >
            <el-option
              v-for="item in dictParentList"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
              :title="item.dictValue"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col v-if="(dialogForm.parentId && dialogForm.parentId === 0) || addParent" :span="12">
        <el-form-item label="租户ID" size="small" prop="tenantId">
          <el-select v-model="dialogForm.tenantId" filterable clearable style="width:100%;" popper-class="dict-option-style">
            <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.tenantId" :value="item.tenantId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="(dialogForm.parentId && dialogForm.parentId === 0) || addParent" :span="12">
        <el-form-item label="模块编码" size="small" prop="appCode">
          <el-select v-model="dialogForm.appCode" filterable clearable style="width:100%;" popper-class="dict-option-style">
            <el-option v-for="(item, index) in appList" :key="index" :label="item.appCode" :value="item.appCode" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item
          label="排序"
          prop="sort"
          size="small"
        >
          <el-input
            v-model="dialogForm.sort"
            @input="changeSort"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="备注"
          prop="remark"
          size="small"
        >
          <el-input
            v-model="dialogForm.remark"
            :rows="3"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item label="是否删除" size="small" prop="isDeleted">
          <el-select v-model="dialogForm.isDeleted" filterable clearable style="width:100%;">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <div style="padding: 22px 0 10px;text-align: right">
      <el-button
        size="medium"
        @click="$parent.$emit('close')"
      >取消</el-button>
      <el-button
        :disabled="dialogForm.id ? submitBtnEnable : false"
        size="medium"
        type="primary"
        @click="submitDialog('dialogForm')"
      >保存
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { deepClone } from '@/util/util'
import { submitDict, getDictParentList } from '@/api/dict'
export default {
  name: 'DictModal',
  // eslint-disable-next-line
  props: ['row', 'tenantList', 'appList', 'addParent', 'selectedChildData'],
  data() {
    const validateCode = (rule, value, callback) => {
      if (value && /^[a-z_]{1,}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入字典编码为小写字母或下划线'))
      }
    }
    return {
      dictParentList: [],
      rules: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        dictKey: [{ required: true, message: '字典键不能为空', trigger: 'blur' }],
        dictValue: [{ required: true, message: '字典值不能为空', trigger: 'blur' }],
        tenantId: [{ required: true, message: '所属租户不能为空', trigger: 'change' }],
        appCode: [{ required: true, message: '所属应用不能为空', trigger: 'change' }]
      },
      dialogForm: {
        isDeleted: '0'
      },
      oldForm: {}
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.dialogForm))
    }
  },
  created() {
    this.getParentDictList()
    if (this.row.id) { // 编辑
      this.dialogForm = deepClone(this.row)
      this.dialogForm.isDeleted = String(this.dialogForm.isDeleted)
      this.oldForm = deepClone(this.dialogForm)
    }
    if (this.selectedChildData) { // 添加子级
      const { code } = this.selectedChildData
      this.dialogForm = Object.assign(this.dialogForm, { code }, { parentId: this.selectedChildData.id }, { appChild: true })
    }
  },
  methods: {
    getParentDictList() {
      getDictParentList({ current: 1, size: 999 }).then(res => {
        this.dictParentList = res.data.records
        this.dictParentList.push({
          id: 0,
          dictValue: '顶级'
        })
      })
    },
    // 排序
    changeSort(value) {
      this.dialogForm.sort = Number(value.replace(/[^0-9]/g, ''))
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.dialogForm.appName
          delete this.dialogForm.tenantName
          submitDict(this.dialogForm).then((res) => {
            this.$message.success(this.dialogForm.id ? '编辑成功' : '添加成功')
            this.$parent.$emit('close', true)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  padding-right: 10px;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>

<style lang="scss">
.dict-option-style {
  .el-select-dropdown__wrap {
    max-height: 144px;
  }
}
.dict-option-style-large {
  .el-select-dropdown__wrap {
    max-height: 190px;
  }
}
</style>
