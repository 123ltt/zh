import request from '@/router/axios'
// 角色接口
export const getUserList = (data) => {
  return request.$ams({
    url: '/user/conciseInfo/page?size=-1',
    method: 'get',
    params: data
  })
}
