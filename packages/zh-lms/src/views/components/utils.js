import { getTranslate } from '@/api/lmsCommon.js'
import { stringEllipsis } from '@/util/util'
import { dateFormat } from '@/util/date'
import VAddInfo from 'zh-pms/src/views/addInfo/index.vue'

export function getIndex(prop, data) {
  return data.findIndex(item => item.prop === prop)
}

/***
 * @description 保存两位小数位数
*/
export function toFixed2(inputStr) {
  let val = inputStr
  // 过滤成两位小数位数
  // eslint-disable-next-line
  val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
  // 返回最终输入的内容
  return val
}
/**
 * @description 生成随机数
 * **/
export function generateRandomNum() {
  const s = dateFormat(new Date(), 'yyyyMMddhhmmssS')
  return s
}
/**
 * @description 打开pms sku,spu详情
 * @param code sku,spu编码
 * @param productName 编码对应的标题
 * **/
export function openSpuSkuDetail(code, productName) {
  this.$newTab({
    path: `/spuSku/detail/${encodeURIComponent(code)}`,
    title: '详情 - ' + stringEllipsis(productName, 8),
    component: VAddInfo,
    data: { code, readonly: true },
    clearCache: true
  })
}

/**
 * @description 设置 产品成本 = 成本 * 折扣比例
 * **/
export function setProductCost(data) {
  data.productCost = Number(data.productCost * data.discountRatio).toFixed(2)
}
export function getTranslateHandle(translateData, that, countryCode, translate) {
  const data = []
  const name = []
  translateData.forEach((item, i) => {
    Object.entries(item).forEach(([key, val]) => {
      val.forEach(v => {
        data.push({ text: that.$refs[key].form[v] || '' })
        name.push({ label: v, index: i })
      })
    })
  })
  getTranslate({ countryCode: countryCode, textList: data }, 'shopee').then(res => {
    name.forEach((options, index) => {
      const ref = Object.keys(translateData[options.index])[0]
      res.data.forEach((item, i) => {
        if (index === i) that.$refs[ref].form[options.label] = item
      })
    })
  })
}
/**
 * @description 日期组件带快捷选项
 * **/
export const pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}
