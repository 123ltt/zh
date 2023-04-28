<template>
  <basic-container>
    <div class="openBox">
      <div class="fubox">
        <header class="header">
          <p class="title">{{ isAdd?'新增结算账号':'编辑结算账号' }}</p>
          <div
            class="closeBtn"
            @click="doclose()"
          >
            <el-button
              size="mini"
              type="primary"
            >返回</el-button>
          </div>
        </header>
        <main class="main">
          <el-form ref="rulesForm" v-loading="loading" :model="openData" label-width="120px" size="mini">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="supplierId" label="供应商名称" :rules="{ required: true, message: '供应商名称不能为空', trigger: 'change' }">
                  <g-select v-model="openData.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" :disabled="!isAdd" value-field="supplierId" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="accountType" label="账号类型" :rules="{ required: true, message: '账号类型不能为空', trigger: 'change' }">
                  <el-select
                    ref="input"
                    v-model="openData.accountType"
                    clearable
                    placeholder="请搜索选择"
                    filterable
                  >
                    <el-option
                      v-for="item in accountTypeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="accountCurrency" label="币种" :rules="{ required: true, message: '币种不能为空', trigger: 'change' }">
                  <el-select
                    ref="input"
                    v-model="openData.accountCurrency"
                    clearable
                    placeholder="请搜索选择"
                    filterable
                  >
                    <el-option
                      v-for="item in currencyList"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="account" label="账户名称" :rules="{ required: true, message: '账户名称不能为空', trigger: 'blur' }">
                  <el-input
                    v-model="openData.account"
                    clearable
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="accountNumber" label="账户账号" :rules="{ required: true, message: '账户账号不能为空', trigger: 'blur' }">
                  <el-input
                    v-model="openData.accountNumber"
                    clearable
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="isBank" :span="12">
                <el-form-item prop="accountBank" label="账户开户行" :rules="{ required: true, message: '账户开户行不能为空', trigger: 'change' }">
                  <el-select
                    ref="input"
                    v-model="openData.accountBank"
                    clearable
                    placeholder="请搜索选择"
                    filterable
                  >
                    <el-option
                      v-for="item in bankList"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="isBank" :span="12">
                <el-form-item>
                  <span slot="label">
                    <span class="biaozhi">*</span>
                    账户类型</span>
                  <el-radio v-model="openData.accountUserType" label="1">对公账户</el-radio>
                  <el-radio v-model="openData.accountUserType" label="2">对私账户</el-radio>
                </el-form-item>
              </el-col>
              <el-col v-if="isBank" :span="24">
                <el-form-item prop="accountBankBranch" label="开户行支行" :rules="{ required: true, message: '开户行支行不能为空', trigger: 'blur' }">
                  <el-input
                    v-model="openData.accountBankBranch"
                    clearable
                    placeholder="省份+分支行名称，比如：XX省XX市XX分行/XX支行"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <span slot="label">
                    <span class="biaozhi">*</span>
                    开户人身份证</span>
                  <div class="imgListBox">
                    <div v-for="item in imgArr" :key="item.make">
                      <p>{{ item.title }}</p>
                      <upload-image v-if="getScc" :images.sync="item.container" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="item.imgStatus" :avatar="true" :size="5242880" />
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col v-if="isBank" :span="24">
                <el-form-item>
                  <span slot="label">
                    <span class="biaozhi">*</span>
                    开户人银行卡</span>
                  <upload-image v-if="getScc" :images.sync="imageList" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="imageUploading" :avatar="true" :size="5242880" />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="padding-left:20px">
                <el-checkbox v-model="isdefa">默认结算账户</el-checkbox>
              </el-col>
            </el-row>
          </el-form>
        </main>
        <footer class="footer">
          <el-button
            size="mini"
            icon="el-icon-circle-close"
            @click="doclose()"
          >取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="todefine()"
          >保存</el-button>
        </footer>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getBank, save, update, getCurrency, getDetail } from '@/api/settlementManagement/settlementAccountNo.js'
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'
import { debounce } from '@/util/util'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'
export default {
  name: 'AccountNoAdd',
  components: { UploadImage },
  props: {
    isAdd: Boolean,
    openData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      accountTypeList: [
        { id: 1, name: '银行卡' },
        { id: 2, name: '支付宝' },
        { id: 3, name: '微信' }
      ],
      bankList: [],
      currencyList: [],
      isdefa: true,
      supplierList: [],
      isBank: true,
      loading: false,
      payTypeList: [],
      payConditionList: [],
      bankCard: '',
      httpRequest,
      imageList: [],
      imageUploading: false, // 上传状态
      getScc: true,
      imgArr: [
        { title: '正面', container: [], imgStatus: false },
        { title: '反面', container: [], imgStatus: false }
      ]
    }
  },
  watch: {
    'openData.accountType'(newVal, oldVal) {
      this.imageList = []
      this.openData.accountBank = ''
      this.openData.accountUserType = ''
      this.openData.accountBankBranch = ''
      if (newVal !== 1 && newVal !== '') {
        this.isBank = false
      } else if (newVal === 1) {
        this.isBank = true
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    if (!this.isAdd) {
      this.chuli()
    }
  },
  methods: {
    getData() {
      this.loading = true
      getBank().then(res => {
        this.bankList = res.data
      })
      getCurrency().then(res => {
        this.currencyList = res.data
      })
      supplier().then(res => {
        this.supplierList = res.data
        this.loading = false
      })
      getMyDictBiz('pss_pay_condition').then(res => {
        this.payConditionList = res.data
      })
      getMyDictBiz('pss_pay_type').then(res => {
        this.payTypeList = res.data
      })
    },
    doclose() {
      this.isBank = true
      this.$emit('close')
      this.close()
    },
    // 封装判断函数
    bool(val) {
      if (val == null || val === '') {
        return true
      }
      return false
    },
    // 验证证件上传
    isSaveCard() {
      let isHas = false
      this.imgArr.forEach(item => {
        if (item.imgStatus) {
          isHas = true
        }
      })
      return isHas
    },
    // 验证账户对应的账号内型
    checkAccount() {
      if (this.openData.accountType === 1 && !/^([1-9]{1})(\d{15}|\d{18})$/.test(this.openData.accountNumber)) {
        this.$message.error('请填写正确的16或19位银行卡号!')
        return false
      } else if (this.openData.accountType !== 1 && !/^1[3456789]\d{9}$/.test(this.openData.accountNumber) && !/^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.openData.accountNumber)) {
        this.$message.error('请填写正确的手机号或邮箱!')
        return false
      } else {
        return true
      }
    },
    todefine: debounce(function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.openData.accountType !== 1) {
            this.openData.accountBank = -1
            this.openData.accountBankBranch = ''
            this.openData.accountUserType = '1'
          }
          if (this.openData.accountType === 1 && this.imageUploading) {
            this.$message.error('请上传银行卡照片!')
          } else if (this.isSaveCard()) {
            this.$message.error('请上传身份证照!')
          } else if (this.checkAccount()) {
            if (this.isdefa) {
              this.openData.isDefault = 0
            } else {
              this.openData.isDefault = 1
            }
            this.openData.supplierFileList[0] = { link: this.imgArr[0].container[0].url, fileName: this.imgArr[0].container[0].name }
            this.openData.supplierFileList[1] = { link: this.imgArr[1].container[0].url, fileName: this.imgArr[1].container[0].name }
            if (this.imageList.length) {
              this.openData.accountPicture = this.imageList[0].url
            }
            this.loading = true
            if (this.isAdd) {
              save(this.openData).then(() => {
                this.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }).catch(() => {
                this.loading = false
              })
            } else {
              update(this.openData).then(() => {
                this.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }).catch(() => {
                this.loading = false
              })
            }
          }
        }
      })
    }),
    chuli() {
      this.loading = true
      this.getScc = false
      const openData = this.openData
      openData.accountCurrency = openData.accountCurrency + ''
      openData.payCondition = openData.payCondition + ''
      openData.payType = openData.payType + ''
      openData.accountUserType = openData.accountUserType + ''
      openData.supplierId = openData.supplierId + ''
      if (!openData.accountBank) {
        openData.accountBank = ''
      }
      if (openData.accountBank === -1) {
        openData.accountBank = ''
      } else {
        openData.accountBank = openData.accountBank + ''
      }
      if (openData.accountType === 1) {
        this.isBank = true
      } else {
        this.isBank = false
      }
      if (openData.isDefault === 0) {
        this.isdefa = true
      } else if (openData.isDefault === 1) {
        this.isdefa = false
      }
      getDetail(openData.id).then(res => {
        if (res.data.supplierFileList.length) {
          this.imgArr[0].container.push({ url: res.data.supplierFileList[0].link, name: res.data.supplierFileList[0].fileName })
          this.imgArr[1].container.push({ url: res.data.supplierFileList[1].link, name: res.data.supplierFileList[1].fileName })
        }
        if (res.data.accountPicture) {
          this.imageList.push({ url: res.data.accountPicture, name: '银行卡' })
        }
        this.getScc = true
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
    box-sizing: border-box;
}
.openBox{
    width: 100%;
    // height: 600px;
    overflow: auto;
    .fubox{
        .header {
        box-sizing: border-box;
        padding: 0 20px;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #cccccc;
        .title {
            font-size: 14px;
        }
        }
        .main {
        width: 100%;
        padding-top: 20px;
        padding-right: 20px;
        ::v-deep .el-select{
            width: 100%;
        }
        ::v-deep .el-form-item{
            margin-bottom: 10px!important;
        }
        ::v-deep .el-form-item__content{
            //   width: 100%;
            ::v-deep .el-input-group__prepend{
                width: 25%;
                padding: 0;
                text-align: center;
            }
        }
        .biaozhi {
                color: red;
                font-size: 12px;
            }
            ::v-deep .avatar-uploader .el-upload:hover {
                border-color: #409EFF;
            }
            ::v-deep .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 300px;
                height: 200px;
                line-height: 200px;
                text-align: center;
            }
            ::v-deep .avatar {
                width: 300px;
                height: 200px;
                display: block;
            }
        }
        .footer {
        text-align: center;
        //   margin-top: 30px;
        padding-bottom: 40px;
        }
    }
}
.titleImg{
    position: relative;
    .title{
        position: absolute;
        top: 0;
        left: 5px;
        font-size: 20px;
    }
}
.imgListBox{
  display: flex;
  flex-wrap: wrap;
  p{
    margin: 0;
    text-align: center;
  }
}
</style>
