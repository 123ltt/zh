import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$pss({
    url: '/visitFactoryApply/page',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 主要类目接口
export const getCateGoryChild = () => {
  return request.$pss({
    url: '/category/getCateGoryChild',
    method: 'get'
  })
}

// 地址接口
export const getlistAddress = () => {
  return request.$pss({
    url: '/supplierDistrict/listAddress',
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

/**
 *
 * @param {String} id 根据id拿其他信息
 * @returns
 */
export const getSupplierInfo = (id) => {
  return request.$pss({
    url: '/supplierInfo/detail',
    method: 'get',
    params: {
      id
    }
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
export const importApplyExcel = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$pss({
    url: '/visitFactoryApply/uploadVisitFactoryApplyExcel',
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
    url: '/visitFactoryApply/save',
    method: 'post',
    data: obj
  })
}

// 编辑
export const update = (obj) => {
  return request.$pss({
    url: '/visitFactoryApply/update',
    method: 'post',
    data: obj
  })
}

// 编辑
export const adjust = (obj) => {
  return request.$pss({
    url: '/visitFactoryApply/adjust',
    method: 'post',
    data: obj
  })
}

// 审核
export const audit = (obj) => {
  return request.$pss({
    url: '/visitFactoryApply/audit',
    method: 'post',
    data: obj
  })
}

// 访厂
export const visit = (obj) => {
  return request.$pss({
    url: '/visitFactoryApply/visit',
    method: 'post',
    data: obj
  })
}

// 提交
export const submit = ({ id, status }) => {
  return request.$pss({
    url: '/visitFactoryApply/submit',
    method: 'post',
    params: {
      id,
      status
    }
  })
}

// 删除
export const remove = (ids) => {
  return request.$pss({
    url: '/visitFactoryApply/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$pss({
    url: '/visitFactoryApply/detail',
    method: 'get',
    params: {
      id
    }
  })
}
