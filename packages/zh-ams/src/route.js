// 该文件通过route-tool脚本自动生成。📌请勿手动修改
export const routes = [
  {
    name: 'PermissMenuManageMenuManage',
    path: '/permiss/menuManage/menuManage',
    component: () => import(/* webpackChunkName: "permiss" */ '@/views/menuManage/_menuManage.vue')
  },
  {
    name: 'PermissOrganizationManageOrganizationList',
    path: '/permiss/organizationManage/organizationList',
    component: () => import(/* webpackChunkName: "permiss" */ '@/views/organizationManage/_organizationList.vue')
  },
  {
    name: 'PermissRoleManageRoleList',
    path: '/permiss/roleManage/roleList',
    component: () => import(/* webpackChunkName: "permiss" */ '@/views/roleManage/_roleList.vue')
  },
  {
    name: 'PermissUserManageUserManage',
    path: '/permiss/userManage/userManage',
    component: () => import(/* webpackChunkName: "permiss" */ '@/views/userManage/_userManage.vue')
  },
  {
    name: 'PermissPosition',
    path: '/permiss/position',
    component: () => import(/* webpackChunkName: "permiss" */ '@/views/_position.vue')
  },
  {
    name: 'PermissPost',
    path: '/permiss/post',
    component: () => import(/* webpackChunkName: "permiss" */ '@/views/_post.vue')
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

export const apiPrefix = JSON.parse('[["$ams","ams"],["$auth","ams-auth"]]')
