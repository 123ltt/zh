import request from '@/router/axios'
/**
 * 出口列表下载模板
*/
export function exportTempDownload() {
  return request.$trs({
    url: '/exportProduct/exportBatchUpdExcel',
    method: 'get',
    responseType: 'blob'
  })
}
/**
 * 出口信息导入
*/
export function exportInfoUpload({ file }) {
  const formData = new FormData()
  formData.append('file', file)
  return request.$trs({
    url: '/exportProduct/batchImportUpd',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    reportError: false
  })
}

/**
 * 出口列表
 */
export function exportList(params) {
  return request.$trs({
    url: '/exportProduct/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 删除
export function rowDelete(ids) {
  return request.$trs({
    url: '/exportProduct/remove',
    method: 'post',
    params: { ids }
  })
}

// 保存
export function rowSave(data) {
  return request.$trs({
    url: '/exportProduct/update',
    method: 'post',
    data
  })
}
