<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <template slot="header">
        <el-form ref="formName" :inline="true" :model="form" size="mini">
          <el-form-item label="平台" prop="platform">
            <el-select v-model="form.platform" filterable @change="storeChange">
              <el-option v-for="item in platformList" :key="item.hiddenValue" :label="item.platformEnName" :value="item.platformEnName" />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺" prop="accountCodes">
            <el-select v-model="form.accountCodes" :disabled="!form.platform" collapse-tags multiple filterable>
              <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="resetForm('formName')">清空</el-button>
            <el-button type="primary" @click="openModal('add')">添加域名</el-button>
            <el-button v-if="$auth('common_impo')" type="primary" :disabled="requestFlag" @click="handleImport">下载模板/导入</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table-column slot="handSlot" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openModal('edit',scope.row)">编辑</el-button>
          <el-button type="text" @click="openJournal(scope.row)">日志</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import siteModal from './modal/siteModal.vue'
import journalModal from './modal/journalModal.vue'
import tempImport from './modal/tempImport.vue'
import { optionsWithPlatformCode } from '@/api/amazon/amazon.js'
import { imglist, platformAll } from '@/api/common.js'
export default {
  data() {
    return {
      form: {
        platform: null,
        accountCodes: null
      },
      headers: [
        { type: 'index', label: '序号' },
        { prop: 'platform', label: '平台' },
        { prop: 'account', label: '店铺' },
        { prop: 'imageDomain', label: '图片域名' },
        { prop: 'updateTime', label: '更新时间' },
        { slot: true, slotName: 'handSlot' }
      ],
      platformList: [],
      storeList: [],
      requestFlag: false
    }
  },
  mounted() {
    this.getData()
    platformAll({
      current: 1,
      size: 100
    }).then(res => {
      this.platformList = res.data.records
    })
  },
  methods: {
    search() {
      this.getData()
    },
    storeChange() {
      const platformCode = this.platformList.filter(item => item.platformEnName === this.form.platform)[0].platformCode
      optionsWithPlatformCode({ platformCode: platformCode }).then(res => {
        this.storeList = res.data
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getData() {
      let params = {}
      params = Object.assign({}, this.form)
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return imglist({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    openJournal(row) {
      this.$modal({
        component: journalModal,
        title: '日志',
        data: { id: row.id }
      })
    },
    openModal(type, row) {
      const { platformList } = this
      const title = type === 'add' ? '添加站点' : '编辑站点'
      this.$modal({
        component: siteModal,
        title: title,
        width: '30%',
        data: { type, platformList, row },
        callback: (data) => {
          data && this.search()
        }
      })
    },
    handleImport() {
      this.requestFlag = true // 用户点击了按钮，按钮置为disabled防止重复点击
      this.$modal({
        title: '下载模板/导入',
        component: tempImport,
        data: {
          siteOption: this.siteOption
        },
        callback: (refresh) => {
          this.requestFlag = false // 请求回来且方法执行完，按钮恢复可点击状态
          refresh && this.search()
        }
      })
    }
  }
}
</script>

<style>

</style>
