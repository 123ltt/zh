<template>
  <!-- 供应商黑名单 -->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="goodsName" label="商品名称">
                <el-input v-model="submit.goodsName" placeholder="请输入商品名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="status" label="状态">
                <el-select v-model="submit.status" placeholder="请选择" clearable>
                  <el-option v-for="(item,index) in statusList" :key="index" :value="item.dictKey" :label="item.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
            </el-col>
            <el-col :span="1">
              <el-button icon="el-icon-plus" type="primary" size="mini" @click="addEdit()">新增</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="100" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status!==0" @click="Detail(row)">{{ row.supplierName }}</g-link>
          <span v-else>{{ row.supplierName }}</span>
        </template>
      </el-table-column>

      <!-- 黑名单原因 -->
      <el-table-column slot="reason" label="黑名单原因" align="center" min-width="150">
        <template slot-scope="slot">
          <g-text-ellipsis lines="2">{{ slot.row.reason }}</g-text-ellipsis>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" align="center" min-width="90">
        <template slot-scope="slot">
          <span>{{ slot.row.status===0?'草稿':slot.row.status===1?'已添加':slot.row.status===2?'已移除':'' }}</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===0 || scope.row.status===2" type="text" @click="enable(scope.row.id,1)">添加</el-button>
          <el-button v-if="scope.row.status===0" type="text" @click="addEdit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status===0" type="text" @click="del(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.status===1" type="text" @click="moveClear(scope.row.id,2)">移除</el-button>
          <el-button v-if="scope.row.status!==0" type="text" @click="Detail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
  <!-- </div> -->
</template>
<script>
import { getList, update, remove, supplier, getGoods } from '@/api/basicManagement/blacklistOfSuppliers'
import { getDictBiz } from '@/api/commonApi/common'
import blackEdit from './components/blackEdit.vue'
import blackDetail from './components/blackDetail.vue'
export default {
  name: 'SupplierBlacklistManagementBlacklistOfSuppliers',
  data() {
    return {
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '商品编码',
          prop: 'goodsCode',
          minWidth: '110px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'reason'
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
      searchData: {}, // 搜索数据
      supplierList: [],
      goosdList: [],
      modalType: '',
      isAdd: false,
      isDetail: false,
      submit: {
        supplierId: '',
        status: '',
        goodsName: ''
      },
      statusList: []
    }
  },
  mounted() {
    this.initialization()
    this.getSuppliers()
  },
  methods: {
    supperlierChange(val) {
      if (val) {
        getGoods(val).then(res => {
          this.goosdList = res.data
        })
      } else {
        this.goosdList = []
      }
    },
    getSuppliers() {
      supplier().then(res => {
        if (res.code === 200) {
          this.supplierList = res.data
        }
      })
      getDictBiz('pss_black_list_status').then(res => {
        const data = res.data
        this.statusList = data
      })
    },
    addEdit(val) {
      val ? this.isAdd = false : this.isAdd = true
      this.$modal({
        title: (this.isAdd ? '新增供应商黑名单' : '编辑供应商黑名单'),
        component: blackEdit,
        data: {
          isAdd: this.isAdd,
          editData: val
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
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
    // 信息确认
    confirm(title, fn, obj1, obj2) {
      this.$confirm(`确定要${title}该条记录吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn(obj1, obj2).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },
    del(id) {
      this.confirm('删除', remove, id)
    },
    Detail(id) {
      this.$modal({
        title: '供应商黑名单详情',
        component: blackDetail,
        data: { id },
        callback: () => {}
      })
    },
    // 移除功能
    moveClear(id, num) {
      const row = {
        status: num
      }
      this.confirm('移除', update, id, row)
    },
    // 启用
    enable(id, num) {
      const row = {
        status: num
      }
      this.confirm('添加', update, id, row)
    },
    cancel() {
      this.isEdit = false
      this.isDetail = false
    },
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.searchData = {}
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  text-align: right;
  margin: 10px 10px 0 0;
}
.searchBox {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
.tableData{
    margin-top: 15px;
  }
</style>
