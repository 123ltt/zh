# 文本过长时根据最大行数限制裁剪
## props
- `content` `{String}` 必传，文本内容，同时用作于tooltip展示内容
- `line` `{Number}` 数字必须是正整数，超出{{line}} 行省略号代替
- `tooltipMaxWidth` `{String}` tooltip展示的最大宽度
- 其他的属性和tooltip组件一样

```html
<tmeplate>
  <text-ellipsis-tip :line="2" content="这里是文本内容，如果长度超过2行，则会自动裁剪并添加省略号，同时会启用tooltip" />
</tmeplate>
```