<template>
  <el-form
    ref="platFormRef"
    :rules="rules"
    :model="platForm"
    label-width="120px"
    class="form-col"
  >
    <div v-if="!isShowSites" class="el-form-box">
      <el-form-item label="平台" prop="platformName" size="small">
        <el-input v-model.trim="platForm.platformName" class="w300" maxlength="15" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="平台英文名称" prop="platformEnName" size="small">
        <el-input v-model.trim="platForm.platformEnName" class="w300" maxlength="15" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="平台二字简称" prop="platformCode" size="small">
        <el-input v-model.trim="platForm.platformCode" maxlength="2" class="w300" :disabled="dialogType===0?false:true" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item
        label="平台网址"
        prop="url"
        size="small"
      >
        <el-input v-model.trim="platForm.url" maxlength="30" placeholder="请输入" clearable class="w300" />
      </el-form-item>
    </div>

    <template v-else>
      <el-form-item
        label="平台"
        prop="platformName"
        size="small"
      >
        <span>{{ platForm.platformName }}</span>
      </el-form-item>
      <el-form-item label="站点" size="small" prop="url">
        <div v-for="(item,index) in platForm.sites" :key="index" class="site-box">
          <el-button>{{ item }}</el-button>
        </div>
      </el-form-item>
    </template>

    <div style="padding-bottom: 20px;text-align: right">
      <el-button
        v-if="isShowSites"
        size="medium"
        @click="$parent.$emit('close')"
      >取消</el-button>
      <template v-else>
        <el-button
          size="medium"
          @click="$parent.$emit('close')"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          :disabled="item ? submitBtnEnable : false"
          @click="handlerSeve('platFormRef')"
        >保存</el-button>
      </template>
    </div>
  </el-form>

</template>

<script>
import { addPlatform, updatePlatform, showConfiguredSites } from '@/api/platform'
import { deepClone } from '@/util/util'
export default {
  name: 'EditPlatform',
  props: {
    item: {
      type: Object
    },
    platformOption: {
      type: Array
    },
    dialogType: {
      type: Number
    },
    isShowSites: {
      type: Boolean
    }
  },
  data() {
    return {
      platForm: {
        platformCode: '',
        platformName: '',
        platformEnName: '',
        url: '',
        checkInfringement: ''
      },
      // 用于提交时判断是否修改
      oldForm: null,
      rules: {
        platformName: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
        platformEnName: [{ required: true, message: '平台英文名称不能为空', trigger: 'blur' },
          { pattern: /^[A-Za-z\d]+$/, message: '只能输入字母数字' }],
        platformCode: [{ required: true, message: '平台二字简称不能为空', trigger: 'blur' },
          { pattern: /^[A-Z]+$/, message: '只能输入两位大写字母' }],
        url: [{ message: '请输入正确的url', pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/ }]
      }

    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.platForm))
    }
  },
  created() {
    if (this.isShowSites) {
      this.showConfiguredSites(this.item.id)
    }
    if (this.item) {
      const { platformCode, platformEnName, platformName, url, id, checkInfringement } = deepClone(this.item)
      this.platForm = Object.assign(this.platForm, {
        platformCode, platformEnName, platformName, url, id, checkInfringement
      })
      this.oldForm = deepClone(this.platForm)
    }
  },
  methods: {
    // 查看配置站点
    showConfiguredSites(id) {
      showConfiguredSites({ id: id }).then(res => {
        const data = res.data
        this.platForm = data
      })
    },
    // 保存 新增 更新
    handlerSeve(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType) { // 编辑
            updatePlatform({ ...this.platForm }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          } else {
            addPlatform({ ...this.platForm }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          }
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
.el-input__inner {
  width: 300px;
}
.w300 {
  width: 300px;
}
.site-box{
  display: inline-block;
  margin-bottom: 6px;
  margin-right: 6px;
}
</style>
