/**
 * @description 定义要被拖拽对象的数组
 **/
export const moduleMenu = [
  { type: 'text', value: 'text', name: '文字', icon: 'el-icon-tickets' },
  { type: 'html', value: 'html', name: '富文本', icon: 'el-icon-text-edit' },
  { type: 'image', value: 'image', name: '图片', icon: 'el-icon-picture-outline' },
  { type: 'textImage', value: 'text-image', name: '图文', icon: 'el-icon-picture-text' },
  { type: 'productTempHtml', value: 'productTempHtml', name: '产品信息模板', icon: 'el-icon-s-grid' }
]
/**
 * @description 文字
 **/
export const text = ({ descriptionPlain }) => ({
  type: 'text',
  texts: [
    {
      content: descriptionPlain || '',
      class: 'body'
    }
  ]
})
/**
 * @description 富文本
 **/
export const html = ({ descriptionPlain, descriptionHtml }) => ({
  type: 'html',
  html: {
    content: descriptionHtml || ''
  }
})
/**
 * @description 自定义产品模板内容
 **/
export const productTempHtml = (content) => ({
  type: 'productTempHtml',
  html: {
    content: content || ''
  }
})

/**
 * @description 单个图片url对象
 **/
export const imageUrlObj = () => ({
  url: '',
  style: {}
})
/**
 * @description 图片
 **/
export const image = () => ({
  type: 'image',
  images: []
})

/**
 * @description 图文
 **/
export const textImage = ({ descriptionPlain }) => ({
  type: 'text-image',
  images: [],
  texts: [
    {
      content: '',
      class: 'title'
    },
    {
      content: descriptionPlain || '',
      class: 'body'
    }
  ]
})

/**
 * @description 产品信息模板
 **/
export const dynamic = () => ({
  type: 'dynamic',
  reference: {
    type: 'relation',
    moduleId: ''
  }
})
