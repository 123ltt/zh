import request from '@/router/axios'

/**
 * 公司列表接口
 */
export const storeAPProvePage = (data) => {
  return request.$sams({
    url: '/store/approve/page',
    method: 'POST',
    data
  })
}

/**
 *
 * 添加店铺申请
 */
export const addApprove = (data) => {
  return request.$sams({
    url: '/store/approve/save-first',
    method: 'POST',
    data
  })
}

/**
 *
 * 店铺申请详情
 */
export const approveDetails = (id) => {
  return request.$sams({
    url: '/store/approve/detail-first',
    method: 'POST',
    data: id
  })
}
/**
 *
 * 店铺初审-编辑
 */
export const updateApprove = (data) => {
  return request.$sams({
    url: '/store/approve/update-first',
    method: 'POST',
    data
  })
}
/**
 * 财务信息编辑
*/
export const updateFinanceInfo = (data) => {
  return request.$sams({
    url: '/store/approve/finance-info/update',
    method: 'POST',
    data
  })
}

/**
 * 财务信息详情
*/
export const financeInfoDetails = (id) => {
  return request.$sams({
    url: '/store/approve/finance-info/detail',
    method: 'POST',
    data: id
  })
}

/**
 * 店铺资料待完善列表-批量导出
*/
export const nopassExport = (data) => {
  return request.$sams({
    url: '/store/approve/export-nopass',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}

/**
 * 店铺初审通过/驳回
 * id:  店铺ID
 * isPass 审批状态，true-审批通过，false-驳回
 * rejectReason 驳回状态
*/
export const rejectStatus = (data) => {
  return request.$sams({
    url: '/store/approve/first',
    method: 'POST',
    data
  })
}

/**
 * 店铺复审通过/驳回
 * id:  店铺ID
 * isPass 审批状态，true-审批通过，false-驳回
 * rejectReason 驳回状态
*/
export const reviewStatus = (data) => {
  return request.$sams({
    url: '/store/approve/recheck',
    method: 'POST',
    data
  })
}

/**
 *  公司下拉选接口
 */
export const companyOptions = () => {
  return request.$sams({
    url: '/store/company/options',
    method: 'POST'
  })
}

/**
 *  提审
 */
export const arrroveBring = (data) => {
  return request.$sams({
    url: '/store/approve/bring',
    method: 'POST',
    data
  })
}

/**
 * 批量提审
 */
export const allBringBatch = (data) => {
  return request.$sams({
    url: '/store/approve/bring-batch',
    method: 'POST',
    data
  })
}

/**
 * 店铺批量复审通过/驳回
 */
export const allRecheckBatch = (data) => {
  return request.$sams({
    url: '/store/approve/recheck-batch',
    method: 'POST',
    data
  })
}

/**
 * 店铺批量初审通过/驳回
 */
export const allFirstBatch = (data) => {
  return request.$sams({
    url: '/store/approve/first-batch',
    method: 'POST',
    data
  })
}

/**
 * 财务信息批量编辑
 */
export const updateALLFinanceInfo = (data) => {
  return request.$sams({
    url: '/store/approve/finance-info/update-batch',
    method: 'POST',
    data
  })
}
/**
 * 获取外链SKU前缀,水印码
 */
export const approveCode = () => {
  return request.$sams({
    url: '/store/approve/code-id',
    method: 'GET'
  })
}
/**
 * 店铺申请接口-模板下载
 */
export const downloadTemp = () => {
  return request.$sams({
    url: '/store/approve/download-template',
    method: 'GET',
    responseType: 'blob'
  })
}
/**
 * 店铺申请-批量导入
 */
export const approveImport = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$sams({
    url: '/store/approve/import-data',
    method: 'POST',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    reportError: false
  })
}

/**
 * 店铺申请接口-模板下载
 */
export const unimproved = (data) => {
  return request.$sams({
    url: '/store/approve/unimproved',
    method: 'POST',
    data
  })
}
/**
 * 店铺申请列表统计(状态)
*/
export const statisticsStatus = (data) => {
  return request.$sams({
    url: '/store/approve/statistics',
    method: 'POST',
    data
  })
}
// 店铺驳回列表-导出
export const exportUnimproved = (data) => {
  return request.$sams({
    url: '/store/approve/export-unimproved',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}

// 店铺名词下拉列表
export const storeApproveOption = (data) => {
  return request.$sams({
    url: '/store/approve/options',
    method: 'POST',
    data
  })
}
// 资料待完善-批量提审
export const allImprovedBatch = (data) => {
  return request.$sams({
    url: '/store/approve/unimproved-batch',
    method: 'POST',
    data
  })
}

/**
 * 店铺资料待完善-编辑
 */
export const updateUnimproved = (data) => {
  return request.$sams({
    url: '/store/approve/update-unimproved',
    method: 'post',
    data
  })
}
