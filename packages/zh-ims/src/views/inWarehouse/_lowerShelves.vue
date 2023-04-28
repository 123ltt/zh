<template>
  <!-- 库内管理/下架管理-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form ref="formRef" :model="submit" label-width="80px" size="mini" class="no-message">
          <el-row>
            <el-col :span="7">
              <el-form-item prop="warehouseType" label="仓库类型">
                <el-select v-model="submit.warehouseType" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in warehouseTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="warehouseBelong" label="仓库归属">
                <g-select v-model="submit.warehouseBelong" style="width:80%;" :items="warehouseBelongList" key-field="dictKey" label-field="dictValue" value-field="dictKey" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="warehouseName" label="仓库名称">
                <g-select v-model="submit.warehouseName" style="width:80%;" :items="warehouseNameList" key-field="id" label-field="warehouseName" value-field="warehouseName" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="businessType" label="业务类型">
                <el-select v-model="submit.businessType" clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in inputTypeList" :key="item.value" :label="item.desc" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="businessCode" label="业务单号">
                <el-input v-model.trim="submit.businessCode" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="warehouseCode" label="下架单号">
                <el-input v-model.trim="submit.downShelfCode" clearable placeholder="请填写" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" :disabled="searchOk" @click="search()">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" :disabled="searchOk" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 仓库归属 -->
      <el-table-column slot="warehouseBelong" label="仓库归属" width="95" align="center">
        <template v-slot="{row}">
          <span>{{ warehouseBelongObj[row.warehouse.warehouseBelong] }}</span>
        </template>
      </el-table-column>

      <!-- 编码跳转详情 -->
      <el-table-column slot="downShelfCode" label="下架单号" min-width="200" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">{{ row.downShelfCode }}</g-link>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" min-width="90px" align="center">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList } from '@/api/inWarehouse/lowerShelves.js'
import { getDictBiz, getAllEnableWarehouse, getType } from '@/api/public/public.js'
import lowerShelvesDetail from './components/lowerShelvesDetail'
export default {
  name: 'ImsInWarehouseLowerShelves',
  data() {
    return {
      searchOk: false,
      warehouseTypeList: [],
      warehouseBelongList: [],
      warehouseNameList: [],
      warehouseBelongObj: {},
      inputTypeList: [],
      submit: {
        warehouseCode: '',
        warehouseName: '',
        warehouseType: '',
        businessType: '',
        warehouseBelong: ''
      },
      searchData: [],
      // 表格数据
      headers: [
        {
          label: '业务类型',
          prop: 'downShelfType.desc',
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '仓库类型',
          prop: 'warehouse.warehouseType.desc',
          minWidth: '100px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'warehouseBelong'
        },
        {
          label: '仓库名称',
          prop: 'warehouse.warehouseName',
          minWidth: '110px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'downShelfCode'
        },
        {
          label: '下架日期',
          prop: 'downShelfDate',
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '下架数量',
          prop: 'downShelfQty',
          minWidth: '80px',
          align: 'center'
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
  methods: {
    // 获取下拉数据
    getData() {
      // 仓库类型
      getDictBiz('warehouse_type').then(res => {
        this.warehouseTypeList = res.data
      })
      // 仓库名称
      getAllEnableWarehouse().then(res => {
        this.warehouseNameList = res.data
      })
      // 仓库归属
      getDictBiz('warehouse_belong').then(res => {
        this.warehouseBelongList = res.data
        this.warehouseBelongList.forEach(item => {
          this.warehouseBelongObj[item.dictKey] = item.dictValue
        })
      })
      // 业务类型
      getType('DOWN_SHELF').then(res => {
        this.inputTypeList = res.data
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      this.searchOk = true
      const emptyArr = Object.keys(params).filter(item => {
        if (params[item]) return true
      })
      if (emptyArr.length) {
        return getList(current, size, params).then(res => {
          this.searchOk = false
          return {
            records: res.data.records, // 列表数据
            total: res.data.total, // 总记录数
            size: res.data.pageSize // 每页最大记录数
          }
        })
      } else {
        return Promise.resolve().then(() => {
          this.searchOk = false
          return {
            records: [], // 列表数据
            total: 1, // 总记录数
            size: 20// 每页最大记录数
          }
        })
      }
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      const emptyArr = Object.keys(this.submit).filter(item => {
        if (this.submit[item]) return true
      })
      if (emptyArr.length) {
        this.searchData = JSON.parse(JSON.stringify(this.submit))
        this.initialization()
      } else {
        this.$message.error('请选择查询条件！')
      }
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        this.submit[item] = ''
      })
      this.searchData = []
      this.initialization()
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/warehousing/lowerShelvesDetail',
        title: '下架管理详情',
        component: lowerShelvesDetail,
        data: {
          lowerData: val,
          businessCode: val.businessCode,
          warehouseBelongObj: this.warehouseBelongObj
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
