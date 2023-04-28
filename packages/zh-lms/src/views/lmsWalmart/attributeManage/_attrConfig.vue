<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="150px" class="no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10" style="margin-left: -33px;">
            <el-col :span="6">
              <el-form-item label="平台类目" prop="categoryName">
                <el-select v-model="form.categoryNameList" multiple collapse-tags clearable filterable placeholder="请选择" class="w-100" value-key="key">
                  <el-option v-for="(item, index) in cateData" :key="index" :value="item.categoryName" :label="item.categoryName" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="Product Tax Code" prop="value" style="margin-left: 50px;">
                <el-input v-model="form.value" placeholder="请输入" clearable style="width: 157.5px;" @input="regExp" />
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
          <el-button v-if="permission.attr_edit" type="text" size="mini" @click="editAttr(row)">编辑</el-button>
          <el-button v-if="permission.attr_log" type="text" size="mini" @click="handleRecord(row)">日志</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAttrList, getCateogries } from '@/api/walmart/attribute'
import editAttr from './components/editAttr'
import attrLogList from './components/attrLogList.vue'

export default {
  name: 'WalmartAttrConfig',
  data() {
    return {
      cateData: [], // 平台类目
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
          label: 'Product Tax Code',
          prop: 'value'
        },
        {
          label: '更新时间',
          prop: 'updateTime'
        },
        {
          label: '操作人',
          prop: 'updateUserName'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {
        categoryNameList: [],
        value: ''
      }
    }
  },
  created() {
    // 获取平台类目
    this.listAllCate()
  },
  mounted() {
    this.$refs.table.load(1)
  },
  computed: {
    ...mapGetters(['permission']),
    // 是否超级管理员
    isAdmin() {
      return this.userInfo.role_name.includes('administrator')
    }
  },
  methods: {
    regExp(val) {
      if (!/^[0-9,]+$/.test(this.form.value)) {
        this.form.value = ''
        this.$message.warning('Product Tax Code只能输入数字')
      }
    },
    fetch({ current, size }, params) {
      return getAttrList({ current, size }, params).then(res => {
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
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.search()
    },
    handleRecord(row) {
      this.$modal({
        title: '日志',
        component: attrLogList,
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
    editAttr(row) {
      this.$modal({
        title: '编辑',
        component: editAttr,
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
