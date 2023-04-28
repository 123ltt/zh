<template>
  <!-- 基础管理/供应商分配-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="localPurchaserId" label="本地仓采购员">
                <g-select v-model="submit.localPurchaserId" style="width:100%;" :items="userList" key-field="id" label-field="account" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="overseaPurchaserId" label="海外仓采购员">
                <g-select v-model="submit.overseaPurchaserId" style="width:100%;" :items="userList" key-field="id" label-field="account" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="batchBtn()">批量修改</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="ruleCode" label="规则编码" width="110" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.ruleCode }}</g-link>
          <span v-else>{{ row.ruleCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" width="45" align="center">
        <template v-slot="{row}">
          <span v-if="row.status == 0">草稿</span>
          <span v-if="row.status == 1">启用</span>
          <span v-if="row.status == 2">停用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="enableBtn(scope.row)">启用</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="removeBtn(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="addBtn(scope.row)">调整</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="disableBtn(scope.row)">停用</el-button>
          <el-button v-if="scope.row.status != 0" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getList, remove, updateStatue } from '@/api/basicManagement/distribution.js'
import { dictionary, supplier, getUser } from '@/api/commonApi.js'
import distributionAdd from './components/distributionAdd'
import distributionBatch from './components/distributionBatch'
import distributionDetail from './components/distributionDetail'
import { deepClone } from '@/util/util'
export default {
  name: 'PurchaseBasicManagementCycle',
  data() {
    return {
      // 搜索参数
      submit: {
        supplierId: '',
        localPurchaserId: '',
        status: '',
        overseaPurchaserId: ''
      },
      supplierList: [],
      userList: [],
      searchData: [],
      statusList: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'ruleCode'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '本地采购',
          prop: 'localPurchaserName',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '海外采购',
          prop: 'overseaPurchaserName',
          width: '80px',
          align: 'center'
        },
        {
          label: '开发员',
          prop: 'developerName',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '产品对接员',
          prop: 'productDirectorName',
          width: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          width: '90px',
          align: 'center'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          width: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      //   提示弹框的状态
      enable: {},
      // 新增编辑
      isAdd: false,
      editData: {}
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 获取数据
    getData() {
      dictionary('ips_base_rule_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      supplier().then(res => {
        this.supplierList = res.data
      })
      getUser().then(res => {
        this.userList = res.data.records
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
      this.submit.localPurchaserId = ''
      this.submit.overseaPurchaserId = ''
      this.submit.status = ''
      this.searchData = []
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.editData = deepClone(val)
      } else {
        this.isAdd = true
      }
      this.$modal({
        title: (this.isAdd ? '新增供应商分配' : '编辑供应商分配'),
        component: distributionAdd,
        width: '30%',
        data: {
          isAdd: this.isAdd,
          editData: this.editData
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    batchBtn() {
      this.$modal({
        title: '批量修改',
        component: distributionBatch,
        // width: '40%',
        data: {},
        callback: (bool) => {
          if (bool) {
            this.reset()
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
    enableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      const obj = {
        id: this.enable.id,
        status: 1
      }
      this.confirm('启用', obj, updateStatue)
    },
    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 停用
    disableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      const obj = {
        id: this.enable.id,
        status: 2
      }
      this.confirm('停用', obj, updateStatue)
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '供应商分配详情',
        component: distributionDetail,
        // width: '30%',
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
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0px;
    }
    .btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
}
</style>
