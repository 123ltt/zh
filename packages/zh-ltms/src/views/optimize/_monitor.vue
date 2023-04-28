<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="120px" size="mini" class="form-col no-message">
          <el-row>
            <el-col :span="9">
              <el-form-item label="业务标识:" prop="bizId">
                <el-input v-model="searchData.bizId" maxlength="40" clearable style="width:95%" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="创建时间:" prop="time">
                <el-date-picker
                  v-model="searchData.startDate"
                  type="datetime"
                  placeholder="选择开始时间"
                  style="width:48%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00"
                  :picker-options="pickerOptions0"
                /> - <el-date-picker
                  v-model="searchData.endDate"
                  type="datetime"
                  placeholder="选择结束时间"
                  style="width:48%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="23:59:59"
                  :picker-options="pickerOptions1"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="日志状态:" prop="type">
                <el-radio-group v-model="searchData.type" @change="init">
                  <el-radio-button v-for="item in logTypeList" :key="item.dictKey" :label="item.dictKey">
                    {{ item.dictValue }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="3" class="d-flex justify-content-end align-items-end pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="init">搜索</el-button>
              <el-button icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 业务标识详情跳转 -->
      <el-table-column slot="bizId" label="业务标识" align="center" min-width="90px">
        <template #default="{row}">
          <g-link color="primary" @click="detailBtn(row)">{{ row.bizId }}</g-link>
        </template>
      </el-table-column>
      <!-- 调用方获取 -->
      <el-table-column slot="requestName" label="调用方" align="center" width="110px">
        <template v-slot="{row}">
          {{ getRequestName(row.requestName) }}
        </template>
      </el-table-column>
      <!-- 日志状态 -->
      <el-table-column slot="type" label="日志状态" align="center" width="100px">
        <template v-slot="{row}">
          {{ getTypeName(row.type) }}
        </template>
      </el-table-column>
      <!-- 请求 -->
      <el-table-column slot="requestStr" label="请求" align="center" min-width="100px">
        <template v-slot="{row}">
          <el-input v-model="row.requestStr" type="textarea" :rows="3" min-width="200px" :readonly="true" />
        </template>
      </el-table-column>
      <!-- 响应 -->
      <el-table-column slot="responseStr" label="响应" align="center" min-width="100px">
        <template v-slot="{row}">
          <el-input v-model="row.responseStr" type="textarea" :rows="3" min-width="200px" :readonly="true" />
        </template>
      </el-table-column>
      <!-- 操作用户 -->
      <el-table-column slot="handler" label="操作用户" align="center" min-width="80px">
        <template v-slot="{row}">
          <g-text-ellipsis>{{ row.tenantId }}('操作用户')</g-text-ellipsis>
        </template>
      </el-table-column>
      <!-- 错误信息 -->
      <el-table-column slot="errorMsg" label="错误信息" align="center" min-width="90px">
        <template v-slot="{row}">
          <g-text-ellipsis class="text-danger">{{ row.errorMsg }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <!-- 时间 -->
      <el-table-column slot="time" label="时间" align="center" width="200px">
        <template v-slot="{row}">
          <g-list-group label-width="50px" align="left">
            <g-list-group-item label="创建时间">
              <g-text-ellipsis>{{ row.createTime }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="更新时间">
              <g-text-ellipsis>{{ row.updateTime }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="总耗时">
              <g-text-ellipsis>{{ row.totalTimeConsume }}<span v-if="row.totalTimeConsume">ms</span></g-text-ellipsis>
            </g-list-group-item>

          </g-list-group>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { getList } from '@/api/monitor'
import { dictionary } from '@/api/common'
import detail from './monitorModal/detail'
export default {
  name: 'TmsOptimizeMonitor',
  data() {
    return {
      searchData: {
        type: '',
        endDate: '',
        startDate: ''
      },
      current: 1,
      logTypeList: [],
      systemNameList: [],
      pickerOptions0: this.beginDate(),
      pickerOptions1: this.processDate(),
      headers: [
        {
          slot: true,
          slotName: 'bizId'
        },
        {
          slot: true,
          slotName: 'requestName'
        },
        {
          slot: true,
          slotName: 'type'
        },
        {
          slot: true,
          slotName: 'requestStr'
        },
        {
          slot: true,
          slotName: 'responseStr'
        },
        {
          slot: true,
          slotName: 'time'
        },
        {
          slot: true,
          slotName: 'errorMsg'
        },
        {
          slot: true,
          slotName: 'handler'
        }

      ]
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    beginDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.searchData.endDate) {
            return new Date(self.searchData.endDate).getTime() < time.getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.searchData.startDate) {
            return new Date(self.searchData.startDate).getTime() > time.getTime()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    getData() {
      Promise.all([
        dictionary('channel_optimize_log_type'),
        dictionary('common_system_name')
      ]).then(res => {
        res[0].data.unshift({ dictKey: '', dictValue: '全部' })
        this.logTypeList = res[0].data
        this.systemNameList = res[1].data
        this.init()
      }).catch(() => {})
    },
    init() {
      this.$refs.table.load(1, this.searchData)
    },
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
      this.init()
    },

    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    getRequestName(val) {
      return this.systemNameList.find(item => item.dictKey === val)?.dictValue
    },
    getTypeName(val) {
      return this.logTypeList.find(item => item.dictKey === val + '')?.dictValue
    },
    detailBtn(row) {
      this.$newTab({
        path: '/monitor/detail',
        title: '运算监控详情',
        component: detail,
        clearCache: true,
        data: {
          detailInfo: row
        },
        callback: (bool) => {
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
