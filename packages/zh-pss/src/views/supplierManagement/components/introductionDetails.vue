<template>
  <basic-container>
    <el-collapse v-model="activeNames" v-loading="loading">
      <el-collapse-item title="基本信息" name="1">
        <el-card>
          <el-form size="mini" label-width="100px" class="no-message">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="引入原因">
                  <el-input :value="importReason" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用代码">
                  <el-input :value="detail.creditCode" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称">
                  <el-input :value="detail.supplierName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人代表">
                  <el-input :value="detail.legalEntity" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="企业状态">
                  <el-input :value="detail.enterpriseStatus" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注册时间">
                  <el-input :value="detail.registerTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="公司性质">
                  <el-input :value="companyType" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否能开票">
                  <el-input :value="ifInvoice" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="自有品牌">
                  <el-input :value="isHasbrand" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否能定制服务">
                  <el-input :value="isCustom" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否包邮">
                  <el-input :value="isFreeship" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="经营模式">
                  <el-input :value="manageModel" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="网店链接">
                  <el-input :value="detail.webSite" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主营产品类目">
                  <el-input :value="mainCategory" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="合作产品">
                  <el-input :value="detail.operationProduct" :autosize="{ minRows: 2, maxRows: 4}" disabled type="textarea" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="主营产品">
                  <el-input :value="detail.mainProduct" :autosize="{ minRows: 2, maxRows: 4}" disabled type="textarea" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公司地址">
                  <el-input :value="company" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工厂地址">
                  <el-input :value="factory" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="公司简介">
                  <el-input :value="detail.companyIntroduction" :autosize="{ minRows: 2, maxRows: 4}" disabled type="textarea" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="合作范围">
                  <el-input :value="detail.cooperationScope" :autosize="{ minRows: 2, maxRows: 4}" disabled type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="联系人信息" name="2">
        <el-card>
          <el-table
            :data="tableList"
            max-height="400px"
            stripe
            style="width: 100%"
            class="g-table"
            size="mini"
            border
          >
            <el-table-column
              prop="duty"
              label="联系人职务"
              align="center"
              min-width="100"
            />
            <el-table-column
              prop="name"
              label="联系人名称"
              align="center"
              min-width="100"
            />
            <el-table-column
              prop="telphone"
              label="手机号/固定电话"
              align="center"
              min-width="150"
            />
            <el-table-column
              prop="contact"
              label="QQ/旺旺"
              align="center"
              min-width="150"
            />
            <el-table-column
              prop="mail"
              label="邮箱地址"
              align="center"
              min-width="170"
            />
          </el-table>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="资质证明" name="3">
        <el-card>
          <section class="record">
            <el-row>
              <el-col :span="8">
                <div class="imgbox">
                  <span class="introduce">营业执照</span>
                  <div class="idcard">
                    <el-image
                      :src="license"
                      :preview-src-list="[license]"
                      style="width: 140px; height: 100px;border: 1px solid #ccc;"
                    />
                  </div>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="imgbox">
                  <span class="introduce">其他</span>
                  <div class="idcard">
                    <ul class="imgBox">
                      <li v-for="(item,index) in imgList" :key="index">
                        <el-image
                          :src="item.link"
                          :preview-src-list="[item.link]"
                          style="width: 140px; height: 100px;border: 1px solid #ccc;"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </el-col>
            </el-row>
          </section>
        </el-card>
      </el-collapse-item>
      <el-collapse-item v-if="isAudit[1]" title="合同签订" name="4">
        <el-card>
          <el-form size="mini" label-width="100px" class="no-message">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="申请人">
                  <el-input :value="contract.submitUserName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请时间">
                  <el-input :value="contract.submitTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核人">
                  <el-input :value="contract.updateUserName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核时间">
                  <el-input :value="contract.updateTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核结果">
                  <el-input :value="statusShow" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签订时间">
                  <el-input :value="contract.updateTime" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签订合同">
                  <el-link :href="contract.contract">供应商合同.pdf</el-link>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核备注">
                  <el-input :value="contract.verifyComment" :autosize="{ minRows: 2, maxRows: 4}" disabled type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item v-if="isAudit[0]" title="引入审核" name="5">
        <el-card>
          <el-form :model="auditData" label-width="120px" size="mini">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="status">
                  <span slot="label">
                    <span style="color:red">*</span>
                    审核结果</span>
                  <el-select
                    ref="input"
                    v-model="auditData.status"
                    clearable
                    placeholder="请选择"
                    filterable
                  >
                    <el-option
                      v-for="item in addForm.statusList"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <span slot="label">
                    审核备注</span>
                  <el-input
                    v-model="auditData.verifyComment"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item style="text-align: center;">
                  <el-button
                    class="btn"
                    icon="el-icon-circle-close"
                    @click="toclose()"
                  >取消</el-button>
                  <el-button
                    class="btn"
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="confirm()"
                  >确认</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </basic-container>
</template>

<script>
import { getAuditDetail, audit, getDetail } from '@/api/supplierManagement/supplierIntroduction.js'

export default {
  name: 'IntroductionDetails',
  props: {
    addForm: Object,
    titleStr: String,
    isAudit: Array,
    listAddress: Array,
    detailData: Object // 父传子的表格参数
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      loading: false,
      detail: {},
      tableList: [],
      companyType: '',
      manageModel: '',
      mainCategory: '',
      isHasbrand: '',
      isCustom: '',
      importReason: '',
      ifInvoice: '',
      isFreeship: '',
      company: '',
      companyCountry: '',
      companyProvince: '',
      companyCity: '',
      factory: '',
      factoryCountry: '',
      factoryProvince: '',
      factoryCity: '',
      license: '',
      auditData: {
        status: '',
        verifyComment: ''
      },
      statusList: [
        { id: 3, name: '允许引入' },
        { id: 4, name: '拒绝引入' },
        { id: 2, name: '资料有误' }
      ],
      contract: {},
      statusShow: '',
      imgList: []
    }
  },
  mounted() {
    this.getDetailList()
    if (this.isAudit[1]) {
      this.getData()
    }
  },
  methods: {
    getValue(arr, val) {
      let matchingVal = ''
      arr.forEach(item => {
        if (+item.dictKey === +val) {
          matchingVal = item.dictValue
        }
      })
      return matchingVal
    },
    getYes(val) {
      if (+val === 1) {
        return '是'
      } else if (+val === 0) {
        return '否'
      } else {
        return ''
      }
    },
    getDetailList() {
      this.loading = true
      getDetail(this.detailData.id).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.detail = data
          this.tableList = data.supplierContacterVOList
          this.importReason = this.getValue(this.addForm.reasonList, data.importReason)
          this.manageModel = this.getValue(this.addForm.manageModelList, data.manageModel)
          this.addForm.mainCategorylList.forEach(item => {
            if (data.mainCategoryPath.split(',')[0] === item.value) {
              item.children.forEach(el => {
                if (data.mainCategoryPath.split(',')[1] === el.value) {
                  this.mainCategory = `${item.label} / ${el.label}`
                }
              })
            }
          })
          this.ifInvoice = this.getYes(data.ifInvoice)
          this.isCustom = this.getYes(data.isCustom)
          this.isFreeship = this.getYes(data.isFreeship)
          if (+data.isHasbrand === 1) {
            this.isHasbrand = '有'
          } else if (+data.isHasbrand === 0) {
            this.isHasbrand = '无'
          } else {
            this.isHasbrand = ''
          }
          if (+data.companyType === 1) {
            this.companyType = '公司'
          } else if (+data.companyType === 2) {
            this.companyType = '个体工商户'
          } else {
            this.companyType = ''
          }
          if (this.detail.companyIntroduction === '') {
            this.detail.companyIntroduction = '无'
          }
          if (this.detail.cooperationScope === '') {
            this.detail.cooperationScope = '无'
          }
          this.listAddress.forEach(item => {
            if (+item.id === +data.companyCountry) {
              this.companyCountry = item.name
              item.provinces.forEach(item1 => {
                if (+item1.id === +data.companyProvince) {
                  this.companyProvince = item1.name
                  item1.citys.forEach(item2 => {
                    if (+item2.id === +data.companyCity) {
                      this.companyCity = item2.name
                    }
                  })
                }
              })
            }
            if (+item.id === +data.factoryCountry) {
              this.factoryCountry = item.name
              item.provinces.forEach(item1 => {
                if (+item1.id === +data.factoryProvince) {
                  this.factoryProvince = item1.name
                  item1.citys.forEach(item2 => {
                    if (+item2.id === +data.factoryCity) {
                      this.factoryCity = item2.name
                    }
                  })
                }
              })
            }
          })
          this.license = data.license
          data.supplierFileVOList.forEach(item => {
            this.imgList.push({ link: item.link })
          })
          this.factory = this.factoryCountry + this.factoryProvince + this.factoryCity + this.detail.factoryAddress
          this.company = this.companyCountry + this.companyProvince + this.companyCity + this.detail.companyAddress
          this.loading = false
        } else {
          this.loading = false
          this.$message.error('加载失败!')
        }
      })
    },
    getData() {
      getAuditDetail(this.detailData.id).then(res => {
        if (res.code === 200) {
          const data = res.data.supplierInfoVO
          this.contract = data
          this.contract.verifyComment = res.data.verifyComment
          this.addForm.statusList.forEach(item => {
            if (+item.dictKey === +data.status) {
              this.statusShow = item.dictValue
            }
          })
        } else {
          this.$message.error('加载失败!')
        }
      })
    },
    toclose() {
      this.$emit('close')
    },
    confirm() {
      if (this.auditData.status === '') {
        this.$message.error('请选择审核结果!')
      } else {
        const obj = {
          supplierId: this.detailData.id,
          status: this.auditData.status,
          verifyComment: this.auditData.verifyComment
        }
        audit(obj).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.auditData.status = ''
          this.auditData.verifyComment = ''
          this.$emit('close', true)
        })
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
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
  .imgBox{
    width: 100%;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
      li{
        list-style: none;
        margin-right: 10px;
      }
  }
  .imgbox{
                        width: 100%;
                        display: flex;
                        .introduce{
                            width: 120px;
                            text-align: center;
                        }
                        .idcard{
                            img{
                                width: 250px;
                                height: 180px;
                            }
                        }
                    }
</style>
