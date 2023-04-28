// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'PlatformDictManageDictList',
    path: '/platform/dictManage/dictList',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/dictManage/_dictList.vue')
  },
  {
    name: 'PlatformMenuManageMenuManage',
    path: '/platform/menuManage/menuManage',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/menuManage/_menuManage.vue')
  },
  {
    name: 'PlatformResourceManageResourceList',
    path: '/platform/resourceManage/resourceList',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/resourceManage/_resourceList.vue')
  },
  {
    name: 'PlatformRoleManageRoleList',
    path: '/platform/roleManage/roleList',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/roleManage/_roleList.vue')
  },
  {
    name: 'PlatformTenantManageTenantAuthorize',
    path: '/platform/tenantManage/tenantAuthorize',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/tenantManage/_tenantAuthorize.vue')
  },
  {
    name: 'PlatformTenantManageTenantDBList',
    path: '/platform/tenantManage/tenantDBList',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/tenantManage/_tenantDBList.vue')
  },
  {
    name: 'PlatformTenantManageTenantList',
    path: '/platform/tenantManage/tenantList',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/tenantManage/_tenantList.vue')
  },
  {
    name: 'PlatformApplication',
    path: '/platform/application',
    component: () => import(/* webpackChunkName: "platform" */ '@/views/_application.vue')
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

export const apiPrefix = JSON.parse('[["$opms","opms"]]')
