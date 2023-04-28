import request from '@/plugins/request'

// 获取资源列表数据
export const getResourceList = (params) => {
  return request.$opms({
    url: '/resource/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增资源
export const addResource = (params) => {
  return request.$opms({
    url: '/resource/save',
    method: 'post',
    data: params
  })
}
// 修改资源
export const updateResource = (params) => {
  return request.$opms({
    url: '/resource/update',
    method: 'post',
    data: params
  })
}
// 删除资源
export const deleteResource = (ids) => {
  return request.$opms({
    url: '/resource/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
