import request from '@/router/axios'

// 获取资源列表数据
export const getResourceList = (params) => {
  return request.$ams({
    url: '/resource/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增资源
export const addResource = (params) => {
  return request.$ams({
    url: '/resource/save',
    method: 'post',
    data: params
  })
}
// 编辑资源+启用禁用
export const editResource = (params) => {
  return request.$ams({
    url: '/resource/update',
    method: 'post',
    data: params
  })
}
// 删除资源
export const deleteResource = (ids) => {
  return request.$ams({
    url: '/resource/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
