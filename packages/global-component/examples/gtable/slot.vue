<template>
  <g-table ref="table" row-key="id" :fetch="fetch">
    <!-- 使用默认插槽 -->
    <el-table-column label="姓名" prop="name" />
    <el-table-column label="年龄">
      <template v-slot="{row}">
        <!-- 设置年龄大于30为红色，否则为绿色 -->
        <span :style="row.age>30?'red':'green'">{{ row.age }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template v-slot="{row}">
        <el-button @click="remove(row)">删除</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getList } from '@/api/user'
export default {
  mounted() {
    // 必须在mounted生命周期调用（created, beforeMount中table还不能访问）
    this.$refs.table.load(1, {})
  },
  methods: {
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    }
  }
}
</script>
