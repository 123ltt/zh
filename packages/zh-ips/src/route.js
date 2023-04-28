// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'PurchaseAdjManagementPurchaseAdj',
    path: '/purchase/adjManagement/purchaseAdj',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/adjManagement/_purchaseAdj.vue')
  },
  {
    name: 'PurchaseBasicManagementCycle',
    path: '/purchase/basicManagement/cycle',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/basicManagement/_cycle.vue')
  },
  {
    name: 'PurchaseBasicManagementDistribution',
    path: '/purchase/basicManagement/distribution',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/basicManagement/_distribution.vue')
  },
  {
    name: 'PurchaseBasicManagementInventoryRules',
    path: '/purchase/basicManagement/inventoryRules',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/basicManagement/_inventoryRules.vue')
  },
  {
    name: 'PurchaseBasicManagementProduct',
    path: '/purchase/basicManagement/product',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/basicManagement/_product.vue')
  },
  {
    name: 'PurchaseBasicManagementSalesRules',
    path: '/purchase/basicManagement/salesRules',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/basicManagement/_salesRules.vue')
  },
  {
    name: 'PurchaseBasicManagementTurnoverRules',
    path: '/purchase/basicManagement/turnoverRules',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/basicManagement/_turnoverRules.vue')
  },
  {
    name: 'PurchaseExceptionManagementCheckUnqualified',
    path: '/purchase/exceptionManagement/checkUnqualified',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/exceptionManagement/_checkUnqualified.vue')
  },
  {
    name: 'PurchaseMonitoringManagementOvertime',
    path: '/purchase/monitoringManagement/overtime',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/monitoringManagement/_overtime.vue')
  },
  {
    name: 'PurchaseOrderManagementArrival',
    path: '/purchase/orderManagement/arrival',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/orderManagement/_arrival.vue')
  },
  {
    name: 'PurchaseOrderManagementPlan',
    path: '/purchase/orderManagement/plan',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/orderManagement/_plan.vue')
  },
  {
    name: 'PurchaseOrderManagementPrice',
    path: '/purchase/orderManagement/price',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/orderManagement/_price.vue')
  },
  {
    name: 'PurchaseOrderManagementPurchaseInquiry',
    path: '/purchase/orderManagement/purchaseInquiry',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/orderManagement/_purchaseInquiry.vue')
  },
  {
    name: 'PurchaseOrderManagementPurchasingOrder',
    path: '/purchase/orderManagement/purchasingOrder',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/orderManagement/_purchasingOrder.vue')
  },
  {
    name: 'PurchaseOrderManagementReturnGoods',
    path: '/purchase/orderManagement/returnGoods',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/orderManagement/_returnGoods.vue')
  },
  {
    name: 'PurchasePayableManagementPurchasePayable',
    path: '/purchase/payableManagement/purchasePayable',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/payableManagement/_purchasePayable.vue')
  },
  {
    name: 'PurchasePayableManagementRequestPayable',
    path: '/purchase/payableManagement/requestPayable',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/payableManagement/_requestPayable.vue')
  },
  {
    name: 'PurchasePrePayManagementApply',
    path: '/purchase/prePayManagement/apply',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/prePayManagement/_apply.vue')
  },
  {
    name: 'PurchasePrePayManagementInfo',
    path: '/purchase/prePayManagement/info',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/prePayManagement/_info.vue')
  },
  {
    name: 'PurchasePrePayManagementRefund',
    path: '/purchase/prePayManagement/refund',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/prePayManagement/_refund.vue')
  },
  {
    name: 'PurchasePrePayManagementWriteOff',
    path: '/purchase/prePayManagement/writeOff',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/prePayManagement/_writeOff.vue')
  },
  {
    name: 'PurchasePurchaseDemandOweSingle',
    path: '/purchase/purchaseDemand/oweSingle',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchaseDemand/_oweSingle.vue')
  },
  {
    name: 'PurchasePurchaseDemandReplenish',
    path: '/purchase/purchaseDemand/replenish',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchaseDemand/_replenish.vue')
  },
  {
    name: 'PurchasePurchaseDemandStock',
    path: '/purchase/purchaseDemand/stock',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/purchaseDemand/_stock.vue')
  },
  {
    name: 'PurchaseSystemBizDict',
    path: '/purchase/system/bizDict',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/system/_bizDict.vue')
  },
  {
    name: 'PurchaseWarningManagementStockoos',
    path: '/purchase/warningManagement/stockoos',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/warningManagement/_stockoos.vue')
  },
  {
    name: 'PurchaseIndex',
    path: '/purchase/index',
    component: () => import(/* webpackChunkName: "purchase" */ '@/views/_index.vue')
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

export const apiPrefix = isSaas => isSaas ? [['$purchase', 'ips']] : [['$purchase', 'platform-ips']]
