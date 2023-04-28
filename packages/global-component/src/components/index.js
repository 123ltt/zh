import Auth from './global/auth/index.vue'
import Content from './global/content/index.vue'
import Link from './global/link/index.vue'
import ListGroupItem from './global/list-group/item.vue'
import ListGroup from './global/list-group/index.vue'
import MultipleInput from './global/multiple-input/index.vue'
import Table from './global/table/index.vue'
import TableColumnHeader from './global/table/columnHeader.vue'
import TextEllipsis from './global/text-ellipsis/index.vue'
import Cascader from './global/cascader/index.vue'
import ColorIcon from './global/color-icon/index.vue'
import Status from './global/status/index.vue'

export const UploadImage = () => import('./import/upload/image/index.vue')
export const UploadFile = () => import('./import/upload/file/index.vue')
export const Editor = () => import('./import/editor/index.vue')
export const Conditions = () => import('./import/conditions/index.vue')
export const ConditionsGroup = () => import('./import/conditions/group.vue')
export const OssWatermark = () => import('./import/oss-watermark/index.vue')
export const InputTree = () => import('./import/input-tree/index.vue')

export { default as checkIsOssLink } from './utils/checkIsOssLink'
export { ossLink, platformLink } from './utils/resolveImgLink'
export { findComponent } from './utils/componentUtil'

export default {
  install(Vue) {
    [
      Auth,
      Content,
      Link,
      ListGroupItem,
      ListGroup,
      MultipleInput,
      Table,
      TableColumnHeader,
      TextEllipsis,
      Cascader,
      ColorIcon,
      Status,

      // 组件懒加载
      ['GSelect', () => import('./global/select/index.vue')],
      ['GThumb', () => import('./global/thumb/index.vue')],
      ['GCharts', () => import('./global/echarts/index.vue')],
      ['GInputTags', () => import('./global/input-tags/index.vue')]
    ].forEach(item => {
      if (Array.isArray(item)) {
        Vue.component(item[0], item[1])
      } else {
        if (item.name) {
          Vue.component(item.name, item)
        } else {
          console.error('未设置组件名，注册全局组件失败', item)
        }
      }
    })
  }
}
