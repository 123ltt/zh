<template>
  <!-- 币种新增-->
  <el-form ref="rulesForm" v-loading="loading" size="small" :model="openData" label-width="auto">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-table :data="formTable" size="small" max-height="350px" stripe style="width: 100%" border>
          <el-table-column type="index" label="序号" width="50" align="center" />
          <el-table-column prop="currName" align="center" min-width="90">
            <template slot="header">
              <span>币种名称 <i style="color:red">*</i></span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.currName" clearable size="small" @input="changeCurrName(scope.row.currName, scope)" />
            </template>
          </el-table-column>
          <el-table-column prop="currCode" align="center" min-width="90">
            <template slot="header">
              <span>币种代码 <i style="color:red">*</i></span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.currCode" clearable size="small" @input="changeCurrCode(scope.row.currCode, scope)" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="操作" align="center" min-width="90">
            <template slot-scope="scope">
              <el-button icon="el-icon-plus" size="small" type="primary" circle @click="addBtn()" />
              <el-button type="default" :disabled="formTable.length<=1" size="small" icon="el-icon-minus" circle @click="removeBtn(scope)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;">
          <el-button size="small" class="default-width" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="small" class="default-width" type="primary" @click="define()">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

import { save } from '@/api/currency.js'
import { deepClone } from '@/util/util'
export default {
  name: 'CurrencyAdd',
  props: {

  },
  data() {
    return {
      loading: false,
      flg: false,
      openData: {
        currencyList: []
      },
      formTable: [{
        currName: '',
        currCode: '',
        id: ''
      }],
      oldTable: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
    },
    addBtn() {
      const obj = {
        currName: '',
        currCode: '',
        id: ''
      }
      this.formTable.push(obj)
    },
    removeBtn(val) {
      this.formTable.splice(val.$index, 1)
    },
    changeCurrName(val1, val2) {
      this.oldTable = deepClone(this.formTable)
      this.oldTable.splice(val2.$index, 1)
      this.oldTable.forEach(item => {
        if (item.currName === val1) {
          this.$message.error('列表中已有该币种名称，请勿重复添加！')
        }
      })
    },
    changeCurrCode(val1, val2) {
      this.oldTable = deepClone(this.formTable)
      this.oldTable.splice(val2.$index, 1)
      this.oldTable.forEach(item => {
        if (item.currCode === val1) {
          this.$message.error('列表中已有该币种代码，请勿重复添加！')
        }
      })
    },
    // 确认新增
    define() {
      this.openData.currencyList = this.formTable.filter(item => { return item.currName && item.currCode })
      const item = this.openData.currencyList.find(item => {
        if (item.currCode.length !== 3) {
          return item
        }
      })
      if (item) {
        this.$message.error(`${item.currName}币种代码长度不为3`)
        return
      }

      if (this.openData.currencyList.length) {
        save(this.openData.currencyList).then(() => {
          this.$parent.$emit('close', true)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      } else {
        this.$message.error('请填写币种信息！')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-item {
    margin-bottom: 10px !important;
  }
  .default-width{
    width: 60px
  }
  .redStar {
    color: red;
    font-size: 12px;
  }
</style>
