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
    name: 'TmsForecastLgReturn',
    path: '/tms/forecast/lgReturn',
    component: () => import(/* webpackChunkName: "tms" */ '@/views/forecast/_lgReturn.vue')
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

export const apiPrefix = JSON.parse('[["$otms_base","ctms-provider"],["$otms_provider","ctms-provider"],["$otms_optimize","ctms-optimize"],["$otms_trace","ctms-trace"],["$otms_system","ctms-system"],["$otms_forecast","ctms-forecast"]]')
