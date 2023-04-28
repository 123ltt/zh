function replaceNullUndefined(val, replacer = '') {
  return (val === null || val === undefined) ? replacer : val
}

function replaceStr(str = '') {
  return (str || '').replace(/\\"/g, '"')
}

/**
 * 基本信息字段默认值并与接口的数据进行合并
 * @param {object} data 接口返回的数据
 */
export function basicsInfoFields(data) {
  data.categoryId = data.categoryPathIdList
  data.referenceUrls = [].concat(data.referenceUrls || '') // 如果是字符串则转成数组
  data.ascription = data.ascription === 0 ? '' : data.ascription
  data.ascriptionTenantOrDeptIds = data.ascriptionTenantOrDeptIds || []
  data.lstAttr = data.lstAttr || []

  ;[['minimumOrder', ''],
    ['deliveryDay', ''],
    ['brandType', 1], // 避免后端给0
    ['status', ''],
    ['ascription', '2']
  ].forEach(([key, val]) => {
    data[key] = String(replaceNullUndefined(data[key], val))
  })

  data.descriptionHtml = replaceStr(data.descriptionHtml)
  data.packageDescription = replaceStr(data.packageDescription)
  data.descriptionCn = replaceStr(data.descriptionCn)

  // 用于存储纯文本，便于校验编辑器是否为空
  data.__descriptionHtml = data.descriptionHtml
  data.__packageDescription = data.packageDescription
  data.__descriptionCn = data.descriptionCn

  return Object.assign({
    categoryId: [],
    devType: 0,
    isSampling: false,
    brandName: '',
    lstAttr: [],
    ifOnSale: 1,
    subTitleObjList: [{ title: '' }],
    productIsCe: '',
    nwSku: '',
    distributionType: ''
  }, data || {})
}

export function logisticsInfoFields(data = {}) {
  if (typeof data.packagingType === 'number') {
    data.packagingType = String(data.packagingType)
  }
  data.logisticsAttrIds = data.logisticsAttrIds || []
  return Object.assign({}, data)
}

export function safetyAuditInfoFields(data) {
  data.infringementType = data.infringementType ? data.infringementType.split(',') : []
  data.infringementSuspectedType = String(replaceNullUndefined(data.infringementSuspectedType))
  data.infringementLevel = String(replaceNullUndefined(data.infringementLevel))
  return Object.assign({
    infringeContent: '',
    infringementReason: '',
    lstAttr: [],
    forbiddenPlatformCountryList: []
  }, data || {})
}

export function multiLangInfoFields() {
  return {
    productName: '',
    keywords: '',
    description: '',
    feature: ''
  }
}
