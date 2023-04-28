<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="105px" class="no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10" style="margin-left: -33px;">
            <el-col :span="6">
              <el-form-item label="平台类目" prop="categoryName">
                <el-select v-model="form.categoryNameList" multiple collapse-tags clearable filterable placeholder="请选择" class="w-100">
                  <el-option v-for="(item, index) in cateData" :key="index" :value="item.categoryName" :label="item.categoryName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="操作人" prop="updateUserName" label-width="50px">
                <g-select v-model="form.updateUserName" :items="findform.updateUserOption" key-field="id" label-field="nameJobNumber" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item>
                <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
                <el-button size="mini" @click="resetForm('form')">清空</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="index" label="序号" type="index" width="50" />
      <el-table-column slot="handler" label="操作" width="150px">
        <template v-slot="{row}">
          <el-button v-if="permission.childattr_edit" type="text" size="mini" @click="editChildAttr(row)">编辑</el-button>
          <el-button v-if="permission.childattr_log" type="text" size="mini" @click="handleRecord(row)">日志</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserList } from '@/api/ams.js'
import { getCateogries, getChildAttrList } from '@/api/walmart/attribute'
import editChildAttr from './components/editChildAttr.vue'
import childAttrLogList from './components/childAttrLogList.vue'

export default {
  name: 'WalmartChildAttrConfig',
  data() {
    return {
      loadingUser: false,
      cateData: [],
      findform: {
        updateUserOption: []
      },
      headers: [
        {
          slot: true,
          slotName: 'index'
        },
        {
          label: '平台类目',
          prop: 'categoryName'
        },
        {
          label: '操作人',
          prop: 'updateUserName'
        },
        {
          label: '更新时间',
          prop: 'updateTime'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {
        categoryNameList: [],
        updateUserName: ''
      }
    }
  },
  created() {
    this.listAllCate()
    this.getUserList()
  },
  mounted() {
    this.$refs.table.load(1, { categoryNameList: this.form.categoryNameList, updateUser: this.form.updateUserName })
  },
  computed: {
    ...mapGetters(['permission']),
    // 是否超级管理员
    isAdmin() {
      return this.userInfo.role_name.includes('administrator')
    }
  },
  methods: {
    // 操作人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        this.loadingUser = false
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.findform.updateUserOption = records
      }).finally(() => {
        this.loadingUser = false
      })
    },
    fetch({ current, size }, params) {
      return getChildAttrList({ current, size }, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    listAllCate() {
      getCateogries({ size: '9999' }).then(res => {
        this.cateData = res.data.records
      })
    },
    search() {
      const { categoryNameList } = this.form
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, { categoryNameList, updateUser: this.form.updateUserName })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.search()
    },
    handleRecord(row) {
      this.$modal({
        title: '日志',
        component: childAttrLogList,
        width: '500px',
        height: '300px',
        data: {
          row: row
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    editChildAttr(row) {
      this.$modal({
        title: '编辑',
        component: editChildAttr,
        width: '500px',
        data: {
          row: row
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    }
  }
}
</script>
