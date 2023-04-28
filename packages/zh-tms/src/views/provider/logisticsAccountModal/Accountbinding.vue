<!-- 线上发货配置 新增/编辑-->
<template>
  <basic-container v-loading="loading" class="configurationAddEdit">
    <el-form ref="rulesForm" :rules="rules" size="mini" :model="configurationInfo" label-width="150px">
      <el-row :gutter="10">
        <el-form-item label="租户ID" prop="tenantId">
          <span>{{ configurationInfo.tenantId }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="店铺编码:" prop="storeCode">
          <span>{{ configurationInfo.storeCode }}</span>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-form-item label="物流账号：" prop="name">
          <g-select v-model="configurationInfo.name" :items="filterServiceList" key-field="id" label-field="name" value-field="id" clearable :item-title="true" @change="getID" />
        </el-form-item>
      </el-row>
      <el-row>
        <div class="float-end me-1">
          <el-button size="mini" type="primary" @click="close(false)">取消</el-button>
          <el-button size="mini" type="primary" @click="define()">确认</el-button>
        </div>
      </el-row></el-form>
  </basic-container>
</template>
<script>
import { getAccountList } from '@/api/acBinding'// 物流账号下拉列表接口
import { binding } from '@/api/logisticsAccount'// 导入账户绑定接口
export default {
  name: 'ConfigurationAddEdit',
  props: {
    row: Object
  },
  data() {
    return {
      loading: false,
      itemTitle: true,
      onlineChannelList: [], //  继续筛选线下渠道列表
      filterServiceList: [], // 物流账号数组
      rules: {
        name: [{ required: true, message: '请输入物流账号', trigger: 'change' }]
      }

    }
  },
  created() {
    this.getData()
    this.configurationInfo = this.row
  },

  methods: {
    // 弹框取消按钮
    close(val) {
      this.$parent.$emit('close', val)
    },
    // 选中物流账号事件
    getID() {
      this.configurationInfo.accountId = this.configurationInfo.name
    },
    // 弹框确定按钮
    define() {
      // 表单验证
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          // 调绑定接口----传参
          binding(this.configurationInfo).then(res => {
            this.$message.success(res.msg)
          })
          this.$parent.$emit('close', true)
        }
      })
    },

    getData() {
      getAccountList().then(res => {
        res.data.forEach(item => {
          if (this.row.platformCode === item.platformCode) {
            this.filterServiceList.push(item)
          }
        })
      })
      getAccountList().then(res => {
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.configurationAddEdit{

  &.basic-container{
    min-width:600px!important;
    .el-input{
      width:90%
    }

    .g-select{
      width:90%
    }
  }
}
</style>
