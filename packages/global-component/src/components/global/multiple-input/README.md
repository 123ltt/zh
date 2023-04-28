# 单行文本域支持换行
> 适用场景：搜索条件中的输入框支持换行输入多个值进行搜索

## `props`
- `placeholder` `{String}` 占位符。默认`请输入`
- `maxRows` `{Number}` 最大行数。默认`3`
- `returnType` `{String}` 返回给v-model的值类型，只支持 `array` 和 `string`。默认`array`
- `regExp` `{RegExp}` 分割字符串的正则表达式。默认`/\s+/`(以空白字符进行分割)

## 使用示例
```html
<template>
  <g-multiple-input v-model="title" return-type="string" />
</template>

<script>
export default {
  data() {
    return {
      title: ''
    }
  }
}
</script>
```
