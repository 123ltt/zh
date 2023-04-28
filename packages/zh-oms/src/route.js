// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'OmsAnalysisOrder',
    path: '/oms/analysis/order',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/analysis/_order.vue')
  },
  {
    name: 'OmsDownloadCenterList',
    path: '/oms/downloadCenter/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/downloadCenter/_list.vue')
  },
  {
    name: 'OmsOrderManagementAbnormal',
    path: '/oms/orderManagement/abnormal',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/orderManagement/_abnormal.vue')
  },
  {
    name: 'OmsOrderManagementAll',
    path: '/oms/orderManagement/all',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/orderManagement/_all.vue')
  },
  {
    name: 'OmsPackOrdersAbnormal',
    path: '/oms/packOrders/abnormal',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/packOrders/_abnormal.vue')
  },
  {
    name: 'OmsPackOrdersAll',
    path: '/oms/packOrders/all',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/packOrders/_all.vue')
  },
  {
    name: 'OmsPackOrdersAudit',
    path: '/oms/packOrders/audit',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/packOrders/_audit.vue')
  },
  {
    name: 'OmsPackOrdersDelivery',
    path: '/oms/packOrders/delivery',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/packOrders/_delivery.vue')
  },
  {
    name: 'OmsPackOrdersReturnGoods',
    path: '/oms/packOrders/returnGoods',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/packOrders/_returnGoods.vue')
  },
  {
    name: 'OmsPackOrdersScarceGoods',
    path: '/oms/packOrders/scarceGoods',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/packOrders/_scarceGoods.vue')
  },
  {
    name: 'OmsPlatformOrdersAmazonList',
    path: '/oms/platformOrders/amazon/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/amazon/_list.vue')
  },
  {
    name: 'OmsPlatformOrdersEbayList',
    path: '/oms/platformOrders/ebay/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/ebay/_list.vue')
  },
  {
    name: 'OmsPlatformOrdersLazadaList',
    path: '/oms/platformOrders/lazada/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/lazada/_list.vue')
  },
  {
    name: 'OmsPlatformOrdersShopeeList',
    path: '/oms/platformOrders/shopee/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/shopee/_list.vue')
  },
  {
    name: 'OmsPlatformOrdersSMTList',
    path: '/oms/platformOrders/SMT/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/SMT/_list.vue')
  },
  {
    name: 'OmsPlatformOrdersWalmartList',
    path: '/oms/platformOrders/walmart/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/walmart/_list.vue')
  },
  {
    name: 'OmsPlatformOrdersWishList',
    path: '/oms/platformOrders/wish/list',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/wish/_list.vue')
  },
  {
    name: 'OmsPlatformOrdersImport',
    path: '/oms/platformOrders/import',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/_import.vue')
  },
  {
    name: 'OmsPlatformOrdersPosition',
    path: '/oms/platformOrders/position',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/_position.vue')
  },
  {
    name: 'OmsRefundLazada',
    path: '/oms/refund/lazada',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/refund/_lazada.vue')
  },
  {
    name: 'OmsRulesConfigAbnormalIntercept',
    path: '/oms/rulesConfig/abnormalIntercept',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/rulesConfig/_abnormalIntercept.vue')
  },
  {
    name: 'OmsRulesConfigAutoCancellation',
    path: '/oms/rulesConfig/autoCancellation',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/rulesConfig/_autoCancellation.vue')
  },
  {
    name: 'OmsRulesConfigBlacklistDatabase',
    path: '/oms/rulesConfig/blacklistDatabase',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/rulesConfig/_blacklistDatabase.vue')
  },
  {
    name: 'OmsRulesConfigDeliveryPriority',
    path: '/oms/rulesConfig/deliveryPriority',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/rulesConfig/_deliveryPriority.vue')
  },
  {
    name: 'OmsRulesConfigPresuffixResolution',
    path: '/oms/rulesConfig/presuffixResolution',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/rulesConfig/_presuffixResolution.vue')
  },
  {
    name: 'OmsRulesConfigTagConfig',
    path: '/oms/rulesConfig/tagConfig',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/rulesConfig/_tagConfig.vue')
  }
].map(item => {
  item.meta = Object.assign(item.meta || {}, { $keepAlive: true })
  return item
})

export const pageRoutes = [
  {
    path: '/_np/oms/components/define-template/updateTemp',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/components/define-template/~updateTemp.vue')
  },
  {
    path: '/_np/oms/orderManagement/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/orderManagement/~details.vue')
  },
  {
    path: '/_np/oms/packOrders/details/index',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/packOrders/details/~index.vue')
  },
  {
    path: '/_np/oms/platformOrders/amazon/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/amazon/~details.vue')
  },
  {
    path: '/_np/oms/platformOrders/ebay/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/ebay/~details.vue')
  },
  {
    path: '/_np/oms/platformOrders/lazada/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/lazada/~details.vue')
  },
  {
    path: '/_np/oms/platformOrders/shopee/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/shopee/~details.vue')
  },
  {
    path: '/_np/oms/platformOrders/SMT/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/SMT/~details.vue')
  },
  {
    path: '/_np/oms/platformOrders/walmart/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/walmart/~details.vue')
  },
  {
    path: '/_np/oms/platformOrders/wish/details',
    component: () => import(/* webpackChunkName: "oms" */ '@/views/platformOrders/wish/~details.vue')
  }
].map(item => {
  item.meta = { $keepAlive: true }
  return item
})

export const apiPrefix = JSON.parse('[["$oms","oms"]]')
