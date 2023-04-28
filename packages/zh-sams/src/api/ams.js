import request from '@/router/axios'

// 获取菜单列表
export function getUserList(data) {
  return request.$ams({
    url: '/user/page',
    method: 'get',
    params: data
  })
}
