<template>
  <!-- 采购管理首页 -->
  <basic-container>
    <header class="d-flex text-center justify-content-between">
      <div v-for="item in statistics" :key="item.field" class="border rounded-3 w-100 m-1" @click="$router.push({name:item.link})">
        <div class="p-3">
          <div class="fs-4 fw-bold text-primary">{{ allData[item.field] || '-' }}</div>
          <div class="fs-5 mt-2">{{ item.title }}</div>
        </div>
      </div>
    </header>
    <g-charts :option="option1" title="上月Top20采购SKU" />
    <g-charts :option="option2" title="上月Top20不合格SKU" />
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/index.js'

export default {
  name: 'Assessment',
  data() {
    return {
      statistics: [
        { title: '待处理', field: 'countOfPendingOrder', link: 'PurchaseOrderManagementPurchasingOrder' },
        { title: '待询价', field: 'countOfNotInquire', link: 'PurchaseOrderManagementPurchaseInquiry' },
        { title: '待付款', field: 'countOfUnPaid', link: 'PurchasePayableManagementPurchasePayable' },
        { title: '质检不合格待处理', field: 'toBeProcessedQC', link: 'PurchaseExceptionManagementCheckUnqualified' }
      ],
      option1: {},
      option2: {},
      allData: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    //   -1转成0
    getNum(val) {
      Object.keys(val).forEach(item => {
        if (val[item] === -1) {
          val[item] = 0
        }
      })
    },
    getOption({ category, series, yName, xName }) {
      return {
        legend: {
          data: series.map(item => item.name)
        },
        xAxis: {
          name: xName,
          type: 'category',
          data: category
        },
        yAxis: { type: 'value', name: yName },
        series
      }
    },
    getData() {
      getDetail().then(res => {
        const data = res.data
        this.getNum(data)

        {
          const category = []
          const countData = []
          const amountData = []
          ;(data.summaryTopPurSku || []).forEach(item => {
            category.push(item.productSku)
            countData.push(item.sumPurQty)
            amountData.push(item.sumPurMoney)
          })
          this.option1 = this.getOption({
            category,
            series: [
              { name: '采购数量', type: 'bar', data: countData },
              { name: '采购金额', type: 'bar', data: amountData }
            ],
            xName: 'SKU编码'
          })
        }

        {
          const category = []
          const unqualifiedData = []
          const backData = []
          ;(data.summaryTopAbnormalSku || []).forEach(item => {
            category.push(item.productSku)
            unqualifiedData.push(item.sumAbnormalQty)
            backData.push(item.sumReturnQty)
          })
          this.option2 = this.getOption({
            category,
            series: [
              { name: '采购数量', type: 'bar', data: unqualifiedData },
              { name: '采购金额', type: 'bar', data: backData }
            ],
            xName: 'SKU编码'
          })
        }
        this.allData = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  margin-bottom: 3rem;
  > div {
    transition: all 0.3s;
    &:hover {
      border-color: var(--color-primary)!important;
      cursor: pointer;
      box-shadow: 0 0 10px var(--color-primary);
    }
  }
}
</style>
