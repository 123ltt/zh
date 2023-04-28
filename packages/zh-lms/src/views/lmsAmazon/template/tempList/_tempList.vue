<template>
  <basic-container>
    <!-- Amazon模板列表&属性 -->
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <template slot="header">
        <el-form ref="formRef" :model="form" size="mini" label-width="90px" class="search-form no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="名称" prop="name">
                <el-select v-model="form.name" clearable filterable placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in findform.nameOptions" :key="item.value" :value="item.value" :label="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="templateStatus">
                <el-select v-model="form.templateStatus" clearable placeholder="请选择状态" style="width:100%;">
                  <el-option v-for="item in findform.statusOptions" :key="item.id" :value="item.id" :label="item.name" />
                </el-select>
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
          <el-button type="text" size="mini" style="vertical-align:middle;" @click="handlerCategory(row)">关联类目</el-button>
          <el-button type="text" size="mini" style="vertical-align:middle;" @click="handlerProperty(row)">设置属性</el-button>
          <el-switch v-model="row.templateStatus" style="margin-left: 16px" @change="changeTemplateStatus(row)" />
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import Category from './components/category.vue'
import SetProperty from './components/setProperty.vue'
import { amazonTemplatePage, amazonTemplateStatus, tempOption, templateUpdateStatus } from '@/api/amazon/templateList'

export default {
  name: 'LmsLmsAmazonTemplateTempListTempList',
  data() {
    return {
      headers: [
        { type: 'index', label: '序号' },
        { label: '名称', prop: 'name' },
        { label: '状态', prop: 'templateStatusName' },
        { slot: true, slotName: 'handler' }
      ],
      form: {
        name: '',
        templateStatus: ''
      },
      findform: {
        nameOptions: [],
        statusOptions: []
      }
    }
  },
  mounted() {
    this.getAmazonTemplateStatus()
    this.getTemplateNameOption()
    this.$refs.table.load(1)
  },
  methods: {
    fetch({ current, size }, params) {
      return amazonTemplatePage({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      const params = Object.assign({}, this.form)
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, Object.assign({}, params))
    },
    // 关联类目
    handlerCategory(row) {
      this.$modal({
        title: '关联类目',
        component: Category,
        data: {
          row: row
        }

      })
    },
    handlerProperty(row) {
      this.$newTab({
        path: '/template/setProperty',
        title: '设置属性',
        component: SetProperty,
        data: {
          row: row
        },
        width: '60%',
        clearCache: true,
        callback: (refresh) => {
          refresh && this.$refs.table.load(0)
        }
      })
    },
    // 启用或者禁用模板
    changeTemplateStatus(row) {
      const id = row.id
      const templateStatus = Number(row.templateStatus)
      templateUpdateStatus({ id, templateStatus }).then(res => {
        this.$message.success(res.msg)
        this.search()
      }).catch((e) => {
        this.search()
      })
    },
    // Status list option
    getAmazonTemplateStatus() {
      amazonTemplateStatus().then(res => {
        this.findform.statusOptions = res.data
      })
    },
    // name list option
    getTemplateNameOption() {
      tempOption().then(res => {
        this.findform.nameOptions = res.data
      })
    },

    // 清空
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
