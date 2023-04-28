# 权限判断 控制内容显示
> 根据传入的code判断是否有权限，如果有权限则显示默认插槽的内容

## props
- `code` `{String | Array}` 对应菜单配置中的 **按钮 - 菜单标签**。为数组中，只要其中一个有权限则会显示

## 使用例子
```html
<g-auth code="companyInfo_details">
  如果有 companyInfo_details 的权限，则会显示，否则不显示
</g-auth>

<g-auth :code="['companyInfo_details', 'companyInfo_add]">
  companyInfo_details 与 companyInfo_add 中的任意一个有权限就会显示
</g-auth>
```
