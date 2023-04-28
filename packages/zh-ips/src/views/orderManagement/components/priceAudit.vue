<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">产品调价</span>
      </div>
      <el-table :data="auditTableData" size="mini" max-height="400px" stripe border class="g-table">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="90" />
        <el-table-column prop="productName" label="产品名称" align="center" min-width="120" show-overflow-tooltip />
        <el-table-column prop="preAdjustSupplierName" label="调前供应商" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="preAdjustPurchasePrice" label="调前单价" align="center" min-width="80" />
        <el-table-column prop="purchasePrice" label="调后单价" align="center" min-width="80" />
        <el-table-column prop="supplierName" label="调后供应商" align="center" min-width="130" show-overflow-tooltip />
        <!-- 涨降幅度 -->
        <el-table-column prop="priceChange" label="涨降幅度" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.priceChange>0">
              <i class="el-icon-top" style="color:red" /> +{{ scope.row.priceChange }} %
            </span>
            <span v-if="scope.row.priceChange<0">
              <i class="el-icon-bottom" style="color:green" /> {{ scope.row.priceChange }} %
            </span>
            <span v-if="scope.row.priceChange==0"> {{ scope.row.priceChange }}</span>
          </template>
        </el-table-column>
        <!-- 调价原因 -->
        <el-table-column prop="adjustReason" label="调价原因" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.adjustType == 1">{{ upReasonObj[scope.row.adjustReason] }}</span>
            <span v-if="scope.row.adjustType == 2">{{ downReasonObj[scope.row.adjustReason] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="adjustComment" label="调价备注" align="center" min-width="150" show-overflow-tooltip />
        <el-table-column prop="adjustImage" label="调价图片" align="center" width="75">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.adjustImage" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">调价审核</span>
      </div>
      <el-form ref="rulesForm" :model="auditData" label-width="120px" size="mini">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="审核意见原因" prop="verifyStatus" :rules="[ { required: true, message: '请选择审核意见原因！', trigger: 'change' } ]">
              <el-select v-model="auditData.verifyStatus" clearable style="width:100%">
                <el-option v-for="item in verifyStatusList" :key="item.dictKey" :value="item.dictKey" :label="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="verifyComment" label="审核备注" :rules="[ { required: true, message: '请填写审核备注！', trigger: 'blur' } ]">
              <el-input v-model="auditData.verifyComment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" maxlength="500" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="text-align: right;padding-right: 20px;">
              <el-button size="mini" icon="el-icon-circle-close" @click="$emit('close')">取消</el-button>
              <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </basic-container>

</template>
<script>
import { dictionary } from '@/api/commonApi'
import { verify, getVerifyDetail } from '@/api/ordermanagement/price'

export default {
  name: 'PriceAudit',
  props: {
    auditArr: Array
  },
  data() {
    return {
      auditData: {
        verifyComment: '',
        verifyStatus: '',
        subPriceVerifyList: []
      },
      auditTableData: [],
      upReasonObj: {},
      downReasonObj: {},
      verifyStatusList: [],
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      dictionary('ips_raise_price_reason').then(res => {
        res.data.forEach(item => {
          this.upReasonObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_reduce_price_reason').then(res => {
        res.data.forEach(item => {
          this.downReasonObj[item.dictKey] = item.dictValue
        })
      })
      dictionary('ips_price_audit_status').then(res => {
        this.verifyStatusList = res.data
      })
      getVerifyDetail(this.auditArr).then(res => {
        res.data.forEach(item => {
          const obj = {
            id: item.id || '',
            priceListId: item.priceListId,
            productSku: item.productSku,
            productName: item.productName,
            preAdjustSupplierId: item.preAdjustSupplierId,
            preAdjustSupplierName: item.preAdjustSupplierName,
            preAdjustPurchasePrice: item.preAdjustPurchasePrice,
            purchasePrice: item.purchasePrice,
            supplierId: item.supplierId,
            supplierName: item.supplierName,
            adjustType: item.adjustType,
            adjustReason: item.adjustReason,
            adjustComment: item.adjustComment,
            adjustImage: item.adjustImage,
            priceChange: item.priceChange
          }
          this.auditTableData.push(obj)
        })
      })
    },

    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.auditData.subPriceVerifyList = this.auditTableData
          verify(this.auditData).then(res => {
            this.$emit('close', true)
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }
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
