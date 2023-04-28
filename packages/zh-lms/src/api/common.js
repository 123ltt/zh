import request from '@/router/axios'

export function batchfeedList(params) {
  return request.$lmsData({
    url: '/batchfeed/list',
    method: 'get',
    params: { ...params }
  })
}
/**
 * 获取批量处理类型
 */
export function batchFeedType() {
  return request.$lmsData({
    url: '/constant/batchFeedType',
    method: 'get'
  })
}
/**
 * 平台下拉列表
 */
export const platformOption = () => {
  return request.$sams({
    url: '/store/platform/options',
    method: 'POST'
  })
}
/**
 * 明细
 */
export const batchfeedDetailList = ({ current, size }, params) => {
  return request.$lmsData({
    url: '/batchfeeddetail/list',
    method: 'post',
    params: { current, size },
    data: { ...params }
  })
}
/**
 * 下载结果
 * @param {number} id 模板id
 * @returns 文件流
 */
export const batchfeedDown = (id) => {
  return request.$lmsData({
    url: '/batchfeed/download',
    method: 'get',
    params: id,
    responseType: 'blob'
  })
}
/**
 * 图片域名列表
 */
export const imglist = (data) => {
  return request.$lmsData({
    url: '/imageConfig/list',
    method: 'POST',
    data
  })
}
// 添加/编辑域名
export const imgAddorUpdate = (type, data) => {
  const url = type === 'add' ? '/imageConfig/save' : '/imageConfig/update'
  return request.$lmsData({
    url,
    method: 'POST',
    data
  })
}
// 平台全称
export const platformAll = (data) => {
  return request.$sams({
    url: '/store/platform/page',
    method: 'POST',
    data
  })
}
// 图片域名管理日志
export const logList = (data) => {
  return request.$lmsData({
    url: '/dataOpsLog/list',
    method: 'POST',
    data
  })
}
// 自动刊登SKU
export const getAutoPublication = ({ current, size, descs = 'create_time' }, params) => request.$lmsData({
  url: '/autoPublish/list',
  method: 'post',
  params: { current, size, descs },
  data: { ...params }
})

/**
 * @description: 导入模板
**/
export function importTemplate({ file }) {
  const formData = new FormData()
  formData.append('file', file)
  return request.$lmsData({
    url: '/imageConfig/importFile',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    responseType: 'blob',
    reportError: false
  })
}
/**
 * 自动刊登-导出接口
 * @param {*} data
 * @returns
 */
export const autoPulicationApi = (data) => {
  return request.$lmsData({
    url: '/autoPublish/download',
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 重新分配listing负责人 列表
export function listingUserFeedList({ current, size, descs = 'create_time' }, data) {
  return request.$lmsData({
    url: '/listingUserFeed/list',
    method: 'post',
    params: { current, size, descs },
    data
  })
}
// 重新分配listing负责人 新增
export function listingUserFeedSave(data) {
  return request.$lmsData({
    url: '/listingUserFeed/save',
    method: 'post',
    data
  })
}
// 重新分配listing负责人 edit
export function listingUserFeedUpdate(data) {
  return request.$lmsData({
    url: '/listingUserFeed/update',
    method: 'post',
    data
  })
}

// 重新分配listing负责人日志
export function dataOpsLog({ current, size }, data) {
  return request.$lmsData({
    url: '/dataOpsLog/list',
    method: 'post',
    params: { current, size },
    data
  })
}
