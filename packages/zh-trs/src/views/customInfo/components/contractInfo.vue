<template>
  <el-form ref="form" :model="form" size="mini" :label-width="labelWidth" class="demo-form-inline form-col">
    <el-row :gutter="170">
      <el-col :span="12">
        <!-- <el-card class="box-card" border style="width:590px;"> -->
        <el-row style="left:2px;">
          <el-form-item v-loading="form.contractLoading <1"
                        label="卖方名称(中)"
                        prop="sellerNameCn"
                        :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '卖方名称(中)不能为空', trigger: 'blur' }]:[]"
          >
            <el-input v-model="form.sellerNameCn" placeholder="" :disabled="readOnly" class="declareInput" />
          </el-form-item>
        </el-row>
        <el-row style="left:2px;">
          <el-form-item v-loading="form.contractLoading <1"
                        label="卖方名称(英)"
                        prop="sellerNameEn"
                        :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '卖方名称(英)不能为空', trigger: 'blur' }]:[]"
          >
            <el-input v-model="form.sellerNameEn" placeholder="" :disabled="readOnly" class="declareInput" />
          </el-form-item>
        </el-row>
        <el-row style="left:2px;">
          <el-form-item v-loading="form.contractLoading <1"
                        label="卖方地址(中)"
                        prop="sellerAddrCn"
                        :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '卖方地址(中)不能为空', trigger: 'blur' }]:[]"
          >
            <el-input v-model="form.sellerAddrCn" placeholder="" :disabled="readOnly" class="declareInput" />
          </el-form-item>
        </el-row>
        <el-row style="left:2px;">
          <el-form-item v-loading="form.contractLoading <1"
                        label="卖方地址(英)"
                        prop="sellerAddrEn"
                        :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '卖方地址(英)不能为空', trigger: 'blur' }]:[]"
          >
            <el-input v-model="form.sellerAddrEn" placeholder="" :disabled="readOnly" class="declareInput" />
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="flex-end" style="left:2px;">
          <el-col>
            <el-form-item v-loading="form.contractLoading <1"
                          label="卖方电话"
                          prop="sellerTel"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '卖方电话不能为空', trigger: 'blur' }]:[]"
            >
              <el-input v-model="form.sellerTel" placeholder="" :disabled="readOnly" />
            </el-form-item>
          </el-col>
          <el-col style="padding-left: 5px;">
            <el-form-item v-loading="form.contractLoading <1"
                          label="卖方传真"
                          prop="sellerFax"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '卖方传真不能为空', trigger: 'blur' }]:[]"
            >
              <el-input v-model="form.sellerFax" placeholder="" :disabled="readOnly" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="flex-end" style="left:2px;">
          <el-col>
            <el-form-item v-loading="form.contractLoading <1"
                          label="发票箱单日期"
                          prop="invoiceBoxBillDate"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '发票箱单日期不能为空', trigger: 'blur' }]:[]"
            >
              <el-tooltip :disabled="!form.invoiceBoxBillDate" effect="dark" :content="form.invoiceBoxBillDate" placement="top">
                <el-date-picker
                  v-model="form.invoiceBoxBillDate"
                  type="datetime"
                  placeholder=""
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="g-w100"
                  :disabled="readOnly||type==='modify'"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col style="padding-left: 5px;">
            <el-form-item v-loading="form.contractLoading <1"
                          label="合同签订时间"
                          prop="contractSignDate"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '合同签订时间不能为空', trigger: 'blur' }]:[]"
            >
              <el-tooltip :disabled="!form.contractSignDate" effect="dark" :content="form.contractSignDate" placement="top">
                <el-date-picker
                  v-model="form.contractSignDate"
                  type="datetime"
                  placeholder=""
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="g-w100"
                  :disabled="readOnly||type==='modify'"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- </el-card> -->
      </el-col>
      <el-col :span="12">
        <!-- <el-card class="box-card" border style="width:566px;"> -->
        <el-row style="left:-83px;">
          <el-form-item v-loading="form.contractLoading <1"
                        label="买方名称(英)"
                        prop="buyerNameEn"
                        :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '买方名称不能为空', trigger: 'blur' }]:[]"
          >
            <el-input v-model="form.buyerNameEn" placeholder="" :disabled="readOnly" class="declareInput" />
          </el-form-item>
        </el-row>
        <el-row style="left:-83px;">
          <el-form-item v-loading="form.contractLoading <1"
                        label="买方地址(英)"
                        prop="buyerAddrEn"
                        :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '买方地址不能为空', trigger: 'blur' }]:[]"
          >
            <el-input v-model="form.buyerAddrEn" placeholder="" :disabled="readOnly" class="declareInput" />
          </el-form-item>
        </el-row>
        <el-row style="left:-83px;">
          <el-form-item v-loading="form.contractLoading <1" label="SHIPTO" prop="shipTo">
            <el-input v-model="form.shipTo" placeholder="" :disabled="readOnly" class="declareInput" />
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="flex-end" style="left:-83px;">
          <el-col>
            <el-form-item v-loading="form.contractLoading <1"
                          label="买方电话"
                          prop="buyerTel"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '买方电话不能为空', trigger: 'blur' }]:[]"
            >
              <el-input v-model="form.buyerTel" placeholder="" :disabled="readOnly" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-loading="form.contractLoading <1"
                          label="买方传真"
                          prop="buyerFax"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '买方传真不能为空', trigger: 'blur' }]:[]"
            >
              <el-input v-model="form.buyerFax" placeholder="" :disabled="readOnly" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="flex-end" style="left:-83px;top:47px;">
          <el-col>
            <el-form-item v-loading="form.contractLoading <1"
                          label="FOB出口起运地"
                          prop="fobExportStartPlace"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: 'FOB出口起运地不能为空', trigger: 'blur' }]:[]"
            >
              <el-tooltip :disabled="!form.fobExportStartPlace" effect="dark" :content="form.fobExportStartPlace" placement="top">
                <el-input v-model="form.fobExportStartPlace" placeholder="" :disabled="readOnly" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-loading="form.contractLoading <1"
                          label="到达日期"
                          prop="arrivalDate"
                          :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '到达日期不能为空', trigger: 'blur' }]:[]"
            >
              <el-input v-model="form.arrivalDate" placeholder="" :disabled="readOnly" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- </el-card> -->
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
// import { deepClone } from '@/util/util'
export default {
  name: 'ContractInfo',
  props: {
    type: String,
    status: Number,
    labelWidth: {
      type: String,
      default: '120px'
    },
    baseProductInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      },
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
  created() {
    this.form = this.baseProductInfo.contractInvoiceBoxBill
    console.log('this.baseProductInfo.contractInvoiceBoxBill: ', this.baseProductInfo.contractInvoiceBoxBill)
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep .el-card.is-always-shadow{
//   border:1px solid grey;
// }
.demo-form-inline{
  width: 90%;
}
::v-deep .el-input__inner{
 width:145px;
}
.el-cate-dropdown-list{
  max-height: 285px;
  overflow-y: auto;
}
::v-deep .declareInput .el-input__inner{
  width:415px;
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
.w549{
  width:549px;
}
</style>
