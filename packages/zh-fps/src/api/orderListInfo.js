
// // 导入axios
import request from '@/router/axios'
// 表格数据
export const getList = (current, size, params) => {
  return request.$fps({
    url: '/order/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
// 平台 - 旧
export const getPlatformInfo = (params) => {
  return request.$fps({
    url: '/dict-biz/dictionary',
    method: 'get',
    params
  })
}

// 付款方式+交易状态数据- 平台-新
export const getPlatfor = (params) => {
  return request.$fps({
    url: '/dict-biz/purchase/dictionary',
    method: 'get',
    params
  })
}

// 买家账号
export const getBuyerInfo = (params) => {
  return request.$fps({
    url: '/account/list',
    method: 'get',
    params
  })
}
