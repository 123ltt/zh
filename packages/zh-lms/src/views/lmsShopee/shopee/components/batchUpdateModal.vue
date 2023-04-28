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
            <el-popover placement="right" width="420" trigger="click">
              规则如下：
              <br>1. 调整后的价格不得低于sku平台限价
              <br>2. 调整后的价格不论是原价还是活动价，不得低于保本价。
              <br>3. 活动中的listing，原价不能修改，非活动中的listing原价可改。
              <br>4. 修改后的活动价不能高于原价。
              <br>5. 非在线状态不存在活动价。
              <el-button slot="reference" type="primary" size="mini">查看调价规则</el-button>
            </el-popover>
          </div>
          <div class="d-flex mt-3">
            <span class="el-form-item__label item__label1">更新方式</span>
            <el-form-item label-width="0" class="d-inline-flex me-2" prop="typeOne">
              <el-select v-model="price.typeOne" class="w100">
                <el-option v-for="(k, v) in productStatus===1?drafSalesTypeList:salesTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="['1','2'].includes(price.typeOne)" label-width="0" class="d-inline-flex me-2" prop="updateType">
              <el-select v-model="price.updateType" class="w150">
                <el-option v-for="(k, v) in productStatus===1?priceTypeListDraf:priceTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="['1', '2'].includes(price.updateType)" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="price.operator" class="w60">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="price.updateType === '2'" label-width="0" class="d-inline-block" prop="numeric">
              <el-input-number v-model="price.numeric" v-input.positive :max="50" label="请输入" />%
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
            <el-form-item v-if="['1'].includes(stock.updateType)" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="stock.operator" class="w60">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
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
        <el-button :disabled="closeEnabled" size="small" type="primary" @click="ifViewport">确 定</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane v-if="productStatus === 5" label="导入更新指定价/指定库存" name="import">
      <batchUpdateImport :selected-ids="selectedIds" :variant-ids="variantIds" @close="$parent.$emit('close')" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import { batchPrice, batchQuantity, batchUpdateByFile } from '@/api/amazon/amazon.js'
import { batchPrice, batchQuantity, batchUpdateByFile } from '@/api/shopee/shopee.js'
import { toFixed2 } from '@/views/lmsAmazon/amazon/components/addListing.handle.js'
import batchUpdateImport from './batchUpdateImport.vue'
import ImproveBatch from './improveBatch_.vue'
export default {
  name: 'BatchUpdateModal',
  components: { batchUpdateImport },
  props: {
    selectedIds: Array,
    variantIds: Array,
    productStatus: Number
  },
  data() {
    return {
      loading: false,
      toFixed2,
      activeName: 'updateCondition',
      drafSalesTypeList: { 2: '原价' },
      salesTypeList: { 1: '活动价', 2: '原价' },
      priceTypeList: { 1: '按总价金额', 2: '按总价比例', 3: '指定价格为' }, // 在线
      priceTypeListDraf: { 1: '按总价金额', 3: '指定价格为' }, // 草稿
      stockTypeList: { 1: '增加/减少库存', 2: '指定库存为' },
      operator: { 1: '+', 2: '-' }, // 运算符
      price: {
        updateType: '', // 价格更新方式
        operator: '1', // 价格运算符
        numeric: '',
        typeOne: ''
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
  mounted() {
  },
  methods: {
    okEnabled() {
      let ebayPriceUpdateDTO
      let ebayStockUpdateDTO
      if ((this.price.updateType === '3' && this.price.numeric) || (['1', '2'].includes(this.price.updateType) && (this.price.numeric || this.price.numeric))) {
        ebayPriceUpdateDTO = this.price
      }
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
        const type = this.price
        let tempPrice = ''
        // this.filterNum(this.price)
        // priceParam = { feedType: this.price.updateType, value: +this.price.numeric }
        tempPrice = type.operator === '2' ? `${this.operator[type.operator]}${type.numeric}` : type.updateType === '3' ? type.numeric : `${this.operator[type.operator]}${type.numeric}`
        if (type.updateType === '2') tempPrice = tempPrice + '%'
        priceParam = {
          type: this.price.typeOne,
          price: tempPrice
        }
      }
      if (this.stock.updateType) {
        const type = this.stock
        // stockParam = { feedType: this.stock.updateType, value: +this.stock.numeric }
        stockParam = type.operator === '2' ? `${this.operator[type.operator]}${type.numeric}` : type.updateType === '2' ? type.numeric : `${this.operator[type.operator]}${type.numeric}`
      }
      return { priceParam, stockParam }
    },
    ifViewport() {
      this.$confirm('请确认是否要按条件更新listing价格或库存！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.okHandle()
      }).catch(e => {
        console.log(e)
      })
    },
    okHandle() {
      this.loading = true
      const variantIds = this.variantIds?.length ? this.variantIds.map(item => item.id) : []
      if (this.productStatus === 1) { // Draft-草稿
        const { ebayPriceUpdateDTO, ebayStockUpdateDTO } = this.okEnabled()
        // this.$set(ebayPriceUpdateDTO, 'numeric', ebayPriceUpdateDTO.updateType === '2' ? ebayPriceUpdateDTO.numeric + '%' : ebayPriceUpdateDTO.numeric) // 数据有比例时加上%(百分号)
        // 价格&库存共用数据
        const ids = {
          shopeeListingId: this.selectedIds,
          shopeeVariantId: this.variantIds
        }
        if (ebayPriceUpdateDTO && ebayPriceUpdateDTO.updateType) {
          this.filterNum(ebayPriceUpdateDTO, 'price')
          batchPrice(Object.assign({ numeric: ebayPriceUpdateDTO.numeric }, ids)).then(res => {
            if (res.data.length) {
              this.batchPriceModal(res.data)
            } else {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            }
          })
        }
        if (ebayStockUpdateDTO && ebayStockUpdateDTO.updateType) {
          this.filterNum(ebayStockUpdateDTO, 'stock')
          // const numeric = ebayStockUpdateDTO.numeric
          batchQuantity(Object.assign({ numeric: ebayStockUpdateDTO.numeric }, ids)).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      } else { // online-在线
        const { priceParam, stockParam } = this.onlineOkEnabled()
        this.batchUpdateByFile(priceParam, stockParam, variantIds)
      }
    },
    // online 调用公共的接口
    batchUpdateByFile(priceParam, stockParam, variantIds) {
      batchUpdateByFile({
        feedPlatform: 'SP',
        feedType: '1',
        ids: this.selectedIds, // listing主键ID
        priceParam: JSON.stringify(priceParam),
        stockParam: stockParam
      }).then(res => {
        this.$message.success('批量更新价格/库存成功')
        this.$parent.$emit('close', true)
      }).finally(() => {
        this.loading = false
        this.$parent.$emit('close')
      })
    },
    filterNum(type, imp) {
      if (imp === 'price') { // 如果是价格 则将指定价格的类型 前面运算符+/-去掉，其他类型加上 运算符 +/-
        type.numeric = type.operator === '2' ? `${this.operator[type.operator]}${type.numeric}` : type.updateType === '3' ? type.numeric : `${this.operator[type.operator]}${type.numeric}`
      } else if (imp === 'stock') { // 如果是库存 则将指定价格的类型 前面运算符+/-去掉，其他类型加上 运算符 +/-
        type.numeric = type.operator === '2' ? `${this.operator[type.operator]}${type.numeric}` : type.updateType === '2' ? type.numeric : `${this.operator[type.operator]}${type.numeric}`
      } else {
        type.numeric = type.operator === '2' ? `${this.operator[type.operator]}${type.numeric}` : type.numeric
      }
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
.w100{
  width: 100px;
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
