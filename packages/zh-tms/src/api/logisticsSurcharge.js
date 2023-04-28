import request from '@/router/axios'
// import { delete } from 'vue/types/umd'
/**
 * 物流附加费列表 - 分页查询
 * @param {object} params
 * dwgId chargeTpe size current
 */
export const queryData = (current, size, params) => {
  return request.$tms_provider({
    url: '/additionalRule/pageRule',
    method: 'get',
    params: {
      current,
      size,
      ...params
    }
  })
}

/**
 * 物流附加费列表详情
 * @param {number} id
 */
export const getDetail = id => {
  return request.$tms_provider({
    url: '/additionalRule/findRule?id=' + id,
    method: 'get'
  })
}

/**
 * http://showdoc.zehui.local/web/#/77?page_id=501
 * 物流附加费新增/修改接口
 * @param {object} params
 */
export const updateRule = data => {
  return request.$tms_provider({
    url: '/additionalRule/saveOrUpdateRule',
    method: 'post',
    data
  })
}
/**
 * http://showdoc.zehui.local/web/#/77?page_id=501
 * 物流附加费id查询列表
 * @param {object} params
 */
export const findRule = id => {
  return request.$tms_provider({
    url: '/additionalRule/findRule?id=' + id,
    method: 'get'
  })
}
/**
 * http://showdoc.zehui.local/web/#/77?page_id=501
 * 物流附加费id删除数据
 * @param {object} params
 */
export const removeRule = params => {
  return request.$tms_provider({
    url: '/additionalRule/removeRule',
    method: 'post',
    data: params
  })
}
// 可发仓库
export const useWarehouse = (countryCodes) => request.$tms_provider({
  url: '/base/warehouse/listWarehouseByCountryCodes',
  method: 'get',
  params: {
    countryCodes
  }
})
// 校验公式
export const checkCondition = params => {
  return request.$tms_provider({
    url: '/additionalRule/checkCondition',
    method: 'post',
    data: params
  })
}
// 附加费-下载邮编模板
export const downloadCodeTemplatePost = type => {
  return request.$tms_provider({
    url: '/additionalRule/downloadCodeTemplate', // 之前接口
    method: 'get',
    responseType: 'blob'
  })
}
/** 附加费-邮编导入 */
export const importExcelPost = (params) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('templateType', params.templateType)
  formData.append('isCovered', params.isCovered)
  formData.append('lId', params.lId)
  formData.append('channelId', params.channelId)
  return request.$tms_provider({
    url: '/additionalRule/importExcel', // 之前接口
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
/**
 *
 * 分割线之前的接口
 */
// 下载价格模板
export const downloadCodeTemplate = type => {
  return request.$tms_provider({
    // url: `/additionalRule/downloadCodeTemplate?ruleType=${type}`, // 之前接口
    url: `/channelPriceRules/export-template?ruleType=${type}`, // 当前接口
    method: 'get',
    responseType: 'blob'
  })
}

// 下载通用邮编模板
export const downloadUsualTemplate = (type, lId) => request.$tms_provider({
  url: type === 1 ? '/codeDivision/downloadTemplate' : '/codeDivision/downloadSpecialTemplate',
  method: 'get',
  responseType: 'blob',
  params: {
    lId
  }
})
// 下载特殊邮编模板
// export const downloadSpecialTemplate = (lId) => request({
//   url: 'tms-base/codeDivision/downloadSpecialTemplate',
//   method: 'get',
//   responseType: 'blob',
//   params: {
//     lId
//   }
// })
// 导入价格模板
export const importExcel = (params) => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('templateType', params.templateType)
  formData.append('isCovered', params.isCovered)
  formData.append('lId', params.lId)
  formData.append('channelId', params.channelId)
  return request.$tms_provider({
    url: '/channelPriceRules/import-priceRules', // 当前接口
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
// 通用邮编模板导入
export const importPostCode = params => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('lId', params.lId)
  formData.append('channelId', params.channelId)
  return request.$tms_provider({
    url: '/codeDivision/importCodeRule',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
// 特殊邮编模板导入
export const importSpecialPostCode = params => {
  const formData = new FormData()
  formData.append('file', params.file)
  formData.append('lId', params.lId)
  formData.append('channelId', params.channelId)
  return request.$tms_provider({
    url: '/codeDivision/importSpecialCodeRule',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
// 邮编导出接口
export const exportPostcodeExcel = (lId) => request.$tms_provider({
  url: '/codeDivision/exportCodeRule',
  method: 'get',
  responseType: 'blob',
  params: {
    lId
  }
})
// 价格类型导出
export const exportPriceTypeExcel = (lId, templateType) => request.$tms_provider({
  url: templateType === 1 || templateType === 2 ? '/channelPriceRules/export-priceRules' : '/channelPriceRules/export-special-priceRules',
  method: 'get',
  responseType: 'blob',
  params: {
    lId,
    templateType
  }
})
