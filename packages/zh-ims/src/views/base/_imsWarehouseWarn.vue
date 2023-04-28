<template>
  <!-- 基础管理/库存预警-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="80px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="warehouseType" label="仓库类型">
                <el-select v-model="submit.warehouseType" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in formData.warehouseTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="warehouseBelong" label="仓库归属">
                <g-select v-model="submit.warehouseBelong" style="width:80%;" :items="formData.warehouseBelongList" key-field="dictKey" label-field="dictValue" value-field="dictKey" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="warehouseId" label="仓库名称">
                <g-select v-model="submit.warehouseId" style="width:80%;" :items="formData.warehouseNameList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="productAuthId" label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getproductOwner">
                  <el-option v-for="item in formData.orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="productSku" label="产品编码" min-width="110" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.productSku }}</g-link>
          <span v-else>{{ row.productSku }}</span>
        </template>
      </el-table-column>

      <!-- 产品图片 -->
      <el-table-column slot="productImage" label="产品图片" width="75" align="center">
        <template v-slot="{row}">
          <g-thumb class="d-table-cell" :url="row.productImage" />
        </template>
      </el-table-column>

      <!-- 产品归属 -->
      <el-table-column slot="warehouseBelong" label="仓库归属" width="95" align="center">
        <template v-slot="{row}">
          <span>{{ warehouseBelongObj[row.warehouseBelong] }}</span>
        </template>
      </el-table-column>

      <!-- 产品名称 -->
      <el-table-column slot="productName" label="产品名称" width="110" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="2">
            {{ row.productName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="90" align="center">
        <template v-slot="{row}">
          <span v-if="row.status == 0">草稿</span>
          <span v-if="row.status == 1">启用</span>
          <span v-if="row.status == 2">停用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template v-slot="{row}">
          <el-button v-if="row.status == 0" type="text" @click="enableBtn(row)">启用</el-button>
          <el-button v-if="row.status == 0" type="text" @click="addBtn(row)">编辑</el-button>
          <el-button v-if="row.status == 0" type="text" @click="removeBtn(row)">删除</el-button>
          <el-button v-if="row.status == 1" type="text" @click="addBtn(row)">调整</el-button>
          <el-button v-if="row.status == 1" type="text" @click="disableBtn(row)">停用</el-button>
          <el-button v-if="row.status != 0" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getList, remove, getOrg, start, stop } from '@/api/base/imsWarehouseWarn.js'
import { getDictBiz, getAllEnableWarehouse } from '@/api/public/public.js'
import warehouseWarnAdd from './components/warehouseWarnAdd'
import warehouseWarnDetail from './components/warehouseWarnDetail'
export default {
  name: 'ImsBaseImsWarehouseWarn',
  data() {
    return {
      formData: {
        warehouseTypeList: [], // 仓库类型
        warehouseNameList: [], // 仓库名称
        warehouseBelongList: [], // 仓库归属
        orgList: []// 货权
      },
      cascaderKey: 0,
      productOwnerIdList: [],
      warehouseBelongObj: {},
      statusList: [],
      submit: {
        productSku: '',
        warehouseId: '',
        warehouseType: '',
        warehouseBelong: '',
        status: '',
        productAuthId: '',
        productOwnerId: ''
      },
      searchData: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'productSku'
        },
        {
          slot: true,
          slotName: 'productImage'
        },
        {
          slot: true,
          slotName: 'productName'
        },
        {
          label: '产品类目',
          prop: 'category',
          minWidth: '95px',
          align: 'center'
        },
        {
          label: '仓库类型',
          prop: 'warehouseType.desc',
          minWidth: '95px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'warehouseBelong'
        },
        {
          label: '仓库名称',
          prop: 'warehouseName',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '货权',
          prop: 'productAuthName',
          showOverflowTooltip: true,
          minWidth: '140px',
          align: 'center'
        },
        {
          label: '货主',
          prop: 'productOwnerName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '库存上限',
          prop: 'stockUpperLimit',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '库存下限',
          prop: 'stockLowerLimit',
          minWidth: '80px',
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
      ],
      options: [],
      addData: {
        productSku: '',
        productAuthId: '',
        productOwnerId: '',
        warehouseId: '',
        stockUpperLimit: '',
        productOwnerPathIds: [],
        stockLowerLimit: ''
      },
      isAdd: false
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 获取下拉数据
    getData() {
      // 状态
      getDictBiz('stock_farewarn_status').then(res => {
        this.statusList = res.data
      })
      // 仓库类型
      getDictBiz('warehouse_type').then(res => {
        this.formData.warehouseTypeList = res.data
      })
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.formData.warehouseNameList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        this.formData.warehouseBelongList = res.data
        this.formData.warehouseBelongList.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
      })
      // 获取货权
      getOrg().then(res => {
        this.formData.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
      this.submit.productOwnerId = ''
      this.options = []
      if (val) {
        const orgArr = this.formData.orgList.filter(ele => ele.tenantId === val)[0].orgTreeNodeList
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
      this.submit.productOwnerId = this.productOwnerIdList.length && this.submit.productAuthId ? this.productOwnerIdList[1] : ''
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.cascaderKey = ++this.cascaderKey
      this.options = []
      this.productOwnerIdList = []
      this.searchData = []
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
      } else {
        this.isAdd = true
      }
      this.$modal({
        title: (this.isAdd ? '新增库存预警' : '编辑库存预警'),
        component: warehouseWarnAdd,
        data: {
          isAdd: this.isAdd,
          addData: (this.isAdd ? this.addData : val),
          warehouseBelongObj: this.warehouseBelongObj,
          formData: this.formData
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
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 停用
    disableBtn(val) {
      this.confirm('停用', { id: val.id }, stop)
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '库存预警详情',
        component: warehouseWarnDetail,
        data: {
          id: val.id,
          warehouseBelongObj: this.warehouseBelongObj
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
    margin-left:20px!important;
  }
}

</style>
