<template>
  <div class="shippable">
    <el-table :data="tableData" class="g-table" height="530">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table class="g-table" :data="scope.row.regions">
            <el-table-column prop="stateCode" label="地区" width="180" />
            <el-table-column label="运费" width="180">
              <template v-slot="{row}">
                <el-input v-model="row.localizedPrice" size="mini" disabled @blur="changeRegionCodeLocalizedPrice" />
              </template>
            </el-table-column>
            <el-table-column label="启用目的国家/地区" width="180">
              <template v-slot="{row}">
                <el-switch v-model="row.enabled" size="mini" disabled />
                <!-- <el-button @click="handlerLocalizedPrice(scope.row)">使用{{ scope.row.cnName }}</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="countryNameOrCode" label="国家">
        <template #header>
          <div class="d-flex">
            <div>国家</div>
            <el-input v-model.trim="searchName" placeholder="中文全称或简码全称" size="mini" style="width:220px" clearable @clear="handleSearch">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
            </el-input>
          </div>
        </template>
        <!-- <template v-slot="{row}">
          <div class="d-flex">
            {{ row.countryCode }}
            <el-input v-model.trim="searchName" size="mini" style="width:220px" clearable @clear="handleSearch">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
            </el-input>
          </div>
        </template> -->
      </el-table-column>
      <el-table-column prop="localizedPrice" label="运费" width="180">
        <template v-slot="{row}">
          <el-input v-model="row.localizedPrice" size="mini" disabled @blur="changeLocalizedPrice(row)" />
        </template>
      </el-table-column>
      <el-table-column label="启用目的国家/地区" width="180">
        <template v-slot="{row}">
          <el-switch v-model="row.enabled" size="mini" disabled active-value="启用状态" />
        </template>
      </el-table-column>
    </el-table>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="mini" type="primary" style="margin:20px 10px 0 0" @click="$parent.$emit('close')">返 回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShippableCountriesPage',
  props: {
    id: String,
    localizedShipping: String,
    changeRegionCodeLocalizedPriceFn: Function,
    changeLocalizedPriceFn: Function,
    countryShippingList: Array // 国家数据
  },
  data() {
    return {
      tableData: [],
      tableDataTemp: [], // 备份
      searchName: ''
    }
  },
  mounted() {
    this.shippableCountriesList()
  },
  methods: {
    // 更改地区运费
    changeRegionCodeLocalizedPrice(item) {
      this.changeRegionCodeLocalizedPriceFn(item)
    },
    // 更改国家运费
    changeLocalizedPrice(item) {
      this.changeLocalizedPriceFn(item)
    },

    // 使用国家运费
    handlerLocalizedPrice(item) {
      this.handlerLocalizedPriceFn(item)
    },
    // 搜索
    handleSearch() {
      if (this.searchName) {
        this.tableData = this.tableDataTemp.filter(item => item.countryCode === this.searchName || item.cnName === this.searchName)
        this.$set(this.tableData)
      } else {
        this.tableData = this.tableDataTemp
        this.$set(this.tableData)
      }
    },
    // 初始化国家运费
    shippableCountriesList() {
      let data = this.countryShippingList
      data = Array.isArray(data) ? data.map(item => {
        return {
          countryCode: item.countryCode,
          cnName: item.cnName,
          localizedPrice: item.localizedPrice, // 运费
          // countryCode: item.code, // 国家编码
          enabled: item.enabled, // 是否禁用
          regions: item.regions,
          countryNameOrCode: item.cnName + '-' + item.countryCode
        }
      }) : []
      this.tableDataTemp = data // 如果data为空值则赋值一个空数组
      this.tableData = data // 如果data为空值则赋值一个空数组
    }
  }
}
</script>

<style scoped>
.shippable{
  /* height: 540px; */
  overflow-y: scroll;
}
.el-table__expanded-cell{
  padding: 20px 10px !important;
}
</style>
