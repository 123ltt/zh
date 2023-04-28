# 文本过长时根据设置的行数进行裁剪

```html
<tmeplate>
  <g-text-ellipsis>
这里是文本内容，如果长度超过10个字符，则会自动裁剪并添加省略号，同时会启用tooltip
  </g-text-ellipsis>
</tmeplate>
```

## Props
- `tag` `{String}` 自定义标签。默认`span`
- `lines` `{Number | String}` 显示的行数，超过设置的行数则会自动裁剪。默认`1`
- `content` `{String}` 显示的内容。也可以使用默认插槽。属性的优先级高于插槽
- `placement` `{String}` tooltip显示的位置。默认`top`，可选值：`top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end`
- `theme` `{String}` 显示的主题。默认`dark`。可选值`dark | light`
- `tooltipMaxLength` `{Number}` tooltip显示的内容最大的长度，默认为`1000`，为`0`不限制
- `popperClass` `{String}` 给气泡添加额外的class