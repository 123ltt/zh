<template>
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" :show-order="true">
      <template slot="header">
        <el-form label-width="120px" size="mini" class="no-message form-col">
          <el-row>
            <el-col :span="7">
              <el-form-item label="业务单号：" prop="referenceNumber">
                <el-input
                  v-model.trim="formData.referenceNumber"
                  type="textarea"
                  placeholder="请输入"
                  clearable
                  class="w-85"
                />
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="操作时间：" prop="operateTime">
                <el-date-picker v-model="formData.operateTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                class="w-85"
                                :default-time="['00:00:00', '23:59:59']"
                                clearable
                                value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="租户：" prop="tenantId">
                <el-select v-model="formData.tenantId" clearable placeholder="请选择" filterable class="w-85">
                  <el-option v-for="item in tenantList" :key="item.tenantId" :label="`${item.tenantId}(${item.tenantName})`" :value="item.tenantId" />
                </el-select>
              </el-form-item>

            </el-col>

          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="消息类型：" prop="bizType">
                <el-select v-model="formData.bizType" clearable placeholder="请选择" filterable class="w-85">
                  <el-option v-for="item in logTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="formData.status" @change="changeFunc">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="6" class="d-flex justify-content-end align-items-end pb-2">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button class="ms-2" size="mini" icon="el-icon-delete" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="action" label="消息" min-width="100px" align="center">
        <template v-slot="{row}">
          <g-list-group label-width="30px" align="left">
            <g-list-group-item label="类型">
              {{ getLogTypeList[row.bizType] }}
            </g-list-group-item>
            <g-list-group-item label="状态">
              <span :class="row.status?'text-danger':''" style="text-align:left" @click="defeated(row)">{{ ['成功','失败'][row.status] }}
              </span>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>
      <el-table-column slot="requestSystem" label="通信方" align="center" min-width="100px">
        <template v-slot="{row}">
          <g-list-group label-width="40px" align="left">
            <g-list-group-item label="发送方">
              <g-text-ellipsis>{{ getSysName(row.requestSysName) }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="接收方">
              <g-text-ellipsis>{{ getSysName(row.responseSysName) || getChannelList[row.responseSysName] }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>
      <el-table-column slot="time" label="时间" align="center" min-width="100px">
        <template v-slot="{row}">
          <g-list-group label-width="50px" align="left">
            <g-list-group-item label="操作时间">
              <g-text-ellipsis>{{ row.updateTime }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="接口耗时">
              <g-text-ellipsis>{{ row.time }}ms</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </template>
      </el-table-column>
      <el-table-column slot="request" label="请求" align="center" min-width="130px">
        <template v-slot="{row}">
          <el-input v-model="row.requestMessage" type="textarea" :rows="3" min-width="200px" :readonly="true" />
        </template>
      </el-table-column>
      <el-table-column slot="response" label="响应" align="center" min-width="130px">
        <template v-slot="{row}">
          <el-input v-model="row.responseMessage" type="textarea" :rows="3" min-width="200px" :readonly="true" />
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" align="center" width="80px">
        <template v-slot="{row}">
          <el-button type="primary" class="ms-2" size="mini" @click="retry(row)">重试</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>
<script>
import { getList, logRetry } from '@/api/forecast/sysytemLog'
import { logisticsChannel, dictionary, getTenant } from '@/api/common'
export default {
  name: 'TmsForecastSystemLog',
  data() {
    return {
      formData: {
        status: '',
        tenantId: ''
      },
      tenantList: [],
      logTypeList: [],
      sysNameList: {},
      getLogTypeList: {},
      getChannelList: {},
      statusList: [
        { dictKey: '', dictValue: '全部' },
        { dictKey: '0', dictValue: '成功' },
        { dictKey: '1', dictValue: '失败' }
      ],
      headers: [
        { label: '业务单号', prop: 'bizNumber', align: 'center', minWidth: '80px' },
        { slot: true, slotName: 'requestSystem' },
        { slot: true, slotName: 'responseSystem' },
        { slot: true, slotName: 'action' },
        { slot: true, slotName: 'request' },
        { slot: true, slotName: 'response' },
        { slot: true, slotName: 'time' },
        { slot: '操作', slotName: 'handler' }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  deactivated() {
    this.dialogVisible = false
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('common_system_name'),
        dictionary('forecast_log_type'),
        logisticsChannel(),
        getTenant()
      ]).then(res => {
        res[0].data.forEach(item => {
          this.sysNameList[item.dictKey] = item.dictValue
        })
        this.logTypeList = res[1].data
        this.logTypeList.forEach(item => {
          this.getLogTypeList[item.dictKey] = item.dictValue
        })

        res[2].data.forEach(item => {
          this.getChannelList[item.channelCode] = item.name
        })
        this.tenantList = res[3].data
        this.init()
      })
    },
    // 启用状态更改
    changeFunc() {
      this.init()
    },

    defeated(val) {
      if (val.status) {
        alert(val.errorMsg)
      }
    },
    getSysName(val) {
      return this.sysNameList[val]
    },
    init() {
      const params = JSON.parse(
        JSON.stringify(this.formData,
          ['referenceNumber', 'bizType', 'status', 'tenantId'])
      )
      const operateTime = this.formData.operateTime
      if (operateTime) {
        params.startDate = operateTime[0]
        params.endDate = operateTime[1]
      } else {
        params.startDate = params.endDate = ''
      }
      this.$refs.table.load(1, params)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.list,
          total: res.data.pagesVO.totalPages,
          size: res.data.pagesVO.pageSize
        }
      })
    },
    retry(row) {
      const params = {
        consumerQueue: row.consumerQueue,
        mqMessage: row.mqMessage,
        bizType: row.bizType
      }
      logRetry(params).then(res => {
        this.$message.success('重新请求成功!')
        this.init()
      })
    },
    search() {
      this.init()
    },
    reset() {
      this.formData = { status: '' }
      this.init()
    }

  }
}
</script>
<style lang="scss" scoped>
.w-85{
  width:85%!important
}
::v-deep .jv-container .jv-code{
  padding:20px 0px 10px
}
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
</style>
