# OSS水印配置
> 自定义oss图片的水印

## Props
- `images` `{string[]}` 在水印配置界面需要预览的图片地址集合
- `httpRequest` `{function}` 必填。自定义上传请求方法（上传LOGO水印）。请使用`@/api/common/upload`中的方法
- `logoAction` `{string}` 选填。上传LOGO水印的地址。（注意：调用`@/api/common/upload`的方法则不需要传logoAction，该方法内部已给默认值`/ops-resource/oss/upload/img`）
- `textConfig` `{object}` 文字水印配置项默认值。[查看配置可选值](#user-content-textconfig)
- `logoConfig` `{object}` LOGO水印配置项默认值。[查看配置可选值](#user-content-logoconfig)

## 事件
- `ok` 点击确定触发。传入的参数为对象，格式大致为`{query: '?x-oss-process=image/...', useMode: 1}`。通过该事件返回的参数与图片的地址进行拼接即可

## Slot
- `button` 在底部按钮后面追加插槽。如弹窗时可用来添加取消或关闭按钮

### textConfig
- `content` `{string}` 文字内容。默认空字符串
- `fontFamily` `{string}` 默认文字字体。可选值请查看[源码](src/components/import/oss-watermark/textMode.vue)
- `fontSize` `{string | number}` 文字大小。默认`30`
- `fill` `{boolean}` 是否文字铺满。默认`false`
- `color` `{string}` 默认文字颜色。默认`#000000`。值必须为hex格式
- `opacity` `{number}` 文字透明度。默认`100`
- `position` `{string}` 文字所在位置。默认`se`。可选值请查看[源码](src/components/import/oss-watermark/positionSelect.vue)
- `useMode` `{number}` 水印引用于首图或全部图片。默认`0`。`0`首图，`1`全部图片

### logoConfig
- `logo` `{ {url:string;name:string}[] }` url必须为oss的地址。默认`[]`
- `percent` `{number}` 水印图占主图的百分比。默认`20`。取值1-100
- `opacity` `{number}` 水印图透明度。默认`80`。取值0-100
- `position` `{string}` 水印图所在位置。默认`se`。可选值请查看[源码](src/components/import/oss-watermark/positionSelect.vue)
- `useMode` `{number}` 水印引用于首图或全部图片。默认`0`。`0`首图，`1`全部图片

## 使用示例
```html
<template>
  <div>
    <OssWatermark :images="images"
                  :http-request="httpRequest"
                  :text-config="textConfig"
                  @ok="ok" />
    <el-button @click="addImages">添加图片</el-button>
  </div>
</template>

<script>
import {OssWatermark} from 'global-components'
import httpRequest from '@/api/common/upload'

const urls = [
  'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/00ea0cfda2659fdb947b4b93d5bc640e.png',
  'https://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201013/048e205f616df65cf3dc1d85618f5d14.png'
]

export default {
  components: { OssWatermark },
  data() {
    return {
      images: [],
      httpRequest,
      textConfig: {
        content: '我的店铺名称'
      }
    }
  },
  methods: {
    ok(val) {
      const images = urls.map(el => el + val.query)
    },
    addImages() {
      this.images = urls
    }
  }
}
</script>
```
