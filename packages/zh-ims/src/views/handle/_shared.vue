<template>
  <!-- 库存处理/库存共享-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <el-form slot="header" size="mini" label-width="100px" class="form-col no-message">
        <el-row>
          <el-col :span="3">
            <el-radio-group v-model="submit.sharingType" :disabled="changeLoading" size="mini" @change="changeType">
              <el-radio-button label="sharingType">主动共享</el-radio-button>
              <el-radio-button label="sharing">强制共享</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="sharingCode" label="共享编码">
              <el-input v-model="submit.sharingCode" clearable placeholder="请输入" filterable style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="productAuthId" label="共享方(货权)">
              <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @input="getproductOwner">
                <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="3">
            <el-form-item label="共享方(货主)">
              <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="warehouseId" label="共享仓库">
              <el-select v-model="submit.warehouseId" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item class="btnBox">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 主动共享 -->
      <!-- 状态 -->
      <el-table-column slot="sharingTenantsScope" label="共享租户范围" min-width="100" align="center">
        <template v-slot="{row}">
          <span>{{ sharingScopeObj[row.sharingTenantsScope] }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column slot="sharingProductsScope" label="共享产品范围" min-width="100" align="center">
        <template v-slot="{row}">
          <span>{{ sharingScopeObj[row.sharingProductsScope] }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
        <template v-slot="{row}">
          <!-- <span>{{ statusObj[row.status] }}</span> -->
          <span v-if="row.status === 0">草稿</span>
          <span v-if="row.status === 1">启用</span>
        </template>
      </el-table-column>

      <!-- 强制共享 -->

      <!-- 共享编码跳转详情 -->
      <el-table-column slot="sharingCode" label="共享编码" min-width="130" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.sharingCode }}</g-link>
          <span v-else>{{ row.sharingCode }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" min-width="150px" align="center">
        <template v-slot="{row}">
          <el-button v-if="row.status == 0" type="text" @click="enableBtn(row)">启用</el-button>
          <el-button v-if="row.status == 0" type="text" @click="addBtn(row)">编辑</el-button>
          <el-button v-if="row.status == 0" type="text" @click="removeBtn(row)">删除</el-button>
          <el-button v-if="row.status == 1" type="text" @click="addBtn(row)">调整</el-button>
          <!-- <el-button v-if="row.status == 1" type="text" @click="disableBtn(row)">停用</el-button> -->
          <el-button v-if="row.status != 0" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getOrg } from '@/api/public/public.js'
import { getList, enable, unable, remove, getWarehouseDropdown } from '@/api/handle/shared.js'
import { deepClone } from '@/util/util'
import sharedAdd from './components/sharedModel/sharedAdd.vue'
import sharedDateil from './components/sharedModel/sharedDateil.vue'

export default {
  name: 'ImsHandleShared',
  data() {
    return {
      submit: {
        sharingType: 'sharingType',
        sharingCode: '',
        productAuthId: '',
        productOwnerId: '',
        warehouseId: ''
      },
      cascaderKey: 0,
      changeLoading: false,
      headers: [],
      searchData: [],
      orgList: [],
      options: [], // 货主数组
      productOwnerIdList: [],
      warehouseList: [],
      sharingScopeObj: {
        ALL: '全部',
        PART: '部分'
      }
    }
  },
  mounted() {
    this.searchData = JSON.parse(JSON.stringify(this.submit))
    this.getData()
    this.initialization()
  },
  methods: {
    // 根据入库单状态来确定headers
    getHeaders() {
      if (this.submit.sharingType === 'sharingType') {
        return [
          { slot: true, slotName: 'sharingCode' },
          { label: '共享方(货权)', prop: 'productAuthName', minWidth: '150', align: 'center', showOverflowTooltip: true },
          { label: '共享方(货主)', prop: 'productOwnerName', minWidth: '110', align: 'center', showOverflowTooltip: true },
          { label: '共享仓库', prop: 'warehouse.warehouseName', minWidth: '100', align: 'center' },
          { slot: true, slotName: 'sharingTenantsScope' },
          { slot: true, slotName: 'sharingProductsScope' },
          { slot: true, slotName: 'status' },
          { label: '共享人', prop: 'sharingUserName', minWidth: '100', align: 'center' },
          { label: '共享时间', prop: 'sharingTime', minWidth: '130', align: 'center' },
          { slot: true, slotName: 'handler' }
        ]
      } else if (this.submit.sharingType === 'IN_WAREHOUSE_UP_SHELF') {
        return [
          { slot: true, slotName: 'businessType' },
          { slot: true, slotName: 'businessCode' },
          { label: '仓库类型', prop: 'warehouse.warehouseType.desc', minWidth: '100', align: 'center' },
          { slot: true, slotName: 'warehouseBelong' },
          { label: '仓库名称', prop: 'warehouse.warehouseId', minWidth: '100', align: 'center' },
          { slot: true, slotName: 'inputQty' },
          { slot: true, slotName: 'upShelfCode' },
          { label: '上架日期', prop: 'upShelfDate', minWidth: '130', align: 'center' },
          { label: '上架数量', prop: 'upShelfQty', minWidth: '100', align: 'center' },
          { slot: true, slotName: 'handler' }
        ]
      }
    },
    // 获取下拉数据
    getData() {
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
      getWarehouseDropdown().then(res => {
        this.warehouseList = res.data
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
      this.changeLoading = true
      this.headers = this.getHeaders()
      return getList(current, size, params).then(res => {
        this.changeLoading = false
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
      if (this.submit.sharingType === 'sharingType') {
        this.searchData = deepClone(this.submit)
      } else if (this.submit.sharingType === 'IN_WAREHOUSE_UP_SHELF') {
        const { inputCode, ...obj } = this.submit
        this.searchData = JSON.parse(JSON.stringify(obj))
      }
      this.initialization()
    },
    // 切换状态
    changeType(val) {
      // this.reset()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        if (item !== 'sharingType') {
          this.submit[item] = ''
        }
      })
      this.cascaderKey = ++this.cascaderKey
      this.options = []
      this.productOwnerIdList = []
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.aditData = deepClone(val)
      } else {
        this.isAdd = true
      }
      this.$newTab({
        path: '/handle/shared/add',
        title: this.isAdd ? '新增库存共享' : '编辑库存共享',
        component: sharedAdd,
        data: {
          isAdd: this.isAdd,
          aditData: this.aditData
        },
        clearCache: true,
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
      this.confirm('启用', val.id, enable)
    },
    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 停用
    disableBtn(val) {
      this.confirm('停用', val.id, unable)
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/handle/shared/dateil',
        title: '库存共享详情',
        component: sharedDateil,
        data: {
          sharedDateil: val
        },
        clearCache: true,
        callback: () => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btnBox{
  ::v-deep .el-form-item__content{
    margin-left: 0!important;
  }
}

</style>
