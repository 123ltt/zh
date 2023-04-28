# 图片上传
支持功能：
- 主图设置
- 显示图片名称
- 长传进度条
- 预览大图、查看原图
- 删除图片
- 拖拽排序

## 使用示例
```html
<template>
  <upload-image :images.sync="images" :uploading.sync="uploading" :http-request="upload" />
</template>

<script>
import { UploadImage } from 'global-components'
import upload from '@/api/common/upload'

export default {
  components: { UploadImage },
  data() {
    return {
      images: [
        {
          url: 'https://static.oschina.net/uploads/cooperation/index_banner_one_eZDrk.jpg',
          name: 'index_banner_one_eZDrk.jpg',
          primary: true
        },
        {
          url: 'https://static.oschina.net/uploads/cover/4880774_lvDts_bi.png',
          name: '4880774_lvDts_bi.jpg',
          primary: false
        }
      ],
      uploading: false,
      httpRequest: upload
    }
  }
}
</script>
```

## props
- `selected` `{Array}` 已选择的图片列表。**必须使用`sync`修饰符**。
- `images` `{Array}` 上传成功的图片列表。**必须使用`sync`修饰符**。回显传入的数据请参考demo。（注意：`UploadImage`组件mounted之后不能再去更新`images`的值，只有UploadImage组件内部才能更新`images`的值）
- `action` `{String}` 上传图片的地址。默认为空字符串。（注意：调用`@/api/common/upload`的方法则不需要传action，该方法内部已给默认值`/ops-resource/oss/upload/img`）
- **`httpRequest`** `{Function}` 必填。自定义上传请求方法。请使用`@/api/common/upload`方法
- `responseHandler {Function}` 对接口响应的数据进行修改并返回新的数据。返回的数据格式必须是`{ data: 'url' }`
- `size` `{Number}` 图片的大小。默认为`0`不限制
- `dimension` `{[Number, Number]}` 限制图片的尺寸 `[宽, 高]`。默认不限制
- **`uploading`** `{Boolean}` 当前是否有图片正在上传中。**必须使用`sync`修饰符**。在提交表单时可通过该属性判断当前表单是否可提交
- `limit` `{Number}` 最大允许上传个数。默认不限制
- `multiple` `{Boolean}` 是否支持多选文件。默认单个文件选择
- `disabled` `{Boolean}` 是否禁用（即是否只读）
- `primary` `{Boolean}` 是否需要主图功能。默认`true`
- `dragable` `{Boolean}` 是否启用拖拽排序。默认`false`
- `isRemove` `{Boolean}` 是否显示删除按钮。默认`true`
- `isPrimary` `{Boolean}` 是否显示设置主图按钮。默认`true`
- `isRaw` `{Boolean}` 是否显示查看原图按钮。默认`true`
- `isFilename` `{Boolean}` 是否显示图片名。默认`true`
- `isPreview` `{Boolean}` 是否启用预览图。默认`true`
- `avatar` `{boolean}` 是否为头像模式。默认`false`。（头像模式为只能上传一张图片，选择图片后不会显示上传按钮）
- `canPrimary` `{function}` 是否可以自动设置主图（非手动点击设置主图触发），返回true表示可以。默认返回`true`
- `protocol {'http' | 'https'}` 强制使用 `http` 或 `https`。默认不处理
- `appName` `{String}` 系统名称，对应上传接口的 `fileType` 字段

## 事件
- `primary(ref)` 点击设置主图按钮触发。`ref`为所点击按钮所在的UploadImage组件的this
- `remove(removed, fileList)` 点击删除按钮触发。`removed`所删除的图片数据，`fileList`当前UploadImage组件的图片列表数据
- `on-success` 上传成功时触发
- `on-error` 上传失败时触发

## 方法
- `clearPrimary` 清空当前组件的主图设置
