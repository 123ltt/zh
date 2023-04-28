<template>
  <el-form
    ref="siteFormRef"
    :rules="rules"
    :model="siteForm"
    label-width="80px"
    size="mini"
    class="form-col"
  >
    <div class="el-form-box">
      <el-form-item
        label="平台"
        prop="platform"
      >
        <el-select
          v-model="siteForm.platform"
          clearable
          filterable
          placeholder="请选择"
          class="w300"
          @change="changePlatformId"
        >
          <el-option
            v-for="(item,index) in findForm.platformOption"
            :key="index"
            :label="item.displayName"
            :value="item.hiddenValue"
          />
        </el-select>
      </el-form-item>
      <template v-if="row">
        <el-form-item
          label="站点"
          prop="site"
        >
          <el-select
            v-model="siteForm.site"
            clearable
            filterable
            :disabled="disabledSite"
            placeholder="请选择"
            class="w300"
          >
            <el-option
              v-for="(item,index) in findForm.siteALLOption"
              :key="index"
              :label="item.displayName"
              :value="item.hiddenValue"
            />
          </el-select>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item
          label="站点"
          prop="sites"
        >
          <el-select
            v-model="siteForm.sites"
            clearable
            filterable
            :disabled="disabledSite"
            value-key="hiddenValue"
            placeholder="请选择"
            multiple
            class="w300"
          >
            <el-option
              v-for="(item,index) in findForm.siteALLOption"
              :key="index"
              :label="item.displayName"
              :value="item.hiddenValue"
            />
          </el-select>

        </el-form-item>
      </template>
      <el-form-item
        label="类型"
        prop="fba"
      >
        <el-checkbox v-model="siteForm.fba" :label="true">是否为Amazon FBA</el-checkbox>
      </el-form-item>
      <template v-if="row">
        <el-form-item
          label="参数名"
          prop="parameter"
        >
          <el-input
            v-model.trim="siteForm.parameter"
            placeholder="请输入"
            clearable=""
            class="w300"
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-row
          v-for="(item,index) in siteForm.parameters"
          :key="index"
          :gutter="8"
        >
          <el-col :span="18">
            <el-form-item
              :prop="'parameters.' + index"
              :rules="[{ required: true, message: '参数名不能为空',trigger:'blur'},{ pattern:/^[\w\d`~!@#-|$%\s￥^&*()_+-\s<>?:{},./;'[\]]{1,30}$/, message: '参数名只支持输入英文、数字和特殊字符'}]"
              :label="`参数名${index+1}`"
            >
              <el-input
                v-model.trim="siteForm.parameters[index]"
                placeholder="请输入"
                clearable
                maxlength="30"
                style="width:246px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button v-if="index === 0" size="mini" icon="el-icon-plus" @click="handlerAddParamenter(item,index)" />
            <el-button v-else size="mini" icon="el-icon-minus" @click="handlerDelParamenter(item,index)" />
          </el-col>
        </el-row>
      </template>
    </div>
    <div style="padding-top: 20px; text-align: right">
      <el-button
        size="medium"
        @click="$parent.$emit('close')"
      >取 消</el-button>
      <el-button
        size="medium"
        type="primary"
        :disabled="submitBtnEnable"
        @click="handlerSeve('siteFormRef')"
      >确 定</el-button>
    </div>
  </el-form>

</template>

<script>
import { addParams, updateParam } from '@/api/parameter' // api授权参数
import { siteOption } from '@/api/site' // 站点
import { deepClone } from '@/util/util'
export default {
  name: 'EditParameter',
  props: {
    row: {
      type: Object
    },
    findForm: {
      type: Object
    }
  },
  data() {
    return {
      siteForm: {
        platform: '',
        sites: [],
        site: '',
        fba: false,
        parameters: ['']
      },
      disabledSite: true,
      oldForm: {},
      rules: {
        platform: [{ required: true, message: '平台名称不能为空', trigger: 'change' }],
        site: [{ required: true, message: '站点不能为空', trigger: 'change' }],
        sites: [{ required: true, message: '站点不能为空', trigger: 'change' }],
        parameter: [{ required: true, message: '参数名不能为空', trigger: 'blur' }, { pattern: /^[\w\d`~!@#-|$%\s￥^&*()_+-\s<>?:{},./;'[\]]{1,30}$/, message: '参数名只支持输入英文、数字和特殊字符' }]
      }

    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.siteForm))
    }
  },
  watch: {
    'siteForm.sites'(val, oldval) {
      const newindex = val && val.indexOf('-1')
      const oldindex = oldval && oldval.indexOf('-1') // 获取val和oldval里all的索引,如果没有则返回-1
      if (newindex && newindex !== -1 && oldindex === -1 && val.length > 1) { // 如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
        this.siteForm.sites = ['-1']
      } else if (newindex !== -1 && oldindex !== -1 && val.length > 1) { // 如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
        this.siteForm.sites.splice(val.indexOf('-1'), 1)
      }
    }
  },
  created() {
    if (this.row) {
      const item = deepClone(this.row)
      this.siteForm = {
        id: item.id,
        platform: item.platformName,
        platformId: item.platformId,
        site: item.siteId === 0 ? '-1' : item.siteId,
        fba: item.fba,
        parameter: item.parameter
      }
      this.oldForm = deepClone(this.siteForm)
    }
  },
  mounted() {
    this.row && this.getSiteOption(this.siteForm.platformId)
  },
  methods: {
    // 保存
    handlerSeve(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let msg = ''
          if (this.row) {
            updateParam({ ...this.siteForm }).then(res => {
              msg = res.msg
              this.$message.success(msg)
              this.$parent.$emit('close', true)
            })
          } else {
            addParams({ ...this.siteForm }).then(res => {
              msg = res.msg
              this.$message.success(msg)
              this.$parent.$emit('close', true)
            })
          }
        }
      })
    },
    // 添加参数
    handlerAddParamenter() {
      this.siteForm.parameters.push('')
    },
    // 删除参数
    handlerDelParamenter(item) {
      const index = this.siteForm.parameters.indexOf(item)
      if (index !== -1) {
        this.siteForm.parameters.splice(index, 1)
      }
    },
    // 平台切换
    changePlatformId(id) {
      if (id) {
        if (this.oldForm.platform !== this.siteForm.platform) {
          this.siteForm.site = ''
          this.siteForm.sites = []
        }
        this.getSiteOption(id)
        this.disabledSite = false
      } else {
        this.siteForm.site = ''
        this.disabledSite = true
        this.siteForm.sites = []
        this.findForm.siteALLOption = []
      }
    },
    // 站点下拉列表
    getSiteOption(id) {
      siteOption({ platform: id }).then(res => {
        const data = res.data
        const defaultList = { displayName: 'ALL', hiddenValue: '-1' }
        const list = data && data.filter(item => item.displayName === 'ALL')
        if (!list.length) {
          data.unshift(defaultList)
        }
        this.findForm.siteALLOption = data
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
