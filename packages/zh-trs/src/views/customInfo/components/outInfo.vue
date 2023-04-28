<template>
  <el-form ref="form" :model="form" size="mini" :label-width="labelWidth" class="demo-form-inline form-col">
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="件数"
                      prop="packageQuantity"
                      :rules="(status===1&&['preReport','batchPreReport','doubleCheck'].includes(type)) ? [{ required: true, message: '件数不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.packageQuantity" placeholder="" :disabled="['batchModify','isView'].includes(type)" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="毛重（Kg）"
                      prop="grossWeight"
                      :rules="(status===1&&['preReport','batchPreReport','doubleCheck'].includes(type)) ? [{ required: true, message: '毛重不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.grossWeight" placeholder="" :disabled="['batchModify','isView'].includes(type)" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="运输方式"
                      prop="transport"
                      :rules="(status===1&&['preReport','batchPreReport','doubleCheck'].includes(type)) ? [{ required: true, message: '运输方式不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.transport" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="目的仓"
                      prop="targetWarehouse"
                      :rules="status===2&&type==='doubleCheck' ? [{ required: true, message: '目的仓不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.targetWarehouse" placeholder="" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" style="left:2px;">
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="出库单号"
                      prop="outputWarehouseOrder"
                      :rules="status===2&&type==='doubleCheck' ? [{ required: true, message: '出库单号不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.outputWarehouseOrder" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="货件编号"
                      prop="goodsCode"
                      :rules="status===2&&type==='doubleCheck' ? [{ required: true, message: '货代编号不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.goodsCode" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="货代公司"
                      prop="freightForwardCompany"
                      :rules="(status===1&&['preReport','batchPreReport','doubleCheck'].includes(type)) ? [{ required: true, message: '货代公司不能为空', trigger: 'blur' }]:[]"
        >
          <el-tooltip :disabled="!form.freightForwardCompany" effect="dark" :content="form.freightForwardCompany" placement="top">
            <el-input v-model="form.freightForwardCompany" placeholder="" :disabled="readOnly" />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item v-loading="form.outLoading <1"
                      label="物流专员"
                      prop="logisticsSpecialist"
                      :rules="status===2&&type==='doubleCheck' ? [{ required: true, message: '物流专员不能为空', trigger: 'blur' }]:[]"
        >
          <el-input v-model="form.logisticsSpecialist" placeholder="" :disabled="readOnly" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
// import { deepClone } from '@/util/util'
export default {
  name: 'OutInfo',
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

      }
    }
  },
  computed: {
    readOnly() {
      return this.type === 'isView'
    }
  },
  mounted() {
    this.form = this.baseProductInfo.outWarehouseInfo
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
