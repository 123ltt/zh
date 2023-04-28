<template>
  <!-- 供应商管理/供应商引入-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="supplierCode" label="供应商编码">
                <el-input
                  v-model="submit.supplierCode"
                  style="width:80%;"
                  clearable
                  placeholder="请填写"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierName" style="width:80%;" :items="supplierList" key-field="supplierName" label-field="supplierName" value-field="supplierName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态" label-width="50px">
                <el-select
                  v-model="submit.status"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >查询</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
                <el-button
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

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierCode" label="供应商编码" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status == 1" @click="detailBtn(row)">{{ row.supplierCode }}</g-link>
          <g-link v-if="row.status != 0 && row.status != 1&& row.status != 2" @click="detailBtn(row,'detail')">{{ row.supplierCode }}</g-link>
          <span v-if="row.status == 0 ||row.status == 2">{{ row.supplierCode }}</span>
        </template>
      </el-table-column>

      <!-- 公司性质 -->
      <el-table-column
        slot="companyType"
        label="公司性质"
        align="center"
        min-width="80"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.companyType == 1">公司</span>
          <span v-if="scope.row.companyType == 2">个体</span>
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
          <el-button
            v-if="scope.row.status == 2"
            type="text"
            @click="addBtn(scope.row)"
          >调整</el-button>
          <el-button
            v-if="scope.row.status == 0 || scope.row.status == 2"
            type="text"
            @click="enableBtn(scope.row)"
          >提交</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="addBtn(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="removeBtn(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="detailBtn(scope.row,'audit')"
          >审核</el-button>
          <el-button
            v-if="scope.row.status ==3 ||scope.row.status ==5"
            type="text"
            @click="addBtn(scope.row)"
          >修改</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="detailBtn(scope.row)"
          >详情</el-button>
          <el-button
            v-if="scope.row.status != 0 && scope.row.status != 1&&scope.row.status != 2"
            type="text"
            @click="detailBtn(scope.row,'detail')"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getlistAddress, remove, getListAll, submit, getCateGoryChild } from '@/api/supplierManagement/supplierIntroduction.js'
import { getMyDictBiz } from '@/api/commonApi/common.js'
import introductionAdd from './components/introductionAdd.vue'
import introductionDetails from './components/introductionDetails.vue'
import { deepClone } from '@/util/util'
export default {
  name: 'SupplierSupplierManagementSupplierIntroduction',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierName: '',
        supplierCode: '',
        status: ''
      },
      supplierList: [],
      statusList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'supplierCode'
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
          minWidth: '170px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          slot: true,
          slotName: 'companyType'
        },
        {
          label: '注册时间',
          prop: 'registerTime',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '法人代表',
          prop: 'legalEntity',
          minWidth: '80px',
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
      //   新增，修改
      isAdd: false,
      addData: {
        supplierName: '',
        companyType: '',
        legalEntity: '',
        registerTime: '',
        manageModel: '',
        isHasbrand: '',
        isCustom: '',
        webSite: '',
        companyCountry: '',
        companyProvince: '',
        companyCity: '',
        companyAddress: '',
        mainCategoryPath: [],
        factoryCountry: '',
        factoryProvince: '',
        factoryCity: '',
        factoryAddress: '',
        companyIntroduction: '',
        cooperationScope: '',
        importReason: '',
        creditCode: '',
        payCondition: '',
        payType: '',
        enterpriseStatus: '',
        ifInvoice: '',
        isFreeship: '',
        mainPath: [],
        mainCategory: '',
        supplierContacterDTOList: [],
        supplierFileDTOList: []
      },
      addForm: {
        companyTypeList: [],
        manageModelList: [],
        statusList: [],
        hasBrand: [],
        custom: [],
        mainCategorylList: [],
        reasonList: []
      },
      openData: {},
      //   详情
      detailData: {},
      oldstatusList: {},
      titleStr: '',
      isAudit: [false, false],
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
      // 供应商
      getListAll().then(res => {
        this.supplierList = res.data
      })
      // 状态
      getMyDictBiz('pss_supplier_import_status').then(res => {
        this.statusList = res.data
        res.data.forEach(item => {
          this.oldstatusList[item.dictKey] = item.dictValue
        })
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
      })
      // 地址
      getlistAddress().then(res => {
        this.listAddress = res.data
      })
      getMyDictBiz('pss_company_type').then(res => {
        this.addForm.companyTypeList = res.data
      })
      getMyDictBiz('pss_verify_result').then(res => {
        this.addForm.statusList = res.data
      })
      getMyDictBiz('pss_manage_model').then(res => {
        this.addForm.manageModelList = res.data
      })
      getMyDictBiz('pss_is_hasBrand').then(res => {
        this.addForm.hasBrand = res.data
      })
      getMyDictBiz('pss_is_custom').then(res => {
        this.addForm.custom = res.data
      })
      getMyDictBiz('pss_import_reason').then(res => {
        this.addForm.reasonList = res.data
      })
      getCateGoryChild().then(res => {
        res.data.forEach(item => {
          const obj = {
            value: item.id,
            label: item.name,
            children: []
          }
          item.categoryChildVOList.forEach(item => {
            const childobj = {
              value: item.id,
              label: item.name
            }
            obj.children.push(childobj)
          })
          this.addForm.mainCategorylList.push(obj)
        })
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
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    //   重置
    reset() {
      this.submit.supplierName = ''
      this.submit.supplierCode = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.openData = JSON.parse(JSON.stringify(val))
        this.openData.factoryCountry = this.openData.factoryCountry + ''
        this.openData.factoryProvince = this.openData.factoryProvince + ''
        this.openData.factoryCity = this.openData.factoryCity + ''
        this.openData.companyCountry = this.openData.companyCountry + ''
        this.openData.companyProvince = this.openData.companyProvince + ''
        this.openData.companyCity = this.openData.companyCity + ''
      } else {
        this.isAdd = true
        this.openData = deepClone(this.addData)
      }
      this.$newTab({
        path: '/pss/supplierIntroduction/' + (this.isAdd ? 'add' : 'edit'),
        title: (this.isAdd ? '新增供应商引入' : '编辑供应商引入'),
        component: introductionAdd,
        data: {
          isAdd: this.isAdd,
          close: this.close,
          addForm: this.addForm,
          listAddress: this.listAddress,
          openData: this.openData
        },
        clearCache: true,
        callback: (flg) => {
          if (flg) this.initialization()
        }
      })
    },
    // 关闭
    close() {
      this.openData = {}
      this.isAudit = [false, false]
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
      this.confirm('提交', val, submit)
    },
    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 详情
    detailBtn(val1, val2) {
      this.detailData = val1
      if (val2 === 'audit') {
        this.titleStr = '供应商引入审核'
        this.isAudit = [true, false]
      } else if (val2 === 'detail') {
        this.titleStr = '供应商引入详情'
        this.isAudit = [false, true]
      } else {
        this.titleStr = '供应商引入详情'
        this.isAudit = [false, false]
      }
      this.$newTab({
        path: '/pss/supplierIntroduction/Detail',
        title: this.titleStr,
        component: introductionDetails,
        data: {
          addForm: this.addForm,
          titleStr: this.titleStr,
          listAddress: this.listAddress,
          isAudit: this.isAudit,
          detailData: this.detailData
        },
        clearCache: true,
        callback: (bool) => {
          if (bool) {
            this.initialization()
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
        margin-left: 20px!important;
    }
    .btn{
        width: 30%;
        display: flex;
        justify-content: space-between;
    }
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
}
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.tableData {
    margin-top: 15px;
  padding: 0 10px;
  .addBox {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
    text-align: right;
    padding-right: 20px;
    box-sizing: border-box;
  }
}
</style>
