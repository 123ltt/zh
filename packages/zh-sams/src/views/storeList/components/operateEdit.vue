<template>
  <basic-container>
    <div class="btn-head">
      <p />
      <el-button type="primary" size="mini" :disabled="submitBtnEnable" @click="handleUpdate('formObjRef')">修 改</el-button>
    </div>
    <el-form ref="formObjRef" :model="formObj" :rules="rules" label-width="110px" size="mini" class="form-col">
      <el-row style="width:74%;margin: auto;">
        <el-col :span="12">
          <el-form-item label="销售人员" prop="mainSellerName">
            <el-input v-model.trim="formObj.mainSellerName" :disabled="true" placeholder="" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客服人员" prop="customerServiceName">
            <el-input v-model.trim="formObj.customerServiceName" :disabled="true" placeholder="" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售主管">
            <el-input v-model.trim="mainSellerSupervisor" :disabled="true" placeholder="" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售经理">
            <el-input v-model.trim="mainSellerManager" :disabled="true" placeholder="" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类目" prop="category">
            <el-input v-model.trim="formObj.category" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品线" prop="productLine">
            <el-input v-model="formObj.productLine" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外部SKU前缀" prop="externalSkuPrefix">
            <el-input v-model.trim="formObj.externalSkuPrefix" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺链接" prop="storeUrl">
            <el-input v-model.trim="formObj.storeUrl" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="水印码" prop="watermark">
            <el-input v-model.trim="formObj.watermark" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺邮箱" prop="storeEmail">
            <el-input v-model.trim="formObj.storeEmail" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刊登利润率" prop="publishGrossProfitRate">
            <el-input v-model.trim="formObj.publishGrossProfitRate" maxlength="4" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网络类型" prop="net">
            <el-select v-model="formObj.net" clearable placeholder="请选择" style="width:200px">
              <el-option v-for="(item,index) in findForm.netOption" :key="index" :label="item.displayName" :value="item.hiddenValue" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP" prop="ip">
            <el-input v-model.trim="formObj.ip" :disabled="true" placeholder="请输入" clearable class="w200" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺风险等级" prop="storeRiskLevel">
            <el-radio-group v-model="formObj.storeRiskLevel">
              <el-radio v-for="(item,index) in findForm.storeRiskLevelOption" :key="index" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="showIsLocalAccount" :span="12">
          <el-form-item label="是否是本土账号" prop="isLocalAccount">
            <el-select v-model="formObj.isLocalAccount" clearable placeholder="请选择" style="width:200px">
              <el-option v-for="(item,index) in findForm.isLocalAccountOption" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="showIsLocalAccount?12:24">
          <el-form-item label="使用的品牌" prop="trademarkNames">
            <el-tag
              v-for="(tag,index) in formObj.trademarkNames"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleTagsClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputTagsVisible"
              ref="saveTagInput"
              v-model="tagsInputVal"
              class="input-new-tag"
              size="mini"
              maxlength="30"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" :disabled="formObj.trademarkNames &&formObj.trademarkNames.length === 3" size="mini" @click="showInput">+ 品牌</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import { LIMIT } from '@/config/form'
import { getStoreOperationInfoById, updateOperationInfoById } from '@/api/storeList'
import { dictionary, supervisorManagerList } from '@/api/public'
import { deepClone } from '@/util/util'
export default {
  name: 'OperateEdit',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    },
    platformCode: {
      type: String
    }
  },
  data() {
    return {
      LIMIT,
      mainSellerManager: '',
      mainSellerSupervisor: '',
      oldForm: {},
      formObj: {
        mainSellerName: '',
        trademarkNames: [],
        customerServiceName: '',
        category: '',
        productLine: '',
        externalSkuPrefix: '',
        storeUrl: '',
        storeEmail: '',
        trademark: '',
        publishGrossProfitRate: '',
        net: '',
        ip: '',
        isLocalAccount: null,
        storeRiskLevel: ''
      },
      findForm: {
        netOption: [],
        storeRiskLevelOption: [{ label: '低级', value: '1' }, { label: '中级', value: '2' }, { label: '高级', value: '3' }],
        isLocalAccountOption: [{ label: '是', value: true }, { label: '否', value: false }]
      },
      tagsInputVal: '',
      inputTagsVisible: false,
      rules: {
        mainSellerName: [{ required: true }],
        customerServiceName: [{ required: true }],
        // category: [{ required: true }],
        externalSkuPrefix: [{ required: true }],
        watermark: [{ required: true }],
        storeUrl: [{ required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确的店铺链接', trigger: 'blur' }],
        organizationId: [{ required: true, message: '所属组织不能为空', trigger: 'blur' }],
        net: [{ required: true, message: '网络类型不能为空', trigger: 'change' }],
        publishGrossProfitRate: [{ required: true, message: '刊登利润率不能为空', trigger: 'blur' }, { required: true, pattern: /0\.\d+/g, message: '请输入0.01-0.99之间', trigger: 'blur' }]
        // ip: [{ required: true }]
      }
    }
  },
  computed: {
    // 是否修改，并启用提交按钮
    submitBtnEnable() {
      return (JSON.stringify(this.oldForm) === JSON.stringify(this.formObj))
    },
    showIsLocalAccount() {
      return ['EB'].includes(this.platformCode)
    }
  },
  mounted() {
    if (this.compId) {
      this.getStoreOperationInfoById()
    }
    this.dictionary('sams_net_type')
  },
  methods: {
    handleTagsClose(tag) {
      this.formObj.trademarkNames.splice(this.formObj.trademarkNames.indexOf(tag), 1)
    },
    handleInputConfirm() {
      const tagsInputVal = this.tagsInputVal
      if (tagsInputVal && this.formObj.trademarkNames.length <= 3) {
        this.formObj.trademarkNames.push(tagsInputVal)
      }
      this.inputTagsVisible = false
      this.tagsInputVal = ''
    },
    // tag 标签处理
    showInput() {
      this.inputTagsVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
      this.$refs.formObjRef.validateField('trademarkNames') // 再次校验tag的正则
    },
    // 详情
    getStoreOperationInfoById() {
      getStoreOperationInfoById({ id: this.compId }).then(res => {
        const data = res.data
        data.storeRiskLevel = data.storeRiskLevel && data.storeRiskLevel.toString()
        data.net = data.net && data.net.toString()
        this.formObj = data
        this.getSupervisorManagerList()
        this.oldForm = deepClone(this.formObj)
      })
    },
    // 销售主管 销售经理
    getSupervisorManagerList() {
      supervisorManagerList({ userId: this.formObj.mainSellerId }).then(res => {
        const data = res.data
        this.mainSellerManager = data.manager && data.manager[0].name + data.manager[0].jobNumber // 经理
        this.mainSellerSupervisor = data.supervisor && data.supervisor[0].name + data.supervisor[0].jobNumber // 主管
      })
    },
    // 字典
    dictionary(code) {
      dictionary({ code: code }).then(res => {
        this.findForm.netOption = res.data
      })
    },
    // 修改
    handleUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.compId) {
            this.formObj.trademarkIds = this.formObj.trademarkNames
            updateOperationInfoById({ ...this.formObj }).then(res => {
              this.$message.success(res.msg)
              this.$emit('close', true)
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.w200{
  width: 200px !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
