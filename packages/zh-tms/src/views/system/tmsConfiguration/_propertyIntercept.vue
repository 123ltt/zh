<template>
  <!-- 属性拦截 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form size="mini" label-width="100px" class="form-col no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="规则名称：" prop="name">
                <el-input v-model="formData.name" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="pb-2">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addBtn('add')">新增</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="status" label="启用状态" align="center">
        <template v-slot="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="onChangeStaus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" align="center">
        <template v-slot="{row}">
          <el-button size="mini" type="text" @click="addBtn('edit',row)">编辑</el-button>
          <el-button size="mini" type="text" @click="deleClick(row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
// DeleProperty,changeStatus
import { getList, DeleProperty, changeStatus } from '@/api/interCept'
import interCept from './configurationModal/interCept'
export default {
  data() {
    return {
      formData: {
      },
      headers: [
        { label: '状态名称', prop: 'name', align: 'center', minWidth: '120px' },
        { slot: true, slotName: 'status' },
        { label: '备注', prop: 'remark', align: 'center', minWidth: '120px' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onChangeStaus(row) {
      changeStatus(row).then(res => {
        this.init()
        this.$message.success(res.msg)
      })
    },
    init(current) {
      this.$refs.table.load(1, this.formData)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    addBtn(type, rows) {
      this.$modal({
        title: type === 'add' ? '新增属性拦截' : '修改属性拦截',
        width: '60%',
        component: interCept,
        data: {
          type,
          rows
        },
        callback: (flag) => {
          flag && this.init()
        }
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formData = {}
      this.init()
    },
    deleClick(rows) {
      DeleProperty(rows).then(res => {
        this.init()
        this.$message.success(res.msg)
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
