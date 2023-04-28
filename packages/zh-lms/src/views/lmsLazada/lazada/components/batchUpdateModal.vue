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
            <el-popover placement="right"
                        width="420"
                        trigger="click"
            >
              规则如下：
              <br>1. 调整后的价格不得低于sku平台限价。
              <br>2. 调整后的价格不得低于促销价的保本价。
              <br>3. 调价需要同时调整促销价和售价，促销价通过设置的规则生成，售价等于调价后的促销价乘以1~2之间的随机数。
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
            <el-form-item v-if="['1'].includes(price.priceUpdateType)" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="price.operator" class="w60">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="['1', '2'].includes(price.priceUpdateType)" label-width="0" class="d-inline-block" prop="amount">
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
      <div style="" class="text-end">
        <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
        <el-button :disabled="closeEnabled" size="mini" type="primary" @click="okHandle">确 定</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="导入更新指定价/指定库存" name="import">
      <batchUpdateImport :selected-ids="selectedIds" @close="(state) => $parent.$emit('close', state)" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { batchUpdateByFile } from '@/api/lazada/lazadaList.js'
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
      priceTypeList: { 1: '按总价金额', 2: '指定价格为' },
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
      const { priceParam, stockParam } = this.okEnabled()
      return !(priceParam || stockParam)
    }
  },
  methods: {
    okEnabled() {
      let priceParam
      let stockParam
      if (this.price.priceUpdateType === '2' && this.price.amount) {
        priceParam = this.price.amount
      } else if (this.price.priceUpdateType === '1' && this.price.amount) {
        priceParam = this.operator[this.price.operator] + this.price.amount
      }

      if (this.stock.stockUpdateType === '2' && this.stock.stock) {
        stockParam = this.stock.stock
      } else if (this.stock.stockUpdateType === '1' && this.stock.stock) {
        stockParam = this.operator[this.stock.operator] + this.stock.stock
      }
      return { priceParam, stockParam }
    },
    okHandle() {
      this.$confirm('请确认是否要按配置条件更新listing价格或库存！若为spu listing，则所有子sku会按照相同条件去更新。', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const { priceParam, stockParam } = this.okEnabled()
        batchUpdateByFile({
          feedType: '1',
          feedPlatform: 'LZ',
          priceParam,
          stockParam,
          ids: this.selectedIds
        }).then(res => {
          this.$message.success('批量更新价格/库存成功')
          this.$parent.$emit('close', true)
        }).finally(() => {
          this.loading = false
        })
      }).catch(() => {})
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
