import request from '@/router/axios'

/**
 * 公司列表接口
 */
export const companyPage = (data) => {
  return request.$sams({
    url: '/store/company/page',
    method: 'POST',
    data
  })
}

/**
 * 添加公司
 */
export const addCompany = (data) => {
  return request.$sams({
    url: '/store/company/add',
    method: 'POST',
    data
  })
}

/**
 * 编辑公司
 */
export const updateCompany = (data) => {
  return request.$sams({
    url: '/store/company/update',
    method: 'POST',
    data
  })
}

/**
 * 公司详情
 */
export const companyDetail = (id) => {
  return request.$sams({
    url: '/store/company/detail',
    method: 'POST',
    data: id
  })
}

/**
 * 公司信息导出
 */
export const companyExport = (data) => {
  return request.$sams({
    url: '/store/company/export',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}
