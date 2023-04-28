import request from '@/router/axios'

// 渠道分页列表接口
export const getChannelList = (current, size, params) => {
  return request.$ltms_provider({
    url: '/channel/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 修改状态接口
export const changeStatus = (params) => {
  return request.$ltms_provider({
    url: '/channel/changeStatus',
    method: 'post',
    params
  })
}

// 新增接口
export const save = (params) => {
  return request.$ltms_provider({
    url: '/channel/save',
    method: 'post',
    data: params
  })
}
// 编辑渠道
export const update = (params) => {
  return request.$ltms_provider({
    url: '/channel/update',
    method: 'post',
    data: params
  })
}
// 获取渠道详情
export const detail = (params) => {
  return request.$ltms_provider({
    url: '/channel/detail',
    method: 'get',
    params
  })
}

// 服务范围保存
export const saveServiceScope = (params) => {
  return request.$ltms_provider({
    url: '/channel/saveServiceScope',
    method: 'post',
    data: params
  })
}
// 获取服务范围
export const getServiceScope = (params) => {
  return request.$ltms_provider({
    url: '/channel/getServiceScope',
    method: 'get',
    params
  })
}

// 包裹配置修改
export const updatePackageLimit = (params) => {
  return request.$ltms_provider({
    url: '/channelPackageLimit/updatePackageLimit',
    method: 'post',
    data: params
  })
}

// 包裹配置详情
export const findPackageLimit = (params) => {
  return request.$ltms_provider({
    url: '/channelPackageLimit/findPackageLimit',
    method: 'get',
    params
  })
}

// 包裹个性化配置修改
export const updatePackageCustomLimit = (params) => {
  return request.$ltms_provider({
    url: '/channelPackageLimit/updatePackageCustomLimit',
    method: 'post',
    data: params
  })
}

// 包裹个性化配置详情
export const findPackageCustomLimit = (params) => {
  return request.$ltms_provider({
    url: '/channelPackageLimit/findPackageCustomLimit',
    method: 'get',
    params
  })
}

// 新增商品限制
export const findProductLimit = (params) => {
  return request.$ltms_provider({
    url: '/productLimit/findProductLimit',
    method: 'get',
    params
  })
}
// 获取商品限制
export const saveProductLimit = (params) => {
  return request.$ltms_provider({
    url: '/productLimit/saveUpdate',
    method: 'post',
    data: params
  })
}

// 商品限制个性化配置
export const findProductCustomerList = (params) => {
  return request.$ltms_provider({
    url: '/productLimit/findProductCustomerList',
    method: 'get',
    params
  })
}

// 新增商品个性化配置
export const saveUpdateCustomer = (params) => {
  return request.$ltms_provider({
    url: '/productLimit/saveUpdateCustomer',
    method: 'post',
    data: params
  })
}

// 下载模板
export const downloadTemplate = (params) => {
  return request.$ltms_provider({
    url: '/channelLimitPostCode/downloadTemplate',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 导入模板
export const postcodeRestrictedImportExcel = (params) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('type', params.templateType)
  formData.append('channelCode', params.channelCode)

  return request.$ltms_provider({
    url: '/channelLimitPostCode/importExcel', // 当前接口
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
// 导出邮编限制
export const exportPostCode = (params) => {
  return request.$ltms_provider({
    url: '/channelLimitPostCode/exportPostCode',
    method: 'get',
    responseType: 'blob',
    timeout: 60000,
    params
  })
}
/**
 * 邮编详情
 * @param {number} params
 */
export const postCodeList = (current, size, params) => {
  return request.$ltms_provider({
    url: '/channelLimitPostCode/pageList',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 增值服务
export const codSave = (params) => {
  return request.$ltms_provider({
    url: '/channelCod/save',
    method: 'post',
    data: params
  })
}
// 增值服务详情
export const codDetail = (params) => {
  return request.$ltms_provider({
    url: '/channelCod/detail',
    method: 'get',
    params
  })
}
