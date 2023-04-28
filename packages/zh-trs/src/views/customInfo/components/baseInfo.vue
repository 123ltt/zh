<template>
  <el-form ref="form" :model="form" :rules="rules" size="mini" :label-width="labelWidth" class="demo-form-inline form-col">
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.baseLoading <1" label="合同协议号" prop="contractAgreementNo">
          <el-input v-model="form.contractAgreementNo" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1" label="项号" prop="itemNo">
          <el-input v-model="form.itemNo" placeholder="" disabled />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="成交方式"
                      prop="tradeWay"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '成交方式不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.tradeWay" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1" label="出口日期" prop="exportDate">
          <!-- <el-input v-model="form.exportDate" placeholder="" :disabled="readOnly" /> -->
          <el-date-picker
            v-model="form.exportDate"
            type="datetime"
            placeholder=""
            value-format="yyyy-MM-dd HH:mm:ss"
            class="g-w100"
            :disabled="readOnly"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="境外收货人"
                      prop="domesticConsignor"
                      :rules="status===1&&type==='preReport' ? [{ required: true, message: '境外收货人不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.domesticConsignor" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="币制"
                      prop="currency"
                      :rules="status===1&&type==='preReport' ? [{ required: true, message: '币制不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.currency" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="贸易国(地区)"
                      prop="tradeCountry"
                      :rules="status===1&&type==='preReport' ? [{ required: true, message: '贸易国不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.tradeCountry" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="运抵国(地区)"
                      prop="arrivalCountry"
                      :rules="status===1&&type==='preReport' ?[{ required: true, message: '运抵国不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.arrivalCountry" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="指运港"
                      prop="transportPort"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '指运港不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.transportPort" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="最终目的国(地区)"
                      prop="purposeCountry"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '最终目的国不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.purposeCountry" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="原产国(地区)"
                      prop="originProductCountry"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '原产国不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.originProductCountry" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="境内发货人"
                      prop="domesticConsignor"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '境内发货人不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.domesticConsignor" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="征免性质"
                      prop="exempteNature"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '征免性质不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.exempteNature" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="境内货源地"
                      prop="domesticSupplyPlace"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '境内货源地不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.domesticSupplyPlace" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="监管方式"
                      prop="superviseWay"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '监管方式不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.superviseWay" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="包装种类"
                      prop="packageType"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '包装种类不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.packageType" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="生产销售单位"
                      prop="produceSaleUnit"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '生产销售单位不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.produceSaleUnit" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1"
                      label="征免"
                      prop="exempte"
                      :rules="(status===1&&['preReport','batchPreReport'].includes(type)) ? [{ required: true, message: '征免不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.exempte" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1" label="运费" prop="transportCost">
          <el-input v-model="form.transportCost" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.baseLoading <1" label="保费" prop="premium">
          <el-input v-model="form.premium" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
// import { deepClone } from '@/util/util'
export default {
  name: 'BaseInfo',
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
      warehouseList: [],
      cateSearchLoading: false,
      cateSearchLoading2: false,
      cateSearchList: [],
      cateSearchList2: [],
      form: {

      },
      rules: {

      }
    }
  },
  computed: {
    readOnly() {
      return this.type === 'isView'
    }
  },
  created() {
    this.form = this.baseProductInfo.declareCustomsBill ? this.baseProductInfo.declareCustomsBill : {}
  },
  mounted() {

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
