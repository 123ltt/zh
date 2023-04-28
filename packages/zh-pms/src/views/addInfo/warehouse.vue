<template>
  <div class="spuLogistics">
    <el-form ref="formRef"
             :model="form"
             :disabled="disabled"
             size="mini"
             label-width="120px"
             class="info-form"
             :class="{'form-readonly':disabled}"
    >
      <el-row>
        <el-col>
          <el-form-item label="备货数据">
            <g-table :fetch="fetch" :headers="headers" :fixed-height="false" :page-show="false" immediate />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="质检标准" prop="qcType">
            <el-select v-model="form.qcType">
              <el-option v-for="el in qcOptions" :key="el.value" :label="el.label" :value="+el.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <display-field-group v-model="chekcedAttrList" :items="form.lstAttr" uid-field="fieldId" @change="fieldChange" />
    </el-form>
  </div>
</template>

<script>
import { update, getStock } from '@/api/skuWarehouse'
import { getDict } from '@/api/common/dict'
import DisplayFieldGroup from '@/components/display-field-group/index.vue'

export default {
  name: 'SpuWarehouse',
  components: { DisplayFieldGroup },
  props: {
    formData: Object,
    readonly: Boolean,
    isAudit: Boolean,
    spu: String
  },
  data() {
    return {
      form: this.formData || {},
      chekcedAttrList: [],
      headers: [
        { label: '仓库名称', prop: 'warehouseName' },
        {
          label: '库存总量',
          prop: 'totalStock',
          formatter({ purchasingStock, intransitStock, availableStock, freezeStock, reserveStock, inWarehouseStock }) {
            return purchasingStock + intransitStock + availableStock + freezeStock + reserveStock + inWarehouseStock
          }
        },
        { label: '采购中库存', prop: 'purchasingStock' },
        { label: '在途库存', prop: 'intransitStock' },
        { label: '可用库存', prop: 'availableStock' },
        { label: '冻结库存', prop: 'freezeStock' },
        { label: '备用库存', prop: 'reserveStock' },
        { label: '在库库存', prop: 'inWarehouseStock' },
        { label: '库位号', prop: 'locationCode', minWidth: 120 }
      ],
      qcOptions: []
    }
  },
  computed: {
    disabled() {
      // return this.readonly || this.formData.ifCanUpdate === false
      return true
    }
  },
  created() {
    this.getDict()
  },
  methods: {
    getDict() {
      getDict('qc_type', 'pms').then(list => {
        this.qcOptions = list
      })
    },
    fetch() {
      return getStock(this.spu).then(({ data }) => {
        data ||= []
        return {
          records: data,
          total: data.length,
          size: data.length
        }
      })
    },
    save() {
      update(this.form).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$emit('cloesDialog')
      }, error => {
        window.console.log(error)
      })
    },
    fieldChange(mapping) {
      this.form = Object.assign({}, this.form, mapping)
    }
  }
}
</script>
