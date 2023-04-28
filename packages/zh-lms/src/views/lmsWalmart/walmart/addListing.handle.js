import { getTranslate } from '@/api/lmsCommon.js'
import { getSkuAffix } from '@/api/oms.js'
import { deepClone } from '@/util/util'
/**
 * @description 翻译语种
 **/
export const languages = [
  { value: 'en', name: '英语' },
  { value: 'zh', name: '中文' }
]
/**
 * @description lazada列表Tab 状态：{ label, 总条数}
 **/
export const tabActiveList = () => [
  { label: 'Draft', auditTabActiveTotal: 0, cindex: '1' },
  { label: 'Approving', auditTabActiveTotal: 0, cindex: '2' },
  { label: 'Uploading', auditTabActiveTotal: 0, cindex: '3' },
  { label: 'Upload Failed', auditTabActiveTotal: 0, cinde: '4' },
  { label: 'Processing', auditTabActiveTotal: 0, cindex: '15' },
  { label: 'Online', auditTabActiveTotal: 0, cindex: '5' },
  { label: 'Updating', auditTabActiveTotal: 0, cindex: '6' },
  { label: 'Update Failed', auditTabActiveTotal: 0, cindx: '7' },
  { label: 'Match Failed', auditTabActiveTotal: 0, cindex: '8' },
  { label: 'Canceling', auditTabActiveTotal: 0, cindex: '9' },
  { label: 'Canceled', auditTabActiveTotal: 0, cindex: '10' }
]
/**
 * @description 处理详情图片的回显格式
 * **/
export function showListingDetailImage(item) {
  const imgShowList = []
  if (item.mainImage) {
    imgShowList.push({ isCheck: false, isPrime: true, isExtra: false, imageUrl: item.mainImage })
  }
  if (item.extendVO.imageUrls) {
    const extraList = JSON.parse(item.extendVO.imageUrls)
    extraList.forEach(item => {
      item && imgShowList.push({ isCheck: false, isPrime: false, isExtra: true, imageUrl: item })
    })
  }
  return imgShowList
}
export function showSwatchImage(item) {
  const { swatchImages } = item.extendVO.variantAttributes
  item.swatchUrl = swatchImages[0]
  item.swatchImgList = deepClone(item.imgShowList)
  if (!swatchImages[0]) return
  const img = item.swatchImgList.find(item => item.imageUrl === swatchImages[0])
  img
    ? img.isCheck = true
    : item.swatchImgList.push({ isCheck: true, isPrime: false, isExtra: false, imageUrl: swatchImages[0] })
}
/***
 * @description 默认类目属性
*/
export const defaultAttrList = () => (
  [
    {
      title: 'Variant Group ID（平台SKU）',
      property: 'variantGroupId',
      type: 'string'
    }, {
      title: 'Contains Chemical, Aerosol or Pesticide',
      property: 'chemicalAerosolPesticide',
      type: 'select',
      enums: ['OTHER', 'LEAD', 'SKJF', 'AFD']
    }, {
      title: 'Brand',
      property: 'brand',
      type: 'select',
      enums: ['YES', 'NO']
    }, {
      title: 'Multipack Quantity',
      property: 'multipackQuantity',
      type: 'string'
    }, {
      title: 'Fulfillment Lag Time',
      property: 'fulfillmentLagTime',
      type: 'string'
    }, {
      title: 'Ships in Original Packaging',
      property: 'shipsInOriginalPackaging',
      type: 'select',
      enums: ['YES', 'NO']
    }, {
      title: 'Product Tax Code',
      property: 'productTaxCode',
      type: 'string',
      enums: null
    }, {
      title: 'Site Start Date',
      property: 'startDate',
      type: 'date'
    }, {
      title: 'Contains Electronic Component',
      property: 'electronicsIndicator',
      type: 'select',
      enums: ['YES', 'NO']
    }, {
      title: 'Site End Date',
      property: 'endDate',
      type: 'date'
    }, {
      title: 'Contained Battery Type',
      property: 'batteryTechnologyType',
      type: 'select',
      enums: ['OTHER', 'LEAD', 'SKJF', 'AFD']
    }, {
      title: 'Must ship alone',
      property: 'MustShipAlone',
      type: 'select',
      enums: ['YES', 'NO']
    }
  ]
)
// 获取仓库列表
export function getWareHouseList(countryCode, warehouseId, isDetail) {
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
            list.push({
              affixContent: affix.affixContent,
              type: item.type,
              warehouseId: item.deliveryWarehouse,
              warehouseName: item.warehouseName,
              virtualWarehouse: item.virtualWarehouse
            })
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
      return list
    }
  })
}
/***
 * @description 属性分流 变体属性，产品属性， 其他属性
*/
export function setAttrValue(data, that, attributes = {}, childAttrList = []) {
  console.log('attributes: ', attributes)
  const attrList = [] // 产品属性
  const childAttr = []
  const varAttrHead = JSON.parse(data.filter(item => item.attributeName === 'variantAttributeNames')[0].enums) // 多属性(表头)
  const varChild = data.filter(item => childAttrList.includes(item.attributeName)) // 子属性

  // const detailAttrName = Object.keys(attributes) // linsting详情返回的属性对象
  // 过滤属性字段  [ ...filterKey ], 描述, 图片
  const filterKey = [
    'variantGroupId',
    'chemicalAerosolPesticide',
    'brand',
    'multipackQuantity',
    'fulfillmentLagTime',
    'shipsInOriginalPackaging',
    'productTaxCode',
    'startDate',
    'electronicsIndicator',
    'endDate',
    'batteryTechnologyType',
    'MustShipAlone',
    'mainImageUrl', // 图片
    'shortDescription', // 描述
    'keyFeatures', // 关键词
    'variantAttributeNames', // 变体属性 (color,size)
    'isPrimaryVariant',
    'swatchImages'
  ]
  filterKey.push(...childAttrList, ...varAttrHead)
  let list = data.filter(item => !(filterKey.includes(item.attributeName)) && !(filterKey.includes(item.parentAttributeName)) && item)// && item.isLeaf
  const varAttr = data.filter(item => item && (filterKey.includes(item.attributeName) || filterKey.includes(item.parentAttributeName)))
  const map = new Map()
  list = list.filter(item => item.format !== 'uri')
  list.forEach(item => {
    item.options = item.options ? item.options.split(',') : []
    const hasIndex = attrList.findIndex(ar => ar.title === item.title)
    // 属性name相同的去重
    if (hasIndex > -1) {
      return false
    }
    if (!item.enums) { // 枚举类型为空时
      if (item.type === 'number') {
        item.inputType = 'numeric'
      } else {
        item.inputType = 'text'
      }
      if (item.type === 'array') { // type类型为array时则显示添加 + 的操作
        item.handler = 'plus'
      }
    } else { // 枚举类型有值时
      item.inputType = 'select'
    }
    if (item.parentAttributeName) { // 当前item有父属性名时
      childAttr.push(item)
    }
    if (!item.parentAttributeName && item.isLeaf) {
      attrList.push(item)
    }
    // 处理产品属性
    // item.value = ''
    // if (item.title === 'brand' || item.title === 'Brand') {
    //   item.options = ['No Brand']
    //   item.value = 'No Brand' // name是brand默认填值：No Brand
    // }
    // // 设置value回显
    // if (detailAttrName.includes(item.name)) {
    //   if (Array.isArray(item.value)) {
    //     if (Array.isArray(attributes[item.name])) {
    //       item.value = attributes[item.name]
    //     } else {
    //       item.value = attributes[item.name].split(',')
    //     }
    //   } else {
    //     item.value = attributes[item.name]
    //   }
    // }
  })
  childAttr.forEach((item, i) => {
    if (map.has(item.parentAttributeName)) {
      const brr = map.get(item.parentAttributeName)
      brr.push(item)
      map.set(item.parentAttributeName, brr)
    } else {
      const arr = []
      arr.push(item)
      map.set(item.parentAttributeName, arr)
    }
  })
  for (const val of map) {
    const obj = {
      // [val[0]]: val[1],
      inputType: 'isParent',
      title: val[1][0].parentAttributeName, // title名
      childs: val[1]
    }
    attrList.push(obj)
  }
  return { attrList, varAttr, varAttrHead, varChild }
}
/**
 * @description 处理sku详情的图片
 * @param {Object}data
 * */
export function dealImage(data, isEdit) {
  data.imgShowList = []
  data.extraImagList = []
  // 图片列表取分辨率为800*800
  const imgs = data.imageInfo && data.imageInfo.find(item => item.widthHeight === '1000*1000')
  const imgUrls = []
  if (imgs) {
    imgs.lstImage.map(p => {
      imgUrls.push({
        isCheck: false,
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
// 变体属性处理
export function handleAttr(arr, isMulti) {
  const multiAttr = {}
  arr.forEach(v => {
    if (v.type === 'array' && v.enums && v.attributeName && v.value && v.value.length) { // 多选，value默认值为[]
      multiAttr[v.attributeName] = v.value
    } else if (v.type === 'array' && !v.enums && v.attributeName && v.value && v.value[0]) { // 多输，value默认值为['']
      multiAttr[v.attributeName] = v.value
    } else if (v.type !== 'array' && v.value && v.attributeName) {
      multiAttr[v.attributeName] = v.value
    }
    if (v.children && v.children.some(e => e.attributeName && e.value)) {
      multiAttr[v.attributeName] = []
      v.children.forEach(e => {
        if (!e.value) return
        multiAttr[v.attributeName].push({
          [e.attributeName]: e.value
        })
      })
    }
  })
  if (isMulti) multiAttr.variantAttributeNames = Object.keys(multiAttr)
  return multiAttr
}
/**
 * @description 提交时sku列表值处理
 * */
export function getSkuValues(skuList) {
  return skuList.map(item => {
    const {
      sellerSku, productSku, upc, stock, price, costPrice, profitRate, shippingPrice, shippingWeight, multiAttrValue, childValue, isPrimaryVar, swatchImg, swatchImgList, extendVO
    } = item
    // 多属性
    const multiAttr = JSON.stringify(handleAttr(multiAttrValue, true))
    const childAttr = childValue && childValue.length ? handleAttr(childValue) : {}

    const variantAttributes = {
      [isPrimaryVar.attributeName]: isPrimaryVar.value,
      [swatchImg.attributeName]: swatchImgList.filter(item => item.isCheck).map(val => val.imageUrl),
      ...childAttr
    }
    return {
      sellerSku,
      productSku,
      upc,
      imageUrl: item.mainImage, // 主图
      stock,
      price,
      costPrice,
      profitRate,
      multiAttr, // 多属性
      extendDTO: {
        id: extendVO?.id,
        imageUrls: item.extraImagList, // 图片列表
        variantAttributes
      },
      shippingPrice,
      shippingWeight,
      isPrimaryVariant: isPrimaryVar.value
    }
  })
}
// 变体字段信息
export function variantObj(obj = {}) {
  const { isPrimaryVar } = deepClone(obj)
  const item = Object.assign(deepClone(obj), {
    productSku: '',
    mainImage: '',
    extraImagList: [],
    swatchUrl: '',
    price: '',
    upc: '',
    costPrice: '', // 成本
    stock: 500,
    shippingPrice: '', // 运费
    productWeight: '', // 重量
    isPrimaryVar: isPrimaryVar ? Object.assign(isPrimaryVar, { value: '' }) : null
  })
  initValue(item.multiAttrValue)
  initValue(item.childValue)
  return item
}
// 初始化多属性或子属性值
export function initValue(attr) {
  const setVal = (attr) => {
    attr.forEach(v => {
      v.value = ''
      if (v.type === 'array') { // 多选/多输
        v.value = v.enums ? [] : ['']
      }
      if (v.children) setVal(v.children)
    })
  }
  if (attr && attr.length) setVal(attr)
}
// 创建或编辑多属性，模板
export function initMultiAttr(item) {
  item.multiAttrValue = []
  for (let i = 0; i < 3; i++) {
    item.multiAttrValue.push({
      value: '',
      type: '',
      children: [
        {
          type: '',
          value: ''
        }
      ]
    })
  }
}
// multiAttr属性过滤
export function attrFilter(attr) {
  const obj = attr ? JSON.parse(attr) : []
  Object.keys(obj).forEach(item => {
    if (item === 'variantAttributeNames') {
      delete obj[item]
    }
  })
  return obj
}
/**
 *  @description 克转磅
 **/
export function weightUnit(weight) {
  return (Number(weight) * 0.0022046).toFixed(2)
}
/**
 *  @description 最多输入2位小数
 **/
export function toFixed2(inputStr) {
  // eslint-disable-next-line no-useless-escape
  return inputStr && inputStr.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
}
// 是否海外仓：不是虚拟仓 &&（第三方仓 || 海外仓 || 自建泽汇仓）
export function isOverseasWarehouse(data) {
  return (data && !data.virtualWarehouse && (data.type === 'THIRD' || data.type === 'OVERSEA' || (data.type === 'SELF_BUILT' && data.warehouseId.indexOf('SELF_BUILT,ZH') > -1)))
}
/**
 *  @description 去掉转义符号
 **/
export function formatStr(str) {
  const name = str || ''
  return name.replace(/\\/g, '')
}
/**
 * @description 一键翻译 翻译字段：描述、Key Features、标题、产品属性、变体属性
 * @param {Object}refs  refs
 * @param {String}countryCode  翻译语种
 * */
export function getTranslateHandle(that, countryCode, translate) {
  const refs = that.$refs
  const baseInfoForm = refs.baseInfo.form
  const descForm = refs.description.form
  const cateAttrForm = refs.categoryAttr.form
  const varAttrForm = refs.variantAttr.form
  const textList = []
  const descList = []
  // 描述
  descList.push({ text: descForm.description || '', textType: 'html' })
  // 标题
  textList.push({ text: baseInfoForm.name || '' })
  // Key Features
  const keyIndex = []
  descForm.keyFeatures.forEach((v, i) => {
    keyIndex.push(i)
    textList.push({ text: v || '' })
  })
  // 产品属性
  const productAttrIndex = []
  cateAttrForm.property.filter((item, i) => {
    if ((['text', 'richText'].includes(item.inputType) || (item.label === 'Brand' || item.label === 'brand')) && item.value) {
      productAttrIndex.push(i)
      textList.push({ text: item.value || '' })
    }
  })
  // 变体属性
  const varAttrIndex = []
  const inputAttrIndex = []
  varAttrForm.skuList.filter((item, index) => {
    // item.childValue, object...
    const itemMul = item.multiAttrValue
    if (itemMul.type === 'array' && !itemMul.enums && itemMul.value && itemMul.value.length) { // 多输
      item.value.forEach((v, i) => {
        if (v) {
          varAttrIndex.push([index, i])
          textList.push({ text: v || '' })
        }
      })
    }
    if (['string', 'number', 'integer'].includes(itemMul.type) && !itemMul.enums && itemMul.value) { // 单个输入框
      inputAttrIndex.push(index)
      textList.push({ text: itemMul.value || '' })
    }
  })
  const request = []
  request.push(getTranslate({ countryCode, textList }, 'Walmart'))
  request.push(getTranslate({ countryCode, textList: descList, textType: 'html' }, 'Walmart'))
  translate.loading = true
  Promise.all(request).then(res => {
    const data = res[0].data || []
    const descData = res[1].data || []
    // 描述
    descForm.description = descData[0]
    // 标题
    baseInfoForm.name = data[0]
    // Key Features
    const keyData = data.slice(1, 1 + keyIndex.length)
    keyIndex.forEach((item, index) => {
      descForm.keyFeatures[item] = keyData[index]
    })
    // 产品属性
    const transProductAttr = data.slice(1 + keyIndex.length, 1 + keyIndex.length + productAttrIndex.length)
    productAttrIndex.forEach((item, i) => (cateAttrForm.property[item].value = transProductAttr[i]))
    // 变体属性
    const transSkuAttr = data.slice(1 + keyIndex.length + productAttrIndex.length, 1 + keyIndex.length + productAttrIndex.length + varAttrIndex.length)
    varAttrIndex.forEach((item, index) => {
      varAttrForm.skuList[item[0]].value[item[1]] = transSkuAttr[index]
    })
    const inputArr = data.slice(1 + keyIndex.length + productAttrIndex.length + varAttrIndex.length)
    inputAttrIndex.forEach((item, index) => {
      varAttrForm.skuList[item].value = inputArr[index]
    })
    varAttrForm.skuList = [...varAttrForm.skuList]
  }).finally(() => {
    translate.loading = false
  })
}
