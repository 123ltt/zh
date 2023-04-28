import request from '@/router/axios'

// 获取岗位列表数据
export const getPostData = (params) => {
  return request.$ams({
    url: '/post/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增岗位
export const addPost = (params) => {
  return request.$ams({
    url: '/post/save',
    method: 'post',
    data: params
  })
}
// 修改岗位
export const updatePost = (params) => {
  return request.$ams({
    url: '/post/update',
    method: 'post',
    data: params
  })
}
// 删除岗位
export const deletePost = (ids) => {
  return request.$ams({
    url: '/post/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
