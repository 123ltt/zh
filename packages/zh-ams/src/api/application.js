import request from '@/router/axios'

// 获取应用列表数据
export const getAppData = (params) => {
  return request.$ams({
    url: '/application/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增应用
export const addApp = (params) => {
  return request.$ams({
    url: '/application/save',
    method: 'post',
    data: params
  })
}
// 修改应用
export const updateApp = (params) => {
  return request.$ams({
    url: '/application/update',
    method: 'post',
    data: params
  })
}
// 获取应用详情
export const getAppDetail = (params) => {
  return request.$ams({
    url: '/application/detail',
    method: 'post',
    data: params
  })
}
// 删除应用
export const removeApp = (ids) => {
  return request.$ams({
    url: '/application/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
// 校验应用名称或者应用标识是否存在
export const verifyApp = (params) => {
  return request.$ams({
    url: '/application/verify',
    method: 'get',
    params: {
      ...params
    }
  })
}
