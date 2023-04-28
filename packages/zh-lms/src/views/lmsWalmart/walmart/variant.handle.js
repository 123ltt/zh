import batchUpdateStock from './modal/batchUpdateStock.vue'
import batchUpdatePrice from './modal/batchUpdatePrice.vue'
import batchUpdateRate from './modal/batchUpdateRate.vue'
import childAttr from './modal/childAttr.vue'
import changeChildSkuImg from './modal/changeChildSkuImg.vue'
import changeSwatchImg from './modal/changeSwatchImg.vue'
import { deepClone } from '@/util/util'
/**
 * @description 批量修改数据
 **/
export const batchData = [{
  name: '价格',
  field: 'price',
  component: batchUpdatePrice
}, {
  name: '库存',
  field: 'stock',
  component: batchUpdateStock
}, {
  name: '利润率',
  field: 'profitRate',
  component: batchUpdateRate
}]
/**
 * @description 批量操作
 **/
export function batchOperation(number, that) {
  that.$modal({
    title: '批量修改' + batchData[number].name,
    component: batchData[number].component,
    width: '400px',
    callback: (data) => {
      if (data) {
        const skuList = deepClone(that.form.skuList)
        skuList.forEach((item, index) => {
          item[batchData[number].field] = data
        })
        that.form.skuList = skuList
        if (number === 0) { // 价格
          that.updatePrice(skuList[0], 0, true)
        }
        if (number === 2) { // 利润率
          that.validProfitRate(skuList[0], 0, true)
        }
      }
    }
  })
}
/**
 * @description 选择子属性
 **/
export function selectChildAttr(that) {
  const selected = that.form.childAttr.map(item => item.attributeName)
  that.$modal({
    title: '选择子属性',
    component: childAttr,
    width: '600px',
    data: {
      categoryName: that.baseProductInfo.categoryName,
      childAttr: that.childAttr,
      selected: selected
    },
    callback: (data) => {
      data && showChild(that, data)
    }
  })
}
// 子属性回显
export function showChild(that, data, isEditInit) {
  const childList = that.varAttr.filter(item => data.includes(item.attributeName))
  that.form.childAttr = childList
  const skuList = deepClone(that.form.skuList)
  skuList.forEach(item => {
    item.childValue = []
    for (let i = 0; i < childList.length; i++) {
      let value = ''
      if (childList[i].type === 'array') { // 多选/多输
        value = childList[i].enums ? [] : ['']
      }
      item.childValue.push({ value, ...childList[i] })

      if (childList[i].type === 'object') {
        if (!childList[i].isLeaf && !childList[i].parentAttributeName) { // 查找子属性
          const arr = that.varAttr.filter(val => val.parentAttributeName === childList[i].attributeName)
          childList[i].children = arr
          // item.childValue[i].push({ children: [] })
          // for (let j = 0; j < childList[i].children.length; j++) {
          //   item.childValue[i].children.push({ value: '' })
          // }
        }
      }
      // 子属性
      if (isEditInit) {
        const cAttr = item.childValue[i]
        const { variantAttributes } = item.extendVO
        if (cAttr.type === 'object') {
          cAttr.children.forEach(e => {
            e.value = variantAttributes[cAttr.attributeName].find(a => a[e.attributeName])?.[e.attributeName]
          })
        } else {
          cAttr.value = variantAttributes[cAttr.attributeName]
        }
      }
    }
  })
  // that.$nextTick(() => {
  that.form.skuList = skuList
  // })
}
/**
 * @description 选择子SKU图片
 **/
export function changeImgModal(item, index, that, isReadOnly, isDetail) {
  that.$modal({
    title: '请选择子SKU图片',
    component: changeChildSkuImg,
    width: '1000px',
    data: {
      data: item,
      extraImgNum: that.extraImgNum,
      isReadOnly,
      isDetail
    },
    callback: (data) => {
      if (data && !isDetail) {
        that.form.skuList[index].imgShowList = data.imgShowList // 所有图片列表
        that.form.skuList[index].mainImage = data.mainImage
        that.form.skuList[index].extraImagList = data.imgShowList.filter(item => item.isExtra).map(item => item.imageUrl)
        that.$refs.form.validateField('skuList.' + index + '.imgShowList')
      }
    }
  })
}
/**
 * @description 选择Swatch图片
 **/
export function changeSwatchModal(item, index, that, isReadOnly, isDetail) {
  that.$modal({
    title: '请选择Swatch图片',
    component: changeSwatchImg,
    width: '1000px',
    data: {
      data: item,
      type: 'swatchImg',
      isReadOnly,
      isDetail
    },
    callback: (data) => {
      if (data && !isDetail) {
        const img = data.swatchImgList.find(item => item.isCheck)
        that.form.skuList.splice(index, 1, Object.assign(that.form.skuList[index], {
          swatchUrl: img && img.imageUrl, // swatch图
          swatchImgList: data.swatchImgList // 所有图片列表
        }))
        that.$refs.form.validateField('skuList.' + index + '.swatchImgList')
      }
    }
  })
}
// sku校验
export function validSku(row, index) {
  return (rule, value, callback) => {
    if (!row.productSku) {
      callback(new Error('sku不可为空'))
    } else {
      callback()
    }
  }
}
// 图片校验
export function validImage(sku, index) {
  return (rule, value, callback) => {
    // 副图不是必选
    if (sku.mainImage && sku.extraImagList.length <= 8) {
      callback()
    } else {
      callback(new Error('主图单选，副图最多选8张'))
    }
  }
}
// swatch图校验
export function validSwatch(sku, index) {
  return (rule, value, callback) => {
    // Swatch图不是必选
    const swatchImage = sku.swatchImgList.filter(item => item.isCheck)
    if (swatchImage && swatchImage.length > 1) {
      callback(new Error('Swatch图只能选一张'))
    } else {
      callback()
    }
  }
}
export function validPrimary(row, index) {
  return (rule, value, callback) => {
    if (row.isPrimaryVar && !row.isPrimaryVar.value) {
      callback(new Error('isPrimaryVariant不能为空'))
    } else {
      callback()
    }
  }
}
// 售价校验
export function validPrice(row, index) {
  return (rule, value, callback) => {
    if (Number(row.price) <= 0) {
      callback(new Error('售价不能小于0'))
    } else {
      callback()
    }
  }
}
// 利润率验证
export function validRate(sku, index) {
  return (rule, value, callback) => {
    if (Number(sku.profitRate) <= 0 || Number(sku.profitRate) > 1) {
      callback(new Error('请输入0~1之间的数字'))
    } else {
      callback()
    }
  }
}
