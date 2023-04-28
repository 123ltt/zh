<template>
  <g-table ref="table" :headers="headers" :fetch="fetch">
    <template slot="header">
      <el-row :gutter="20">
        <el-col :span="2" class="mt-2">
          <el-dropdown class="d-flex justify-content-end align-items-center" @command="handleCommand">
            <span class="el-dropdown-link text-primary">
              {{ label }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in list" :key="item.key" :command="[item.key,item.name]">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="10">
          <el-input v-model="value" placeholder="请输入内容" size="small" clearable />
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="init">搜索</el-button>
        </el-col>
      </el-row>
    </template>
    <el-table-column slot="country" label="国家" align="center" min-width="100px">
      <template #default="{row}">
        <g-text-ellipsis>{{ row.country }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column slot="data" label="分区数据" align="center" min-width="100px">
      <template #default="{row}">
        <g-link color="primary" @click="lookOverData(row)">查看</g-link>
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" fixed="right" align="center" width="240px">
      <template #default="{row}">
        <el-button type="text" @click="handlerBtn(row)">删除</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>
<script>
import { channelPartitionList, partitionRemove } from '@/api/costOffer'
import zoneDataDetail from './zoneDataDetail'
export default {
  name: 'ZoneTable',
  props: {
    channelCode: String
  },
  data() {
    return {
      current: 1,
      value: '',
      label: '',
      key: '',
      headers: [
        { slot: true, slotName: 'country' },
        { label: '分区名称', prop: 'partitionName', align: 'center' },
        { slot: true, slotName: 'data' },
        { slot: true, slotName: 'handler' }
      ],
      list: [
        { key: 'country', name: '国家简称' },
        // { key: 'province', name: '省名称' },
        // { key: 'city', name: '市名称' },
        { key: 'postCode', name: '邮编' }
      ]
    }
  },
  mounted() {
    this.label = this.list[0].name
    this.key = this.list[0].key
    this.init()
  },

  methods: {
    init(originalRefresh = true) {
      const current = originalRefresh ? 1 : this.current
      const params = {}
      params.channelCode = this.channelCode //  渠道名称
      params[this.key] = this.value
      this.$refs.table.load(current, params)
    },
    handleCommand(val) {
      this.key = val[0]
      this.label = val[1]
    },
    fetch({ current, size }, params) {
      return channelPartitionList(current, size, params).then(res => {
        this.current = res.data.current
        this.$emit('hasImportFunc', !!res.data.records.length)
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },

    lookOverData(row) {
      this.$modal({
        title: '分区数据查看',
        width: '800px',
        component: zoneDataDetail,
        data: {
          params: {
            channelCode: this.channelCode,
            partitionName: row.partitionName
          }
        },
        callback: (bool) => {
          this.init()
        }
      })
    },
    handlerBtn(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          channelCode: this.channelCode,
          partitionName: row.partitionName
        }
        partitionRemove(params).then(res => {
          this.$message.success('操作成功')
          this.init(false)
        })
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
}
</style>
