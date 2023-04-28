import { stringEllipsis } from '@/util/util'
import VAddInfo from 'zh-pms/src/views/addInfo/index.vue'
import PurchaseDetail from 'zh-ips/src/views/orderManagement/purchasingOrderModal/purchaseDetail.vue'
// import PurchaseDetail from 'zh-ips/src/views/adjManagement/purchaseDetail.vue'
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
 * @description 打开ips 采购详情
 * @param id 采购id
 * @param productName 编码对应的标题
 * **/
export function openPurchaseDetail(id, productName) {
  this.$newTab({
    path: `/purchaseDetail/purchaseDetail/${encodeURIComponent(id)}`,
    title: '详情 - ' + stringEllipsis(productName, 8),
    component: PurchaseDetail,
    data: { id, readonly: true },
    clearCache: true
  })
}
