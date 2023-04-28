<template>
  <!-- 地址管理/退货地址-->
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
              <el-form-item prop="returnRecipient" label="收件人">
                <el-input
                  v-model="submit.returnRecipient"
                  clearable
                  placeholder="请输入"
                />
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
                >查询</el-button>
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

      <!-- 固定电话 -->
      <el-table-column
        slot="telCode"
        label="固定电话"
        align="center"
        min-width="130"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.telCode">{{ scope.row.telCode }} - {{ scope.row.telNumber }} </span>
        </template>
      </el-table-column>

      <!-- 退货地址 -->
      <el-table-column
        slot="description"
        label="退货地址"
        align="center"
        show-overflow-tooltip
        min-width="300"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.countryName }}{{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.returnAddress }}</span>
        </template>
      </el-table-column>

      <!-- 默认地址 -->
      <el-table-column
        prop="isDefault"
        label="默认地址"
        align="center"
        min-width="90"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isDefault == 0">是</span>
          <span v-if="scope.row.isDefault == 1">否</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="110">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="addBtn(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="removeBtn(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import returnAdd from './components/returnAdd.vue'
import { getList, getlistAddress, remove } from '@/api/addressManagement/returnAddress.js'
import { supplier } from '@/api/commonApi/common.js'
export default {
  name: 'SupplierAddressManagementReturnAddress',
  data() {
    return {
      // 搜索参数
      submit: {
        returnRecipient: '',
        supplierId: ''
      },
      //   供应商名称
      supplierList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          label: '供应商名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '收件人',
          prop: 'returnRecipient',
          minWidth: '70px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'telCode'
        },
        {
          label: '移动电话',
          prop: 'phoneNumber',
          minWidth: '120px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'description'
        },
        {
          slot: true,
          slotName: 'isDefault'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: '90px',
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
      //   提示弹框的状态
      isShow: false,
      title: '',
      enable: {},
      information: '',
      //   新增，修改
      isOpen: false,
      isAdd: false,
      addData: {
        supplierId: '',
        returnRecipient: '',
        returnCountry: '',
        returnProvince: '',
        returnCity: '',
        returnAddress: '',
        telCode: '',
        telNumber: '',
        phoneNumber: '',
        isDefault: 1
      },
      openData: '',
      //   详情
      detailData: '',
      isDetail: false,
      listAddress: []
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
        if (res.code === 200) {
          const data = res.data
          this.supplierList = data
        } else {
          this.$message.error('加载失败!')
        }
      })
      getlistAddress().then(res => {
        const data = res.data
        this.listAddress = data
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
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    //   重置
    reset() {
      this.submit.supplierId = ''
      this.submit.returnRecipient = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(val))
        this.openData.returnCountry = this.openData.returnCountry + ''
        this.openData.returnProvince = this.openData.returnProvince + ''
        this.openData.returnCity = this.openData.returnCity + ''
      } else {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(this.addData))
      }
      this.$modal({
        title: (this.isAdd ? '新增退货地址' : '编辑退货地址'),
        component: returnAdd,
        width: '500px',
        data: {
          isAdd: this.isAdd,
          supplierList: this.supplierList,
          listAddress: this.listAddress,
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
    // 删除
    removeBtn(val1) {
      this.confirm('删除', val1.id, remove)
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
