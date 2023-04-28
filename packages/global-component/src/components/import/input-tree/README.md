# 点击输入框下拉显示tree（替代avue-input-tree组件）


## Props
- `data` `{{value:any;label:string;}[]}` tree数据
- `props` `{{label:string;value:string;children:string;}}` 对于`el-tree`组件的`props`配置。默认`{ label: 'title', value: 'value', children: 'children' }`
- `multiple` `{boolean}` 是否多选。默认`false`
- `collapseTags` `{boolean}` 是否收起tag（`multiple`为true时生效）
- `disabled` `{boolean}` 是否禁用，默认`false`
- `nodeChecked` `{boolean}` 是否允许选中节点。默认`false`（即只允许选择叶子结点）


## `v-model`
回显时，传入对应`props.value`的值。如果是多选则传入数组。

## 事件
- `change(checked)` 值发生变化时触发，传入的`checked`为已选中的项

## 使用
> 具体查看 [src/views/inputTree/index.vue](src/views/inputTree/index.vue)
```html
<div style="width:160px;">
  <InputTree v-model="values"
              multiple
              class="w-100"
              :collapse-tags="true"
              node-checked
              :data="list"
  />
  <pre>{{ JSON.stringify(values,'',2) }}</pre>
</div>
```
```js
import { InputTree } from 'global-components'
import data from './data.js'

export default {
  components: { InputTree },
  data() {
    return {
      values: [ '495', '496' ],
      list: data.data
    }
  }
}
```