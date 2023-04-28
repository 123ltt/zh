import request from '@/router/axios'

/**
 * module: 日志查询
 * 文档地址： http://showdoc.zehui.local/web/#/137?page_id=1128
 **/

// Listing业务日志列表
export function getListingLog(params) {
  return request.$lmsEbay({
    url: '/log/listing_bus/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 类目日志
export function getCategoryLog(params) {
  return request.$lmsEbay({
    url: '/log/listing_cate/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
// 常量接口
export function getConstants() {
  return request.$lmsEbay({
    url: '/constants',
    method: 'get'
  })
}
// 获取日志列表
export function getLogList(data) {
  return request.$lmsEbay({
    url: '/log/bus/page',
    method: 'get',
    params: data
  })
}
