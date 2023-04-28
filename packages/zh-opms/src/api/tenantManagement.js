import request from '@/plugins/request'
/**
 * module: 租户管理
 * 后端开发： 任永亮
 * 文档地址： http://192.168.114.166:8888/doc.html#/权限模块/租户表接口/listUsingGET_10
 **/
// 获取租户列表
export function getTenantList(data) {
  return request.$opms({
    url: '/tenant/list',
    method: 'get',
    params: data
  })
}

// 获取租户分页列表
export function getTenantPage(data) {
  return request.$opms({
    url: '/tenant/page',
    method: 'get',
    params: data
  })
}

// 删除租户
export function tenantRemove(data) {
  return request.$opms({
    url: '/tenant/remove',
    method: 'post',
    params: data
  })
}

// 新增租户信息
export function saveTenant(data) {
  return request.$opms({
    url: '/tenant/save',
    method: 'post',
    data: data
  })
}

// 修改租户信息
export function updateTenant(data) {
  return request.$opms({
    url: '/tenant/update',
    method: 'post',
    data: data
  })
}

// 租户授权列表
export function getTenantAppList(data) {
  return request.$opms({
    url: '/tenant-app/list',
    method: 'get',
    params: data
  })
}

// 删除授权
export function removeTenantApp(data) {
  return request.$opms({
    url: '/tenant-app/remove',
    method: 'post',
    params: data
  })
}

// 新增授权
export function addTenantApp(data) {
  return request.$opms({
    url: '/tenant-app/add',
    method: 'post',
    data: data
  })
}

// 修改授权
export function updateTenantApp(data) {
  return request.$opms({
    url: '/tenant-app/update',
    method: 'post',
    data: data
  })
}

// 应用列表
export function getAppList(data) {
  return request.$opms({
    url: '/application/list',
    method: 'get',
    params: data
  })
}

// 获取租户DB配置列表（分页）
export function getTenantDBList(data) {
  return request.$opms({
    url: '/tenant/db/page',
    method: 'get',
    params: data
  })
}

// 添加租户DB配置
export function addTenantDB(data) {
  return request.$opms({
    url: '/tenant/db/add',
    method: 'post',
    data
  })
}

// 修改租户DB配置
export function updateTenantDB(data) {
  return request.$opms({
    url: '/tenant/db/update',
    method: 'post',
    data
  })
}

// 获取租户DB配置详情
export function detailTenantDB(data) {
  return request.$opms({
    url: '/tenant/db/detail',
    method: 'get',
    params: data
  })
}

// 初始化租户DB
export function initTenantDB(data) {
  return request.$opms({
    url: '/tenant/db/init',
    method: 'post',
    params: data
  })
}

// 同步租户基础数据
export function syncTenantDB(data) {
  return request.$opms({
    url: '/tenant/db/sync',
    method: 'post',
    params: data
  })
}

// 更新租户DB配置（运维配置）
export function opsUpdateDb(data) {
  return request.$opms({
    url: '/tenant/db/ops_update',
    method: 'post',
    data
  })
}
/**
 * 租户DB变更
 * @param {*} data
 * @returns
 */
export function dynamicApi(data) {
  return request.$opms({
    url: '/tenant/db/schema_update',
    method: 'post',
    data
  })
}
/**
 * 批量初始化
 * @param {*} data
 * @returns
 */
export function initBatch(data) {
  return request.$opms({
    url: '/tenant/db/initBatch',
    method: 'post',
    data
  })
}
/**
 * 批量同步
 * @param {*} data
 * @returns
 */
export function syncBatch(data) {
  return request.$opms({
    url: '/tenant/db/syncBatch',
    method: 'post',
    data
  })
}
