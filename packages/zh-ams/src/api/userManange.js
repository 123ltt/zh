import request from '@/router/axios'
/**
 * module: 用户管理
 * 后端开发： 李景华
 * 文档地址： https://www.showdoc.com.cn/1058340152082282?page_id=5504937212848657
 * 文档地址： http://192.168.114.171:8888/doc.html#/ams/用户表接口/pageUsingGET_8
 **/

// 获取菜单列表
export function getUserList(data) {
  return request.$ams({
    url: '/user/page',
    method: 'get',
    params: data
  })
}

/**
 * 与 getUserList 的请求参数和响应数据一样。
 * 登录用户都有权限获取该接口数据
 */
export function getUserListForAllLoginUser(data) {
  return request.$ams({
    url: '/user/conciseInfo/without/filter/page',
    params: data
  })
}

// 修改用户状态
export function updateUserStatus(data) {
  return request.$ams({
    url: '/user/update-status',
    method: 'get',
    params: data
  })
}

// 新增用户
export function createUser(data) {
  return request.$ams({
    url: '/user/create',
    method: 'post',
    data: data
  })
}

// 解锁用户
export function unlock(data) {
  return request.$ams({
    url: '/user/unlock',
    method: 'get',
    params: data
  })
}

// 编辑用户
export function updateUser(data) {
  return request.$ams({
    url: '/user/update',
    method: 'post',
    data: data
  })
}
// 用户详情
export function getUserDetail(data) {
  return request.$ams({
    url: '/user/detail',
    method: 'get',
    params: data
  })
}

// 密码重置
export function resetPassword(data) {
  return request.$ams({
    url: '/user/reset-password',
    method: 'post',
    params: data
  })
}

// 获取组织机构列表
export function getOrgList(data) {
  return request.$ams({
    // url: '/org/lazy-list',
    url: '/org/tree',
    method: 'get',
    params: data
  })
}

// 获取岗位列表
export function getPostAllList(data) {
  return request.$ams({
    // url: '/post/getAll',
    url: '/post/list',
    method: 'get',
    params: data
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request.$ams({
    url: '/role/page',
    method: 'get',
    params: data
  })
}

// 设置角色
export function setUserRole(data) {
  return request.$ams({
    url: '/user/distribution/role',
    method: 'post',
    params: data
  })
}

// 修改密码
export function updatePassWord(data) {
  return request.$ams({
    url: '/user/update-password',
    method: 'post',
    params: data
  })
}
