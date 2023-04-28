<template>
  <!-- 仓库信息新增 -->
  <el-form ref="rulesForm" :model="openData" label-width="110px" size="mini">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item prop="warehouseId" label="仓库名称" :rules="{ required: true, message: '仓库名称不能为空', trigger: 'change' }">
          <el-select
            ref="input"
            v-model="openData.warehouseId"
            :disabled="!isAdd"
            clearable
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productSku" label="产品编码" :rules="{ required: true, message: '请输入产品编码', trigger: 'blur' }">
          <el-input v-model="openData.productSku" clearable :disabled="!isAdd" placeholder="请输入" @input="toget" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productName" label="产品名称">
          <el-input v-model="productName" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="categoryName" label="产品类目">
          <el-input v-model="categoryName" disabled placeholder="由产品编码自动生成" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="purCost" label="采购成本" :rules="{ required: true, message: '请输入采购成本', trigger: 'blur' }">
          <el-input v-model="openData.purCost" v-input.positive maxlength="9" clearable placeholder="请输入" style="width: 60%" @input="changePurCost" />
          <el-select v-model="openData.purCostCurrency" placeholder="请选择" style="width:40%">
            <el-option v-for="item in currencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item prop="purCost" label="包装费" :rules="{ required: true, message: '请输入包装费', trigger: 'blur' }">
          <el-select v-model="openData.packCostType" placeholder="请选择" style="width:32%">
            <el-option v-for="item in costTypeList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
          <el-input v-model="openData.packCost" v-input.positive maxlength="9" clearable placeholder="请输入" style="width: 40%" @input="changePackCost" />
          <template v-if="2 == openData.packCostType">
            <label>%</label>
          </template>
          <template v-else>
            <el-select v-model="openData.packCostCurrency" placeholder="请选择" style="width:28%">
              <el-option v-for="item in currencyList" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item prop="purCost" label="仓储操作费" :rules="{ required: true, message: '请输入仓储操作费', trigger: 'blur' }">
          <el-select v-model="openData.storageOpType" placeholder="请选择" style="width:32%">
            <el-option v-for="item in costTypeList" :key="item.value" :label="item.dictValue" :value="item.dictKey" />
          </el-select>
          <el-input v-model="openData.storageCost" v-input.positive maxlength="9" clearable placeholder="请输入" style="width: 40%" @input="changeStorageCost" />
          <template v-if=" openData.storageOpType ==2">
            <label>%</label>
          </template>
          <template v-else>
            <el-select v-model="openData.storageOpCurrency" placeholder="请选择" style="width:28%">
              <el-option v-for="item in currencyList" :key="item.value" :label="item.dictValue" :value="item.dictKey" />
            </el-select>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item style="text-align: right;padding-right: 20px;">
          <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">{{ isAdd?'保存':'修改' }}</el-button>
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>
</template>

<script>

import { update, save } from '@/api/product/productcost.js'
import { getSkuInfoBySku, getMyDictBiz } from '@/api/commonApi.js'
export default {
  name: 'ProductCostAdd',
  props: {
    isAdd: Boolean,
    openData: Object,
    warehouseList: Array
  },
  data() {
    return {
      productName: '',
      categoryName: '',
      loading: false,
      costTypeList: [],
      currencyList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.rulesForm.clearValidate() // 先清空校验
    })
    this.dealWith()
  },
  methods: {
    toget(val) {
      getSkuInfoBySku(val).then(res => {
        const data = res.data
        if (data) {
          this.flg = true
          this.categoryName = data.categoryName
          this.productName = data.productName
        } else {
          this.flg = false
          this.categoryName = ''
          this.productName = ''
        }
      })
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            save(this.openData).then(() => {
              this.$parent.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }, error => {
              window.console.log(error)
            })
          } else {
            update(this.openData).then(() => {
              this.$parent.$emit('close')
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }, error => {
              window.console.log(error)
            })
          }
        }
      })
    },
    // 编辑处理
    dealWith() {
      this.loading = true
      getMyDictBiz('pps_comon_cost_type').then(res => {
        this.costTypeList = res.data
      })
      getMyDictBiz('pps_account_currency').then(res => {
        this.currencyList = res.data
      })
      if (!this.isAdd) {
        this.toget(this.openData.productSku)
        this.openData.warehouseId = this.openData.warehouseId + ''
        this.openData.purCostCurrency = this.openData.purCostCurrency + ''
        this.openData.packCostType = this.openData.packCostType + ''
        this.openData.packCostCurrency = this.openData.packCostCurrency + ''
        this.openData.storageOpType = this.openData.storageOpType + ''
        this.openData.storageOpCurrency = this.openData.storageOpCurrency + ''
        this.loading = false
      }
    },
    changePurCost(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.purCost = this.oldValue
      } else {
        this.oldValue = val
      }
    },
    changePackCost(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.packCost = this.oldValue
      } else {
        this.oldValue = val
      }
    },

    changeStorageCost(val) {
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > 2) {
        this.openData.storageCost = this.oldValue
      } else {
        this.oldValue = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }

.divider{
  display: inline-block;
  width: 10%;
  text-align: center;
  color: #c4c7cf;
}

.redStar{
  color: red;
  font-size: 12px;
}
</style>
