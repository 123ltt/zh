<template>
  <!-- 访厂管理/访厂申请-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="createUser" label="申请人">
                <g-select v-model="submit.createUser" :items="userList" key-field="id" label-field="name" value-field="id" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="mainProduct" label="主营产品">
                <el-input v-model="submit.mainProduct" clearable placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="cooperationProduct" label="合作产品">
                <el-input v-model="submit.cooperationProduct" clearable placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item class="btnBox">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                <el-button size="mini" icon="el-icon-delete" @click="reset()">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="ApplyExcel()">上传导入</el-button>
                <el-button type="primary" size="mini">
                  <download-excel class="export-excel-wrapper"
                                  :fetch="fetchData"
                                  :fields="json_fields"
                                  :before-generate="startDownload"
                                  :before-finish="finishDownload"
                                  name="访厂申请.xls"
                  >
                    <span>资料导出</span>
                  </download-excel>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="visitFactoryCode" label="访厂编号" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 3" @click="detailBtn(row)">{{ row.visitFactoryCode }}</g-link>
          <span v-else>{{ row.visitFactoryCode }}</span>
        </template>
      </el-table-column>

      <!-- 供应商名称 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="200" align="center">
        <template v-slot="{row}">
          <g-text-ellipsis lines="1">{{ row.supplierName }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{ oldstatusList[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="enableBtn(scope.row)">提交</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="removeBtn(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="auditBtn(scope.row)">审核</el-button>
          <el-button v-if="scope.row.status == 2" type="text" @click="auditBtn(scope.row)">访厂</el-button>
          <el-button v-if="scope.row.status == 3" type="text" @click="detailBtn(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status == 4" type="text" @click="addBtn(scope.row)">调整</el-button>
          <el-button v-if="scope.row.status == 4||scope.row.status == 5" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, submit, remove, getlistAddress, getUserList } from '@/api/factoryVisitManagement/apply'
import { getMyDictBiz, supplier } from '@/api/commonApi/common.js'
import applyAdd from './components/applyAdd.vue'
import applyAudit from './components/applyAudit.vue'
import upData from './components/upData.vue'
import JsonExcel from 'vue-json-excel'

import { deepClone } from '@/util/util'
export default {
  name: 'SupplierFactoryVisitManagementApply',
  components: {
    downloadExcel: JsonExcel
  },
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierId: '',
        mainProduct: '',
        createUser: '',
        cooperationProduct: '',
        status: ''
      },
      supplierList: [],
      userList: [],
      searchData: {},
      statusList: [],
      visitFactoryTypeList: [],
      oldstatusList: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'visitFactoryCode'
        },
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '主营产品',
          prop: 'mainProduct',
          showOverflowTooltip: true,
          minWidth: '170px',
          align: 'center'
        },
        {
          label: '合作产品',
          prop: 'cooperationProduct',
          minWidth: '90px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '申请人',
          prop: 'createUserName',
          minWidth: '100px',
          align: 'center'
        },
        {
          label: '提交时间',
          prop: 'submitTime',
          minWidth: '160px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '110px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      //   新增，修改
      isAdd: false,
      oldData: {
        supplierId: '',
        visitTime: '',
        score: '',
        grade: '',
        files: [],
        users: []
      },
      supplierTypeList: [],
      productPropertyList: [],
      mainCategoryList: [],
      applyReasonList: [],
      addData: '',
      //   详情
      detailData: '',
      listAddress: [],
      isDetail: false,
      json_fields: {
        访厂编号: 'visitFactoryCode',
        省: {
          field: 'supplierProvince',
          callback: (value) => {
            const province = this.listAddress.find(item => item.id === value.toString())
            if (province != null) {
              return province.name
            } else {
              return '未知'
            }
          }
        },
        市: {
          callback: (value) => {
            const province = this.listAddress.find(item => item.id === value.supplierProvince.toString())
            if (province != null) {
              const city = province.citys.find(item => item.id === value.supplierCity.toString())
              if (province != null) {
                return city.name
              }
            } else {
              return '未知'
            }
          }
        },
        详细地址: 'supplierAddress',
        供应商名称: 'supplierName',
        成立时间: 'registerTime',
        是否能开票: { field: 'ifInvoice', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        联系人: 'relationPeople',
        联系方式: 'relationPhone',
        供货类型: {
          field: 'supplyType',
          callback: (value) => {
            var dict = this.supplierTypeList.find(item => item.dictKey === value.toString())
            if (dict != null) {
              return dict.dictValue
            } else {
              return '未知'
            }
          }
        },
        产品属性: {
          field: 'productProperty',
          callback: (value) => {
            var dict = this.productPropertyList.find(item => item.dictKey === value.toString())
            if (dict != null) {
              return dict.dictValue
            } else {
              return '未知'
            }
          }
        },
        主营产品品类: {
          field: 'mainCategory',
          callback: (value) => {
            var dict = this.mainCategoryList.find(item => item.dictKey === value.toString())
            if (dict != null) {
              return dict.dictValue
            } else {
              return '未知'
            }
          }
        },
        主营产品: 'mainProduct',
        合作产品: 'cooperationProduct',
        '产品价格（均价RMB）': 'productPrice',
        申请访厂原因: {
          field: 'applyVisitReason',
          callback: (value) => {
            var dict = this.applyReasonList.find(item => item.dictKey === value.toString())
            if (dict != null) {
              return dict.dictValue
            } else {
              return '未知'
            }
          }
        },
        期望访厂时间: 'expectedVisitTime',
        访厂类型: {
          field: 'visitFactoryType',
          callback: (value) => {
            var dict = this.visitFactoryTypeList.find(item => item.dictKey === value.toString())
            if (dict != null) {
              return dict.dictValue
            } else {
              return '未知'
            }
          }
        },
        访厂时间: 'visitFactoryTime',
        申请人: 'createUserName',
        提交时间: 'submitTime',
        状态: {
          field: 'status',
          callback: (value) => {
            var dict = this.statusList.find(item => item.dictKey === value.toString())
            if (dict != null) {
              return dict.dictValue
            } else {
              return '未知'
            }
          }
        }
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.searchData = deepClone(this.submit)
    this.initialization()
  },
  methods: {
    //   获取数据
    getData() {
      supplier().then(res => {
        this.supplierList = res.data
      })
      getUserList().then(res => {
        this.userList = res.data.records
      })
      getMyDictBiz('pss_visit_apply_status').then(res => {
        this.statusList = res.data
        res.data.forEach(item => {
          this.oldstatusList[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getMyDictBiz('pss_visit_apply_status').then(res => {
        this.visitFactoryTypeList = res.data
        this.visitFactoryTypeList.unshift({ dictKey: '', dictValue: '全部' })
      })
      getMyDictBiz('pss_manage_model').then(res => {
        this.supplierTypeList = res.data
      })
      getMyDictBiz('pss_product_property').then(res => {
        this.productPropertyList = res.data
      })
      getMyDictBiz('pss_main_category').then(res => {
        this.mainCategoryList = res.data
      })
      getMyDictBiz('pss_visit_apply_reason').then(res => {
        this.applyReasonList = res.data
      })
      // 地址
      getlistAddress().then(res => {
        this.listAddress = res.data[0].provinces
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
    async fetchData() {
      return getList(0, 20000, this.searchData).then(res => res.data.records)
    },
    startDownload() {
      this.$message('开始下载')
    },
    finishDownload() {
      this.$message('开始下载完成')
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.searchData = deepClone(this.submit)
      this.initialization()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.searchData = deepClone(this.submit)
      this.initialization()
    },
    // 新增
    addBtn(val) {
      let title = ''
      if (val) {
        this.isAdd = false
        if (val.status === 0) {
          title = '编辑访厂申请'
        } else if (val.status === 4) {
          title = '调整访厂申请'
        }
      } else {
        this.isAdd = true
        title = '新增访厂申请'
      }
      this.$newTab({
        path: '/pss/apply/' + (this.isAdd ? 'add' : 'edit'),
        title: title,
        component: applyAdd,
        data: {
          isAdd: this.isAdd,
          addData: val,
          listAddress: this.listAddress
        },
        clearCache: true,
        callback: (flg) => {
          if (flg) {
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
    enableBtn(val1) {
      this.enable = deepClone(val1)
      this.confirm('提交', { id: this.enable.id, status: 1 }, submit)
    },
    // 删除
    removeBtn(val1) {
      this.confirm('删除', val1.id, remove)
    },
    auditBtn(val) {
      let title = ''
      if (val.status === 1) {
        title = '访厂申请审核'
      } else if (val.status === 2) {
        title = '访厂'
      }
      this.$newTab({
        path: '/pss/apply/audit',
        title: title,
        component: applyAudit,
        data: {
          relatedData: val,
          listAddress: this.listAddress
        },
        clearCache: true,
        callback: (flg) => {
          if (flg) {
            this.initialization()
          }
        }
      })
    },
    // 详情
    detailBtn(val) {
      let titles = ''
      if (val.status === 4) {
        titles = '访厂申请审核详情'
      } else if (val.status === 3) {
        titles = '访厂详情'
      } else if (val.status === 5) {
        titles = '访厂申请驳回详情'
      }
      this.$newTab({
        path: '/pss/apply/detail',
        title: titles,
        component: applyAudit,
        data: {
          relatedData: val,
          listAddress: this.listAddress
        },
        clearCache: true,
        callback: () => {}
      })
    },
    // 导入
    ApplyExcel() {
      this.$modal({
        title: '上传访厂申请',
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
::v-deep .el-dialog--center .el-dialog__body{
    padding: 0;
}
.btnBox{
    ::v-deep .el-form-item__content{
        margin-left: 40px!important;
    }
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
}
// ::v-deep .export-excel-wrapper{
//   float: left;
// }
</style>
