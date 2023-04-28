<template>
  <!-- 子组件详情 -->
  <div v-loading="loading">
    <el-form label-width="80px" size="mini" class="no-message">
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
        <el-col :span="3">
          <el-form-item class="btnBox">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="query">查询</el-button>
            <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="submitData" max-height="600" stripe style="width:100%" size="mini" border class="g-table">
      <el-table-column prop="warehouse.warehouseType.desc" label="仓库类型" align="center" min-width="100" />
      <el-table-column prop="warehouse.warehouseBelong" label="仓库归属" align="center" min-width="120" show-overflow-tooltip>
        <template v-slot="{row}">
          <span>{{ warehouseBelongObj[row.warehouse.warehouseBelong] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouse.warehouseName" label="仓库名称" align="center" min-width="120" show-overflow-tooltip />
      <el-table-column v-if="type=='all'" prop="stockTotal" label="库存总量" align="center" min-width="90" />
      <el-table-column v-if="type=='purchasing'||type=='all'" prop="purchasingStock" label="采购中库存" align="center" min-width="100">
        <template slot-scope="{row}">
          <g-link v-if="type=='all'" color="primary" @click="detailBtn(row,'purchasing')">{{ row.purchasingStock }}</g-link>
          <span v-else>{{ row.purchasingStock }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type=='intransit'||type=='all'" prop="intransitStock" label="在途库存" align="center" min-width="90">
        <template slot-scope="{row}">
          <g-link v-if="type=='all'" color="primary" @click="detailBtn(row,'intransit')">{{ row.intransitStock }}</g-link>
          <span v-else>{{ row.intransitStock }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type=='available'||type=='all'" prop="availableStock" label="可用库存" align="center" min-width="90">
        <template slot-scope="{row}">
          <g-link v-if="type=='all'" color="primary" @click="detailBtn(row,'available')">{{ row.availableStock }}</g-link>
          <span v-else>{{ row.availableStock }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type=='freeze'||type=='all'" prop="freezeStock" label="冻结库存" align="center" min-width="90">
        <template slot-scope="{row}">
          <g-link v-if="type=='all'" color="primary" @click="detailBtn(row,'freeze')">{{ row.freezeStock }}</g-link>
          <span v-else>{{ row.freezeStock }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type=='reserve'||type=='all'" prop="reserveStock" label="备用库存" align="center" min-width="90">
        <template slot-scope="{row}">
          <g-link v-if="type=='all'" color="primary" @click="detailBtn(row,'reserve')">{{ row.reserveStock }}</g-link>
          <span v-else>{{ row.reserveStock }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type=='inWarehouse'||type=='all'" prop="inWarehouseStock" label="在库库存" align="center" min-width="90">
        <template slot-scope="{row}">
          <g-link v-if="type=='all'" color="primary" @click="detailBtn(row,'inWarehouse')">{{ row.inWarehouseStock }}</g-link>
          <span v-else>{{ row.inWarehouseStock }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type=='oosQuantity'||type=='all'" prop="oosQuantityStock" label="缺货库存" align="center" min-width="90">
        <template slot-scope="{row}">
          <g-link v-if="type=='all'" color="primary" @click="detailBtn(row,'oosQuantity')">{{ row.oosQuantity }}</g-link>
          <span v-else>{{ row.oosQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type!='all'" label="操作" min-width="90px" align="center">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="detailBtn(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import viewGrandsonDetails from './viewGrandsonDetails.vue'

export default {
  name: 'ViewChildDetails',
  props: {
    type: String,
    warehouseTypeList: Array,
    warehouseNameList: Array,
    warehouseBelongList: Array,
    warehouseBelongObj: Object,
    parameter: Object,
    detailData: Object
  },
  data() {
    return {
      submit: {
        warehouseName: '',
        warehouseType: '',
        warehouseBelong: ''
      },
      submitData: [],
      recordData: [],
      typeShow: '',
      loading: false,
      titleList: {
        purchasing: '采购中库存明细',
        intransit: '在途库存明细',
        available: '可用库存明细',
        reserve: '备用库存明细',
        inWarehouse: '在库库存明细',
        freeze: '冻结库存明细',
        oosQuantity: '缺货库存明细'
      }
    }
  },
  mounted() {
    this.recordData = this.detailData.stockList
    this.submitData = this.detailData.stockList
  },
  methods: {
    query() {
      const submit = this.submit
      this.submitData = this.recordData.filter(item => {
        if (submit.warehouseName && item.warehouse.warehouseName !== submit.warehouseName) return false
        if (submit.warehouseType && item.warehouse.warehouseType.value !== submit.warehouseType) return false
        if (submit.warehouseBelong && item.warehouse.warehouseBelong !== submit.warehouseBelong) return false
        return true
      })
    },
    reset() {
      this.submit.warehouseName = ''
      this.submit.warehouseType = ''
      this.submit.warehouseBelong = ''
      this.submitData = this.recordData
    },
    detailBtn(val, types) {
      let typeShow = this.typeShow
      if (types) {
        typeShow = types
      } else {
        typeShow = this.type
      }
      this.$modal({
        title: this.titleList[typeShow],
        component: viewGrandsonDetails,
        width: '700px',
        height: '500px',
        data: {
          warehouseBelongObj: this.warehouseBelongObj,
          type: typeShow,
          openData: val
        },
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
