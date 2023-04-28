<template>
  <el-tabs v-model="activeName" v-loading="loading">
    <el-tab-pane label="按条件更新" name="updateCondition">
      <el-form ref="updateCondition"
               size="mini"
               class="sp-form form-col"
      >
        <div class="mb-30">
          <div>
            <span class="me-3 fs-5">价格更新</span>
            <el-popover placement="bottom"
                        width="420"
                        trigger="click"
            >
              规则如下：
              <br>1. 调整后的价格不得低于sku平台限价。
              <br>2. 调整后的listing价格不得低于原价的30%
              <el-button slot="reference" type="primary" size="mini">查看调价规则</el-button>
            </el-popover>
          </div>
          <div class="d-flex mt-3">
            <span class="el-form-item__label item__label1">更新方式</span>
            <el-form-item label-width="0" class="d-inline-flex me-2" prop="priceUpdateType">
              <el-select v-model="price.priceUpdateType" class="w150">
                <el-option v-for="(k, v) in priceTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="['1', '2'].includes(price.priceUpdateType)" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="price.operator" class="w60">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="price.priceUpdateType === '2'" label-width="0" class="d-inline-block" prop="proportion">
              <el-input v-model="price.proportion"
                        v-input.positive
                        class="w60 me-2"
                        placeholder="请输入"
                        @input="() => {price.proportion = toFixed2(price.proportion)}"
              />%
            </el-form-item>
            <el-form-item v-if="['1', '3'].includes(price.priceUpdateType)" label-width="0" class="d-inline-block" prop="amount">
              <el-input v-model="price.amount"
                        v-input.positive
                        class="w210"
                        placeholder="请输入金额（需为站点币种金额）"
                        @input="() => {price.amount = toFixed2(price.amount)}"
              />
            </el-form-item>
          </div>
        </div>
        <div class="mb-30">
          <div class="fs-5">库存更新</div>
          <div class="d-flex mt-3">
            <span class="el-form-item__label item__label1">更新方式</span>
            <el-form-item label-width="0" class="d-inline-block me-2" prop="stockUpdateType">
              <el-select v-model="stock.stockUpdateType" class="w150">
                <el-option v-for="(k, v) in stockTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="stock.stockUpdateType === '1'" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="stock.operator" class="w60">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="stock.stockUpdateType" label-width="0" class="d-inline-block" prop="stock">
              <el-input v-model="stock.stock" v-input.positive.numeric class="w210" placeholder="请输入整数" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div style="padding-bottom: 20px;text-align: right;margin-top: 20px;margin-right: 30px">
        <span class="el-button el-button--default el-button--medium" @click="$parent.$emit('close')">
          <span>取消</span>
        </span>
        <el-button :disabled="closeEnabled" size="small" type="primary" @click="okHandle">确 定</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="productStatus === 5" label="导入更新指定价/指定库存" name="import">
      <batchUpdateImport :selected-ids="selectedIds" @close="(state) => $parent.$emit('close', state)" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { batchUpdatePriceStock } from '@/api/ebay/ebay.js'
import { toFixed2 } from '@/views/lmsAmazon/amazon/components/addListing.handle.js'
import batchUpdateImport from './batchUpdateImport.vue'
export default {
  name: 'BatchUpdateModal',
  components: { batchUpdateImport },
  props: {
    selectedIds: Array,
    productStatus: Number
  },
  data() {
    return {
      loading: false,
      toFixed2,
      activeName: 'updateCondition',
      priceTypeList: { 1: '按总价金额', 2: '按总价比例', 3: '指定价格为' },
      stockTypeList: { 1: '增加/减少库存', 2: '指定库存为' },
      operator: { 1: '+', 2: '-' }, // 运算符
      price: {
        priceUpdateType: '', // 价格更新方式
        operator: '1', // 价格运算符
        proportion: '', // 修改比例
        amount: ''
      },
      rules: {},
      stock: {
        stockUpdateType: '', // 库存更新方式
        operator: '1', // 库存运算符
        stock: ''
      }
    }
  },
  computed: {
    closeEnabled() {
      const { ebayPriceUpdateDTO, ebayStockUpdateDTO } = this.okEnabled()
      return !(ebayPriceUpdateDTO || ebayStockUpdateDTO)
    }
  },
  methods: {
    okEnabled() {
      let ebayPriceUpdateDTO
      let ebayStockUpdateDTO
      if ((this.price.priceUpdateType === '3' && this.price.amount) || (['1', '2'].includes(this.price.priceUpdateType) && (this.price.amount || this.price.proportion))) {
        ebayPriceUpdateDTO = this.price
      }
      if ((this.stock.stockUpdateType === '2' && this.stock.stock) || (this.stock.stockUpdateType === '1' && this.stock.stock && this.stock.stock)) {
        ebayStockUpdateDTO = this.stock
      }
      return { ebayPriceUpdateDTO, ebayStockUpdateDTO }
    },
    okHandle() {
      this.loading = true
      const { ebayPriceUpdateDTO, ebayStockUpdateDTO } = this.okEnabled()
      batchUpdatePriceStock({
        ebayPriceUpdateDTO,
        ebayStockUpdateDTO,
        listingIds: this.selectedIds,
        productStatus: this.productStatus
      }).then(res => {
        this.$message.success('批量更新价格/库存成功')
        this.$parent.$emit('close', true)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
  color: $--color-black
}
.w60{
  width: 60px;
}
.w150{
  width: 150px;
}
.w210{
  width: 210px;
}
.mb-30{
  margin-bottom: 30px;
}
.item__label1{
  line-height: 28px;
}
</style>
