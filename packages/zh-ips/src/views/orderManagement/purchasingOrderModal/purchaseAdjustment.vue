<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="120px" size="mini" class="no-message">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="采购编码">
              <el-input :value="detail.purCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第三方单号">
              <el-input :value="detail.platformCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购方名称">
              <el-input :value="detail.purSquareName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input :value="detail.supplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购人">
              <el-input :value="detail.purPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购金额">
              <el-input :value="detail['purAmount']" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购数量">
              <el-input :value="detail.purQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流运费">
              <el-input :value="detail['logisticsFreight']" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品金额">
              <el-input :value="detail['goodsAmount']" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后修改人">
              <el-input :value="detail['updateUserName']" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后修改时间">
              <el-input :value="detail['updateTime']" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划备注">
              <el-input :value="detail['remarks']" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">采购调整</span>
      </div>
      <el-table :data="detail.adjustDetails" stripe border size="mini" class="g-table">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
        <el-table-column prop="productImg" label="产品图片" align="center" width="70">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.productImg" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center" min-width="120">
          <tmeplate slot-scope="scope">
            <g-text-ellipsis :lines="2">{{ scope.row.productName }}</g-text-ellipsis>
          </tmeplate>
        </el-table-column>
        <el-table-column prop="purQty" label="采购数量" align="center" min-width="80" />
        <el-table-column prop="goodsReceivedQty" label="已发货数量" align="center" min-width="80" />
        <el-table-column prop="stayDeliveredQty" label="待发货数量" align="center" min-width="90" />
        <el-table-column prop="adjustAfterQty" label="调整后采购数量" align="center" min-width="100">
          <template slot-scope="slot">
            <el-input v-model.trim="slot.row.adjustAfterQty" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="slot">
            <el-input v-model.trim="slot.row.remarks" size="mini" />
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button size="mini" @click="$emit('close')">取消</el-button>
        <el-button size="mini" type="primary" @click="checkChange">确认调整</el-button>
      </div>
    </el-card>
  </basic-container>
</template>
<script>
import { detail, Adjustment } from '@/api/ordermanagement/orderManagement'
export default {
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      detail: {}
    }
  },
  mounted() {
    this.getDetail(this.id)
  },
  methods: {
    getDetail(id) {
      this.loading = true
      detail(id).then(res => {
        this.detail = res.data
        this.loading = false
      })
    },
    checkChange() {
      this.$confirm('确认提交调整采购订单', '调整采购单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        Adjustment(this.detail).then(res => {
          this.$message({
            type: 'success',
            message: res.msg + '!'
          })
        })
        this.$emit('close', true)
      }).catch(() => {
        this.$message({
          type: 'warn',
          message: '取消'
        })
      })
    }
  }

}
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
*{
  box-sizing: border-box;
}
.footer {
        text-align: right;
        //   margin-top: 30px;
        padding-top: 20px;
        }
</style>
