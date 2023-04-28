<template>
  <el-form ref="rulesForm" v-loading="loading" label-width="120px" size="mini">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-table :data="tableData" border stripe class="g-table">
          <el-table-column width="35">
            <template slot-scope="scope">
              <el-radio v-model="select" :label="scope.$index" @change.native="getTemplateRow(scope.$index,scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="supplierName" show-overflow-tooltip label="供应商名称" align="center" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.prime===1">(主){{ scope.row.supplierName }}</span>
              <span v-else>{{ scope.row.supplierName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center" min-width="100" show-overflow-tooltip />
          <el-table-column prop="goodsPrice" label="商品价格" align="center" min-width="70" />
          <el-table-column prop="purAccountCurrency" label="币种" align="center" min-width="60">
            <template slot-scope="slot">
              <span>{{ slot.row.purAccountCurrency===1?'RMB':'' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplierLevel" label="供应商等级" align="center" min-width="85" />
          <el-table-column prop="supplierScore" label="供应商评分" align="center" min-width="85">
            <template slot-scope="slot">
              <span>{{ slot.row.supplierScore===-1?'':slot.row.supplierScore }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="manageModel" label="经营模式" align="center" min-width="90">
            <template slot-scope="slot">
              <span>{{ manageModelObj[slot.row.manageModel] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script>
import { getGoodsInfo } from '@/api/ordermanagement/price'
import { deepClone } from '@/util/util'
import { dictionary } from '@/api/commonApi'

export default {
  name: 'ShowSupplier',
  props: {
    id: String
  },
  data() {
    return {
      oldprice: '',
      allData: {},
      category: '',
      productName: '',
      manageModelObj: {},
      url: '',
      tableData: [],
      select: '',
      addEditype: '',
      checkData: {},
      inquiryId: '',
      productSku: '',
      loading: false
    }
  },
  mounted() {
    this.dealWith()
  },
  methods: {
    getTemplateRow(index, row) { // 获取选中数据
      this.checkData = deepClone(row)
    },
    // 保存
    define() {
      if (this.checkData) {
        this.$parent.$emit('close', this.checkData)
      } else {
        this.$message.error('请先选择主供应商！')
      }
    },
    dealWith() {
      this.loading = true
      dictionary('ips_manage_model').then(res => {
        res.data.forEach(item => {
          this.manageModelObj[item.dictKey] = item.dictValue
        })
      })
      getGoodsInfo(this.id).then(res => {
        this.tableData = res.data.inquiryGoodsVOS
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-radio__label{
  display: none;
}
.imgBox{
    width: 70%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items:flex-start;
  }
</style>
