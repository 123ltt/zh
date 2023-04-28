import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/visitFactoryRecord/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 供应商名称接口
export const getListAll = () => {
  return request.$pss({
    url: '/supplierInfo/listImportedSupplierInfos',
    method: 'get'
  })
}

// 供应商等级接口
export const getGrade = () => {
  return request.$pss({
    url: '/visitFactoryRecord/list/grade',
    method: 'get'
  })
}

// 角色接口
export const getUserList = () => {
  return request.$ams({
    url: '/user/conciseInfo/page?current=1&size=-1',
    method: 'get'
  })
}

// 下载模板
export const downloadTemplate = ({ visitTime, verifyName, entourageNames, supplierName }) => {
  const supplierRatingDTO = {
    visitTime: visitTime,
    verifyName: verifyName,
    entourageNames: entourageNames,
    supplierName: supplierName
  }
  return request.$pss({
    url: '/visitFactoryRecord/downloadSupplierRatingTemplate',
    method: 'post',
    responseType: 'blob',
    data: supplierRatingDTO
  })
}

// 导入
export const importTable = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$pss({
    url: '/visitFactoryRecord/uploadSupplierRatingTemplate',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 二次导入
export const secondaryImport = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/oss/endpoint/put-file?fileType=common',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

// 新增
export const save = (obj) => {
  return request.$pss({
    url: '/visitFactoryRecord/save',
    method: 'post',
    data: obj
  })
}

// 编辑
export const update = (obj) => {
  return request.$pss({
    url: '/visitFactoryRecord/update',
    method: 'post',
    data: obj
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/visitFactoryRecord/deleteDraft',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/visitFactoryRecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}
