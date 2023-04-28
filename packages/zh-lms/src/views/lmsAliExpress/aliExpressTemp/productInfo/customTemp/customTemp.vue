<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :fixed-height="false">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="100px" class="form-col" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺" prop="operationType">
              <el-select v-model="form.account" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in storeCodeOption" :key="index" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="添加人" prop="createUser">
              <SelectUser ref="selectUser" :search-data="form" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
            <el-button size="mini" @click="resetForm('form')">清空</el-button>
            <el-button v-if="$auth('custom_add')" type="primary" size="mini" @click="handleEdit({})">新建模板</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="handler" label="操作">
      <template v-slot="{row}">
        <el-button v-if="$auth('custom_edit')" type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button v-if="$auth('custom_del')" type="text" @click="del(row.id)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="handler2" label="日志">
      <template v-slot="{row}">
        <el-button v-if="$auth('custom_details')" type="text" @click="handleView(row)">查看</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { productCustomTempPage, productCustomTempDel } from '@/api/aliExpress/temp.js'
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import viewModal from './components/viewModal.vue'
import editModal from './components/editModal.vue'
import SelectUser from '@/views/components/searchHead/selectUser.vue'
export default {
  name: 'CustomTemp',
  components: {
    SelectUser
  },
  data() {
    return {
      storeCodeOption: [],
      headers: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '店铺',
          prop: 'account'
        },
        {
          label: '模板名称',
          prop: 'templateName'
        },
        {
          label: '添加时间',
          prop: 'updateTime'
        },
        {
          label: '添加人',
          prop: 'createUserName'
        },
        {
          slot: true,
          slotName: 'handler'
        },
        {
          slot: true,
          slotName: 'handler2'
        }
      ],
      form: {
        account: '',
        templateName: '',
        createUser: ''
      }
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getOptionsWithPlatformCode()
  },
  methods: {
    getOptionsWithPlatformCode() {
      optionsWithPlatformCode({ platformCode: 'SM' }).then(res => {
        this.storeCodeOption = res.data
      })
    },
    async fetch({ current, size }, params) {
      return productCustomTempPage({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    handleEdit(row) {
      this.$modal({
        title: row?.id ? '编辑模板' : '新增模板',
        data: {
          id: row.id,
          storeCodeOption: this.storeCodeOption
        },
        component: editModal,
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    del(id) {
      this.$confirm('删除后，将无法选用本模板，请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productCustomTempDel({ ids: id }).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      })
    },
    handleView(row) {
      this.$modal({
        title: '查看详情',
        component: viewModal,
        data: {
          id: row.id
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
    }
  }
}
</script>
