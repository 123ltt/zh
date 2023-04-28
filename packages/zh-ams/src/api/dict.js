import request from '@/router/axios'

// 获取字典列表
export const getDictParentList = (params) => {
  return request({
    url: '/dict/dict-biz/parent-list',
    method: 'get',
    params
  })
}
// 获取字典子节点列表
export const getDictChildList = (params) => {
  return request({
    url: '/dict/dict-biz/child-list',
    method: 'get',
    params
  })
}
