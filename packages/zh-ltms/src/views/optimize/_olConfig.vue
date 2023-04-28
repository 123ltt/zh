<!--线上服务配置 列表页-->
<template>
  <basic-container v-loading="loading">
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :model="searchData" label-width="100px" size="mini" class="form-col no-message">
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="平台：" prop="platformCode">
                <g-select v-model="searchData.platformCode" :items="platformList" key-field="platformCode" label-field="platformName" value-field="platformCode" clearable :item-title="true" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="线上服务名：" prop="id">
                <g-select v-model="searchData.id" :items="filterServiceList" key-field="id" :label-field="getLabel" value-field="id" clearable :item-title="true" />
              </el-form-item>
            </el-col>
            <el-col :span="9" class="d-flex justify-content-start  pb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" class="me-1" @click="initialization">搜索</el-button>
              <el-button icon="el-icon-delete" size="mini" class="me-1" @click="reset">重置</el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini" class="me-1" @click="addEditBtn()">新增</el-button>
              <el-button type="primary" icon="el-icon-upload2" size="mini" class="me-1" @click="upBtn">导入</el-button>
              <el-button type="primary" icon="el-icon-download" size="mini" @click="downBtn">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 平台展示 -->
      <el-table-column slot="onlineServiceName" label="线上服务名" align="center" min-width="200px">
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">
            <g-text-ellipsis>
              {{ row.onlineServiceNameEn }}({{ row.onlineServiceNameCn }})
            </g-text-ellipsis>
          </g-link>
        </template>
      </el-table-column>

      <!-- 自定义插槽 ：操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="150px">
        <template v-slot="scope">
          <el-button type="text" @click="serviceBanding(scope.row)">服务绑定</el-button>
          <el-button type="text" @click="addEditBtn(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>
<script>
import { getplatformAllList } from '@/api/platformLimits'
import { getOnlineServiceList, getOnlineServiceAllList, onlineChannelServiceRemove, onlineChannelServiceExport } from '@/api/serviceConfiguration'
import { dowloadExc } from '@/util/util' // 浏览器下载模板
import onlineServiceAddEdit from './configModal/addEdit'
import configurationDetail from './configModal/detail'
import priceDownorUp from '../components/downorup.vue'
export default {
  name: 'TmsOptimizeOlConfig',
  data() {
    return {
      loading: false,
      filterServiceList: [],
      platformList: [],
      current: 1,
      searchData: {
        platformCode: '', // 线上服务名
        platformId: '' // 平台
      },
      headers: [
        {
          label: '平台',
          prop: 'platformName',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'onlineServiceName'
        },
        {
          label: '线上渠道代码',
          prop: 'onlineServiceCode',
          minWidth: '180px',
          align: 'center'
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
    this.initialization()
  },
  methods: {
    getData() {
      Promise.all([
        getOnlineServiceAllList(),
        getplatformAllList()
      ]).then(res => {
        this.filterServiceList = res[0].data //  线上服务名列表
        this.platformList = res[1].data // 平台列表
      })
    },
    getLabel(item) {
      return `${item.onlineServiceNameEn} (${item.onlineServiceNameCn})`
    },

    initialization(originalRefresh = true) {
      const current = originalRefresh ? 1 : this.current
      this.$refs.table.load(current, this.searchData)
    },

    fetch({ current, size }, params) {
      return getOnlineServiceList(current, size, params).then(res => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
      this.initialization()
    },
    upBtn() {
      this.$modal({
        title: '线上服务导入',
        component: priceDownorUp,
        width: '500px',
        data: {
          title: '线上服务导入',
          selectTitle: '筛选线上渠道'
        },
        callback: (bool) => {
          if (bool) {
            getOnlineServiceAllList().then(res => {
              this.filterServiceList = res.data
            })
            this.initialization(false)
          }
        }
      })
    },
    downBtn() {
      this.$confirm('确认导出线上发货配置数据?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.loading = true
        onlineChannelServiceExport().finally(() => {
          this.loading = false
        }).then(res => {
          dowloadExc(res, '线上发货配置数据.xlsx')
          this.$message.success('导出成功')
        })
      })
    },
    serviceBanding(row) {
      this.$router.push({
        name: 'TmsOptimizeOlbinding',
        params: {
          platformId: row.platformId,
          ocsId: row.id
        }
      })
    },
    addEditBtn(row) {
      const title = !row ? '新增线上发货配置' : '编辑线上发货配置'
      this.$modal({
        title,
        component: onlineServiceAddEdit,
        width: '700px',
        data: {
          isAdd: !row,
          id: row?.id || '',
          platformList: this.platformList
        },
        callback: (bool) => {
          if (bool) {
            const isAdd = !row
            isAdd ? this.reset() : this.initialization(false)
            getOnlineServiceAllList().then(res => {
              this.filterServiceList = res.data
            })
          }
        }
      })
    },
    detailBtn(row) {
      this.$newTab({
        path: '/serviceConfiguration/info/detail',
        title: '线上发货配置详情',
        component: configurationDetail,
        clearCache: true,
        data: {
          id: row.id
        },
        callback: (bool) => {
        }
      })
    },
    deleteBtn(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlineChannelServiceRemove(row.id).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initialization(false)
          getOnlineServiceAllList().then(res => {
            this.filterServiceList = res.data
          })
        })
      }).catch(() => {})
    }
  }

}
</script>
<style lang="scss" scoped>

</style>
