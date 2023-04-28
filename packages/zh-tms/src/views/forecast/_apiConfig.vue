<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" :show-order="true">
      <template slot="header">
        <el-form label-width="100px" size="mini" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="物流商：" prop="lpId">
                <g-select v-model.trim="formData.lpId"
                          :items="providerList"
                          key-field="id"
                          :item-title="true"
                          label-field="lpAbbreviation"
                          value-field="id"
                          placeholder="请选择"
                          class="w-100"
                          @change="changeChannel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="渠道名称：" prop="channelCode">
                <g-select v-model.trim="formData.channelCode"
                          :items="showChannelList"
                          key-field="channelCode"
                          :label-field="getLabel"
                          value-field="channelCode"
                          placeholder="请选择"
                          class="w-100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="启用状态：" prop="status">
                <el-radio-group v-model="formData.status" size="mini" @change="changeFunc">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-flex justify-content-end align-items-center pb-2">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="apiEdit()">新增</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="status" label="启用状态" align="center" width="100px">
        <template #default="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="onChangeStaus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column slot="paramJson" label="授权信息" align="center" min-width="180px">
        <template #default="{row}">
          <g-text-ellipsis max-length="10">{{ row.paramJson }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="120px" align="center">
        <template #default="{row}">
          <el-button type="text" size="mini" @click="apiEdit(row)">编辑</el-button>
          <el-button type="text" size="mini" @click="deleData(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import apiAddEdit from './apiModal/apiAddEdit'
import { getList, OoCStatus, deleData } from '@/api/forecast/apiConfiguration'
import { getLogisticsProvider, logisticsChannel, dictionary } from '@/api/common'
export default {
  name: 'TmsForecastApiConfig',
  data() {
    return {
      providerList: [],
      channelList: [], // 存储数据
      showChannelList: [], // 展示数据
      statusList: [],
      formData: {
        status: '1'
      },
      current: 1,
      headers: [
        { slot: true, slotName: 'indexNumber' },
        { label: '物流商', prop: 'lpName', align: 'center', minWidth: '90px' },
        { label: '渠道名称', prop: 'channelName', align: 'center', minWidth: '90px' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'paramJson' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },

  mounted() {
    this.getData()
    this.init()
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('status'), // 状态
        getLogisticsProvider(), // 物流商
        logisticsChannel() // 渠道名称
      ]).then(res => {
        res[0].data.unshift({ dictKey: '', dictValue: '全部' })
        this.statusList = res[0].data

        this.providerList = res[1].data.filter(item => item.auditStatus === 1)

        this.channelList = this.showChannelList = res[2].data
      })
    },
    changeChannel(val) {
      this.showChannelList = val
        ? this.channelList.filter(item => item.exWarehouseLpId + '' === val.id + '')
        : this.channelList
    },

    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    changeFunc() {
      this.init()
    },

    init(headRefresh = true) {
      const current = headRefresh ? 1 : this.current
      this.$refs.table.load(current, this.formData)
    },

    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.pageSize
        }
      })
    },
    // 行间状态更改
    onChangeStaus(row) {
      OoCStatus(row.id, row.status).then(res => {
        this.$message.success(res.msg)
        this.init(false)
      })
    },
    apiEdit(rows) {
      const channelList = Object.assign([], this.channelList)
      const providerList = Object.assign([], this.providerList)
      this.$modal({
        title: !rows ? '新增 API 配置' : '编辑 API 配置',
        component: apiAddEdit,
        width: '700px',
        data: {
          isAdd: !rows,
          rows,
          channelList,
          providerList
        },
        callback: (flag) => {
          if (flag) {
            const isAdd = !rows
            isAdd ? this.reset() : this.init(false)
          }
        }
      })
    },
    deleData(id) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleData(id).then(res => {
          this.$message.success('操作成功')
          this.init(false)
        })
      }).catch(() => {})
    },
    search() {
      this.init()
    },
    reset() {
      this.formData = { status: '1' }
      this.changeChannel()
      this.init(false)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio-group{
  width:100%;
  display:flex;
  .el-radio-button.el-radio-button--mini{
   flex:1;
    ::v-deep .el-radio-button__inner{
      padding:0!important;
      width:100%;
      height:28px;
      line-height:28px;
    }
  }
}
</style>
