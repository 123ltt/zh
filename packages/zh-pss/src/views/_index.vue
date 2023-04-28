<template>
  <!--供应商管理首页 -->
  <basic-container>
    <header class="d-flex text-center justify-content-between">
      <div v-for="item in statistics" :key="item.field" class="border rounded-3 w-100 m-1" @click="$router.push({name:item.link})">
        <div class="p-3">
          <div class="fs-4 fw-bold text-primary">{{ allData[item.field] || '-' }}</div>
          <div class="fs-5 mt-2">{{ item.title }}</div>
        </div>
      </div>
    </header>
    <g-charts :option="option1" title="发货/退货统计" />
    <g-charts :option="option2" title="采购/退款统计" />
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/index.js'

export default {
  name: 'Assessment',
  data() {
    return {
      statistics: [
        { title: '待审核供应商', field: 'toBeReviewed', link: 'SupplierSupplierManagementSupplierIntroduction' },
        { title: '待发货订单', field: 'toBeDelivered', link: 'SupplierOrderManagementPurchasingOrder' },
        { title: '待处理退货订单', field: 'toBeProcessedReturn', link: 'SupplierOrderManagementReturnOrder' },
        { title: '待处理质检不合格订单', field: 'toBeProcessedQC', link: 'SupplierExceptionManagementCheckUnqualified' },
        { title: '待访厂供应商', field: 'toSuppliersBeVisited', link: 'SupplierFactoryVisitManagementFactoryVisitRecord' }
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
    // 有值才显示
    getShow(val) {
      if (val === 0) {
        return 0
      } else {
        return 10
      }
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
          const sendData = []
          const backData = []
          ;(data.returnGoodsQty || []).forEach(item => {
            const [[month, amount]] = Object.entries(item)
            category.push(month)
            backData.push(amount)
          })
          ;(data.deliveryGoodsQty || []).forEach(item => {
            sendData.push(Object.values(item)[0])
          })
          this.option1 = this.getOption({
            category,
            series: [
              { name: '发货数量', type: 'bar', data: sendData },
              { name: '退货数量', type: 'bar', data: backData }
            ],
            yName: '数量'
          })
        }

        {
          const category = []
          const purchaseData = []
          const backData = []
          ;(data.purchaseAmount || []).forEach(item => {
            const [[month, amount]] = Object.entries(item)
            category.push(month)
            purchaseData.push(amount)
            backData.push(this.getShow(amount))
          })
          this.option2 = this.getOption({
            category,
            series: [
              { name: '采购金额', type: 'bar', data: purchaseData },
              { name: '退货金额', type: 'bar', data: backData }
            ],
            yName: '金额'
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
