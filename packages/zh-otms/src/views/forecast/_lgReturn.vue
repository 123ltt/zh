<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="120px" size="mini" class="form-col no-message">
          <el-row>
            <el-col :span="8">
              <el-form-item label="物流单：" prop="code">
                <el-input v-model="searchData.code" maxlength="40" clearable style="width:95%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="跟踪号：" prop="trackingNumber">
                <el-input v-model="searchData.trackingNumber" maxlength="40" clearable style="width:95%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="扩展跟踪号：" prop="trackingNumberEx">
                <el-input v-model="searchData.trackingNumberEx" maxlength="40" clearable style="width:95%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间：" prop="createTime">
                <el-date-picker v-model="searchData.createTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width:95%"
                                :default-time="['00:00:00', '23:59:59']"
                                clearable
                                value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="d-flex justify-content-end align-items-end pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
              <el-button icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
              <el-button type="primary" icon="el-icon-upload2" size="mini" class="me-1" @click="upBtn">导入</el-button>
              <el-button type="primary" icon="el-icon-download" size="mini" @click="downBtn">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 业务标识详情跳转 -->
      <el-table-column slot="code" label="物流单" align="center" min-width="90px">
        <template #default="{row}">
          {{ row.code }}
        </template>
      </el-table-column>
      <!-- 退件原因 -->
      <el-table-column slot="reason" label="退件原因" align="center" min-width="120px">
        <template #default="{row}">
          <g-text-ellipsis>{{ row.reason }}</g-text-ellipsis>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { getList, downloadTemplate, importOrderRefuse, exportOrderRefuse } from '@/api/lgReturn'
import { dowloadExc } from '@/util/util'
import priceDownorUp from '@/views/components/downorup.vue'
export default {
  name: 'TmsForecastLgReturn',
  data() {
    return {
      current: 1,
      searchData: {
        code: '',
        trackingNumber: '',
        trackingNumberEx: '',
        createTime: []
      },
      headers: [
        {
          slot: true,
          slotName: 'code'
        },

        {
          label: '跟踪号',
          prop: 'trackingNumber',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '扩展跟踪号',
          prop: 'trackingNumberEx',
          minWidth: '120px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'reason'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '200px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    search() {
      this.current = 1
      this.init()
    },

    changeFunc() {
      this.current = 1
      this.init()
    },

    init() {
      const params = JSON.parse(
        JSON.stringify(this.searchData,
          ['code', 'trackingNumber', 'trackingNumberEx', 'reason'])
      )
      if (this.searchData.createTime && this.searchData.createTime.length) {
        params.startDate = this.searchData.createTime[0]
        params.endDate = this.searchData.createTime[1]
      }
      this.$refs.table.load(this.current, params)
    },

    fetch({ current, size }, params) {
      return getList({ current, size, ...params }).then(res => {
        this.current = res.data.current

        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.pageSize
        }
      })
    },

    reset() {
      this.searchData = { createTime: [] }
      this.current = 1
      this.init()
    },
    upBtn() {
      this.$modal({
        title: '导入退件',
        component: priceDownorUp,
        width: '500px',
        data: {
          downloadTemplateCt: downloadTemplate,
          templateName: '物流退件模板.xlsx',
          uploadInterface: importOrderRefuse,
          hasDCt: true

        },
        callback: (bool) => {
          if (bool) {
            this.current = 1
            this.init()
          }
        }
      })
    },
    downBtn() {
      const params = JSON.parse(
        JSON.stringify(this.searchData,
          ['code', 'trackingNumber', 'trackingNumberEx', 'reason'])
      )
      if (this.searchData.createTime && this.searchData.createTime.length) {
        params.startDate = this.searchData.createTime[0]
        params.endDate = this.searchData.createTime[1]
      }
      this.$confirm('确认导出退件物流数据?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true
        exportOrderRefuse(params).finally(() => {
          this.loading = false
        }).then(res => {
          dowloadExc(res, '物流数据.xlsx')
          this.$message.success('导出成功')
        })
      })
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
