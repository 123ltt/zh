# 区分状态组件
> 适用场景：更加明显的区分数据的状态
## `props`
- `status` `{String}` 状态的颜色。可选值：'gray', 'green', 'red', 'blue', 'yellow'，含义如下
  `gray`(无效),`green`(有效),`red`(审核失败),`blue`(审核中),`yellow`(无效待审核)
- `color` `{String}` 自定义状态的颜色。优先级比status高。
- `name` `{String}` 状态的文本

## 使用示例
```html
<template>
  <g-status status="green" :name="name" />
  <g-status color="red" >无效</g-status>
</template>

<script>
export default {
  data() {
    return {
      name: '有效'
    }
  }
}
</script>
```
