import { deepClone } from '@/util/util'
import { getTranslate, getSkuAffix } from '@/api/lmsCommon.js'
/**
 * @description 翻译语种
 **/
export const languages = [
  { value: 'en', name: '英语' },
  { value: 'fr', name: '法语' },
  { value: 'es', name: '西班牙语' },
  { value: 'it', name: '意大利语' },
  { value: 'de', name: '德语' },
  { value: 'ja', name: '日语' },
  { value: 'nl', name: '荷兰' },
  { value: 'pt', name: '葡萄牙语' }
]
/**
 * @description online的状态
 * */
export const onlineStatus = [5, 6, 7, 8]
// 刊登天数
export const listingDurationList = {
  1: '1 day',
  3: '3 day',
  5: '5 day',
  7: '7 day',
  10: '10 day',
  30: '30 day',
  GTC: 'GTC'
}
// 销售类型
export const saleTypeList = {
  1: '固定价',
  2: '拍卖'
}
// 分隔符
export const Separator = ':$$:'
// 获取仓库列表
export function getWareHouseList(countryCode, warehouseId, isDetail) {
  if (countryCode === 'UK') {
    countryCode = 'GB'
  }
  if (countryCode === 'eBayMotors') {
    countryCode = 'US'
  }
  return getSkuAffix([countryCode]).then(res => {
    const local = {
      affixContent: '',
      type: 'SELF_BUILT',
      warehouseId: 'Z20',
      warehouseName: '/本地仓'
    }
    let list = []
    const data = res.data || []
    data.forEach(item => {
      if (item.countryCode === countryCode) {
        item.affixList.forEach(affix => {
          affix.warehouseList.forEach(item => {
            // 自建仓/深圳仓 已被本地仓替换
            if (item.warehouseName.indexOf('/自建仓/深圳仓') === -1) {
              list.push({
                affixContent: affix.affixContent,
                type: item.type,
                warehouseId: item.deliveryWarehouse,
                warehouseName: item.warehouseName,
                virtualWarehouse: item.virtualWarehouse
              })
            }
          })
        })
      }
    })
    list = [local, ...list]
    list.forEach(item => {
      // 去掉最后一个/
      item.warehouseName = (item.warehouseName.substring(item.warehouseName.length - 1) === '/') ? item.warehouseName.substring(0, item.warehouseName.length - 1) : item.warehouseName
      // /替换 >
      item.warehouseName = item.warehouseName.substring(1).replaceAll('/', '>')
    })
    // 详情展示仓库名
    if (isDetail) {
      let show = ''
      list.findIndex(item => {
        if (item.warehouseId === warehouseId) {
          show = item.warehouseName
        }
      })
      return show
    } else {
      // 创建选择仓库列表
      list.forEach(item => {
        // 把前缀拼在id前，确认唯一
        if (item.affixContent) {
          item.warehouseName = `(${item.affixContent})${item.warehouseName}`
          item.warehouseId = item.affixContent + Separator + item.warehouseId
        }
      })
      return list
    }
  })
}
// 保存时，仓库分开前缀与id
export function setWarehouseId({ warehouseId }) {
  let id = ''
  if (!warehouseId) return id
  const data = warehouseId.split(Separator)
  id = data[data.length - 1]
  return id
}
// 获取详情时，仓库拼接前缀与id
export function getWarehouseId(data) {
  const { warehouseId, skuSuffix } = data
  return skuSuffix ? skuSuffix + Separator + warehouseId : warehouseId
}
/***
 * @description 保存两位小数位数
*/
export function toFixed3(inputStr) {
  let val = inputStr
  // 过滤成两位小数位数
  // eslint-disable-next-line
  val = val.replace(/^(\-)*(\d+)\.(\d\d\d).*$/,'$1$2.$3')
  // 返回最终输入的内容
  return val
}
/***
 * @description 保存一位小数位数
*/
export function toFixed1(inputStr) {
  let val = inputStr
  // 过滤成1位小数位数
  // eslint-disable-next-line
  val = val.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3')
  // 返回最终输入的内容
  return val
}
// 变体字段信息
export function variantObj(skuList = []) {
  const listingSpecs = skuList[0].listingSpecs
  const productIdTypeValue = skuList[skuList.length - 1].productIdTypeValue || ''
  const listingSpecsArr = []
  listingSpecs.forEach(item => {
    listingSpecsArr.push({ value: '' })
  })
  return {
    productSku: '',
    imgShowList: [],
    mainImage: '',
    extraImagList: [],
    productIdTypeValue,
    epid: '',
    listingSpecs: listingSpecsArr,
    startPrice: '',
    actualProfitRate: '',
    costPrice: '',
    stock: '',
    optType: 3
  }
}
/**
 * @description 处理sku详情的图片
 * @param {Object}data
 * */
export function dealImage(data, isEdit) {
  data.imgShowList = []
  data.extraImagList = []
  // 图片列表取分辨率为800*800
  const imgs = data.imageInfo && data.imageInfo.find(item => item.widthHeight === '800*800')
  const imgUrls = []
  if (imgs) {
    imgs.lstImage.map(p => {
      imgUrls.push({
        isExtra: false,
        isPrime: Boolean(p.isPrime),
        imageUrl: p.imageUrl
      })
      p.isPrime && (data.mainImage = p.imageUrl)
    })
    data.imgShowList = imgUrls
  }
  return imgUrls
}
/**
 * @description 处理编辑刊登sku详情返回的图片回显
 * @param {Object}pmsSku sku详情 from pms
 * @param {Object}baseProductInfo sku基本信息
*/
export function dealEditSkuImage(pmsSku, baseProductInfo) {
  const lstSkuImgs = dealImage(pmsSku, true)
  const diffImgList = []
  lstSkuImgs.map(skuImg => {
    const i = baseProductInfo.imgShowList.findIndex(showImg => skuImg.imageUrl === showImg.imageUrl)
    i === -1 && diffImgList.push(skuImg)
  })
  baseProductInfo.imgShowList = [...baseProductInfo.imgShowList, ...diffImgList]
}
// 处理ebay详情图片的回显格式 主图1张，附图11张
export function showListingDetailImage(variationPictures) {
  const imgShowList = []
  let mainImage = ''
  const extraImagList = []
  if (variationPictures && variationPictures.length) {
    variationPictures.filter((item, index) => {
      if (index === 0) {
        mainImage = item
        imgShowList.push({ imageUrl: item, isPrime: true, isExtra: false })
      } else if (index <= 11) {
        extraImagList.push(item)
        imgShowList.push({ imageUrl: item, isPrime: false, isExtra: true })
      }
    })
  }
  return { imgShowList, mainImage, extraImagList }
}
// 自定义属性值数据
export function diyAttr(name = 'name', value = '', diy = undefined) {
  return {
    name: name,
    diy,
    selectionMode: 'FREE_TEXT',
    valueType: 'TEXT',
    type: 'text',
    defaultValueList: [{ value }]
  }
}
// 编辑ebay回显类目属性设置
export function setCategoryAttr(cateSpecificList, productAttrs) {
  const attrs = productAttrs ? JSON.parse(productAttrs) : []
  // const diy = []
  attrs.map(a => {
    const index = cateSpecificList.findIndex(attr => attr.name === a.name)
    if (index > -1) {
      const cateAttr = cateSpecificList[index]
      if (cateAttr.selectionMode === 'FREE_TEXT') {
        cateAttr.defaultValueList.map((v, i) => {
          v.value = a.value[i]
        })
      } else if (cateAttr.selectionMode === 'SELECTION_ONLY') {
        if (cateAttr.maxValues > 1) {
          cateAttr.defaultValueSelect = a.value
        } else {
          cateAttr.defaultValueSelect = a.value ? a.value[0] : ''
        }
      }
    } else {
      // cateSpecificList.push(diyAttr(a.name, a.value[0]))
      // diy.push(diyAttr(a.name, a.value[0], true))
      cateSpecificList.push(diyAttr(a.name, a.value[0], true))
    }
  })
  // cateSpecificList = [...cateSpecificList, ...diy]
  return cateSpecificList
}

/**
 * @description 获取有值的属性列表
 * @param {Array} attr  属性原数据
 * @returns {Array} data 有值的属性列表
 **/
export function getAttrValue(attr) {
  const arrayList = []
  attr.filter(a => {
    const hasValue = ((a.defaultValueSelect && a.defaultValueSelect.length) || (a.defaultValueList && a.defaultValueList.length && a.defaultValueList.findIndex(valObj => valObj.value) > -1))
    if (hasValue) {
      let defaultValueSelect = []
      if (a.type === 'select') {
        if (a.maxValues > 1) {
          defaultValueSelect = a.defaultValueSelect
        } else {
          defaultValueSelect = [a.defaultValueSelect]
        }
      }
      arrayList.push({
        name: a.name,
        value: a.type === 'select' ? defaultValueSelect : a.defaultValueList.map(valObj => valObj.value),
        diy: a.diy || undefined
      })
    }
  })
  return arrayList
}
// 设置多变体表 thead
export function setAttrHead(that, data) {
  // 自定义属性头
  const lstAttrHead = []
  if (that.isVariation) {
    // 类目属性返回的多变体（必填）
    data.varAttr && data.varAttr.forEach(item => {
      // if (item.name.toLowerCase() === )
      lstAttrHead.push({ name: item.name, optionValueList: item.optionValueList })
    })
    // 从pms详情返回的规格里拿的 1新的PMS的sku  2老的SKU
    if (data.source === 1) {
      data.spuSpecificationAttrs.forEach(name => {
        // 查找是否存在相同属性
        const index = lstAttrHead.findIndex(item => findSameName(item.name, name) && item.name)
        index === -1 && lstAttrHead.push({ name })
      })
    } else {
      const lstAttrSpe = data.lstSku[0].lstAttrSpecification
      const name = (lstAttrSpe && lstAttrSpe[0] && lstAttrSpe[0].fieldNameEn) || ''
      // 查找是否存在相同属性
      const index = lstAttrHead.findIndex(item => findSameName(item.name, name) && item.name)
      index === -1 && lstAttrHead.push({ name })
    }

    !lstAttrHead.length && lstAttrHead.push({ name: '' })
  }
  return { lstAttrHead }
}
// 查找相同的属性名
const color = ['color', 'colors', 'colour', 'Colors', 'Color']
const size = ['size', 'sizes']
export function findSameName(name1, name2) {
  const hasColor = color.includes(name1.toLowerCase()) && color.includes(name2.toLowerCase())
  const hasSize = size.includes(name1.toLowerCase()) && size.includes(name2.toLowerCase())
  return hasColor || hasSize
}
// 设置多变体表 td
export function setAttrValue(data, item, lstAttrHead) {
  // 处理spu下sku规格属性数据 （默认填入第一个规格属性值）
  item.listingSpecs = []
  // 来源老的sku，变体属性名与sku规格属性一致，显示规格属性的值
  const lstAttrSpe = data.lstSku[0].lstAttrSpecification && data.lstSku[0].lstAttrSpecification[0]
  const name = (data.source === 2 && lstAttrSpe && lstAttrSpe.fieldNameEn)
  lstAttrHead.forEach(head => {
    item.listingSpecs.push({ value: name && findSameName(head.name, name) ? lstAttrSpe.fieldValue : '' })
  })
}

/**
 * @description 处理刊登详情变体回显数据 (图片，变体, 物流, 重新刊登)
 * @param {Array}varList 变体列表
 * @param {Object}spuDetail sku详情 from pms
 * **/
export function dealListingDetailVar(varList, spuDetail) {
  const lstAttrHead = []
  const skuList = varList
  skuList.forEach((item, index) => {
    const { imgShowList, mainImage, extraImagList } = showListingDetailImage(item.variationPictures)
    item.mainImage = mainImage
    item.extraImagList = extraImagList
    item.imgShowList = imgShowList

    item.logical = item.logical && JSON.parse(item.logical)
    item.costPrice = item.productCost
    if (item.listingSpecs) {
      item.listingSpecs = JSON.parse(item.listingSpecs)
      index === 0 && item.listingSpecs.map(specs => {
        lstAttrHead.push({ name: specs.name })
      })
    } else {
      index === 0 && lstAttrHead.push({ name: '' })
      item.listingSpecs = [{ value: '' }]
    }

    if (spuDetail && spuDetail.lstSku && spuDetail.lstSku.length) {
      const i = spuDetail.lstSku.findIndex(sku => sku.productSku === item.productSku)
      if (i > -1) {
        dealEditSkuImage(spuDetail.lstSku[i], item)
        item.costPrice = spuDetail.lstSku[i].productCost
        item.weight = spuDetail.lstSku[i].netWeight
      } else {
        // 无权刊登
        item.optType = 2
        item.noPermission = true
      }
    }
  })
  return { skuList, lstAttrHead }
}
// 有值的属性下标，用于翻译后对应
export function dealAttrIndex(attrList, textList) {
  const attrHasValueIndex = []
  attrList.filter((item, index) => {
    const temp = item.defaultValueList && item.type === 'text' ? item.defaultValueList.filter((valObj, idx) => {
      if (valObj.value) {
        attrHasValueIndex.push({
          attrIndex: index,
          valueIndex: idx
        })
        textList.push({ text: valObj.value })
        return valObj
      }
    }) : []
    return temp.length
  })
  return attrHasValueIndex
}
/**
 * @description 获取变体列表子SKU列表值
 * @param {Array}list  变体列表skuList
 * @param {Array}lstAttrHead  变体属性标题
 * @returns {Array}
*/
export function getSkuValues(list = [], lstAttrHead = []) {
  const skuVlueList = []
  list.filter(item => {
    // 草稿状态下不可用的子sku，保存时无需提交
    if (item.listingStatus < 5 ? !item.noPermission : true) {
      const { sellerSku, costPrice, actualProfitRate, productSku, stock, startPrice, productIdTypeValue, id, listingSpecs, epid, optType } = item
      const skuAttr = lstAttrHead.map((attrHead, i) => {
        return { name: attrHead.name, value: listingSpecs[i].value }
      })
      skuVlueList.push({
        sellerSku,
        id,
        optType,
        epid,
        productSku,
        variationPictures: [item.mainImage, ...item.extraImagList],
        listingSpecs: skuAttr ? JSON.stringify(skuAttr) : '',
        productIdTypeValue,
        costPrice,
        actualProfitRate,
        startPrice,
        stock
      })
    }
  })
  return skuVlueList
}

/**
 * @description 在售修改标记 1:产品相关  2:售价|起拍价|销售利润率|刊登实际毛利率  3:库存  4:图片 5:标题
 * @returns updateField：[1,2,3,4,５]
*/
export function dealUpdateField(isVariation, paramsData, olineResData) {
  const updateField = []
  const data = deepClone(olineResData)
  let params = deepClone(paramsData)
  params = Object.assign(params)
  delete data.draftSku
  const basekeys = ['warehouseId', 'primaryCateId', 'secondCateId', 'primaryStoreCateId', 'storeSecondCateId',
    'listingDuration', 'vatPercent', 'epid', 'saleType', 'productAttrs', 'descTemplateId', 'description', 'compatibilityTemplateId',
    'buyerRequirementInfo', 'paymentInfo', 'returnInfo', 'shippingInfo']
  const varykeys = ['logical', 'peid', 'listingSpecs']
  basekeys.findIndex(k => {
    const state = !updateField.includes(1) && params[k] !== data[k]
    state && updateField.push(1)
    return state
  })
  if (isVariation) {
    params.ebayListingVariationDTO.forEach((item, i) => {
      const sku = data.listingVariations[i] || {}
      !updateField.includes(4) && JSON.stringify(sku.variationPictures) !== JSON.stringify(item.variationPictures) && updateField.push(4)
      !updateField.includes(3) && sku.stock !== item.stock && updateField.push(3)
      !updateField.includes(2) && (sku.startPrice !== item.startPrice || +sku.actualProfitRate !== +item.actualProfitRate) && updateField.push(2)
      varykeys.findIndex(k => {
        const state = (!updateField.includes(1) && sku[k] !== item[k])
        state && updateField.push(1)
        return state
      })
    })
  } else {
    !updateField.includes(1) && params.ebayListingVariationDTO[0].logical !== data.listingVariations[0].logical && updateField.push(1)
  }
  data.saleProfitRate === null && (data.saleProfitRate = undefined)
  data.startPrice === null && (data.startPrice = undefined)
  if (!updateField.includes(2) && (params.startPrice !== data.startPrice || params.saleProfitRate !== data.saleProfitRate)) {
    updateField.push(2)
  }
  if (!updateField.includes(3) && params.stock !== data.stock) {
    updateField.push(3)
  }
  if (!updateField.includes(4) && JSON.stringify(params.productImageUrls) !== JSON.stringify(data.productImageUrls)) {
    updateField.push(4)
  }
  if (params.title !== data.title) {
    updateField.push(5)
  }
  return updateField
}
// 有值的自定义属性名，用于翻译后对应
function dealDiyAttrNameIndex(attrList, textList) {
  const diyAttrIndex = []
  attrList.filter((item, index) => {
    if (item.diy && item.name) {
      diyAttrIndex.push(index)
      textList.push({ text: item.name })
    }
  })
  return diyAttrIndex
}
// 变体属性名和值翻译收集
function dealVarAttrIndex(varAttrForm, textList) {
  const lstAttrHeadIndex = []
  const lstAttrValueIndex = []
  if (!varAttrForm) return { lstAttrHeadIndex, lstAttrValueIndex }

  // 变体属性头
  varAttrForm.lstAttrHead.filter((item, index) => {
    if (item.name) {
      lstAttrHeadIndex.push(index)
      textList.push({ text: item.name })
    }
  })

  // 变体属性值
  varAttrForm.skuList.forEach((item, index) => {
    item.listingSpecs.filter((spe, i) => {
      if (spe.value) {
        lstAttrValueIndex.push({
          attrIndex: index,
          valueIndex: i
        })
        textList.push({ text: spe.value })
      }
    })
  })
  return { lstAttrHeadIndex, lstAttrValueIndex }
}

/**
 * @description 一键翻译 翻译字段：标题，描述，属性
 * @param {Object}refs  refs
 * @param {String}countryCode  翻译语种
 * */
export function getTranslateHandle(that, countryCode, translate) {
  const refs = that.$refs
  const baseInfoForm = refs.baseInfo.form
  const descForm = refs.description.form
  const cateAttrForm = refs.categoryAttr.form
  const varAttrForm = refs.variantAttr && refs.variantAttr.form
  const textList = []
  // 标题
  textList.push({ text: baseInfoForm.title || '' })
  // 有值的自定义属性名，用于翻译后对应
  const diyAttrIndex = dealDiyAttrNameIndex(cateAttrForm.attr, textList)
  // 有值的属性下标，用于翻译后对应
  const attrHasValueIndex = dealAttrIndex(cateAttrForm.attr, textList)
  // 有值的变体属性属性头和值
  const { lstAttrHeadIndex, lstAttrValueIndex } = dealVarAttrIndex(varAttrForm, textList)

  const request = []
  request.push(getTranslate({ countryCode, textList }, 'ebay'))
  request.push(getTranslate({
    countryCode,
    textList: [{ text: descForm.description || '' }],
    textType: 'html'
  }, 'ebay'))
  translate.loading = true
  Promise.all(request).then(res => {
    const data = res[0].data || []
    const descData = res[1].data || []
    // 标题
    baseInfoForm.title = data[0]

    // 设置翻译值到自定义属性名
    const diyAttrNameTrans = data.slice(1, 1 + diyAttrIndex.length)
    diyAttrNameTrans.forEach((item, i) => {
      cateAttrForm.attr[diyAttrIndex[i]].name = item
    })

    // 设置翻译值到属性上
    const attrs = data.slice(1 + diyAttrIndex.length, 1 + diyAttrIndex.length + attrHasValueIndex.length)
    attrs.map((item, index) => {
      const attrValueIndex = attrHasValueIndex[index]
      cateAttrForm.attr[attrValueIndex.attrIndex].defaultValueList[attrValueIndex.valueIndex].value = item
    })

    // 设置多变体属性头
    if (varAttrForm) {
      const lstAttrHeadTrans = data.slice(1 + diyAttrIndex.length + attrHasValueIndex.length, 1 + diyAttrIndex.length + attrHasValueIndex.length + lstAttrHeadIndex.length)
      lstAttrHeadTrans.forEach((item, index) => {
        varAttrForm.lstAttrHead[lstAttrHeadIndex[index]].name = item
      })
      // 设置多变体属性值
      const lstAttrValueTrans = data.slice(1 + diyAttrIndex.length + attrHasValueIndex.length + lstAttrHeadIndex.length, 1 + diyAttrIndex.length + attrHasValueIndex.length + lstAttrHeadIndex.length + lstAttrValueIndex.length)
      lstAttrValueTrans.forEach((item, index) => {
        const indexObj = lstAttrValueIndex[index]
        varAttrForm.skuList[indexObj.attrIndex].listingSpecs[indexObj.valueIndex].value = item
      })
    }

    // 设置富文本描述值
    descForm.description = descData[0]
  }).finally(() => {
    translate.loading = false
  })
}

// 转意符换成普通字符
export function escapeToHtml(str) {
  var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' }
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
    return arrEntities[t]
  })
}
