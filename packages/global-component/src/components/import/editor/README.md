# 富文本框编辑器
> 替代avue-plugin-ueditor

## 简单使用示例
```html
<template>
  <editor v-model="content" />
</template>

<script>
import { Editor } from 'global-components'

export default {
  components: { Editor },
  data() {
    return {
      content: '<h1>hello world!</h1>'
    }
  }
}
</script>
```

## 配合ElForm组件使用（支持表单验证）
```html
<template>
  <el-form :model="form" :rules="rules" label-width="100px">
    <el-form-item label="内容" prop="textContent">
      <editor v-model="form.htmlContent"
              :text-content.sync="form.textContent"
              :http-request="httpRequest" />
    </el-form-item>
  </el-form>
</template>

<script>
import { Editor } from 'global-components'
import upload from '@/api/common/upload'

export default {
  components: { Editor },
  data() {
    const initContent = '<h1>hello world</h1>'
    return {
      httpRequest: upload,
      form: {
        textContent: initContent,
        htmlContent: initContent,
      },
      rules: {
        textContent: [{ required: true, trigger: 'blur' }]
      }
    }
  }
}
</script>
```

## Props
- `v-model` 接受的是HTML
- `textContent` `{string}` 文本内容，对应 el.textContent.trim()，可以通过该属性判断编辑器是否为空。**请勿直接修改该属性(不起作用)**
- `httpRequest` `{function}` 上传图片的方法。未传入则不会显示上传图片功能。（请传入项目中`@/api/common/upload`方法）
- `uploadUrl` `{string}` 上传图片的api地址。该参数最终会传递给httpRequest方法(`option.action`)。（如果httpRequest中有默认地址可不传）
- `height` `{number}` 设置编辑区域的高度。默认`300`
- `disabled` `{boolean}` 是否禁用编辑器（只读）。默认`false`。禁用时，工具栏只会显示全屏按钮且内容不可编辑。
- `pasteIgnoreImg` `{boolean}` 忽略粘贴内容中的图片。默认`true`
- `customConfig` `{object}` 自定义配置，[参考官方文档](http://www.wangeditor.com/doc/pages/01-%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8/) 。（注意部分自定义参数会被代码中的默认配置覆盖）
- `imageProtocol {'http' | 'https' | '//'}` 强制使用 `http` 或 `https`。默认不处理。（注：`//` 表示图片跟随当前页面的协议，即同时支持`http`和`https`）

## 事件
- `focus` 编辑器聚焦时触发
- `blur` 编辑器失去焦点时触发