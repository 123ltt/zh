<template>
  <basic-container v-loading="loading">
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form :model="openData" label-width="120px" size="mini" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="退货运单号：">
              <el-input :value="openData.returnGoodsWaybill" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货人：">
              <el-input :value="openData.returnGoodsPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货时间：">
              <el-input :value="openData.returnGoodsTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货数量：">
              <el-input :value="openData.returnGoodsNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人：">
              <el-input :value="openData.receiptPeople" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货时间：">
              <el-input :value="openData.receiptTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货数量：">
              <el-input :value="openData.receiptNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">退货明细</span>
      </div>
      <el-table
        :data="openData.returnDetails"
        max-height="400px"
        stripe
        size="mini"
        class="g-table"
        border
      >
        <el-table-column
          prop="goodsName"
          label="商品名称"
          align="center"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="goodsCode"
          label="商品编码"
          align="center"
          min-width="110"
        />
        <el-table-column
          prop="rejectsQty"
          label="不良品数量"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="returnGoodsNumber"
          label="退货数量"
          align="center"
          min-width="90"
        />
        <el-table-column label="收货数量" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.receiptNumber" controls-position="right" style="width: 100%;border:0.5px solid #378888" size="mini" />
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button
          size="mini"
          icon="el-icon-circle-close"
          @click="$emit('close')"
        >取消</el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="define()"
        >确认收货</el-button>
      </div>
    </el-card>

  </basic-container>
</template>

<script>
import { getDetail, save } from '@/api/orderManagement/returnOrder.js'
export default {
  name: 'ConfirmReceipt',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      openData: {}
    }
  },
  mounted() {
    this.getData(this.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        if (res.code === 200) {
          this.openData = res.data
          this.loading = false
        } else {
          this.$message.error('加载失败!')
        }
      })
    },
    // 确认新增
    define() {
      if (this.validation(this.openData)) {
        this.loading = true
        save(this.openData).then(() => {
          this.loading = false
          this.$emit('close', true)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }
    },
    // 验证
    validation(val) {
      for (let i = 0; i < val.returnDetails.length; i++) {
        const num = i + 1
        if (val.returnDetails[i].receiptNumber === '' || val.returnDetails[i].receiptNumber === 0) {
          this.$message.error('请填写第' + num + '行的收货数量！')
          return false
        }
        if (!/^[1-9]\d*$/.test(val.returnDetails[i].receiptNumber)) {
          this.$message.error('第' + num + '行的收货数量必须是正整数！')
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
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
      margin-top: 30px;
      padding: 0 20px 20px 0;
    }
</style>
