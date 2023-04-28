<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="100px" class="form-col no-message" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="站点" prop="platSite">
                <el-select v-model="form.platSite" clearable filterable placeholder="请选择" style="width:100%;">
                  <el-option v-for="(item, index) in sites" :key="index" :value="item.displayName" :label="item.displayName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台类目名称" prop="platCategory">
                <el-input v-model="form.platCategory" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作人" prop="optUser">
                <g-select v-model="form.optUser" :items="userList" key-field="id" label-field="nameJobNumber" value-field="name" class="w-100" />
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
      <el-table-column slot="index" label="序号" type="index" width="50" />
    </g-table>
  </basic-container>
</template>

<script>
import { getCategoryLog } from '@/api/ebay/log'
import { getCategoryList } from '@/api/ebay/category'
import { optionsSiteCode, getUserList } from '@/api/amazon/amazon'

export default {
  name: 'LmsAmazonCateManageLogCate',
  data() {
    return {
      userList: [],
      userListCache: [],
      cateList: [],
      headers: [
        {
          slot: true,
          slotName: 'index'
        },
        {
          label: '站点',
          prop: 'platSite',
          width: 80
        },
        {
          label: '平台类目名称',
          prop: 'platCategory'
        },
        {
          label: '内容',
          prop: 'optContent'
        },
        {
          label: '操作人',
          prop: 'optUser'
        },
        {
          label: '操作时间',
          prop: 'createTime'
        }
      ],
      form: {
        descs: 'id'
      },
      sites: []
    }
  },
  created() {
    this.listAllSite()
    this.getUserList()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    // 获取类目列表
    getCategoryList() {
      return getCategoryList({ current: 1, size: 999 }).then(res => res.data.records)
    },
    // 获取用户列表
    getUserList(query) {
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}-${item.jobNumber}`
        })
        this.userList = records
        this.userListCache = [...records]
      })
    },
    listAllSite() {
      optionsSiteCode({ platformCode: 'EB' }).then(res => {
        this.sites = res.data
      })
    },
    async fetch({ current, size }, params) {
      // this.cateList = await this.getCategoryList()
      return getCategoryLog({ current, size, ...params }).then(res => {
        // res.data.records.forEach(item => {
        //   const cate = this.cateList.find(e => e.platCategoryId === item.platCategory)
        //   if (cate) {
        //     item.platCategory = cate.platCategoryName
        //   }
        // })
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
        descs: 'id'
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
