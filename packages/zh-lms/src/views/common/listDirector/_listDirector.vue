<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" :page-size="10">
      <template slot="header">
        <SearchHead ref="searchDataRef" :form-attrs="formAttrs" :search-data="searchData" :store-list="autoList" :model="searchData" value-format="yyyy-MM-dd HH:mm:ss" @toggleListingType="search()">
          <el-form-item slot="feedPlatform" prop="feedPlatform" label-width="0">
            <el-select v-model="searchData.feedPlatform" filterable clearable @change="platformChange">
              <el-option v-for="item in siteOption" :key="item.candidateDisplayName" :label="item.displayName" :value="item.candidateDisplayName" />
            </el-select>
          </el-form-item>
          <el-form-item slot="btn" label-width="0">
            <el-button type="primary" @click="search()">搜索</el-button>
            <el-button @click="resetForm('searchDataRef')">重置</el-button>
            <el-button v-if="$auth('director_add')" @click="handleEdit()">重新分配负责人</el-button>
          </el-form-item>
        </SearchHead>
      </template>
      <el-table-column slot="handler" label="操作">
        <template v-slot="{row}">
          <el-button v-if="$auth('director_edit')" type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="$auth('director_record')" type="text" @click="handleView(row.id)">日志</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import SearchHead from '../../components/searchHead/index.vue'
import viewModal from './components/viewModal.vue'
import editModel from './components/editModel.vue'
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import { platformOption, listingUserFeedList } from '@/api/common.js'

export default {
  name: 'LmsCommonListDirector',
  components: { SearchHead },
  data() {
    return {
      searchData: {
        account: '',
        accountCode: '',
        accounts: [],
        createUser: null,
        feedPlatform: '',
        feedStatus: null,
        updateTimeEnd: '',
        updateTimeStart: ''
      },
      autoList: [],
      feedPlatform: '',
      formAttrs: [
        { slot: 'feedPlatform', span: 5, label: '平台' },
        { slot: 'selectStore', type: 'selectStore', span: 6, label: '店铺', prop: 'accounts' },
        {
          label: '状态',
          span: 5,
          prop: 'feedStatus',
          attrs: { clearable: true, filterable: true },
          type: 'select',
          items: (cb) => cb(this.isStateOption),
          events: {
            change: () => {
              this.search()
            }
          }
        },
        { slot: 'selectUser', type: 'selectUser', span: 5, label: '操作人' },
        { slot: 'dateTime', type: 'dateTime', prop: 'dateTime', span: 9, label: '更新时间', dateTimeStart: 'updateTimeStart', dateTimeEnd: 'updateTimeEnd' },
        { slot: 'btn', span: 8 }
      ],
      headers: [
        { type: 'index', label: '序号' },
        { prop: 'feedPlatform', label: '平台' },
        { prop: 'account', label: '店铺' },
        { prop: 'originalSaleUserName', label: '原负责人' },
        { prop: 'newSaleUserName', label: '指定新负责人' },
        { prop: 'updateTime', label: '更新时间' },
        {
          prop: 'feedStatus',
          label: '状态',
          formatter: (row, column, cellValue, index) => {
            return this.isStateOption.find(item => item.value === row.feedStatus).label
          }
        },
        { prop: 'createUserName', label: '操作人' },
        { slot: true, slotName: 'handler' }
      ],
      siteOption: [],
      isStateOption: [{ label: '待处理', value: 1 }, { label: '处理中', value: 2 }, { label: '失败', value: 3 }, { label: '成功', value: 4 }]
    }
  },
  mounted() {
    this.feedPlatformOption()
    this.refresh()
  },
  methods: {
    fetch({ current, size }, params) {
      return listingUserFeedList({ current, size }, params).then(res => {
        const data = res.data
        const records = data.records.map(item => {
          item.feedPlatform = this.siteOption.find(its => its.candidateDisplayName === item.feedPlatform).displayName
          return item
        })
        return {
          records: records, // 列表数据
          total: data.total, // 总记录数
          size: data.size // 每页最大记录数
        }
      })
    },
    platformChange(val) {
      if (val) {
        optionsWithPlatformCode({ platformCode: val }).then(res => {
          this.autoList = res.data
        })
      }
    },
    feedPlatformOption(resolve) {
      platformOption().then(res => {
        const data = res.data
        data.forEach(item => {
          item.label = item.displayName
          item.value = item.hiddenValue
        })
        this.siteOption = data
      })
    },
    handleEdit(row) {
      this.$modal({
        title: row?.id ? '编辑' : '重新分配负责人',
        component: editModel,
        data: {
          row: row,
          siteOption: this.siteOption
        },
        callback: refresh => {
          refresh && this.refresh()
        }
      })
    },
    handleView(id) {
      this.$modal({
        title: '日志',
        component: viewModal,
        height: '480px',
        data: {
          id: id
        }
      })
    },
    refresh() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.refresh()
    },
    resetForm(formName) {
      this.searchData = {}
      this.$refs[formName].resetSearch()
      this.searchData.feedPlatform = ''
      this.refresh(1)
    }
  }

}
</script>

<style>

</style>
