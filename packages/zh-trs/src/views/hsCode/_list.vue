<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :inline="true" :model="form" size="mini">
          <el-form-item label="HS编码" prop="platform">
            <el-input v-model="form.platform" type="text" />
          </el-form-item>
          <el-form-item label="名称" prop="accountCodes">
            <el-input v-model="form.accountCodes" type="text" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
            <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-download" :disabled="requestFlag" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table-column slot="handSlot" label="操作" width="55px">
        <template v-slot="{row}">
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import tempExport from './modal/export.vue'
// import { imglist } from '@/api/common.js'
export default {
  name: 'HsCode',
  data() {
    return {
      form: {
        platform: null,
        accountCodes: null
      },
      headers: [
        { prop: 'platform', label: 'HSCODE编码' },
        { prop: 'account', label: '名称' },
        { prop: 'imageDomain', label: '许可证代码' },
        { prop: 'updateTime', label: '出口退税率' },
        { prop: 'updateTime', label: '第一法定单位' },
        { prop: 'updateTime', label: '第二法定单位' },
        { prop: 'updateTime', label: '申报要素' },
        { slot: true, slotName: 'handSlot' },
        { prop: 'updateTime', label: '创建人' },
        { prop: 'updateTime', label: '修改时间' }
      ],
      platformList: [],
      storeList: [],
      requestFlag: false
    }
  },
  mounted() {
    this.getData()
    // platformAll({
    //   current: 1,
    //   size: 100
    // }).then(res => {
    //   this.platformList = res.data.records
    // })
  },
  methods: {
    search() {
      this.getData()
    },
    del(id) {
      this.$confirm('请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // TODO:调删除接口 然后刷新列表
        // carAttrSkuDel({ ids: id }).then(res => {
        //   this.$message.success(res.msg)
        //   this.search()
        // })
      })
    },
    storeChange() {
      // const platformCode = this.platformList.filter(item => item.platformEnName === this.form.platform)[0].platformCode
      // optionsWithPlatformCode({ platformCode: platformCode }).then(res => {
      //   this.storeList = res.data
      // })
    },
    getData() {
      let params = {}
      params = Object.assign({}, this.form)
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      // return imglist({ current, size, ...params }).then(res => {
      //   console.log(1111111)
      // }).catch(() => {
      //   return {
      //     records: [{
      //       account: 'finerysale',
      //       accountCode: 'ebay_007I',
      //       createDept: '-1',
      //       createTime: '2021-06-18 09:09:09',
      //       createUser: '1367779878467063809',
      //       id: '1405694034512449538',
      //       imageDomain: 'https://guic8593-pic.efinny.net',
      //       isDeleted: 0,
      //       platform: 'ebay',
      //       status: 1,
      //       updateTime: '2021-06-18 09:09:09',
      //       updateUser: '1367779878467063809'
      //     }, {
      //       account: 'guic8593',
      //       accountCode: 'ebay_007H',
      //       createDept: '-1',
      //       createTime: '2021-06-17 18:16:18',
      //       createUser: '1367779878467063809',
      //       id: '1405469341370740737',
      //       imageDomain: 'https://guic8593-pic.efinny.net',
      //       isDeleted: 0,
      //       platform: 'ebay',
      //       status: 1,
      //       updateTime: '2021-06-17 18:16:18',
      //       updateUser: '1367779878467063809'
      //     }], // 列表数据
      //     total: 2, // 总记录数
      //     size: 20 // 每页最大记录数
      //   }
      // }).finally(() => {
      //   // this.loading = false
      // })
    },
    openModal(type, row) {
      this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击
      this.$modal({
        title: '下载模板/导入',
        component: tempExport,
        data: {
          siteOption: this.siteOption
        },
        callback: (refresh) => {
          this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
          refresh && this.search()
        }
      })
    },
    handleExport() {
      this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击
      this.$modal({
        title: '导出',
        component: tempExport,
        data: {
          siteOption: this.siteOption
        },
        callback: (refresh) => {
          this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
          // refresh && this.search()
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.preDate = null
      this.search()
    }
  }
}
</script>

<style>

</style>
