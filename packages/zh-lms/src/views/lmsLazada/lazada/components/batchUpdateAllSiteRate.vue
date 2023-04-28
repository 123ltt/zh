<template>
  <el-form ref="form" :model="form" size="mini" label-width="80px" class="form-col m-3 mb-3 overflow-hidden" @submit.native.prevent>
    <el-col :span="19" class="me-3">
      <el-row v-for="(item, index) in form.allPriceList" :key="index" :gutter="10">
        <el-col :span="3">{{ item.site }}</el-col>
        <el-col :span="16">
          <el-form-item
            :prop="'allPriceList.' + index + '.profitRate'"
            :rules="{ required: true, validator: validRate(item, index), trigger: 'change' }"
            label-width="0"
          >
            <el-input v-model="item.profitRate"
                      v-input.positive
                      size="mini"
                      type="text"
                      class="w-100"
                      @input="() => {item.profitRate = toFixed2(item.profitRate)}"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="text-end">
        <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
        <el-button type="primary" size="mini" @click="submit('form')">确 定</el-button>
      </div>
    </el-col>
    <el-col :span="3">
      <el-button size="mini" type="text" @click="batchUpdateRate">批量修改</el-button>
    </el-col>
  </el-form>
</template>

<script>
import { toFixed2 } from './addListing.handle.js'
import batchUpdateRate from './batchUpdateRate.vue'
export default {
  name: 'BatchUpdateAllSiteRate',
  props: {
    siteArr: Array,
    baseProductInfo: Object,
    batchRate: Array
  },
  data() {
    return {
      toFixed2,
      form: {
        allPriceList: []
      }
    }
  },
  mounted() {
    this.siteArr.forEach(site => {
      // this.form.allPriceList[`${site.toLocaleLowerCase()}ProfitRate`] = ''
      this.form.allPriceList[`${site.toLocaleLowerCase()}ProfitRate`] = ''
      const siteObj = this.batchRate.find(item => item.site === site) || {}
      this.form.allPriceList.push({
        site,
        profitRate: siteObj.profitRate || ''
      })
    })
  },
  methods: {
    // 批量修改利润率
    batchUpdateRate() {
      this.$modal({
        title: '批量修改利润率',
        component: batchUpdateRate,
        width: '400px',
        callback: (data) => {
          if (data) {
            this.form.allPriceList.forEach((item, index) => {
              item.profitRate = data
            })
          }
        }
      })
    },
    // 利润率验证
    validRate(sku, index) {
      return (rule, value, callback) => {
        if (Number(sku.profitRate) <= 0 || Number(sku.profitRate) > 1) {
          callback(new Error('请输入0~1之间的数字'))
        } else {
          callback()
        }
      }
    },
    cancel() {
      this.$parent.$emit('close')
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        const hasRate = this.form.allPriceList.some(item => item.profitRate)
        const updateSite = this.form.allPriceList.filter(item => item.profitRate).map(v => v.site)
        if (valid || hasRate) {
          this.$parent.$emit('close', this.form.allPriceList, updateSite)
        } else {
          return false
        }
      })
    }
  }
}
</script>
