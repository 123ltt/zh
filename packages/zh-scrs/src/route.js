// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'ScrsForbiddenWordsForbiddenWordsList',
    path: '/scrs/forbiddenWords/forbiddenWordsList',
    component: () => import(/* webpackChunkName: "scrs" */ '@/views/forbiddenWords/_forbiddenWordsList.vue')
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

export const apiPrefix = JSON.parse('[["$scrs","scrs-fbwords"]]')
