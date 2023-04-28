<template>
  <!-- 库内管理/上架管理-->
  <basic-container>
    <g-table ref="table" :key="submit.upShelfType" :headers="headers" row-key="id" :fetch="fetch">
      <el-form slot="header" size="mini" label-width="100px" class="form-col no-message">
        <el-row>
          <el-col :span="3">
            <el-radio-group v-model="submit.upShelfType" :disabled="changeLoading" size="mini" @change="changeType">
              <el-radio-button label="INTO_WAREHOUSE_UP_SHELF">入库上架</el-radio-button>
              <el-radio-button label="IN_WAREHOUSE_UP_SHELF">库内上架</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="warehouseType" label="仓库类型">
              <el-select v-model="submit.warehouseType" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in warehouseTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="warehouseBelong" label="仓库归属">
              <g-select v-model="submit.warehouseBelong" style="width:80%;" :items="warehouseBelongList" key-field="dictKey" label-field="dictValue" value-field="dictKey" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="warehouseName" label="仓库名称">
              <g-select v-model="submit.warehouseName" style="width:80%;" :items="warehouseNameList" key-field="id" label-field="warehouseName" value-field="warehouseName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="submit.upShelfType=='IN_WAREHOUSE_UP_SHELF'" :span="6" :offset="3">
            <el-form-item prop="businessType" label="业务类型">
              <el-select v-model="submit.businessType" clearable placeholder="请选择" filterable style="width:80%">
                <el-option v-for="item in inputTypeList" :key="item.value" :label="item.desc" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="submit.upShelfType=='INTO_WAREHOUSE_UP_SHELF'" :span="6" :offset="3">
            <el-form-item prop="inputCode" label="入库单号">
              <el-input v-model.trim="submit.inputCode" clearable placeholder="请填写" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col v-if="submit.upShelfType=='IN_WAREHOUSE_UP_SHELF'" :span="6">
            <el-form-item prop="businessCode" label="业务单号">
              <el-input v-model.trim="submit.businessCode" clearable placeholder="请填写" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="upShelfCode" label="上架单号">
              <el-input v-model.trim="submit.upShelfCode" clearable placeholder="请填写" style="width:80%" />
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

      <!-- 产品归属 -->
      <el-table-column slot="warehouseBelong" label="仓库归属" width="95" align="center">
        <template v-slot="{row}">
          <span>{{ warehouseBelongObj[row.warehouse.warehouseBelong] }}</span>
        </template>
      </el-table-column>

      <!-- 单号跳转详情 -->
      <el-table-column slot="upShelfCode" label="上架单号" min-width="180" align="center" show-overflow-tooltip>
        <template v-slot="{row}">
          <g-link color="primary" @click="detailBtn(row)">{{ row.upShelfCode }}</g-link>
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
import { getDictBiz, getAllEnableWarehouse, getType } from '@/api/public/public.js'
import { getList } from '@/api/inWarehouse/onShelves.js'
import onShelvesDetail from './components/onShelvesDetail.vue'
export default {
  name: 'ImsInWarehouseOnShelves',
  data() {
    return {
      searchOk: false,
      tableType: 'INTO_WAREHOUSE_UP_SHELF',
      submit: {
        upShelfType: 'INTO_WAREHOUSE_UP_SHELF',
        warehouseType: '',
        warehouseBelong: '',
        warehouseName: '',
        businessType: '',
        inputCode: '',
        upShelfCode: ''
      },
      searchData: [],
      inputTypeList: [],
      changeLoading: false,
      warehouseBelongObj: {},
      warehouseTypeList: [], // 仓库类型
      warehouseBelongList: [], // 仓库归属
      warehouseNameList: [], // 仓库名称
      headers: []
    }
  },
  watch: {
    'submit.upShelfType'(n, o) {
      if (o !== n) {
        Object.keys(this.submit).forEach(item => {
          if (item !== 'upShelfType') {
            this.submit[item] = ''
          }
        })
        this.searchData = JSON.parse(JSON.stringify(this.submit))
        this.headers = this.getHeaders()
      }
    }
  },
  created() {
    this.getData()
    this.headers = this.getHeaders()
  },
  methods: {
    // 根据入库单状态来确定headers
    getHeaders() {
      if (this.submit.upShelfType === 'INTO_WAREHOUSE_UP_SHELF') {
        return [
          { label: '仓库类型', prop: 'warehouse.warehouseType.desc', minWidth: '110', align: 'center' },
          { slot: true, slotName: 'warehouseBelong' },
          { label: '仓库名称', prop: 'warehouse.warehouseName', minWidth: '110', align: 'center' },
          { slot: true, slotName: 'upShelfCode' },
          { label: '上架日期', prop: 'upShelfDate', minWidth: '130', align: 'center' },
          { label: '上架数量', prop: 'upShelfQty', minWidth: '100', align: 'center' },
          { slot: true, slotName: 'handler' }
        ]
      } else if (this.submit.upShelfType === 'IN_WAREHOUSE_UP_SHELF') {
        return [
          { label: '仓库类型', prop: 'warehouse.warehouseType.desc', minWidth: '110', align: 'center' },
          { slot: true, slotName: 'warehouseBelong' },
          { label: '仓库名称', prop: 'warehouse.warehouseName', minWidth: '110', align: 'center' },
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
      getType('UP_SHELF').then(res => {
        this.inputTypeList = res.data
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      this.loading = true
      this.searchOk = true
      this.changeLoading = true
      this.headers = this.getHeaders()
      const emptyArr = Object.keys(params).filter(item => {
        if (item !== 'upShelfType') {
          if (params[item]) return true
        }
      })
      if (emptyArr.length) {
        return getList(current, size, params).then(res => {
          this.changeLoading = false
          this.searchOk = false
          this.loading = false
          return {
            records: res.data.records, // 列表数据
            total: res.data.total, // 总记录数
            size: res.data.pageSize // 每页最大记录数
          }
        })
      } else {
        this.changeLoading = false
        this.searchOk = false
        return Promise.resolve().then(() => {
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
        if (item !== 'upShelfType') {
          if (this.submit[item]) return true
        }
      })
      if (emptyArr.length) {
        if (this.submit.upShelfType === 'INTO_WAREHOUSE_UP_SHELF') {
          const { inputType, businessCode, ...obj } = this.submit
          this.searchData = JSON.parse(JSON.stringify(obj))
        } else if (this.submit.upShelfType === 'IN_WAREHOUSE_UP_SHELF') {
          const { inputCode, ...obj } = this.submit
          this.searchData = JSON.parse(JSON.stringify(obj))
        }
        this.initialization()
      } else {
        this.$message.error('请选择查询条件！')
      }
    },
    // 切换状态
    changeType(val) {
      this.reset()
    },
    //   重置
    reset() {
      Object.keys(this.submit).forEach(item => {
        if (item !== 'upShelfType') {
          this.submit[item] = ''
        }
      })
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/warehousing/onShelvesDetail',
        title: '上架管理详情',
        component: onShelvesDetail,
        data: {
          id: val.id,
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
