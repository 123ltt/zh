<template>
  <el-form
    ref="siteFormRef"
    :rules="rules"
    :model="siteForm"
    class="form-col"
    label-width="90px"
  >
    <div class="el-form-box">
      <el-form-item
        label="所属平台"
        size="small"
        prop="platformId"
      >
        <el-select
          v-model="siteForm.platformId"
          clearable
          filterable
          style="width:300px"
          placeholder="请选择"
          @change="changePlatformId"
        >
          <el-option
            v-for="(item,index) in platformOptions"
            :key="index"
            :label="item.displayName"
            :value="item.hiddenValue"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="站点"
        prop="code"
        size="small"
      >
        <el-input
          v-model.trim="siteForm.code"
          placeholder="请输入"
          class="w300"
          maxlength="10"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="站点网址"
        prop="url"
        size="small"
      >
        <el-input
          v-model.trim="siteForm.url"
          placeholder="请输入"
          clearable
          maxlength="30"
          class="w300"
        />
      </el-form-item>
      <el-form-item
        label="站点描述"
        prop="description"
        size="small"
      >
        <el-input
          v-model.trim="siteForm.description"
          placeholder="请输入"
          type="textarea"
          class="w300"
          maxlength="100"
          clearable
        />
      </el-form-item>
    </div>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button
        size="medium"
        @click="$parent.$emit('close')"
      >取 消</el-button>
      <el-button
        size="medium"
        type="primary"
        :disabled="item ? submitBtnEnable : false"
        @click="handlerSeve('siteFormRef')"
      >确 定</el-button>
    </div>
  </el-form>

</template>

<script>
import { addSite, updateSite } from '@/api/site'
import { LIMIT } from '@/config/form'
import { deepClone } from '@/util/util'
export default {
  name: 'EditSite',
  props: {
    item: {
      type: Object
    },
    platformOption: {
      type: Array
    },
    dialogType: {
      type: Number
    }
  },
  data() {
    return {
      LIMIT,
      platformOptions: [],
      siteForm: {
        showSiteCode: '',
        platformId: '',
        code: '',
        url: '',
        description: ''
      },
      // 用于提交时判断是否修改
      oldForm: null,
      showSiteCode: ['WH', 'SM'],
      rules: {
        platformId: [{ required: true, message: '所属平台不能为空', trigger: 'change' }],
        code: [{ required: true, message: '站点不能为空', trigger: 'blur' }, {
          pattern: /^[A-Z]+$/, message: '最多输入十位大写字母'
        }],
        url: [{ required: true, message: '站点网址不能为空', trigger: 'blur' }, {
          pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确的站点地址'
        }]
      }
    }
  },
  computed: {
    // 是否显示
    isShowSite() {
      return this.showSiteCode.includes(this.siteForm.platformCode)
    },
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.siteForm))
    }
  },
  mounted() {
    this.platformOptions = this.platformOption.filter(item => {
      if (this.showSiteCode.includes(item.candidateDisplayName)) {
        item.disabled = true
      }
      return item
    })
  },
  created() {
    if (this.item) {
      const items = deepClone(this.item)
      this.siteForm = {
        id: items.id,
        url: items.siteUrl,
        code: items.siteCode,
        platformId: typeof items.platformId === 'number' ? items.platformId + '' : items.platformId,
        description: items.siteDescription
      }
      this.oldForm = deepClone(this.siteForm)
    }
  },
  methods: {
    // 平台切换
    changePlatformId(id) {
      this.siteForm.platformCode = this.platformOption.find(item => item.hiddenValue === id).candidateDisplayName
    },
    // 保存
    handlerSeve(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType) {
            updateSite({ ...this.siteForm }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          } else {
            addSite({ ...this.siteForm }).then(res => {
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
</style>
