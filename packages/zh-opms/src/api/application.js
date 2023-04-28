import request from '@/plugins/request'

// 获取应用分页列表数据
export const getAppList = (params) => {
  return request.$opms({
    url: '/application/page',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 获取应用列表数据
export const getAppData = (params) => {
  return request.$opms({
    url: '/application/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增应用
export const addApp = (params) => {
  return request.$opms({
    url: '/application/save',
    method: 'post',
    data: params
  })
}
// 修改应用
export const updateApp = (params) => {
  return request.$opms({
    url: '/application/update',
    method: 'post',
    data: params
  })
}
// 获取应用详情
export const getAppDetail = (params) => {
  return request.$opms({
    url: '/application/detail',
    method: 'post',
    data: params
  })
}
// 删除应用
export const removeApp = (ids) => {
  return request.$opms({
    url: '/application/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
// 校验应用名称或者应用标识是否存在
export const verifyApp = (params) => {
  return request.$opms({
    url: '/application/verify',
    method: 'get',
    params: {
      ...params
    }
  })
}
