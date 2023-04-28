// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'ErsSystemBizDict',
    path: '/ers/system/bizDict',
    component: () => import(/* webpackChunkName: "ers" */ '@/views/system/_bizDict.vue')
  },
  {
    name: 'ErsCurrency',
    path: '/ers/currency',
    component: () => import(/* webpackChunkName: "ers" */ '@/views/_currency.vue')
  },
  {
    name: 'ErsFloatRate',
    path: '/ers/floatRate',
    component: () => import(/* webpackChunkName: "ers" */ '@/views/_floatRate.vue')
  },
  {
    name: 'ErsMonthlyReport',
    path: '/ers/monthlyReport',
    component: () => import(/* webpackChunkName: "ers" */ '@/views/_monthlyReport.vue')
  },
  {
    name: 'ErsPlatformRateDeploy',
    path: '/ers/platformRateDeploy',
    component: () => import(/* webpackChunkName: "ers" */ '@/views/_platformRateDeploy.vue')
  },
  {
    name: 'ErsWeightedPlatformRate',
    path: '/ers/weightedPlatformRate',
    component: () => import(/* webpackChunkName: "ers" */ '@/views/_weightedPlatformRate.vue')
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

export const apiPrefix = JSON.parse('[["$ers","platform-ers"]]')
