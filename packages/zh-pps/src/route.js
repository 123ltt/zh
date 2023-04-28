// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'PpsSystemBizDict',
    path: '/pps/system/bizDict',
    component: () => import(/* webpackChunkName: "pps" */ '@/views/system/_bizDict.vue')
  },
  {
    name: 'PpsPlatform',
    path: '/pps/platform',
    component: () => import(/* webpackChunkName: "pps" */ '@/views/_platform.vue')
  },
  {
    name: 'PpsProduct',
    path: '/pps/product',
    component: () => import(/* webpackChunkName: "pps" */ '@/views/_product.vue')
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

export const apiPrefix = JSON.parse('[["$pps","pps"]]')
