<template>
  <basic-container>
    <el-row style="width:74%;margin: auto;">
      <el-col :span="12">
        <span class="el-form-item__label">平台</span>
        <div class="el-form-item__content">{{ formObj.platformName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">{{ isPlatformCode?'主站点':'站点' }}</span>
        <div class="el-form-item__content">{{ formObj.siteName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺名</span>
        <div class="el-form-item__content">{{ formObj.name || '-' }}</div>
      </el-col>
      <el-col v-if="isPlatformCode" :span="12">
        <span class="el-form-item__label">刊登站点</span>
        <div class="el-form-item__content">{{ formObj.sitePublishIds || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺编号</span>
        <div class="el-form-item__content">{{ formObj.code || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺评级</span>
        <div class="el-form-item__content">{{ formObj.storeGradeName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">平台店铺等级</span>
        <div class="el-form-item__content">{{ formObj.storeLevelName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺状态</span>
        <div class="el-form-item__content">{{ formObj.storeStatusName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">首单日期</span>
        <div class="el-form-item__content">{{ formObj.firstOrderDate || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">所属组织</span>
        <div class="el-form-item__content">{{ formObj.organizationCode || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">添加日期</span>
        <div class="el-form-item__content">{{ formObj.createTime || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">应收账款余额</span>
        <div class="el-form-item__content">{{ formObj.receivableBalance || '-' }} {{ formObj.receivableBalanceCurrency }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺租金</span>
        <div class="el-form-item__content">{{ formObj.rent || '-' }} {{ formObj.rentCurrencyCode }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">冻结/关闭时间</span>
        <div class="el-form-item__content">{{ formObj.freezeOrCloseDate || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">冻结/关闭金额</span>
        <div class="el-form-item__content">{{ formObj.freezeOrCloseMoney || '-' }} {{ formObj.freezeOrCloseMoneyCurrency }}</div>
      </el-col>
      <template v-if="formObj.isFba">
        <el-col :span="12">
          <span class="el-form-item__label">是否FBA店铺</span>
          <div class="el-form-item__content">{{ formObj.isFba?'是':'否' }}</div>
        </el-col>
        <el-col :span="12">
          <span class="el-form-item__label">FBA店铺库存</span>
          <div class="el-form-item__content">{{ formObj.fbaStock || '-' }}</div>
        </el-col>
      </template>
      <el-col :span="12">
        <span class="el-form-item__label">备注</span>
        <div class="el-form-item__content">{{ formObj.remark || '-' }}</div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { getBaseInfoById } from '@/api/storeList'
import { compList } from '@/api/public'
export default {
  name: 'BaseicInfoDetails',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    }
  },
  data() {
    return {
      formObj: {
        platformName: '',
        siteName: '',
        name: '',
        code: '',
        storeLevel: '',
        storeGrade: '',
        storeStatus: '',
        firstOrderDate: '',
        organizationId: '',
        organizationCode: '',
        createTime: '',
        receivableBalance: '',
        rent: '',
        freezeOrCloseDate: '',
        freezeOrCloseMoney: '',
        isFba: '',
        fbaStock: '',
        remark: ''
      },
      sitePublishCode: ['EB', 'LZ']
    }
  },
  computed: {
    isPlatformCode() {
      return this.sitePublishCode.includes(this.formObj.platformCode)
    }
  },
  mounted() {
    if (this.compId) {
      this.getBaseInfoById()
    }
  },
  methods: {
    // 详情
    getBaseInfoById() {
      getBaseInfoById({ id: this.compId }).then(res => {
        const data = res.data
        data.sitePublishIds = data.sitePublishList.map(item => item.siteCode).join(',')
        if (data.freezeOrCloseDate && data.freezeOrCloseDate.indexOf('00:00:00') > -1) {
          data.freezeOrCloseDate = data.freezeOrCloseDate.split('00:00:00')[0]
        }
        if (data.createTime && data.createTime.indexOf(' ') > -1) {
          data.createTime = data.createTime.split(' ')[0]
        }
        if (data.firstOrderDate && data.firstOrderDate.indexOf(' ') > -1) {
          data.firstOrderDate = data.firstOrderDate.split(' ')[0]
        }
        if (data.receivableBalance && data.receivableBalance != null) {
          data.receivableBalance = parseInt(data.receivableBalance) <= 0 ? '' : parseInt(data.receivableBalance)
        }
        if (data.rent && data.rent !== null) {
          data.rent = parseInt(data.rent) <= 0 ? '' : parseInt(data.rent)
        }
        if (data.freezeOrCloseMoney && data.freezeOrCloseMoney !== null) {
          data.freezeOrCloseMoney = parseInt(data.freezeOrCloseMoney) <= 0 ? '' : parseInt(data.freezeOrCloseMoney)
        }
        if (data.operatingCost && data.operatingCost !== null) {
          data.operatingCost = parseInt(data.operatingCost) <= 0 ? '' : parseInt(data.operatingCost)
        }
        this.formObj = res.data
        this.getCompList()
      })
    },
    // 组织架构列表
    getCompList() {
      compList({ category: 2 }).then(res => {
        const data = res.data
        if (this.formObj.organizationId) {
          data.forEach(acc => {
            if (acc.id === this.formObj.organizationId) {
              this.formObj.organizationCode = acc.orgName
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.m-t-20 {
  margin-top: 20px;
}
.close-icon {
  z-index: 2;
}
.el-form-item__label {
  display: inline-block;
}
.el-form-item__content {
  color: #999;
}
.el-form {
  padding-right: 20px;
}
</style>
