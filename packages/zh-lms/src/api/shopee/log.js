import request from '@/router/axios'

/**
 * module: 日志查询
 * 文档地址： http://showdoc.zehui.local/web/#/14?page_id=1872
 **/

// Listing业务日志列表
export function getListingLog(params) {
  return request.$lmsShopee({
    url: '/shopeelistinglog/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目日志
export function getCategoryLog(params) {
  return request.$lmsShopee({
    url: '/shopeeopslog/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
