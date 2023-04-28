// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'SamsApiAuthorizeParameterParameter',
    path: '/sams/apiAuthorize/parameter/parameter',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/apiAuthorize/parameter/_parameter.vue')
  },
  {
    name: 'SamsApiAuthorizeShopsApiShopsApi',
    path: '/sams/apiAuthorize/shopsApi/shopsApi',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/apiAuthorize/shopsApi/_shopsApi.vue')
  },
  {
    name: 'SamsCompanyInfoCompanyInfo',
    path: '/sams/companyInfo/companyInfo',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/companyInfo/_companyInfo.vue')
  },
  {
    name: 'SamsPaypalPaypal',
    path: '/sams/paypal/paypal',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/paypal/_paypal.vue')
  },
  {
    name: 'SamsPlatformPlatform',
    path: '/sams/platform/platform',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/platform/_platform.vue')
  },
  {
    name: 'SamsSiteSite',
    path: '/sams/site/site',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/site/_site.vue')
  },
  {
    name: 'SamsStoreAuditStoreAudit',
    path: '/sams/storeAudit/storeAudit',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/storeAudit/_storeAudit.vue')
  },
  {
    name: 'SamsStoreListStoreList',
    path: '/sams/storeList/storeList',
    component: () => import(/* webpackChunkName: "sams" */ '@/views/storeList/_storeList.vue')
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

export const apiPrefix = JSON.parse('[["$sams","sams"]]')
