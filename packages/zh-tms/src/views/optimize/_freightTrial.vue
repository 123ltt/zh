<template>
  <basic-container>
    <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch">
      <!-- header插槽 （位于表格的上面，通常放搜索条件） -->
      <template slot="header">
        <el-form ref="form" :rules="rules" :model="searchData" label-width="80px" size="mini" class="form-col">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="渠道名称：" prop="channelId">
                <g-select v-model.trim="searchData.channelId"
                          :items="channelList"
                          key-field="id"
                          :label-field="getLabel"
                          value-field="id"
                          placeholder="请选择"
                          class="w-100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="目的国：" prop="countryId">
                <g-select v-model="searchData.countryId" :items="countryList" key-field="id" :label-field="getCountryLabel" value-field="id" clearable :item-title="true" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="重量：" prop="weight">
                <el-input v-model="searchData.weight" v-input.number.positive maxlength="13" placeholder="KG" @input="controlPoint('weight')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="体积(CM)：" prop="length">
                <el-input v-model="searchData.length" v-input.number.positive.numeric maxlength="13" class="small" placeholder="长" />
                <el-input v-model="searchData.width" v-input.number.positive.numeric maxlength="13" class="small" placeholder="宽" />
                <el-input v-model="searchData.height" v-input.number.positive.numeric maxlength="13" class="small" placeholder="高" />

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮编：" prop="postcode">
                <el-input v-model="searchData.postcode" maxlength="13" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="启运地：" prop="type">
                <el-cascader
                  v-model="searchData.type"
                  :options="warehouseList"
                  :props="options.prop"
                  filterable
                  clearable
                  collapse-tags
                  class="w-100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-flex justify-content-center">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="onsubmit">运费试算</el-button>
              <el-button class="btn" icon="el-icon-delete" size="mini" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>

    </g-table>
  </basic-container>
</template>
<script>

import { getFreightTryCalculation } from '@/api/freightCalculation'
import { getWarehouseTypeTree, getCountryList, logisticsChannel } from '@/api/common'
export default {
  name: 'TmsOptimizeFreightTrial',
  data() {
    return {
      searchData: {
        channelId: '', // 渠道id
        countryId: '', // 目的国
        weight: '', // 包裹重量（KG）
        length: '', // 包裹长 cm
        width: '', // 包裹宽 cm
        height: '', // 包裹高 cm
        volume: '', // 包裹体积 m^3
        postcode: '', // 邮编
        type: [] // 仓库集合
      },
      options: {
        prop: {
          value: 'id',
          label: 'desc',
          children: 'warehouseChildVOList'
        }
      },
      channelList: [],
      countryList: [], // 国家列表
      warehouseList: [],
      dealWithDecimalArray: ['cost', 'weightPrice', 'fuelCharge'], //  列表页处理小数点数组
      headers: [
        {
          label: '渠道名称',
          prop: 'channelName',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '费用(CNY)',
          prop: 'cost',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '公斤价格',
          prop: 'weightPrice',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '处理费',
          prop: 'fuelCharge',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '参考时效(天)',
          prop: 'timeliness',
          minWidth: '120px',
          align: 'center'
        }
      ],
      rules: {
        countryId: [{ required: true, message: '请选择目的国', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        type: [{ required: true, message: '请选择启运地', trigger: 'change' }],
        length: [{
          trigger: 'change',
          validator: (rules, value, cb) => {
            const { width, height } = this.searchData
            if (value + '' === '0' || width + '' === '0' || height + '' === '0') {
              return cb(new Error('请输入有效的长，宽，高'))
            }
            return cb()
          }
        }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      Promise.all([
        getCountryList(),
        getWarehouseTypeTree(),
        logisticsChannel()
      ]).then(res => {
        this.countryList = res[0].data

        this.warehouseList = this.deleteChildren(res[1].data, 'warehouseChildVOList')

        this.channelList = res[2].data
      })
    },
    getLabel(item) {
      return `${item.name} (${item.channelCode})`
    },

    fetch({ current, size }, params) {
      const emptyComeback = {
        records: [],
        total: 0,
        size: 0
      }
      // params.resetList 处理重置刷新列表页为空
      if (params.resetList) return Promise.resolve(emptyComeback)

      return getFreightTryCalculation(current, size, params).then(res => {
        if (res.data) {
          this.current = res.data.current
          const data = res.data.records
          this.dealWithDecimalArray.forEach(item => {
            data && data.forEach(element => {
              element[item] = element[item] === null ? '--' : Number(Number(element[item]).toFixed(2))
            })
          })
          return {
            records: data,
            total: res.data.total,
            size: res.data.size
          }
        }
      },
      // 抛出错误时清空列表页
      () => emptyComeback)
    },

    getCountryLabel(item) {
      return `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
    },
    deleteChildren(arr, childName) {
      arr.forEach(item => item[childName]?.length
        ? this.deleteChildren(item[childName], childName)
        : delete item[childName])
      return arr
    },

    // 控制小数点
    controlPoint(data) {
      const val = this.searchData[data].replace(/[^(0-9|.)]+/, '')
      const newVal = val.match(/^\d+(\.?\d{0,3})/g)
      this.searchData[data] = newVal ? newVal[0] : val
    },

    onsubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 算体积
          const { channelId, countryId, weight, width, length, height, postcode, type } = this.searchData
          let volume = ''
          if (width && height && length) {
            volume = Number(width) * Number(height) * Number(length)
          }
          // 完善仓库形式
          const leaf = [type.slice(-1)]
          this.searchCode(this.warehouseList, leaf)
          const channelWarehouses = [{ warehouse: leaf[1] }]

          // 完善国家形式
          const countryCode = this.countryList.filter(item => item.id === countryId)[0].countryNameShort
          const params = {
            channelId, countryCode, weight, width, length, height, postcode, channelWarehouses, volume
          }
          this.$refs.table.load(1, params)
        }
      })
    },

    searchCode(list, leaf) {
      list.forEach(item => {
        if (item.id + '' === leaf[0] + '') {
          leaf[1] = item.code
          return true
        }
        item.warehouseChildVOList && this.searchCode(item.warehouseChildVOList, leaf)
      })
    },
    reset() {
      for (const prop in this.searchData) {
        this.searchData[prop] = ''
      }
      this.searchData.type = []
      this.$refs.table.load(1, { resetList: true })
    }
  }
}
</script>
<style lang="scss" scoped>
.g-select {
  width:100%!important;
}
.el-select{
  width:100%!important;
}
.small{
  width:32%!important;
}
::v-deep .el-form-item__content{
  display: flex;
  justify-content: space-between;
}
::v-deep .el-cascader__search-input{
  margin:0;
  min-width:0px;
  width:0px;
  flex:0;
}
::v-deep .el-cascader__tags .el-tag{
  margin-left:3px;
  max-width: 70%;
}

</style>
