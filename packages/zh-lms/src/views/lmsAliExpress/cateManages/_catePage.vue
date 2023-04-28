<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="100px" class="no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="平台类目名称" prop="enName">
                <el-input v-model="form.enName" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台类目ID" prop="categoryId">
                <el-input v-model="form.categoryId" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
              <el-button v-if="$auth('catePage_log')" type="primary" size="mini" @click="showLog">日志</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="index" label="序号" type="index" width="50" />
      <el-table-column slot="handler" label="操作" width="90px">
        <template v-slot="{row}">
          <el-button v-if="$auth('catePage_profit')" type="text" size="mini" @click="setGrossProfit(row)">设置毛利率</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { categoryList } from '@/api/aliExpress/category.js'
import updateCategory from './components/updateCategory.vue'
import logCate from '../components/logCate.vue'

export default {
  name: 'LmsLmsAliExpressCateManagesCatePage',
  data() {
    return {
      headers: [
        {
          slot: true,
          slotName: 'index'
        },
        {
          label: '销售利润率',
          prop: 'grossProfit',
          width: 90
        },
        {
          label: '类目树',
          prop: 'categoryPath'
        },
        {
          label: '平台类目名称',
          prop: 'enName',
          width: 150
        },
        {
          label: '平台类目ID',
          prop: 'categoryId',
          width: 120
        },
        {
          label: '产品类目ID',
          prop: 'productCategoryId',
          width: 120
        },
        {
          label: '最后操作日期',
          prop: 'updateTime',
          width: 146
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {
        categoryId: '',
        enName: ''
      }
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    fetch({ current, size }, params) {
      return categoryList({ current, size, ...params }).then(res => {
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
      this.search()
    },
    setGrossProfit(row) {
      this.$modal({
        title: '编辑类目毛利率',
        component: updateCategory,
        width: '500px',
        data: {
          row: row
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    showLog() {
      this.$newTab({
        path: '/cateManage/logCate',
        title: '日志列表',
        component: logCate,
        clearCache: true,
        callback: refresh => {
          console.log(refresh)
        }
      })
    }
  }
}
</script>
