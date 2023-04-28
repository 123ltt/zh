import request from '@/plugins/request'

// 获取角色菜单表数据
export const getRoleList = (params) => {
  return request.$opms({
    url: '/role/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增角色
export const addRole = (params) => {
  return request.$opms({
    url: '/role/submit',
    method: 'post',
    data: params
  })
}
// 修改角色
export const updateRole = (params) => {
  return request.$opms({
    url: '/role/update',
    method: 'post',
    data: params
  })
}
// 删除角色
export const deleteRole = (ids) => {
  return request.$opms({
    url: '/role/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
// 获取菜单列表
// export const getMenuList = (params) => {
//   return request.$opms({
//     url: '/menu/list',
//     method: 'get',
//     params: {
//       ...params,
//     }
//   })
// }
// 获取菜单列表
export const getMenuList = (params) => {
  return request.$opms({
    url: '/menu/list-by-tenant',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 角色授权-已授权菜单列表
export const getRoleMenu = (params) => {
  return request.$opms({
    url: '/role-menu/grant-menu',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 根据角色和菜单获取自定义数据过滤组织
export const getRoleOrg = (params) => {
  return request.$opms({
    url: '/menuorg/grant_org',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 数据过滤权限授权
export const roleGrant = (params) => {
  return request.$opms({
    url: '/role/grant',
    method: 'post',
    data: params
  })
}
// 用户角色分页列表
export const getUserRole = (params) => {
  return request.$opms({
    url: '/userrole/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 获取角色菜单表
export const getMenuRole = (params) => {
  return request.$opms({
    url: '/role-menu/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
