<!-- 线上发货配置 新增/编辑-->
<template>
  <basic-container v-loading="loading" class="configurationAddEdit">
    <el-form ref="rulesForm" size="mini" :model="configurationInfo" label-width="150px">
      <el-row :gutter="10">
        <el-form-item label="所属平台:" prop="platformCode">
          <g-select
            v-model="configurationInfo.platformCode"
            :items="platformList"
            key-field="dictKey"
            label-field="dictValue"
            value-field="dictValue"
            clearable
            :item-title="itemTitle"
          />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="买家账号:" prop="buyerAccount">
          <el-input v-model="configurationInfo.buyerAccount" clearable maxlength="50" />
          <div>请填写买家账号，授权后将关联到所授权</div>
          <div>的1688买家账号，以便管理</div>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="App Keys:" prop="buyerNum">
          <el-input v-model="configurationInfo.appKey" clearable maxlength="50" />
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="App Secret:" prop="buyerNum">
          <el-input v-model="configurationInfo.appSecret" clearable maxlength="50" />
        </el-form-item>
      </el-row>
      <el-row>
        <div class="btn">
          <el-button size="mini" type="primary" @click="authorization()">去授权</el-button>
          <el-button size="mini" type="primary" @click="close(false)">取消</el-button>
        </div>
      </el-row>
    </el-form>
  </basic-container>
</template>
<script>
import { getPlatformInfo } from '@/api/orderListInfo'// 字典数据（平台，状态，付款方式）
import { accountAuth } from '@/api/orderSynchronization'// 账号授权
export default {
  name: 'OrderSynchronization',
  props: {

  },
  data() {
    return {
      loading: false,
      itemTitle: true,
      onlineChannelList: [], //  继续筛选线下渠道列表
      configurationInfo: { // 需要传递的参数
        platformCode: '', // 平台
        appKey: '',
        appSecret: '',
        buyerAccount: ''
      },
      platformList: []
    }
  },
  created() {
    this.getData()
  },

  methods: {
    // 弹框取消按钮
    close(val) {
      this.$parent.$emit('close', val)
    },
    // 弹框 授权
    authorization() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          this.loading = true
          accountAuth(this.configurationInfo).then(res => {
            // 拿到返回值地址，并且新开页面跳转
            window.open(res.data, '_blank')
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    getData() {
      getPlatformInfo({ code: 'purchase_platform' }).then(res => {
        this.platformList = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.configurationAddEdit{
  &.basic-container{
    min-width:400px!important;
    .el-input{
      width:40%
    }
    .g-select{
      width:40%
    }
   .btn{
    margin-left: 144px;
   }
  }
}
</style>
