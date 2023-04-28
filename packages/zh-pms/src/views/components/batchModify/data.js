import { LIMIT } from '@/config/form'

// 固定的两个物流属性
export const logisticsAttrs = [
  { fieldId: 'weight', attrName: '打包重量(g)' },
  { fieldId: 'size', attrName: '包装尺寸(cm)' }
].map(item => {
  return Object.assign(item, { attrSource: ['默认'], attrs: [], checkedList: [] })
})

// 两个特殊的物流属性 对应的 真实字段名
export const logisticsAttrsMappingProp = {
  weight: ['packWeight'],
  size: ['sizeLongPack', 'sizeWidthPack', 'sizeHeightPack']
}

/**
 * type: 0基础信息字段，1物流字段
 */
export const fields = [
  { type: 0, label: '类目', prop: 'categoryId', component: 'productCategory' },
  { type: 0, label: '状态', prop: 'status', component: 'status', default: '', span: 12 },
  { type: 0, label: '是否可售', prop: 'ifOnSale', component: 'ifOnSale', span: 12 },
  {
    type: 0,
    label: '平台参考链接',
    prop: 'referenceUrls',
    component: 'platRefUrls',
    default(cb) {
      cb(this.prop, [''])
    }
  },
  { type: 0, label: '最小起订量', prop: 'minimumOrder', component: 'number', placeholder: '输入数量', span: 12 },
  { type: 0, label: '交期(天)', prop: 'deliveryDay', component: 'number', placeholder: '输入天数', span: 12 },
  {
    type: 0,
    label: '品牌',
    prop: ['brandType', 'brandName'], // [ 品牌类型， 品牌名 ]
    component: 'brand',
    default(cb) {
      const defaultVals = ['', ''] // 与 prop 一一对应
      this.prop.forEach((item, index) => {
        cb(item, defaultVals[index])
      })
    }
  },
  { type: 0, label: '关键词', prop: 'keywords', component: 'input', maxlength: LIMIT.content },
  { type: 0, label: '富文本描述（中文）', prop: 'descriptionCn', component: 'editor' },
  { type: 0, label: '富文本描述（英文）', prop: 'descriptionHtml', component: 'editor' },
  { type: 0, label: '包裹描述（英文）', prop: 'packageDescription', component: 'editor' },
  { type: 1, label: '申报中文名称', prop: 'customsNameCn', component: 'input' },
  { type: 1, label: '申报英文名称', prop: 'customsNameEn', component: 'input' },
  {
    type: 1,
    label: '物流分类',
    prop: 'logisticsAttrIds',
    component: 'logisticsCategory',
    default(cb) {
      cb(this.prop, [])
    }
  }
]
