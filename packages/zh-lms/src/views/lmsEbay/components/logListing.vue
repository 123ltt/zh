<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="100px" class="form-col no-message" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="操作人" prop="optUser">
                <g-select v-model="form.optUser" :items="userList" key-field="id" label-field="nameJobNumber" value-field="name" class="w-100" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="更新类型" prop="updateType">
                <el-select v-model="form.updateType" clearable placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in updateTypes" :key="item" :value="item" :label="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作类型" prop="optType">
                <el-select v-model="form.optType" clearable placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in operationTypes" :key="item" :value="item" :label="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
                <el-button size="mini" @click="resetForm('form')">清空</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="content" label="内容" width="300" class="log-listing">
        <template v-slot="{ row }">
          <el-tooltip v-if="row.optContent && row.optContent.includes(':')" effect="dark" placement="top-start">
            <div slot="content">
              <div class="log-listing-content text-wrap" v-html="row.optContent" />
            </div>
            <pre style="height: 23px;overflow: hidden;text-overflow: ellipsis;" v-html="row.optContent" />
          </el-tooltip>
          <div v-else>{{ row.optContent }}</div>
        </template>
      </el-table-column>
      <el-table-column slot="index" label="序号" type="index" width="50" />
      <el-table-column slot="errorMsg" label="报错信息" width="300">
        <template v-slot="{ row }">
          <el-tooltip v-if="row.errorMsg" effect="dark" placement="top">
            <div slot="content">
              <div class="log-listing-content text-wrap" v-html="row.errorMsg" />
            </div>
            <div style="height: 23px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap" v-html="row.errorMsg" />
          </el-tooltip>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getListingLog, getConstants } from '@/api/ebay/log'
import { getUserList } from '@/api/amazon/amazon'

export default {
  name: 'LmsAmazonCateManageLogListing',
  props: {
    listingId: { // listing id
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
          type: 'index',
          label: '序号'
        },
        {
          label: '更新类型',
          prop: 'updateType'
        },
        {
          label: '操作类型',
          prop: 'optType'
        },
        {
          slot: true,
          slotName: 'content'
        },
        {
          label: '执行状态',
          prop: 'optStatus'
        },
        {
          slot: true,
          slotName: 'errorMsg'
        },
        {
          label: '操作人',
          prop: 'optUser',
          width: 120
        },
        {
          label: '操作时间',
          prop: 'createTime',
          width: 140
        }
      ],
      form: {
        listingId: this.listingId
      },
      updateTypes: [],
      operationTypes: []
    }
  },
  created() {
    this.getConstants()
    this.getUserList()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    getConstants() {
      getConstants().then(res => {
        const { listingUpdateType, listingOptType } = res.data.constants
        this.operationTypes = Object.values(listingOptType).reverse().slice(1) // 将删除操作去除
        this.updateTypes = Object.values(listingUpdateType).reverse()
      })
    },
    // 创建人列表
    getUserList(query) {
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
      return getListingLog({ current, size, ...params }).then(res => {
        const data = res.data.records
        data.forEach((value, j) => {
          if (value.content) {
            if (value.content.includes(';')) {
              const reg = new RegExp(';', 'g')
              value.content = value.content.replace(reg, '<br/>')
            }
            if (value.content.includes('\n')) {
              value.content = value.content.replace(/\n/g, '<br/>')
            }
            if (value.content.includes('\r')) {
              value.content = value.content.replace(/\r/g, '<br/>')
            }
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
      this.form = {
        listingId: this.listingId
      }
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
