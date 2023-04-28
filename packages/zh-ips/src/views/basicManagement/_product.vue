<template>
  <!-- 基础管理/产品对应-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="productSkuList" label="产品编码">
                <el-input v-model.trim="submit.productSkuList" clearable placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in statusList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
      <el-table-column slot="ruleCode" label="规则编码" min-width="95" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" color="primary" @click="detailBtn(row)">{{ row.ruleCode }}</g-link>
          <span v-else>{{ row.ruleCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="70" align="center">
        <template v-slot="{row}">
          <span v-if="row.status == 0">草稿</span>
          <span v-if="row.status == 1">启用</span>
          <span v-if="row.status == 2">停用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template v-slot="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="enableBtn(scope.row)">启用</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 0" type="text" @click="removeBtn(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="addBtn(scope.row)">调整</el-button>
          <el-button v-if="scope.row.status == 1" type="text" @click="disableBtn(scope.row)">停用</el-button>
          <el-button v-if="scope.row.status != 0" type="text" @click="detailBtn(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>
  </basic-container>
</template>

<script>
import { getList, updateStatue, remove } from '@/api/basicManagement/product.js'
import { dictionary } from '@/api/commonApi.js'
import productAdd from './components/productAdd'
import productDetail from './components/productDetail'
export default {
  name: 'PurchaseBasicManagementProduct',
  data() {
    return {
      // 搜索参数
      submit: {
        status: '',
        productSkuList: ''
      },
      searchData: [],
      categoryPath: [],
      statusList: [],
      treeData: [],
      //   规则名称
      rulesName: [],
      //   规则类型
      rulesType: [],
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'ruleCode'
        },
        {
          label: '产品类目',
          prop: 'categoryName',
          showOverflowTooltip: true,
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '产品编码',
          prop: 'productSku',
          showOverflowTooltip: true,
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '产品名称',
          prop: 'productName',
          showOverflowTooltip: true,
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
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          minWidth: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      enable: {},
      // 新增编辑
      isAdd: false,
      editData: {},
      addData: {
        productSku: '',
        mainSupplierCode: '',
        goodsList: []
      }
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    // 获取数据
    getData() {
      dictionary('ips_base_rule_status').then(res => {
        const data = res.data
        this.statusList = data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
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
      this.submit.productSkuList = ''
      this.submit.status = ''
      this.searchData = []
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
        this.editData = JSON.parse(JSON.stringify(val))
      } else {
        this.isAdd = true
      }
      this.$newTab({
        path: '/ips/product/add',
        title: (this.isAdd ? '新增产品对应' : '编辑产品对应'),
        component: productAdd,
        data: {
          isAdd: this.isAdd,
          editData: this.editData
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
    enableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      const obj = {
        id: this.enable.id,
        status: 1
      }
      this.confirm('启用', obj, updateStatue)
    },
    // 删除
    removeBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.confirm('删除', this.enable.id, remove)
    },
    // 停用
    disableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      const obj = {
        id: this.enable.id,
        status: 2
      }
      this.confirm('停用', obj, updateStatue)
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '产品对应详情',
        component: productDetail,
        data: {
          detailData: val
        },
        callback: () => {}
      })
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
        margin-bottom: 0px;
    }
    .btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
}
</style>
