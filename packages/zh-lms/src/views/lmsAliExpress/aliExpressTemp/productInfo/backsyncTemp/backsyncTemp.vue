<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :fixed-height="false">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="100px" class="form-col" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="5">
            <el-form-item label="店铺" prop="operationType">
              <el-select v-model="form.account" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in storeCodeOption" :key="index" :label="item.displayName" :value="item.displayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="模板类型" prop="templateType">
              <el-select v-model="form.templateType" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in templateTypeOption" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="templateStatus">
              <el-select v-model="form.templateStatus" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in templateStatusOption" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
            <el-button size="mini" @click="resetForm('form')">清空</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="handler" label="操作">
      <template v-slot="{row}">
        <el-button v-if="$auth('productInfo_datail')" type="text" @click="handleView(row)">查看详情</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { productTempList } from '@/api/aliExpress/temp.js'
import { optionsWithPlatformCode } from '@/api/amazon/amazon'
import viewModal from './components/viewModal.vue'

export default {
  name: 'BacksyncTemp',
  data() {
    return {
      cateList: [],
      storeCodeOption: [],
      activeName: 'productInfo',
      templateStatusOption: [
        { label: '审核不通过', value: 'tbd' },
        { label: '审核中', value: 'auditing' },
        { label: '审核通过', value: 'approved' }
      ],
      templateTypeOption: [
        { label: '自定义模块', value: 'custom' },
        { label: '关联模块', value: 'relation' }
      ],
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
          label: '模板类型',
          prop: 'templateType',
          formatter(row, column, cellValue, index) {
            return cellValue === 'custom' ? '自定义模块' : '关联模块'
          }
        },
        {
          label: '同步时间',
          prop: 'updateTime'
        },
        {
          label: '状态',
          prop: 'templateStatus',
          formatter(row, column, cellValue, index) {
            return cellValue === 'tbd' ? '审核不通过' : cellValue === 'auditing' ? '审核中' : '审核通过'
          }
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {
        account: null,
        templateName: null,
        templateType: null,
        templateStatus: null
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
      return productTempList({ current, size }, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
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
