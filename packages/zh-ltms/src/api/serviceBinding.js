// 线上绑定 接口
import request from '@/router/axios'
// 线上服务下拉列表
export const getServiceBindList = (current, size, params) => {
  return request.$ltms_optimize({
    url: '/onlineChannelServiceBind/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 删除
export const onlineServiceBindRemove = (ids) => {
  return request.$ltms_optimize({
    url: '/onlineChannelServiceBind/remove',
    method: 'post',
    params: { ids }
  })
}
// 新增
export const onlineServiceBindSave = (params) => {
  return request.$ltms_optimize({
    url: '/onlineChannelServiceBind/save',
    method: 'post',
    data: params
  })
}
// 更新
export const onlineServiceBindUpdate = (params) => {
  return request.$ltms_optimize({
    url: '/onlineChannelServiceBind/update',
    method: 'post',
    data: params
  })
}

// 详情
export const onlineServiceBindDetail = (params) => {
  return request.$ltms_optimize({
    url: '/onlineChannelServiceBind/detail',
    method: 'get',
    params
  })
}
