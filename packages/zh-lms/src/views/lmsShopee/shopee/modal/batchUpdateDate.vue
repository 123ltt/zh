<template>
  <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="4">
        <el-button type="warning" size="mini" @click="isReplace = !isReplace">批量替换发货期</el-button>
      </el-col>
      <template v-if="isReplace">
        <el-col :span="3">
          <el-form-item label-width="0" prop="originVal">
            <el-input v-model="form.originVal" v-input.positive size="mini" class="w-10 ms-1" />
          </el-form-item>
        </el-col>
        <el-col :span="2" style="line-height: 28px" class="ms-1 text-center">替换为</el-col>
        <el-col :span="3">
          <el-form-item label-width="0" prop="changeVal">
            <el-input v-model="form.changeVal" v-input.positive size="mini" class="w-10" />
          </el-form-item>
        </el-col>
        <el-button type="primary" size="mini" class="ms-3" :disabled="!(form.originVal && form.changeVal)" @click="replace">替换</el-button>
      </template>
    </el-row>
    <el-table :data="tableDate" row-key="tableKey" border stripe highlight-current-row class="form-table g-table g-table-dense">
      <el-table-column label="店铺名" prop="account" />
      <el-table-column label="ItemID" prop="itemId" />
      <el-table-column label="发货期（预售）" prop="daysToShip">
        <template slot-scope="{row}">
          <el-input v-model="row.daysToShip" size="mini" @change="(value) =>handleDaysToShip(value,row)" />
        </template>
      </el-table-column>
      <el-table-column label="非预售" prop="isPreOrder">
        <template slot="header">
          <span class="has-error"><el-checkbox v-model="checkDaysToShip" size="mini" />非预售</span>
        </template>
        <template slot-scope="{row}">
          <el-checkbox v-model="row.isPreOrder" @change="(value)=>changeIsPreOrder(value,row)" />2天
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="text" @click="handleDel($index)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="更新结果" prop="msg" />
    </el-table>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
      <el-button type="primary" size="mini" :disabled="disabled" @click="batchReplace">更新</el-button>
    </div>
  </el-form>
</template>

<script>
import { updatePreOrder } from '@/api/shopee/shopee.js'
export default {
  name: 'BatchUpdateDate',
  props: {
    orderList: Array
  },
  data() {
    const validateDays = (rule, value, callback) => {
      const reg = /^([5-9]|10)$/
      if (this.form[rule.field] && this.form[rule.field] && !reg.test(this.form[rule.field])) {
        callback(new Error('只能输入5-10之间的整数'))
      } else {
        callback()
      }
    }
    return {
      form: {
        originVal: '',
        changeVal: ''
      },
      disabled: false,
      checkDaysToShip: false,
      rules: {
        originVal: [{ required: true, validator: validateDays }],
        changeVal: [{ required: true, validator: validateDays }]
      },
      isReplace: false,
      tableDate: []
    }
  },
  mounted() {
    this.tableDate = this.orderList
  },
  methods: {
    handleDel(index) {
      this.tableDate.splice(index, 1)
      this.disabled = !this.tableDate.length > 0
    },
    batchReplace() {
      this.tableDate.forEach(item => {
        item.daysToShip = item.isPreOrder ? null : item.daysToShip
        updatePreOrder({ id: item.id, daysToShip: item.daysToShip }).then(res => {
          console.log('res', res)
        })
      })
    },
    // 发货期（预售）
    handleDaysToShip(val) {
      this.tableDate.forEach(item => {
        item.isPreOrder = item.isPreOrder ? false : item.isPreOrder
      })
    },
    // 非预售
    changeIsPreOrder(val, row) {
      val && this.tableDate.forEach(item => {
        if (row.id === item.id) {
          item.daysToShip = ''
        }
      })
    },
    // 替换
    replace() {
      const newVal = this.form.changeVal
      const oldVal = this.form.originVal
      this.tableDate.forEach(item => {
        if (item.daysToShip === oldVal && !item.isPreOrder) {
          item.daysToShip = newVal
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__error{
  width: 134px !important;
}
.form-table{
  .el-form-item--mini.el-form-item{
    margin-bottom: 0;
  }
  ::v-deep .el-form-item__error{
    position: initial;
    font-weight: 400;
  }
}
</style>
