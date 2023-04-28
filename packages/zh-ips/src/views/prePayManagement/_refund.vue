<template>
  <!-- 预付款退款 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item label="采购方主体">
                <el-select v-model="formData.productAuthId" clearable placeholder="请选择" filterable style="width:100%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="purSquareId" label="采购方名称">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:100%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="supplierInfoId" label="供应商名称">
                <g-select v-model="formData.supplierInfoId" style="width:100%;" :items="warehouseList" key-field="id" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="purCode" label="采购编码">
                <el-input v-model.trim="formData.purCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态">
                <el-select v-model="formData.status" style="width:100%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="outsideCode" label="第三方单号">
                <el-input v-model.trim="formData.outsideCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
                <el-button type="primary" @click="processData">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="returnCode" label="退款编码" min-width="130" align="center">
        <template v-slot="{row}">
          <g-link color="primary" @click="propsData(row.id)">{{ row.returnCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="slot">
          <el-button v-if="slot.row.status===2" type="text" @click="propsData(slot.row.id)">详情</el-button>
          <el-button v-if="slot.row.status!==2" type="text" @click="propsDelete(slot.row.id)">删除</el-button>
          <el-button v-if="slot.row.status!==2" type="text" @click="processData(slot.row,'edit')">编辑</el-button>
          <el-button v-if="slot.row.status!==2" type="text" @click="propsRequest(slot.row)">提交</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>
<script>
import refundDetail from './refundModal/refundDetail'
import refundProcess from './refundModal/refundProcess'
import { getList, remove, Request } from '@/api/advanceManagement/refund'
import { purchaser, dictionary, supplier, getOrg } from '@/api/commonApi'
export default {
  name: 'PurchasePrePayManagementRefund',
  data() {
    return {
      warehouseList: [],
      formData: {
        purSquareId: '',
        supplierInfoId: '',
        productAuthId: '',
        purCode: '',
        status: '',
        outsideCode: ''
      },
      orgList: [],
      productOwnerIdList: [],
      options: [],
      searchData: [],
      statusList: [],
      purchaseList: [],
      cascaderKey: 0,
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'returnCode'
        },
        {
          label: '采购编码',
          prop: 'purCode',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '第三方单号',
          prop: 'outsideCode',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '采购方名称',
          prop: 'purDemander.name',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '供应商名称',
          prop: 'supplierInfo.supplierName',
          showOverflowTooltip: true,
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '预付金额',
          prop: 'prepayTotalMoney',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '退款金额',
          prop: 'returnMoney',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '状态',
          prop: 'returnStatus',
          minWidth: '75px',
          align: 'center'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: '85px',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  mounted() {
    this.initialization()
    this.getSearch()
  },
  methods: {
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        res.data.records.map(item => {
          for (const key in item) {
            if (item[key] === -1) item[key] = ''
          }
          return item
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
    getSearch() {
      purchaser().then(res => {
        this.purchaseList = res.data
      })
      dictionary('ips_return_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      supplier().then(res => {
        this.warehouseList = res.data
      })
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.productOwnerIdList = []
      this.cascaderKey = ++this.cascaderKey
      this.options = []
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
    propsRequest(row) {
      this.$confirm('确认提交？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        Request(row.id, row.returnMoney).then((res) => {
          this.$message.success('提交成功')
          this.initialization()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    propsDelete(id) {
      this.$confirm('确认删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        remove(id).then((res) => {
          this.$message.success('删除成功')
          this.initialization()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    processData(row, type) {
      this.$modal({
        title: (type ? '编辑预付款退款' : '新增预付款退款'),
        component: refundProcess,
        data: {
          type: type,
          openData: JSON.parse(JSON.stringify(row))
        },
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    propsData(id) {
      this.$modal({
        title: '预付款信息详情',
        component: refundDetail,
        data: { id },
        callback: () => {}
      })
    },
    search() {
      this.formData.purSquareId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.formData))
      this.initialization()
    },
    reset() {
      Object.keys(this.formData).forEach(item => {
        this.formData[item] = ''
      })
      this.options = []
      this.cascaderKey = ++this.cascaderKey
      this.productOwnerIdList = []
      this.searchData = []
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>
.searchBox{
    ::v-deep .el-form-item{
      margin-bottom: 0;
    }
  }
.block{
    text-align:right;
    margin: 10px 10px 0 0;
}
</style>
