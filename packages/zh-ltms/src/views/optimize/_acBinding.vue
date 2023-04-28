<!--线上服务配置 列表页-->
<template>
  <basic-container v-loading="loading">
    <!-- g-table 封装好的自带分页功能的表格(g开头的标签全部都是封装好的公共组件) :fetch="fetch"方法名    :headers="headers" 表格数据-->
    <g-table ref="table" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form
          ref="form"
          :model="searchData"
          label-width="100px"
          size="mini"
          class="form-col no-message"
        >
          <!-- 顶部待搜索按钮删除按钮的那一行 -->
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="租户ID：" prop="tenantId">
                <g-select
                  v-model="searchData.tenantId"
                  :items="tenantIdList"
                  key-field="tenantId"
                  label-field="tenantId"
                  value-field="tenantId"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="平台：" prop="platformCode">
                <!-- 封装的下拉组件 -->
                <g-select
                  v-model="searchData.platformCode"
                  :items="platformList"
                  key-field="platformCode"
                  label-field="platformName"
                  value-field="platformCode"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="店铺编码：" prop="storeCode">
                <!-- 封装的下拉组件 -->
                <g-select
                  v-model="searchData.storeCode"
                  :items="storeCodeList"
                  key-field="code"
                  label-field="code"
                  value-field="code"
                  clearable
                  :item-title="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="searchData.status" @change="initialization">
                  <el-radio-button v-for="item in statusList" :key="item.dictKey" :label="item.dictKey">{{ item.dictValue }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="d-flex justify-content-end mb-2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="initialization">搜索</el-button>
              <el-button class="ms-3" icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column
        slot="status"
        label="状态"
        fixed="right"
        align="center"
        min-width="150px"
      >
        <template v-slot="scope">
          <div v-if="scope.row.status==1">绑定</div>
          <div v-else>待绑定</div>
        </template>
      </el-table-column>

      <el-table-column
        slot="handler"
        label="操作"
        fixed="right"
        align="center"
        min-width="150px"
      >
        <template v-slot="scope">
          <el-button v-if="scope.row.status==1" type="text" @click="accountBind(scope.row)">调整绑定</el-button>
          <el-button v-else type="text" @click="accountBind(scope.row)">绑定</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>
<script>
import { getlogisticsAccountList } from '@/api/acBinding'// 导入表格列表数据接口+账户绑定接口
import { getplatformAllList } from '@/api/platformLimits' // 导入平台列表数据接口
import { getAllTenantPlatformStore, dictionary } from '@/api/common'// 导入 租户店铺接口+字典
import Accountbinding from './acBindingModal/Accountbinding'// 导入 绑定组件

export default {
  name: 'AcBinding',
  data() {
    return {
      loading: false,
      tenantIdList: [], // 租户ID列表分页数据
      platformList: [], // 平台编码列表数据
      storeCodeList: [], // 店铺编码列表数据
      current: 1,
      // 给表格数据接口的参数
      searchData: {
        platformCode: '', // 平台编码
        tenantId: '', // 租户id
        storeCode: '', // 店铺编码
        status: '' // 状态 1:绑定 2:未绑定
      },
      statusList: [],
      // 表格头部数据
      headers: [
        {
          label: '租户ID',
          prop: 'tenantId',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '平台名称',
          prop: 'platformName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '店铺编码',
          prop: 'storeCode',
          minWidth: '180px',
          align: 'center'
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

  // 页面一加载钩子
  created() {
    this.getData()
  },

  // 页面加载完成钩子
  mounted() {
    // 页面加载完成之后 调用搜索方法拿到表格数据
    this.initialization()
  },
  methods: {
    // 自定义封装表格绑定的方法 ，只获取表格数据
    fetch({ current, size }, params) {
      return getlogisticsAccountList(current, size, params).then((res) => {
        this.current = res.data.current
        return {
          records: res.data.records,
          total: res.data.total,
          size: res.data.size
        }
      })
    },

    // 搜索
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },

    // 重置
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
      // 让页面跳转到第一页
      this.current = 1
      this.initialization()// 获取表格数据
      this.searchData.auditStatus = '全部'
    },
    getData() {
      Promise.all([
        getplatformAllList(), // 平台列表数据接口
        getAllTenantPlatformStore(), // 租户店铺
        dictionary('system_storebing_status')// 绑定状态
      ]).then(res => {
        this.platformList = res[0].data// 平台编码
        this.tenantIdList = res[1].data// 租户id数据
        res[1].data.forEach(item => {
          item.platformWithStoreVOList.forEach(item2 => {
            item2.stores.forEach(item3 => {
              this.storeCodeList.push(item3)// 店铺编码
            })
          })
        })
        res[2].data.unshift({ dictKey: '', dictValue: '全部' })
        this.statusList = res[2].data
        this.initialization()
      })
    },
    // 绑定-调整绑定
    accountBind(row) {
      this.$modal({
        title: '绑定',
        component: Accountbinding,
        width: '700px',
        data: {
          row
        },
        callback: (bool) => {
        //  判断是确定按钮关闭弹框，需要刷新页面
          if (bool) {
            // 重新获取表格数据用来刷新页面
            this.initialization(false)
          }
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
