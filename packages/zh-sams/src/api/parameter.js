import request from '@/router/axios'

/**
 * API授权参数列表接口
 */
export const pageParamsList = (data) => {
  return request.$sams({
    url: '/store/auth/pageParams',
    method: 'POST',
    data
  })
}

/**
 * 添加 API授权参数
 */
export const addParams = (data) => {
  return request.$sams({
    url: '/store/auth/addParams',
    method: 'POST',
    data
  })
}

// API授权参数修改接口
export const updateParam = (data) => {
  return request.$sams({
    url: '/store/auth/updateParam',
    method: 'POST',
    data
  })
}

// 删除
export const removeParam = (id) => {
  return request.$sams({
    url: '/store/auth/removeParam',
    method: 'POST',
    data: id
  })
}
