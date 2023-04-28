// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'TmsForecastApiConfig',
    path: '/tms/forecast/apiConfig',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/forecast/_apiConfig.vue')
  },
  {
    name: 'TmsForecastLgList',
    path: '/tms/forecast/lgList',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/forecast/_lgList.vue')
  },
  {
    name: 'TmsForecastSender',
    path: '/tms/forecast/sender',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/forecast/_sender.vue')
  },
  {
    name: 'TmsForecastSystemLog',
    path: '/tms/forecast/systemLog',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/forecast/_systemLog.vue')
  },
  {
    name: 'TmsOptimizeAcBinding',
    path: '/tms/optimize/acBinding',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/optimize/_acBinding.vue')
  },
  {
    name: 'TmsOptimizeFreightTrial',
    path: '/tms/optimize/freightTrial',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/optimize/_freightTrial.vue')
  },
  {
    name: 'TmsOptimizeMonitor',
    path: '/tms/optimize/monitor',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/optimize/_monitor.vue')
  },
  {
    name: 'TmsOptimizeOlbinding',
    path: '/tms/optimize/olbinding',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/optimize/_olbinding.vue')
  },
  {
    name: 'TmsOptimizeOlConfig',
    path: '/tms/optimize/olConfig',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/optimize/_olConfig.vue')
  },
  {
    name: 'TmsOptimizePlatform',
    path: '/tms/optimize/platform',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/optimize/_platform.vue')
  },
  {
    name: 'TmsProviderChannel',
    path: '/tms/provider/channel',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/provider/_channel.vue')
  },
  {
    name: 'TmsProviderCostOffer',
    path: '/tms/provider/costOffer',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/provider/_costOffer.vue')
  },
  {
    name: 'TmsProviderDelivery',
    path: '/tms/provider/delivery',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/provider/_delivery.vue')
  },
  {
    name: 'TmsProviderLogisticsAccount',
    path: '/tms/provider/logisticsAccount',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/provider/_logisticsAccount.vue')
  },
  {
    name: 'TmsProviderProvider',
    path: '/tms/provider/provider',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/provider/_provider.vue')
  },
  {
    name: 'TmsProviderSurcharge',
    path: '/tms/provider/surcharge',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/provider/_surcharge.vue')
  },
  {
    name: 'TmsProviderWarhousePartition',
    path: '/tms/provider/warhousePartition',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/provider/_warhousePartition.vue')
  },
  {
    name: 'TmsSystemTmsConfigurationProperty',
    path: '/tms/system/tmsConfiguration/property',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/system/tmsConfiguration/_property.vue')
  },
  {
    name: 'TmsSystemTmsConfigurationPropertyIntercept',
    path: '/tms/system/tmsConfiguration/propertyIntercept',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/system/tmsConfiguration/_propertyIntercept.vue')
  },
  {
    name: 'TmsSystemDict',
    path: '/tms/system/dict',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/system/_dict.vue')
  },
  {
    name: 'TmsSystemDictbiz',
    path: '/tms/system/dictbiz',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/system/_dictbiz.vue')
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

export const apiPrefix = JSON.parse('[["$tms_base","ctms-provider"],["$tms_provider","ctms-provider"],["$tms_optimize","ctms-optimize"],["$tms_trace","ctms-trace"],["$tms_system","ctms-system"],["$tms_forecast","ctms-forecast"]]')
