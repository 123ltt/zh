# 标题+内容 列表组件

## 使用例子
`GListGroupItem`单独使用：
```html
<g-list-group-item label="姓名" label-width="100px" label-align="center">张三</g-list-group-item>
<g-list-group-item label="手机" label-width="100px" label-align="center">13838384380</g-list-group-item>
<g-list-group-item label="家庭地址" label-width="100px" label-align="center">广东省深圳市坂田街道</g-list-group-item>
<g-list-group-item label="年龄" label-width="100px" label-align="center">18</g-list-group-item>
```

`GListGroup`与`GListGroupItem`组合使用：
```html
<g-list-group :cols="2" label-width="100px" label-align="center">
  <g-list-group-item label="姓名">张三</g-list-group-item>
  <g-list-group-item label="手机">13838384380</g-list-group-item>
  <g-list-group-item label="家庭地址">{{ addr }}</g-list-group-item>
  <g-list-group-item label="年龄">18</g-list-group-item>
</g-list-group>
```

## `GListGroup`
#### Props
- `cols` `{Number}` 显示的列数。默认为`1`
- `labelWidth` `{String}` 设置所有item标题宽度（需包含单位），支持单位尺寸、`auto`、`none`。`auto`自动计算宽度，`none`不做处理。默认为`auto`。
- `labelAlign` `{String}` 设置所有item标题对齐方式）。默认为`right`，可选值：`left`、`right`、`center`
- `sep` `{String}` 设置所有item标题与内容的分隔符。默认为`：`(中文冒号)
- `itemClass` `{String}` 给所有item添加class
- `itemStyle` `{Object}` 给所有item添加class

## `GListGroupItem`
#### Props
- `label` `{String}` 标题
- `labelWidth` `{String}` 标题宽度（需包含单位）
- `labelAlign` `{String}` 标题对齐方式（高于GListGroup的`labelAlign`的优先级）。默认为`right`，可选值：`left`、`right`、`center`
- `sep` `{String}` 标题与内容的分隔符（高于GListGroup的`sep`的优先级）。默认为`：`(中文冒号)