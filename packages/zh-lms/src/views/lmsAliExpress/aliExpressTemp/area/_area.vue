<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
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
              <el-form-item label="模板名称" prop="createUser">
                <el-input v-model="form.name" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
              <el-button v-if="$auth('area_add')" size="mini" type="primary" @click="handleEdit(null)">新建模板</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作">
        <template v-slot="{row}">
          <el-button v-if="$auth('area_edit')" type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="$auth('area_del')" type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="handler2" label="日志">
        <template v-slot="{row}">
          <el-button v-if="$auth('area_detail')" type="text" @click="handleView(row)">查看</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { adjustPage, adjustDel } from '@/api/aliExpress/temp.js'
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import editModal from './components/editModal.vue'
import viewModal from './components/viewModal.vue'

export default {
  name: 'LmsLmsAliExpressAliExpresTempAreaArea',
  data() {
    return {
      cateList: [],
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
          prop: 'name'
        },
        {
          label: '添加时间',
          prop: 'createTime'
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
        name: ''
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
      return adjustPage({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    del(id) {
      this.$confirm('删除后listing将无法选用本调价模板，请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adjustDel(id).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      })
    },
    handleEdit(row) {
      this.$modal({
        title: row ? '编辑模板' : '新建模板',
        data: {
          row: row,
          storeCodeOption: this.storeCodeOption
        },
        component: editModal,
        width: '700px',
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    handleView(row) {
      this.$modal({
        title: '日志',
        component: viewModal,
        height: '480px',
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
