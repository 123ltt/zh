<template>
  <!-- 应付管理/应付请款管理-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="shouldCode" label="应付编码">
                <el-input v-model.trim="submit.shouldCode" clearable placeholder="请填写" style="width:70%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="requireCode" label="请款编码">
                <el-input v-model.trim="submit.requireCode" clearable placeholder="请填写" style="width:70%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="supplierInfoId" label="供应商名称">
                <g-select v-model="submit.supplierInfoId" style="width:70%;" :items="warehouseList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="createUser" label="请款人">
                <g-select v-model="submit.createUser" style="width:70%;" :items="userList" key-field="id" label-field="name" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="requireStatus" label="状态">
                <el-select v-model="submit.requireStatus" clearable placeholder="请选择" filterable style="width:70%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 供应商名称 -->
      <el-table-column slot="supplierName" label="供应商名称" align="center" min-width="130" show-overflow-tooltip>
        <template v-slot="scope">
          <span>{{ scope.row.supplierInfo.supplierName }}</span>
        </template>
      </el-table-column>

      <!-- 币种名称 -->
      <el-table-column slot="rqmtTotalQty" label="请款币种" align="center" min-width="70">
        <template v-slot="scope">
          <span>{{ scope.row.supplierInfo.rqmtTotalQty?scope.row.supplierInfo.rqmtTotalQty:'RMB' }}</span>
        </template>
      </el-table-column>

      <!-- 备注 -->
      <el-table-column slot="remark" label="备注" align="center" min-width="50">
        <template v-slot="scope">
          <el-tooltip :content="scope.row.remark?scope.row.remark:'无'" effect="dark" placement="top">
            <span class="hiddenWord">查看</span>
          </el-tooltip>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getLists, getSupplierInfo } from '@/api/payableManagement/payableManagement.js'
import { dictionary, getUserList } from '@/api/commonApi.js'
export default {
  name: 'PurchasePayableManagementRequestPayable',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        shouldCode: '',
        requireCode: '',
        supplierInfoId: '',
        createUser: '',
        requireStatus: ''
      },
      userList: [],
      demanderList: [],
      warehouseList: [],
      statusList: [],
      //   规则名称
      rulesName: [],
      //   规则类型
      rulesType: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          label: '请款编码',
          prop: 'requireCode',
          width: '140px',
          align: 'center'
        },
        {
          label: '应付编码',
          prop: 'shouldCode',
          width: '135px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '请款金额',
          prop: 'requireMoney',
          width: '80px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'rqmtTotalQty'
        },
        {
          label: '收款人',
          prop: 'destWarehouse',
          width: '70px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'remark'
        },
        {
          label: '状态',
          prop: 'requireStatus',
          width: '80px',
          align: 'center'
        },
        {
          label: '请款人',
          prop: 'createUserName',
          width: '100px',
          align: 'center'
        },
        {
          label: '请款时间',
          prop: 'updateTime',
          width: '130px',
          align: 'center'
        },
        {
          label: '结束时间',
          prop: 'updateTime',
          width: '130px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.searchData = JSON.parse(JSON.stringify(this.submit))
    this.initialization()
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      getSupplierInfo().then(res => {
        this.warehouseList = res.data
      })
      dictionary('ips_require_status').then(res => {
        const data = res.data
        this.statusList = data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getUserList().then(res => {
        this.userList = res.data.records
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      params.append('current', current)
      params.append('size', size)
      return getLists(params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      const formData = new FormData()
      for (var i in this.searchData) {
        if (this.searchData[i]) {
          formData.append(i, this.searchData[i])
        }
      }
      this.$refs.table.load(1, formData)
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.submit.requireCode = ''
      this.submit.supplierInfoId = ''
      this.submit.shouldCode = ''
      this.submit.createUser = ''
      this.submit.requireStatus = ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
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
        margin-bottom: 0;
    }
    .btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
}

.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    color: #66b1ff;
    cursor: pointer;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
</style>
