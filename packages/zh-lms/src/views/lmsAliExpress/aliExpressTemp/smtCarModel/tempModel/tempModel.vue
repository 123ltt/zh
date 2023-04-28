<template>
  <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :fixed-height="false" @select="select" @select-all="select">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="70px" class="form-col" @submit.native.prevent="search">
        <el-row :gutter="10">
          <el-col :span="5">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="添加人" prop="createUser">
              <g-select v-model="form.createUser" :items="createUserOption" key-field="id" label-field="nameJobNumber" value-field="id" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="添加时间" prop="templateType">
              <DateTimePicker ref="createDate" :search-data="form" :date-time-start="'createTimeStart'" :date-time-end="'createTimeEnd'" :value-format="'yyyy-MM-dd HH:mm:ss'" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
            <el-button size="mini" @click="resetForm('form')">清空</el-button>
            <el-button v-if="$auth('carmodel_add')" size="mini" type="primary" class="ms-1" @click="handleAdd">新建模板</el-button>
            <el-dropdown v-if="$auth('carmodel_import')" split-button type="primary" size="mini" class="ms-1">
              导入/导出
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleDown">导入生成/更新模板</el-dropdown-item>
                <el-dropdown-item :disabled="!checked.length" @click.native="handleExport">导出模板</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="$auth('carmodel_batch_del')" size="mini" type="danger" :disabled="!checked.length" class="ms-1" @click="handleDel('',2)">批量删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="handler" label="操作">
      <template v-slot="{row}">
        <el-button v-if="$auth('carmodel_edit')" type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button v-if="$auth('carmodel_del')" type="text" @click="handleDel(row.id,1)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="handler2" label="日志">
      <template v-slot="{row}">
        <el-button v-if="$auth('carmodel_details')" type="text" @click="handleView(row)">查看</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { carAttrTempList, carAttrTmpeExport, carAttrSkuDel, carAttrTempBatchDel } from '@/api/aliExpress/temp.js'
import { dowloadExc } from '@/util/util'
import { dateFormat } from '@/util/date'
import viewModal from './components/viewModal.vue'
import editModel from './components/editModel.vue'
import { getUserList } from '@/api/amazon/amazon'
import tempImport from './components/tempImport.vue'
import DateTimePicker from '@/views/components/searchHead/dateTimePicker.vue'
export default {
  name: 'BacksyncTemp',
  components: {
    DateTimePicker
  },
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
          label: '模板名称',
          prop: 'name'
        },
        {
          label: '添加人',
          prop: 'createUserName'
        },
        {
          label: '添加时间',
          prop: 'createTime'
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
        account: null,
        name: null,
        createTimeStart: null,
        createTimeEnd: null,
        descs: 'create_time'
      }
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getUserList()
  },
  methods: {
    handleAdd() {
      this.$modal({
        title: '新增模板',
        component: editModel,
        callback: refresh => {
          refresh && this.search()
        }

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
      const dateTime = dateFormat(new Date(), 'yyyyMMdd')
      const checked = this.checked
      const tmpNames = checked.map(item => item.name)
      const name = `${tmpNames}-${dateTime}.xlsx`
      const ids = checked.map(item => item.id)
      carAttrTmpeExport({ ids: ids.join() }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
        this.$message.success(res.msg)
      })
    },
    handleDown() {
      this.$modal({
        title: '导入生成/更新模板',
        component: tempImport,
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    select(checkedList = [], row) {
      if (row) { // 单选
        if (checkedList.includes(row)) {
          this.checked.push(row)
        } else {
          this.checked = this.checked.filter(item => item.id !== row.id)
        }
      } else { // 全选
        const rest = []
        if (checkedList.length > 0) {
          rest.push(...checkedList)
        }
        this.checked = rest
      }
    },
    handleDel(id, type) {
      this.$confirm('请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 1) {
          carAttrSkuDel(id).then(res => {
            this.$message.success(res.msg)
            this.search()
          })
        } else {
          const ids = this.checked.map(item => item.id)
          carAttrTempBatchDel(ids.join()).then(res => {
            this.$message.success(res.msg)
            this.search()
          })
        }
      })
    },
    async fetch({ current, size }, params) {
      return carAttrTempList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    handleEdit(row) {
      this.$modal({
        title: '编辑模板',
        component: editModel,
        data: {
          id: row.id
        }
      })
    },
    handleView(row) {
      this.$modal({
        title: '查看详情',
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
      this.$refs.createDate.createDate = []
      this.search()
    }
  }
}
</script>
<style lang="scss">
.el-button-group > .el-button:last-child{
  height: 28px !important;
}
</style>
