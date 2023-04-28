<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <template slot="header">
        <el-form ref="formRef" :model="form" size="mini" label-width="90px" class="search-form no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="模板名称" prop="templateName">
                <el-select v-model="form.templateName" clearable filterable placeholder="请选择" style="width:160px;">
                  <el-option v-for="item in findform.templateChangeList" :key="item.displayName" :value="item.value" :label="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台类目名称" prop="browseNodeName">
                <el-input v-model="form.browseNodeName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台类目ID" prop="browseNodeId">
                <el-input v-model="form.browseNodeId" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" native-type="submit">搜索</el-button>
                <el-button @click="resetForm('formRef')">清空</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作">
        <template v-slot="{row}">
          <el-button type="text" size="mini" style="vertical-align:middle;" @click="handlerCategory(row)">设置模板</el-button>
          <el-button type="text" size="mini" style="vertical-align:middle;" @click="handlerDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { relationCategoryPage, remove } from '@/api/amazon/tempCategoryList'
import { tempOption } from '@/api/amazon/templateList'
import SetCategory from './components/setCategory'
export default {
  name: 'LmsAmazonTempCategoryList',
  data() {
    return {
      form: {
        templateName: '',
        browseNodeName: '',
        browseNodeId: ''
      },
      findform: { templateChangeList: [] },
      headers: [
        { type: 'index', label: '序号' },
        { label: '类目树', prop: 'browsePathByName' },
        { label: '平台类目名称', prop: 'browseNodeName' },
        { label: '平台类目ID', prop: 'browseNodeId' },
        { label: '模板名称', prop: 'templateName' },
        { label: '模板是否应用子类目', prop: 'autoApplyName' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  mounted() {
    this.getTempOption()
    this.$refs.table.load(1, this.form)
  },
  methods: {
    fetch({ current, size }, params) {
      return relationCategoryPage({ current, size, ...params }).then(res => {
        res.data.records.forEach(item => {
          item.templateNameList = []
        })
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
    handlerDel(row, index) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(res => {
          if (res.success) this.$refs.table.load(0)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }).catch(console.info)
    },
    // 获取模板下拉列表
    getTempOption() {
      tempOption().then(res => {
        this.findform.templateChangeList = res.data
      })
    },
    handlerCategory(row) {
      this.$modal({
        title: '设置模板',
        component: SetCategory,
        width: '500px',
        data: {
          row: row
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.search()
    }
  }

}
</script>

<style>

</style>
