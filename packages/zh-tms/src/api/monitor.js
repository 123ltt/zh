// 运费监控
import request from '@/router/axios'

// 运费日志
export const getList = (current, size, params) => {
  return request.$tms_optimize({
    url: '/channelOptimizeLog/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
