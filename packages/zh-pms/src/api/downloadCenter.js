import request from '@/router/axios'
// 下载中心
export const queryData = ({ current, size, params }) => {
  return request.$pms({
    url: '/filestorage/downloadList',
    method: 'POST',
    params: { },
    data: {
      query: { current, size },
      data: params
    }
  })
}
