import request from '@/router/axios'

// 获取类目列表
export function getCateogries(params) {
  return request.$lmsWalmart({
    url: '/walmartCategory/list',
    method: 'post',
    data: params
  })
}

// 获取属性列表
export function getAttrList(params, data) {
  return request.$lmsWalmart({
    url: '/walmartAttributeValue/page',
    method: 'post',
    data: data,
    params: params
  })
}

// 属性配置表-编辑-更新taxCode
export function updateTaxCode(params) {
  return request.$lmsWalmart({
    url: '/walmartAttributeValue/update',
    method: 'post',
    data: params
  })
}

// 属性配置表-日志
export const getLogList = (params) => request.$lmsWalmart({
  url: '/walmartOpsLog/list',
  method: 'get',
  params
})

// 获取子属性列表
export function getChildAttrList(params, data) {
  return request.$lmsWalmart({
    url: '/walmartAttributeBind/page',
    method: 'post',
    params: {
      ...params
    },
    data

  })
}

// 子属性配置表-编辑-配置子属性
export function updateChildAttr(params) {
  return request.$lmsWalmart({
    url: '/walmartAttributeBind/update',
    method: 'post',
    data: params
  })
}

// 子属性配置表-编辑-获取可供配置的子属性
export const getBindAttr = (params) => request.$lmsWalmart({
  url: '/walmartAttribute/getBindAttribute',
  method: 'get',
  params
})
