<template>
  <!-- 结算管理/结算账号-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="account" label="账号名称">
                <el-input
                  v-model="submit.account"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button
                  class="btn"
                  size="mini"
                  type="primary"
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
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  class="btn"
                  @click="addBtn()"
                >新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="170" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis :lines="1">
            <g-link v-if="row.status == 1" @click="detailBtn(row)">{{ row.supplierName }}</g-link>
            <span v-else>{{ row.supplierName }}</span>
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 账号类型 -->
      <el-table-column
        slot="accountType"
        label="账号类型"
        align="center"
        min-width="90"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.accountType == 1">银行卡</span>
          <span v-if="scope.row.accountType == 2">支付宝</span>
          <span v-if="scope.row.accountType == 3">微信</span>
        </template>
      </el-table-column>

      <!-- 账户类型 -->
      <el-table-column
        slot="accountUserType"
        label="账户类型"
        align="center"
        min-width="70"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.accountUserType == 1">对公账户</span>
          <span v-if="scope.row.accountUserType == 2">对私账户</span>
        </template>
      </el-table-column>

      <!-- 账户开户行 -->
      <el-table-column slot="accountBankName" label="账户开户行" min-width="150" align="center">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">
            {{ scope.row.accountBankName }}{{ scope.row.accountBankBranch }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 币种 -->
      <el-table-column slot="accountCurrency" label="账号币种" min-width="70" align="center">
        <template slot-scope="scope">
          <span>{{ currencyObj[scope.row.accountCurrency] }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">草稿</span>
          <span v-if="scope.row.status == 1">启用</span>
        </template>
      </el-table-column>

      <!-- 默认账号 -->
      <el-table-column
        slot="isDefault"
        label="默认账号"
        align="center"
        min-width="90"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isDefault == 0">是</span>
          <span v-if="scope.row.isDefault == 1">否</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            size="mini"
            @click="enableBtn(scope.row)"
          >启用</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            size="mini"
            @click="addBtn(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            size="mini"
            @click="removeBtn(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            size="mini"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getCurrency, update, remove } from '@/api/settlementManagement/settlementAccountNo.js'
import { supplier } from '@/api/commonApi/common.js'
import accountNoAdd from './components/accountNoAdd.vue'
import accountNoDetails from './components/accountNoDetails.vue'
export default {
  name: 'SupplierSettlementManagementSettlementAccountNo',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierId: '',
        account: ''
      },
      supplierList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          slot: true,
          slotName: 'accountType'
        },
        {
          label: '账号名称',
          prop: 'account',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '账户账号',
          prop: 'accountNumber',
          minWidth: '160px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'accountBankName'
        },
        {
          slot: true,
          slotName: 'accountUserType'
        },
        {
          slot: true,
          slotName: 'accountCurrency'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'isDefault'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '100px',
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
        supplierId: '',
        accountType: '',
        account: '',
        accountNumber: '',
        accountBank: '',
        accountBankBranch: '',
        accountUserType: '1',
        accountCurrency: '',
        payCondition: '',
        isDefault: 1,
        payType: '',
        accountPicture: '',
        supplierFileList: []
      },
      openData: '',
      //   详情
      detailData: '',
      isDetail: false,
      currencyObj: {}
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
      getCurrency().then(res => {
        res.data.forEach(item => {
          this.currencyObj[item.dictKey] = item.dictValue
        })
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        const data = res.data
        const arr = JSON.parse(JSON.stringify(data.records))
        return {
          records: arr, // 列表数据
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
      this.submit.account = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(val))
      } else {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(this.addData))
      }
      this.$newTab({
        path: '/pss/settlementAccountNo/' + (this.isAdd ? 'add' : 'edit'),
        title: (this.isAdd ? '新增' : '编辑'),
        component: accountNoAdd,
        data: {
          isAdd: this.isAdd,
          close: this.close,
          addStatue: this.addStatue,
          openData: this.openData
        },
        clearCache: true,
        callback: (flag) => {
          if (flag) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 关闭
    close() {
      this.openData = ''
      this.isMain = true
      this.isOpen = false
      this.isDetail = false
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
      this.enable.status = 1
      this.confirm('启用', this.enable, update)
    },
    // 删除
    removeBtn(val1) {
      this.confirm('删除', val1.id, remove)
    },
    // 详情
    detailBtn(val) {
      this.detailData = val
      this.$newTab({
        path: '/pss/settlementAccountNo/Detail',
        title: '结算账号详情',
        component: accountNoDetails,
        data: {
          close: this.close,
          detailData: this.detailData
        },
        clearCache: true,
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
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.tableData {
    margin-top: 15px;
  padding: 0 10px;
  .addBox {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
  }
}
</style>
