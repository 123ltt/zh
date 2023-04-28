<template>
  <basic-container>
    <div v-if="type" class="btn-head">
      <p />
      <el-button type="primary" size="mini" :disabled="submitBtnEnable" @click="handleUpdate('formObjRef')">修 改</el-button>
    </div>
    <el-table ref="table" :data="tableData" class="g-table" show-summary :summary-method="getSummaries">
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="网络费用项名称" prop="name" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" :style="{border:scope.row.nameErrMsg?'1px solid #f56c6c':''}" size="mini" maxlength="20" placeholder="请输入备注" />
          <span class="err">{{ scope.row.nameErrMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用" prop="cost" align="center">
        <template slot-scope="scope">
          <div>
            <el-input v-model="scope.row.cost" class="w120" size="mini" maxlength="11" :style="{border:scope.row.costErrMsg?'1px solid #f56c6c':''}" placeholder="请输入备注" />
            <span style="margin-left:6px">元/月</span>
          </div>
          <span class="err">{{ scope.row.costErrMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" maxlength="512" size="mini" placeholder="请输入备注" />
        </template>
      </el-table-column>
    </el-table>

  </basic-container>
</template>

<script>
import { getNetCosByStoreId, batchUpdateNetCost } from '@/api/storeList'
import { deepClone } from '@/util/util'
export default {
  name: 'NetworkCost',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    compId: {
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    type: { // 1编辑 0 查看
      type: Number
    }
  },
  data() {
    return {
      tableData: [],
      oldTable: []
    }
  },
  computed: {
    submitBtnEnable() {
      return (JSON.stringify(this.oldTable) === JSON.stringify(this.tableData))
    }
  },
  mounted() {
    this.getNetCosByStoreId()
  },
  methods: {
    getNetCosByStoreId() {
      getNetCosByStoreId({ id: this.compId }).then(res => {
        const data = res.data
        if (data.netCostVOList != null && data.netCostVOList.length) {
          data.netCostVOList.forEach(acc => {
            acc.nameErrMsg = null
            acc.costErrMsg = null
          })
          this.tableData = data.netCostVOList
        }
        this.oldTable = deepClone(this.tableData)
      })
    },
    // 合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = `合计：${sums[index]} 元/月`
        }
      })

      return sums
    },
    handleUpdate(formName) {
      const validateMoney = /^(?=([0-9]{1,10}$|[0-9]{1,8}\.))(0|[1-9][0-9]*)(\.[0-9]{2})?$/
      if (this.tableData) {
        let isBoolean = true
        this.tableData.forEach(acc => {
          if (acc.name === '') {
            isBoolean = false
            acc.nameErrMsg = '网络费用项名称不能为空'
          }
          if (acc.cost === '') {
            isBoolean = false
            acc.costErrMsg = '费用不能为空'
          } else if (!validateMoney.test(acc.cost)) {
            isBoolean = false
            acc.costErrMsg = '请输入正确的费用'
          }
        })
        if (isBoolean) {
          batchUpdateNetCost(this.tableData).then(res => {
            this.$message.success(res.msg)
            this.$emit('close', true)
          })
        }
      }
    }
  }

}
</script>

<style>
.w120{
  width: 120px;
}
.err{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    position: absolute;
    top: 80%;
    left: 10px;
}
</style>
