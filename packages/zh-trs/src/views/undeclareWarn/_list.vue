<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <el-table-column slot="contractIdSlot" label="合同协议号">
        <template v-slot="{row}">
          <el-button type="text" @click="del(row.id)">{{ row.accountCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="purchaseIdSlot" label="采购编码">
        <template v-slot="{row}">
          <el-button type="text" style="display:block" @click="del(row.id)">{{ row.accountCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="deliverIdSlot" label="出库单号">
        <template v-slot="{row}">
          <el-row v-for="(item,index) in row.deliverId" :key="index">
            <el-button type="text" @click="del(row.id)">{{ item }}</el-button>
          </el-row>
        </template>
      </el-table-column>

      <template slot="header">
        <el-form ref="form" :inline="true" :model="form" size="mini">
          <el-row>
            <el-col :span="7">
              <el-form-item label="预报日期" prop="platform" class="ms-4">
                <el-date-picker
                  v-model="form.preDate"
                  style="width:177px;"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同协议号" prop="accountCodes">
                <!-- <el-select v-model="form.accountCodes" collapse-tags multiple filterable>
                  <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
                </el-select> -->
                <el-input v-model="form.accountCodes" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="货代公司" prop="accountCodes">
                <!-- <el-select v-model="form.accountCodes" collapse-tags multiple filterable>
                  <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
                </el-select> -->
                <el-input v-model="form.accountCodes" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="出库单号" prop="accountCodes" class="ms-4">
                <!-- <el-select v-model="form.accountCodes" collapse-tags multiple filterable>
                  <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
                </el-select> -->
                <el-input v-model="form.accountCodes" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="运输方式" prop="accountCodes" class="ms-3">
                <!-- <el-select v-model="form.accountCodes" collapse-tags multiple filterable>
                  <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
                </el-select> -->
                <el-input v-model="form.accountCodes" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row></el-form>
      </template>
      <!-- <el-table-column slot="handSlot" label="预报天数">
        <template v-slot="{row}">
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column> -->

    </g-table>
  </basic-container>
</template>

<script>
// import siteModal from './modal/siteModal.vue'
// import journalModal from './modal/journalModal.vue'
// import tempImport from './modal/tempImport.vue'
// import { optionsWithPlatformCode } from '@/api/amazon/amazon.js'
// import { imglist, platformAll } from '@/api/common.js'
// import { imglist } from '@/api/common.js'
export default {
  name: 'UndeclareWarn',
  data() {
    return {
      form: {
        preDate: null
      },
      headers: [
        { prop: 'preDate', label: '预报日期' },
        { slot: true, slotName: 'contractIdSlot' },
        { slot: true, slotName: 'purchaseIdSlot' },
        { prop: 'updateTime', label: '申报品名' },
        { prop: 'updateTime', label: '件数' },
        { prop: 'updateTime', label: '运输方式' },
        { prop: 'updateTime', label: '货代公司' },
        { prop: 'updateTime', label: '货件编号' },
        { slot: true, slotName: 'deliverIdSlot' },
        { prop: 'updateTime', label: '状态' },
        { prop: 'updateTime', label: '预报天数' }
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
    reset() {
      this.$refs.form.resetFields()
      this.form.preDate = null
      this.search()
    },
    search() {
      this.getData()
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
      //       updateUser: '1367779878467063809',
      //       deliverId: [1111]
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
      //       updateUser: '1367779878467063809',
      //       deliverId: [333, 444]
      //     }], // 列表数据
      //     total: 2, // 总记录数
      //     size: 20 // 每页最大记录数
      //   }
      // }).finally(() => {
      //   // this.loading = false
      // })
    },
    openModal(type, row) {
      // this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击
      // this.$modal({
      //   title: '下载模板/导入',
      //   component: tempImport,
      //   data: {
      //     siteOption: this.siteOption
      //   },
      //   callback: (refresh) => {
      //     this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
      //     refresh && this.search()
      //   }
      // })
    },
    handleExport() {
      // this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击
      // this.$modal({
      //   title: '下载模板/导入',
      //   component: tempImport,
      //   data: {
      //     siteOption: this.siteOption
      //   },
      //   callback: (refresh) => {
      //     this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
      //     refresh && this.search()
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-col{
  margin-bottom:-3px;
}
</style>
