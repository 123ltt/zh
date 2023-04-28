<template>
  <!-- 结算管理/结算账期-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="supplierName" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态" label-width="50px">
                <el-select
                  ref="input"
                  v-model="submit.status"
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
                  size="mini"
                  icon="el-icon-search"
                  @click="search()"
                >搜索</el-button>
                <el-button
                  class="btn"
                  size="mini"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
                <el-button
                  class="btn"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addBtn()"
                >新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="120" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" @click="detailBtn(row)">{{ row.supplierName }}</g-link>
          <span v-else>{{ row.supplierName }}</span>
        </template>
      </el-table-column>

      <!-- 结算账期 -->
      <el-table-column
        slot="chargeoffType"
        label="结算账期"
        align="center"
        min-width="110"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.chargeoffType == 1">月结</span>
          <span v-if="scope.row.chargeoffType == 2">半月结</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">草稿</span>
          <span v-if="scope.row.status == 1">启用</span>
          <span v-if="scope.row.status == 2">停用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="enableBtn(scope.row)"
          >启用</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="addBtn(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="removeBtn(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="addBtn(scope.row)"
          >调整</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="disableBtn(scope.row)"
          >停用</el-button>
          <el-button
            v-if="scope.row.status != 0"
            type="text"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, remove, stop, start } from '@/api/settlementManagement/settlementPeriod.js'
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'
import periodDetails from './components/periodDetails.vue'
import periodAdd from './components/periodAdd.vue'

export default {
  name: 'SupplierSettlementManagementSettlementPeriod',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierId: '',
        status: ''
      },
      supplierList: [],
      statusList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          slot: true,
          slotName: 'chargeoffType'
        },
        {
          label: '出账日',
          prop: 'chargeoffDays',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '付款周期',
          prop: 'paymentCircle',
          minWidth: '100px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '110px',
          align: 'center'
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
        paymentCircle: '',
        chargeoffDays: '',
        supplierId: '',
        chargeoffType: '',
        status: 0
      },
      openData: '',
      //   详情
      detailData: '',
      isDetail: false
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
        this.supplierList = res.data
      })
      getMyDictBiz('pss_chargeoff_period_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
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
      this.submit.supplierId = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      this.isOpen = true
      if (val) {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(val))
        this.openData.supplierId = this.openData.supplierId + ''
      } else {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(this.addData))
      }
      this.$modal({
        title: (this.isAdd ? '新增结算账期' : '编辑结算账期'),
        component: periodAdd,
        width: '400px',
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
    // 信息确认
    confirm(title, obj, fn) {
      this.$confirm(`确定要${title}该条记录吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn(obj).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },
    // 启用
    enableBtn(val) {
      this.confirm('启用', { id: val.id }, start)
    },
    // 删除
    removeBtn(val1, val2) {
      this.confirm('删除', val1.id, remove)
    },
    // 停用
    disableBtn(val) {
      this.confirm('停用', { id: val.id }, stop)
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '结算账期详情',
        component: periodDetails,
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
::v-deep .el-dialog--center .el-dialog__body{
    padding: 0;
}
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
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
