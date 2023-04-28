import request from '@/router/axios'

// 渠道分页列表接口
export const getplatformList = (current, size, params) => {
  return request.$ltms_optimize({
    url: '/channelSaleLimit/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
// // 所有平台列表
export const getplatformAllList = () => {
  return request.$ltms_system({
    url: '/samsProxy/getPlatformList',
    method: 'get'
  })
}

// 修改平台限制状态
export const changeplatformStatus = (params) => {
  return request.$ltms_optimize({
    url: '/channelSaleLimit/changeStatus',
    method: 'post',
    params
  })
}

// 获取平台详情
export const platformDetail = (params) => {
  return request.$ltms_optimize({
    url: '/channelSaleLimit/detail',
    method: 'get',
    params
  })
}

// 保存平台店铺数据
export const platformSave = (params) => {
  return request.$ltms_optimize({
    url: '/channelSaleLimit/save',
    method: 'post',
    data: params
  })
}

// 删除平台店铺数据
export const platformRemove = (ids) => {
  return request.$ltms_optimize({
    url: '/channelSaleLimit/remove',
    method: 'post',
    params: { ids }
  })
}
