import request from '@/router/axios'
/**
 * 物流退单分页查询接口
 * @param {*} code
 */
export const getList = (params) => {
  return request.$otms_forecast({
    url: '/forecast/orderRefuse/list',
    method: 'get',
    params
  })
}

// 下载模板
export const downloadTemplate = (params) => {
  return request.$otms_forecast({
    url: '/forecast/orderRefuse/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 导入模板
export const importOrderRefuse = (params) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('type', params.templateType)
  formData.append('channelCode', params.channelCode)

  return request.$otms_forecast({
    url: '/forecast/orderRefuse/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
// 导出邮编限制
export const exportOrderRefuse = (params) => {
  return request.$otms_forecast({
    url: '/forecast/orderRefuse/export',
    method: 'get',
    responseType: 'blob',
    timeout: 60000,
    params
  })
}
