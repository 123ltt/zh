<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" @selection-change="handleSelectionChange">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="120px" size="mini" class="form-col no-message">
          <el-row>
            <el-col :span="9">
              <el-form-item label="线上服务名:" prop="ocsId">
                <g-select v-model="searchData.ocsId"
                          :items="serviceList"
                          key-field="id"
                          :label-field="getOnlineServiceLabel"
                          value-field="id"
                          clearable
                          :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="渠道名称:" prop="channelId">
                <g-select v-model.trim="searchData.channelId"
                          :items="channelList"
                          key-field="id"
                          :label-field="getLabel"
                          value-field="id"
                          placeholder="请选择"
                          style="width:100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
              <el-form-item label="平台:" prop="platformCode">
                <g-select v-model="searchData.platformCode"
                          :items="platformList"
                          key-field="platformCode"
                          label-field="platformName"
                          value-field="platformCode"
                          clearable
                          :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9" class="d-flex justify-content-end align-items-end pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
              <el-button icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="addEditBtn()">新增</el-button>
              <el-button type="danger" plain icon="el-icon-close" size="mini" @click="deleteBtn(deleteRows)">批量删除</el-button>
            </el-col>
          </el-row>

        </el-form>
      </template>
      <!-- 平台展示 -->
      <el-table-column slot="platform" label="平台" align="center" min-width="120px">
        <template v-slot="{row}">
          {{ row.onlineChannelServiceVO.platformName }}
        </template>
      </el-table-column>
      <!-- 线上服务展示 -->
      <el-table-column slot="onlineChannelService" label="线上服务名" align="center" min-width="180px">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">
            <g-text-ellipsis>
              {{ row.onlineChannelServiceVO.onlineServiceNameEn }}({{ row.onlineChannelServiceVO.onlineServiceNameCn }})
            </g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>
      <!-- 店铺展示 -->
      <el-table-column slot="storesSelect" label="店铺" align="center" min-width="90px">
        <template v-slot="{row}">
          {{ getStoreType(row.storeType) }}
        </template>
      </el-table-column>
      <!-- 自定义插槽 ：操作 -->
      <el-table-column slot="handler" label="操作" align="center" width="180px">
        <template v-slot="scope">
          <el-button type="text" @click="addEditBtn(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { dictionary, logisticsChannel } from '@/api/common'
import { getplatformAllList } from '@/api/platformLimits'
import { getOnlineServiceAllList } from '@/api/serviceConfiguration'
import { getServiceBindList, onlineServiceBindRemove } from '@/api/serviceBinding'
import bindingAddEdit from './bindingModal/addEditStore'
import bindingDetail from './bindingModal/detail'
export default {
  name: 'TmsOptimizeOlbinding',
  data() {
    return {
      storeTypeList: [],
      platformList: [],
      serviceList: [],
      storeList: [],
      channelList: [],
      deleteRows: [], // 批量删除存储
      searchData: {
        ocsId: '',
        channelId: '',
        platformCode: ''
      },
      headers: [
        { type: 'selection', width: 55 },
        {
          slot: true,
          slotName: 'platform'
        },
        {
          slot: true,
          slotName: 'onlineChannelService'
        },
        {
          label: '渠道名称',
          prop: 'channelName',
          minWidth: '180px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'storesSelect'
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
  activated() {
    this.getData()
  },
  methods: {
    getData() {
      Promise.all([
        dictionary('common_store_type'),
        getOnlineServiceAllList(),
        getplatformAllList(),
        logisticsChannel()
      ]).then(res => {
        this.searchData.ocsId = this.$route.params?.ocsId ?? ''
        this.searchData.platformCode = this.$route.params?.platformCode ?? ''
        this.initialization()
        this.storeTypeList = res[0].data
        this.serviceList = res[1].data
        this.platformList = res[2].data
        this.channelList = res[3].data
      }).catch(() => {})
    },
    // 店铺类型字典
    getStoreType(val) {
      return this.storeTypeList && this.storeTypeList.find(item => item.dictKey === val + '')?.dictValue
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },
    getOnlineServiceLabel(item) {
      return `${item.onlineServiceNameEn} (${item.onlineServiceNameCn})`
    },
    initialization() {
      this.$refs.table.load(this.current, this.searchData)
    },
    search() {
      this.current = 1
      this.initialization()
    },
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
      this.current = 1
      this.initialization()
    },
    fetch({ current, size }, params) {
      return getServiceBindList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    handleSelectionChange(val) {
      this.deleteRows = val
    },
    deleteBtn(rows) {
      if (Array.isArray(rows) && !rows.length) {
        return this.$message.error('请点击要批量删除的选项')
      }
      const ids = Array.isArray(rows) ? rows.map(item => item.id).join(',') : rows.id
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlineServiceBindRemove(ids).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          this.initialization()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增编辑
    addEditBtn(row) {
      const title = !row ? '新增线上服务绑定' : '编辑线上服务绑定'

      this.$newTab({
        title,
        component: bindingAddEdit,
        width: '700px',
        clearCache: true,

        data: {
          isAdd: !row,
          id: row?.id || '',
          platformList: this.platformList,
          serviceList: this.serviceList
        },
        callback: (bool) => {
          if (bool) {
            !row ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 详情
    detailBtn(row) {
      console.log(this.serviceList, this.platformList)
      this.$newTab({
        path: '/serviceBinding/info/detail',
        title: '线上绑定详情',
        component: bindingDetail,
        clearCache: true,
        data: {
          id: row.id,
          serviceList: this.serviceList,
          platformList: this.platformList
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
