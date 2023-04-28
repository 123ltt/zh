# 文本 与 输入框 两种模式切换

## 使用例子
```html
<template>
  <div>
    <g-content v-model="content" :editable="editable" maxlength="10" />
    <g-content v-model="content" :editable="editable" type="textarea" :row="[2,4]" placeholder="abc" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      editable: false
    }
  }
}
</script>
```

## Props
- `editable` `{boolean}` 是否启用编辑功能。默认`false`
- `type` `{string}` 启用编辑时使用的输入框类型。可选值`input`、`textarea`，默认`input`
- `rows` `{[number, number]}` [最小行数，最大行数]。input类型该参数无效。为textarea类型时，文本框的初始行数为`rows[0]`，最大行数为`rows[1]`
- `ellipsis` `{Boolean}` 文本过长是否显示省略号。默认`true`
- `ellipsisLines` `{Number}` 第几行开始显示省略号（对应GTextEllipsis组件的`lines`属性）。默认`1`。注意只有`ellipsis`为`true`时才会生效