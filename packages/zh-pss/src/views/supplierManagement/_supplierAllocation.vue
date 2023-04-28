<template>
  <!-- 供应商管理/供应商分配-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item prop="supplierCode" label="供应商编码">
                <el-input v-model="submit.supplierCode" style="width:80%;" clearable placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="supplierName" label="供应商名称">
                <g-select v-model="submit.supplierName" style="width:80%;" :items="supplierList" key-field="supplierName" label-field="supplierName" value-field="supplierName" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="assignUserId" label="供应商归属人">
                <g-select v-model="submit.assignUserId" :items="userList" style="width:80%" key-field="id" label-field="name" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="status" label="状态">
                <el-select
                  ref="input"
                  v-model="submit.status"
                  style="width:80%;"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button
                  class="btn"
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >查询</el-button>
                <el-button
                  class="btn"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierCode" label="供应商编码" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 1" @click="detailBtn(row)">{{ row.supplierCode }}</g-link>
          <span v-else>{{ row.supplierCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">待分配</span>
          <span v-if="scope.row.status == 1">已分配</span>
        </template>
      </el-table-column>

      <!-- 供应商归属人 -->
      <el-table-column
        slot="assignName"
        label="供应商归属人"
        align="center"
        min-width="110"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.assignName == ''">System</span>
          <span v-else>{{ scope.row.assignName }}</span>
        </template>
      </el-table-column>

      <!-- 操作人 -->
      <el-table-column
        slot="updateUserName"
        label="操作人"
        align="center"
        min-width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.updateUserName == -1">System</span>
          <span v-else>{{ scope.row.updateUserName }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="addBtn(scope.row,'add')"
          >分配</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="addBtn(scope.row,'edit')"
          >调整</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getUserlist } from '@/api/supplierManagement/supplierAllocation.js'
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'
import allocationDetail from './components/allocationDetail.vue'
import allocationAdd from './components/allocationAdd.vue'

export default {
  name: 'SupplierSupplierManagementSupplierAllocation',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierName: '',
        supplierCode: '',
        assignUserId: '',
        status: ''
      },
      supplierList: [],
      userList: [],
      searchData: {},
      statusList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'supplierCode'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          minWidth: '170px',
          align: 'center'
        },
        {
          label: '供应商主编码',
          prop: 'supplierMainCode',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '供应商识别码',
          prop: 'supplierIdentifyCode',
          minWidth: '110px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'assignName'
        },
        {
          slot: true,
          slotName: 'updateUserName'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          minWidth: '150px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      //   新增，修改
      isOpen: false,
      isAdd: false,
      addData: {
        assignUserId: '',
        supplierIdentifyCode: '',
        supplierMainCode: ''
      },
      openData: '',
      //   详情
      detailData: '',
      titleStr: '',
      isDetail: false,
      isAudit: [false, false]
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    //   获取数据
    getData() {
      supplier().then(res => {
        const data = res.data
        this.supplierList = data
      })
      getMyDictBiz('pss_supplier_assign_status').then(res => {
        const data = res.data
        this.statusList = data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getUserlist().then(res => {
        const data = res.data
        this.userList = data.records
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        res.data.records.forEach(item => {
          if (item.assignUserId === -1 || item.assignUserId == null) {
            item.assignUserId = ''
          }
        })
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.submit.supplierName = ''
      this.submit.supplierCode = ''
      this.submit.assignUserId = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val1, val2) {
      this.isOpen = true
      if (val2 === 'add') {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(val1))
      } else if (val2 === 'edit') {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(val1))
        this.openData.assignUserId = this.openData.assignUserId + ''
      }
      this.$modal({
        title: (this.isAdd ? '选择分配用户' : '调整分配用户'),
        component: allocationAdd,
        width: '300px',
        data: {
          isAdd: this.isAdd,
          openData: this.openData
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '分配用户详情',
        component: allocationDetail,
        data: {
          detailData: val
        },
        callback: () => {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btnBox{
    ::v-deep .el-form-item__content{
        margin-left: 20px!important;
    }
    .btn{
        width: 30%;
    }
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
}
</style>
