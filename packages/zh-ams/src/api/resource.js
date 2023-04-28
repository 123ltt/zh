import request from '@/router/axios'

// 获取资源列表数据
export const getResourceList = (params) => {
  return request.$ams({
    url: '/resource/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增/修改资源
export const addResource = (params) => {
  return request.$ams({
    url: '/resource/submit',
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
