<template>
  <basic-container v-loading="loading">
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="100px" size="mini" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="物流商：" prop="exWarehouseLpId">
                <g-select v-model.trim="searchData.exWarehouseLpId"
                          :items="providerList"
                          key-field="id"
                          :item-title="true"
                          label-field="lpAbbreviation"
                          value-field="id"
                          placeholder="请选择"
                          class="w-85"
                          @change="getChannel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道名称：" prop="id">
                <g-select v-model.trim="searchData.id"
                          :items="showChannelList"
                          key-field="id"
                          :label-field="getLabel"
                          value-field="id"
                          placeholder="请选择"
                          class="w-85"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="渠道类型：" prop="channelType">
                <el-select v-model="searchData.channelType" clearable placeholder="请选择" filterable class="w-85">
                  <el-option v-for="item in channelTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="启用状态：" prop="status">
                <el-radio-group v-model="searchData.status" @change="changeFunc">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="d-flex justify-content-start pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="initialization(true)">搜索</el-button>
              <el-button class="ms-3" icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
              <el-button type="primary" class="ms-3" icon="el-icon-plus" size="mini" @click="addEditBtn()">新增</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 渠道名称跳转详情 -->
      <el-table-column slot="name" label="渠道名称" align="center" min-width="100px">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">{{ row.name }}</g-link>
        </template>
      </el-table-column>

      <!-- 渠道类型转换 -->
      <el-table-column slot="channelType" label="渠道类型" align="center" width="100px">
        <template v-slot="{row}">
          <div v-for="item in channelTypeList" :key="item.dictKey">
            <span v-if="row.channelType == item.dictKey">{{ item.dictValue }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 状态开关改动 -->
      <el-table-column slot="status" label="启用状态" align="center" width="100px">
        <template v-slot="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="onChangeStaus(row)"
          />
        </template>
      </el-table-column>

      <!-- 备注 -->
      <el-table-column slot="remark" label="备注" align="center" min-width="120px">
        <template v-slot="{row}">
          <g-text-ellipsis>
            {{ row.remark }}
          </g-text-ellipsis>

        </template>
      </el-table-column>

      <!-- 自定义插槽 ：操作 -->
      <el-table-column slot="handler" label="操作" align="center" width="100px">
        <template v-slot="scope">
          <el-button type="text" @click="addEditBtn(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getChannelList, changeStatus } from '@/api/channelInformation'
import { dictionary, logisticsChannel, getLogisticsProvider } from '@/api/common'
import channelAdd from './channelModal/addEdit'

export default {
  name: 'TmsProviderChannel',
  data() {
    return {
      loading: false,
      providerList: [],
      channelList: [],
      showChannelList: [],
      searchData: {
        status: '1'
      },
      current: 1, // 列表当前页, 原则：操作立即可见
      channelTypeList: [],
      statusList: [],
      headers: [
        {
          label: '物流商',
          prop: 'lpAbbreviation',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'name'
        },
        {
          label: '渠道代码(内)',
          prop: 'channelCode',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '代理商编号',
          prop: 'agentCode',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'channelType'
        },
        {
          label: '时效(天)',
          prop: 'timeliness',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'remark'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization(true)
  },
  methods: {
    // 获取数据
    getData() {
      Promise.all([
        dictionary('channel_type'),
        dictionary('status'),
        logisticsChannel(),
        getLogisticsProvider()
      ]).then(res => {
        this.channelTypeList = res[0].data

        res[1].data.unshift({ dictKey: '', dictValue: '全部' })
        this.statusList = res[1].data

        this.showChannelList = this.channelList = res[2].data

        this.providerList = res[3].data.filter(item => item.auditStatus === 1)
      }).catch(() => {})
    },

    /**
     * 刷新列表(下拉刷新)
     * originalRefresh 原始刷新：是否刷新到第一页
     */
    initialization(originalRefresh) {
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },

    fetch({ current, size }, params) {
      return getChannelList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },

    // 启用状态更改
    changeFunc() {
      this.initialization(true)
    },

    // 行间状态更改
    onChangeStaus(rows) {
      const params = {
        id: rows.id,
        status: rows.status
      }
      changeStatus(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
        this.initialization(false)
      })
    },

    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },
    // 联动关系，获取物流商下的渠道名称
    getChannel(val) {
      this.showChannelList = val
        ? this.channelList.filter(item => item.exWarehouseLpId === val.id)
        : this.channelList
    },
    // 重置
    reset(flag) {
      this.searchData = { status: '1' }
      this.getChannel()
      this.initialization(flag)
    },

    // 新增or编辑基本信息
    addEditBtn(row, flag) {
      this.$newTab({
        path: '/channelManage/info/addEdit',
        title: flag
          ? '渠道信息详情'
          : (row ? '编辑渠道信息' : '新增渠道信息'),
        component: channelAdd,
        clearCache: true,
        data: {
          isAdd: !row,
          isDetail: flag,
          row: row || {},
          providerList: this.providerList,
          channelTypeList: this.channelTypeList
        },
        callback: (bool) => {
          const isAdd = !row
          isAdd ? this.reset(isAdd) : this.initialization()
          // 渠道名称集合已经更改，重新获取
          logisticsChannel().then(res => {
            this.showChannelList = this.channelList = res.data
          })
        }
      })
    },

    // 渠道详情
    detailBtn(rows) {
      this.addEditBtn(rows, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio-group{
  width:85%;
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
.w-85{
  width:85%!important
}
</style>
