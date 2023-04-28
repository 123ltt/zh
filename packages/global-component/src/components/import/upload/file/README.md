# 文件上传
```html
<template>
  <upload-file :files.sync="files" :limit="10" :uploading.sync="uploading" :http-request="httpRequest">
    <template v-slot="{info}">
      <div>文件不能超过 {{info.displaySize}}</div>
    </template>
  </upload-file>
</template>

<script>
import { UploadFile } from 'global-components'
import upload from '@/api/common/upload'

export default {
  components: { UploadFile },
  data() {
    return {
      files: [
          {
            url: 'https://static.oschina.net/uploads/cooperation/index_banner_one_eZDrk.jpg',
            name: 'index_banner_one_eZDrk.jpg',
          }
        ],
      uploading: false,
      httpRequest: upload
    }
  }
}
</script>
```

## props属性
- `selected` `{Array}` 已选择的文件列表。**必须使用`sync`修饰符**。
- `files` `{Array}` 上传成功后的文件列表。**必须使用`sync`修饰符**。
- `action` `{String}` 上传图片的地址。默认为空字符串。（注意：调用`@/api/common/upload`的方法则不需要传action，该方法内部已给默认值`/ops-resource/oss/upload/img`）
- **`httpRequest`** `{Function}` 必填。自定义上传请求方法。请使用`@/api/common/upload`方法
- `responseHandler {Function}` 对接口响应的数据进行修改并返回新的数据。返回的数据格式必须是`{ data: 'url' }`
- `readonly {Boolean}` 是否是只读（只能查看列表，不能上传和删除）。默认`false`
- `disabled {Boolean}` 与`readonly`效果一致。默认`false`
- `mimetype {String}` 允许上传的文件类型。如: `.jpg,.xml`
- `video {Boolean}` 是否是视频，为`true`时会忽略mimetype的设置。默认`false`
- `limit {Number}` 上传文件数量限制，0不限制。默认`0`
- `size {Number}` 单个文件字节数限制，0不限制，单位: b。默认`0`
- `multiple {Boolean}` 是否支持选择多个文件。默认`false`
- `buttonSize {String}` 上传按钮的大小。默认`small`
- `buttonText {String}` 上传按钮显示的文本。默认`点击上传`
- `download {Boolean}` 是否显示下载按钮。默认`true`
- `uploading {Boolean}` 当前是否有文件正在上传中， `true`有文件正在上传中，`false`没有文件在上传中。**注意`uploading`需要用`.sync`修饰符**。提交表单时可以通过此属性判断当前是否有文件正在上传中再决定是否可以提交表单
- `protocol {'http' | 'https'}` 强制使用 `http` 或 `https`。默认不处理
- `appName` `{String}` 系统名称，对应上传接口的 `fileType` 字段

## 默认slot作用域
- `size {Number}` 对应props中的`size`
- `displaySize {String}` 将`size`转换成含有单位的值

## 事件
- `on-success` 上传成功时触发
- `on-error` 上传失败时触发