<template>
  <g-charts :option="option" />
</template>
<script>
import { getChart } from '@/api/orderAnalysis'
export default {
  name: 'PubChart',
  components: {},
  data() {
    return {
      option: {}
    }
  },
  methods: {
    getChartData(params, data) {
      const defaultConfig = {
        platformCode: '',
        storeName: [],
        countryCode: [],
        payDtType: '',
        orderType: '',
        timeZone: ''
      }
      return getChart(params, Object.assign(defaultConfig, data)).then(res => {
        const rs = res.data
        /* 以下注释暂不删除，左右需要统一刻度线的场景用到 */

        // 计算最大值
        // function calMax(arr) {
        //   const max = Math.max(...arr)
        //   const maxint = Math.ceil(max / 9.5) // 不让最高的值超过最上面的刻度
        //   let maxval = maxint * 10 // 让显示的刻度是整数

        // 为了防止数据为0时，Y轴不显示，给个最大值
        //   if (maxval === 0) { maxval = 1 }
        //   return maxval
        // }

        // 计算最小值
        // function calMin(arr) {
        //   const min = Math.min(...arr)
        //   const minint = Math.floor(min / 10)
        //   const minval = minint * 10// 让显示的刻度是整数
        //   return minval
        // }

        // const Max1 = calMax(rs.map(item => item.orderCount))
        // const Min1 = calMin(rs.map(item => item.orderCount))
        // const Max2 = calMax(rs.map(item => item.salesAmount))
        // const Min2 = calMin(rs.map(item => item.forecastProfits))

        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['订单量', '试算利润', '销售金额', '退款金额']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: rs.map(item => item.timeStr)
          },
          yAxis: [
            {
              type: 'value',
              show: true,
              name: '订单量'
              // min: Min1,
              // max: Max1,
              // splitNumber: 5,
              // interval: (Max1 - Min1) / 5
            },
            {
              type: 'value',
              show: true,
              name: '金额($)'
              // min: Min2,
              // max: Max2,
              // splitNumber: 5,
              // interval: (Max2 - Min2) / 5
            }
          ],
          series: [
            {
              name: '订单量',
              type: 'line',
              yAxisIndex: 0,
              smooth: true,
              data: rs.map(item => item.orderCount)
            },
            {
              name: '试算利润',
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
              data: rs.map(item => item.forecastProfits)
            },
            {
              name: '销售金额',
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
              data: rs.map(item => item.salesAmount)
            },
            {
              name: '退款金额',
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
              data: rs.map(item => item.refundAmount)
            }
          ]
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
