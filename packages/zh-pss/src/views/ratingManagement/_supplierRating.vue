<template>
  <!-- 供应商评级管理/供应商评级-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="6">
              <el-form-item prop="supplierName" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:80%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="level" label="供应商等级">
                <el-select
                  v-model="submit.level"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="(item,index) in levelList"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button
                  class="btn"
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >查询</el-button>
                <el-button
                  class="btn"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="120" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link @click="detailBtn(row)">{{ row.supplierName }}</g-link>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="80">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template></el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getGrade } from '@/api/ratingManagement/supplierRating.js'
import { supplier } from '@/api/commonApi/common.js'
import supplierDetails from './components/supplierDetails.vue'
export default {
  name: 'SupplierRatingManagementSupplierRating',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierId: '',
        level: ''
      },
      supplierList: [],
      levelList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '供应商得分',
          prop: 'score',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '供应商等级',
          prop: 'level',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '100px',
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
      //   详情
      detailData: '',
      isDetail: false
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    //   获取数据
    getData() {
      supplier().then(res => {
        this.supplierList = res.data
      })
      getGrade().then(res => {
        this.levelList = res.data
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
      this.submit.supplierId = ''
      this.submit.level = ''
      this.searchData = {}
      this.initialization()
    },
    // 关闭
    close() {
      this.isDetail = false
    },
    // 详情
    detailBtn(val) {
      this.$modal({
        title: '供应商评级详情',
        component: supplierDetails,
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
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
.btnBox{
    ::v-deep .el-form-item__content{
        margin-left: 20px!important;
    }
    .btn{
        width: 30%;
    }
}
.searchBox{
    ::v-deep .el-form-item{
        margin-bottom: 0;
    }
}
</style>
