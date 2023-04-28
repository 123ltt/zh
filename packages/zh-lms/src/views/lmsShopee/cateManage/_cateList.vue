<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="90px" class="no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item label="站点" prop="site">
                <el-select v-model="form.site" clearable filterable placeholder="请选择" class="w-100">
                  <el-option v-for="(item, index) in sites" :key="index" :value="item.displayName" :label="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="平台类目名称" prop="categoryName">
                <el-input v-model="form.categoryName" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="平台类目ID" prop="categoryId">
                <el-input v-model="form.categoryId" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item>
                <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
                <el-button size="mini" @click="resetForm('form')">清空</el-button>
                <el-button type="primary" size="mini" @click="updateCate">更新类目</el-button>
                <el-button type="primary" size="mini" @click="showLog">日志</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="index" label="序号" type="index" width="50" />
      <el-table-column slot="handler" label="操作" width="150px">
        <template v-slot="{row}">
          <el-button type="text" size="mini" @click="setGrossProfit(row)">设置销售利润率</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getCategoryList } from '@/api/shopee/category'
import { optionsSiteCode } from '@/api/amazon/amazon'
import editGrossProfit from './components/editGrossProfit'
import updateCategory from './components/updateCategory'
import logCate from '../components/logCate'

export default {
  name: 'LmsAmazonCateManageCateList',
  data() {
    return {
      sites: [],
      headers: [
        {
          slot: true,
          slotName: 'index'
        },
        {
          label: '站点',
          prop: 'site'
        },
        {
          label: '类目销售利润率',
          prop: 'grossProfit'
        },
        {
          label: '类目树',
          prop: 'categoryPath',
          width: 300
        },
        {
          label: '平台类目名称',
          prop: 'categoryName'
        },
        {
          label: '平台类目ID',
          prop: 'categoryId'
        },
        {
          label: '产品类目ID',
          prop: 'productCategoryId'
        },
        {
          label: '最后操作日期',
          prop: 'updateTime',
          width: 150
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {}
    }
  },
  created() {
    this.listAllSite()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    fetch({ current, size }, params) {
      return getCategoryList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    listAllSite() {
      optionsSiteCode({ platformCode: 'SP' }).then(res => {
        this.sites = res.data
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.search()
    },
    setGrossProfit(row) {
      this.$modal({
        title: '设置类目销售利润率',
        component: editGrossProfit,
        width: '500px',
        data: {
          row: row
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    updateCate() {
      this.$modal({
        title: '更新类目',
        component: updateCategory,
        width: '500px',
        data: {
          sites: this.sites
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    showLog() {
      this.$newTab({
        path: '/cateManage/logCate',
        title: '类目管理/日志列表',
        component: logCate,
        data: {
          sites: this.sites
        },
        callback: refresh => {
          console.log(refresh)
        },
        clearCache: true
      })
    }
  }
}
</script>
