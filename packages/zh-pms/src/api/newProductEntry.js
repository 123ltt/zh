import request from '@/router/axios'

// 新品录入提交接口
export const addData = data => {
  return request.$pms({
    url: '/newProduct/saveByNormal',
    method: 'POST',
    data
  })
}

// 供应商产品列表导入-开发新品
export const importVendor = data => {
  return request.$pms({
    url: '/newProduct/saveByVendorProductList',
    method: 'POST',
    data
  })
}

/**
 * 通过Excel批量提交保存新品录入
 * @param {String} fileName 原始文件名
 * @param {String} linkFileSource 文件链接
 */
export const uploadNewProductExcelInfo = (fileName, linkFileSource) => {
  return request.$pms({
    url: '/newProduct/uploadNewProductExcelInfo',
    method: 'post',
    data: { fileName, linkFileSource }
  })
}
// 下载新品导入Excel模板
export const downloadTemplate = () => request.$pms({
  url: '/newProduct/downloadTemplate',
  method: 'get',
  // headers: {
  //   'content-type': 'application/x-www-form-urlencoded'
  // }
  responseType: 'blob'
})

// 获取所有供应商列表信息
export const getSupplierList = (supplierName = '') => {
  return request.$pss({
    url: '/client/supplierInfo/getSupplierInfo',
    params: { supplierName }
  })
}

// 获取商品列表
export const queryGoods = ({ supplierName, current, size }) => {
  return request.$pss({
    url: '/client/supplierGoods/listUndevelopGoods',
    params: {
      supplierName, current, size
    }
  }).then(res => {
    (res.data.records || []).forEach(item => {
      // 供应商传过来的单位是 kg，需要转成 g
      item.goodsWeight = Number(item.goodsWeight) * 1000 || ''
    })
    return res
  })
}
