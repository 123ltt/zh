import request from '@/router/axios'

// 报价费用首页
export const getChannelList = (current, size, params) => {
  return request.$tms_provider({
    url: '/channel/getQuotationList',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
//  邮编分区主查询接口
export const channelPartitionList = (current, size, params) => {
  return request.$tms_provider({
    url: '/channelPartition/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 下载模板
export const exportPartition = () => {
  return request.$tms_provider({
    url: '/channelPartition/exportTemplate',
    method: 'get',
    responseType: 'blob'
  })
}
// 分区导入
export const importPartition = (params) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('channelCode', params.channelCode)

  return request.$tms_provider({
    url: '/channelPartition/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 邮编导出
export const downloadPartition = (params) => {
  return request.$tms_provider({
    url: '/channelPartition/downloadPartition',
    method: 'get',
    responseType: 'blob',
    timeout: 60000,
    params
  })
}

// 邮编分区详情查询接口
export const partitionDetail = (current, size, params) => {
  return request.$tms_provider({
    url: '/channelPartition/detail/page',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}
//  主表删除
export const partitionRemove = (params) => {
  return request.$tms_provider({
    url: '/channelPartition/remove',
    method: 'get',
    params
  })
}
// 子表删除
export const partitionDetailRemove = (ids) => {
  return request.$tms_provider({
    url: '/channelPartition/detail/remove',
    method: 'get',
    params: { ids }
  })
}

// 新增费项接口
export const priceSave = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/item/save',
    method: 'post',
    data: params
  })
}

// 查询报价
export const priceDetail = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/item/detail',
    method: 'get',
    params
  })
}

// 查询子表报价
export const priceEditionDetail = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/item/editionDetail',
    method: 'get',
    params
  })
}

// 状态更改
export const updatePriceStatus = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/item/update',
    method: 'post',
    params
  })
}

// 下载价格模板
export const downloadPriceRules = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/editionPrice/download/priceRules',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 导入价格数据
export const editionPriceImport = (params) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('templateType', params.templateType)
  formData.append('parentId', params.id)
  formData.append('channelCode', params.channelCode)

  return request.$tms_provider({
    url: '/channelPrice/editionPrice/import/priceRules',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 导出模板通用报价模版
export const exportPriceRules = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/editionPrice/export/priceRules',
    method: 'get',
    responseType: 'blob',
    timeout: 60000,
    params
  })
}

// 导出分区横竖版
export const exportPartitionRules = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/editionPrice/export/partitionRules',
    method: 'get',
    responseType: 'blob',
    timeout: 60000,
    params
  })
}

// 删除报价版本
export const editionDetailDelete = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/item/editionDetailDelete',
    method: 'post',
    params
  })
}

// 获取渠道分区报价固定表格列表
export const getFixTable = (current, size, params) => {
  return request.$tms_provider({
    url: '/channelPrice/editionPrice/pageSpecial',
    method: 'get',
    params: { current, size, ...params }
  })
}

// 获取渠道分区报价动态表格列表
export const getChangeTable = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/editionPrice/combinationDetail',
    method: 'get',
    params
  })
}

// 修改报价版本
export const editionUpdate = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/item/editionDetailUpdate',
    method: 'post',
    data: params
  })
}

// 根据id查找字段详情
export const idAddressDetail = (params) => {
  return request.$tms_provider({
    url: '/channelPrice/editionPrice/idAddressDetail',
    method: 'get',
    params
  })
}
