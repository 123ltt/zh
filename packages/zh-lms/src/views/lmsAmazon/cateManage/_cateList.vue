<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="100px" class="no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="站点" prop="amazonSite">
                <el-select v-model="form.amazonSite" clearable filterable placeholder="请选择" style="width:100%;">
                  <el-option v-for="(item, index) in sites" :key="index" :value="item.displayName" :label="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台类目名称" prop="browseNodeName">
                <el-input v-model="form.browseNodeName" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台类目ID" prop="browseNodeId">
                <el-input v-model="form.browseNodeId" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" size="mini" @click="updateCate">更新类目</el-button>
              <el-button type="primary" size="mini" @click="showLog">日志</el-button>
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
import { getCategoryList } from '@/api/amazon/category'
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
          prop: 'amazonSite'
        },
        {
          label: '类目销售利润率',
          prop: 'grossProfit'
        },
        {
          label: '类目树',
          prop: 'browsePathByName',
          width: 350
        },
        {
          label: '平台类目名称',
          prop: 'browseNodeName'
        },
        {
          label: '平台类目ID',
          prop: 'browseNodeId'
        },
        {
          label: '产品类目ID',
          prop: 'productCategoryId'
        },
        {
          label: '最后操作日期',
          prop: 'updateTime'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {}
    }
  },
  computed: {

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
      optionsSiteCode({ platformCode: 'AM' }).then(res => {
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
        callback: refresh => {
          console.log(refresh)
        },
        clearCache: true
      })
    }
  }
}
</script>
