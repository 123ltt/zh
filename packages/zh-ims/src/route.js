// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'ImsBaseCollocation',
    path: '/ims/base/collocation',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/base/_collocation.vue')
  },
  {
    name: 'ImsBaseImsWarehouse',
    path: '/ims/base/imsWarehouse',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/base/_imsWarehouse.vue')
  },
  {
    name: 'ImsBaseImsWarehouseWarn',
    path: '/ims/base/imsWarehouseWarn',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/base/_imsWarehouseWarn.vue')
  },
  {
    name: 'ImsBaseProductStatus',
    path: '/ims/base/productStatus',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/base/_productStatus.vue')
  },
  {
    name: 'ImsBaseSafetyDays',
    path: '/ims/base/safetyDays',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/base/_safetyDays.vue')
  },
  {
    name: 'ImsBaseSeasonPeriod',
    path: '/ims/base/seasonPeriod',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/base/_seasonPeriod.vue')
  },
  {
    name: 'ImsBaseUnsalableRules',
    path: '/ims/base/unsalableRules',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/base/_unsalableRules.vue')
  },
  {
    name: 'ImsHandleConsignment',
    path: '/ims/handle/consignment',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/handle/_consignment.vue')
  },
  {
    name: 'ImsHandleShared',
    path: '/ims/handle/shared',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/handle/_shared.vue')
  },
  {
    name: 'ImsHandleTransfer',
    path: '/ims/handle/transfer',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/handle/_transfer.vue')
  },
  {
    name: 'ImsInWarehouseLowerShelves',
    path: '/ims/inWarehouse/lowerShelves',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/inWarehouse/_lowerShelves.vue')
  },
  {
    name: 'ImsInWarehouseOnShelves',
    path: '/ims/inWarehouse/onShelves',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/inWarehouse/_onShelves.vue')
  },
  {
    name: 'ImsInWarehouseOutWarehouse',
    path: '/ims/inWarehouse/outWarehouse',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/inWarehouse/_outWarehouse.vue')
  },
  {
    name: 'ImsInWarehouseWarehousing',
    path: '/ims/inWarehouse/warehousing',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/inWarehouse/_warehousing.vue')
  },
  {
    name: 'ImsStockAvailableStock',
    path: '/ims/stock/availableStock',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/stock/_availableStock.vue')
  },
  {
    name: 'ImsStockView',
    path: '/ims/stock/view',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/stock/_view.vue')
  },
  {
    name: 'ImsStockAnalysisAge',
    path: '/ims/stockAnalysis/age',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/stockAnalysis/_age.vue')
  },
  {
    name: 'ImsStockAnalysisForecast',
    path: '/ims/stockAnalysis/forecast',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/stockAnalysis/_forecast.vue')
  },
  {
    name: 'ImsStockAnalysisSalesVolume',
    path: '/ims/stockAnalysis/salesVolume',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/stockAnalysis/_salesVolume.vue')
  },
  {
    name: 'ImsStockBalancesBalance',
    path: '/ims/stockBalances/balance',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/stockBalances/_balance.vue')
  },
  {
    name: 'ImsStockBalancesCost',
    path: '/ims/stockBalances/cost',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/stockBalances/_cost.vue')
  },
  {
    name: 'ImsSystemBizDict',
    path: '/ims/system/bizDict',
    component: () => import(/* webpackChunkName: "ims" */ '@/views/system/_bizDict.vue')
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

export const apiPrefix = isSaas => isSaas ? [['$ims', 'ims']] : [['$ims', 'platform-ims']]
