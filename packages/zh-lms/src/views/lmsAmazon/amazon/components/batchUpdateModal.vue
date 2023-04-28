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
            <el-popover placement="bottom" width="420" trigger="click">
              规则如下：
              <br>1. 调整后的价格不得低于sku平台限价
              <br>2. 价格最大值：提价金额部分不得超过原价的50%
              <br>3. 调整后的价格不能低于保本价（销售利润率为0时的价格）
              <br>4. FBA listing不能调价
              <el-button slot="reference" type="primary" size="mini">查看调价规则</el-button>
            </el-popover>
          </div>
          <div class="d-flex mt-3">
            <span class="el-form-item__label item__label1">更新方式</span>
            <el-form-item label-width="0" class="d-inline-flex me-2" prop="updateType">
              <el-select v-model="price.updateType" class="w150">
                <el-option v-for="(k, v) in priceTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="['1', '2'].includes(price.updateType)" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="price.operator" class="w60">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="price.updateType === '2'" label-width="0" class="d-inline-block" prop="numeric">
              <el-input v-model="price.numeric" v-input.positive :max="50" label="请输入" class="w60 me-2" @input="() => {price.numeric = toFixed2(price.numeric)}" />%
            </el-form-item>
            <el-form-item v-if="['1', '3'].includes(price.updateType)" label-width="0" class="d-inline-block" prop="numeric">
              <el-input v-model="price.numeric" v-input.positive class="w210" placeholder="请输入金额（需为站点币种金额）" @input="() => {price.numeric = toFixed2(price.numeric)}" />
            </el-form-item>
          </div>
        </div>
        <div class="mb-30">
          <div class="fs-5">库存更新</div>
          <div class="d-flex mt-3">
            <span class="el-form-item__label item__label1">更新方式</span>
            <el-form-item label-width="0" class="d-inline-block me-2" prop="updateType">
              <el-select v-model="stock.updateType" class="w150">
                <el-option v-for="(k, v) in stockTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="stock.updateType" label-width="0" class="d-inline-block" prop="numeric">
              <el-input v-model="stock.numeric" v-input.positive.numeric class="w210" placeholder="请输入整数" />
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
    <el-tab-pane v-if="listingStatus === 5" label="导入更新指定价/指定库存" name="import">
      <batchUpdateImport :selected-ids="selectedIds" :variant-ids="variantIds" @close="$parent.$emit('close')" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { batchPrice, batchQuantity, batchUpdateByFile } from '@/api/amazon/amazon.js'
import { toFixed2 } from './addListing.handle.js'
import batchUpdateImport from './batchUpdateImport.vue'
import ImproveBatch from './improveBatch.vue'
export default {
  name: 'BatchUpdateModal',
  components: { batchUpdateImport },
  props: {
    selectedIds: Array,
    variantIds: Array,
    listingStatus: Number
  },
  data() {
    return {
      loading: false,
      toFixed2,
      activeName: 'updateCondition',
      priceTypeList: { 1: '按总价金额', 2: '按总价比例', 3: '指定价格为' },
      stockTypeList: { 1: '增加库存', 2: '减少库存', 3: '指定库存为' },
      operator: { 1: '+', 2: '-' }, // 运算符
      price: {
        updateType: '', // 价格更新方式
        operator: '1', // 价格运算符
        numeric: ''
      },
      rules: {},
      stock: {
        updateType: '', // 库存更新方式
        operator: '1', // 库存运算符
        numeric: ''
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
      // 价格
      if ((this.price.updateType === '3' && this.price.numeric) || (['1', '2'].includes(this.price.updateType) && (this.price.numeric || this.price.numeric))) {
        ebayPriceUpdateDTO = this.price
      }
      // 库存
      if ((this.stock.updateType === '3' && this.stock.numeric) || (['1', '2'].includes(this.stock.updateType) && this.stock.numeric && this.stock.numeric)) {
        ebayStockUpdateDTO = this.stock
      }
      return { ebayPriceUpdateDTO, ebayStockUpdateDTO }
    },
    // online 数据处理
    onlineOkEnabled() {
      let priceParam
      let stockParam
      if (this.price.updateType) {
        this.filterNum(this.price)
        priceParam = { feedType: this.price.updateType, value: +this.price.numeric }
      }
      if (this.stock.updateType) {
        stockParam = { feedType: this.stock.updateType, value: +this.stock.numeric }
      }
      return { priceParam, stockParam }
    },
    okHandle() {
      this.loading = true
      const variantIds = this.variantIds.map(item => item.id)
      if (this.listingStatus === 1) { // Draft
        const { ebayPriceUpdateDTO, ebayStockUpdateDTO } = this.okEnabled()
        if (ebayPriceUpdateDTO && ebayPriceUpdateDTO.updateType) {
          this.filterNum(ebayPriceUpdateDTO)
          batchPrice({ ...ebayPriceUpdateDTO, amazonListingId: this.selectedIds }).then(res => {
            if (res.data.length) {
              this.batchPriceModal(res.data)
            } else {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            }
          })
        }
        if (ebayStockUpdateDTO && ebayStockUpdateDTO.updateType) {
          this.filterNum(ebayStockUpdateDTO)
          batchQuantity({ ...ebayStockUpdateDTO, amazonListingId: this.selectedIds }).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      } else {
        const { priceParam, stockParam } = this.onlineOkEnabled()
        this.batchUpdateByFile(priceParam, stockParam, variantIds)
      }
    },
    // online 调用公共的接口
    batchUpdateByFile(priceParam, stockParam, variantIds) {
      batchUpdateByFile({
        feedPlatform: 'AM',
        feedType: '1',
        ids: variantIds,
        priceParam: JSON.stringify(priceParam),
        stockParam: JSON.stringify(stockParam)
      }).then(res => {
        this.$message.success('批量更新价格/库存成功')
        this.$parent.$emit('close', true)
      }).finally(() => {
        this.loading = false
        this.$parent.$emit('close')
      })
    },
    filterNum(type) {
      type.numeric = type.operator === '2' ? `${this.operator[type.operator]}${type.numeric}` : type.numeric
    },
    batchPriceModal(data) {
      this.$modal({
        title: '警告',
        component: ImproveBatch,
        data: {
          tableList: data,
          params: { ids: this.checkIds, isCheck: true },
          header: ['productSku', 'sellerSku', '原因'],
          isType: 'updatePrice'
        },
        callback: () => {
          this.checked = []
          this.$parent.$emit('close')
        }
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
