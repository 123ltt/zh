<template>
  <div class="auth-details">
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      border
      height="calc(100vh - 265px)"
      size="small"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        prop="appName"
        label="所属应用"
      />
      <el-table-column
        prop="parentName"
        label="功能菜单"
      />
      <el-table-column
        prop="menuName"
        label="操作权限"
      />
    </el-table>
    <el-pagination
      :current-page="form.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="form.size"
      :total="total"
      style="text-align: right; padding-top: 18px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getMenuRole } from '@/api/role'
export default {
  name: 'MemberDetails',
  props: {
    current: Object
  },
  data() {
    return {
      total: 0,
      form: {
        roleId: this.current.id,
        current: 1,
        size: 20
      },
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getPageData()
  },
  methods: {
    handleSizeChange(val) {
      this.form.size = val
      this.getPageData()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.getPageData()
    },
    getPageData() {
      this.loading = true
      getMenuRole(this.form).then(res => {
        const { records, total } = res.data
        this.total = total
        this.tableData = records
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
