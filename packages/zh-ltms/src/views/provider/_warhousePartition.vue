<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" :show-order="true">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="100px" size="mini" class="form-col no-message">
          <el-row :gutter="10">
            <el-col :span="8" />
            <el-col :span="8" class="ms-3 ">
              <el-form-item prop="channelCode" label="渠道名称：">
                <g-select v-model.trim="searchData.channelCode"
                          :items="channelList"
                          key-field="channelCode"
                          :item-title="true"
                          :label-field="getLabel"
                          value-field="channelCode"
                          placeholder="请选择"
                          class="w-100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="d-flex justify-content-start pb-2 ">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="init">搜索</el-button>
              <el-button class="ms-3" size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
              <el-button type="primary" class="ms-3" size="mini" icon="el-icon-plus" @click="addEditBtn()">新增</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 渠道名称 -->
      <el-table-column slot="channelName" label="渠道名称" align="center" width="180px">
        <template v-slot="{row}">
          {{ channelObj[row.channelCode] }}
        </template>
      </el-table-column>

      <!-- 备注 -->
      <el-table-column slot="remark" label="备注" align="center" width="180px">
        <template v-slot="{row}">
          <g-text-ellipsis>
            {{ row.remark }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 自定义插槽 ：操作 -->
      <el-table-column slot="handler" label="操作" align="center" width="180px">
        <template v-slot="{row}">
          <el-button type="text" @click="addEditBtn(row)">编辑</el-button>
          <el-button type="text" @click="deleteBtn(row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getList, removeWarehouse } from '@/api/warehouse'
import { logisticsChannel } from '@/api/common'
import warehouseAddEdit from './warehouseModal/addEdit'
export default {
  name: 'TmsProviderWarhousePartition',
  data() {
    return {
      searchData: {},
      channelList: [],
      channelObj: {},
      current: 1,
      headers: [
        { slot: true, slotName: 'channelName' },
        { label: '规则名称', prop: 'ruleName', minWidth: '120px', align: 'center' },
        { label: '匹配跟踪号', prop: 'trackingNumberCode', minWidth: '120px', align: 'center' },
        { slot: true, slotName: 'remark' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      Promise.all([
        logisticsChannel()
      ]).then(res => {
        this.channelList = res[0].data
        this.channelList.forEach(item => {
          this.channelObj[item.channelCode] = item.name
        })
        this.init(true)
      })
    },

    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    init(flag) {
      const current = flag ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },

    reset() {
      this.searchData.channelCode = '  '
      delete this.searchData.channelCode
      this.init(true)
    },

    addEditBtn(row) {
      this.$modal({
        title: !row ? '新增仓库分区' : '编辑仓库分区',
        component: warehouseAddEdit,
        width: '700px',
        data: {
          isAdd: !row,
          channelList: Object.assign([], this.channelList),
          detailInfo: Object.assign([], row || [])
        },
        callback: (bool) => {
          if (bool) !row ? this.reset() : this.init(false)
        }
      })
    },

    deleteBtn(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const dwgId = this.channelList.find(item => item.channelCode === row.channelCode).dwgId
        removeWarehouse({ id: row.id, dwgId }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.init(false)
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input{
 width:85%!important;
}

</style>
