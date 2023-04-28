<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background:'#FAFAFA', color:'rgba(0,0,0,.85)' }"
      border
      height="60vh"
      size="mini"
      stripe
      class="g-table"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="50" />
      <!-- <el-table-column label="所属租户" prop="tenantName">
        <template slot-scope="{ row }">
          <span v-if="row.tenantName === '暂无'" class="noData">暂无</span>
          <span v-else>{{ row.tenantName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="所属机构" prop="orgName">
        <template slot-scope="{ row }">
          <span v-if="row.orgName === '暂无'" class="noData">暂无</span>
          <span v-else>{{ row.orgName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="deptName">
        <template slot-scope="{ row }">
          <span v-if="row.deptName === '暂无'" class="noData">暂无</span>
          <span v-else>{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="岗位" prop="postName">
        <template slot-scope="{ row }">
          <span v-if="row.postName === '暂无'" class="noData">暂无</span>
          <span v-else>{{ row.postName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员姓名" prop="name">
        <template slot-scope="{ row }">
          <span v-if="row.name === '暂无'" class="noData">暂无</span>
          <span v-else>{{ row.name }}</span>
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
import { countDetails } from '@/api/menuManage.js'
export default {
  name: 'CountDetails',
  props: ['current'],
  data() {
    return {
      loading: false,
      form: {
        // pageSize
        size: 10,
        // pageIndex
        current: 1,
        // 当前菜单id
        id: 0
      },
      total: 0,
      list: []
    }
  },
  created() {
    this.form.id = this.current.id
    this.loadList()
  },
  methods: {
    // 获取租户列表
    loadList() {
      this.loading = true
      console.log(this.form)
      countDetails(this.form)
        .then((res) => {
          const { records, total } = res.data
          this.total = total
          this.list = records
          console.log(this.list)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 分页相关
    handleSizeChange(val) {
      this.form.size = val
      this.loadList()
    },
    handleCurrentChange(val) {
      this.form.current = val
      this.loadList()
    }
  }
}
</script>

<style lang="scss" scoped>
.change-menu-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  .change-menu-content {
    margin: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    height: 100%;
    .change-menu-list {
      height: 350px;
      overflow: scroll;
    }
  }
}
.el-form-item {
  margin-bottom: 10px;
}
.noData{
  color: #ccc;
}
</style>
