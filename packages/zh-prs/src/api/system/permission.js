import request from '@/router/axios'
/**
 * 权限配置列表分页
 *
 */
export const getPermissionList = (current, size, params) => {
  return request.$prs({
    url: '/permission/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
/**
 * 权限配置列表详情
 *
 */
export const getPermissionDetail = (params) => {
  return request.$prs({
    url: '/permission/detail',
    method: 'get',
    params
  })
}

/**
 * 权限配置列表删除
 *
 */
export const getPermissionRemove = (params) => {
  return request.$prs({
    url: '/permission/remove',
    method: 'post',
    params: {
      ...params
    }
  })
}

/**
 * 权限配置列表新增/编辑
 *
 */
export const getPermissionSubmit = (data) => {
  return request.$prs({
    url: '/permission/submit',
    method: 'post',
    data
  })
}
/**
 * 权限配置操作记录
 *
 */
export const getPermissionHis = (params) => {
  return request.$prs({
    url: '/permission/his',
    method: 'get',
    params
  })
}
