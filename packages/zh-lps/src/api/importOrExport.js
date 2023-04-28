import request from '@/router/axios'

/**
 *获取上传下载列表数据
 */
export const getImportOrExportList = (current, size, params) => {
  return request.$lps({
    url: '/file-task/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 *删除列表数据
 */
export const deleteImportOrExportRow = (data) => {
  return request.$lps({
    url: '/file-task/remove',
    method: 'post',
    params: {
      ...data
    }

  })
}

/**
 *上传
 */
export const uploadFile = (data) => {
  return request.$lps({
    url: '/file-task/save',
    method: 'post',
    data: {
      ...data
    }

  })
}
