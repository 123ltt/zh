<template>
  <!-- 基础管理/产品状态-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="80px" size="mini" class="no-message">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warehouseId" label="仓库名称">
                <g-select v-model="submit.warehouseId" style="width:80%;" :items="warehouseNameList" key-field="id" label-field="warehouseName" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productStatus" label="产品状态">
                <el-select v-model="submit.productStatus" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productAuthId" label="货权">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @change="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货主">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
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
          <g-thumb class="d-table-cell" :url="row.skuInfo.imageUrl" />
        </template>
      </el-table-column>

      <!-- 产品名称 -->
      <el-table-column slot="productName" label="产品名称" width="110" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="2">
            {{ row.skuInfo.productName }}
          </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="productStatus" label="状态" min-width="90" align="center">
        <template v-slot="{row}">
          <span>{{ statusObj[row.productStatus] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template v-slot="{row}">
          <el-button v-if="row.status == 3" type="text" @click="upDateBtn(row)">调整</el-button>
          <el-button v-if="row.status == 4" type="text" @click="auitBtn(row)">待审核</el-button>
          <el-button type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </g-table>

  </basic-container>
</template>

<script>
import { getList, getOrg } from '@/api/base/productStatus.js'
import { getDictBiz, getAllEnableWarehouse } from '@/api/public/public.js'
import productStatusAdd from './components/productStatusAdd'
import productStatusDetail from './components/productStatusDetail'
export default {
  name: 'ImsBaseProductStatus',
  data() {
    return {
      warehouseTypeList: [], // 仓库类型
      warehouseNameList: [], // 仓库名称
      warehouseBelongList: [], // 仓库归属
      orgList: [], // 货权
      cascaderKey: 0,
      productOwnerIdList: [],
      warehouseBelongObj: {},
      statusList: [],
      statusObj: {},
      submit: {
        productStatus: '',
        productSku: '',
        warehouseId: '',
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
          prop: 'skuInfo.categoryName',
          minWidth: '95px',
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
          label: '仓库名称',
          prop: 'warehouse.warehouseName',
          minWidth: '110px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'productStatus'
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
          width: '85px',
          align: 'center'
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
      getDictBiz('product_status').then(res => {
        this.statusList = res.data
        this.statusList.forEach(item => {
          this.statusObj[item.dictKey] = item.dictValue
        })
      })
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.warehouseNameList = res.data
      })
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
    },
    getproductOwner(val) {
      this.cascaderKey = ++this.cascaderKey
      this.submit.productOwnerId = ''
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
    upDateBtn(val) {
      this.$modal({
        title: '调整产品状态',
        component: productStatusAdd,
        data: {
          isAuit: false,
          openData: val,
          statusList: this.statusList
        },
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    auitBtn(val) {
      this.$modal({
        title: '审核产品状态',
        component: productStatusAdd,
        data: {
          isAuit: true,
          openData: val,
          statusList: this.statusList
        },
        callback: (bool) => {
          if (bool) {
            this.initialization()
          }
        }
      })
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/base/productStatus/detail',
        title: '产品状态详情',
        component: productStatusDetail,
        data: {
          dateil: val,
          statusObj: this.statusObj
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
