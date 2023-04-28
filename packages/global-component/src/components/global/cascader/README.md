# 级联（表单禁用支持查看）
> 使用场景：表单禁用后级联可点击查看级联内容（级联只会显示已勾选的项）

> **注意：不适用懒加载场景**

## 使用例子
请查看 [src/views/cascader.vue](src/views/cascader.vue)。使用基本与`ElCascader组件`一致

## Props
- `isLeaf` `{boolean}` 传给value(即v-model)的值是否全是叶子节点。默认`false`
- [更多属性请参考ElCascader组件](https://element.eleme.cn/#/zh-CN/component/cascader#cascader-attributes)