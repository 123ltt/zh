import request from '@/router/axios'

/**
 * module: 获取产品分组
 * 文档地址： http://showdoc.zehui.local/web/#/14?page_id=1308
 **/

// 获取产品分组
export function getProductGroup(params) {
  return request.$lmsAliExpress({
    url: '/product/group/get',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 同步产品分组
export function updateProductGroup(params) {
  return request.$lmsAliExpress({
    url: '/product/group/sync/group',
    method: 'get',
    params: {
      ...params
    }
  })
}
