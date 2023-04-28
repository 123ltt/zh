<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :fixed-height="false" @select="select" @select-all="select">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="90px" class="form-col no-message" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人" prop="createUser">
              <g-select v-model="form.createUser" :items="createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" class="w-100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间" prop="templateType">
              <datePicker ref="datePick"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @getVal="(timeStart, timeEnd) => { form.createTimeStart = timeStart,form.createTimeEnd = timeEnd }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" class="text-end">
            <el-form-item label-width="20px">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="刊登站点" prop="siteCode">
              <el-select v-model="form.siteCode" class="w-100">
                <el-option v-for="(item, index) in siteOption" :key="index" :value="item.displayName" :label="item.displayName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="text-end" :span="18">
            <el-button size="mini" @click="handleEdit()">新建模板</el-button>
            <el-dropdown split-button type="primary" size="mini" class="ebay-car-dropdown">导入/导出
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleDown">导入生成/更新模板</el-dropdown-item>
                <el-dropdown-item :disabled="!checked.length" @click.native="handleExport">导出模板</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button size="mini" :disabled="!checked.length" @click="handleBatchDel">批量删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="handler" label="操作">
      <template v-slot="{row}">
        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button type="text" @click="handleDel(row.id)">删除</el-button>
        <el-button type="text" @click="handleView(row)">日志</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getCarTempList, exportCarTemplate, removeCarTemplate } from '@/api/ebay/template.js'
import { dowloadExc } from '@/util/util'
// import { dateFormat } from '@/util/date'
import { getUserList, optionsSiteCode } from '@/api/amazon/amazon'
import viewModal from './components/viewModal.vue'
import editModel from './components/editModel.vue'
import tempImport from './components/tempImport.vue'
import datePicker from '@/views/components/datePicker/index.vue'
export default {
  name: 'BacksyncTemp',
  components: { datePicker },
  data() {
    return {
      cateList: [],
      checked: [],
      activeName: 'productInfo',
      createUserOption: [],
      headers: [
        {
          type: 'selection'
        },
        {
          label: '刊登站点',
          prop: 'siteCode'
        },
        {
          label: '模板名称',
          prop: 'name'
        },
        {
          label: '创建人',
          prop: 'createUserName'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      form: {
        account: null,
        name: null,
        createTimeStart: null,
        createTimeEnd: null
      },
      siteOption: [],
      url: ''
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getUserList()
    this.getSiteList()
  },
  methods: {
    // 查询当前平台的站点code
    getSiteList() {
      optionsSiteCode({ platformCode: 'EB' }).then(res => {
        this.siteOption = [...res.data, {
          displayName: 'eBayMotors',
          hiddenValue: 'eBayMotors'
        }]
      })
    },
    // 创建人列表
    getUserList(query) {
      this.loadingUser = true
      getUserList({ name: query, current: 1, size: 9999 }).then(res => {
        this.loadingUser = false
        const records = res.data.records
        records.forEach(item => {
          item.nameJobNumber = `${item.name}${item.jobNumber}`
        })
        this.createUserOption = records
      }).finally(() => {
        this.loadingUser = false
      })
    },
    handleExport() {
      // const dateTime = dateFormat(new Date(), 'yyyyMMdd')
      // const checked = this.checked
      // const tmpNames = checked.map(item => item.name)
      // const name = `${tmpNames}-${dateTime}.xlsx`
      const name = '车型库模板.xlsx'
      const ids = this.checked
      exportCarTemplate({ ids: ids.join() }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
      })
    },
    handleDown() {
      this.$modal({
        title: '导入生成/更新模板',
        component: tempImport,
        data: {
          siteOption: this.siteOption
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    select(checkedList) {
      this.checked = checkedList.map(item => item.id)
    },
    handleBatchDel() {
      this.handleDel(this.checked.join())
    },
    handleDel(id) {
      this.$confirm('请确认是否删除？模板删除则已绑定模板的SKU，在SKU车型库列表，也会一并删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeCarTemplate(id).then(res => {
          this.$message.success(res.msg)
          this.search()
        })
      }).catch(() => {})
    },
    fetch({ current, size }, params) {
      return getCarTempList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    handleEdit(row) {
      const title = row ? '编辑模板' : '新增模板'
      this.$modal({
        title: title,
        component: editModel,
        width: '1200px',
        minHeight: '500px',
        data: {
          row: row,
          siteOption: this.siteOption
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    handleView(row) {
      this.$modal({
        title: '日志',
        component: viewModal,
        minHeight: '600px',
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
      this.$refs.datePick.createDate = []
      this.search()
    }
  }
}
</script>

<style lang="scss">
.ebay-car-dropdown {
   margin: 0 10px;
  .el-dropdown__caret-button{
    height: 28px;
  }
}
</style>
