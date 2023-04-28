<template>
  <basic-container>
    <div class="openBox">
      <div v-loading="loading" class="fuBox">
        <header class="header">
          <p class="title">{{ isAdd?'新增':'编辑' }}供应商引入</p>
          <div class="closeBtn">
            <el-button size="mini" type="primary" style="margin-right: 20px" @click="doclose()">返回</el-button>
            <el-button size="mini" type="primary" style="margin-right: 20px" @click="todefine()">保存</el-button>
          </div>
        </header>
        <main class="main">
          <el-card>
            <div slot="header">
              <span>基本信息</span>
            </div>
            <el-form ref="rulesForm" :model="openData" label-width="120px" size="mini" class="basic">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item prop="importReason" label="引入原因" :rules="{ required: true, message: '引入原因不能为空', trigger: 'change' }">
                    <el-select v-model="openData.importReason" clearable placeholder="请选择" filterable>
                      <el-option v-for="item in addForm.reasonList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="isAdd" :span="12">
                  <el-form-item prop="creditCode" label="信用代码" :rules="{ required: true, message: '信用代码不能为空', trigger: 'change' }">
                    <el-input v-model="openData.creditCode" clearable placeholder="请填写" style="width:70%" @input="nameIsEmpty" />
                    <el-button :disabled="getCompanyFlag" size="mini" type="primary" style="width:25%;margin-left:10px" @click="searchSupplier">获取供应商信息</el-button>
                  </el-form-item>
                </el-col>
                <el-col v-else :span="12">
                  <el-form-item prop="creditCode" label="信用代码" :rules="{ required: true, message: '信用代码不能为空', trigger: 'change' }">
                    <el-input v-model="openData.creditCode" clearable placeholder="请填写" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="supplierName" label="供应商名称" :rules="{ required: true, message: '供应商名称不能为空', trigger: 'change' }">
                    <el-input v-model="openData.supplierName" :disabled="!isAdd" clearable placeholder="请填写" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="legalEntity" label="法人代表" :rules="{ required: true, message: '法人代表不能为空', trigger: 'blur' }">
                    <el-input v-model="openData.legalEntity" :disabled="!isAdd" clearable placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="enterpriseStatus" label="企业状态" :rules="{ required: true, message: '企业状态不能为空', trigger: 'blur' }">
                    <el-input v-model="openData.enterpriseStatus" :disabled="!isAdd" clearable placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="registerTime" label="注册时间" :rules="{ required: true, message: '注册时间不能为空', trigger: 'change' }">
                    <el-date-picker v-model="openData.registerTime" :disabled="!isAdd" style="width:100%" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="companyType" label="公司性质" :rules="{ required: true, message: '请选择公司性质', trigger: 'change' }">
                    <el-radio-group v-model="openData.companyType" :disabled="!isAdd">
                      <el-radio :label="1">公司</el-radio>
                      <el-radio :label="2">个体工商户</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="ifInvoice" label="是否能开票" :rules="{ required: true, message: '请选择是否能开票', trigger: 'change' }">
                    <el-radio-group v-model="openData.ifInvoice">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="isHasbrand" label="自有品牌" :rules="{ required: true, message: '请选择自有品牌', trigger: 'change' }">
                    <el-radio-group v-model="openData.isHasbrand">
                      <el-radio :label="1">有</el-radio>
                      <el-radio :label="0">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="isCustom" label="是否能定制服务" :rules="{ required: true, message: '请选择是否能定制服务', trigger: 'change' }">
                    <el-radio-group v-model="openData.isCustom">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="isFreeship" label="是否包邮" :rules="{ required: true, message: '请选择是否包邮', trigger: 'change' }">
                    <el-radio-group v-model="openData.isFreeship">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="payType" label="付款条件" :rules="{ required: true, message: '付款条件不能为空', trigger: 'change' }">
                    <el-select ref="input" v-model="openData.payType" clearable placeholder="请搜索选择" filterable>
                      <el-option v-for="item in payTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="payCondition" label="付款方式" :rules="{ required: true, message: '付款方式不能为空', trigger: 'change' }">
                    <el-select ref="input" v-model="openData.payCondition" clearable placeholder="请搜索选择" filterable>
                      <el-option v-for="item in payConditionList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="webSite" label="网店链接">
                    <el-input v-model="openData.webSite" clearable placeholder="请填写" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="manageModel" label="经营模式" :rules="{ required: true, message: '经营模式不能为空', trigger: 'change' }">
                    <el-select v-model="openData.manageModel" clearable placeholder="请选择" filterable>
                      <el-option v-for="item in addForm.manageModelList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="mainPath" label="主营产品类目" class="is-required">
                    <el-cascader v-model="openData.mainPath" :options="addForm.mainCategorylList" clearable placeholder="请选择" filterable style="width:100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="operationProduct" label="合作产品" :rules="{ required: true, message: '合作产品不能为空', trigger: 'change' }">
                    <el-input v-model="openData.operationProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="mainProduct" label="主营产品" :rules="{ required: true, message: '主营产品不能为空', trigger: 'change' }">
                    <el-input v-model="openData.mainProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="companyAddress" label="公司地址" :rules="{ required: true, message: '公司地址不能为空', trigger: 'blur' }">
                    <div style="display: flex;justify-content: space-between;">
                      <el-select v-model="openData.companyCountry" class="address" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in listAddress" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                      <el-select v-model="openData.companyProvince" class="address" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in provinceListO" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                      <el-select v-model="openData.companyCity" class="address" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in cityListO" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </div>
                    <el-input v-model="openData.companyAddress" clearable class="smallAddress" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="factoryAddress" label="工厂地址" :rules="{ required: true, message: '工厂地址不能为空', trigger: 'blur' }">
                    <div style="display: flex;justify-content: space-between;">
                      <el-select v-model="openData.factoryCountry" class="address" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in listAddress" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                      <el-select v-model="openData.factoryProvince" class="address" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in provinceListT" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                      <el-select v-model="openData.factoryCity" class="address" clearable placeholder="请选择" filterable>
                        <el-option v-for="item in cityListT" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </div>
                    <el-input v-model="openData.factoryAddress" clearable class="smallAddress" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="companyIntroduction" label="公司简介">
                    <el-input v-model="openData.companyIntroduction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="cooperationScope" label="合作范围">
                    <el-input v-model="openData.cooperationScope" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
          <el-card>
            <div slot="header">
              <span><span class="biaozhi">* </span> 联系人信息</span>
            </div>
            <section class="record">
              <el-table :data="tableList" max-height="400px" stripe style="width: 100%" border>
                <el-table-column type="index" width="50" align="center">
                  <template slot="header">
                    <el-button icon="el-icon-plus" type="primary" size="mini" circle @click="addBtn()" />
                  </template>
                </el-table-column>
                <el-table-column prop="duty" label="联系人职务" align="center" min-width="100" />
                <el-table-column prop="name" label="联系人名称" align="center" min-width="100" />
                <el-table-column prop="telphone" label="手机号/固定电话" align="center" min-width="150" />
                <el-table-column prop="contact" label="QQ/旺旺" align="center" min-width="150" />
                <el-table-column prop="mail" label="邮箱地址" align="center" min-width="170" />
                <el-table-column label="操作" fixed="right" align="center" min-width="90">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeBtn(scope)" />
                  </template>
                </el-table-column>
              </el-table>
            </section>
          </el-card>
          <el-card>
            <div slot="header">
              <span>资质证明</span>
            </div>
            <section class="record">
              <el-form :model="openData" label-width="120px" size="mini">
                <el-row>
                  <el-col :span="12">
                    <el-form-item>
                      <span slot="label">
                        <span class="biaozhi">* </span> 营业执照</span>
                      <upload-image v-if="getScc" :images.sync="licenseImg" :primary="false" :is-remove="true" :http-request="httpRequest" :uploading.sync="licenseStatus" :avatar="true" :size="5242880" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item>
                      <span slot="label">
                        其他</span>
                      <upload-image v-if="getScc" :images.sync="imageList" :primary="false" :http-request="httpRequest" :uploading.sync="imageUploading" :limit="12" :size="5242880" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </section>
          </el-card>
        </main>
        <footer class="footer">
          <el-button
            size="mini"
            type="primary"
            style="margin-right: 20px"
            @click="doclose()"
          >返回</el-button>
          <el-button
            size="mini"
            type="primary"
            style="margin-right: 20px"
            @click="todefine()"
          >保存</el-button>
        </footer>

        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
  </basic-container>
</template>

<script>

import { debounce, deepClone } from '@/util/util'
import { getSupplierDetailByName, save, update, getDetail } from '@/api/supplierManagement/supplierIntroduction.js'
import { getMyDictBiz } from '@/api/commonApi/common.js'
import tableAdd from './tableAdd'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'

export default {
  name: 'IntroductionAdd',
  components: { UploadImage },
  props: {
    isAdd: Boolean,
    addForm: Object,
    listAddress: Array,
    openData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      tableList: [],
      countryListO: [],
      provinceListO: [],
      cityListO: [],
      countryListT: [],
      provinceListT: [],
      cityListT: [],
      isOpenadd: false,
      getCompanyFlag: true,
      listData: {
        id: '',
        duty: '',
        name: '',
        telphone: '',
        contact: '',
        mail: '',
        status: 1
      },
      oldList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      isClick: false,
      payConditionList: [],
      licenseImg: [],
      licenseStatus: false,
      httpRequest,
      imageList: [],
      imageUploading: false,
      getScc: true,
      payTypeList: []
    }
  },
  watch: {
    'openData.factoryCountry'(newVal, oldVal) {
      this.openData.factoryProvince = ''
      if (newVal === '') {
        this.provinceListT = []
        return
      }
      if (newVal !== oldVal) {
        this.listAddress.forEach(item => {
          if (+item.id === +newVal) {
            this.provinceListT = item.provinces
          }
        })
      }
    },
    'openData.factoryProvince'(newVal, oldVal) {
      this.openData.factoryCity = ''
      if (newVal === '') {
        this.cityListT = []
        return
      }
      if (newVal !== oldVal) {
        this.provinceListT.forEach(item => {
          if (+item.id === +newVal) {
            this.cityListT = item.citys
          }
        })
      }
    },
    'openData.companyCountry'(newVal, oldVal) {
      this.openData.companyProvince = ''
      if (newVal === '') {
        this.provinceListO = []
        return
      }
      if (newVal !== oldVal) {
        this.listAddress.forEach(item => {
          if (+item.id === +newVal) {
            this.provinceListO = item.provinces
          }
        })
      }
    },
    'openData.companyProvince'(newVal, oldVal) {
      this.openData.companyCity = ''
      if (newVal === '') {
        this.cityListO = []
        return
      }
      if (newVal !== oldVal) {
        this.provinceListO.forEach(item => {
          if (+item.id === +newVal) {
            this.cityListO = item.citys
          }
        })
      }
    }
  },
  mounted() {
    this.chuli(this.isAdd)
  },
  methods: {
    doclose() {
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
    todefine: debounce(function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.factoryCity === '' || this.factoryProvince === '' || this.factoryCountry) {
            this.$message.error('工厂地址的国家，省份，城市都不能为空！')
          } else if (this.companyCity === '' || this.companyProvince === '' || this.companyCountry) {
            this.$message.error('公司地址的国家，省份，城市都不能为空！')
          } else if (this.tableList.length === 0) {
            this.$message.error('请填写联系人信息!')
          } else if (this.imageUploading || this.licenseStatus) {
            this.$message.error('文件正在上传中，请稍后!')
          } else if (!this.licenseImg.length) {
            this.$message.error('请上传营业执照!')
          } else {
            this.openData.supplierFileDTOList = []
            if (this.imageList.length) {
              this.imageList.forEach(item => {
                const obj = {
                  id: '' || item.id,
                  link: item.url,
                  fileName: item.name
                }
                this.openData.supplierFileDTOList.push(obj)
              })
            }
            this.openData.mainCategory = this.openData.mainPath[1]
            this.openData.supplierContacterDTOList = this.tableList
            this.openData.license = this.licenseImg[0].url
            this.loading = true
            if (this.isAdd) {
              save(this.openData).then(() => {
                this.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            } else {
              update(this.openData).then(() => {
                this.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              })
            }
          }
        } else {
          this.$message.error('请完成上面必填项！')
        }
      })
    }),
    chuli(val) {
      getMyDictBiz('pss_pay_condition').then(res => {
        this.payConditionList = res.data
      })
      getMyDictBiz('pss_pay_type').then(res => {
        this.payTypeList = res.data
      })
      if (!val) {
        this.loading = true
        this.getScc = false
        this.openData.mainPath = this.openData.mainCategoryPath.split(',')
        this.openData.mainCategory = this.openData.mainCategory + ''
        this.openData.manageModel = this.openData.manageModel + ''
        this.openData.importReason = this.openData.importReason + ''
        this.openData.payCondition = this.openData.payCondition + ''
        this.openData.payType = this.openData.payType + ''
        this.tableList = this.openData.supplierContacterVOList
        this.listAddress.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.id == this.openData.factoryCountry) {
            this.provinceListT = item.provinces
            this.provinceListT.forEach(item1 => {
              // eslint-disable-next-line eqeqeq
              if (item1.id == this.openData.factoryProvince) {
                this.cityListT = item1.citys
              }
            })
          }
          // eslint-disable-next-line eqeqeq
          if (item.id == this.openData.companyCountry) {
            this.provinceListO = item.provinces
            this.provinceListO.forEach(item1 => {
              // eslint-disable-next-line eqeqeq
              if (item1.id == this.openData.companyProvince) {
                this.cityListO = item1.citys
              }
            })
          }
        })
        getDetail(this.openData.id).then(res => {
          this.licenseImg.push({ url: res.data.license, name: '营业执照' })
          res.data.supplierFileVOList.forEach(item => {
            this.imageList.push({ url: item.link, id: item.id, name: item.fileName })
          })
          this.getScc = true
          this.loading = false
        })
      } else {
        this.listAddress.forEach(item => {
          if (item.name === '中国') {
            this.openData.factoryCountry = item.id
            this.openData.companyCountry = item.id
          }
        })
      }
    },
    addBtn() {
      this.oldList = deepClone(this.listData)
      this.$modal({
        title: ('添加联系人信息'),
        component: tableAdd,
        width: '25%',
        data: {
          listData: this.oldList
        },
        callback: (bool) => {
          if (bool) {
            this.tableList.unshift(bool)
          }
        }
      })
    },
    removeBtn(val) {
      this.tableList.splice(val.$index, 1)
    },
    searchSupplier() {
      if (this.openData.creditCode !== '') {
        this.loading = true
        this.getScc = false
        getSupplierDetailByName(this.openData.creditCode).then(res => {
          if (res.code === 200) {
            this.isClick = true
            this.getCompanyFlag = true
            this.clearInvalidFields(res.data)
            const data = res.data
            Object.keys(data).forEach(item => {
              if (item in this.openData) {
                if (data[item]) {
                  this.openData[item] = data[item]
                }
              }
            })
            if (this.imageList.length < 13) {
              const obj = {
                data: {
                  link: data.supplierFileVOList[0].link,
                  id: data.supplierFileVOList[0].id,
                  originalName: data.supplierFileVOList[0].fileName
                }
              }
              this.imageList.push({ url: data.supplierFileVOList[0].link, response: obj })
            } else {
              this.$message.error('图片已到达上传上限，加载失败！')
            }
            this.getScc = true
            this.loading = false
          } else {
            this.$message.error('获取失败！')
          }
        })
      }
    },
    clearInvalidFields(Obj) {
      Object.keys(Obj).forEach(key => {
        if (Obj[key] === -1 || Obj[key] == null) {
          Obj[key] = ''
        }
      })
    },
    nameIsEmpty() {
      if (this.isClick) {
        this.getCompanyFlag = true
      } else {
        if (this.openData.creditCode !== '') {
          this.getCompanyFlag = false
        } else {
          this.getCompanyFlag = true
        }
      }
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
    .fuBox{
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
            .closeBtn {
                cursor: pointer;
                i {
                size: 14px;
                }
            }
            }
            .main {
              width: 100%;
              padding-top: 20px;
              padding-right: 20px;
              .basic{
                  width: 100%;
                  // padding:20px ;
                  overflow: hidden;
                  .address{
                      width: 32%;
                      margin-bottom: 10px;
                  }
              }
              .record{
                  // padding: 20px;
                      ::v-deep .el-table td, .el-table th{
                      padding: 5px 0;
                  }
              }
              .block {
                  text-align: right;
                  margin: 0 10px 0 0;
                  }
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
                ::v-deep .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
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
.idcard{
            display: flex;
            justify-content: space-between;
        }
.openBoxadd {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  translate: all 1s;
  background: rgba($color: #000000, $alpha: 0.5);
  .addBoxadd {
    box-sizing: border-box;
    width: 450px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 5px;
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
      .closeBtn {
        cursor: pointer;
        i {
          size: 16px;
        }
      }
    }
    .main {
      width: 100%;
      padding-top: 20px;
      ::v-deep .el-select{
          width: 100%;
      }
      ::v-deep .el-form-item{
         margin-bottom: 15px!important;
      }
      ::v-deep .el-form-item__content{
          width: 60%;
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
    }
    .footer {
      text-align: center;
    //   margin-top: 30px;
      padding-bottom: 20px;
    }
  }
}
</style>
