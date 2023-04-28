// 导入axios
import request from '@/router/axios'

// 物流账号分页列表数据
export const platformAccountList = (current, size, params) => {
  return request.$ltms_system({
    url: '/system/platformAccount/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 物流账号列表
export const getAccountList = (params) => {
  return request.$ltms_system({
    url: '/system/platformAccount/getAccountList',
    method: 'get',
    params: {
      params
    }
  })
}
// 新增物流账号确定接口
export const add = (data) => {
  return request.$ltms_system({
    url: '/system/platformAccount/add',
    method: 'post',
    data
  })
}
// 物流账号删除
export const deleted = (ids) => {
  return request.$ltms_system({
    url: '/system/platformAccount/deleted',
    method: 'get',
    params: { ids }
  })
}

// 授权-获取token
export const getToken = (params) => {
  return request.$ltms_system({
    url: '/system/platformAccount/getToken',
    method: 'get',
    params
  })
}

// code 页面跳转拿到code值接口
export const getCodeUrl = (id) => {
  return request.$ltms_system({
    url: '/system/platformAccount/getCodeUrl',
    method: 'get',
    params: { id }
  })
}
// 编辑更新确定接口
export const update = (data) => {
  return request.$ltms_system({
    url: '/system/platformAccount/update',
    method: 'post',
    data
  })
}
