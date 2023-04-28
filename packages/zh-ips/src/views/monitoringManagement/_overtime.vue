<template>
  <!-- 超时未到货-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <!-- 头部搜索 -->
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item label="采购方主体">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="purSquareId" label="采购方名称">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="supplierId" label="供货方名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplier" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="submit.purCode" clearable placeholder="请填写" style="width:100%" />
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

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getPurSquareName, getSupplierName } from '@/api/monitoringManagement/overtime.js'
import { getOrg } from '@/api/commonApi.js'

export default {
  name: 'PurchaseMonitoringManagementOvertime',
  data() {
    return {
      // 搜索参数
      submit: {
        purCode: '',
        purSquareId: '',
        productAuthId: '',
        supplierId: ''
      },
      searchData: [],
      orgList: [],
      productOwnerIdList: [],
      options: [],
      supplier: [],
      purSquare: [],
      cascaderKey: 0,
      // 表格数据
      headers: [
        {
          label: '采购编码',
          prop: 'purCode',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'purSquareName',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '采购人',
          prop: 'purPeople',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '采购数量',
          prop: 'purQty',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '采购时间',
          prop: 'purTime',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '预计到货时间',
          prop: 'expectArrivalTime',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '超时时长',
          prop: 'overTime',
          minWidth: '150px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    // 获取数据
    getData() {
      getPurSquareName().then(res => {
        this.purSquare = res.data
      })
      getSupplierName().then(res => {
        this.supplier = res.data
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.productOwnerIdList = []
      this.options = []
      this.cascaderKey = ++this.cascaderKey
      if (val) {
        const orgArr = this.orgList.filter(ele => ele.tenantId === val)[0].orgTreeNodeList
        orgArr.forEach(item => {
          if (item.hasChildren) {
            item.children.forEach(ele => {
              if (!ele.hasChildren) {
                this.options.push({
                  value: ele.id,
                  label: ele.title,
                  disabled: true
                })
              } else {
                const chidrenArr = []
                ele.children.forEach(e => {
                  chidrenArr.push({
                    value: e.id,
                    label: e.title
                  })
                })
                this.options.push({
                  value: ele.id,
                  label: ele.title,
                  children: chidrenArr
                })
              }
            })
          }
        })
      }
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
      this.submit.purSquarId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.options = []
      this.productOwnerIdList = []
      this.submit.productAuthId = ''
      this.submit.purCode = ''
      this.submit.supplierId = ''
      this.submit.purSquarId = ''
      this.searchData = []
      this.cascaderKey = ++this.cascaderKey
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
</style>
