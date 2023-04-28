import request from '@/router/axios'

// 获取角色菜单表数据
export const getRoleList = (params) => {
  return request.$ams({
    url: '/role/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增角色
export const addRole = (params) => {
  return request.$ams({
    url: '/role/submit',
    method: 'post',
    data: params
  })
}
// 修改角色
export const updateRole = (params) => {
  return request.$ams({
    url: '/role/update',
    method: 'post',
    data: params
  })
}
// 删除角色
export const deleteRole = (roleId) => {
  return request.$ams({
    url: '/role/remove',
    method: 'post',
    params: {
      roleId
    }
  })
}
// 获取菜单列表
export const getMenuList = (params) => {
  return request.$ams({
    url: '/menu/list-by-tenant',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 角色授权-已授权菜单列表
export const getRoleMenu = (params) => {
  return request.$ams({
    url: '/role-menu/grant-menu',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 根据角色和菜单获取自定义数据过滤组织
export const getRoleOrg = (params) => {
  return request.$ams({
    url: '/menu-org/grant-org',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 数据过滤权限授权
export const roleGrant = (params) => {
  return request.$ams({
    url: '/role/grant',
    method: 'post',
    data: params
  })
}
// 用户角色分页列表
export const getUserRole = (params) => {
  return request.$ams({
    url: '/userrole/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 获取角色菜单表
export const getMenuRole = (params) => {
  return request.$ams({
    url: '/role-menu/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 岗位列表
export const postGetAll = () => {
  return request.$ams({
    url: '/post/getAll',
    method: 'get'
  })
}
// 职位列表
export const positionGetAll = () => {
  return request.$ams({
    url: '/position/getAll',
    method: 'get'
  })
}
/**
 * 平台下拉列表
 */
export const platformOption = () => {
  return request.$sams({
    url: '/store/platform/options',
    method: 'POST'
  })
}
// 角色授权信息和角色信息导出
export const roleExport = (params) => {
  return request.$ams({
    url: '/role/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 获取角色列表
export const roleGetAll = () => {
  return request.$ams({
    url: '/role/getAll',
    method: 'get'
  })
}
// 获取引用角色菜单列表
export const getRoleMenuList = (params) => {
  return request.$ams({
    url: '/role-menu/getCopyRoleMenuList',
    method: 'get',
    params
  })
}
// 角色导入模板下载
export const downloadTemp = () => {
  return request.$ams({
    url: '/role/download-import-template',
    method: 'get',
    responseType: 'blob'
  })
}
// 角色授权信息导入
export const roleImport = (data) => {
  const formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  return request.$ams({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/role/import',
    method: 'POST',
    timeout: 120000,
    data: formData
  })
}
export const batchUpdatePermission = (data) => request.$ams({
  url: '/role/grant/roles-menus',
  method: 'post',
  data
})
