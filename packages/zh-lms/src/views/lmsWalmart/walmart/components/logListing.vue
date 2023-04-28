<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-size="20">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="100px" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="操作人" prop="createUser">
                <g-select v-model="form.createUser" :items="userList" key-field="id" label-field="nameJobNumber" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="更新类型" prop="updateType">
                <el-select v-model="form.updateType" clearable placeholder="请选择" style="width:100%;">
                  <el-option v-for="(value, key) in updateTypes" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作类型" prop="operationType">
                <el-select v-model="form.operationType" clearable placeholder="请选择" style="width:100%;">
                  <el-option v-for="(value, key) in operationTypes" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="content" label="内容" class="log-listing">
        <template v-slot="{ row }">
          <el-tooltip v-if="row.content && row.content.includes(':')" effect="dark" placement="top">
            <div slot="content">
              <div class="log-listing-content text-wrap" v-html="row.content" />
            </div>
            <pre style="height: 23px;overflow: hidden;text-overflow: ellipsis;" class="overflow-default overflow-hidden" v-html="row.content" />
          </el-tooltip>
          <div v-else>{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column slot="resultMsg" label="报错信息">
        <template v-slot="{ row }">
          <el-tooltip v-if="row.resultMsg" effect="dark" placement="top">
            <div slot="content">
              <div class="log-listing-content text-wrap" v-html="row.resultMsg" />
            </div>
            <pre style="height: 23px;overflow: hidden;text-overflow: ellipsis;" v-html="row.resultMsg" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column slot="index" label="序号" type="index" width="50" />
    </g-table>
  </basic-container>
</template>

<script>
import { getListingLog } from '@/api/walmart/log'
import { getMapLog } from '@/api/lmsCommon.js'
import { getUserList } from '@/api/ams.js'

export default {
  name: 'LmsWalmartCateManageLogListing',
  props: {
    walmartListId: { // listing id
      type: String,
      default: ''
    },
    sellerSku: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userList: [],
      userListCache: [],
      headers: [
        {
          slot: true,
          slotName: 'index'
        },
        {
          label: '更新类型',
          prop: 'updateType',
          width: 100
        },
        {
          label: '操作类型',
          prop: 'operationType',
          width: 100
        },
        {
          slot: true,
          slotName: 'content'
        },
        {
          label: '执行状态',
          prop: 'executeStatus',
          width: 100
        },
        {
          slot: true,
          slotName: 'resultMsg'
        },
        {
          label: '操作人',
          prop: 'createUserName'
        },
        {
          label: '操作时间',
          prop: 'createTime'
        }
      ],
      form: {
        relationId: this.walmartListId,
        relationSku: this.sellerSku,
        createUserName: '',
        updateType: '',
        operationType: '',
        descs: 'create_time'
      },
      updateTypes: {},
      operationTypes: {}
    }
  },
  created() {
    this.getMapLog('UPDATE_TYPE').then(res => {
      this.updateTypes = res
    })
    this.getMapLog('OPS_TYPE').then(res => {
      this.operationTypes = res
      delete this.operationTypes[5]
    })
    this.getUserList()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    getMapLog(value) {
      return getMapLog({ key: value }, 'walmart').then(res => res.data)
    },
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
    fetch({ current, size }, params) {
      if (!params.relationSku) {
        delete params.relationSku
      }
      return getListingLog({ current, size, ...params }).then(res => {
        const data = res.data.records
        data.forEach(value => {
          if (value.content) {
            // 替换分号，换行符，去掉p标签
            value.content = value.content.replace(/;/g, '<br/>').replace(/\n/g, '<br/>').replace(/<\/?p[^>]*>/gi, '')
          }
        })
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = Object.assign({}, {
        relationId: this.walmartListId,
        relationSku: this.sellerSku,
        descs: 'create_time'
      })
      this.userList = []
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
