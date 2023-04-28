import { getCarAttrTemplateList } from '@/api/aliExpress/temp.js'
import { getSkuAffix, getTranslate } from '@/api/lmsCommon.js'
import { deepClone } from '@/util/util'

import { dynamic } from './detail/detail.js'

/**
 * @description lazada列表Tab 状态：{ label, 总条数}
 **/
export const tabActiveList = [
  { label: 'Draft', value: 1, auditTabActiveTotal: 0 },
  { label: 'Approving', value: 2, auditTabActiveTotal: 0 },
  { label: 'Uploading', value: 3, auditTabActiveTotal: 0 },
  { label: 'Upload Failed', value: 4, auditTabActiveTotal: 0 },
  { label: 'Auditing', value: 12, auditTabActiveTotal: 0 },
  { label: 'Refuse', value: 13, auditTabActiveTotal: 0 },
  { label: 'Online', value: 5, auditTabActiveTotal: 0 },
  { label: 'Updating', value: 6, auditTabActiveTotal: 0 },
  { label: 'Update Failed', value: 7, auditTabActiveTotal: 0 },
  { label: 'Match Failed', value: 8, auditTabActiveTotal: 0 },
  { label: 'Canceling', value: 9, auditTabActiveTotal: 0 },
  { label: 'Canceled', value: 10, auditTabActiveTotal: 0 }
]
/**
 *  @description 区域调价的区域列表
 *  @国家代码 https://www.gegeurope.com/Pages/CountryCode.htm
 * **/
export const countryList = [
  { code: 'RU', eName: 'Russia Federation', chName: '俄罗斯联邦' },
  { code: 'US', eName: 'United States', chName: '美国' },
  { code: 'CA', eName: 'Canada', chName: '加拿大' },
  { code: 'ES', eName: 'Spain', chName: '西班牙' },
  { code: 'FR', eName: 'France', chName: '法国' },
  { code: 'UK', eName: 'United Kiongdom', chName: '英国' },
  { code: 'NL', eName: 'Netherlands', chName: '荷兰' },
  { code: 'IL', eName: 'Israel', chName: '以色列' },
  { code: 'BR', eName: 'Brazil', chName: '巴西' },
  { code: 'CL', eName: 'Chile', chName: '智利' },
  { code: 'AU', eName: 'Australia', chName: '澳大利亚' },
  { code: 'UA', eName: 'Ukraine', chName: '乌克兰' },
  { code: 'BY', eName: 'Belarus', chName: '白俄罗斯' },
  { code: 'JP', eName: 'Japan', chName: '日本' },
  { code: 'TH', eName: 'Thailand', chName: '泰国' },
  { code: 'SG', eName: 'Singapore', chName: '新加坡' },
  { code: 'KR', eName: 'Korea', chName: '韩国' },
  { code: 'ID', eName: 'Indonesia', chName: '印度尼西亚' },
  { code: 'MY', eName: 'Malaysia', chName: '马来西亚' },
  { code: 'PH', eName: 'Philippines', chName: '菲律宾' },
  { code: 'VN', eName: 'Vietnam', chName: '越南' },
  { code: 'IT', eName: 'Italy', chName: '意大利' },
  { code: 'DE', eName: 'Germany', chName: '德国' },
  { code: 'SA', eName: 'Saudi Arabia', chName: '阿拉伯' },
  { code: 'AE', eName: 'United Arab Emirates', chName: '阿拉伯联合酋长国' },
  { code: 'PL', eName: 'Poland', chName: '波兰' },
  { code: 'TR', eName: 'Turkey', chName: '土耳其' }
]

/**
 * @description 获取仓库列表
 * @param countryCode 国家简码
 * @param warehouseId 仓库id
 * @param fromList 来源是否列表搜索显示
 * **/
export const local = (no) => {
  return {
    affixContent: '',
    type: 'SELF_BUILT',
    warehouseId: 'Z20',
    warehouseName: '本地仓'
  }
}
export const Separator = '-'
/**
* @description 是否海外仓库判断情况
* 第三方仓：本地都是海外仓
* 平台仓库：本地仓
* 自建仓： 深圳仓-本地仓，泽汇-海外仓
* 海外仓：都是海外仓
*/
export function getWareHouseList(countryCode, fromList) {
  return getSkuAffix(countryCode).then(res => {
    const codeList = {}
    const data = res.data || []
    data.forEach(item => {
      if (countryCode.includes(item.countryCode)) {
        const list = [local()]
        item.affixList.forEach(affix => {
          affix.warehouseList.forEach(item => {
            // 自建仓/深圳仓 已被本地仓替换
            if (item.warehouseName.indexOf('/自建仓/深圳仓') === -1) {
              item.warehouseName = (item.warehouseName.substring(item.warehouseName.length - 1) === '/') ? item.warehouseName.substring(0, item.warehouseName.length - 1) : item.warehouseName
              // /替换 >
              item.warehouseName = item.warehouseName.substring(1).replaceAll('/', '>')
              list.push({
                affixContent: affix.affixContent,
                type: item.type,
                // 前缀-规则名称-仓库编码
                warehouseId: affix.affixContent + Separator + affix.ruleName + Separator + item.deliveryWarehouse,
                warehouseName: `${affix.affixContent ? '(' + affix.affixContent + ')' : ''}${item.warehouseName}(${affix.ruleName})`,
                isVirtual: affix.isVirtual,
                virtualWarehouse: item.virtualWarehouse
              })
            }
          })
        })
        codeList[item.countryCode] = list
      }
    })
    // 没有获取到的给本地仓库
    countryCode.filter(code => {
      if (!codeList[code]) {
        codeList[code] = [local('no')]
      }
    })
    // 来源是列表搜索整合去重处理
    if (fromList) {
      const list = Object.values(codeList)
      const cc = {}
      list.forEach(item => {
        item.forEach(o => {
          cc[o.warehouseId] = o
        })
      })
      const searchList = Object.values(cc)
      return searchList
    }
    return codeList
  })
}
// 是否海外仓：不是虚拟仓 &&（第三方仓 || 海外仓 || 自建泽汇仓）
export function isOverseasWarehouse(data) {
  return (data && !data.isVirtual && (data.wareType === 'THIRD' || data.wareType === 'OVERSEA' || (data.wareType === 'SELF_BUILT' && data.warehouseId.indexOf('SELF_BUILT,ZH') > -1)))
}

/**
 * @description 打包重量 转千克
 * */
export function weightKg(weight) {
  if (weight) {
    return (weight / 1000).toFixed(2) * 1
  } else {
    return 0
  }
}
/**
 * @description 处理sku详情的图片
 * @param {Object}data
 * */
export function dealImage(data, isEdit) {
  data.imgShowList = []
  data.imageUrls = []
  // 图片列表取分辨率为800*800
  const imgs = data.imageInfo && data.imageInfo.find(item => item.widthHeight === '800*800' || item.widthHeight === '1000*1000')
  const imgUrls = []
  if (imgs) {
    imgs.lstImage.map(p => {
      imgUrls.push({
        isCheck: false,
        imageUrl: p.imageUrl
      })
    })
    data.imgShowList = imgUrls
  }
  return imgUrls
}
// 处理详情图片的回显格式 主图1张，附图11张
export function showListingDetailImage(imgs) {
  const imgShowList = []
  if (imgs && imgs.length) {
    const imgList = imgs.split(';')
    imgList.filter((item, index) => {
      imgShowList.push({ imageUrl: item, isCheck: true })
    })
  }
  return { imgShowList }
}
// 处理详情营销图片的回显格式 Tips：白底图(方图) type: 2，场景图(长图) type: 1
export function showListingDetailMarketImage(marketImages) {
  const imgShowList = [
    { url: '', imageType: 1, isCheck: false },
    { url: '', imageType: 2, isCheck: false }
  ]
  if (marketImages) {
    marketImages.forEach(item => {
      imgShowList.find(img => {
        const { imageType, url } = item
        if (img.imageType === imageType) {
          img.url = url
          img.isCheck = true
        }
      })
    })
  }
  return imgShowList
}
/**
 * @description 处理编辑刊登sku详情返回的图片回显
 * @param {Object}pmsSku sku详情 from pms
 * @param {Object}baseProductInfo sku基本信息
*/
export function dealEditSkuImage(pmsSku, baseProductInfo) {
  const lstSkuImgs = dealImage(pmsSku, 'isEdit')
  const diffImgList = []
  lstSkuImgs.map(skuImg => {
    const i = baseProductInfo.imgShowList.findIndex(showImg => skuImg.imageUrl === showImg.imageUrl)
    i === -1 && diffImgList.push(skuImg)
  })
  baseProductInfo.imgShowList = [...baseProductInfo.imgShowList, ...diffImgList]
}
/**
 * @description 处理产品分组数据格式 转tree
 **/
export function dealProductGroupData(list = [], id = 'id', parentId = 'parent_Id', rooId = 0) {
  const tree = list.filter(father => {
    // 循环所有项
    const fatherCopy = father
    const branchArr = list.filter(child => fatherCopy[id] === child[parentId]) // 返回每一项的子级数组
    if (branchArr.length > 0) {
      fatherCopy.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
      fatherCopy.isLeaf = true
    } else {
      fatherCopy.isLeaf = false
    }
    return fatherCopy[parentId] === rooId // 返回第一层
  })
  return tree // 返回树形数据
}
/**
 * @description 根据叶子节点groupId找出全路径groupId
 **/
export function showGroupId(list, groupId) {
  const groupIds = findPath(list, [groupId])
  return groupIds[0]
}
export function findPath(data, findArr) {
  const temp = []
  findArr.forEach((find, i) => {
    temp[i] = []
    data.forEach(item => {
      if (item.groupId === find) {
        temp[i] = [find]
      } else if (item.children) {
        const arr = []
        arr[i] = find
        const subFind = findPath(item.children, arr)
        if (subFind[i].length) {
          temp[i] = [item.groupId, ...subFind[i]]
        }
      }
    })
  })
  return temp
}

/**
 * @description 车型库模板属性
 **/
export const carAttrTemplate = {
  show: false,
  list: []
}

/**
 * @description 获取车型库模板列表
 **/
export function getCarAttrTempList(that) {
  const { productSpu, categoryId } = that.baseProductInfo
  if (productSpu && categoryId) {
    carAttrTemplate.show = true
    !that.isDetail && that.$emit('productLoadingStart')
    getCarAttrTemplateList({ sku: productSpu }).then(res => {
      carAttrTemplate.list = res.data
    }).finally(() => {
      !that.isDetail && that.$emit('productLoadingEnd')
    })
  }
}

/**
 * @description 赋值属性
 **/
export const otherK = ['其他', '其它', 'other', 'Other']
export function setAttrValue(data, productAttrs = [], that) {
  const varAttr = [] // 变体属性
  const attrList = [] // 类目属性
  carAttrTemplate.show = false
  // getCarAttrTempList(that)
  data.forEach((item, index) => {
    if (typeof item.valueJson === 'string' || item.valueJson === null) {
      setAttrItemType(item)
    }
    if (item.sku) {
      varAttr.push(item)
    } else {
      // 有这个属性id的就代表有车型库 231208804
      if (item.attributeId === 231208804) {
        getCarAttrTempList(that)
      } else {
        if (productAttrs) {
          productAttrs.find(o => {
            if (o.attrNameId === item.attributeId) {
              if (!item.value) {
                item.value = (o.attrValueId && o.attrValueId !== -1) ? o.attrValueId : o.attrValue
              } else if (Array.isArray(item.value)) {
                item.value.push(o.attrValueId)
              } else {
                item.value = [...new Set([item.value, o.attrValueId])]
              }
              if (Array.isArray(item.valueJson)) { // 判断值是否是'其他'
                item.valueJson.find(j => {
                  if (otherK.includes(j.label) && (o.attrValueId === -1 || o.attrValueId === null)) {
                    item.isOhter = true
                    item.otherValue = o.attrValue
                    item.value = j.id
                  }
                })
              }
            } else if (item.valueJson) {
              item.valueJson.forEach(b => {
                if (b.attributes) {
                  b.attributes.forEach(t => {
                    const attributes = JSON.parse(t)
                    if (attributes.attributeId === o.attrNameId) {
                      setAttrItemType(attributes)
                      data.splice(index + 1, 0, attributes)
                    }
                  })
                }
              })
            }
          })
        }
        // 属性是Origin(产地)默认选中 中国
        if (item.attributeId === 219 && !item.value) {
          item.value = 9441741844
        }
        attrList.push(item)
      }
    }
  })
  const diyAttrList = []
  productAttrs.filter(item => {
    if (item.attrName && (item.attrNameId === -1 || item.attrNameId === null)) {
      diyAttrList.push(diyAttr(item.attrName, item.attrValue))
    }
  })
  attrList.push(...diyAttrList)

  return { varAttr, attrList, diyAttrList }
}

export function setAttrItemType(item) {
  item.valueJson = JSON.parse(item.valueJson) || []
  item.valueJson.forEach(val => {
    val.names = JSON.parse(val.names)
    // val.label = `${val.names.zh}(${val.names.en})`
    val.label = val.names.zh
  })
  item.value = '' // 值
  if (item.attributeShowTypeValue === 'list_box' || item.attributeShowTypeValue === 'brand') {
    item.type = 'listbox' // 下拉列表
  } else if (item.attributeShowTypeValue === 'check_box') {
    item.value = []
    item.type = 'checkbox' // 复选组
  } else if (item.attributeShowTypeValue === 'interval') {
    // item.type = 'interval'
    // item.value1 = ''
    // item.value1 = ''
    item.type = 'text'
  } else if (item.attributeShowTypeValue === 'input') {
    if (item.inputType === 'STRING') {
      item.type = 'text'
    } else if (item.inputType === 'NUMBER') {
      item.type = 'number'
    }
  }
}

export const warehouse = {
  list: {}
}

// 自定义属性值数据
export function diyAttr(name = 'name', value = '') {
  return {
    name,
    diy: true,
    type: 'text',
    value
  }
}

// sku变体信息
export function sku(data) {
  const baseData = {
    skuId: '',
    sendPlace: '',
    warehouseId: '', // 仓库
    warehouseList: [],
    productSku: '',
    skuPrice: '',
    skuDiscountPrice: '', // 促销价
    ipmSkuStock: 999,
    profitRate: '', // 利润率
    profitAmount: '', // 利润率
    costPrice: '', // 价格/库存参考信息
    skuProperty: []
  }
  return Object.assign(baseData, data)
}
export const variantEmpty = () => ({
  costPrice: '',
  packWeight: '',
  productName: '',
  productSku: '',
  productSkuShow: '',
  logisticsInfo: '',
  profitAmount: '',
  skuPrice: '',
  skuPriceError: '',
  profitRateError: '',
  profitAmountError: '',
  logistics: []
})

/**
 * @description 拼接skuId
 * @returns { sendPlace, skuProperty, skuId } { 发货地， 其他属性列表，skuId  }
 **/
export function combinSkuId(skuAttrList) {
  let sendPlace = null // sku属性(发货地)
  const skuProperty = [] // sku属性(发货地除外)
  const arr = [] // 有值的属性
  skuAttrList.filter(item => {
    if (item.value.length) {
      // 产品经理要求发货地排第一列，其他属性依次排在商品编码后面
      item.attributeId === 200007763 ? sendPlace = item : skuProperty.push(item)
      const attr = []
      item.value.map(val => attr.push(`${item.attributeId}:${val}`))
      arr.push(attr)
    }
  })
  const combs = [] // 组合属性id:值;
  const recursion = (arr, index = 0, c = []) => {
    if (arr.length - 1 < index) return combs.push(c)
    arr[index].forEach(item => {
      recursion(arr, index + 1, c.concat(item))
    })
  }
  recursion(arr)
  const skuId = combs.map(item => item.join(';'))
  return { sendPlace, skuProperty, skuId }
}
// savelinsting 描述转String
export function detailToString(data) {
  let detailList = []
  const moduleList = deepClone(data.detail.moduleList)
  // 产品信息模板
  const dynamicObj = dynamic()
  let hasProductTemp1 = false
  moduleList.forEach(item => {
    // 是自定义模板
    if (item.type === 'productTempHtml') {
      if (item.tempType === 1) { // 平台
        hasProductTemp1 = true
        dynamicObj.reference.moduleId = item.templateId
      } else if (item.tempType === 2) { // 自定义
        item.type = 'html'
        delete item.tempType
        detailList.push(item)
      }
    } else {
      detailList.push(item)
    }
  })
  // 平台产品信息模板显示在描述上方
  if (hasProductTemp1) {
    detailList = data.showPositionVal === 'showAbove' ? [dynamicObj, ...detailList] : [...detailList, dynamicObj]
  }

  const detail = {
    version: '2.0.0',
    moduleList: detailList
  }
  return JSON.stringify(detail)
}
// 描述转Json
export function detailToJson(data) {
  let detailInfo
  try {
    detailInfo = data.detail ? JSON.parse(data.detail) : {}
  } catch {
    detailInfo = {}
  }
  const moduleList = []
  let showPositionVal = ''

  detailInfo.moduleList && detailInfo.moduleList.forEach((item, index) => {
    const isCustomTemp = (item.type === 'html' && item.html.content.indexOf('<ul style="list-style: none; overflow: hidden;">') === 0)
    if (item.type === 'dynamic' || isCustomTemp) {
      item.type = 'productTempHtml'
      showPositionVal = index === 0 ? 'showAbove' : 'showBelow'
    }
    moduleList.push(item)
  })
  const detail = { version: '2.0.0', moduleList }
  return { showPositionVal, detail }
}
/**
 * @description 提交时sku列表值处理
 * @param customized 变体自定义属性
 * */
export function getSkuValues(variants, sendPlace, customized) {
  if (!variants || variants.length === 0) {
    return []
  }
  return variants.map(item => {
    const { skuId, logisticsInfo, productSku, sellerSku, warehouseId, ipmSkuStock, skuPrice, skuProperty, profitRate, profitAmount, costPrice } = item
    // sku属性 color,size...
    const property = skuProperty.map(p => {
      let propertyValueId = ''
      const skuIdArr = skuId.split(';')
      skuIdArr.filter(s => {
        const currAttr = s.split(':')
        if (p.attributeId === Number(currAttr[0])) {
          propertyValueId = currAttr[1]
        }
      })
      // 自定义图片
      let skuImage
      // 属性自定义名称
      let propertyValueDefinitionName
      for (const valueId in customized) {
        if (customized[valueId].attributeId === p.attributeId && valueId === propertyValueId) {
          skuImage = customized[valueId].customizedPic
          propertyValueDefinitionName = customized[valueId].customizedName
        }
      }
      return {
        skuPropertyId: p.attributeId,
        propertyValueId,
        skuImage,
        propertyValueDefinitionName
      }
    })
    //  sku属性 发货地
    const skuIdArr = skuId.split(';')
    let propertyValueId = ''
    skuIdArr.filter(s => {
      const currAttr = s.split(':')
      if (sendPlace.attributeId === Number(currAttr[0])) {
        propertyValueId = currAttr[1]
        property.push({
          skuPropertyId: sendPlace.attributeId,
          propertyValueId
        })
      }
    })
    return {
      logisticsInfoJson: JSON.stringify(logisticsInfo),
      skuId,
      productSku,
      sellerSku,
      warehouseId,
      ipmSkuStock,
      skuPrice,
      skuProperty: property,
      profitRate,
      profitAmount,
      costPrice
    }
  })
}
// 设置自定义变体属性回显
// export function setCustomizedVarArrt(data) {
//   const customized = {}
//   data.variants.forEach(item => {
//     item.skuProperty.forEach(prop => {
//       if (prop.propertyValueDefinitionName) {
//         customized[prop.propertyValueId] = {
//           customizedName: prop.propertyValueDefinitionName,
//           customizedPic: prop.skuImage,
//           propertyValueId: prop.propertyValueId,

//           attributeId: prop.skuPropertyId,
//           skuProperty: prop

//         }
//       }
//     })
//   })
//   return customized
// }
/**
 * @description 一键翻译 翻译字段：
 * @param {Object}refs  refs
 * @param {String}countryCode  翻译语种
 * */
export function getTranslateHandle(that, countryCode, translate) {
  const refs = that.$refs
  const baseInfoForm = refs.baseInfo.form
  const cateAttrForm = refs.categoryAttr.form
  const variantAttrRef = refs.variantAttr.$refs
  const detailRef = refs.otherInfo.$refs.detail
  const textList = []
  const descList = []
  textList.push({ text: baseInfoForm.subject }) // 标题
  // 属性 '其他'
  const otherValueIndex = []
  cateAttrForm.property.filter((item, i) => {
    if (item.isOhter && item.otherValue) {
      textList.push({ text: item.otherValue })
      otherValueIndex.push(i)
    }
  })
  // 属性自定义名
  const diyAttrIndex = []
  cateAttrForm.property.filter((item, i) => {
    if (item.diy && item.name) {
      textList.push({ text: item.name || '' })
      diyAttrIndex.push(i)
    }
  })
  // 属性text
  const attrHasValueIndex = []
  cateAttrForm.property.filter((item, i) => {
    if (item.type === 'text' && item.value) {
      textList.push({ text: item.value })
      attrHasValueIndex.push(i)
    }
  })
  // 变体属性自定义名称
  const customizedCount = []
  for (const p in variantAttrRef) {
    if (p.indexOf('customized') > -1 && variantAttrRef[p].length) {
      variantAttrRef[p][0].list.filter((item, i) => {
        if (item.customizedName) {
          textList.push({ text: item.customizedName })
          customizedCount.push({
            ref: p,
            index: i
          })
        }
      })
    }
  }
  // 描述
  const dTitleCount = []
  const detailCount = []
  const detailHtmlCount = []
  detailRef.moduleList.forEach((item, i) => {
    if (item.type === 'text-image') {
      textList.push({ text: item.texts[0].content }) // title
      dTitleCount.push(i)
    }
  })
  detailRef.moduleList.forEach((item, i) => {
    if (item.type === 'text') {
      textList.push({ text: item.texts[0].content })
      detailCount.push(i)
    }
    if (item.type === 'text-image') {
      textList.push({ text: item.texts[1].content }) // content
      detailCount.push(i)
    }
    if (item.type === 'html') {
      descList.push({ text: item.html.content })
      detailHtmlCount.push(i)
    }
  })
  const request = []
  textList.length && request.push(getTranslate({ countryCode, textList }, 'aliExpress'))
  descList.length && request.push(getTranslate({ countryCode, textList: descList, textType: 'html' }, 'aliExpress'))
  translate.loading = true
  that.productLoading++
  request.length && Promise.all(request).then(res => {
    const data = res[0].data || []
    const descData = res[1] ? res[1].data : []
    baseInfoForm.subject = data[0]
    data.splice(0, 1)
    // 设置属性'其他'
    const otherValueTrans = data.splice(0, otherValueIndex.length)
    otherValueTrans.forEach((item, i) => {
      cateAttrForm.property[otherValueIndex[i]].otherValue = item
    })
    // 设置翻译值到自定义属性名
    const diyAttrNameTrans = data.splice(0, diyAttrIndex.length)
    diyAttrNameTrans.forEach((item, i) => {
      cateAttrForm.property[diyAttrIndex[i]].name = item
    })
    // 设置翻译值到属性上
    const attrs = data.splice(0, attrHasValueIndex.length)
    attrs.forEach((item, i) => {
      cateAttrForm.property[attrHasValueIndex[i]].value = item
    })
    // 设置变体属性自定义名称
    const customizedTrans = data.splice(0, customizedCount.length)
    customizedTrans.forEach((item, i) => {
      const ref = customizedCount[i]
      variantAttrRef[ref.ref][0].list[ref.index].customizedName = item
      variantAttrRef[ref.ref][0].translate(ref.index)
    })
    // 设置描述title
    const detailTitleTrans = data.splice(0, dTitleCount.length)
    detailTitleTrans.forEach((item, i) => {
      const detailItem = detailRef.moduleList[dTitleCount[i]]
      if (detailItem.type === 'text-image') {
        detailItem.texts[0].content = item
      }
    })
    // 设置描述
    const detailTrans = data.splice(0, detailCount.length)
    detailTrans.forEach((item, i) => {
      const detailItem = detailRef.moduleList[detailCount[i]]
      if (detailItem.type === 'text') {
        detailItem.texts[0].content = item
      }
      if (detailItem.type === 'text-image') {
        detailItem.texts[1].content = item
      }
    })
    // 设置描述html
    descData.forEach((item, i) => {
      detailRef.moduleList[detailHtmlCount[i]].html.content = item
    })
  }).finally(() => {
    translate.loading = false
    that.productLoading--
  })
}
