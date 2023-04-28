import request from '@/router/axios'
/**
 * module: 租户管理
 * 后端开发： 任永亮
 * 文档地址： http://192.168.114.166:8888/doc.html#/权限模块/租户表接口/listUsingGET_10
 **/
// 获取租户列表
export function getTenantList(data) {
  return request.$ams({
    url: '/tenant/list',
    method: 'get',
    params: data
  })
}

// 删除租户
export function tenantRemove(data) {
  return request.$ams({
    url: '/tenant/remove',
    method: 'post',
    params: data
  })
}

// 新增或修改租户信息
export function submitTenant(data) {
  return request.$ams({
    url: '/tenant/submit',
    method: 'post',
    data: data
  })
}

// 租户授权列表
export function getTenantAppList(data) {
  return request.$ams({
    url: '/tenant-app/list',
    method: 'get',
    params: data
  })
}

// 删除授权
export function removeTenantApp(data) {
  return request.$ams({
    url: '/tenant-app/remove',
    method: 'post',
    params: data
  })
}

// 新增或修改授权
export function submitTenantApp(data) {
  return request.$ams({
    url: '/tenant-app/submit',
    method: 'post',
    data: data
  })
}

// 应用列表
export function getAppList(data) {
  return request.$ams({
    url: '/application/list',
    method: 'get',
    params: data
  })
}
