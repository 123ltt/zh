<template>
  <!-- 访厂管理/供应商访厂记录-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="8">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="mainProduct" label="主营产品">
                <el-input v-model="submit.mainProduct" clearable placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="coopProduct" label="合作产品">
                <el-input v-model="submit.coopProduct" clearable placeholder="请填写" style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
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
                                  name="访厂记录.xls"
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
      <el-table-column slot="recordCode" label="访厂编号" min-width="80" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 2" @click="detailBtn(row)">{{ row.recordCode }}</g-link>
          <span v-else>{{ row.recordCode }}</span>
        </template>
      </el-table-column>

      <!-- 供应商名称 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="180" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-text-ellipsis lines="2">{{ row.supplierName }}</g-text-ellipsis>
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
          <el-button v-if="scope.row.status == 1" type="text" @click="approvalBtn(scope.row)">审核</el-button>
          <el-button v-if="scope.row.status == 2" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, submit, remove, approval, getlistAddress, getUserList, getEXeclList } from '@/api/factoryVisitManagement/record'
import { getMyDictBiz, supplier } from '@/api/commonApi/common.js'
import recordAdd from './components/recordAdd.vue'
import recordDetails from './components/recordDetails.vue'
import upData from './components/upData.vue'
import JsonExcel from 'vue-json-excel'
import { deepClone } from '@/util/util'

export default {
  name: 'SupplierFactoryVisitManagementRecord',
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
        coopProduct: '',
        status: ''
      },
      supplierList: [],
      userList: [],
      searchData: {},
      statusList: [],
      oldstatusList: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'recordCode'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          showOverflowTooltip: true,
          minWidth: '180px',
          align: 'center'
        },
        {
          label: '主营产品',
          prop: 'mainProduct',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '合作产品',
          prop: 'coopProduct',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '访厂日期',
          prop: 'visitTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '访厂评分',
          prop: 'score',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '等级',
          prop: 'grade',
          minWidth: '70px',
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
      addData: '',
      //   详情
      detailData: '',
      listAddress: [],
      isDetail: false,
      json_fields: {
        访厂编号: 'recordCode',
        供应商名称: 'supplierName',
        主营产品: 'mainProduct',
        合作产品: 'coopProduct',
        访厂日期: 'visitTime',
        访厂评分: 'score',
        稽核人员: {
          field: 'users',
          callback: (value) => {
            let name = ''
            if (value != null) {
              name = value.filter(c => c.type === 'auditor').map(c => c.userRealName).join(',')
            }
            return name
          }
        },
        陪同人员: {
          field: 'users',
          callback: (value) => {
            let name = ''
            if (value != null) {
              name = value.filter(c => c.type === 'entourage').map(c => c.userRealName).join(',')
            }
            return name
          }
        },
        厂房面积: 'factoryArea',
        员工数: 'employeeNum',
        是否自营跨境平台: { field: 'isCrossBorder', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        能否签订框架协议: { field: 'canSignAgreement', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        是否能开票: { field: 'canInvoice', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        '研发/设计师数量': 'designerNum',
        品牌名称: 'brandName',
        有效专利数: 'patentInForceNum',
        月上新能力: 'monthUpdateNum',
        实验设备是否包含核心设备: { field: 'includeCoreEquipment', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        是否有生产线: { field: 'haveProductLine', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        是否有半成品: { field: 'haveSemiFinishedProduct', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        能否签订品质协议: { field: 'canSignQalAgreement', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        能否签订质量标准书: { field: 'canSignQalStd', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        是否通过质量管理体系: { field: 'passQalManagementSys', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        是否有独立品质部: { field: 'independentQalDept', callback: (value) => { if (value === 1) return '是'; else return '否' } },
        质检员数: 'qalInspectorNum',
        质量部评价: 'qalDeptEvaluation',
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
      getMyDictBiz('pss_visit_fac_record_status').then(res => {
        this.statusList = res.data
        res.data.forEach(item => {
          this.oldstatusList[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
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
      return getEXeclList(0, 20000, this.searchData).then(res => res.data.records)
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
      if (val) {
        this.isAdd = false
      } else {
        this.isAdd = true
      }
      this.$newTab({
        path: '/pss/vivstRecord/' + (this.isAdd ? 'add' : 'edit'),
        title: (this.isAdd ? '新增供应商访厂记录' : '编辑供应商访厂记录'),
        component: recordAdd,
        data: {
          isAdd: this.isAdd,
          addData: val
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
    enableBtn(val) {
      this.enable = deepClone(val)
      this.confirm('提交', this.enable, submit)
    },
    // 删除
    removeBtn(val1) {
      this.confirm('删除', val1.id, remove)
    },
    approvalBtn(val) {
      const obj = deepClone(val)
      this.confirm('审核', obj.id, approval)
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/pss/vivstRecord/detail',
        title: '供应商访厂记录详情',
        component: recordDetails,
        data: {
          detailData: val
        },
        clearCache: true,
        callback: () => {}
      })
    },
    // 导入
    ApplyExcel() {
      this.$modal({
        title: '上传供应商访厂记录',
        component: upData,
        width: '400px',
        top: '50px',
        data: { type: 'record' },
        callback: () => {
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
</style>
