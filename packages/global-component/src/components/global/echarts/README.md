# 对ECharts v5的简单封装
> 按需引入。目前只引入了部分的组件，根据后期的需要再引入其他的组件

## props
- `width` `{string}` 设置画布的宽度。默认`100%`
- `height` `{string}` 设置画布高度。默认`360px`
- `option` `{object}` 图表的数据配置项，对应传入`setOption`的参数
- `tooltip` `{string}` 对应echarts配置项的tooltip.trigger的参数。可选值：`item`, `axis`, `none`，默认`axis`。(注意：`option`中传入tooltip对象会覆盖该配置)
- `title` `{string}` 图表的标题，对应配置项的title

## 使用demo
请参考 http://gitlab.zehui.local/front-end/zh-pss/blob/dev/src/views/_index.vue