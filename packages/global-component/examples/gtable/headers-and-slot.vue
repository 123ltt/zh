<template>
  <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
    <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
    <el-form slot="header" @submit.native.prevent="search">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
        <el-button native-type="submit">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 自定义动态插槽 （对应表格的列，顺序依赖于 header 数组） -->
    <el-table-column slot="slotAge" label="年龄" width="150">
      <template v-slot="{row}">
        <!-- 设置年龄大于30为红色，否则为绿色 -->
        <span :style="row.age>30?'red':'green'">{{ row.age }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作">
      <template v-slot="{row}">
        <el-button @click="remove(row)">删除</el-button>
      </template>
    </el-table-column>

    <!-- footer-left插槽 （位于分页的左边） -->
    <div slot="footer-left">
      <el-button>全选</el-button>
    </div>
  </g-table>
</template>

<script>
import { getList } from '@/api/user'
export default {
  data() {
    return {
      form: {
        name: ''
      },
      headers: [
        { label: '姓名', prop: 'name' },
        { slot: true, slotName: 'slotAge' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  mounted() {
    this.$refs.table.load(1, {})
  },
  methods: {
    // 该方法必须返回promise
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    remove(data) {
      //
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    }
  }
}
</script>
