// 线上配置接口
import request from '@/router/axios'

// 线上服务下拉列表
export const getOnlineServiceAllList = () => {
  return request.$tms_optimize({
    url: '/onlineChannelService/listAll',
    method: 'get'
  })
}

// 分页
export const getOnlineServiceList = (current, size, params) => {
  return request.$tms_optimize({
    url: '/onlineChannelService/list',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

// 新增接口
export const onlineServiceSave = (params) => {
  return request.$tms_optimize({
    url: '/onlineChannelService/save',
    method: 'post',
    data: params
  })
}

// 线上模板下载
export const onlineServiceDownloadTemplate = (params) => {
  return request.$tms_optimize({
    url: '/onlineChannelService/exportTemplate',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 线上模板导入
export const onlineServiceImportExcel = (params) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('hasFilter', params.templateType)
  return request.$tms_optimize({
    url: '/onlineChannelService/importExcel', // 当前接口
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 线上数据导出
export const onlineChannelServiceExport = (params) => {
  return request.$tms_optimize({
    url: '/onlineChannelService/exportData',
    method: 'get',
    responseType: 'blob',
    timeout: 60000,
    params
  })
}

// 删除
export const onlineChannelServiceRemove = (ids) => {
  return request.$tms_optimize({
    url: '/onlineChannelService/remove',
    method: 'post',
    params: { ids }
  })
}

// 详情
export const onlineServiceDetail = (params) => {
  return request.$tms_optimize({
    url: '/onlineChannelService/detail',
    method: 'get',
    params
  })
}
