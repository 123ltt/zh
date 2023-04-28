<template>
  <!-- 库存处理/库存代销-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini" class="no-message">
          <el-row>
            <el-col :span="9">
              <el-form-item prop="proxyCode" label="代销编码">
                <el-input v-model.trim="submit.proxyCode" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="warehouseId" label="代销仓库">
                <el-select v-model="submit.warehouseId" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in warehouseList" :key="item.id" :label="item.warehouseName" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="productAuthId" label="授权方(货权)">
                <el-select v-model="submit.productAuthId" clearable placeholder="请选择" filterable style="width:80%" @input="getproductOwner">
                  <el-option v-for="item in orgList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="授权方(货主)">
                <el-cascader :key="cascaderKey" v-model="productOwnerIdList" clearable placeholder="请先选择货权" filterable style="width:80%" :options="options" />
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
      <el-table-column slot="proxyCode" label="代销编码" min-width="110" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.stutas == 2" color="primary" @click="detailBtn(row)">{{ row.proxyCode }}</g-link>
          <span v-else>{{ row.proxyCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="110" align="center">
        <template v-slot="{row}">
          <span>{{ statusObj[row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="140">
        <template v-slot="{row}">
          <el-button v-if="row.status == 0" type="text" @click="commitBtn(row)">提交</el-button>
          <el-button v-if="row.status == 0" type="text" @click="addBtn(row)">编辑</el-button>
          <el-button v-if="row.status == 0" type="text" @click="removeBtn(row)">删除</el-button>
          <el-button v-if="row.status == 1" type="text" @click="verifyBtn(row)">审核</el-button>
          <el-button v-if="row.status == 2" type="text" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import { getList, getOrg, commit, verify, remove, getProxyWareHouseIds } from '@/api/handle/consignment.js'
import { getDictBiz } from '@/api/public/public.js'
import consignmentDetail from './components/consignmentModel/consignmentDetail.vue'
import { deepClone } from '@/util/util'
import consignmentAdd from './components/consignmentModel/consignmentAdd.vue'

export default {
  name: 'ImsHandleConsignment',
  data() {
    return {
      submit: {
        changeCode: '',
        productAuthId: '',
        productOwnerId: '',
        warehouseId: ''
      },
      cascaderKey: 0,
      isAdd: '',
      aditData: {},
      warehouseList: [],
      searchData: [],
      orgList: [], // 货权数组
      productOwnerList: [], // 货主数组
      productOwnerIdList: [],
      warehouseBelongObj: {},
      options: [],
      statusObj: { 0: '草稿', 1: '待审核', 2: '授权成功' },
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'proxyCode'
        },
        {
          label: '授权方(货权)',
          prop: 'productAuthName',
          showOverflowTooltip: true,
          minWidth: '170px',
          align: 'center'
        },
        {
          label: '授权方(货主)',
          prop: 'productOwnerName',
          showOverflowTooltip: true,
          minWidth: '170px',
          align: 'center'
        },
        {
          label: '授权仓库',
          prop: 'warehouse.warehouseName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '授权数量',
          prop: 'authQty',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '授权人',
          prop: 'proxySaleUserName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '授权时间',
          prop: 'updateTime',
          minWidth: '150px',
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
      ]
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
      // 获取货权
      getOrg().then(res => {
        this.orgList = res.data
      })
      // 仓库
      getProxyWareHouseIds().then(res => {
        this.warehouseList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        res.data.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
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
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.aditData = deepClone(val)
      } else {
        this.isAdd = true
      }
      this.$newTab({
        path: '/handle/consignment/add',
        title: this.isAdd ? '新增库存代销' : '编辑库存代销',
        component: consignmentAdd,
        data: {
          isAdd: this.isAdd,
          aditData: this.aditData || {}
        },
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/consignment/consignmentDetail',
        title: '库存代销详情',
        component: consignmentDetail,
        data: {
          detailData: val,
          warehouseBelongObj: this.warehouseBelongObj
        },
        clearCache: true,
        callback: () => {}
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
    // 提交
    commitBtn(val) {
      this.confirm('提交', val, commit)
    },
    // 审核
    verifyBtn(val) {
      this.confirm('审核', val, verify)
    },
    // 删除
    removeBtn(val) {
      this.confirm('审核', val.id, remove)
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
