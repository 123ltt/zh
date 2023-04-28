import request from '@/plugins/request'

// 获取字典列表
export const getDictParentList = (params) => {
  return request({
    url: '/dict/dict-biz/parent-list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 获取字典子节点列表
export const getDictChildList = (params) => {
  return request({
    url: '/dict/dict-biz/child-list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 获取字典详情
export const getDictDetail = (params) => {
  return request({
    url: '/dict/dict-biz/detail',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增或修改字典
export const submitDict = (row) => {
  return request({
    url: '/dict/dict-biz/submit',
    method: 'post',
    data: row
  })
}
// 删除字典
export const removeDict = (ids) => {
  return request({
    url: '/dict/dict-biz/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
