<template>
  <div class="shippable">
    <el-form ref="form" :model="form" size="mini" class="w-92 form-col" :rules="rules">
      <el-table :data="form.tableData" class="g-table" height="500" :row-key="getRowKeys" :expand-row-keys="expands" :row-class-name="setClassName" @expand-change="changeExpand">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table class="g-table" :data="scope.row.regions">
              <el-table-column prop="regionCode" label="地区" />
              <el-table-column label="运费">
                <template slot-scope="{row,$index}">
                  <el-form :model="row" size="mini" class="w-90 form-col">
                    <el-form-item :prop="row.localizedPrice"
                                  :rules="row.enabled?[{ required: true, validator: validateLocalizedPrice(row,$index),trigger:'blur'}]:[]"
                                  class="el-form-item_no-lable mb-0"
                    >
                      <el-input v-model="row.localizedPrice" :disabled="!(row.disabled && row.enabled)" size="mini" clearable @change="(value) => changePrice(value,scope.row,scope.$index,$index)" />
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <!-- 国家禁用 区域禁用
            区域 是否启用 true -->
              <el-table-column label="启用/禁用">
                <template slot-scope="{row,$index}">
                  <el-switch v-model="row.enabled" size="mini" @change="changeChildEnabled(scope.row,scope.$index,$index)" />
                </template>
              </el-table-column>
              <el-table-column label="使用国家运费">
                <template #header>
                  <el-checkbox v-model="scope.row.useCountryShipping" label="使用国家运费" @change="changeUseCountryShipping(scope.row,scope.$index)" />
                  <el-popover placement="bottom" width="120" trigger="hover" class="ms-4">
                    说明: 勾选后,所有国家/分区运费全部应用本地运输,去掉勾选重置为创建时保存的值
                    <i slot="reference" class="el-icon-info" />
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="cnNameCode" label="国家" width="260">
          <template #header>
            <div class="d-flex">
              <div>国家</div>
              <el-input v-model.trim="searchName" placeholder="中文全称或简码全称" size="mini" style="width:200px !important;" class="ms-2" clearable @clear="handleSearch">
                <el-button slot="append" icon="el-icon-search" size="mini" @click="handleSearch" />
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="localizedPrice" label="运费">
          <template slot-scope="{row,$index}">
            <el-form-item :prop="'tableData.' + $index + '.localizedPrice'"
                          :rules="row.enabled?[{ required: true, validator: validateLocalizedPrice(row,$index), trigger: 'blur' }]:[]"
                          class="el-form-item_no-lable mb-0"
            >
              <el-input v-model="row.localizedPrice" :disabled="!row.enabled" size="mini" clearable />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="启用/禁用">
          <template slot-scope="{row,$index}">
            <el-switch v-model="row.enabled" size="mini" @change="changeEnabled(row,$index)" />
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" width="160px">
          <template #header>
            <el-checkbox v-model="checkLocalizedPrice" label="使用本地运费" @change="changeLocalizedPrice" />
            <el-popover placement="bottom" width="120" trigger="hover" class="ms-4">
              说明: 勾选后,所有分区运费全部应用国家运输,去掉勾选重置为创建时保存的值
              <i slot="reference" class="el-icon-info" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div style="padding: 6px 0;text-align: right">
      <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
      <el-button type="primary" size="mini" @click="handlerSave">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/util/util'
export default {
  name: 'ShippableCountriesPage',
  props: {
    localizedShipping: String,
    countryShippingList: { // 国家运费列表数据
      type: Array,
      require: true
    },
    isEdit: Boolean,
    shippingValStatus: Boolean,
    tableDataTemp: { // 国家运费列表数据备份
      type: Array,
      require: true
    }

  },
  data() {
    return {
      form: {
        tableData: []
      },
      searchName: '',
      expands: [],
      checkLocalizedPrice: false,
      countryShippingListTemp: [],
      getRowKeys(row) {
        return row.id
      },
      rules: {}
    }
  },
  mounted() {
    this.shippableCountriesList()
  },
  methods: {
    // 控制多属性是否展示箭头
    setClassName({ row, index }) {
      return row.regions.length ? '' : 'expand'
    },
    // 展开
    changeExpand(row, expandedRows) {
      if (expandedRows.length) { // 此时展开
        this.expands = []
        if (row) {
          this.expands.push(row.id)
        }
      } else { // 折叠
      // 关闭所有的展开行，给expands 设置成空值
        this.expands = []
      }
      row.isExpand = !row.isExpand
    },
    // 修改价格
    changePrice(val, row, index, cindex) {
      this.form.tableData[index].regions[cindex].useCountryShipping = false
    },
    // 使用本地运费
    changeLocalizedPrice() {
      if (this.checkLocalizedPrice) {
        const localizedShipping = this.localizedShipping
        this.form.tableData.forEach(item => {
          if (item.enabled) {
            if (item.regions?.length) {
              item.enabled && item.regions.forEach(list => { list.localizedPrice = list.enabled ? localizedShipping : '' })
            }
            item.localizedPrice = localizedShipping
          }
        })
        this.$set(this.form.tableData, 'localizedPrice', localizedShipping)
      } else {
        this.form.tableData = []
        this.form.tableData = deepClone(this.countryShippingListTemp)
      }
    },
    // 父 启用禁用
    changeEnabled(row, index) {
      if (!row.enabled) {
        if (row.regions?.length) {
          row.regions.forEach(item => {
            item.localizedPrice = ''
            item.enabled = false
          })
          this.$set(this.form.tableData[index].regions, 'localizedPrice', '')
        } else {
          row.localizedPrice = ''
          this.$set(this.form.tableData[index], 'localizedPrice', row.localizedPrice)
        }
      } else {
        if (row.regions?.length) {
          row.regions.forEach(item => {
            item.enabled = true
          })
          this.$set(this.form.tableData[index].regions, 'localizedPrice', '')
        }
      }
    },
    // 子 启用禁用
    changeChildEnabled(row, fIndex, cIndex) {
      if (!row.regions[cIndex].enabled) {
        row.regions[cIndex].localizedPrice = ''
        this.$set(this.form.tableData[fIndex].regions, 'localizedPrice', row.regions[cIndex].localizedPrice)
      }
    },
    validateLocalizedPrice(sku) {
      return (rule, value, callback) => {
        if (sku.localizedPrice && sku.localizedPrice > 0) {
          callback()
        } else {
          callback(new Error('运费不能小于0'))
        }
      }
    },
    // 使用国家运费
    changeUseCountryShipping(row, fIndex) {
      if (row.useCountryShipping) {
        this.form.tableData[fIndex].regions.forEach(item => {
          if (item.enabled) {
            item.disabled = false
            item.useCountryShipping = true
            item.localizedPrice = row.localizedPrice
          }
        })
      } else {
        this.form.tableData[fIndex].regions.forEach(item => {
          this.countryShippingListTemp[fIndex].regions.forEach(list => {
            if (item.regionCode === list.regionCode) {
              if (item.enabled) {
                item.disabled = true
                item.useCountryShipping = list.useCountryShipping
                item.localizedPrice = list.localizedPrice
              }
            }
          })
        })
      }
      this.$set(this.form.tableData[fIndex], 'regions', this.form.tableData[fIndex].regions)
    },
    // 搜索
    handleSearch() {
      if (this.searchName) {
        // this.form.tableData = this.countryShippingListTemp.filter(item => item.countryCode === this.searchName || item.cnName === this.searchName)
        const tableData = []
        for (const item of this.countryShippingListTemp) {
          if (item.countryCode.match(this.searchName) || item.cnName.match(this.searchName)) {
            tableData.push(item)
          }
        }
        this.form.tableData = tableData
        this.$set(this.form.tableData)
      } else {
        this.form.tableData = this.countryShippingListTemp
        this.$set(this.form.tableData)
      }
    },
    // 保存
    handlerSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const filterRegions = []
          this.form.tableData.forEach(item => {
            if (item.regions?.length && item.enabled) {
              const regions = item.regions.filter(list => list.enabled && list.localizedPrice === '')
              filterRegions.push(...regions)
            }
          })
          if (filterRegions.length) {
            return this.$message.error('运费不能为空，并且不能小于0')
          } else {
            const countryShippingList = this.form.tableData
            this.$parent.$emit('close', countryShippingList)
          }
        } else {
          this.$message.error('运费不能小于0')
        }
      })
    },
    // 初始化国家运费
    shippableCountriesList() {
      if (!this.isEdit && this.shippingValStatus) { // 新增 且 修改了本地运费
        this.countryShippingList.forEach(item => {
          if (item.regions?.length) {
            item.regions.forEach(list => { list.localizedPrice = this.localizedShipping })
          }
          item.localizedPrice = this.localizedShipping
        })
        this.countryShippingListTemp = deepClone(this.countryShippingList)
        this.form.tableData = deepClone(this.countryShippingList)
      } else {
        this.countryShippingListTemp = deepClone(this.countryShippingList)
        this.form.tableData = deepClone(this.countryShippingList)
      }
    }
  }
}
</script>

<style scoped>
.shippable{
  height: 540px;
  overflow-y: scroll;
}
.el-table__expanded-cell{
  padding: 20px 10px !important;
}
::v-deep .el-table__expanded-cell[class*=cell]{
  padding:10px 20px;
}
</style>
