<template>
  <basic-container>
    <div class="myTable">
      <el-form ref="form" :model="form" size="mini" label-width="60px">
        <el-row :gutter="4">
          <el-col :span="8">
            <el-form-item label="字典编码" prop="code" size="small">
              <el-input v-model="form.code" clearable placeholder="字典编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="字典值" prop="dictValue" size="small">
              <el-input v-model="form.dictValue" clearable placeholder="字典值" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="租户ID" size="small" prop="tenantId">
              <el-select v-model="form.tenantId" filterable clearable style="width:100%;">
                <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.tenantId" :value="item.tenantId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块编码" size="small" prop="appCode">
              <el-select v-model="form.appCode" filterable clearable style="width:100%;">
                <el-option v-for="(item, index) in appList" :key="index" :label="item.appCode" :value="item.appCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item class="dict-button">
              <el-button type="primary" size="small" @click="onSearch('form')">搜 索</el-button>
              <el-button size="small" @click="$refs.form.resetFields();form={};form.size=10;onSearch()">清 空</el-button>
              <el-button type="primary" plain size="small" @click="editRow({})">添 加</el-button>
              <el-button type="danger" plain size="small" @click="deleteRow">删 除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
        border
        stripe
        height="calc(100vh - 300px)"
        size="small"
        style="width: 100%"
        @row-click="selectRowChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column prop="tenantId" label="租户ID" />
        <el-table-column prop="code" label="字典编码" />
        <el-table-column prop="dictKey" label="字典键" />
        <el-table-column prop="dictValue" label="字典值" />
        <el-table-column prop="appCode" label="模块编码" />
        <el-table-column label="是否删除">
          <template slot-scope="scope">
            <div v-if="scope.row.isDeleted">是</div>
            <div v-else>否</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewRow(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
            <el-button v-if="!scope.row.isDeleted" type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="form.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="form.size"
        :total="total"
        style="text-align: right; padding-top: 18px"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </basic-container>
</template>

<script>
import { getTenantList } from '@/api/tenantManagement.js'
import { getAppData } from '@/api/application'
import { getDictParentList, removeDict } from '@/api/dict'
import dictModal from './dictModal.vue'
import dictModalView from './dictModalView.vue'

export default {
  name: 'ParentList',
  data() {
    return {
      form: {
        current: 1,
        size: 10
      },
      dialogTitle: '',
      dialogVisible: false,
      tenantList: [],
      appList: [],
      total: 0,
      tableData: [],
      loading: false,
      multipleSelection: [],
      ids: '',
      current: []
    }
  },
  created() {
    this.loadList()
    this.getAppData()
    this.getPageData()
  },
  methods: {
    // 获取租户列表
    loadList() {
      getTenantList({ current: 1, size: 9999 }).then((res) => {
        const records = res.data
        this.tenantList = records
        this.tenantList.push({
          tenantId: 'ALL',
          tenantName: 'ALL'
        })
      })
    },
    getAppData() {
      getAppData({ current: 1, size: 9999 }).then(res => {
        this.appList = res.data
        this.appList.forEach(item => {
          item.appCode = item.code
        })
        this.appList.push({
          appCode: 'ALL',
          appName: 'ALL'
        })
      })
    },
    getPageData() {
      this.loading = true
      getDictParentList(this.form).then(res => {
        this.loading = true
        const { records, total } = res.data
        this.tableData = records
        this.total = total
      }).finally(() => {
        this.loading = false
      })
    },
    selectRowChange(selection) {
      // console.log('父id', selection)
      this.$emit('parentData', selection)
      this.$emit('selectedDict', selection.dictValue)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页相关
    handleSizeChange(val) {
      this.form.size = val
      this.getPageData()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.getPageData()
    },
    onSearch() {
      this.form.current = 1
      this.getPageData()
    },
    viewRow(row) {
      this.$modal({
        title: '查看字典',
        component: dictModalView,
        data: {
          row
        }
      })
    },
    editRow(row) {
      this.$modal({
        title: row.id ? '编辑字典' : '添加字典',
        component: dictModal,
        data: {
          row,
          tenantList: this.tenantList,
          appList: this.appList,
          addParent: true
        },
        callback: (refresh) => {
          if (refresh) this.getPageData()
        }
      })
    },
    deleteRow(row) {
      this.ids = ''
      if (!row.id) {
        if (!this.multipleSelection.length) {
          this.$message.warning('请至少选择一条数据')
          return
        }
        const ids = this.multipleSelection.filter(item => item.isDeleted === 0)
        if (!ids.length) {
          this.$message.warning('请先编辑是否删除字段为 “否” 再删除')
          return
        }
        this.ids = ids.map(item => item.id).join(',')
      }
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ids ? this.deleteAPI(this.ids) : this.deleteAPI(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteAPI(id) {
      removeDict(id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getPageData()
      })
    }
  }
}
</script>
