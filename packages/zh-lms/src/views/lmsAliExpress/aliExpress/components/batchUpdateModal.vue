<template>
  <el-tabs v-model="activeName" v-loading="loading">
    <el-tab-pane label="按条件更新" name="updateCondition">
      <el-form ref="updateCondition"
               size="mini"
               class="sp-form form-col"
               :model="form"
               :rules="rules"
      >
        <div class="mb-30">
          <div>
            <span class="me-3 fs-5">价格更新</span>
            <el-popover placement="bottom"
                        width="420"
                        trigger="click"
            >
              规则如下：
              <br>1. 更新后的价格不得低于sku平台限价的价格
              <br>2. 更新后价格不得低于0.8本币（本币为listing对应币种）
              <br>3. 标记为手动不可调价的listing不能调价成功
              <el-button slot="reference" type="primary" size="mini">查看调价规则</el-button>
            </el-popover>
          </div>
          <div class="d-flex mt-3">
            <span class="el-form-item__label item__label1">更新方式</span>
            <el-form-item label-width="0" class="d-inline-flex me-2" prop="priceUpdateType">
              <el-select v-model="form.price.priceUpdateType" class="w150">
                <el-option v-for="(k, v) in priceTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="['1', '2'].includes(form.price.priceUpdateType)" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="form.price.operator" class="w80">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.price.priceUpdateType === '2'" label-width="0" class="d-inline-block" prop="price.proportion">
              <el-input v-model="form.price.proportion"
                        v-input.positive
                        class="w80"
                        placeholder="请输入"
                        @input="() => {form.price.proportion = toFixed2(form.price.proportion)}"
              /> %
            </el-form-item>
            <el-form-item v-if="['1', '3'].includes(form.price.priceUpdateType)" label-width="0" class="d-inline-block" prop="amount">
              <el-input v-model="form.price.amount"
                        v-input.positive
                        class="w210"
                        placeholder="请输入金额（需为站点币种金额）"
                        @input="() => {form.price.amount = toFixed2(form.price.amount)}"
              />
            </el-form-item>
          </div>
        </div>
        <div class="mb-30">
          <div class="fs-5">库存更新</div>
          <div class="d-flex mt-3">
            <span class="el-form-item__label item__label1">更新方式</span>
            <el-form-item label-width="0" class="d-inline-block me-2" prop="stockUpdateType">
              <el-select v-model="form.stock.stockUpdateType" class="w150">
                <el-option v-for="(k, v) in stockTypeList" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.stock.stockUpdateType === '1'" label-width="0" class="d-inline-block me-2" prop="operator">
              <el-select v-model="form.stock.operator" class="w80">
                <el-option v-for="(k, v) in operator" :key="v" :value="v" :label="k" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.stock.stockUpdateType" label-width="0" class="d-inline-block" prop="stock">
              <el-input v-model="form.stock.stock" v-input.positive.numeric class="w210" placeholder="请输入整数" />
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
import { batchUpdateByFile } from '@/api/aliExpress/list.js'
import { toFixed2 } from '@/views/components/utils.js'
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
      form: {
        price: {
          priceUpdateType: '', // 价格更新方式
          operator: '1', // 价格运算符
          proportion: '', // 修改比例
          amount: ''
        },
        stock: {
          stockUpdateType: '', // 库存更新方式
          operator: '1', // 库存运算符
          stock: ''
        }
      },
      activeName: 'updateCondition',
      priceTypeList: { 1: '按总价金额', 2: '按总价比例', 3: '指定价格为' },
      stockTypeList: { 1: '增加/减少库存', 2: '指定库存为' },
      operator: { 1: '+', 2: '-' }, // 运算符
      rules: {
        'price.proportion': [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[1-9][0-9]?$/, message: '请输入1-99之间', trigger: 'blur' }]
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
      if (this.form.price.priceUpdateType === '3' && this.form.price.amount) {
        priceParam = this.form.price.amount
      } else if (this.form.price.priceUpdateType === '2' && this.form.price.proportion) {
        priceParam = (this.operator[this.form.price.operator] + this.form.price.proportion) + '%'
      } else if (this.form.price.priceUpdateType === '1' && this.form.price.amount) {
        priceParam = this.operator[this.form.price.operator] + this.form.price.amount
      }

      if (this.form.stock.stockUpdateType === '2' && this.form.stock.stock) {
        stockParam = this.form.stock.stock
      } else if (this.form.stock.stockUpdateType === '1' && this.form.stock.stock) {
        stockParam = this.operator[this.form.stock.operator] + this.form.stock.stock
      }
      return { priceParam, stockParam }
    },
    okHandle() {
      this.$refs.updateCondition.validate((valid) => {
        if (valid) {
          this.loading = true
          const { priceParam, stockParam } = this.okEnabled()
          batchUpdateByFile({
            feedType: '1',
            feedPlatform: 'SM',
            priceParam,
            stockParam,
            ids: this.selectedIds
          }).then(res => {
            this.$message.success('批量更新价格/库存成功')
            this.$parent.$emit('close', true)
          }).finally(() => {
            this.loading = false
          })
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
.w80{
  width: 80px;
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
