<template>
  <basic-container>
    <el-row style="width:74%;margin: auto;">
      <el-col :span="12">
        <span class="el-form-item__label">销售人员</span>
        <div class="el-form-item__content">{{ formObj.mainSellerName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">客服人员</span>
        <div class="el-form-item__content">{{ formObj.customerServiceName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">销售主管</span>
        <div class="el-form-item__content">{{ mainSellerSupervisor|| '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">销售经理</span>
        <div class="el-form-item__content">{{ mainSellerManager|| '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">类目</span>
        <div class="el-form-item__content">{{ formObj.category || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">产品线</span>
        <div class="el-form-item__content">{{ formObj.productLine || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">外部SKU前缀</span>
        <div class="el-form-item__content">{{ formObj.externalSkuPrefix || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺链接</span>
        <div class="el-form-item__content">{{ formObj.storeUrl || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">水印码</span>
        <div class="el-form-item__content">{{ formObj.watermark || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺邮箱</span>
        <div class="el-form-item__content">{{ formObj.storeEmail || '-' }}</div>
      </el-col>

      <el-col :span="12">
        <span class="el-form-item__label">刊登利润率</span>
        <div class="el-form-item__content">{{ formObj.publishGrossProfitRate || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">网络类型</span>
        <div class="el-form-item__content">{{ formObj.netName || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">IP</span>
        <div class="el-form-item__content">{{ formObj.ip || '-' }}</div>
      </el-col>
      <el-col :span="12">
        <span class="el-form-item__label">店铺风险等级</span>
        <div class="el-form-item__content">{{ formObj.storeRiskLevel | filterStoreRiskLevel }}</div>
      </el-col>
      <el-col v-if="showIsLocalAccount" :span="12">
        <span class="el-form-item__label">是否是本土账号</span>
        <div class="el-form-item__content">{{ formObj.isLocalAccount?'是':'否' || '-' }}</div>
      </el-col>
      <el-col :span="showIsLocalAccount?12:24">
        <span class="el-form-item__label">使用的品牌</span>
        <div class="el-form-item__content">{{ formObj.trademark || '-' }}</div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { getStoreOperationInfoById } from '@/api/storeList'
import { supervisorManagerList } from '@/api/public'
export default {
  name: 'BaseicInfoDetails',
  filters: {
    filterStoreRiskLevel(val) {
      let text = ''
      switch (val) {
        case 1:
          text = '低级'
          break
        case 2:
          text = '中级'
          break
        case 3:
          text = '高级'
          break
      }
      return text
    }
  },
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
      mainSellerManager: '',
      mainSellerSupervisor: '',
      formObj: {
        mainSellerName: '',
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
      }
    }
  },
  computed: {
    showIsLocalAccount() {
      return ['EB'].includes(this.platformCode)
    }
  },
  mounted() {
    if (this.compId) {
      this.getStoreOperationInfoById()
    }
  },
  methods: {
    // 详情
    getStoreOperationInfoById() {
      getStoreOperationInfoById({ id: this.compId }).then(res => {
        this.formObj = res.data
        this.getSupervisorManagerList()
      })
    },
    // 销售主管 销售经理
    getSupervisorManagerList() {
      supervisorManagerList({ userId: this.formObj.mainSellerId }).then(res => {
        const data = res.data
        this.mainSellerManager = data.manager && data.manager[0].name + data.manager[0].jobNumber // 经理
        this.mainSellerSupervisor = data.supervisor && data.supervisor[0].name + data.supervisor[0].jobNumber // 主管
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
