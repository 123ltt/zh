<template>
  <basic-container>
    <g-table ref="table"
             row-key="id"
             :headers="headers"
             :fetch="fetch"
             @selection-change="handleSelectionChange"
    >
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="100px" size="mini" class="no-message form-col">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="渠道名称" prop="channelId">
                <g-select v-model.trim="searchData.channelId"
                          :items="channelList"
                          key-field="id"
                          :label-field="getLabel"
                          value-field="id"
                          placeholder="请选择"
                />

              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道类型" prop="channelType">
                <el-select v-model="searchData.channelType" clearable placeholder="请选择" filterable style="width:85%">
                  <el-option v-for="item in channelTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="平台" prop="platformCode">
                <g-select v-model="searchData.platformCode"
                          :items="platformList"
                          key-field="platformCode"
                          label-field="platformName"
                          value-field="platformCode"
                          placeholder="请选择"
                          :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="启用状态" prop="status">
                <el-radio-group v-model="searchData.status" @change="changeStatus">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="d-flex justify-content-start align-items-end pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
              <el-button class="ms-3 " icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
              <el-button type="primary" class="ms-3" icon="el-icon-plus" size="mini" plain @click="addEditBtn()">新增</el-button>
              <el-button type="danger" plain class="ms-3" icon="el-icon-close" size="mini" @click="deleteBtn(deleteRows)">批量删除</el-button>
            </el-col>
          </el-row>

        </el-form>
      </template>

      <!-- 限制名称跳转详情 -->
      <el-table-column slot="name" label="限制名称" min-width="100px" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">{{ row.name }}</g-link>
        </template>
      </el-table-column>

      <!-- 渠道类型转换 -->
      <el-table-column slot="channelType" label="渠道类型" align="center" width="90px">
        <template v-slot="{row}">
          <div v-for="item in channelTypeList" :key="item.dictKey">
            <span v-if="row.channelType == item.dictKey">{{ item.dictValue }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 状态开关改动 -->
      <el-table-column slot="status" label="启用状态" align="center" width="90px">
        <template v-slot="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="onChangeStaus(row)"
          />
        </template>
      </el-table-column>

      <!-- 平台展示 -->
      <el-table-column slot="channelSaleLimitPlatformVos" label="平台" align="center" width="90px">
        <template v-slot="{row}">

          <g-text-ellipsis>
            {{ row.platformString }}
          </g-text-ellipsis>

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
      <el-table-column slot="handler" label="操作" align="center" width="190px">
        <template v-slot="scope">
          <el-button type="text" @click="addEditBtn(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import {
  getplatformList,
  getplatformAllList,
  changeplatformStatus,
  platformRemove
} from '@/api/platformLimits'
import { dictionary, logisticsChannel } from '@/api/common'
import platformAddLimit from './platformModal/addEdit.vue'
import platformLimitDetail from './platformModal/detail.vue'

export default {
  name: 'TmsOptimizePlatform',

  data() {
    return {
      searchData: {
        status: '1'
      },
      channelTypeList: [],
      platformList: [],
      channelList: [],
      deleteRows: [],
      current: 1,
      statusList: [],
      headers: [
        { type: 'selection', width: 55, align: 'center' },
        { label: '渠道名称', prop: 'channelName', minWidth: '90px', align: 'center' },
        { slot: true, slotName: 'name' },
        { slot: true, slotName: 'channelType' },
        { slot: true, slotName: 'channelSaleLimitPlatformVos', align: 'center' },
        { label: '优先级', prop: 'priority', width: '90px', align: 'center' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'remark' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      Promise.all([
        dictionary('channel_type'),
        dictionary('status'),
        getplatformAllList(),
        logisticsChannel()
      ]).then(res => {
        this.channelTypeList = res[0].data
        this.statusList = [{ dictKey: '', dictValue: '全部' }, ...res[1].data]
        this.platformList = res[2].data
        this.channelList = res[3].data

        this.initialization()
      })
    },

    changeStatus(val) {
      this.current = 1
      this.initialization()
    },

    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    // 回调函数
    fetch({ current, size }, params) {
      return getplatformList(current, size, params).then(res => {
        this.current = res.data.current
        res.data.records.forEach(item => {
          const platformArray = item.channelSaleLimitPlatformVos.map(element => element.platformName)
          item.platformString = platformArray.join('、')
        })
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },

    search() {
      this.current = 1
      this.initialization()
    },

    // 刷新列表页
    initialization() {
      this.$refs.table.load(this.current, this.searchData)
    },

    // 重置
    reset() {
      this.searchData = {
        status: '1'
      }
      this.current = 1
      this.initialization()
    },

    // 平台详情
    detailBtn(row) {
      this.$newTab({
        path: '/platformManagement/info/detail',
        title: '平台销售详情',
        component: platformLimitDetail,
        clearCache: true,
        data: {
          detailInfo: row
        },
        callback: (bool) => {
        }
      })
    },

    // 行间状态更改
    onChangeStaus(row) {
      const params = {
        id: row.id,
        status: row.status
      }
      changeplatformStatus(params).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
        this.initialization()
      })
    },

    // 新增编辑
    addEditBtn(row) {
      this.$newTab({
        path: '/platformModal/addEdit',
        title: !row ? '新增平台销售限制' : '编辑平台销售限制',
        component: platformAddLimit,
        clearCache: true,
        data: {
          isAdd: !row,
          id: row ? row.id : '',
          platformList: JSON.parse(JSON.stringify(this.platformList))
        },
        callback: (bool) => {
          if (bool) {
            // 原则：刷新看到操作的数据
            const isAdd = !row
            isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },

    // 删除
    deleteBtn(rows) {
      let ids
      if (Array.isArray(rows) && !rows.length) {
        return this.$message.error('请点击要批量删除的选项')
      }
      if (Array.isArray(rows)) {
        ids = rows.map(item => item.id).join(',')
      } else {
        ids = rows.id
      }
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        platformRemove(ids).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initialization()
        })
      }).catch(() => {})
    },

    // 批量删除 checkbox点击触发
    handleSelectionChange(val) {
      this.deleteRows = val
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
.g-select {
  width:85%!important;
}
</style>
