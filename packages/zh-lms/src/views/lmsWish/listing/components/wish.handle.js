import { deepClone } from '@/util/util'
import { getTranslate } from '@/api/lmsCommon.js'
export const tabActiveList = () => [
  { label: 'Draft', value: 'Draft', cindex: '1', auditTabActiveTotal: 0 },
  { label: 'Approving', value: 'Approving', cindex: '2', auditTabActiveTotal: 0 },
  { label: 'Uploading', value: 'Uploading', cindex: '3', auditTabActiveTotal: 0 },
  { label: 'Upload Failed', value: 'Upload Failed', cindex: '4', auditTabActiveTotal: 0 },
  { label: 'Auditing', value: 'Auditing', cindex: '55', auditTabActiveTotal: 0 },
  { label: 'Rejected', value: 'Rejected', cindex: '66', auditTabActiveTotal: 0 },
  { label: 'Online', value: 'Online', cindex: '5', auditTabActiveTotal: 0 },
  { label: 'Updating', value: 'Updating', cindex: '6', auditTabActiveTotal: 0 },
  { label: 'Update Failed', value: 'Update Failed', cindex: '7', auditTabActiveTotal: 0 },
  { label: 'Match Failed', value: 'Match Failed', cindex: '8', auditTabActiveTotal: 0 },
  { label: 'Disabled', value: 'Disabled', cindex: '11', auditTabActiveTotal: 0 },
  { label: 'Canceling', value: 'Canceling', cindex: '9', auditTabActiveTotal: 0 },
  { label: 'Canceled', value: 'Canceled', cindex: '10', auditTabActiveTotal: 0 }]
/**
 * @description 在线编辑 修改字段 1.产品 2.变体 3.国家运费
 * @returns updateField：[1,2,3]
 */
export function dealUpdateField(listType, paramsData, olineResData) {
  //  修改产品:1 标题, 描述, 标签，品牌， 链接， upc, 主图， 副图，最大购买数， 视频
  // 修改变体:2 价格，本地价格， 厂商建议零售价， 库存 ，运费时间， 售价
  // 国家运费:3 运费，本地运费，国家运费
  const updateField = []
  // 编辑详情
  const data = deepClone(olineResData)
  // 编辑保存 传给后端的参数
  let params = deepClone(paramsData)
  params = Object.assign(params)
  const basekeys = ['title', 'tags', 'description', 'landingPageUrl', 'upc', 'mainImage', 'extraImagList', 'maxQuantity']
  // 修改变体'isUpdate', 'isEnabled',
  const varykeys = ['price', 'localizedPrice', 'costPrice', 'profitRate', 'inventory', 'shippingTime', 'msrp', 'color', 'size']
  basekeys.findIndex(k => {
    let state = false
    if (typeof (params[k]) === 'object') {
      state = !updateField.includes(1) && JSON.stringify(params[k]) !== JSON.stringify(data[k])
    } else {
      state = !updateField.includes(1) && params[k] !== data[k]
    }
    state && updateField.push(1)
    return state
  })
  // 多变体
  if (listType === 'Variation') {
    params.variantList.forEach((item, i) => {
      const sku = data.variantList[i] || {}
      varykeys.findIndex(k => {
        const state = !updateField.includes(2) && sku[k] !== item[k]
        state && updateField.push(2)
        return state
      })
    })
  } else {
    varykeys.findIndex(k => {
      const state = !updateField.includes(2) && JSON.stringify(params[k]) !== JSON.stringify(data[k])
      state && updateField.push(2)
      return state
    })
  }
  // 运费
  // 数量 详情的数量 和 传给后端的数量对比 一致  就对比价格
  // 区域 价格（一个）不同 3
  const shippingCountries = params.countryShippingList
  if (shippingCountries.length === data.countryShippingList.length) {
    shippingCountries.forEach(item => { // 新
      data.countryShippingList.forEach(citem => { // 旧
        if (item.countryCode === citem.countryCode) {
          if (item.regions !== null || citem.regions != null) {
            if (item.regions !== null && citem.regions !== null) {
              if (item.regions.length === citem.regions.length) {
                item.regions.forEach(ritem => {
                  citem.regions.forEach(oldItem => {
                    if (ritem.stateCode === oldItem.stateCode) {
                      if (ritem.localizedPrice !== oldItem.localizedPrice) {
                        return updateField.push(3)
                      }
                    }
                  })
                })
              } else {
                return updateField.push(3)
              }
            } else {
              return updateField.push(3)
            }
          }
          if (item.localizedPrice !== citem.localizedPrice) {
            return updateField.push(3)
          }
        }
      })
    })
  } else {
    updateField.push(3)
  }
  const filterUpdateField = [...new Set(updateField)]
  return filterUpdateField
}
/***
 * @description 保存两位小数位数
*/
export function toFixed2(inputStr) {
  let val = inputStr
  // 过滤成两位小数位数
  // eslint-disable-next-line
  val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
  // 返回最终输入的内容
  return val
}
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
// 区域调价的区域列表
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
 * @description 处理sku详情字段名对应
 * */
export function dealKeyCorresp(data) {
  const fieldName = {
    // title: 'subject', // 标题
    categoryId: 'productCategoryId' // 类目
  }
  for (const k in fieldName) {
    if (data[k]) {
      data[fieldName[k]] = data[k]
      delete data[k]
    }
  }
}
/**
 * @description 回显图片处理
 * @param {string} mainImage  主图
 * @param {string} extraImages  副图
 * @returns {Array} extraImagList 副图列表
 * @returns {Array} imgShowList 显示所有图片列表
 **/
export function dealPic(mainImage, extraImages) {
  let imgShowList = []
  let extraImagList = []
  // 副图
  if (extraImages.length) {
    if (Array.isArray(extraImages)) {
      extraImagList = extraImages.map((url) => {
        imgShowList.push({
          isPrime: false,
          isExtra: true,
          imageUrl: url
        })
        return url
      })
    } else {
      extraImagList = extraImages.split(';').map((url) => {
        imgShowList.push({
          isPrime: false,
          isExtra: true,
          imageUrl: url
        })
        return url
      })
    }
  }
  // 主图
  const index = imgShowList.findIndex(item => item.imageUrl === mainImage)
  if (index > -1) {
    imgShowList[index].isPrime = true
  } else if (mainImage) {
    imgShowList = [{
      isPrime: true,
      isExtra: false,
      imageUrl: mainImage
    }, ...imgShowList]
  }
  return { extraImagList, imgShowList }
}
/**
 * @description 处理新增刊登sku详情返回的图片回显
*/
export function dealImage(data, isEdit) {
  data.imgShowList = []
  data.extraImagList = []
  const imgs = data.imageInfo && data.imageInfo.find(item => item.widthHeight === '800*800')
  const imgUrls = []
  if (imgs) {
    imgs.lstImage.map(p => {
      imgUrls.push({
        isExtra: false,
        isPrime: !isEdit && Boolean(p.isPrime),
        imageUrl: p.imageUrl
      })
      p.isPrime && (data.mainImage = p.imageUrl)
    })
    data.imgShowList = imgUrls
  }
  return imgUrls
}

// sku变体信息
export function sku(data) {
  const baseData = {
    skuId: '',
    sendPlace: '',
    warehouseId: '', // 仓库
    warehouseList: [],
    productSku: '',
    skuList: [], // lstSkuCode
    skuPrice: '',
    skuDiscountPrice: '', // 促销价
    ipmSkuStock: '',
    profitRate: '', // 利润率
    profitAmount: '', // 利润率
    costPrice: '', // 价格/库存参考信息
    skuProperty: []
  }
  return Object.assign(baseData, data)
}

/**
 * @description 一键翻译 翻译字段：标题，标签，描述
 * @param {Object}refs  refs
 * @param {String}countryCode  翻译语种
 * */
export function getTranslateHandle(that, countryCode, translate) {
  const refs = that.$refs
  const baseInfoForm = refs.baseInfo.form
  const textList = []
  // 标题
  textList.push({ text: baseInfoForm.title })
  textList.push({ text: baseInfoForm.tags.join() || '' })
  textList.push({ text: baseInfoForm.description || '' })
  translate.loading = true
  getTranslate({ countryCode, textList }, 'wish').then(res => {
    const data = res.data
    // 标题
    baseInfoForm.title = data[0]
    // 标签
    baseInfoForm.tags = data[1].split(',')
    // 描述
    baseInfoForm.description = data[2]
  }).finally(() => {
    translate.loading = false
  })
}
