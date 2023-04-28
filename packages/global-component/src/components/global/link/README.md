# 替代a标签

## 使用示例
```html
<template>
  <g-link href="https://baidu.com">百度</g-link>
</template>
```

## Props
- `tag` `{String}` 自定义标签。默认`a`标签
- `color` `{String}` 自定义颜色。可选值：`primary`, `success`, `danger`, `warning`, `info`, `muted`。详见 [bootstrap color](https://getbootstrap.com/docs/5.0/utilities/colors/)
- `href` `{string}` a标签跳转的链接。只在tag为a标签时生效。
- `blank` `{boolean}` tag为a标签且设置了href时生效。是否在新页面打开。默认`true`
