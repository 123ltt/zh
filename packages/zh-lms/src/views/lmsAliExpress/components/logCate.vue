<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="100px" class="form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="类目名称" prop="operationType">
                <el-input v-model="form.operationType" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作人" prop="createUser">
                <g-select v-model="form.createUser" :items="userList" key-field="id" label-field="nameJobNumber" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </g-table>
  </basic-container>
</template>

<script>
import { aliexpressopslogList } from '@/api/aliExpress/log.js'
import { getUserList } from '@/api/amazon/amazon'

export default {
  name: 'LmsLmsAliExpressCateManagesLogCate',
  data() {
    return {
      userList: [],
      userListCache: [],
      cateList: [],
      headers: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '类目名称',
          prop: 'operationType'
        },
        {
          label: '内容',
          prop: 'content'
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
        module: 'CATEGORY',
        createUser: '',
        operationType: '',
        descs: 'create_time'
      }
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getUserList()
  },
  methods: {
    // 获取用户列表
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
    async fetch({ current, size }, params) {
      return aliexpressopslogList({ current, size, ...params }).then(res => {
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
        module: 'CATEGORY',
        descs: 'create_time'
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
