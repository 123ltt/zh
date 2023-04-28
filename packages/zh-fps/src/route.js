// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'CfpsOrderManagementOrderList',
    path: '/cfps/orderManagement/orderList',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/orderManagement/_orderList.vue')
  },
  {
    name: 'CfpsOrderManagementOrderSynchronization',
    path: '/cfps/orderManagement/orderSynchronization',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/orderManagement/_orderSynchronization.vue')
  },
  {
    name: 'CfpsPayOfflinePurchaseFinal',
    path: '/cfps/pay/offlinePurchase/final',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/pay/offlinePurchase/_final.vue')
  },
  {
    name: 'CfpsPayOfflinePurchasePaymentList',
    path: '/cfps/pay/offlinePurchase/paymentList',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/pay/offlinePurchase/_paymentList.vue')
  },
  {
    name: 'CfpsPayOnlinePurchaseImprest',
    path: '/cfps/pay/onlinePurchase/imprest',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/pay/onlinePurchase/_imprest.vue')
  },
  {
    name: 'CfpsPayOnlinePurchaseUnimprest',
    path: '/cfps/pay/onlinePurchase/unimprest',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/pay/onlinePurchase/_unimprest.vue')
  },
  {
    name: 'CfpsRefundMgmentPurchasingRefund',
    path: '/cfps/refundMgment/purchasingRefund',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/refundMgment/_purchasingRefund.vue')
  },
  {
    name: 'CfpsRefundMgmentRefundRecord',
    path: '/cfps/refundMgment/refundRecord',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/refundMgment/_refundRecord.vue')
  },
  {
    name: 'CfpsSystemBizDict',
    path: '/cfps/system/bizDict',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/system/_bizDict.vue')
  },
  {
    name: 'CfpsTransactionDetailsDetails',
    path: '/cfps/transactionDetails/details',
    component: () => import(/* webpackChunkName: "cfps" */ '@/views/transactionDetails/_details.vue')
  }
].map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [

].map(item => {
  item.meta = { $keepAlive: true }
  return item
})

export const apiPrefix = JSON.parse('[["$fps","cfps"]]')
