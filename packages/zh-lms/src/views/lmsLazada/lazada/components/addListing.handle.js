import { dateFormat } from '@/util/date'
import { deepClone } from '@/util/util'
import { getTranslate } from '@/api/lmsCommon.js'

/**
 * @description 翻译语种
 **/
export const languages = [
  { value: 'en', name: '英语' }
]
/**
 * @description lazada列表Tab 状态：{ label, 总条数}
 **/
export const tabActiveList = () => ({
  1: { label: 'Draft', auditTabActiveTotal: 0 },
  2: { label: 'Approving', auditTabActiveTotal: 0 },
  3: { label: 'Uploading', auditTabActiveTotal: 0 },
  4: { label: 'Upload Failed', auditTabActiveTotal: 0 },
  5: { label: 'Pending QC', auditTabActiveTotal: 0 },
  6: { label: 'Online', auditTabActiveTotal: 0 },
  7: { label: 'Out Of Stock', auditTabActiveTotal: 0 },
  8: { label: 'Updating', auditTabActiveTotal: 0 },
  9: { label: 'Update Failed', auditTabActiveTotal: 0 },
  10: { label: 'Match Failed', auditTabActiveTotal: 0 },
  11: { label: 'Canceling', auditTabActiveTotal: 0 },
  12: { label: 'Suspend', auditTabActiveTotal: 0 },
  13: { label: 'Canceled', auditTabActiveTotal: 0 },
  14: { label: 'Deleting', auditTabActiveTotal: 0 },
  15: { label: 'Delete', auditTabActiveTotal: 0 }
})
/**
 *  @description 站点字典
 **/
export const siteList = {
  TH: { siteName: 'Thailand', currency: 'THB', domain: 'co.th', priceRange: '0-40000' },
  ID: { siteName: 'Indonesia', currency: 'IDR', domain: 'co.id', priceRange: '14418-19500000' },
  MY: { siteName: 'Malaysia', currency: 'MYR', domain: 'com.my', priceRange: '0-6750' },
  PH: { siteName: 'Philippines', currency: 'PHP', domain: 'com.ph', priceRange: '48-69000' },
  VN: { siteName: 'Vietnam', currency: 'VND', domain: 'vn', priceRange: '23126-1000000' },
  SG: { siteName: 'Singapore', currency: 'SGD', domain: 'sg', priceRange: '1.33-2040' }
}
/**
 * @description 处理详情图片的回显格式
 * **/
export function showListingDetailImage(item) {
  const imgShowList = []
  // if (item.masterImage) {
  //   imgShowList.push({ isPrime: true, isExtra: false, imageUrl: item.masterImage })
  // }
  if (item.allImages) {
    const extraList = JSON.parse(item.allImages)
    extraList.forEach((item, i) => {
      item && imgShowList.push({ isPrime: i === 0, isExtra: i !== 0, imageUrl: item })
    })
  }
  return imgShowList
}

/***
 * @description 属性分流 变体属性，产品属性， 其他属性
*/
export function setAttrValue(data, that, attributes = {}) {
  const attrList = [] // 产品属性
  const varAttr = [] // 多变体属性
  const detailAttrName = Object.keys(attributes) // linsting详情返回的属性对象
  // 过滤属性字段  [ ...filterKey ], 描述, 图片
  const filterKey = [
    'name', // 标题
    'name_ms', // 马来西亚标题
    'name_en',
    'package_weight', // 重
    'package_length', // 长
    'package_width', // 宽
    'package_height', // 高
    'package_content', // 包装内容
    'SellerSku',
    'price', // 价格
    'special_price', // 促销价
    'quantity', // 库存
    'tax_class', // Taxes
    'special_from_date', // 促销开始时间
    'special_to_date' // 促销结束时间
  ]
  const list = data.filter(item => !(filterKey.includes(item.name) || item.label.indexOf('Description') > -1 || item.inputType === 'img') && item)
  list.forEach(item => {
    item.options = item.options ? item.options.split(',') : []
    if (item.isSaleProp) {
      // 变体属性
      varAttr.push(item)
    } else {
      const hasIndex = attrList.findIndex(ar => ar.name === item.name)
      // 属性name相同的去重
      if (hasIndex > -1) {
        return false
      }
      // 处理产品属性
      item.value = ['multiEnumInput', 'multiSelect', 'enumInput'].includes(item.inputType) ? [] : ''
      if (item.name === 'brand' || item.name === 'Brand') {
        item.options = ['No Brand']
        item.value = 'No Brand' // name是brand默认填值：No Brand
      }
      if (item.name === 'warranty_type') {
        item.value = 'No Warranty'// name是warranty_type默认填值：No Warranty
      }
      // 设置value回显
      if (detailAttrName.includes(item.name)) {
        if (Array.isArray(item.value)) {
          if (Array.isArray(attributes[item.name])) {
            item.value = attributes[item.name]
          } else {
            item.value = attributes[item.name] ? attributes[item.name].split(',') : []
          }
        } else {
          item.value = attributes[item.name]
        }
      }
      attrList.push(item)
    }
  })
  return { attrList, varAttr }
}

/***
 * @description 促销时间处理
*/
export function saleDateHandle(dateTime, dateType, form) {
  if (!dateTime) {
    form[dateType] = ''
    return
  }
  const startAt = new Date(dateTime) * 1000 / 1000
  if (startAt < Date.now()) {
    form[dateType] = dateFormat(new Date())
  }
}
// 查找相同的属性名
const color = ['color', 'colors']
const size = ['size', 'sizes']
export function findSameName(name1, name2) {
  const hasColor = color.includes(name1.toLowerCase()) && color.includes(name2.toLowerCase())
  const hasSize = size.includes(name1.toLowerCase()) && size.includes(name2.toLowerCase())
  return hasColor || hasSize
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
 * @description 提交时sku列表值处理
 * */
export function getSkuValues(list = [], lstAttrHead = [], siteArr = []) {
  const obj = {}
  return list.map(item => {
    const {
      price, specialPrice, profitRate, id, sellerSku, combineSku, productCost, productSku, quantity, taxClass, productWeight, shippingFee,
      sitePriceData, productStatus,
      availablity
    } = item
    lstAttrHead.map(val => {
      if (item[val.label]) {
        obj[val.name] = item[val.label]
      }
      return obj
    })
    const comboSku = combineSku ? Array.isArray(combineSku) ? JSON.stringify(combineSku.map(({ sku, count }) => {
      return { sku, count }
    })) : combineSku : undefined
    const sitePiceInfo = {}
    siteArr.forEach(site => {
      const price = `${site.toLocaleLowerCase()}RetailPrice`
      const specialPrice = `${site.toLocaleLowerCase()}SalesPrice`
      const profitRate = `${site.toLocaleLowerCase()}ProfitRate`
      sitePiceInfo[price] = item[price]
      sitePiceInfo[specialPrice] = item[specialPrice]
      sitePiceInfo[profitRate] = item[profitRate]
    })
    return {
      id,
      combineSku: comboSku, // 组合SKU
      sellerSku,
      productSku,
      masterImage: item.mainImage,
      allImages: JSON.stringify([item.mainImage, ...item.extraImagList]),
      specifications: obj ? JSON.stringify(obj) : '', // 变体属性
      productCost,
      quantity,
      productStatus,
      taxClass,
      productWeight,
      shippingFee,
      availablity,
      price,
      specialPrice,
      profitRate,
      ...handleSitePrice(sitePriceData),
      ...sitePiceInfo
    }
  })
}
/**
 * @description 编辑时，获取多变体选中值
 **/
export function getVariantValues(varAttrList = []) {
  const obj = {}
  varAttrList.forEach(item => {
    for (const key in item) {
      const keys = Object.keys(obj)
      const index = keys.indexOf(key)
      index > -1 ? obj[key].push(item[key]) : obj[key] = [item[key]]
    }
  })
  return obj
}
/**
 * @description 编辑时，多变体回显
 **/
export function showSkuValues(list = [], lstAttrHead = [], siteArr = []) {
  // 拼接key值
  const lowerSiteArr = Object.keys(siteList).map(item => item.toLocaleLowerCase()) // 小写
  const priceList = ['ProfitRate', 'RetailPrice', 'SalesPrice']
  const filterStr = []
  lowerSiteArr.forEach(item => {
    priceList.forEach(val => {
      filterStr.push(item + val)
    })
  })
  return list.map(item => {
    const { specifications } = item
    const obj = JSON.parse(specifications)
    item.varAttrList = obj
    lstAttrHead.map(val => {
      if (obj && obj[val.name]) {
        item[val.label] = obj[val.name]
      }
    })
    // sitePriceData属性组装
    let arr = []
    for (const key in item) {
      if (filterStr.includes(key) && item[key]) {
        arr.push(key.slice(0, 2).toLocaleUpperCase())
      }
    }
    arr = [...new Set(arr)]
    const sitePriceData = []
    const obj1 = {}
    arr.forEach(val => {
      obj1.site = val
      obj1.profitRate = item[`${val.toLocaleLowerCase()}ProfitRate`]
      obj1.price = item[`${val.toLocaleLowerCase()}RetailPrice`]
      obj1.specialPrice = item[`${val.toLocaleLowerCase()}SalesPrice`]
      sitePriceData.push(deepClone(obj1))
    })
    item.sitePriceData = sitePriceData
    item.sitePriceDataCache = item.sitePriceData
    // 取已选站点的第一个
    const firstSite = sitePriceData.find(y => y.site === siteArr[0])
    item = { ...item, ...firstSite } // 默认显示第一个站点的价格

    return item
  })
}
/**
 *  @description 提交时各刊登站点价格处理
 **/
export function handleSitePrice(list = [], obj = {}) {
  list.forEach(item => {
    const { site, price, specialPrice, profitRate } = item
    obj[`${site.toLocaleLowerCase()}RetailPrice`] = price
    obj[`${site.toLocaleLowerCase()}SalesPrice`] = specialPrice
    obj[`${site.toLocaleLowerCase()}ProfitRate`] = profitRate
  })
  return obj
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
    productCost: '',
    stock: '',
    optType: 3
  }
}
/**
 *  @description 最多输入2位小数
 **/
export function toFixed2(inputStr) {
  // eslint-disable-next-line no-useless-escape
  return inputStr && inputStr.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
}
/**
 *  @description 克->千克，保留2位小数
 **/
export function fixed2(inputStr) {
  return (Number(inputStr) / 1000).toFixed(2)
}
/**
 *  @description 生成笛卡尔积
 **/
export const Divider = ':$$:' // 分割符规则: (label || value).indexOf(Divider) === -1
export function combinSkuId(skuAttrList) {
  const skuProperty = [] // sku属性
  const arr = [] // 有值的属性
  const attrData = colorFirst(skuAttrList)
  attrData.forEach(item => {
    if (Array.isArray(item.value)) item.value = item.value.filter(v => v)
    const flag = Array.isArray(item.value) ? item.value.length : item.value
    if (flag) {
      skuProperty.push(item)
      const attr = []
      Array.isArray(item.value) ? item.value.map(val => attr.push(`${item.label}${Divider}${val}`)) : attr.push(`${item.label}${Divider}${item.value}`)
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
  return { skuProperty, skuId }
}
/**
 * @description 一键翻译 翻译字段：长短描述、标题、产品属性、变体属性、what's the box
 * @param {Object}refs  refs
 * @param {String}countryCode  翻译语种
 * */
export function getTranslateHandle(that, countryCode, translate) {
  const refs = that.$refs
  const baseInfoForm = refs.baseInfo.form
  const otherInfoForm = refs.otherInfo.form
  const descForm = refs.description.form
  const cateAttrForm = refs.categoryAttr.form
  const varAttrForm = refs.variantAttr
  const textList = []
  const descList = []
  // 长描述
  descList.push({ text: descForm.description || '', textType: 'html' })
  // 短描述
  descList.push({ text: descForm.shortDescription || '', textType: 'html' })
  // 标题
  textList.push({ text: baseInfoForm.name || '' })
  // What's in the box
  textList.push({ text: otherInfoForm.packageContent || '' })
  // 产品属性
  const productAttrIndex = []
  cateAttrForm.property.filter((item, i) => {
    if ((['text', 'richText'].includes(item.inputType) || (item.label === 'Brand' || item.label === 'brand')) && item.value) {
      productAttrIndex.push(i)
      textList.push({ text: item.value || '' })
    }
  })
  // 变体属性
  const varAttrIndex = [] // 变体
  const varAttrOIndex = [] // 非变体
  varAttrForm.skuAttrList.filter((item, index) => {
    if (['text', 'richText', 'multiEnumInput', 'enumInput'].includes(item.inputType) && item.value && item.value.length && Array.isArray(item.value)) {
      item.value.forEach((v, i) => {
        if (v) {
          varAttrIndex.push([index, i])
          textList.push({ text: v || '' })
        }
      })
    }
  })
  varAttrForm.skuAttrList.filter((item, index) => {
    if (['text', 'richText', 'multiEnumInput', 'enumInput'].includes(item.inputType) && item.value && !Array.isArray(item.value) && !item.options.find(o => o === item.value)) {
      varAttrOIndex.push(index)
      textList.push({ text: item.value || '' })
    }
  })

  const request = []
  request.push(getTranslate({ countryCode, textList }, 'Lazada'))
  request.push(getTranslate({ countryCode, textList: descList, textType: 'html' }, 'Lazada'))
  translate.loading = true
  Promise.all(request).then(res => {
    const data = res[0].data || []
    const descData = res[1].data || []
    // 标题
    baseInfoForm.name = data[0]
    // what's the box
    otherInfoForm.packageContent = data[1]
    // 产品属性
    const transProductAttr = data.slice(2, 2 + productAttrIndex.length)
    productAttrIndex.forEach((item, i) => (cateAttrForm.property[item].value = transProductAttr[i]))
    // 变体属性
    const transSkuAttr = data.slice(2 + productAttrIndex.length, 2 + productAttrIndex.length + varAttrIndex.length)
    varAttrIndex.forEach((item, index) => {
      varAttrForm.skuAttrList[item[0]].value[item[1]] = transSkuAttr[index]
    })
    // 非变体属性
    const transSkuAttrO = data.slice(2 + productAttrIndex.length + varAttrIndex.length, 2 + productAttrIndex.length + varAttrIndex.length + varAttrOIndex.length)
    varAttrOIndex.forEach((item, i) => {
      varAttrForm.skuAttrList[item].value = transSkuAttrO[i]
    })

    varAttrForm.skuAttrList = [...varAttrForm.skuAttrList] // UI没有变Fix
    // sku表上的变体属性
    varAttrForm.skuAttrChange()
    // 描述
    descForm.description = descData[0]
    descForm.shortDescription = descData[1]
  }).finally(() => {
    translate.loading = false
  })
}
// 生成随机数
export function generateRandomNum() {
  const s = dateFormat(new Date(), 'yyyyMMddhhmmssS')
  return s
}
/**
 *  @description 颜色属性字典
 **/
export const colorAttr = [
  'Color Family',
  'Color thumbnail',
  'Watch Strap Color',
  'color_thumbnail',
  'color_family',
  'Lens Color',
  'Color',
  'Color Group',
  'watch_strap_color',
  'Max Print Resolution Color',
  'Mono/Color',
  'Hair Color Type',
  'Wash Color',
  'Fax color',
  'Frame Color',
  'lens_color'
]
/**
 *  @description 颜色属性排在数组第一位
 **/
export function colorFirst(skuAttrList) {
  if (skuAttrList.length) {
    const colorData = skuAttrList.find(item => colorAttr.includes(item.name) || colorAttr.includes(item.label))
    const noColor = skuAttrList.filter(item => item.label !== colorData.label)
    return [colorData, ...noColor]
  } else {
    return []
  }
}
