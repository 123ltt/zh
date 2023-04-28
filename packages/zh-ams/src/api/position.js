import request from '@/router/axios'

// 获取职位下拉数据
export const getPositionData = (params) => {
  return request.$ams({
    url: '/position/getAll',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 获取职位列表数据
export const getPositionList = (params) => {
  return request.$ams({
    url: '/position/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 新增职位
export const addPosition = (params) => {
  return request.$ams({
    url: '/position/save',
    method: 'post',
    data: params
  })
}
// 修改职位
export const updatePosition = (params) => {
  return request.$ams({
    url: '/position/update',
    method: 'post',
    data: params
  })
}
// 删除职位
export const deletePosition = (ids) => {
  return request.$ams({
    url: '/position/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
