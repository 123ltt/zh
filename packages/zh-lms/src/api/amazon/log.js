import request from '@/router/axios'

/**
 * module: 日志查询
 * 文档地址： http://showdoc.zehui.local/web/#/14
 **/

// Listing日志详情
export function getListingLog(params) {
  return request.$lmsAmazon({
    url: '/amazonlistinglog/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目日志
export function getCategoryLog(params) {
  return request.$lmsAmazon({
    url: '/amazonopslog/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
