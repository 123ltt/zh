# 彩色图标组件
>  对应iconfont中 `saber colors` 项目。
> 字体通过js方式引入 `<script src="//at.alicdn.com/t/font_2648400_at5u4jo7rfu.js"></script>` ，位于 `public/index.html` 文件中

## 使用示例
> 例如：iconfont中图标名称为 `icon-app` ，组件中的icon则只需要设置为 `app` 即可
```html
<g-color-icon icon="app" />
```

## Props
- `icon` `{String}` 图标名称
- `width` `{String}` 宽度。默认 `1em`
- `height` `{String}` 高度。默认 `1em`
- `verticalAlign` `{String}` 垂直方向调整。默认 `-0.15em`
