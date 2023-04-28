<template>
  <basic-container v-loading="loading">
    <el-form size="mini" label-width="120px" class="no-message">
      <el-card shadow="never">
        <div slot="header">
          <span style="font-weight: 600;">基础信息</span>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input :value="supplier" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="访厂时间">
              <el-input :value="detail.visitTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="稽核人员">
              <el-input :value="auditors" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="陪同人员">
              <el-input :value="accompanying" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评分">
              <el-input v-model="detail.score" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-input :value="detail.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input :value="detail.createUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后修改时间">
              <el-input :value="detail.updateTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改人">
              <el-input :value="detail.updateUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="质量部评价">
              <el-input v-model="detail.qalDeptEvaluation" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" style="width:100%" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div slot="header">
          <span style="font-weight: 600;">实地/视频情况</span>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供货类型">
              <el-input :value="supplyTypeList[detail.supplierType]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂房面积">
              <el-input :value="detail.factoryArea" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工数">
              <el-input :value="detail.employeeNum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合作产品">
              <el-input v-model="detail.coopProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" style="width:100%" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主营产品">
              <el-input v-model="detail.mainProduct" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" style="width:100%" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="mainCoopCustomer" label="主要合作客户(至少头部3家)" label-width="210px">
              <el-input :value="detail.mainCoopCustomer" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" disabled style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否自营跨境平台" label-width="150px">
              <el-input :value="isList[detail.isCrossBorder]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否做侵权(违禁)产品" label-width="150px">
              <el-input :value="isList[detail.isTortiousContraband]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="能否签订框架协议" label-width="150px">
              <el-input :value="canList[detail.canSignAgreement]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否能开票" label-width="150px">
              <el-input :value="canList[detail.canInvoice]" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div slot="header">
          <span style="font-weight: 600;">研发设计能力</span>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌名称">
              <el-input :value="detail.brandName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="研发/设计师数量">
              <el-input :value="detail.designerNum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效专利数">
              <el-input :value="detail.patentInForceNum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="月上新能力">
              <el-input :value="detail.monthUpdateNum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实验设备是否包含核心设备" label-width="200px">
              <el-input :value="isList[detail.includeCoreEquipment]" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div slot="header">
          <span style="font-weight: 600;">质量保障</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有生产线" label-width="150px">
              <el-input :value="isList[detail.haveProductLine]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有半成品" label-width="150px">
              <el-input :value="isList[detail.haveSemiFinishedProduct]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="能否签订品质协议" label-width="150px">
              <el-input :value="canList[detail.canSignQalAgreement]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="能否签订质量标准书" label-width="150px">
              <el-input :value="canList[detail.canSignQalStd]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否通过质量管理体系" label-width="150px">
              <el-input :value="isList[detail.passQalManagementSys]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有独立品质部" label-width="150px">
              <el-input :value="isList[detail.independentQalDept]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检员数" label-width="150px">
              <el-input :value="detail.qalInspectorNum" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div slot="header">
          <span style="font-weight: 600;">访厂图片</span>
        </div>
        <el-row>
          <el-col :span="24">
            <upload-image v-if="getScc" :images.sync="imageList" :primary="false" :http-request="httpRequest" :limit="7" disabled :size="5242880" />
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/factoryVisitManagement/record.js'
import httpRequest from '@/api/common/upload'
import { UploadImage } from 'global-components'
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'

export default {
  name: 'RecordDetail',
  components: { UploadImage },
  props: {
    detailData: Object
  },
  data() {
    return {
      httpRequest,
      detail: {},
      imgList: [],
      accompanying: '',
      auditors: '',
      getScc: true,
      imageList: [],
      supplier: '',
      supplyTypeList: {},
      isList: ['否', '是'],
      canList: ['否', '能'],
      loading: false
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.getDetails(this.detailData.id)
  },
  methods: {
    getData() {
      this.loading = true
      // 供应商
      supplier().then(res => {
        this.supplierList = res.data
        this.supplier = this.supplierList.filter(item => { return item.supplierId === (this.detailData.supplierId + '') })[0].supplierName
        this.loading = false
      })
      // 经营模式
      getMyDictBiz('pss_supplier_type').then(res => {
        res.data.forEach(item => {
          this.supplyTypeList[item.dictKey] = item.dictValue
        })
      })
    },
    getDetails(val) {
      this.loading = true
      this.getScc = false
      this.imageList = []
      getDetail(val).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.detail = data
          data.files.forEach(item1 => {
            this.imageList.push({
              id: item1.id,
              url: item1.link,
              name: 'image' + item1.id
            })
          })
          const arr = []
          data.users.forEach(item => {
            if (item.type === 'auditor') {
              this.auditors = item.userRealName
            } else if (item.type === 'entourage') {
              arr.push(item.userRealName)
            }
          })
          this.accompanying = arr.join(',')
          this.getScc = true
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-card{
    box-shadow: none;
    border: none!important;
    ::v-deep .el-card__body{
      padding-bottom: 0px!important;
    }
}

</style>
