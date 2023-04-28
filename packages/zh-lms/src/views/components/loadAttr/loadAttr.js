import { getSkuAttr } from '@/api/pms.js'

// 获取产品属性列表
export const loadAttr = {
  loading: false,
  list: []
}
export function getSkuAttrList(sku) {
  if (sku) {
    loadAttr.loading = true
    loadAttr.list = []
    getSkuAttr({ data: [sku] }).then(res => {
      const data = res.data
      data.map(item => {
        loadAttr.list = [...loadAttr.list, ...item.lstAttr]
      })
    }).finally(() => {
      loadAttr.loading = false
    })
  }
}
