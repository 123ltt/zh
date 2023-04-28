# 缩略图 + 鼠标经过预览大图

> 组件支持自动识别图片链接是否属于oss图片，如果是则使用oss的参数生成小图，如果不是则在图片地址后面追加`_{width}x{height}.jpg`

## props
- `url` `{String}` 图片地址
- `width` `{Number}` 图片宽度。默认`50`
- `height` `{Number}` 图片高度。默认`50`
- `isPreview` `{Boolean}` 是否预览。默认`true`
- `previewWidth` `{Number}` 预览宽度。默认`400`
- `previewHeight` `{Number}` 预览高度。默认`400`
- `fit` `{String}` 缩略图适应容器的方式。可选值有：`cover`, `contain`, `fill`。默认`cover`

## 使用
```html
<template>
  <g-thumb url="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" />
</template>
```