<template>
  <el-form ref="form" :model="form" size="mini" :label-width="labelWidth" class="demo-form-inline form-col">
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="采购编码" prop="purchaseCode">
          <el-input v-model="form.purchaseCode" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="含税采购单价" prop="includeTaxPurchasPrice">
          <el-input v-model="form.includeTaxPurchasPrice" placeholder="" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1"
                      label="汇率"
                      prop="exchangeRate"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '汇率不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.exchangeRate" placeholder="" :disabled="readOnly" @change="exchangeRateChange" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1"
                      label="产品单个净重(g)"
                      prop="singleWeight"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '产品单个净重不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.singleWeight" placeholder="" :disabled="readOnly" @change="singleWeightChange" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="净重(Kg)" prop="netWeight">
          <el-input v-model="form.netWeight" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="进项税率" prop="incomeRateStr">
          <el-input v-model="form.incomeRateStr" placeholder="" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="单价(USD)" prop="unitPriceUsd">
          <el-input v-model="form.unitPriceUsd" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="总价(USD)" prop="totalPriceUsd">
          <el-input v-model="form.totalPriceUsd" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="需求单号" prop="demandOrder">
          <el-input v-model="form.demandOrder" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="采购员" prop="purchasePeople">
          <el-input v-model="form.purchasePeople" placeholder="" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="SKU编码" prop="productSku">
          <el-input v-model="form.productSku" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="申报品名" prop="declareProductName">
          <el-input v-model="form.declareProductName" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1"
                      label="品牌"
                      prop="brand"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '品牌不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.brand" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1"
                      label="型号"
                      prop="modelNo"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '型号不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.modelNo" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1"
                      label="HS编码"
                      prop="hsCode"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: 'HS编码不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.hsCode" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="退税率" prop="rebateRateStr">
          <el-input v-model="form.rebateRateStr" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.purchaseLoading <1" label="供应商全称" prop="supplierFullName">
          <el-tooltip :disabled="!form.supplierFullName" effect="dark" :content="form.supplierFullName" placement="top">
            <el-input v-model="form.supplierFullName" placeholder="" disabled />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col />
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col :span="12">
        <el-form-item v-loading="form.purchaseLoading <1"
                      label="申报要素"
                      prop="declareElement"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '申报要素不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.declareElement" effect="dark" :content="form.declareElement" placement="top">
            <el-input v-model="form.declareElement" placeholder="" :disabled="readOnly" class="declareElementInput" />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
// import { deepClone } from '@/util/util'
export default {
  name: 'PurchaseInfo',
  props: {
    type: String,
    status: Number,
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 产品详细信息
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      warehouseList: [],
      cateSearchLoading: false,
      cateSearchLoading2: false,
      cateSearchList: [],
      cateSearchList2: [],
      form: {

      }
    }
  },
  computed: {
    readOnly() {
      return this.type === 'isView'
    }
  },
  mounted() {
    this.form = this.baseProductInfo.purchaseProduct
  },
  methods: {
    // 汇率改变 单价=含税采购单价*（1+2%）/汇率
    // 单价改变 总价=单价*数量
    exchangeRateChange() {
      if (this.type !== 'batchModify') { // 批量修改的时候不联动
        this.form.unitPriceUsd = this.form.includeTaxPurchasPrice * 1.2 / this.form.exchangeRate
        this.form.totalPriceUsd = this.form.unitPriceUsd * this.form.quantity
      }
    },
    // 单个产品净重改变 净重=单个产品净重*数量/1000
    singleWeightChange() {
      if (this.type !== 'batchModify') { // 批量修改的时候不联动
        this.form.netWeight = this.form.singleWeight * this.form.quantity / 1000
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline{
  width: 90%;
}
::v-deep .el-input__inner{
  width:145px;
}

::v-deep .declareElementInput .el-input__inner{
  width:685px;
}

.el-cate-dropdown-list{
  max-height: 285px;
  overflow-y: auto;
}
.cate-cascader{
  width: 42px !important;
}
.cate{
  position: relative;
}
.no-border{
  ::v-deep input{
    border: 0;
  }
}
.cate-change{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
  opacity: 0;
}
.h28{
  height: 28px
}
</style>
