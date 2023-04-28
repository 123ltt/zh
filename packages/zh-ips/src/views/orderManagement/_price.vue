<template>
  <!-- 采购管理/供应商价目表 -->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" @selection-change="selectionChange">
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="supplierId" label="原供应商">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productSku" label="产品编码">
                <el-input v-model.trim="submit.productSku" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="applicant" label="申请人">
                <g-select v-model="submit.applicant" style="width:100%;" :items="userList" key-field="id" label-field="name" value-field="id" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable style="width:100%">
                  <el-option v-for="item in statusList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item class="btnBox">
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button icon="el-icon-delete" @click="reset">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
                <el-button type="primary" @click="ApplyExcel">批量导入</el-button>
                <el-button type="primary" @click="adjustBtn()">批量调价</el-button>
                <el-button type="primary" @click="auditBtn()">批量审核</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="productSku" label="产品编码" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status==3" color="primary" @click="detailBtn(row)">{{ row.productSku }}</g-link>
          <span v-else>{{ row.productSku }}</span>
        </template>
      </el-table-column>

      <!-- 图片 -->
      <el-table-column slot="productImg" label="产品图片" align="center" width="75">
        <template slot-scope="scope">
          <g-thumb class="d-table-cell" :url="scope.row.productImg" />
        </template>
      </el-table-column>

      <!-- 涨降幅度 -->
      <el-table-column slot="priceChange" label="涨降幅度" align="center" width="110">
        <template slot-scope="scope">
          <p v-if="scope.row.status == 0||scope.row.status == 1" />
          <p v-else>
            <span v-if="scope.row.priceChange>0">
              <i class="el-icon-top" style="color:red" /> +{{ scope.row.priceChange }} %
            </span>
            <span v-if="scope.row.priceChange<0">
              <i class="el-icon-bottom" style="color:green" /> {{ scope.row.priceChange }} %
            </span>
            <span v-if="scope.row.priceChange==0"> {{ scope.row.priceChange }}
            </span>
          </p>
        </template>
      </el-table-column>

      <!-- 开发采购 -->
      <el-table-column slot="people" label="开发采购" align="center" width="70">
        <template slot="header">
          <p style="margin:0;line-height: 14px;">开发</p>
          <p style="margin:0;line-height: 14px;">本地采购</p>
          <p style="margin:0;line-height: 14px;">海外采购</p>
        </template>
        <template slot-scope="scope">
          <p style="margin:0;line-height: 14px;">{{ scope.row.developerName }}</p>
          <p style="margin:0;line-height: 14px;">{{ scope.row.localPurchaserName }}</p>
          <p style="margin:0;line-height: 14px;">{{ scope.row.overseaPurchaserName }}</p>
        </template>
      </el-table-column>

      <!-- 勾选 -->
      <el-table-column slot="check" type="selection" width="40" />

      <!-- 产品类目 -->
      <el-table-column slot="category" label="产品类目" align="center" min-width="90">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.category }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 产品名称 -->
      <el-table-column slot="productName" label="产品名称" align="center" min-width="120">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.productName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 原供应商 -->
      <el-table-column slot="originalSupplierName" label="原供应商" align="center" min-width="120">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.originalSupplierName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 调后供应商 -->
      <el-table-column slot="adjustSupplierName" label="调后供应商" align="center" min-width="120">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.adjustSupplierName }} </g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 调后采购价 -->
      <el-table-column slot="adjustPurchasePrice" label="调后采购价" align="center" min-width="85">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0||scope.row.status == 1" />
          <span v-else>{{ scope.row.adjustPurchasePrice }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" align="center" min-width="70">
        <template slot-scope="scope">
          <span>{{ statusObj[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" align="center" min-width="150" fixed="right">
        <template v-slot="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="enableBtn(scope.row)">提交</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="removeBtn(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status != 0 && scope.row.status != 2" type="text" @click="adjustBtn(scope.row)">调价</el-button>
          <el-button v-if="scope.row.status == 2" type="text" @click="auditBtn(scope.row)">审核</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="detailBtn(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status !=0 &&scope.row.status != 1 " type="text" @click="adjustHisBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>
<script>
import priceAdd from './components/priceAdd'
import priceDetail from './components/priceDetail'
import priceAdjust from './components/priceAdjust'
import priceAudit from './components/priceAudit'
import upData from './components/upData'
import priceAdjustHis from './components/priceAdjustHisDetail'
import { getList, remove, submit } from '@/api/ordermanagement/price'
import { dictionary, supplier, getUserList } from '@/api/commonApi'
import { deepClone } from '@/util/util'

export default {
  name: 'PurchaseOrderManagementPrice',
  data() {
    return {
      loading: false,
      submit: {
        status: '',
        originalSupplierId: '',
        productName: '',
        productSku: '',
        applicant: ''
      },
      searchData: [],
      statusList: [],
      statusObj: {},
      userList: [],
      supplierList: [],
      headers: [
        {
          slot: true,
          slotName: 'check'
        },
        {
          slot: true,
          slotName: 'productSku'
        },
        {
          slot: true,
          slotName: 'productImg'
        },
        {
          slot: true,
          slotName: 'category'
        },
        {
          slot: true,
          slotName: 'productName'
        },
        {
          slot: true,
          slotName: 'originalSupplierName'
        },
        {
          label: '原采购价',
          prop: 'originalPurchasePrice',
          minWidth: '70px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'adjustPurchasePrice'
        },
        {
          slot: true,
          slotName: 'adjustSupplierName'
        },
        {
          slot: true,
          slotName: 'priceChange'
        },
        {
          slot: true,
          slotName: 'people'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '申请人',
          prop: 'applicantName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '申请时间',
          prop: 'applicantTime',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      adjustArr: [],
      changeArr: [],
      auditArr: []
    }
  },
  mounted() {
    this.initialization()
    this.getData()
  },
  methods: {
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    getData() {
      dictionary('ips_list_status').then(res => {
        this.statusList = res.data
        res.data.forEach(item => {
          this.statusObj[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      supplier().then(res => {
        this.supplierList = res.data
      })
      getUserList().then(res => {
        this.userList = res.data.records
      })
    },
    // 新增
    addBtn(val) {
      this.$newTab({
        path: val ? '/ips/price/edit' : '/ips/price/add',
        title: (val ? '编辑采购价目表' : '新增采购价目表'),
        component: priceAdd,
        data: {
          editData: val
        },
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            val ? this.initialization() : this.reset()
          }
        }
      })
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.searchData = []
      this.initialization()
    },
    detailBtn(val) {
      this.$modal({
        title: '产品价目详情',
        component: priceDetail,
        data: {
          detailData: val
        },
        callback: () => {}
      })
    },
    adjustHisBtn(val) {
      this.$newTab({
        path: '/ips/price/priceAdjustHis',
        title: '调价历史',
        component: priceAdjustHis,
        clearCache: true,
        data: {
          detailData: val
        },
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
    enableBtn(val) {
      this.enable = JSON.parse(JSON.stringify(val))
      this.confirm('提交', this.enable, submit)
    },
    // 删除
    removeBtn(val) {
      this.enable = JSON.parse(JSON.stringify(val))
      this.confirm('删除', this.enable.id, remove)
    },
    selectionChange(val) {
      this.changeArr = deepClone(val)
    },
    adjustBtn(val) {
      this.adjustArr = []
      let isOk = true
      if (val) {
        this.adjustArr.push(val.id)
      } else {
        if (this.changeArr.length) {
          this.changeArr.forEach(item => {
            if (item.status === 0 || item.status === 2) {
              isOk = false
            }
          })
        } else {
          isOk = false
        }
      }
      if (isOk) {
        if (!val) {
          var changeIds = this.changeArr.map(item => { return item.id })
          this.adjustArr = deepClone(changeIds)
        }
        this.$newTab({
          path: '/ips/product/adjust',
          title: '调整采购价目表',
          component: priceAdjust,
          data: {
            adjustArr: this.adjustArr
          },
          clearCache: true,
          callback: (bool) => {
            this.changeArr = []
            if (bool) {
              this.reset()
            }
          }
        })
      } else {
        this.$message.error('请先选择能调价的项！')
      }
    },
    // 审核
    auditBtn(val) {
      this.auditArr = []
      let isOk = true
      if (val) {
        this.auditArr.push(val.id)
      } else {
        if (this.changeArr.length) {
          this.changeArr.forEach(item => {
            if (item.status !== 2) {
              isOk = false
            }
          })
        } else {
          isOk = false
        }
      }
      if (isOk) {
        if (!val) {
          var changeIds = this.changeArr.map(item => { return item.id })
          this.auditArr = deepClone(changeIds)
        }
        this.$newTab({
          path: '/ips/product/audit',
          title: '审核采购价目表',
          component: priceAudit,
          data: {
            auditArr: this.auditArr
          },
          clearCache: true,
          callback: (bool) => {
            this.changeArr = []
            if (bool) {
              this.reset()
            }
          }
        })
      } else {
        this.$message.error('请先选择能审核的项！')
      }
    },
    // 导入
    ApplyExcel() {
      this.$modal({
        title: '导入采购价目表',
        component: upData,
        data: { type: 'apply' },
        width: '400px',
        top: '50px',
        callback: (bool) => {
          if (bool) {
            this.reset()
          }
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.searchBox {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
</style>
