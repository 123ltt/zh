<template>
  <div class="member-details">
    <el-table
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      border
      height="calc(100vh - 265px)"
      size="small"
      stripe
      class="g-table"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="50" :index="setIndex" />
      <!-- <el-table-column
      prop="postName"
      label="所属租户">
      </el-table-column> -->
      <el-table-column prop="companyName" label="所属公司" />
      <el-table-column prop="deptName" width="" label="部门" />
      <el-table-column prop="postName" label="岗位" />
      <el-table-column prop="userName" label="成员姓名">
        <template slot-scope="scope">
          {{ scope.row.userName }}<span v-if="scope.row.jobNumber">（{{ scope.row.jobNumber }}）</span>
        </template>
      </el-table-column>
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
import { getUserRole } from '@/api/role'
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
        size: 10
      },
      tableData: [],
      loading: false
    }
  },
  created() {
    this.getUserRole()
  },
  methods: {
    setIndex(val) {
      if (this.form.current === 1) return val + 1
      else return this.form.current * this.form.size + val - this.form.size + 1
    },
    handleSizeChange(val) {
      this.form.size = val
      this.getUserRole()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.getUserRole()
    },
    getUserRole() {
      this.loading = true
      getUserRole(this.form).then(res => {
        this.$set(this.form, 'current', res.data.current)
        this.$set(this.form, 'size', res.data.size)
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
