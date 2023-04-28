<template>
  <g-table ref="table" :headers="headers" row-key="id" :fixed-height="false" :fetch="fetch" @submit.native.prevent="search">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="100px" class="form-col no-message">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="店铺" prop="templateShop">
              <el-select v-model="templateShop" filterable :collapse-tags="true" multiple clearable placeholder="请选择店铺" class="w-100">
                <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.candidateDisplayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="创建人" prop="createUser">
              <g-select v-model="form.createUser" :items="userList" key-field="id" label-field="nameJobNumber" value-field="id" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="刊登站点" prop="site">
              <el-select v-model="form.site" filterable placeholder="请选择" class="w-100">
                <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
              <el-button type="primary" size="mini" @click="editItem()">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="index" label="序号" type="index" width="50" />
    <el-table-column slot="handler" label="操作" width="150px">
      <template v-slot="{ row }">
        <el-button type="text" size="mini" @click="showDetails(row)">详情</el-button>
        <el-button type="text" size="mini" @click="editItem(row)">编辑</el-button>
        <el-button type="text" size="mini" @click="deleteItem(row)">删除</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { templateShopsList, deleteTemplateShops } from '@/api/ebay/tag.js'
import { optionsSiteCode, getUserList } from '@/api/amazon/amazon.js'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import saveTemplateShops from './components/saveTemplateShops.vue'
import viewTemplateShops from './components/viewTemplateShops.vue'

export default {
  name: 'LmsEbayTemplateTagManageTagList',
  data() {
    return {
      userList: [],
      userListCache: [],
      siteList: [],
      storeList: [],
      templateShop: [],
      headers: [
        { slot: true, slotName: 'index' },
        { label: '模板名称', prop: 'templateName' },
        { label: '店铺', prop: 'templateShop' },
        { label: '刊登站点', prop: 'site' },
        { label: '创建人', prop: 'createUserName' },
        { label: '创建时间', prop: 'createTime' },
        { slot: true, slotName: 'handler' }
      ],
      form: {}
    }
  },
  created() {
    this.getSiteList()
    this.getStoreList()
    this.getUserList()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    // 查询当前平台的站点code
    getSiteList() {
      optionsSiteCode({ platformCode: 'EB' }).then(res => {
        this.siteList = [...res.data, {
          displayName: 'eBayMotors',
          hiddenValue: 'eBayMotors'
        }]
      })
    },
    // 查询所有店铺code
    getStoreList() {
      storeOptionsWithPlatformCode({ platformCode: 'EB' }).then(res => {
        this.storeList = res.data
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
      params.templateShopCodes = this.templateShop.join(',')
      return templateShopsList({ current, size, ...params }).then(res => {
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
      this.form = {}
      this.templateShop = []
      this.userList = []
      this.search()
      this.$nextTick(() => {
        this.userList = this.userListCache
      })
    },
    showDetails(row) {
      this.$modal({
        title: '查看',
        component: viewTemplateShops,
        width: '500px',
        data: {
          row: row
        },
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    editItem(row) {
      const title = row ? '编辑' : '添加'
      this.$modal({
        title: title,
        component: saveTemplateShops,
        width: '500px',
        data: {
          storeList: this.storeList,
          siteList: this.siteList,
          row: row
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    deleteItem(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTemplateShops(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.search()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateStatus(row) {

    }
  }
}
</script>
