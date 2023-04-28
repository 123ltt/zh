import request from '@/router/axios'

// 列表信息分页接口
export const getList = (current, size, params) => {
  return request.$purchase({
    url: '/priceList/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 获取商品信息
export const getGoodsInfo = (productSku) => {
  return request.$purchase({
    url: '/priceList/getGoodsInfo',
    method: 'get',
    params: {
      productSku
    }
  })
}

// 新增保存
export const save = (row) => {
  return request.$purchase({
    url: '/priceList/save',
    method: 'post',
    data: row
  })
}

// 修改
export const update = (row) => {
  return request.$purchase({
    url: '/priceList/update',
    method: 'post',
    data: row
  })
}

// 提交
export const submit = (row) => {
  return request.$purchase({
    url: '/priceList/submit',
    method: 'post',
    data: row
  })
}

// 删除
export const remove = (ids) => {
  return request.$purchase({
    url: '/invRule/deleteDraft',
    method: 'post',
    params: {
      ids
    }
  })
}

// 详情
export const getDetail = (id) => {
  return request.$purchase({
    url: '/priceList/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 详情
export const getAdjustHis = (id) => {
  return request.$purchase({
    url: '/priceList/getAdjustHis',
    method: 'get',
    params: {
      id
    }
  })
}

// 编辑详情
export const getUpdateDetail = (id) => {
  return request.$purchase({
    url: '/priceList/getUpdateDetail',
    method: 'get',
    params: {
      id
    }
  })
}

// 获取调价信息
export const getAdjustDetail = (priceListIds) => {
  return request.$purchase({
    url: '/priceList/getAdjustDetail',
    method: 'post',
    data: priceListIds
  })
}

// 获取审核信息
export const getVerifyDetail = (priceListIds) => {
  return request.$purchase({
    url: '/priceList/getVerifyDetail',
    method: 'post',
    data: priceListIds
  })
}

// 调价
export const adjust = (row) => {
  return request.$purchase({
    url: '/priceList/adjust',
    method: 'post',
    data: row
  })
}

// 审核
export const verify = (row) => {
  return request.$purchase({
    url: '/priceList/verify',
    method: 'post',
    data: row
  })
}

// 下载模板
export const exportPriceList = (id) => {
  return request.$purchase({
    url: '/priceList/exportPriceList',
    method: 'get',
    responseType: 'blob',
    params: {}
  })
}

// 导入
export const importPriceList = ({ file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.$purchase({
    url: '/priceList/importPriceList',
    method: 'post',
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
