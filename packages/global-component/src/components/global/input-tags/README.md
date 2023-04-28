# 输入框中显示tags


## Props
- `tagMode` `{boolean}` 是否使用tag模式，默认`true`。如果`multiple`为`true`则会强制将`tagMode`设为`true`
- `multiple` `{boolean}` 是否显示多个值。默认`true`
- `clearable` `{boolean}` 是否显示清空按钮。默认`false`
- `showArrow` `{boolean}` 是否显示下拉箭头（如果需要做下拉内容可用到）。默认`false`
- `showDetail` `{boolean}` 鼠标悬停时显示详情。默认`true`
- `collapseTags` `{boolean}` 是否收起tag（`tagMode`为true时生效）。默认`false`
- `size` `{'small' | 'mini'}` 尺寸，只支持 `small`、`mini`两种尺寸，其他尺寸可能与elementUI对不上。默认`mini`
- `disabled` `{boolean}` 是否禁用，默认`false`


## 事件
- `focus` 聚焦触发
- `blur` 失焦触发
- `remove(data, values)` 移除tag时触发。`data` 为移除的项，`values` 移除后的值


## `v-model`
`v-model`的数据

#### 为对象时
```
{value: any; label: string;}
```
> 为对象时被清空，则重新赋值为`null`

#### 为数组时
```
{value: any; label: string;}[]
```
> 为数组时被清空，则重新赋值为`[]`


## 使用
```html
<g-input-tags v-model="checked"
              multiple
              clearable
              collapse-tags
/>
```

```js
export default {
  data() {
    return {
      checked: [
        { value: 1, label: '测试1' }
      ]
    }
  }
}
```