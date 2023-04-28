// 导入axios
import request from '@/router/axios'

// 账号绑定分页列表接口
export const getlogisticsAccountList = (current, size, params) => {
  return request.$tms_system({
    url: '/system/platformAccount/store/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
// 账号绑定接口
export const binding = (data) => {
  return request.$tms_system({
    url: '/system/platformAccount/store/binding',
    method: 'post',
    data
  })
}
