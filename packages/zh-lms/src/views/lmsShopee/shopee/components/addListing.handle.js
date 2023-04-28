import { deepClone } from '@/util/util'
import { getTranslate } from '@/api/lmsCommon.js'

// 自定义属性值数据
export function diyAttr(name = 'name', value = '') {
  return {
    name,
    diy: true,
    type: 'text',
    value
  }
}
// 编辑smt回显类目属性设置
export function setCategoryAttr(cateSpecificList, productAttrs) {
  const attrs = JSON.parse(productAttrs)
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
      cateSpecificList.push(diyAttr(a.name, a.value[0], true))
    }
  })
  return cateSpecificList
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
  if (extraImages) {
    extraImagList = extraImages.split(';').map((url) => {
      imgShowList.push({
        isPrime: false,
        isExtra: true,
        imageUrl: url
      })
      return url
    })
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
export function delImage(data) {
  data.imgShowList = []
  data.extraImagList = []
  const imgs = data.imageInfo && data.imageInfo.find(item => item.widthHeight === '800*800')
  if (imgs) {
    const imgUrls = []
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
}
/**
 * @description &nbsp|&quot|&amp|&lt|&gt等html字符转义
 * **/
export function dealDescNbsp(desc) {
  return desc.replace(/&quot;|quot;/g, '"')
    .replace(/&lt;|lt;/g, '<')
    .replace(/&gt;|gt;/g, '>')
    .replace(/&nbsp;|nbsp;/g, ' ')
    .replace(/&amp;|amp;/g, '&')
}
/**
 * @description 获取有值的属性列表
 * @param {Array} attr  属性原数据
 * @returns {Array} data 有值的属性列表
 **/
export function getAttrValue(attr) {
  const arrayList = []
  attr.filter(item => {
    if (item.children && item.children.length) {
      item.children.filter(a => {
        const hasValue = ((a.defaultValueListForMulSelect && a.defaultValueListForMulSelect.length) || (a.defaultValueList && a.defaultValueList.length && a.defaultValueList.findIndex(valObj => valObj.value) > -1))
        if (hasValue) {
          arrayList.push({
            route: a.route,
            values: a.type === 'mulSelect' ? a.defaultValueListForMulSelect : a.defaultValueList.map(valObj => valObj.value),
            unit: a.defaultUnit || undefined
          })
        }
      })
    } else {
      const hasValue = ((item.defaultValueListForMulSelect && item.defaultValueListForMulSelect.length) || (item.defaultValueList && item.defaultValueList.length && item.defaultValueList.findIndex(valObj => valObj.value) > -1))
      if (hasValue) {
        arrayList.push({
          route: item.route,
          values: item.type === 'mulSelect' ? item.defaultValueListForMulSelect : item.defaultValueList.map(valObj => valObj.value),
          unit: item.defaultUnit || undefined
        })
      }
    }
  })
  return arrayList
}

/**
 * @description 赋值属性
 * @param {Array} data  属性原数据
 * @param {Array} attr  有值的属性扁平列表
 * @returns {Array} data 赋值后的属性数据
 **/
export function setAttrValue(data, attr) {
  data.forEach((item, ix) => {
    if (item.children && item.children.length) {
      item.children.filter((a, i) => {
        a.index = ix + '.children.' + i
        if (attr) {
          // 编辑时先清空默认值再set value
          clearAttrValue(a)
          setValueObj(attr, a)
        }
      })
    } else {
      item.index = ix
      if (attr) {
        // 编辑时先清空默认值再set value
        clearAttrValue(item)
        setValueObj(attr, item)
      }
    }
  })
  return data
}

/**
 * @description 清空属性值
 **/
export function clearAttrValue(item) {
  if (item.type === 'mulSelect') {
    item = Object.assign(item, { defaultValueListForMulSelect: [] })
  } else {
    item.defaultValueList.forEach((v, i) => {
      v.value = ''
    })
  }
  item.defaultUnit = ''
  return item
}

/**
 * @description 设置属性值
 **/
export function setValueObj(attr, item) {
  const idx = attr.findIndex(o => o.route === item.route)
  if (idx > -1) {
    if (item.type === 'mulSelect') {
      item = Object.assign(item, { defaultValueListForMulSelect: attr[idx].values })
    } else {
      item.defaultValueList.forEach((v, i) => {
        v.value = attr[idx].values[i] || ''
      })
    }
    if (attr[idx].unit) {
      item.defaultUnit = attr[idx].unit
    }
  }
  return item
}

/**
 * @description 置值到属性树上
 **/
export function setAttrValueToTree(data, leafNodeList) {
  function setValue(data) {
    data.forEach(item => {
      const index = leafNodeList.findIndex(y => y.id === item.id)
      if (index > -1) {
        item = Object.assign(item, leafNodeList[index])
      } else {
        item.children && setValue(item.children)
      }
    })
  }
  setValue(data)
}

/**
 * @description 获取属性有值的叶子节点
 **/
export function getAttrHasValueLeafNode(attr) {
  const attrList = deepClone(attr)
  // 获取属性有值的叶子节点
  const leafNodeList = []
  function getHasValueLeafNode(attr) {
    attr.forEach(item => {
      if ((!item.children || !item.children.length) && leafNodeList.findIndex(a => a.id === item.id) === -1) {
        const hasValue = (item.defaultValueList && item.defaultValueList.length && item.defaultValueList.find(valObj => valObj.value))
        if (hasValue) {
          leafNodeList.push(item)
        }
      }
      if (item.children && item.children.length) {
        getHasValueLeafNode(item.children)
      }
    })
  }
  getHasValueLeafNode(attrList)

  return leafNodeList
}

export function dealAttrIndex(attrHasValueNode, textList) {
  const attrHasValueIndex = []
  attrHasValueNode.filter((item, index) => {
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
 * @description 修改字段 1:产品 2:售价|促销价|促销时间 3:库存 4:图片
*/
export function dealUpdateField(paramsData, olineResData) {
  const updateField = []
  const data = deepClone(olineResData)
  let params = deepClone(paramsData)
  params = Object.assign(params, params.extend, params.draftSku)
  delete data.draftSku
  const keys = ['manufacturer', 'brand', 'title', 'categoryId', 'category', 'productType',
    'profitMargin', 'logistics']
  const extendKeys = ['attributes', 'description', 'bulletPoint', 'searchTerms']
  keys.find(p => {
    p === 'profitMargin' && (data.profitMargin = +data.profitMargin)
    if (p === 'logistics') {
      paramsData.logistics = JSON.stringify(paramsData.logistics)
    }
    if (p === 'category') {
      params.category = params.category ? params.category.replace(/,/g, ' / ') : ''
    }
    if (params[p] !== data[p] && !updateField.includes(1)) {
      updateField.push(1)
      return false
    }
  })
  if (!updateField.includes(1)) {
    extendKeys.find(p => {
      if (params.extend[p] !== data.extend[p]) {
        updateField.push(1)
        return false
      }
    })
  }
  // 2:售价|促销价|促销时间
  if (!updateField.includes(2) && (params.price !== data.standardPrice ||
    params.salePrice !== data.salePrice ||
    params.saleStartDate !== data.saleStartDate ||
    params.saleEndDate !== data.saleEndDate)) {
    updateField.push(2)
  }
  if (params.quantity !== data.quantity) {
    updateField.push(3)
  }
  if (params.imageUrls !== data.imageUrls || params.mainImage !== data.mainImage) {
    updateField.push(4)
  }
  return updateField
}

/**
 * @description 一键翻译 翻译字段：标题，卖点， 关键词， 描述，属性
 * @param {Object}refs  refs
 * @param {String}countryCode  翻译语种
 * */
export function getTranslateHandle(refs, countryCode, translate) {
  const sellingPointForm = refs.sellingPoint.$data.form
  const bulletPointKeys = Object.keys(sellingPointForm.bulletPoint)
  const bulletPoint = Object.values(sellingPointForm.bulletPoint)
  const baseInfoForm = refs.baseInfo.$data.form
  const templateAttrForm = refs.templateAttr.$data.form
  const textList = []
  bulletPoint.forEach((item, i) => {
    textList.push({ text: bulletPoint[i] }) // 卖点
  })
  textList.push({ text: baseInfoForm.title || '' }) // 标题
  textList.push({ text: sellingPointForm.searchTerms || '' }) // 关键词
  // 有值的属性叶子节点
  const attrHasValueNode = getAttrHasValueLeafNode(templateAttrForm.attr)
  // 有值的属性下标，用于翻译后对应
  const attrHasValueIndex = dealAttrIndex(attrHasValueNode, textList)

  const request = []
  request.push(getTranslate({ countryCode, textList }, 'shopee'))
  request.push(getTranslate({
    countryCode,
    textList: [{ text: sellingPointForm.description || '' }],
    textType: 'html'
  }, 'shopee'))
  translate.loading = true
  Promise.all(request).then(res => {
    const data = res[0].data
    const data1 = res[1].data || []
    data.some((item, i) => {
      sellingPointForm.bulletPoint[bulletPointKeys[i]] = data[i] // 卖点
      return i === 4
    })
    baseInfoForm.title = data[5] // 标题
    sellingPointForm.searchTerms = data[6] // 搜索词
    // 属性
    const attrs = data.slice(7, 7 + attrHasValueIndex.length)
    attrs.map((item, index) => {
      attrHasValueNode[attrHasValueIndex[index].attrIndex].defaultValueList[attrHasValueIndex[index].valueIndex].value = item
    })
    // 设置值到属性树上
    setAttrValueToTree(templateAttrForm.attr, attrHasValueNode)

    // 设置富文本描述值
    sellingPointForm.description = data1[0]
  }).finally(() => {
    translate.loading = false
  })
}
// 状态
export const tabActiveList = () => [{
  label: 'Draft',
  value: 'Draft',
  cindex: '1',
  auditTabActiveTotal: 0
}, {
  label: 'Approving',
  value: 'Approving',
  cindex: '2',
  auditTabActiveTotal: 0
}, {
  label: 'Uploading',
  value: 'Uploading',
  cindex: '3',
  auditTabActiveTotal: 0
}, {
  label: 'Upload Failed',
  value: 'Upload Failed',
  cindex: '4',
  auditTabActiveTotal: 0
}, {
  label: 'Online',
  value: 'Online',
  cindex: '5',
  auditTabActiveTotal: 0
}, {
  label: 'Updating',
  value: 'Updating',
  cindex: '6',
  auditTabActiveTotal: 0
}, {
  label: 'Update Failed',
  value: 'Update Failed',
  cindex: '7',
  auditTabActiveTotal: 0
}, {
  label: 'Match Failed',
  value: 'Match Failed',
  cindex: '8',
  auditTabActiveTotal: 0
}, {
  label: 'Canceling',
  value: 'Canceling',
  cindex: '9',
  auditTabActiveTotal: 0
}, {
  label: 'Canceled',
  value: 'Canceled',
  cindex: '10',
  auditTabActiveTotal: 0
}]
