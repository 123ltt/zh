<template>
  <basic-container>
    <div class="comp-box">
      <div class="comp-head" @click="compDown = !compDown">
        <div class="comp-title">基础信息</div>
        <el-button :icon="compDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
      </div>
      <el-row v-if="compDown" style="width:70%;margin: auto;">
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">平台</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.platformName || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">站点</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.siteCode || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">店铺名</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.name || '-' }}</div>
        </el-col>
        <el-col v-if="isPlatformCode" :span="12" class="el-form-item">
          <span class="el-form-item__label">刊登站点</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.sitePublishIds || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">是否FBA店铺</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.isFba?'是':'否' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">所属组织</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.organizationId || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">FBA店铺库存</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.fbaStock || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">收款币种</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.receiptCurrencyCode || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">申购/注册日期</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.bidDate || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">添加时间</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.createTime || '-' }}</div>
        </el-col>
        <el-col :span="24" class="el-form-item">
          <span class="el-form-item__label" style="width:116px">备注</span>
          <div class="el-form-item__content">{{ formObj.baseInfo.remark || '-' }}</div>
        </el-col>
      </el-row>
      <div class="comp-head" @click="operateDown = !operateDown">
        <div class="comp-title">运营信息</div>
        <el-button :icon="operateDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
      </div>
      <el-row v-if="operateDown" style="width:70%;margin: auto;">
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">销售人员</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.mainSellerName || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">客服人员</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.customerServiceName || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">类目</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.categoryIds }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">产品线</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.productLineId || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">外部SKU前缀</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.externalSkuPrefix || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">店铺链接</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.storeUrl || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">水印码</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.watermark || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">店铺邮箱</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.storeEmail || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">刊登利润率</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.publishGrossProfitRate || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">网络类型</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.net }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">IP</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.ip || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">店铺风险等级</span>
          <div class="el-form-item__content">{{ formObj.registerInfo.storeRiskLevel }}</div>
        </el-col>
        <el-col :span="24" class="el-form-item">
          <span class="el-form-item__label">使用的品牌</span>
          <div class="el-form-item__content">{{ formObj.operationInfo.trademarkNames || '-' }}</div>
        </el-col>
      </el-row>
      <div class="comp-head" @click="registerDown = !registerDown">
        <div class="comp-title">注册信息</div>
        <el-button :icon="registerDown?'el-icon-arrow-up':'el-icon-arrow-down'" type="text" />
      </div>
      <el-row v-if="registerDown" style="width:70%;margin: auto;">
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">公司名称/个人</span>
          <div class="el-form-item__content">{{ formObj.registerInfo.companyName || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">电话</span>
          <div class="el-form-item__content">{{ formObj.registerInfo.phone || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">公司类型</span>
          <div class="el-form-item__content">{{ formObj.registerInfo.type || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">注册日期</span>
          <div class="el-form-item__content">{{ formObj.registerInfo.registerTime || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">信用卡卡号</span>
          <div class="el-form-item__content">{{ formObj.registerInfo.ccNumber || '-' }}</div>
        </el-col>
        <el-col :span="12" class="el-form-item">
          <span class="el-form-item__label">信用卡有效期</span>
          <div class="el-form-item__content">{{ formObj.registerInfo.ccExpirationDate || '-' }}</div>
        </el-col>

      </el-row>
    </div>
  </basic-container>
</template>

<script>
import { approveDetails, companyOptions } from '@/api/storeAudit'
import { companyDetail } from '@/api/companyInfo'
import { compList, dictionary, getCategorListLevel1 } from '@/api/public'
import { queryLine } from '@/api/pms'

export default {
  name: 'ApplyDetails',
  filters: {
    filterNet(val) {
      let text = ''
      switch (val) {
        case '1':
          text = '本地登陆'
          break
        case '2':
          text = '阿里云'
          break
        case '3':
          text = '华为云'
          break
      }
      return text
    }
  },
  props: {
    compId: {
      type: String
    }
  },
  data() {
    return {
      compDown: true,
      operateDown: true,
      registerDown: true,
      sitePublishCode: ['EB', 'LZ'],
      storeRiskLevelOption: [{ label: '低级', value: 1 }, { label: '中级', value: 2 }, { label: '高级', value: 3 }],
      formObj: {
        baseInfo: {},
        operationInfo: {},
        registerInfo: {}
      },
      showSiteCode: ['WH', 'SM', 'LZ'],
      findForm: {
        productLineOption: {}
      },
      compOption: []

    }
  },
  computed: {
    // 是否显示
    isShowSite() {
      return this.showSiteCode.includes(this.formObj.baseInfo.platformCode)
    },
    isPlatformCode() {
      return this.sitePublishCode.includes(this.formObj.baseInfo.platformCode)
    }
  },
  mounted() {
    if (this.compId) {
      this.getApproveDetails()
    }
  },
  methods: {
    getApproveDetails() {
      approveDetails({ id: this.compId }).then(res => {
        const data = res.data
        data.operationInfo.trademarkNames = data.operationInfo.trademarkNames && data.operationInfo.trademarkNames.join()
        data.baseInfo.sitePublishIds = data.baseInfo.sitePublishList.map(item => item.siteCode).join(',')
        data.registerInfo.storeRiskLevel = parseInt(data.registerInfo.storeRiskLevel)
        const storeRiskLevel = this.storeRiskLevelOption.filter(item => item.value === data.registerInfo.storeRiskLevel)
        data.registerInfo.storeRiskLevel = storeRiskLevel.length ? storeRiskLevel[0].label : '-'
        if (data.baseInfo.bidDate && data.baseInfo.bidDate.indexOf('00:00:00') > -1) {
          data.baseInfo.bidDate = data.baseInfo.bidDate.split('00:00:00')[0]
        }
        if (data.registerInfo.ccExpirationDate && data.registerInfo.ccExpirationDate.indexOf('00:00:00') > -1) {
          data.registerInfo.ccExpirationDate = data.registerInfo.ccExpirationDate.split('00:00:00')[0]
        }
        data.registerInfo.companyId && this.companyDetail(data.registerInfo.companyId)
        this.formObj = data
        this.getCompList()
        this.getCompanyOptions()

        this.getCategorAll()
        this.getQueryLine()
        this.dictionary('sams_net_type')
      })
    },
    // 获取公司信息
    getCompanyOptions() {
      companyOptions().then(res => {
        const data = res.data
        this.findForm.companyOption = data
        if (this.formObj.registerInfo.companyId) {
          this.formObj.registerInfo.companyId = this.formObj.registerInfo.companyId === 0 ? '' : this.formObj.registerInfo.companyId
          const filterCompId = this.findForm.companyOption.filter(acc => acc.hiddenValue === this.formObj.registerInfo.companyId + '')
          this.formObj.registerInfo.companyId = filterCompId && filterCompId.length ? filterCompId[0].displayName : ''
        }
      })
    },
    // 店铺公司详情
    companyDetail(id) {
      companyDetail({ id: id }).then(res => {
        const data = res.data
        this.formObj.registerInfo.companyName = data.name
        const registerTime = data.regDate
        this.formObj.registerInfo.type = typeof data.type === 'number' ? data.type + '' : data.type
        this.formObj.registerInfo.nature = data.nature
        data.type && this.dictionary('sams_company_type')
        data.nature && this.dictionary('sams_company_nature')
        this.formObj.registerInfo.registerTime = registerTime && registerTime.split('00:00:00')[0]
      })
    },
    // 产品线
    getQueryLine() {
      queryLine({ current: 1, size: 9999 }).then(res => {
        const data = res.data
        this.findForm.productLineOption = data.records
        data.records.forEach(acc => {
          if (acc.id === this.formObj.operationInfo.productLineId) {
            this.formObj.operationInfo.productLineId = acc.lineName
          }
        })
      })
    },
    // 组织架构列表
    getCompList() {
      compList({ category: 2 }).then(res => {
        const data = res.data
        this.findForm.compOption = data
        if (this.formObj.baseInfo.organizationId) {
          const filterCompId = data.filter(item => item.id === this.formObj.baseInfo.organizationId + '')
          this.formObj.baseInfo.organizationId = filterCompId && filterCompId.length ? filterCompId[0].orgName + '' : ''
          if (!this.formObj.baseInfo.organizationId) {
            this.formObj.operationInfo.mainSellerName = ''
            this.formObj.operationInfo.customerServiceName = ''
          }
        }
      })
    },
    // 类目
    getCategorAll() {
      getCategorListLevel1().then(res => {
        const data = res.data
        const categoryIds = this.formObj.operationInfo.categoryIds
        const categoryNames = []
        if (categoryIds && categoryIds.length) {
          data.forEach(item => {
            if (categoryIds.indexOf(item.id) > -1) {
              categoryNames.push(item.name)
            }
          })
        }
        this.formObj.operationInfo.categoryIds = categoryNames.length ? categoryNames.join() : '-'
        this.$set(this.formObj, this.formObj.operationInfo, this.formObj.operationInfo.categoryIds)
      })
    },
    // 字典
    dictionary(code) {
      dictionary({ code: code }).then(res => {
        const arr = res.data
        switch (code) {
          case 'sams_company_nature':
            arr.forEach(item => {
              if (item.hiddenValue === this.formObj.registerInfo.nature) {
                this.formObj.registerInfo.nature = item.displayName
              }
            })
            break
          case 'sams_company_type':
            arr.forEach(item => {
              if (item.hiddenValue === this.formObj.registerInfo.type) {
                this.formObj.registerInfo.type = item.displayName
                this.$forceUpdate()
              }
            })
            break
          case 'sams_net_type':
            if (this.formObj.operationInfo.net) {
              var filterNet = arr.filter(acc => acc.hiddenValue === this.formObj.operationInfo.net)
              if (filterNet && filterNet.length) {
                this.formObj.operationInfo.net = filterNet[0].displayName
              }
            }
            break
          case 'sams_yes_or_not':
            this.findForm.fbaOption = arr
            break
        }
      })
    }

  }

}
</script>
<style lang="scss" scoped>
.m-t-20 {
  margin-top: 20px;
}
.close-icon {
  z-index: 2;
}
.el-form-item{
  display: flex;
  }
.el-form-item__label {
  display: inline-block;
  line-height: 30px;
  width: 120px;
}
.el-form-item__content {
  word-wrap: break-word;
  word-break: normal;
  word-break:break-all;
  color: #999;
  width: 73%;
  line-height: 30px;
}
.el-form {
  padding-right: 20px;
}
</style>
