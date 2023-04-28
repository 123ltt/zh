<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-size="10">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="90px" class="no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="更新批次号" prop="feedNo">
                <el-input v-model="form.feedNo" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台" prop="feedPlatform">
                <el-select v-model="form.feedPlatform" filterable clearable placeholder="请选择" class="g-w100" @change="search">
                  <el-option v-for="(item,index) in feedPlatformOption" :key="index" :value="item.candidateDisplayName" :label="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="更新状态" prop="feedStatus">
                <el-select v-model="form.feedStatus" filterable clearable placeholder="请选择" class="g-w100" @change="search">
                  <el-option v-for="(value, key) in feedStatusOption" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="添加时间" prop="updateType">
                <div class="d-flex">
                  <el-date-picker v-model="form.createTimeStart" type="datetime" default-time="00:00:00" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" /><span class="ms-1 me-1">-</span>
                  <el-date-picker v-model="form.createTimeEnd" type="datetime" default-time="23:59:59" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="更新类型" prop="feedType">
                <el-select v-model="form.feedType" filterable clearable placeholder="请选择" class="g-w100" @change="search">
                  <el-option v-for="(value, key) in feedTypeOption" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="添加人" prop="createUser">
                <g-select v-model="form.createUser" :items="userList" key-field="id" label-field="nameJobNumber" value-field="id" class="g-w100" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="content" label="更新结果" class="log-listing">
        <template v-slot="{ row }">
          <template>
            <template v-if="row.count">
              <span class="d-inlineblock">总数 {{ row.count || 0 }}</span>
              <span class="d-inlineblock ms-4">成功 {{ row.successNum || 0 }}</span>
              <span class="d-inlineblock ms-4">失败 {{ row.errorNum || 0 }}</span>
              <span class="d-inlineblock ms-4">进行中 {{ row.count - row.successNum - row.errorNum || 0 }}</span>
            </template>
          </template>
          <template v-if="row.feedStatus===3">{{ row.feedContent }}</template>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" class="log-listing" width="180">
        <template v-slot="{ row }">
          <template v-if="row.feedStatus!==1">
            <el-button v-if="$auth('common_detail')" type="text" @click="handlerLog(row)">查看更新结果</el-button>
            <el-button v-if="$auth('common_down')" type="text" @click="handlerDown(row)">下载结果</el-button>
          </template>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { batchfeedList, batchFeedType, platformOption, batchfeedDown } from '@/api/common.js'
import { getUserList } from '@/api/amazon/amazon'
import batchLog from './batchLog.vue'
import { dowloadExc } from '@/util/util'
const formObj = () => {
  return {
    feedNo: undefined,
    createTimeStart: null,
    createTimeEnd: null,
    createUser: null,
    feedPlatform: null,
    feedStatus: null,
    feedType: null,
    feedResult: null,
    descs: 'create_time'
  }
}
export default {
  name: 'LmsCommonCommon',
  data() {
    return {
      userList: [],
      userListCache: [],
      headers: [
        {
          type: 'selection'
        },
        {
          label: '更新批次号',
          prop: 'feedNo',
          width: 100
        },
        {
          label: '平台',
          prop: 'feedPlatform',
          formatter: (row, column, cellValue, index) => {
            return this.feedPlatformOption.filter(item => item.candidateDisplayName === row.feedPlatform).map(item => item.displayName)
          },
          width: 100
        },
        {
          label: '更新类型',
          prop: 'feedType',
          formatter: (row, column, cellValue, index) => {
            return this.feedTypeList[Number(row.feedType) - 1]
          },
          width: 100
        },
        {
          label: '更新状态',
          prop: 'feedStatus',
          formatter: (row, column, cellValue, index) => {
            return ['未开始', '进行中', '异常', '已完成'][(row.feedStatus) - 1]
          },
          width: 100
        },
        {
          slot: true,
          slotName: 'content'
        },
        {
          label: '添加人',
          prop: 'createUserName',
          width: 140
        },
        {
          label: '添加时间',
          prop: 'createTime',
          width: 130
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      feedPlatformOption: [],
      feedTypeOption: {},
      feedResultOption: { 1: '全部成功', 2: '部分成功', 3: '全部失败' },
      feedStatusOption: { 1: '未开始', 2: '进行中', 3: '异常', 4: '已完成' },
      form: formObj(),
      updateTypes: {},
      operationTypes: {},
      feedTypeList: []
    }
  },
  created() {
    this.getUserList()
    this.getBatchFeedType()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getPlatformOption()
  },
  methods: {
    // 创建人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.userList = records
        this.userListCache = [...records]
      })
    },
    getBatchFeedType() {
      batchFeedType().then(res => {
        this.feedTypeList = Object.values(res.data)
        this.feedTypeOption = res.data
      })
    },
    handlerDown(item) {
      const name = `${item.feedNo}.xlsx`
      batchfeedDown({ id: item.id }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
      })
    },
    // 平台下拉列表
    getPlatformOption() {
      platformOption().then(res => {
        this.feedPlatformOption = res.data
      })
    },
    handlerLog(row) {
      this.$newTab({
        path: '/lms/batchLog',
        title: '查看更新结果',
        component: batchLog,
        data: {
          feedId: row.id,
          feedStatusOption: this.feedStatusOption
        },
        clearCache: true
      })
    },
    fetch({ current, size }, params) {
      return batchfeedList({ current, size, ...params }).then(res => {
        const data = res.data
        return {
          records: data.records, // 列表数据
          total: data.total, // 总记录数
          size: data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.userList = []
      this.form = formObj()
      this.search()
      this.$nextTick(() => {
        this.userList = this.userListCache
      })
    }
  }
}
</script>

<style lang="scss">
.log-listing-content {
  width: 450px;
  max-height: 500px;
  overflow-y:auto;
  overflow-x: hidden;
  line-height: 20px;
}
</style>
